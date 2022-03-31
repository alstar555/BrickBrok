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
const PLAYER_SPEED = 10;
const BALL_RADIUS = 10;
const BALL_CENTERX = 460;
const BALL_CENTERY = 380;
const BALL_COLOR = "#22352B"
const BALL_VELOCITY = 4;
const CANVAS_HEIGHT = 500;
const CANVAS_WIDTH = 1000;



var gameScore;
var gameOver;
var gameBrick;
var gameBrickList = [];
var player1;
var player2;
var ball;


startGame();
render();

function startGame(){
    player1 = new Player(PLAYER_WIDTH, PLAYER_HEIGHT, PLAYER_COLOR, PLAYER1_START_X, PLAYER1_START_Y);
    player2 = new Player(PLAYER_WIDTH, PLAYER_HEIGHT, PLAYER_COLOR, PLAYER2_START_X, PLAYER2_START_Y);
    ball = new Ball(BALL_RADIUS, BALL_CENTERX, BALL_CENTERY, BALL_COLOR);

    gameOver = false;
    gameScore = 0;
    gameBrickList = [];
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
    }
}

function Player(width, height, color, x, y){
    this.w = width;
    this.h = height;
    this.c = color;
    this.x = x;
    this.y = y;
    this.move_left = false;
    this.move_right = false;

}

function Ball(radius, centerx, centery, color){
    this.r = radius;
    this.x = centerx;
    this.y = centery;
    this.c = color;
    this.v = 0;
    this.collision = false;
    this.bounce_direction = 0;

}

function Brick(width, height, color, x, y){
    this.w = width;
    this.h = height;
    this.c = color;
    this.x = x;
    this.y = y;
    this.hit = false
}

function drawBrick(brick){
    if(!brick.hit){
        ctx.fillStyle = brick.c;
        ctx.fillRect(brick.x, brick.y, brick.w, brick.h);
    }
}

function drawPlayer(player){
    if(player.move_left){
        player.x -= PLAYER_SPEED;
    }
    else if(player.move_right){
        player.x += PLAYER_SPEED;
    }
    ctx.fillStyle = player.c;
    ctx.fillRect(player.x, player.y, player.w, player.h);
}

function drawBall(ball){
    if(ball.v == 0){ //keep ball under player
        ball.x = player1.x + 32;
    }
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.r, 0, 2 * Math.PI);
    ctx.fillStyle = ball.c;
    ctx.fill();
    checkCollision();
    checkGameOver();
}

function render(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawPlayer(player1);
    drawPlayer(player2);
    moveBall(ball);
    drawBall(ball);
    for(const brick of gameBrickList){
        drawBrick(brick);
    }
    requestAnimationFrame(render);
}


document.body.onkeydown = function( e ){
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
    movePlayer(direction, true);
}
document.body.onkeyup = function( e ){
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
    movePlayer(direction, false);
}

function movePlayer(dir, s){
    if(dir == "left"){
        player1.move_left = s;
    }
    if(dir == "right"){
        player1.move_right = s;
    }
    if(dir == "a"){
        player2.move_left = s;
    }
    if(dir == "d"){
        player2.move_right = s;
    }
    if(dir == "space"){
        startBallMoving();
    }
}

function startBallMoving(){
    if (ball.v == 0){
        ball.v = - BALL_VELOCITY;
    }
}

function moveBall(ball){
    if(ball.collision){
        ball.v = -ball.v; //change directions
        ball.collision = false;
    }
    ball.y += ball.v;
    ball.x += ball.bounce_direction;
}

function checkCollision(){
    if(player1.y - PLAYER_HEIGHT/2 <= ball.y && ball.y <= player1.y + PLAYER_HEIGHT/2 &&
     player1.x-10 <= ball.x && ball.x <= player1.x + PLAYER_WIDTH +10 ) {
        ball.collision = true;
        if(ball.x <= player1.x + PLAYER_WIDTH/2){
            ball.bounce_direction = -1;
        }else{
            ball.bounce_direction = 1;
        }
        ball.bounce_direction *= (Math.random());
    }
    else if(player2.y - PLAYER_HEIGHT/2 <= ball.y && ball.y <= player2.y + PLAYER_HEIGHT/2 &&
     player2.x-10 <= ball.x && ball.x <= player2.x + PLAYER_WIDTH+10) {
        ball.collision = true;
        if(ball.x <= player2.x + PLAYER_WIDTH/2){
            ball.bounce_direction = -1;
        }else{
            ball.bounce_direction = 1;
        }
        ball.bounce_direction *= (Math.random());
    }
    else{
        for(const brick of gameBrickList){
            if(!brick.hit){
                if(ball.y <= brick.y + PLAYER_HEIGHT && brick.x-PLAYER_WIDTH <= ball.x && ball.x <= brick.x + PLAYER_WIDTH ){
                    ball.collision = true;
                    if(ball.x <= brick.x + PLAYER_WIDTH/2){
                        ball.bounce_direction = -1;
                    }else{
                        ball.bounce_direction = 1;
                    }
                    ball.bounce_direction *= (Math.random());
                    brick.hit = true;
                    break;
                }
            }
        }
    }

}

function checkGameOver(){
    if(ball.x < 0 || ball.y < 0 || CANVAS_WIDTH < ball.x || CANVAS_HEIGHT < ball.y){
        gameOver == true;
        startGame();
    }
}