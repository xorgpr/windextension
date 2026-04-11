// Загружаем текущий вес при открытии страницы
chrome.storage.local.get(['riderWeight'], (result) => {
    document.getElementById('weightInput').value = result.riderWeight || 65;
});

// Сохраняем при нажатии на кнопку
document.getElementById('save').addEventListener('click', () => {
    const weight = document.getElementById('weightInput').value;
    chrome.storage.local.set({ riderWeight: weight }, () => {
        alert('Настройки сохранены! Обновите страницу с прогнозом.');
    });
});