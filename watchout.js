// start slingin' some d3 here.
var gameStats = {
 score: 0,
 bestScore: 0
}

//SCORES

var updateScore = function () {
  d3.select('.current').text(gameStats.score.toString());
}

// GAME OPTIONS
var height = 400;
var width = 750;
var nEnemies = 25;

// AXIS
var axes = {
  x: d3.scale.linear().domain([0, 100]).range([0, width]),
  y: d3.scale.linear().domain([0, 100]).range([0, height])
};

// SVG APPEND
var gameBoard = d3.select('.container').append('svg')
  .attr('width', width)
  .attr('height', height)
  .classed('gameboard', true);

// ENEMY DATA
var createEnemies = function(n) {
  var enemies = [];
  for (var i = 0; i < n; i++) {
    enemies.push({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100
    });
  }
  return enemies;
};

// ADD PLAYER



// ADD ENEMIES
var render = function(enemyData) {
  var enemies = gameBoard.selectAll('circle.enemy').data(enemyData, function(d) {
    return d.id;
  });

  enemies.enter()
    .append('svg:circle')
    .attr('class', 'enemy')
    .attr('cx', function(enemy) {
      return axes.x(enemy.x);
    })
    .attr('cy', function(enemy) {
      return axes.y(enemy.y);
    })
    .attr('r', 10)
    .attr('fill', 'black')
    .attr('stroke', 'black');

  enemies.exit().remove();

// TRANSITIONS
  tween = function(endData) {
    var endPos, enemy, startPos;
    enemy = d3.select(this);
    startPos = {
      x: parseFloat(enemy.attr('cx')),
      y: parseFloat(enemy.attr('cy'))
    };
    endPos = {
      x: axes.x(endData.x),
      y: axes.y(endData.y)
    };
    return function(t) {
      var enemyNextPos;
      enemyNextPos = {
        x: startPos.x + (endPos.x - startPos.x) * t,
        y: startPos.y + (endPos.y - startPos.y) * t
      };
      return enemy.attr('cx', enemyNextPos.x).attr('cy', enemyNextPos.y);
    };
  };
  return enemies.transition().duration(100).attr('r', 10).transition().duration(2500).tween('custom', tween);
};

// EXECUTE
play = function() {
  var turn;
  turn = function() {
    var newEnemyPositions = createEnemies(nEnemies);
    return render(newEnemyPositions);
  };

  var increaseScore = function () {
    gameStats.score += 1;
    return updateScore();
  };

  turn();
  setInterval(turn, 2000);
  return setInterval(increaseScore, 50)
};

play();


