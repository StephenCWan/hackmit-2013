$(window).resize(function(){	
	$("#canvas").width('100%');
	$("#canvas").height('90%');
	$("#canvas").attr('width',$("#canvas").width());
	$("#canvas").attr('height',$("#canvas").height());
	w = $("#canvas").width();
	h = $("#canvas").height();
});

var f_game = new Firebase("https://hackmit-2013.firebaseio.com/");
var w = 0, h = 0;
$(document).ready(function(){
	//Canvas stuff
	var canvas = $("#canvas")[0];
	var ctx = canvas.getContext("2d");

	$(window).resize();

	var round_length = 2; // in minutes
	var flag_expiration = 5; // in seconds
	var tick_freq = 50; // in millis
	
	function Team(x, y){
		this.score = 0;
		this.input_dirs = []; // directions in radians from +x axis, updated from FireBase
		this.radius = w/90;
		this.x = x;
		this.y = y;
		this.updatePos = function(){
			if(this.input_dirs.length <= 0)
				return;
			var x_sum = 0;
			var y_sum = 0;
			// x and y unit vectors
			for(var i=0;i<this.input_dirs.length;i++){
				x_sum += Math.cos(this.input_dirs[i]);
				y_sum += Math.sin(this.input_dirs[i]);
			}
			this.x += 2*this.radius/3*x_sum/this.input_dirs.length;
			this.y -= 2*this.radius/3*y_sum/this.input_dirs.length;
			if(this.x+this.radius >= w) this.x = w-this.radius-1;
			else if (this.x-this.radius <= 0) this.x = this.radius+1;
			if(this.y+this.radius >= h) this.y = h-this.radius-1;
			else if (this.y-this.radius <= 0) this.y = this.radius+1;

			this.input_dirs.length = 0;
		};

	};

	function Flag(x, y, value){
		Flag.prototype.flag_vals = [10, 20, 50];
		this.x = x;
		this.y = y;
		this.value = value;
		switch(value){
			case 10: this.radius = w/168.75; break;
			case 20: this.radius = w/122.72727272727273; break;
			case 50: this.radius = w/96.42857142857143; break;
		}
		this.fadeSteps = (flag_expiration+(0|(Math.random())*3)-1)*1000/tick_freq;
	}

	function collision(A, B){
		var x_dist = Math.abs(A.x - B.x);
		var y_dist = Math.abs(A.y - B.y);
		var euclid_dist = Math.sqrt(x_dist*x_dist + y_dist*y_dist);
		if(euclid_dist <= A.radius+B.radius){
			return euclid_dist;
		}
		return false;
	}

	var red;
	var blue;
	var flags = [];
	var game_loop;
	var game_steps = 0;

	function init()
	{	
		console.log('init');
		red = new Team(w/4,h/2);
		blue = new Team(3*w/4, h/2);
		flags.length = 0;
		game_steps = 0;

		// initial game state with flags in obvious places
		flags.push(new Flag(w/3, h/4, 10));
		flags.push(new Flag(2*w/3, 3*h/4, 10));


		if(typeof game_loop != "undefined") clearInterval(game_loop);
		game_loop = setInterval(tick, tick_freq);
	}
	//
	init();
	//
	function tick()
	{
		f_game.child('team2').once('value', function(f) {
			f.forEach(function(data) {
				console.log(data.val().value);
				red.input_dirs.push(parseFloat(data.val().value));
			});
		});
		f_game.child('team1').once('value', function(f) {
			f.forEach(function(data) {
				console.log(data.val().value);
				blue.input_dirs.push(parseFloat(data.val().value));
			});
		});
		// invalidate canvas
		ctx.fillStyle = "white";
		ctx.fillRect(0, 0, w, h);
		ctx.strokeStyle = "black";
		ctx.strokeRect(0, 0, w, h);

		// check end condition
		if(game_steps++ > round_length*60*1000/tick_freq){
			init();
			return;
		}
		
		// update positions
		red.updatePos();
		blue.updatePos();

		// check collisions
		for(var i=0;i<flags.length;i++){
			flags[i].fadeSteps--;
			if(flags[i].fadeSteps < 0){
				// check flag expiration
				flags.splice(i--,1)[0] = null;
				continue;
			}
			var col_red = collision(flags[i], red);
			var col_blue = collision(flags[i], blue);
			// both teams are collide
			if(col_red && col_blue){
				// smaller distance wins
				if(col_red < col_blue){
					red.score += flags[i].value;
				}
				else{
					blue.score += flags[i].value;
				}
				flags.splice(i--,1)[0] = null;
			}
			else if(col_red){
				red.score += flags[i].value;
				flags.splice(i--,1)[0] = null;
			}
			else if(col_blue){
				blue.score += flags[i].value;
				flags.splice(i--,1)[0] = null;
			}
		}

		// spawn new flags
		var difficulty = (0|(game_steps*tick_freq / (round_length*1000*60/4)));
		while(flags.length < 2 || flags.length < 2+difficulty){
			var gen = new Flag( 0|(Math.random()*(w-20))+10, 0|(Math.random()*(h-20))+10, Flag.prototype.flag_vals[0|Math.random()*3] );
			if( !(collision(gen,red) || collision(gen,blue)) ){
				var b = false;
				for(var i=0;i<flags.length;i++){
					if(collision(flags[i],gen)){
						b = true;
						break;
					}
				}
				if(b) continue;
				flags.push(gen);
			}

		}

		// draw everything

		// draw red
		ctx.beginPath();
		ctx.arc(red.x, red.y, red.radius, 0, 2*Math.PI);
		ctx.fillStyle = 'red';
		ctx.fill();
		ctx.lineWidth = 3;
		ctx.strokeStyle = '#330000';
		ctx.stroke();
		// draw blue
		ctx.beginPath();
		ctx.arc(blue.x, blue.y, blue.radius, 0, 2*Math.PI);
		ctx.fillStyle = 'blue';
		ctx.fill();
		ctx.lineWidth = 3;
		ctx.strokeStyle = '#000033';
		ctx.stroke();

		for(var i=0;i<flags.length;i++){
			// draw flags
			ctx.beginPath();
			ctx.arc(flags[i].x, flags[i].y, flags[i].radius, 0, 2*Math.PI);
			var fade = (flags[i].fadeSteps/((flag_expiration)*1000/tick_freq));
			ctx.fillStyle = 'rgba(255,255,0,'+fade+')';
			ctx.fill();
			ctx.lineWidth = 3;
			ctx.strokeStyle = 'rgba(51,51,0,'+fade+')';
			ctx.stroke();
		}

		ctx.font="30px Arial";
		ctx.fillStyle = 'red';
		ctx.fillText(""+red.score,50,h-30);
		ctx.fillStyle = 'blue';
		ctx.fillText(""+blue.score,w-150,h-30);

		var timeremaining = (round_length*60*1000 - game_steps*tick_freq)/1000; // in sec
		ctx.fillStyle = 'black';
		ctx.fillText(((timeremaining/60)|0)+":"+((timeremaining%60)).toFixed(2),w/2-100,h-30);

	}

	// for debug
	var TAU = 2*Math.PI;
	$(document).keydown(function(e){
		var key = e.which;
		if(key == "37") red.input_dirs.push(TAU/2);
		else if(key == "38") red.input_dirs.push(3*TAU/4);
		else if(key == "39") red.input_dirs.push(0);
		else if(key == "40") red.input_dirs.push(TAU/4);

		else if(key == "68") blue.input_dirs.push(0);
		else if(key == "83") blue.input_dirs.push(TAU/4);
		else if(key == "65") blue.input_dirs.push(TAU/2);
		else if(key == "87") blue.input_dirs.push(3*TAU/4);
	});
		
});