(function(){

var stage = new Kinetic.Stage({
	container: 'container',
	width: 450,
	height: 450,
});

var layer = new Kinetic.Layer();

var circleGroup = new Kinetic.Group({
	x: stage.getWidth()/ 4,
	y: stage.getHeight()/4,
	draggable: true,
	dragBoundFunc: function(pos) {
	var angle = caculateAngle($('#pos_left').text(),$('#pos_top').text());
	var x = stage.getWidth() /4;
	var y = stage.getWidth()/4;
	var radius = 150;
	var scale = radius / Math.sqrt(Math.pow(pos.x - x, 2) + Math.pow(pos.y - y, 2));
	if(scale < 1)
	  return {
	    y: Math.round((pos.y - y) * scale + y),
	    x: Math.round((pos.x - x) * scale + x)
	  };
	else
	  return pos;
	}
});

var control = new Kinetic.Circle({
	x: stage.getWidth()/4,
	y: stage.getHeight()/4,
	radius: 50,
	fill: 'black',
	stroke: 'black',
	strokeWidth: 4,
});

var circle = new Kinetic.Circle({
	x:stage.getWidth()/2,
	y:stage.getHeight()/2,
	radius:150,
	stroke: 'black',
	strokeWidth:1,
});

circleGroup.add(control);
layer.add(circle);
layer.add(circleGroup);
stage.add(layer);

var divPos = {};
$(document).mousemove(function(e){
    var container = $("#container");
    divPos = {
        left: e.pageX - container.offset().left,
        top: e.pageY - container.offset().top
    };
    $('#pos_left').text(divPos.left);
    $('#pos_top').text(divPos.top);
});

var caculateAngle = function(left,top){
	var x = left-225;
	var y = 225-top;
	var angle = Math.atan2(y,x);
	if (angle<0) return 2*Math.PI-Math.abs(angle);
	else return Math.atan2(y,x);
}

})();