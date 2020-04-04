// Some variables
var timeOut;
var score;
const CANVAS_BORDER_COLOR = 'black';
const CANVAS_BACKGROUND_COLOR = 'white';
const SNAKE_COLOUR = 'lightgreen';
const SNAKE_BORDER_COLOUR = 'darkgreen';
const SNAKE_FOOD_COLOR = "red";
const SNAKE_FOOD_BACKGROUND_COLOR = "darkred";
var FOODX;
var FOODY;
var gameCanvas;
var ctx;
// Horizontal velocity
let dx = 10;
// Vertical velocity
let dy = 0;

let snake;
// variables declartion end here.

$(document).ready(function () {
    startGame();
    $("#startGame").click(function () {
        startGame();
    });

    $("#pauseGame").click(function () {
        pauseGame();
    });

    $("#resumeGame").click(function () {
        resumeGame();
    });
});

function startGame() {
    $("#startGame").attr('disabled', true);
    $("#resumeGame").attr('disabled', true);
    $("#pauseGame").attr('disabled', false);
    $("#gameEndedDiv").hide(100, 'swing');
    snake = [
        { x: 150, y: 150 },
        { x: 140, y: 150 },
        { x: 130, y: 150 },
        { x: 120, y: 150 },
        { x: 110, y: 150 }
    ];
    score = 0;
    // get canvas element
    gameCanvas = document.getElementById("gameCanvas");
    // Return the 2D drawing context
    ctx = gameCanvas.getContext("2d");
    createFood();
    main();
}

// Draw the small blocks of the snake.
function drawSnakePart(snakePart) {
    ctx.fillStyle = SNAKE_COLOUR;
    ctx.strokestyle = SNAKE_BORDER_COLOUR;
    ctx.fillRect(snakePart.x, snakePart.y, 10, 10);
    ctx.strokeRect(snakePart.x, snakePart.y, 10, 10);
}

// loop through whole snake array and create the snake on the corrdinates.
function drawSnake() {
    snake.forEach(drawSnakePart);
}

/**
   * Advances the snake by changing the x-coordinates of its parts
   * according to the horizontal velocity and the y-coordinates of its parts
   * according to the vertical veolocity
*/
function advanceSnake() {
    // here we are adding the delta part to the snake so that we can see him move.
    const head = { x: snake[0].x + dx, y: snake[0].y + dy };
    if (head.x < 0) {
        head.x = gameCanvas.width;
    } else {
        head.x = head.x % gameCanvas.width;
    }

    if (head.y  < 0) {
        head.y = gameCanvas.height;
    } else {
        head.y = head.y % gameCanvas.height;
    }
    // add element in the begining of the array.
    snake.unshift(head);

    const didSnakeEatFood = snake[0].x == FOODX && snake[0].y == FOODY;
    if (didSnakeEatFood) {
        score += 1;
        updateScore(score);
        createFood();
    } else {
        // removes element from the end of the array.
        snake.pop();
    }
}

/**
 * This function sees the direction of snake and changes the direction of snake
 * 
 * */

document.onkeydown = function changeDirection(event) {
    const LEFT_KEY = 37;
    const RIGHT_KEY = 39;
    const UP_KEY = 38;
    const DOWN_KEY = 40;
    const keyPressed = event.keyCode;
    const isGoingRight = dx > 0 ? true : false;
    const isGoingLeft = dx < 0 ? true : false;
    const isGoingUp = dy < 0 ? true : false;
    const isGoingDown = dy > 0 ? true : false;
    if (keyPressed == LEFT_KEY && !isGoingRight) {
        dx = -10;
        dy = 0;
    }
    else if (keyPressed == RIGHT_KEY && !isGoingLeft) {
        dx = 10;
        dy = 0;
    }

    else if (keyPressed == UP_KEY && !isGoingDown) {
        dx = 0;
        dy = -10;
    }

    else if (keyPressed == DOWN_KEY && !isGoingUp) {
        dx = 0;
        dy = 10;
    }
}

// creates the food for the snake. This function just creates the corrdiates.
function createFood() {
    FOODX = randomTen(0, gameCanvas.width - 10);
    FOODY = randomTen(0, gameCanvas.height - 10);

    snake.forEach(function (snakePart) {
        const isFoodOnSnake = snakePart.x == FOODX || snakePart.y == FOODY;
        if (isFoodOnSnake) {
            createFood();
        }
    });
}

// This function actually draws the snake food.
function drawSnakeFood() {
    ctx.fillStyle = SNAKE_FOOD_COLOR;
    ctx.strokestyle = SNAKE_FOOD_BACKGROUND_COLOR;
    ctx.fillRect(FOODX, FOODY, 10, 10);
    ctx.strokeRect(FOODX, FOODY, 10, 10);
}

function didGameEnd() {
    snakeX = snake[0].x;
    snakeY = snake[0].y;
    /*if (snakeX == 0 || snakeX == gameCanvas.width) {
        return true;
    } else if (snakeY == 0 || snakeY == gameCanvas.height) {
        return true;
    }*/
    return doesSnakeHasBittenItself(snakeX, snakeY);
}

function doesSnakeHasBittenItself(snakeX, snakeY) {
    for (let index = 1; index < snake.length; index++) {
        const element = snake[index];
        if (snakeX == element.x && snakeY == element.y) {
            return true;
        }

    }
    return false;
};

function drawCanvas() {
    // clear the canvas
    ctx.clearRect(0, 0, gameCanvas.width, gameCanvas.height);
    // redraw it again
    ctx.fillStyle = CANVAS_BACKGROUND_COLOR;
    ctx.strokestyle = CANVAS_BORDER_COLOR;
    // Draw a "filled" rectangle to cover the entire canvas
    ctx.fillRect(0, 0, gameCanvas.width, gameCanvas.height);
    // Draw a "border" around the entire canvas
    ctx.strokeRect(0, 0, gameCanvas.width, gameCanvas.height);
}

function endGame(score) {
    $("#gameEndedDiv").show(100, 'swing');
    $("#startGame").attr('disabled', false);
    updateScore(score);
}

function updateScore(score) {
    $("#score").html("Score : " + score);
}

function pauseGame() {
    clearTimeout(timeOut);
    $("#resumeGame").attr('disabled', false);
    $("#pauseGame").attr('disabled', true);
}

function resumeGame() {
    main();
    $("#resumeGame").attr('disabled', true);
    $("#pauseGame").attr('disabled', false);
}

function randomTen(min, max) {
    return Math.round((Math.random() * (max - min) + min) / 10) * 10;
}

function main() {
    timeOut = setTimeout(function () {
        drawCanvas();
        drawSnakeFood();
        advanceSnake();
        drawSnake();
        if (didGameEnd()) {
            endGame(score);
            return;
        }
        main();
    }, 100)
}
