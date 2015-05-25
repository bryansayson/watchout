// start slingin' some d3 here
var highScore = 0;
var userScore = 0;
var collisions = 0;
var updateInterval = 2000;
var width = 800;
var height = 500;
var numOfEnemies = 25;
var enemySize = 10;
var playerSize = 10;

var enemies = [];

var svg = d3.select('.container')
	.append('svg')
	.attr('width', width)
	.attr('height', height)
      .on('mousemove', function () {
        d3.selectAll(".enemy").data(enemies, function(d, i) {return i;})
        .each(function(d) {
        collisionCheck(d3.select(this), d);
        });
  })
	
var Enemy = function ( cx, cy ) {
	this.cx = cx || Math.random()*width;
	this.cy = cy || Math.random()*height;
	this.overlap = false;
}

Enemy.prototype.setOverlap = function(value) {
  if (!this.overlap && value) {
    collisions++;
    d3.select(".collisions").text(collisions);
    resetScore();
  }
  this.overlap = value;
};

Enemy.prototype.setPosition = function(x, y){
  this.cx = x || Math.random()*width;
  this.cy = y || Math.random()*height;
};

var makeEnemies = function ( ) {
	for ( var i = 0; i < numOfEnemies; i++ ) {
		enemies.push(new Enemy());
	}

svg.selectAll('circle')
	.data(enemies, function(d, i) {return i;})
	.enter().append('circle')
	.attr('cx', function(d) {return d.cx;})
	.attr('cy', function(d) {return d.cy;})
	.attr('r', enemySize)
	.attr('fill', 'white')
    	.attr('stroke', 'white')
	.classed("enemy", true);
}

makeEnemies();

var update = function(){
  for (var i = 0; i < enemies.length; i++) {
    enemies[i].setPosition();
  }
  var circles = d3.selectAll(".enemy");
  circles.data(enemies, function(d, i) {return i;})
        .transition()
          .duration(updateInterval/2)
          .tween("custom", collisionTween);
};

// add player

var drag = d3.behavior.drag()
             .on('dragstart', function() { circle.style('fill', 'blue'); })
             .on('drag', function() { circle.attr('cx', d3.event.x)
             .attr('cy', d3.event.y); })
             .on('dragend', function() { circle.style('fill', 'red'); });

var circle = svg.selectAll('.circle')  
                .data([{ x: (width / 2), y: (height / 2), r: playerSize }])
                .enter()
                .append('svg:circle')
                .classed('player', true)
                .attr('cx', function(d) { return d.x; })
                .attr('cy', function(d) { return d.y; })
                .attr('r', function(d) { return d.r; })
                .call(drag)
                .style('fill', 'blue');

var collisionTween = function(d) {
  // debugger;
  var enemy = d3.select(this);
  var xStart = parseFloat(enemy.attr('cx'));
  var yStart = parseFloat(enemy.attr('cy'));
  var xEnd = d.cx;
  var yEnd = d.cy;
  return function(t){
    var xNext = xStart + (xEnd-xStart)*t;
    var yNext = yStart + (yEnd-yStart)*t;
    // console.log("At time: ", t, "  New next: ", xNext, ", ", yNext);
    enemy.attr("cx", xNext);
    enemy.attr("cy", yNext);
    collisionCheck(enemy, d);
  };
};

//collisions!!
var collisionCheck = function(enemy, d) {
  var player = d3.select(".player");
  var dx = player.attr("cx") - enemy.attr("cx");
  var dy = player.attr("cy") - enemy.attr("cy");
  var distance = Math.sqrt(dx*dx + dy*dy);
  if (distance < 2*playerSize) {
    d.setOverlap (true);
  } else {
    d.setOverlap(false);
  }
};

var resetScore = function(){
  if (userScore > highScore) {
    highScore = userScore;
    d3.select(".high").text(highScore);
  }
  userScore = 0;
  d3.select(".current").text(userScore);
};

//setInterval for update
setInterval(update, updateInterval);
//setInterval(checkCollisions, 100);

//setInterval for incrementing the score
setInterval(function(){
  userScore++;
  d3.select(".current").text(userScore);
}, updateInterval/50);










