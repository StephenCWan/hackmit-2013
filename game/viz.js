
var sizeC = 40;
var fiveD = 2.5 * Math.PI / 180;

setInterval(function() {
	var c = document.getElementById("team1");
	var ctx = c.getContext("2d");
	ctx.fillStyle = 'white';
	ctx.fillRect(0, 0, 300, 300);
	ctx.fillStyle = 'black';

	var angles = b_copy;
	if (!angles)
		return;
	var sizeC = 40;
	var fiveD = 2.5 * Math.PI / 180;

	ctx.beginPath();
	ctx.arc(100, 75, 50, 0, 2*Math.PI);
	ctx.lineWidth = 1;
	ctx.stroke();

	var dist = { };
	angles.forEach(function(data) {
		var norm = Math.floor(data / Math.PI * 180 / 10);
		dist[norm] = ((isNaN(dist[norm]) ? 0 : dist[norm])) + (1 / angles.length * sizeC);
		debugger;
	});

	for (var o in dist) {
		if (dist.hasOwnProperty(o)) {
			ctx.beginPath();
			ctx.arc(100, 75, dist[o]* sizeC /1.5, o * Math.PI / 180 * 10 - fiveD, (parseInt(o) + 1) * Math.PI / 180 * 10 - fiveD);
			ctx.lineWidth = 50;
			ctx.stroke();
		}
	}
}, 50);

setInterval(function() {
	var c = document.getElementById("team2");
	var ctx = c.getContext("2d");
	ctx.fillStyle = 'white';
	ctx.fillRect(0, 0, 300, 300);
	ctx.fillStyle = 'black';

	var angles = r_copy;
	if (!angles)
		return;

	ctx.beginPath();
	ctx.arc(100, 75, 50, 0, 2*Math.PI);
	ctx.lineWidth = 1;
	ctx.stroke();

	var dist = { };
	angles.forEach(function(data) {
		var norm = Math.floor(data / Math.PI * 180 / 10);
		dist[norm] = ((isNaN(dist[norm]) ? 0 : dist[norm])) + (1 / angles.length * sizeC);
		debugger;
	});

	for (var o in dist) {
		if (dist.hasOwnProperty(o)) {
			ctx.beginPath();
			ctx.arc(100, 75, dist[o]* sizeC /1.5, o * Math.PI / 180 * 10 - fiveD, (parseInt(o) + 1) * Math.PI / 180 * 10 - fiveD);
			ctx.lineWidth = 50;
			ctx.stroke();
		}
	}
}, 200);