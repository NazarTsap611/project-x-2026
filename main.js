document.addEventListener("DOMContentLoaded", () => {
    // ========================================================
    // 📅 НАСТРОЙКА ДАТЫ СТАРТА КВЕСТА
    // ========================================================
    const START_DATE = new Date(2026, 6, 4); // 4 июля 2026 года
    
    // Считаем текущий день квеста (1, 2, 3...) на основе текущей даты устройства
    const today = new Date();
    const timeDiff = today.getTime() - START_DATE.getTime();
    const currentCalendarDay = Math.floor(timeDiff / (1000 * 60 * 60 * 24)) + 1;

    // Считываем прогресс (какой максимальный уровень она РЕАЛЬНО прошла)
    let lastPassedDay = parseInt(localStorage.getItem("questLastPassedDay")) || 0;
    let maxAllowedDayByProgress = lastPassedDay + 1;

    const totalDays = 8;

    // Названия для дней
    const dayTitles = {
        1: "Старт: Маршрут",
        2: "Flappy Trip",
        3: "Кино-Шифр",
        4: "Лабиринт",
        5: "Пазл",
        6: "Фонарик",
        7: "Финал",
        8: "⭐ Гранд Финал"
    };

    // Проходим по всем 8 дням
    for (let day = 1; day <= totalDays; day++) {
        const linkElement = document.getElementById(`day${day}-link`);
        if (!linkElement) continue;

        const statusSpan = linkElement.querySelector(".day-status");

        // --- ЛОГИКА ДЛЯ СЕКРЕТНОГО 8-ГО ДНЯ ---
        if (day === 8) {
            // Показываем 8-й день только если 7-й день пройден
            if (lastPassedDay >= 7) {
                linkElement.style.display = "flex";
                linkElement.classList.remove("locked");
                linkElement.classList.add("active");
                if (statusSpan) statusSpan.innerText = dayTitles[8];
            } else {
                linkElement.style.display = "none";
                linkElement.classList.add("locked");
                linkElement.classList.remove("active");
                linkElement.addEventListener("click", (e) => e.preventDefault());
            }
            continue; // переходим к следующей итерации цикла
        }

        // --- ЛОГИКА ДЛЯ ДНЕЙ 1-7 ---
        // Условие открытия: прогресс позволяет И наступил нужный календарный день
        if (day <= maxAllowedDayByProgress && day <= currentCalendarDay) {
            // РАЗБЛОКИРОВАНО
            linkElement.classList.remove("locked");
            linkElement.classList.add("active");
            
            if (statusSpan) {
                if (day === maxAllowedDayByProgress && lastPassedDay < day) {
                    statusSpan.innerText = "🔓 Открыто";
                } else {
                    statusSpan.innerText = dayTitles[day] || "✅ Пройдено";
                }
            }
        } else {
            // ЗАБЛОКИРОВАНО
            linkElement.classList.add("locked");
            linkElement.classList.remove("active");
            
            if (statusSpan) {
                if (day > maxAllowedDayByProgress) {
                    statusSpan.innerText = "🔒 Пройди прошлый день";
                } else {
                    statusSpan.innerText = "🔒 Доступно завтра";
                }
            }

            // Отключаем клик по заблокированной ссылке
            linkElement.addEventListener("click", (e) => e.preventDefault());
        }
    }

    // ========================================================
    // 📜 УПРАВЛЕНИЕ ПРАВИЛАМИ (ПОПАП)
    // ========================================================
    const rulesPopup = document.getElementById('rulesPopup');
    const closeRulesBtn = document.getElementById('closeRulesBtn');

    if (rulesPopup && closeRulesBtn) {
        if (!localStorage.getItem('questRulesAccepted')) {
            rulesPopup.style.display = 'flex';
        }

        closeRulesBtn.addEventListener('click', () => {
            rulesPopup.style.opacity = '0';
            rulesPopup.style.transition = 'opacity 0.3s ease';
            setTimeout(() => {
                rulesPopup.style.display = 'none';
            }, 300);
            localStorage.setItem('questRulesAccepted', 'true');
        });
    }
});