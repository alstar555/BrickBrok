var canvas = document.getElementById("xcanvas");
var ctx = canvas.getContext("2d");

//constants
const BRICK_WIDTH = 60;
const BRICK_HEIGHT = 20;
const BRICK_COLOR = "#53795C";
const PLAYER_WIDTH = 60;
const PLAYER_HEIGHT = 20;
const PLAYER_COLOR = "#698377";
const PLAYER_START_X = 430;
const PLAYER_START_Y = 400;
BALL_RADIUS = 10;
BALL_CENTERX = 460;
BALL_CENTERY = 380;
BALL_COLOR = "#22352B"



var gameScore;
var gameOver;
var gameBrick;
var gameBrickList = [];
var player;
var ball;

object.addEventListener("keydown", movePlayer); 

startGame();

function startGame(){
    player = new Player(PLAYER_WIDTH, PLAYER_HEIGHT, PLAYER_COLOR, PLAYER_START_X, PLAYER_START_Y);
    ball = new Ball(BALL_RADIUS, BALL_CENTERX, BALL_CENTERY, BALL_COLOR);

    gameOver = false;
    gameScore = 0;
    var x = 10;
    var y = 10
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
    drawPlayer(player);
    drawBall(ball);
    for(const brick of gameBrickList){
        drawBrick(brick);
    }
}

function movePlayer(dir){
    if(dir == "r"){
        player.x += 10;
    }
    else if(dir == "l"){
        player.x -= 10;
    }

}