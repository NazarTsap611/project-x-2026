let currentActiveSlot = null;
let colors = { 1: null, 2: null, 3: null };

// Секретный оттенок Пыльной розы (R=184, G=107, B=123)
const targetColor = { r: 184, g: 107, b: 123 };

// Шаг 1: Выбор Оксида
function selectOxide(percentage) {
    if (percentage === 6) { // Правильный оксид — 6%
        alert("Оксид 6% принят. Реакция пошла! Оттенок-цель проявлен.");
        document.getElementById('blurOverlay').style.opacity = '0';
        setTimeout(() => {
            document.getElementById('blurOverlay').style.display = 'none';
        }, 500);
        document.getElementById('oxideSection').style.display = 'none';
        document.getElementById('slotsSection').style.display = 'flex';
    } else {
        alert("Этим оксидом такой тон не поднять! Оттенок сгорит или уйдет в затемнение. Думай как технолог!");
    }
}

function openCamera(slotNum) {
    currentActiveSlot = slotNum;
    document.getElementById('cameraInput').click();
}

document.getElementById('cameraInput').addEventListener('change', function(e) {
    if (!e.target.files.length) return;
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = function(event) {
        const img = new Image();
        img.onload = function() { setupCanvas(img); };
        img.src = event.target.result;
    };
    reader.readAsDataURL(file);
});

function setupCanvas(img) {
    const modal = document.getElementById('cropperModal');
    const canvas = document.getElementById('canvasPreview');
    const ctx = canvas.getContext('2d');
    
    const maxW = 500;
    const scale = maxW / img.width;
    canvas.width = maxW;
    canvas.height = img.height * scale;
    
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    modal.style.display = 'flex';
    
    canvas.onclick = function(event) {
        const rect = canvas.getBoundingClientRect();
        const x = (event.clientX - rect.left) * (canvas.width / rect.width);
        const y = (event.clientY - rect.top) * (canvas.height / rect.height);
        const pixel = ctx.getImageData(x, y, 1, 1).data;
        
        savePickedColor({ r: pixel[0], g: pixel[1], b: pixel[2] });
    };
}

function savePickedColor(rgb) {
    colors[currentActiveSlot] = rgb;
    const preview = document.getElementById(`preview${currentActiveSlot}`);
    preview.style.backgroundColor = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
    preview.innerHTML = '';
    
    document.getElementById('cropperModal').style.display = 'none';
    document.getElementById('cameraInput').value = '';
    
    if (colors[1] && colors[2] && colors[3]) {
        document.getElementById('labContainer').style.display = 'block';
        updateMix();
    }
}

// ВАУ-ЭФФЕКТ: Смешивание перекрашивает всю страницу!
function updateMix() {
    if (!colors[1] || !colors[2] || !colors[3]) return;

    let m1 = parseInt(document.getElementById('mix1').value);
    let m2 = parseInt(document.getElementById('mix2').value);
    let m3 = parseInt(document.getElementById('mix3').value);
    
    // ПРОВЕРКА НА СЖИГАНИЕ ВОЛОС (Ловушка на 100%)
    if (m1 === 100 || m2 === 100 || m3 === 100) {
        triggerBurnEffect();
        return;
    }
    
    let total = m1 + m2 + m3;
    if (total === 0) total = 1;
    
    let p1 = m1 / total; let p2 = m2 / total; let p3 = m3 / total;
    
    document.getElementById('val1').innerText = Math.round(p1*100) + '%';
    document.getElementById('val2').innerText = Math.round(p2*100) + '%';
    document.getElementById('val3').innerText = Math.round(p3*100) + '%';
    
    let r = Math.round(colors[1].r * p1 + colors[2].r * p2 + colors[3].r * p3);
    let g = Math.round(colors[1].g * p1 + colors[2].g * p2 + colors[3].g * p3);
    let b = Math.round(colors[1].b * p1 + colors[2].b * p2 + colors[3].b * p3);
    
    // МЕНЯЕМ ФОН ВСЕГО БОДИ (с прозрачностью, чтобы не перекрыть текст)
    document.body.style.background = `rgba(${r}, ${g}, ${b}, 0.75)`;
    document.body.dataset.currentMixRgb = JSON.stringify({r, g, b});
}

function triggerBurnEffect() {
    const burn = document.getElementById('burnOverlay');
    burn.style.display = 'flex';
    setTimeout(() => {
        burn.style.display = 'none';
        document.getElementById('mix1').value = 33;
        document.getElementById('mix2').value = 33;
        document.getElementById('mix3').value = 34;
        updateMix();
    }, 2000);
}

function closeModal() { document.getElementById('cropperModal').style.display = 'none'; }

function checkResult() {
    const current = JSON.parse(document.body.dataset.currentMixRgb);
    
    // Считаем погрешность
    let distance = Math.sqrt(
        Math.pow(current.r - targetColor.r, 2) +
        Math.pow(current.g - targetColor.g, 2) +
        Math.pow(current.b - targetColor.b, 2)
    );
    
    // МЫ ТУТ: Поставили 65 вместо 45. Это дает приятный небольшой разброс!
    if (distance < 65) {
        document.getElementById('successModal').style.display = 'flex';
        localStorage.setItem("questLastPassedDay", 4);

    } else {
        alert("Неа... Британские стилисты качают головой. Оттенок ушел не туда. Поиграй с ползунками или пересними пигменты!");
    }
}

// Новая функция для кнопки в сертификате
function goBackToHub() {
    alert("Пакуем чемоданы, корона загружена в багаж! Возвращаемся в главное меню... 😉");
    window.location.href = '../../index.html';
}

function toggleHint() {
    const hintText = document.getElementById('hintText');
    const hintBtn = document.getElementById('hintBtn');
    
    if (hintText.style.display === 'none') {
        hintText.style.display = 'block';
        hintBtn.innerText = '❌ Закрыть подсказку';
    } else {
        hintText.style.display = 'none';
        hintBtn.innerText = '❓ Подсказка технолога';
    }
}