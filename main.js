const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const input = document.getElementById('ideaInput');
const scoreDisplay = document.getElementById('score');

let player = { x: 50, y: 300, width: 20, height: 20, dy: 0, jumping: false };
let obstacles = [];
let ideas = [];
let score = 0;
let gameOver = false;

function generateLevel() {
    const idea = input.value.toLowerCase() || 'хаос';
    obstacles = [];
    ideas = [];
    score = 0;
    gameOver = false;
    player.y = 300;
    player.dy = 0;

    // "ИИ" генерирует уровень на основе идеи (оригинальный алгоритм: хэш идеи -> хаос)
    const hash = idea.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const numObstacles = (hash % 5) + 3; // 3-7 препятствий
    const numIdeas = (hash % 3) + 2; // 2-4 идеи

    for (let i = 0; i < numObstacles; i++) {
        obstacles.push({
            x: 200 + i * 150 + (hash % 50),
            y: 320,
            width: 30 + (hash % 20),
            height: 50 + (hash % 30),
            emoji: '💥' // Хаотичный враг
        });
    }

    for (let i = 0; i < numIdeas; i++) {
        ideas.push({
            x: 300 + i * 200 + (hash % 100),
            y: 200 + (hash % 100),
            emoji: '💡' // Идея для сбора
        });
    }

    requestAnimationFrame(gameLoop);
}

function gameLoop() {
    if (gameOver) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Гравитация
    player.dy += 0.5;
    player.y += player.dy;
    if (player.y > 300) {
        player.y = 300;
        player.dy = 0;
        player.jumping = false;
    }

    // Рисуем игрока
    ctx.fillStyle = '#ff4500';
    ctx.fillRect(player.x, player.y, player.width, player.height);

    // Препятствия
    obstacles.forEach(ob => {
        ctx.font = '30px Arial';
        ctx.fillText(ob.emoji, ob.x, ob.y);
        ob.x -= 2; // Движение
        if (ob.x < -50) ob.x = 800; // Цикл
        if (checkCollision(player, ob)) gameOver = true;
    });

    // Идеи
    ideas.forEach((id, index) => {
        ctx.font = '30px Arial';
        ctx.fillText(id.emoji, id.x, id.y);
        id.x -= 2;
        if (id.x < -50) id.x = 800;
        if (checkCollision(player, id)) {
            score++;
            ideas.splice(index, 1);
        }
    });

    scoreDisplay.textContent = `Счёт: ${score}`;
    if (gameOver) scoreDisplay.textContent += ' — Хаос победил!';

    requestAnimationFrame(gameLoop);
}

function checkCollision(a, b) {
    return a.x < b.x + 30 && a.x + a.width > b.x && a.y < b.y + 30 && a.y + a.height > b.y;
}

document.addEventListener('keydown', e => {
    if (e.key === ' ' && !player.jumping) {
        player.dy = -10;
        player.jumping = true;
    }
});
