function windfinder() {
    // 2. Get all lines in the table
    const rows = document.querySelectorAll('.fc-table-horizon');

    rows.forEach(row => {
        const wsText = row.querySelector('.cell-ws .unit')?.innerText;
        const wgText = row.querySelector('.cell-wg .unit')?.innerText;
        const thText = row.querySelector('.cell-th .unit')?.innerText;

        if (wsText && wgText) {
            const wind = parseInt(wsText);
            const gust = parseInt(wgText);
            const kite = wind + '|' + gust;
            
            const tide = parseInt(thText);

            // 3. Add custom cell
            let kiteCell = row.querySelector('.custom-kite-cell');
            if (!kiteCell) {
                kiteCell = document.createElement('div');
                kiteCell.className = 'custom-kite-cell';
                row.appendChild(kiteCell);
            }

            // Динамический цвет: если скрипт вернул знак ⚠️ (опасно) — делаем красным
            const textColor = kite === '⚠️' ? 'red' : 'green';

            // 4. customize
            kiteCell.style.cssText = `
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 13px;
                font-weight: bold;
                color: ${textColor};
            `;

            kiteCell.innerHTML = kite && (tide > 2.5 || !tide) ? `${kite}` : '—';
        }
    });
}

const observer = new MutationObserver(windfinder);
observer.observe(document.body, { childList: true, subtree: true });
windfinder();
