// Правильный ответ на английском или русском (система примет оба варианта для отказоустойчивости)
// Правильная логика: 
// 1. Соло: Киев (30E) и Львов (24E). Меньше долгота у Львова -> ЛЬВОВ
// 2. Общие: Лондон (51N), Амстердам (52N), Будапешт (47N), Никосия (35N). Макс широта -> АМСТЕРДАМ
// 3. Общие: Мин широта -> НИКОСИЯ
const validCombinations = [
    "лондон-амстердам-никосия",
    "london-amsterdam-nicosia"
];

function processDecryption() {
    const inputVal = document.getElementById('decryptInput').value.trim().toLowerCase();
    const consoleLog = document.getElementById('consoleLog');
    
    consoleLog.style.color = "#00ff66";
    consoleLog.innerText = "» Запуск подбора ключа через гео-деривативы...\n» Сканирование сигнатур...";

    setTimeout(() => {
if (validCombinations.includes(inputVal)) {
            consoleLog.innerText = "» [ДОСТУП ПРЕДОСТАВЛЕН]: Хронологический сдвиг подтвержден.\n» База данных Дня 1 разблокирована.\n» Ключ перехода: «AMSTERDAM_CORE»";
            
            document.getElementById('decryptInput').disabled = true;

            const archive = document.getElementById('secretArchive');
            archive.style.display = 'block';
            
            setTimeout(() => {
                archive.scrollIntoView({ behavior: 'smooth' });
            }, 300);

            if (navigator.vibrate) navigator.vibrate([100, 50, 100, 50, 400]);
            localStorage.setItem("questLastPassedDay", 1);
        } else {
            consoleLog.style.color = "#ff3333";
            consoleLog.innerText = "» [ОТКАЗ В ДОСТУПЕ]: Неверная сигнатура маршрута.\n» Введенные узлы не сбалансировали матрицу.\n» Система перезагружена.";
            document.getElementById('decryptInput').value = "";
            if (navigator.vibrate) navigator.vibrate(500);
        }
    }, 1200);
}