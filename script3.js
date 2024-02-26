// game3.js

let gameRunning = false;
let rodTop = document.getElementById("rod-top") || createRod("rod-top");
let rodBottom = document.getElementById("rod-bottom") || createRod("rod-bottom");
let ball = document.getElementById("ball") || createBall();
let gameContainer = document.getElementById("game-container");
let aPressed = false;
let dPressed = false;
let score = 0;
let Vx = -1;
let Vy = -5;
let Vel = Math.sqrt(Math.pow(Vx, 2) + Math.pow(Vy, 2));

// Create start and stop buttons dynamically if not already present
const startButton = document.getElementById("start-button") || createButton("Start", startGame, "start-button");
const stopButton = document.getElementById("stop-button") || createButton("Stop", stopGame, "stop-button");

if (!document.getElementById("start-button")) {
    document.body.appendChild(startButton);
}

if (!document.getElementById("stop-button")) {
    document.body.appendChild(stopButton);
}

document.addEventListener("keydown", keyDownHandler);
document.addEventListener("keyup", keyUpHandler);

function createButton(text, clickHandler, id) {
    const button = document.createElement("button");
    button.textContent = text;
    button.addEventListener("click", clickHandler);
    button.id = id;
    return button;
}

function createRod(id) {
    const rod = document.createElement("div");
    rod.id = id;
    // Set other styles and properties for the rod
    return rod;
}

function createBall() {
    const ball = document.createElement("div");
    ball.id = "ball";
    // Set other styles and properties for the ball
    return ball;
}

function startGame() {
    if (!gameRunning) {
        gameRunning = true;
        playAgain(); // Reset the ball position before starting
        requestAnimationFrame(gameLoop);
    }
}

function stopGame() {
    gameRunning = false;
}

function keyDownHandler(event) {
    if (event.key == "d") {
        dPressed = true;
    } else if (event.key == "a") {
        aPressed = true;
    }
}

function keyUpHandler(event) {
    if (event.key == "d") {
        dPressed = false;
    } else if (event.key == "a") {
        aPressed = false;
    }
}

function movePaddles() {
    if (aPressed && rodTop.offsetLeft > 1) {
        rodTop.style.left = rodTop.offsetLeft - 4 + "px";
        rodBottom.style.left = rodBottom.offsetLeft - 4 + "px";
    }
    if (dPressed && rodTop.offsetLeft < gameContainer.offsetWidth - rodTop.offsetWidth) {
        rodTop.style.left = rodTop.offsetLeft + 4 + "px";
        rodBottom.style.left = rodBottom.offsetLeft + 4 + "px";
    }
}

function playAgain() {
    ball.style.left = "50%";
    ball.style.top = "50%";
    Vx = -1;
    Vy = -5;
    Vel = Math.sqrt(Math.pow(Vx, 2) + Math.pow(Vy, 2));
}

function checkCollision(activePaddle) {
    let ballTop = ball.offsetTop;
    let ballBottom = ball.offsetTop + ball.offsetHeight;
    let ballLeft = ball.offsetLeft;
    let ballRight = ball.offsetLeft + ball.offsetWidth;

    let paddleTop = activePaddle.offsetTop;
    let paddleBottom = activePaddle.offsetTop + activePaddle.offsetHeight;
    let paddleLeft = activePaddle.offsetLeft;
    let paddleRight = activePaddle.offsetLeft + activePaddle.offsetWidth;

    return ballBottom > paddleTop && ballTop < paddleBottom && ballRight > paddleLeft && ballLeft < paddleRight;
}

function gameLoop() {
    if (gameRunning) {
        if (ball.offsetLeft < 0 || ball.offsetLeft > gameContainer.offsetWidth - ball.offsetWidth) {
            Vx = -Vx;
        }

        if (ball.offsetTop < 0 || ball.offsetTop > gameContainer.offsetHeight - ball.offsetHeight) {
            if (score > localStorage.getItem("maxScore")) {
                localStorage.setItem("maxScore", score);
            }

            playAgain();
        }

        let rod = ball.offsetTop > gameContainer.offsetHeight / 2 ? rodBottom : rodTop;
        let ballcenterX = ball.offsetLeft + ball.offsetWidth / 2;
        let paddlecenterX = rod.offsetLeft + rod.offsetWidth / 2;
        let angle = 0;

        if (checkCollision(rod)) {
            score++;

            if (rod == rodTop) {
                angle = ballcenterX < paddlecenterX ? 3 * Math.PI / 4 : ballcenterX > paddlecenterX ? Math.PI / 4 : 0;
            } else if (rod == rodBottom) {
                angle = ballcenterX < paddlecenterX ? -3 * Math.PI / 4 : ballcenterX > paddlecenterX ? -Math.PI / 4 : Math.PI / 2;
            }

            Vel = Vel + 0.2;
            Vx = Vel * Math.cos(angle);
            Vy = Vel * Math.sin(angle);
        }

        ball.style.top = ball.offsetTop + Vy + "px";
        ball.style.left = ball.offsetLeft + Vx + "px";

        movePaddles();

        requestAnimationFrame(gameLoop);
    }
}
