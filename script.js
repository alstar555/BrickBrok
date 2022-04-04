//canvas
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
document.body.style.zoom="80%"

//constants
const BRICK_WIDTH = 60;
const BRICK_HEIGHT = 20;
const BRICK_X = 10;
const BRICK_Y = 270;
const BRICK_COLORS = 
[["#607d8b","#4d646f", "#3a4b53 ", "#303f46", "#263238", "#1d262a", "#56717d", "#13191c"], 
["#4b3832", "#854442","#fff4e6", "#3c2f2f","#be9b7b"], 
["#a8e6cf", "#dcedc1", "#ffd3b6", "#ffaaa5", "#ff8b94"],
["#a3c1ad", "#a0d6b4", "#5f9ea0", "#317873", "#49796b"],
["#ffa31a", "#808080", "#292929", "#1b1b1b", "#ffffff"],
["#f7cac9", "#dec2cb", "#c5b9cd", "#abb1cf", "#92a8d1"]];
const PLAYER_WIDTH = 60;
const PLAYER_HEIGHT = 20;
const PLAYER_COLOR = "#698377";
const PLAYER1_START_X = 430;
const PLAYER1_START_Y = 630;
const PLAYER2_START_X = 430;
const PLAYER2_START_Y = 30;
const PLAYER_SPEED = 10;
const BALL_RADIUS = 10;
const BALL_CENTERX = 460;
const BALL_CENTERY = PLAYER1_START_Y - 20;
const BALL_COLOR = "#22352B"
const BALL_VELOCITY = 4;
const CANVAS_HEIGHT = 700;
const CANVAS_WIDTH = 1000;

var highscore = localStorage.getItem("highscore");
var gameScore;
var gameOver;
var gameBrick;
var gameBrickList = [];
var player1;
var player2;
var ball;
var gameBallList = [];



startGame();
render();



function startGame(){
    player1 = new Player(PLAYER_WIDTH, PLAYER_HEIGHT, PLAYER_COLOR, PLAYER1_START_X, PLAYER1_START_Y, 1);
    player2 = new Player(PLAYER_WIDTH, PLAYER_HEIGHT, PLAYER_COLOR, PLAYER2_START_X, PLAYER2_START_Y, 2);
    ball1 = new Ball(BALL_RADIUS, BALL_CENTERX, BALL_CENTERY, BALL_COLOR, 1);
    ball2 = new Ball(BALL_RADIUS, BALL_CENTERX, BALL_CENTERY - 540, BALL_COLOR, 2);
    gameBallList.push(ball1, ball2);
    
    gameOver = false;
    gameScore = 0;
    gameBrickList = [];
    var x = BRICK_X;
    var y = BRICK_Y;
    var num = Math.floor(Math.random() * BRICK_COLORS.length);
    var num2
    for(let i = 0; i != 5; i++){
        for(let j = 0; j!=14; j++){
            num2 = Math.floor(Math.random() * BRICK_COLORS[num].length);
            gameBrick = new Brick(BRICK_WIDTH, BRICK_HEIGHT, BRICK_COLORS[num][num2], x, y);
            gameBrickList.push(gameBrick);
            x+= 70;
        }
        y+=30;
        x = 10;
    }
}

function newLevel(){
    gameBallList.push(ball1, ball2);

    gameOver = false;
    gameBrickList = [];
    var x = BRICK_X;
    var y = BRICK_Y;
    var num = Math.floor(Math.random() * BRICK_COLORS.length);
    var num2
    for(let i = 0; i != 5; i++){
        for(let j = 0; j!=14; j++){
            num2 = Math.floor(Math.random() * BRICK_COLORS[num].length);
            gameBrick = new Brick(BRICK_WIDTH, BRICK_HEIGHT, BRICK_COLORS[num][num2], x, y);
            gameBrickList.push(gameBrick);
            x+= 70;
        }
        y+=30;
        x = 10;
    }

}

function Player(width, height, color, x, y, num){
    this.num = num
    this.w = width;
    this.h = height;
    this.c = color;
    this.x = x;
    this.y = y;
    this.move_left = false;
    this.move_right = false;
    this.bot = true;
    this.score = 0;
    this.can_highscore = false;
    
}

function Ball(radius, centerx, centery, color, player){
    this.r = radius;
    this.x = centerx;
    this.y = centery;
    this.c = color;
    this.v = 0;
    this.collision = false;
    this.bounce_direction = 0;
    this.player = player;
    
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
        if(-35 <= player.x - PLAYER_SPEED ){
            player.x -= PLAYER_SPEED;
        }
    }
    else if(player.move_right){
        if(player.x + PLAYER_SPEED <= CANVAS_WIDTH - PLAYER_WIDTH/2){
            player.x += PLAYER_SPEED;
        }
    }
    if(player.bot && ball2.v != 0){
        var closest_ball = 10000;
        for(const b of gameBallList){
            if(b.player != player.num){
                closest_ball = Math.min(closest_ball, Math.abs(player.y - b.y));
            }
        }
        for(const b of gameBallList){
            if(Math.abs(player.y - b.y) == closest_ball){
                player.x -= (player.x - b.x + 31)/PLAYER_SPEED;
                break;
            }
        }
    }
    ctx.fillStyle = player.c;
    ctx.fillRect(player.x, player.y, player.w, player.h);
}

function drawBall(ball){
    if(ball.v == 0){ //keep ball under player
        ball1.x = player1.x + 32;
        ball2.x = player2.x + 32;
    }
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.r, 0, 2 * Math.PI);
    ctx.fillStyle = ball.c;
    ctx.fill();
    checkCollision(ball);
    checkGameOver(ball);
}

function drawScore(){
    ctx.font = '30px serif';
    ctx.fillText('SCORE: ' + player1.score, 800, 650);
    ctx.fillText('SCORE: ' + player2.score, 10, 50);
}

function drawHighscore(){
    ctx.font = '30px serif';
    ctx.fillText('HIGHSCORE: ' + Math.max(0, highscore), 10, 650);
}
function render(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawPlayer(player1);
    drawPlayer(player2);
    drawScore();
    drawHighscore();
    for(const b of gameBallList){
        moveBall(b);
        drawBall(b);
    }

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
        player1.bot = false;
    }
    if(dir == "right"){
        player1.move_right = s;
        player1.bot = false;
    }
    if(dir == "a"){
        player2.move_left = s;
        player2.bot = false;
    }
    if(dir == "d"){
        player2.move_right = s;
        player2.bot = false;
    }
    if(dir == "space"){
        startBallMoving();
    }
}

function startBallMoving(){
    if (ball1.v == 0){
        ball1.v = - BALL_VELOCITY;
        ball2.v = BALL_VELOCITY;
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

function checkCollision(ball){
    if(!player1.bot && player1.score <= 200){
        player1.can_highscore = true;
    }
    else if(!player2.bot && player2.score <= 200){
        player2.can_highscore = true;
    }

    if(ball.x < 0 || CANVAS_WIDTH < ball.x ){
        ball.bounce_direction *= -1;
    }

    if(player1.y - PLAYER_HEIGHT/2 <= ball.y && ball.y <= player1.y + PLAYER_HEIGHT/2 &&
     player1.x-10 <= ball.x && ball.x <= player1.x + PLAYER_WIDTH +10 ) {
         if(ball.player != 1){
             ball.collision = true;
             if(ball.x <= player1.x + PLAYER_WIDTH/2){
                 ball.bounce_direction = -1;
             }else{
                 ball.bounce_direction = 1;
             }
             ball.bounce_direction *= Math.abs(player1.x + PLAYER_WIDTH/2 - ball.x)/10;
             ball.player = 1;
         }
    }
    else if(player2.y - PLAYER_HEIGHT <= ball.y && ball.y <= player2.y + PLAYER_HEIGHT+10  &&
     player2.x-10 <= ball.x && ball.x <= player2.x + PLAYER_WIDTH+10) {
         if(ball.player != 2){
             ball.collision = true;
             if(ball.x <= player2.x + PLAYER_WIDTH/2){
                 ball.bounce_direction = -1;
             }else{
                 ball.bounce_direction = 1;
             }
             ball.bounce_direction *= Math.abs(player2.x + PLAYER_WIDTH/2 - ball.x)/10;
             ball.player = 2;
         }
    }
    else{
        for(const brick of gameBrickList){
            if(!brick.hit){
                if(ball.y <= brick.y + PLAYER_HEIGHT && ball.y >= brick.y - PLAYER_HEIGHT && brick.x-PLAYER_WIDTH <= ball.x && ball.x <= brick.x + PLAYER_WIDTH ){
                    ball.collision = true;
                    if(ball.x <= brick.x + PLAYER_WIDTH){
                        ball.bounce_direction *= -1;
                    }
                    brick.hit = true;
                    spawnNewBall(brick);
                    addScore(ball);
                    ball.player = 0;
                    break;
                }
            }
        }
        for(const b of gameBallList){
            if( b != ball &&
                ball.y - BALL_RADIUS <= b.y && b.y <= ball.y + BALL_RADIUS &&
                ball.x - BALL_RADIUS <= b.x && b.x <= ball.x + BALL_RADIUS){
                ball.collision = true;
                b.bounce_direction *= -1;
                ball.bounce_direction *= -1;
                b.v *= 1.01;
                ball.bounce_direction *= (Math.random() * 3 );
                ball.player = 0;
                break;
            }
        }
    }
    if( ball.collision){
        ball.v *= 1.01;

    }

}

function checkGameOver(){
    new_game = true;
    //check all bricks are still here
    for(const b of gameBrickList){
        if(!b.hit){
            new_game = false;
            break;
        }
    }
    if(new_game){
        newLevel();
        return;
    }
    new_game = true;
    //check at one least balls in bounds
    for(const b of gameBallList){
        if(!checkBallBounds(b)){
            new_game = false;
        }
    }
    if(new_game){
        if(player1.can_highscore){
            localStorage.setItem("highscore", Math.max(highscore, player1.score));
        }
        if(player2.can_highscore){
            localStorage.setItem("highscore", Math.max(highscore, player2.score));
        }
        highscore = localStorage.getItem("highscore");
        startGame();
    }
}

function checkBallBounds(ball){
    if((CANVAS_HEIGHT < ball.y || ball.y < 0) ){
        gameBallList = gameBallList.filter(object => {return object != ball;});
        return true;
    }
    return false;
}

function spawnNewBall(brick){ 
    if(Math.floor(Math.random()*10)%3 == 0){
        var new_ball = new Ball(BALL_RADIUS, brick.x, brick.y, BALL_COLOR);
        new_ball.v = BALL_VELOCITY;
        gameBallList.push(new_ball);
    }
}

function addScore(ball){
    if(ball.player == 1){
        player1.score += 100;
    }
    else if(ball.player == 2){
        player2.score += 100;
    }
}