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

// New button states for L1, R1, L2, R2
let gray1Pressed = false;
let gray2Pressed = false;
let gray3Pressed = false;
let gray4Pressed = false;

// Get the canvas background color
const canvasBackgroundColor = getComputedStyle(canvas).backgroundColor;

// Setup the canvas size and initial player position
function setupCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    playerSize = canvas.width * 0.1;  // Player size set to 10% of canvas width
    velocity = canvas.width * 0.01;   // Player velocity (speed) set to 1% of canvas width

    playerX = (canvas.width - playerSize) / 2;  // Center player horizontally
    playerY = (canvas.height - playerSize) / 2; // Center player vertically

    playerElement.style.width = `${playerSize}px`;  // Set player's width
    playerElement.style.height = `${playerSize}px`; // Set player's height
    playerElement.style.transition = "all 0.1s ease"; // Smooth transition for player movements
    updatePlayerPosition();  // Update player position

    // Setup controls
    setupKeyboardControls();
    setupTouchControls();  // Keep touch controls as fallback for mobile
}
setupCanvas();

window.addEventListener("resize", setupCanvas);

// Handle gamepad connection and disconnection
window.addEventListener("gamepadconnected", (event) => {
    controllerIndex = event.gamepad.index;
    console.log("Gamepad connected:", event.gamepad);
});

window.addEventListener("gamepaddisconnected", (event) => {
    console.log("Gamepad disconnected:", event.gamepad);
    controllerIndex = null; // Set to null when gamepad is disconnected
});

// Function to find a connected gamepad
function findConnectedGamepad() {
    const gamepads = navigator.getGamepads();
    for (const gamepad of gamepads) {
        if (gamepad?.connected) {
            return gamepad;
        }
    }
    return null;  // No connected gamepad found
}


// Update player position on screen
function updatePlayerPosition() {
    playerElement.style.left = `${playerX}px`;
    playerElement.style.top = `${playerY}px`;
}

// Handle gamepad input
function controllerInput() {
    const gamepad = findConnectedGamepad(); // Always check for a connected gamepad

    if (gamepad) {
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

        // Handle additional gamepad buttons (L1, R1, L2, R2)
        gray1Pressed= buttons[4].pressed; // L1 button
        gray2Pressed = buttons[5].pressed; // R1 button
        gray3Pressed = buttons[6].pressed; // L2 button
        gray4Pressed = buttons[7].pressed; // R2 button
    }
}

// Handle movement based on input
function movePlayer() {
    let isMoving = false;

    // Remove the triangle class if not moving
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
        playerElement.style.width = `${playerSize}px`; // Reset square size
        playerElement.style.height = `${playerSize}px`; // Reset square size
        playerElement.style.backgroundColor = "rgb(0, 0, 3)"; // Reset color to original square color
    }

    updatePlayerPosition();
}



// Handle player shape change based on button presses
function changePlayerShape() {
    playerElement.classList.remove("morph-A", "morph-B", "morph-C", "morph-D","morph-E", "morph-F", "morph-G", "morph-H");

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
    } else if (gray1Pressed) {
        playerElement.classList.add("morph-E");
        playerElement.textContent = "L1";
        playerElement.style.color = "gray1";
    } else if (gray2Pressed) {
        playerElement.classList.add("morph-F");
        playerElement.textContent = "R2";
        playerElement.style.color = "gray2";
    } else if (gray3Pressed) {
        playerElement.classList.add("morph-G");
        playerElement.textContent = "L2";
        playerElement.style.color = "gray3";
    } else if (gray4Pressed) {
        playerElement.classList.add("morph-H");
        playerElement.textContent = "R2";
        playerElement.style.color = "gray4";
    } else {
        playerElement.textContent = "";
        playerElement.style.color = "";
    }

}

// Handle player color change based on button presses
function changePlayerColor() {
    playerElement.classList.remove("blue", "red", "green", "yellow","gray1","gray2","gray3","gray4");

    if (bluePressed) playerElement.classList.add("blue");
    else if (redPressed) playerElement.classList.add("red");
    else if (greenPressed) playerElement.classList.add("green");
    else if (yellowPressed) playerElement.classList.add("yellow");
    else if (gray1Pressed) playerElement.classList.add("gray1");
    else if (gray2Pressed) playerElement.classList.add("gray2");
    else if (gray3Pressed) playerElement.classList.add("gray3");
    else if (gray4Pressed) playerElement.classList.add("gray4");
    else playerElement.classList.add("gray1");
}

// Setup keyboard controls for movement
function setupKeyboardControls() {
    document.addEventListener("keydown", (event) => {
        if (event.key === "ArrowUp" || event.key === "w") {
            upPressed = true;
        } else if (event.key === "ArrowDown" || event.key === "s") {
            downPressed = true;
        } else if (event.key === "ArrowLeft" || event.key === "a") {
            leftPressed = true;
        } else if (event.key === "ArrowRight" || event.key === "d") {
            rightPressed = true;
        }

        // Mapping keys for button presses
        if (event.key === "1") {  // Blue button (A)
            bluePressed = true;
        } else if (event.key === "2") {  // Red button (B)
            redPressed = true;
        } else if (event.key === "3") {  // Green button (X)
            greenPressed = true;
        } else if (event.key === "4") {  // Yellow button (Y)
            yellowPressed = true;
        }
    });

    document.addEventListener("keyup", (event) => {
        if (event.key === "ArrowUp" || event.key === "w") {
            upPressed = false;
        } else if (event.key === "ArrowDown" || event.key === "s") {
            downPressed = false;
        } else if (event.key === "ArrowLeft" || event.key === "a") {
            leftPressed = false;
        } else if (event.key === "ArrowRight" || event.key === "d") {
            rightPressed = false;
        }

        // Remove button presses when keys are released
        if (event.key === "1") {
            bluePressed = false;
        } else if (event.key === "2") {
            redPressed = false;
        } else if (event.key === "3") {
            greenPressed = false;
        } else if (event.key === "4") {
            yellowPressed = false;
        }
    });
}

// Handle touchscreen control
function setupTouchControls() {
    canvas.addEventListener("touchstart", (event) => {
        let touch = event.touches[0];
        let mouseX = touch.clientX;
        let mouseY = touch.clientY;

        if (mouseX < playerX) leftPressed = true;
        if (mouseX > playerX) rightPressed = true;
        if (mouseY < playerY) upPressed = true;
        if (mouseY > playerY) downPressed = true;
    },{ passive: true });

    canvas.addEventListener("touchend", () => {
        upPressed = false;
        downPressed = false;
        leftPressed = false;
        rightPressed = false;
    },{ passive: true });

    canvas.addEventListener("touchmove", (event) => {
    },{ passive: true });
}

// Main game loop
function gameLoop() {
    controllerInput();     // Read gamepad input
    movePlayer();
    changePlayerColor();
    changePlayerShape();
    requestAnimationFrame(gameLoop);
}

gameLoop();
