// НАСТРОЙКА ОТВЕТОВ ТУТ (строго нижний регистр)
const bassAnswers = {
    input1: "Black Magic",      // Пример артиста
    input2: "The Lodge at Lulworth",    // Пример трека
    input3: "Така, як ти"         // Пример кодового слова/места
};

let currentAudio = null;
let animationFrameId = null;

const canvas = document.getElementById("oscCanvas");
const ctx = canvas.getContext("2d");

// Функция симуляции прыгающего баса на холсте
function drawOscilloscope() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    ctx.strokeStyle = currentAudio ? "#00ff66" : "#30363d";
    ctx.lineWidth = 2;

    const sliceWidth = canvas.width / 20;
    let x = 0;

    for (let i = 0; i < 20; i++) {
        // Если играет музыка — создаем жесткие прыжки "низких частот"
        const amp = currentAudio ? (Math.random() * 40 + 10) : 2;
        const y = (i % 2 === 0) ? (canvas.height / 2 + amp) : (canvas.height / 2 - amp);
        
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);

        x += sliceWidth;
    }

    ctx.lineTo(canvas.width, canvas.height / 2);
    ctx.stroke();
    animationFrameId = requestAnimationFrame(drawOscilloscope);
}
drawOscilloscope(); // Инициализация линии

function playBass(audioId, btn) {
    const audio = document.getElementById(audioId);
    const log = document.getElementById('terminalLog');

    // Сброс всех кнопок
    document.querySelectorAll('.node-btn').forEach(b => {
        if (b !== btn) b.classList.remove('playing');
    });

    // Остановка всех других треков
    document.querySelectorAll('audio').forEach(track => {
        if (track.id !== audioId) track.pause();
    });

    if (audio.paused) {
        // Пытаемся запустить музыку
        let playPromise = audio.play();
        
        if (playPromise !== undefined) {
            playPromise.then(_ => {
                // Если всё хорошо — включаем анимацию
                btn.classList.add('playing');
                currentAudio = audio;
                log.style.color = "#00ff66";
                log.innerText = `» Узел ${audioId.replace('audio', '')} активен. Анализ частот...`;
            })
            .catch(error => {
                // Если браузер заблокировал или файла нет — выводим на экран!
                log.style.color = "#da1b5b";
                log.innerText = `» Ошибка аудио: ${error.message}`;
                console.error("Audio error:", error);
            });
        }
    } else {
        audio.pause();
        btn.classList.remove('playing');
        currentAudio = null;
        log.style.color = "#8b949e";
        log.innerText = "» Воспроизведение остановлено.";
    }
}

function verifySubBass() {
    // Получаем ввод пользователя, переводим в нижний регистр и сжимаем множественные пробелы в один
    const i1 = document.getElementById('input1').value.trim().toLowerCase().replace(/\s+/g, ' ');
    const i2 = document.getElementById('input2').value.trim().toLowerCase().replace(/\s+/g, ' ');
    const i3 = document.getElementById('input3').value.trim().toLowerCase().replace(/\s+/g, ' ');
    const log = document.getElementById('terminalLog');

    // Переводим твои правильные ответы тоже в нижний регистр и убираем лишние пробелы для идеального сравнения
    const ans1 = bassAnswers.input1.trim().toLowerCase().replace(/\s+/g, ' ');
    const ans2 = bassAnswers.input2.trim().toLowerCase().replace(/\s+/g, ' ');
    const ans3 = bassAnswers.input3.trim().toLowerCase().replace(/\s+/g, ' ');

    if (i1 === ans1 && i2 === ans2 && i3 === ans3) {
        log.style.color = "#00ff66";
        log.innerText = "» Резонанс 100%. Доступ открыт.";
        
        // Останавливаем музыку
        if (currentAudio) currentAudio.pause();
        currentAudio = null;

        // Сохраняем прохождение Дня 3
        localStorage.setItem("questLastPassedDay", 3);

        // Показываем финал
        document.getElementById('bassSuccess').style.display = 'block';
        document.querySelectorAll('.bass-input').forEach(input => input.disabled = true);
        if (navigator.vibrate) navigator.vibrate([100, 50, 100, 50, 400]);
    } else {
        log.style.color = "#da1b5b";
        log.innerText = "» Деструктивный резонанс. Частоты не совпадают.";
        if (navigator.vibrate) navigator.vibrate(400);
    }
}