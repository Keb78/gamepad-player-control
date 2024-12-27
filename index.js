const canvas = document.getElementById("gameArea");
const playerElement = document.getElementById("player");
const ctx = canvas.getContext("2d");

let playerSize = 0;
let playerX = 0;
let playerY = 0;
let velocity = 0;

let controllerIndex = null;
let leftPressed = false;
let rightPressed = false;
let upPressed = false;
let downPressed = false;

let bluePressed = false;
let yellowPressed = false;
let redPressed = false;
let greenPressed = false;

// Get the canvas background color
const canvasBackgroundColor = getComputedStyle(canvas).backgroundColor;

function setupCanvas() {
    canvas.width = window.innerWidth;  // Sets the canvas width to the width of the browser window
    canvas.height = window.innerHeight; // Sets the canvas height to the height of the browser window

    playerSize = canvas.width * 0.1;  // Sets the player's size to 10% of the canvas width
    velocity = canvas.width * 0.01;   // Sets the player's velocity (speed of movement) to 1% of the canvas width

    playerX = (canvas.width - playerSize) / 2;  // Centers the player horizontally on the canvas
    playerY = (canvas.height - playerSize) / 2; // Centers the player vertically on the canvas

    // Update the player's initial size and position
    playerElement.style.width = `${playerSize}px`;  // Sets the player's width to `playerSize`
    playerElement.style.height = `${playerSize}px`; // Sets the player's height to `playerSize`
    playerElement.style.transition = "all 0.1s ease"; // Ensure smooth transition for all changes
    updatePlayerPosition();  // Updates the player's position on the screen
}
setupCanvas();

window.addEventListener("resize", setupCanvas);
window.addEventListener("gamepadconnected", (event) => {
    controllerIndex = event.gamepad.index;
    console.log("connected");
});

window.addEventListener("gamepaddisconnected", (event) => {
    console.log("disconnected");
    controllerIndex = null;
});

function updatePlayerPosition() {
    playerElement.style.left = `${playerX}px`;
    playerElement.style.top = `${playerY}px`;
}

function controllerInput() {
    if (controllerIndex !== null) {
        const gamepad = navigator.getGamepads()[controllerIndex];
        const buttons = gamepad.buttons;
        upPressed = buttons[12].pressed;
        downPressed = buttons[13].pressed;
        leftPressed = buttons[14].pressed;
        rightPressed = buttons[15].pressed;

        const stickDeadZone = 0.4;
        const leftRightValue = gamepad.axes[0];

        if (leftRightValue >= stickDeadZone) {
            rightPressed = true;
        } else if (leftRightValue <= -stickDeadZone) {
            leftPressed = true;
        }

        const upDownValue = gamepad.axes[1];

        if (upDownValue >= stickDeadZone) {
            downPressed = true;
        } else if (upDownValue <= -stickDeadZone) {
            upPressed = true;
        }

        greenPressed = buttons[0].pressed;
        redPressed = buttons[1].pressed;
        bluePressed = buttons[2].pressed;
        yellowPressed = buttons[3].pressed;
    }
}

function movePlayer() {
    let isMoving = false;

    // Remove the triangle class if it's not moving
    playerElement.classList.remove("triangle");

    if (upPressed) {
        playerY -= velocity;
        playerElement.style.transform = "rotate(0deg)";  // Point up
        isMoving = true;
    }
    if (downPressed) {
        playerY += velocity;
        playerElement.style.transform = "rotate(180deg)";   // Point down
        isMoving = true;
    }
    if (leftPressed) {
        playerX -= velocity;
        playerElement.style.transform = "rotate(-90deg)"; // Point left
        isMoving = true;
    }
    if (rightPressed) {
        playerX += velocity;
        playerElement.style.transform = "rotate(90deg)";    // Point right
        isMoving = true;
    }

    // Diagonal movement (optional)
    if (upPressed && leftPressed) {
        playerElement.style.transform = "rotate(-40deg)"; 
    }
    if (upPressed && rightPressed) {
        playerElement.style.transform = "rotate(60deg)"; 
    }
    if (downPressed && leftPressed) {
        playerElement.style.transform = "rotate(-135deg)";
    }
    if (downPressed && rightPressed) {
        playerElement.style.transform = "rotate(140deg)";
    }

    // Keep player within canvas bounds
    playerX = Math.max(0, Math.min(playerX, canvas.width - playerSize));
    playerY = Math.max(0, Math.min(playerY, canvas.height - playerSize));

    // Morph into triangle when moving
    if (isMoving) {
        playerElement.classList.add("triangle");
        playerElement.style.width = "0"; // Remove the default width of the square
        playerElement.style.height = "0"; // Remove the default height of the square
        playerElement.style.backgroundColor = canvasBackgroundColor;  // Transition to background color
    } else {
        // Revert to square if not moving
        playerElement.classList.remove("triangle");
        playerElement.style.width = `${playerSize}px`; // Reset the square size
        playerElement.style.height = `${playerSize}px`; // Reset the square size
        playerElement.style.backgroundColor = "rgb(0, 0, 3)"; // Reset the color to original square color
    }

    updatePlayerPosition();
}

function changePlayerShape() {
    playerElement.classList.remove("morph-A", "morph-B", "morph-C", "morph-D");

    if (bluePressed) {
        playerElement.classList.add("morph-A");
        playerElement.textContent = "X";
        playerElement.style.color = "blue";
    } else if (redPressed) {
        playerElement.classList.add("morph-B");
        playerElement.textContent = "B";
        playerElement.style.color = "red";
    } else if (greenPressed) {
        playerElement.classList.add("morph-C");
        playerElement.textContent = "A";
        playerElement.style.color = "green";
    } else if (yellowPressed) {
        playerElement.classList.add("morph-D");
        playerElement.textContent = "Y";
        playerElement.style.color = "yellow";
    } else {
        playerElement.textContent = "";
        playerElement.style.color = "";
    }
}

function changePlayerColor() {
    playerElement.classList.remove("pink", "blue", "red", "green", "yellow");

    if (bluePressed) playerElement.classList.add("blue");
    else if (redPressed) playerElement.classList.add("red");
    else if (greenPressed) playerElement.classList.add("green");
    else if (yellowPressed) playerElement.classList.add("yellow");
    else playerElement.classList.add("pink");
}

function gameLoop() {
    controllerInput();
    movePlayer();
    changePlayerColor();
    changePlayerShape();
    requestAnimationFrame(gameLoop);
}

gameLoop();
