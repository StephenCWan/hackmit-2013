(function(){

var stage = new Kinetic.Stage({
	container: 'container',
	width: 400,
	height: 400,
});

var layer = new Kinetic.Layer();

var circleGroup = new Kinetic.Group({
	x: stage.getWidth()/ 4,
	y: stage.getHeight()/4,
	draggable: true,
	dragBoundFunc: function(pos) {
	var angle = caculateAngle($('#pos_left').text(),$('#pos_top').text());
	//do something with the angle here
	var x = stage.getWidth() /4;
	var y = stage.getWidth()/4;
	var radius = 100;
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
	radius: 20,
	fill: 'black',
	stroke: 'black',
	strokeWidth: 4,
});

var circle = new Kinetic.Circle({
	x:stage.getWidth()/4,
	y:stage.getHieght()/4,
	radius:100,
	stroke: 'black',
	strokeWidth:1,
});

circleGroup.add(control);
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
	var x = left-200;
	var y = 200-top;
	return Math.atan2(x,y);
}

})();