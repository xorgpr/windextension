function windguru(riderWeight, kiteChart) {
    const containers = document.querySelectorAll('.obal');

    containers.forEach(container => {
        // --- ШАГ 0: Очистка от предыдущих запусков скрипта ---
        // Ищем и удаляем наши же строки в обеих таблицах
        const oldLegendRow = container.querySelector('.table_legend tr.param.KITESIZE');
        if (oldLegendRow) oldLegendRow.remove();

        const oldDataRow = container.querySelector('.tabulka tr.param.KITESIZE');
        if (oldDataRow) oldDataRow.remove();


        // 1. Ищем строки в таблице Легенды (слева) и Данных (справа)
        const legendWindRow = container.querySelector('.table_legend tr.param.WINDSPD');
        const dataWindRow = container.querySelector('.tabulka tr.param.WINDSPD');
        const dataGustRow = container.querySelector('.tabulka tr.param.GUST');

        if (!legendWindRow || !dataWindRow || !dataGustRow) return;

        // --- ШАГ 1: Обновляем левую колонку (Легенду) ---
        // Клонируем строку ветра, чтобы сохранить нужную высоту и верстку
        const newLegendRow = legendWindRow.cloneNode(true);
        newLegendRow.className = 'param KITESIZE';
        newLegendRow.id = newLegendRow.id.replace('WINDSPD', 'KITESIZE');
        
        // Меняем текст
        const titleCell = newLegendRow.querySelector('td');
        if (titleCell) {
            titleCell.innerHTML = 'Kite Size';
        }
        legendWindRow.parentNode.appendChild(newLegendRow);

        // --- ШАГ 2: Обновляем правую сетку (Данные) ---
        const newDataRow = dataWindRow.cloneNode(true);
        newDataRow.className = 'trow param KITESIZE';
        newDataRow.id = newDataRow.id.replace('WINDSPD', 'KITESIZE');

        const windCells = dataWindRow.querySelectorAll('td');
        const gustCells = dataGustRow.querySelectorAll('td');
        const kiteCells = newDataRow.querySelectorAll('td');

        // Проходимся по каждой ячейке в строке
        kiteCells.forEach((cell, index) => {
            // Очищаем цвета фона, скопированные от скорости ветра
            cell.style.backgroundColor = '';
            
            // Если это узкая ячейка-разделитель (между днями), оставляем её пустой
            if (cell.classList.contains('spacer')) {
                cell.innerHTML = '';
                return;
            }

            // Получаем данные
            const windText = windCells[index]?.innerText;
            const gustText = gustCells[index]?.innerText;

            const wind = parseInt(windText);
            const gust = parseInt(gustText);

            // Если данные есть, считаем кайт
            if (!isNaN(wind) && !isNaN(gust)) {
                const kite = getKiteSize(wind, gust, riderWeight, kiteChart);
                
                // Накатываем стили для ячейки
                cell.innerHTML = kite || '—';
                cell.style.cssText = `
                    text-align: center;
                    font-size: 11px;
                    vertical-align: top;
                `;
            } else {
                cell.innerHTML = '';
            }
        });

        // Добавляем новую строку в конец таблицы данных
        dataWindRow.parentNode.appendChild(newDataRow);
    });
}

chrome.storage.local.get(['riderWeight', 'kiteChart'], (result) => {
	const weight = result.riderWeight || 65;
	const chart = result.kiteChart || undefined;

	setInterval(() => windguru(weight, chart), 2000);
	windguru(weight, chart);
});