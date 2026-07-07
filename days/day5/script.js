// НАСТРОЙКА ДАТ ДЛЯ КАЖДОЙ ИЗ 8 ФОТОГРАФИЙ
const correctDates = {
    1: { d: 17, m: 12, y: 2017 }, 
    2: { d: 17, m: 2,  y: 2021 }, 
    3: { d: 5,  m: 5,  y: 2022 }, 
    4: { d: 16, m: 2,  y: 2024 }, 
    5: { d: 24, m: 1,  y: 2025 }, 
    6: { d: 29, m: 10, y: 2025 },
    7: { d: 3,  m: 1,  y: 2026 },  
    8: { d: 25, m: 2,  y: 2026 }  
};

// Хранилище статуса взлома для всех 8 карточек
let statusList = { 1: false, 2: false, 3: false, 4: false, 5: false, 6: false, 7: false, 8: false };

function unlockPhoto(id) {
    // Получаем значения из трех полей ввода конкретной карточки
    const inputDay = parseInt(document.getElementById(`day${id}`).value);
    const inputMonth = parseInt(document.getElementById(`month${id}`).value);
    const inputYear = parseInt(document.getElementById(`year${id}`).value);
    
    const target = correctDates[id];
    
    // Строгая проверка даты
    if (inputDay === target.d && inputMonth === target.m && inputYear === target.y) {
        statusList[id] = true;
        
        // Снимаем блюр с фото
        const card = document.getElementById(`card${id}`);
        card.classList.remove('locked');
        card.classList.add('unlocked');
        
        // Показываем секретную записку
        document.getElementById(`msg${id}`).style.display = 'block';
        
        checkFinalStatus();
    } else {
        alert(">> ОШИБКА: СИНХРОНИЗАЦИЯ СБОИТ. ДАННЫЕ ВРЕМЕНИ НЕ СОВПАДАЮТ.");
    }
}

function checkFinalStatus() {
    // Проверяем, что абсолютно ВСЕ 8 карточек успешно открыты
    const allUnlocked = Object.values(statusList).every(status => status === true);
    
    if (allUnlocked) {
        document.getElementById('finalSection').style.display = 'block';
    }
}

function finishDay5() {
    document.getElementById('successModal').style.display = 'flex';
    localStorage.setItem('day5_passed', 'true');
}

function goBackHub() {
    window.location.href = '../../index.html';
}