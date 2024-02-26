// game3.js

let gameRunning = false;
let gameContainer = document.getElementById("game-container");
let rodTop = document.getElementById("rod-top") || createRod("rod-top");
let rodBottom = document.getElementById("rod-bottom") || createRod("rod-bottom");
let ball = document.getElementById("ball") || createBall();
let aPressed = false;
let dPressed = false;
let score = 0;
let Vx = -1;
let Vy = -5;
let Vel = Math.sqrt(Math.pow(Vx, 2) + Math.pow(Vy, 2));

// Game configuration
let gameConfig = {
    paddleSpeed: 4,
    ballSpeed: { x: -1, y: -5 },
    acceleration: 0.2
};

// Create start and stop buttons dynamically if not already present
const startButton = document.getElementById("start-button") || createButton("Start", startGame, "start-button");
const stopButton = document.getElementById("stop-button") || createButton("Stop", stopGame, "stop-button");

if (!document.getElementById("start-button")) {
    document.body.appendChild(startButton);
}

if (!document.getElementById("stop-button")) {
    document.body.appendChild(stopButton);
}

// Create settings panel dynamically
const settingsPanel = document.getElementById("settings-panel") || createSettingsPanel();
if (!document.getElementById("settings-panel")) {
    document.body.appendChild(settingsPanel);
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

function createSettingsPanel() {
    const panel = document.createElement("div");
    panel.id = "settings-panel";
    panel.innerHTML = `
        <h2>Game Settings</h2>
        <form id="settings-form">
            <label for="paddle-speed">Paddle Speed:</label>
            <input type="number" id="paddle-speed" value="${gameConfig.paddleSpeed}">

            <label for="ball-speed">Ball Speed:</label>
            <input type="number" id="ball-speed-x" placeholder="X" value="${gameConfig.ballSpeed.x}">
            <input type="number" id="ball-speed-y" placeholder="Y" value="${gameConfig.ballSpeed.y}">

            <label for="acceleration">Acceleration:</label>
            <input type="number" id="acceleration" value="${gameConfig.acceleration}">

            <button type="button" onclick="applySettings()">Apply Settings</button>
        </form>
    `;
    return panel;
}

function applySettings() {
    const paddleSpeedInput = document.getElementById("paddle-speed");
    const ballSpeedXInput = document.getElementById("ball-speed-x");
    const ballSpeedYInput = document.getElementById("ball-speed-y");
    const accelerationInput = document.getElementById("acceleration");

    gameConfig.paddleSpeed = parseFloat(paddleSpeedInput.value) || gameConfig.paddleSpeed;
    gameConfig.ballSpeed.x = parseFloat(ballSpeedXInput.value) || gameConfig.ballSpeed.x;
    gameConfig.ballSpeed.y = parseFloat(ballSpeedYInput.value) || gameConfig.ballSpeed.y;
    gameConfig.acceleration = parseFloat(accelerationInput.value) || gameConfig.acceleration;

    Vel = Math.sqrt(Math.pow(gameConfig.ballSpeed.x, 2) + Math.pow(gameConfig.ballSpeed.y, 2));
    Vx = gameConfig.ballSpeed.x;
    Vy = gameConfig.ballSpeed.y;
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
    const paddleSpeed = gameConfig.paddleSpeed;

    if (aPressed && rodTop.offsetLeft > 1) {
        rodTop.style.left = rodTop.offsetLeft - paddleSpeed + "px";
        rodBottom.style.left = rodBottom.offsetLeft - paddleSpeed + "px";
    }

    if (dPressed && rodTop.offsetLeft < gameContainer.offsetWidth - rodTop.offsetWidth) {
        rodTop.style.left = rodTop.offsetLeft + paddleSpeed + "px";
        rodBottom.style.left = rodBottom.offsetLeft + paddleSpeed + "px";
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
        const ballSpeed = gameConfig.ballSpeed;
        const acceleration = gameConfig.acceleration;

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
            } else if (rod == rod
