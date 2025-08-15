const target = document.getElementById('target');
const gameArea = document.getElementById('gameArea');
const reactionTimeDisplay = document.getElementById('reactionTime');
const bestTimeDisplay = document.getElementById('bestTime');
const startBtn = document.getElementById('startBtn');

let startTime = 0;
let bestTime = null;
let gameStarted = false;
let moveInterval = null;
let lastClickTime = null;

// Circle movement parameters
let pos = { x: 100, y: 100 };
let velocity = { x: 2, y: 2 };
const size = 60;

function getGameAreaRect() {
    return gameArea.getBoundingClientRect();
}

function moveTarget() {
    const areaRect = getGameAreaRect();

    // Update position
    pos.x += velocity.x;
    pos.y += velocity.y;

    // Bounce on walls
    if (pos.x <= 0 || pos.x >= areaRect.width - size) velocity.x *= -1;
    if (pos.y <= 0 || pos.y >= areaRect.height - size) velocity.y *= -1;

    target.style.left = `${pos.x}px`;
    target.style.top = `${pos.y}px`;
}

function startMoving() {
    // Set a random starting position and direction
    const areaRect = getGameAreaRect();
    pos.x = Math.random() * (areaRect.width - size);
    pos.y = Math.random() * (areaRect.height - size);
    // Random direction and speed
    const speed = 2 + Math.random() * 3;
    const angle = Math.random() * 2 * Math.PI;
    velocity.x = Math.cos(angle) * speed;
    velocity.y = Math.sin(angle) * speed;

    target.style.display = 'block';
    moveInterval = setInterval(moveTarget, 10);
    startTime = performance.now();
}

function stopMoving() {
    clearInterval(moveInterval);
    moveInterval = null;
    target.style.display = 'none';
}

target.addEventListener('click', () => {
    if (!gameStarted || !moveInterval) return;
    const endTime = performance.now();
    const reaction = Math.round(endTime - startTime);
    reactionTimeDisplay.textContent = reaction;
    if (bestTime === null || reaction < bestTime) {
        bestTime = reaction;
        bestTimeDisplay.textContent = bestTime;
    }
    stopMoving();
    setTimeout(startMoving, 800); // Small pause before next round
});

startBtn.addEventListener('click', () => {
    if (gameStarted) return;
    gameStarted = true;
    reactionTimeDisplay.textContent = '--';
    bestTime = null;
    bestTimeDisplay.textContent = '--';
    startBtn.disabled = true;
    setTimeout(startMoving, 1000);
});

window.addEventListener('resize', () => {
    stopMoving();
});

// Optional: reset after user leaves the tab
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        stopMoving();
        gameStarted = false;
        startBtn.disabled = false;
    }
});
