const nodesContainer = document.getElementById('nodesContainer');
const svgLayer = document.getElementById('connectionsLayer');
const statusText = document.getElementById('statusText');
const memoryCard = document.getElementById('memoryCard');
const memoryText = document.getElementById('memoryText');
const progressFill = document.getElementById('progressFill');
const strikesUI = [document.getElementById('strike1'), document.getElementById('strike2'), document.getElementById('strike3')];

// 8 РЕАЛЬНЫХ ПАР (16 слов)
const pairsData = [
    { id: 1, words: ['Угум', 'Сигнал'], message: "Для меня твое угум каждый раз значит что-то новое: радость, грусть, удивление." },
    { id: 2, words: ['2.5 месяца', 'Расстояние'], message: "🔒 Ты мне часто говоришь, что это всего лишь расстояние." },
    { id: 3, words: ['Водолей', 'Стрелец'], message: "✨ Мы такие разные, но наши орбиты сошлись идеально." },
    { id: 4, words: ['Рождество', 'Кипр'], message: "☀️ Никогда не забуду тот день." },
    { id: 5, words: ['Поцелуи', 'Подъезд'], message: "❤️ Помнишь, как мы не могли попрощаться?" },
    { id: 6, words: ['Будущее', 'Мы'], message: "🚀 Все ссоры, расстояния и глупые паузы остаются позади." },
    { id: 7, words: ['Поддержка', 'Лондон'], message: "Ну как без этого жить в Лондоне." },
    { id: 8, words: ['Твой смех', 'Радость'], message: "🔊 Когда ты искренне смеешься рядом со мной, любые внешние проблемы и шумы мира просто затихают." }
];

// 34 ФЕЙКОВЫХ СЛОВА-ПОМЕХИ (чтобы в сумме было ровно 50 узлов)
const fakeWords = [
    'Грусть', 'Обиды', 'Тишина', 'Сомнения', 'Холод', 
    'Ошибка', 'Сброс', 'Сбой', 'Помеха', 'Стена', 
    'Хаос', 'Матрица', 'Блок', 'Вирус', 'Назар', 
    'Туман', 'Даша', 'Шум', 'Пыль', 'Пауза', 
    'Тревога', 'Лимит', 'Запрет', 'Контроль', 'Порог', 
    'Разрыв', 'Отношения', 'Усталость', 'Вопрос', 'След', 
    'Паттерн', 'Бой', 'Ноль', 'Сдвиг',
    'Искра', 'Память', 'Код', 'Сеть', 'Пакет', 
    'Доступ', 'Поток', 'Связь', 'Кризис', 'Экран'
];

let nodes = [];
let firstSelected = null;
let solvedPairsCount = 0;
let errorsCount = 0;
let solvedConnections = []; 

function initGame() {
    nodes = [];
    pairsData.forEach(pair => {
        nodes.push({ label: pair.words[0], pairId: pair.id, type: 'real', text: pair.message });
        nodes.push({ label: pair.words[1], pairId: pair.id, type: 'real', text: pair.message });
    });
    fakeWords.forEach(word => { nodes.push({ label: word, pairId: -1, type: 'fake' }); });
    
    renderNodes();
}

function renderNodes() {
    nodesContainer.innerHTML = '';
    nodes.sort(() => Math.random() - 0.5);

    nodes.forEach(node => {
        const el = document.createElement('div');
        el.className = 'node';
        if (node.solved) el.classList.add('solved');
        el.innerText = node.label;
        
        node.el = el;
        el.addEventListener('click', () => handleNodeClick(node));
        nodesContainer.appendChild(el);
    });
    setTimeout(redrawLines, 50);
}

function handleNodeClick(node) {
    if (node.solved) return;

    if (firstSelected === node) {
        node.el.classList.remove('selected');
        firstSelected = null;
        return;
    }

    if (!firstSelected) {
        firstSelected = node;
        node.el.classList.add('selected');
        statusText.innerHTML = `Сканирование: [ <span style="color:#ff79c6">${node.label}</span> ]... Поиск пары.`;
        return;
    }

    const secondSelected = node;
    if (firstSelected.pairId === secondSelected.pairId && firstSelected.type === 'real') {
        handleSuccess(firstSelected, secondSelected);
    } else {
        handleError(firstSelected, secondSelected);
    }
}

function handleSuccess(nodeA, nodeB) {
    nodeA.solved = true; nodeB.solved = true;
    nodeA.el.className = 'node solved'; nodeB.el.className = 'node solved';
    
    solvedConnections.push({ el1: nodeA.el, el2: nodeB.el });
    drawPermanentLine(nodeA.el, nodeB.el);
    
    memoryText.innerHTML = nodeA.text;
    memoryCard.classList.add('show');
    statusText.innerHTML = "<span style='color:#50fa7b;'>Синхронизация успешна. Узел верифицирован.</span>";
    
    firstSelected = null;
    solvedPairsCount++;

    if (solvedPairsCount >= pairsData.length) {
        triggerVictory();
    }
}

function handleError(nodeA, nodeB) {
    nodeA.el.classList.remove('selected');
    nodeA.el.classList.add('error');
    nodeB.el.classList.add('error');
    
    const tempLine = drawLine(nodeA.el, nodeB.el, '#ff5555', true);
    
    errorsCount++;
    updateStrikes();
    statusText.innerHTML = "<span style='color:#ff5555;'>Сбой связи! Неверный паттерн.</span>";
    
    setTimeout(() => {
        nodeA.el.classList.remove('error');
        nodeB.el.classList.remove('error');
        if (tempLine) tempLine.remove();
    }, 500);

    firstSelected = null;

    if (errorsCount >= 3) {
        setTimeout(scrambleUnsolvedNodes, 600);
    }
}

function updateStrikes() {
    for (let i = 0; i < 3; i++) {
        if (i < errorsCount) strikesUI[i].classList.add('active');
        else strikesUI[i].classList.remove('active');
    }
}

function scrambleUnsolvedNodes() {
    errorsCount = 0;
    updateStrikes();
    statusText.innerHTML = "<span style='color:#ffb86c;'>ВНИМАНИЕ! Перестроение защитных блоков 50 узлов...</span>";
    nodesContainer.style.filter = "invert(1) hue-rotate(180deg)";
    setTimeout(() => { nodesContainer.style.filter = "none"; }, 300);
    renderNodes();
}

function triggerVictory() {
    statusText.innerHTML = "✨ <b style='color:#50fa7b; text-shadow: 0 0 10px #50fa7b;'>СЕТЬ ВОССТАНОВЛЕНА. ПЕРЕНОС ДАННЫХ...</b>";
    
    progressFill.style.transition = "width 6s linear";
    progressFill.style.width = "100%";
    localStorage.setItem("questLastPassedDay", 6);

    setTimeout(() => {
    window.location.href = '../../index.html';
    }, 6000);
}

function getCenter(el) {
    const rect = el.getBoundingClientRect();
    const containerRect = svgLayer.getBoundingClientRect();
    return {
        x: rect.left - containerRect.left + rect.width / 2,
        y: rect.top - containerRect.top + rect.height / 2
    };
}

function drawLine(el1, el2, color, isDashed = false) {
    const p1 = getCenter(el1);
    const p2 = getCenter(el2);
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', p1.x); line.setAttribute('y1', p1.y);
    line.setAttribute('x2', p2.x); line.setAttribute('y2', p2.y);
    line.setAttribute('stroke', color);
    line.setAttribute('stroke-width', '1.5');
    if (isDashed) line.setAttribute('stroke-dasharray', '3,3');
    svgLayer.appendChild(line);
    return line;
}

function drawPermanentLine(el1, el2) {
    drawLine(el1, el2, '#50fa7b');
}

function redrawLines() {
    svgLayer.innerHTML = '';
    solvedConnections.forEach(conn => {
        drawPermanentLine(conn.el1, conn.el2);
    });
}
window.addEventListener('resize', redrawLines);

initGame();