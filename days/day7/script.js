const deductionBoard = document.getElementById('deductionBoard');
const studyInPink = document.getElementById('studyInPink');
const caseNumber = document.getElementById('caseNumber');
const riddleText = document.getElementById('riddleText');
const deductionInput = document.getElementById('deductionInput');
const submitDeduction = document.getElementById('submitDeduction');
const errorMsg = document.getElementById('errorMsg');
const evidenceList = document.getElementById('evidenceList');

// 5 ЭТАПОВ ДЕДУКЦИИ (Усложненные загадки в стиле Шерлока)
const stages = [
    {
        id: "УЛИКА №1: ГЕОГРАФИЧЕСКАЯ АНОМАЛИЯ",
        hint: "Зимний праздник, подвергшийся воздействию нетипично высоких температур. Локация, где был зафиксирован высокий уровень понимания и дыма.",
        answer: "БАЛКОН",
        errorInfo: "Ошибка. Думай о локации."
    },
    {
        id: "УЛИКА №2: БРИТАНСКОЕ НАСЛЕДСТВО",
        hint: "Мы прилетели на Кипр вместе с Назаром, нас ровно 400, и теперь мы очень хотим попасть в банк. Кто мы?",
        answer: "ПАУНДЫ",
        errorInfo: "Иногда нужно вспомнить начало."
    },
    {
        id: "УЛИКА №3: ПАРАДОКДавС",
        hint: "Я нахожусь на этаже, где из 50 человек работает только 5, и мы просто смотрим футбол. А моя собеседница кто она ?",
        answer: "ДАША",
        errorInfo: "Сконцентрируйся на звездах."
    },
    {
        id: "УЛИКА №4: ФИЗИЧЕСКИЙ БАРЬЕР",
        hint: "Короткий звуковой сигнал, меняющий семантику в зависимости от контекста: от радости до удивления. Твой личный зашифрованный код.",
        answer: "УГУМ",
        errorInfo: "Дедукция дала сбой. Что нас разделяло? Пространство между нами."
    },
    {
        id: "УЛИКА №5: АБСОЛЮТ",
        hint: "Элементарная логика. Если исключить переменные локаций, звуков, времени и барьеров — остается ядро. Финальный конструкт из двух букв, ради которого всё было начато.",
        answer: "МЫ",
        errorInfo: "Слишком сложно мыслишь. Отбрось всё лишнее. Из-за кого все ссоры и паузы остаются позади?"
    }
];

let currentStage = 0;

function loadStage() {
    const stage = stages[currentStage];
    caseNumber.innerText = stage.id;
    riddleText.innerText = `«${stage.hint}»`;
    deductionInput.value = "";
    errorMsg.innerText = "";
    deductionInput.focus();
}

function checkAnswer() {
    const userVal = deductionInput.value.trim().toUpperCase();
    const stage = stages[currentStage];

    if (userVal === stage.answer) {
        // Правильный ответ
        const tag = document.createElement('span');
        tag.className = 'evidence-tag';
        tag.innerText = stage.answer;
        
        if (currentStage === stages.length - 1) {
            tag.classList.add('final'); // Выделяем последнее, главное слово
        }
        evidenceList.appendChild(tag);

        currentStage++;

        if (currentStage < stages.length) {
            // Переход к следующей загадке
            errorMsg.style.color = "#d4af37";
            errorMsg.innerText = "Дедукция верна. Открываю следующий слой.";
            setTimeout(loadStage, 1400);
        } else {
            // ФИНАЛ: Переход к сцене с таблетками (Этюд в розовых тонах)
            errorMsg.style.color = "#fff";
            errorMsg.innerText = "ДЕЛО ЗАКРЫТО. ВСЕ ПАТТЕРНЫ СОБРАНЫ.";
            deductionInput.disabled = true;
            submitDeduction.disabled = true;
            
            setTimeout(() => {
                deductionBoard.classList.add('hidden');
                setTimeout(() => {
                    studyInPink.classList.add('show');
                }, 600);
            }, 1800);
        }
    } else {
        // Ошибка ввода
        errorMsg.style.color = "#cc0000";
        errorMsg.innerText = stage.errorInfo;
        deductionInput.classList.add('shake');
        setTimeout(() => deductionInput.classList.remove('shake'), 400);
    }
}

submitDeduction.addEventListener('click', checkAnswer);
deductionInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') checkAnswer();
});

// Логика флаконов (таблеток)
document.getElementById('redPill').addEventListener('click', () => {
    studyInPink.innerHTML = `
        <h2 class="sherlock-title" style="color: #cc0000;">ИГРА НАЧАЛАСЬ</h2>
        <div class="divider"></div>
        <p class="final-speech" style="text-align: center;">Правильный выбор. Секретные материалы открываются...</p>`;
    localStorage.setItem("questLastPassedDay", 7);
    setTimeout(() => {
    window.location.href = '../../index.html';
    }, 6000);
});

document.getElementById('bluePill').addEventListener('click', () => {
    studyInPink.innerHTML = `
        <h2 class="sherlock-title" style="color: #555;">СКУКА...</h2>
        <div class="divider"></div>
        <p class="final-speech" style="text-align: center;">Дело закрыто. Мы возвращаемся на Бейкер-стрит.</p>`;
    setTimeout(() => {
        document.body.style.filter = "grayscale(1) brightness(0.4)";
    }, 1500);
});

// Запуск дедукции
loadStage();