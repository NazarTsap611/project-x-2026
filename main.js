document.addEventListener("DOMContentLoaded", () => {
    // ========================================================
    // 📅 НАСТРОЙКА ДАТЫ СТАРТА КВЕСТА
    // Укажи здесь год, месяц (ВНИМАНИЕ: от 0 до 11, где 0-янв, 6-июль) и день старта.
    // Пример для 5 июля 2026 года: new Date(2026, 6, 5)
    // ========================================================
    const START_DATE = new Date(2026, 6, 4); // Поставь свою дату старта!
    
    // Считаем текущий день квеста (1, 2, 3...) на основе текущей даты устройства
    const today = new Date();
    const timeDiff = today.getTime() - START_DATE.getTime();
    const currentCalendarDay = Math.floor(timeDiff / (1000 * 60 * 60 * 24)) + 1;

    // Считываем, какой максимальный уровень она РЕАЛЬНО прошла (сохраняется в играх)
    // По умолчанию пройден день 0 (то есть доступен день 1)
    let lastPassedDay = parseInt(localStorage.getItem("questLastPassedDay")) || 0;
    let maxAllowedDayByProgress = lastPassedDay + 1;

    // Названия для открытых дней
    const dayTitles = {
        1: "Старт: Маршрут",
        2: "Flappy Trip",
        3: "Кино-Шифр",
        4: "Лабиринт",
        5: "Пазл",
        6: "Фонарик",
        7: "Финал"
    };

    // Проверяем статус для каждого из 7 дней
    for (let day = 1; day <= 7; day++) {
        const linkElement = document.getElementById(`day${day}-link`);
        
        if (linkElement) {
            // Условие открытия: 
            // 1. Прогресс позволяет (прошлый день пройден)
            // И
            // 2. На календаре уже наступил этот день (или более поздний)
            if (day <= maxAllowedDayByProgress && day <= currentCalendarDay) {
                // РАЗБЛОКИРОВАНО
                linkElement.classList.remove("locked");
                linkElement.classList.add("active");
                
                const statusSpan = linkElement.querySelector(".day-status");
                if (statusSpan) {
                    statusSpan.innerText = dayTitles[day] || "Доступно";
                }
            } else {
                // ЗАБЛОКИРОВАНО
                linkElement.classList.add("locked");
                linkElement.classList.remove("active");
                
                // Меняем текст подсказки, почему заблокировано
                const statusSpan = linkElement.querySelector(".day-status");
                if (statusSpan) {
                    if (day > maxAllowedDayByProgress) {
                        statusSpan.innerText = "🔒 Пройди прошлый день";
                    } else {
                        statusSpan.innerText = "🔒 Доступно завтра";
                    }
                }

                // Отключаем клик по ссылке
                linkElement.addEventListener("click", (e) => e.preventDefault());
            }
        }
    }
});

const rulesPopup = document.getElementById('rulesPopup');
    const closeRulesBtn = document.getElementById('closeRulesBtn');

    if (rulesPopup && closeRulesBtn) {
        // Проверяем, есть ли запись в памяти телефона
        if (!localStorage.getItem('questRulesAccepted')) {
            // Если записи нет — показываем окно
            rulesPopup.style.display = 'flex';
        }

        closeRulesBtn.addEventListener('click', () => {
            // Прячем окно
            rulesPopup.style.opacity = '0';
            rulesPopup.style.transition = 'opacity 0.3s ease';
            setTimeout(() => {
                rulesPopup.style.display = 'none';
            }, 300);
            
            // ЗАПИСЫВАЕМ В ПАМЯТЬ: больше не показывать!
            localStorage.setItem('questRulesAccepted', 'true');
        });
    }