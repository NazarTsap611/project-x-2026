const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const overlay = document.getElementById("overlay");
const startBtn = document.getElementById("startBtn");
const overlayTitle = document.getElementById("overlayTitle");
const overlaySub = document.getElementById("overlaySub");
const scoreBoard = document.getElementById("scoreBoard");
const winScreen = document.getElementById("winScreen");

// Настройки игры
const targetScore = 15;
let score = 0;
let gameStatus = "IDLE"; // IDLE, PLAYING, GAMEOVER, WIN

let isPhotoLoaded = false;
const myPhoto = new Image();

// ВНИМАНИЕ: Если на гитхабе файл называется me.jpg или me.PNG — измени расширение тут!
myPhoto.src = "../../assets/images/me.png?v=3";
myPhoto.onload = () => {
    isPhotoLoaded = true;
};
myPhoto.onerror = () => {
    console.error("Ошибка: Не удалось найти картинку по пути /assets/images/me.png");
};

// Параметры "птички" (твоего лица)
const bird = {
    x: 70,
    y: 220,
    width: 35,  // Сделали квадратным, чтобы лицо
    height: 35, // не сплющивалось
    gravity: 0.25,
    velocity: 0,
    jump: -4.6
};

// Трубы (препятствия)
let pipes = [];
const pipeWidth = 50;
const pipeGap = 110; // Слегка увеличили зазор, так как лицо шире самолетика
const pipeSpeed = 2;
let spawnTimer = 0;

// Очистка / Старт игры
function resetGame() {
    bird.y = 200;
    bird.velocity = 0;
    pipes = [];
    score = 0;
    spawnTimer = 0;
    scoreBoard.innerText = `Очки: 0 / ${targetScore}`;
}

function startGame() {
    resetGame();
    gameStatus = "PLAYING";
    overlay.style.display = "none";
}

function gameOver() {
    gameStatus = "GAMEOVER";
    overlayTitle.innerText = "💥 Упс! Столкновение";
    overlaySub.innerText = `Ты набрала ${score} очков. Попробуем еще раз?`;
    startBtn.innerText = "ПОВТОРИТЬ";
    overlay.style.display = "flex";
    if (navigator.vibrate) navigator.vibrate(300);
}

function winGame() {
    gameStatus = "WIN";
    localStorage.setItem("questLastPassedDay", 2); // Уровень 2 официально пройден    
    winScreen.style.display = "flex";
    if (navigator.vibrate) navigator.vibrate([100, 50, 100, 50, 300]);
}

// Прыжок
function makeJump(e) {
    if (gameStatus === "PLAYING") {
        bird.velocity = bird.jump;
        if (navigator.vibrate) navigator.vibrate(15);
    }
}

// НАДЕЖНОЕ УПРАВЛЕНИЕ ДЛЯ СМАРТФОНОВ И ПК
startBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    e.preventDefault();
    startGame();
});

// Клик по самому холсту на мобилках вызывает прыжок (предотвращает баги браузеров)
canvas.addEventListener("touchstart", (e) => {
    e.preventDefault(); // Отменяет ненужный скролл страницы при тапе
    makeJump();
}, { passive: false });

canvas.addEventListener("mousedown", makeJump); // Для ПК

// Главный игровой цикл
function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (gameStatus === "PLAYING") {
        bird.velocity += bird.gravity;
        bird.y += bird.velocity;

        if (bird.y + bird.height > canvas.height || bird.y < 0) {
            gameOver();
        }

        spawnTimer++;
        if (spawnTimer % 100 === 0) {
            const minH = 50;
            const maxH = canvas.height - pipeGap - 50;
            const topHeight = Math.floor(Math.random() * (maxH - minH)) + minH;
            
            pipes.push({
                x: canvas.width,
                topHeight: topHeight,
                passed: false
            });
        }

        for (let i = pipes.length - 1; i >= 0; i--) {
            pipes[i].x -= pipeSpeed;

            ctx.fillStyle = "#8be9fd";
            ctx.fillRect(pipes[i].x, 0, pipeWidth, pipes[i].topHeight);

            const bottomY = pipes[i].topHeight + pipeGap;
            ctx.fillStyle = "#ff79c6";
            ctx.fillRect(pipes[i].x, bottomY, pipeWidth, canvas.height - bottomY);

            if (
                bird.x + bird.width > pipes[i].x &&
                bird.x < pipes[i].x + pipeWidth &&
                (bird.y < pipes[i].topHeight || bird.y + bird.height > bottomY)
            ) {
                gameOver();
            }

            if (!pipes[i].passed && pipes[i].x + pipeWidth < bird.x) {
                pipes[i].passed = true;
                score++;
                scoreBoard.innerText = `Очки: ${score} / ${targetScore}`;
                
                if (score >= targetScore) {
                    winGame();
                }
            }

            if (pipes[i].x + pipeWidth < 0) {
                pipes.splice(i, 1);
            }
        }
    }

    // ОТРИСОВКА ПТИЧКИ С ХИТРОЙ ПРОВЕРКОЙ
    if (isPhotoLoaded) {
        ctx.drawImage(myPhoto, bird.x, bird.y, bird.width, bird.height);
    } else {
        // Запасной вариант: пока фотка качается, рисуем временный кружок, чтобы игра не крашилась
        ctx.fillStyle = "#ff79c6";
        ctx.beginPath();
        ctx.arc(bird.x + bird.width/2, bird.y + bird.height/2, bird.width/2, 0, Math.PI*2);
        ctx.fill();
    }

    requestAnimationFrame(gameLoop);
}

gameLoop();