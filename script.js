var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

//constants
const BRICK_WIDTH = 60;
const BRICK_HEIGHT = 20;
const BRICK_X = 10;
const BRICK_Y = 120;
const BRICK_COLOR = "#53795C";
const PLAYER_WIDTH = 60;
const PLAYER_HEIGHT = 20;
const PLAYER_COLOR = "#698377";
const PLAYER1_START_X = 430;
const PLAYER1_START_Y = 400;
const PLAYER2_START_X = 430;
const PLAYER2_START_Y = 30;
const BALL_RADIUS = 10;
const BALL_CENTERX = 460;
const BALL_CENTERY = 380;
const BALL_COLOR = "#22352B"



var gameScore;
var gameOver;
var gameBrick;
var gameBrickList = [];
var player1;
var player2;
var ball;


startGame();

function startGame(){
    player1 = new Player(PLAYER_WIDTH, PLAYER_HEIGHT, PLAYER_COLOR, PLAYER1_START_X, PLAYER1_START_Y);
    player2 = new Player(PLAYER_WIDTH, PLAYER_HEIGHT, PLAYER_COLOR, PLAYER2_START_X, PLAYER2_START_Y);
    ball = new Ball(BALL_RADIUS, BALL_CENTERX, BALL_CENTERY, BALL_COLOR);

    gameOver = false;
    gameScore = 0;
    var x = BRICK_X;
    var y = BRICK_Y;
    for(let i = 0; i != 5; i++){
        for(let j = 0; j!=14; j++){
            gameBrick = new Brick(BRICK_WIDTH, BRICK_HEIGHT, BRICK_COLOR, x, y);
            gameBrickList.push(gameBrick);
            x+= 70;
        }
        y+=30;
        x = 10;
        render();
    }
}

function Player(width, height, color, x, y){
    this.w = width;
    this.h = height;
    this.c = color;
    this.x = x;
    this.y = y;

}

function Ball(radius, centerx, centery, color){
    this.r = radius;
    this.x = centerx;
    this.y = centery;
    this.c = color;

}

function Brick(width, height, color, x, y){
    this.w = width;
    this.h = height;
    this.c = color;
    this.x = x;
    this.y = y;
}

function drawBrick(brick){
    ctx.fillStyle = brick.c;
    ctx.fillRect(brick.x, brick.y, brick.w, brick.h);
}

function drawPlayer(player){
    ctx.fillStyle = player.c;
    ctx.fillRect(player.x, player.y, player.w, player.h);
}

function drawBall(ball){
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.r, 0, 2 * Math.PI);
    ctx.fillStyle = ball.c;
    ctx.fill();
}

function render(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawPlayer(player1);
    drawPlayer(player2);
    drawBall(ball);
    for(const brick of gameBrickList){
        drawBrick(brick);
    }
}


document.body.onkeydown = function( e ){
    console.log("keypressed code: ", e.keyCode);
    var keys = {
        37: "left",
        39: "right",
        38: "up",
        40: "down",
        32: "space",
        65: "a",
        68: "d"

    }
    var direction = keys[e.keyCode];
    movePlayer(direction);
}

function movePlayer(dir){
    if(dir == "left"){
        player1.x -= 10;
    }
    else if(dir == "right"){
        player1.x += 10;
    }
    else if(dir == "a"){
        player2.x -= 10;
    }
    else if(dir == "d"){
        player2.x += 10;
    }
    render();

}