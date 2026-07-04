const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const overlay = document.getElementById("overlay");
const startBtn = document.getElementById("startBtn");
const overlayTitle = document.getElementById("overlayTitle");
const overlaySub = document.getElementById("overlaySub");
const scoreBoard = document.getElementById("scoreBoard");
const winScreen = document.getElementById("winScreen");

// Настройки игры
const targetScore = 1;
let score = 0;
let gameStatus = "IDLE"; // IDLE, PLAYING, GAMEOVER, WIN
const myPhoto = new Image();
myPhoto.src = "/assets/images/me.png";
// Параметры "птички" (самолетика)
const bird = {
    x: 50,
    y: 200,
    width: 34,
    height: 24,
    gravity: 0.25,
    velocity: 0,
    jump: -4.6
};

// Трубы (препятствия)
let pipes = [];
const pipeWidth = 50;
const pipeGap = 120; // Расстояние между верхней и нижней трубой (чем больше, тем легче)
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
    
    // ВАЖНО: сохраняем прогресс, открывая День 3 в главном меню
    localStorage.setItem("questLastPassedDay", 2); // Уровень 2 официально пройден    
    winScreen.style.display = "flex";
    if (navigator.vibrate) navigator.vibrate([100, 50, 100, 50, 300]);
}

// Прыжок
function makeJump() {
    if (gameStatus === "PLAYING") {
        bird.velocity = bird.jump;
        if (navigator.vibrate) navigator.vibrate(10);
    }
}

// Управление кнопкой и тапом по экрану
startBtn.addEventListener("click", (e) => {
    e.stopPropagation(); // Чтобы тап по кнопке не вызывал прыжок сразу
    startGame();
});
window.addEventListener("touchstart", makeJump);
window.addEventListener("mousedown", makeJump); // Для теста на ПК

// Главный игровой цикл
function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (gameStatus === "PLAYING") {
        // Физика птички
        bird.velocity += bird.gravity;
        bird.y += bird.velocity;

        // Проверка падения на землю или вылета за потолок
        if (bird.y + bird.height > canvas.height || bird.y < 0) {
            gameOver();
        }

        // Спавн труб
        spawnTimer++;
        if (spawnTimer % 100 === 0) {
            // Случайная высота верхней трубы
            const minH = 50;
            const maxH = canvas.height - pipeGap - 50;
            const topHeight = Math.floor(Math.random() * (maxH - minH)) + minH;
            
            pipes.push({
                x: canvas.width,
                topHeight: topHeight,
                passed: false
            });
        }

        // Движение и отрисовка труб
        for (let i = pipes.length - 1; i >= 0; i--) {
            pipes[i].x -= pipeSpeed;

            // Рисуем верхнюю трубу (сделаем фиолетовой в неоновом стиле)
            ctx.fillStyle = "#8be9fd";
            ctx.fillRect(pipes[i].x, 0, pipeWidth, pipes[i].topHeight);

            // Рисуем нижнюю трубу
            const bottomY = pipes[i].topHeight + pipeGap;
            ctx.fillStyle = "#ff79c6";
            ctx.fillRect(pipes[i].x, bottomY, pipeWidth, canvas.height - bottomY);

            // Проверка коллизий
            if (
                bird.x + bird.width > pipes[i].x &&
                bird.x < pipes[i].x + pipeWidth &&
                (bird.y < pipes[i].topHeight || bird.y + bird.height > bottomY)
            ) {
                gameOver();
            }

            // Начисление очков
            if (!pipes[i].passed && pipes[i].x + pipeWidth < bird.x) {
                pipes[i].passed = true;
                score++;
                scoreBoard.innerText = `Очки: ${score} / ${targetScore}`;
                
                if (score >= targetScore) {
                    winGame();
                }
            }

            // Удаление труб вышедших за экран
            if (pipes[i].x + pipeWidth < 0) {
                pipes.splice(i, 1);
            }
        }
    }

    // Рисуем птичку (Самолётик / Эмодзи)
    // Вместо сложного спрайта мы рисуем эмодзи самолета, это стильно и без багов с путями!
    ctx.drawImage(myPhoto, bird.x, bird.y, bird.width, bird.height);

    requestAnimationFrame(gameLoop);
}

// Запуск анимации
gameLoop();