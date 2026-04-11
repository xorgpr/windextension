function getKiteSize(wind, gust, riderWeight = 65) {
    const BASE_WEIGHT = 75;
    
    // Официальная таблица Cabrinha Moto X для 75кг
    const kiteChart = [
        { size: 4,  min: 26, max: 39 },
        { size: 5,  min: 24, max: 37 },
        { size: 6,  min: 21, max: 35 },
        { size: 7,  min: 19, max: 33 },
        { size: 8,  min: 15, max: 30 },
        { size: 9,  min: 13, max: 28 },
        { size: 10, min: 12, max: 25 },
        { size: 11, min: 11, max: 22 },
        { size: 12, min: 9,  max: 20 },
        { size: 14, min: 7,  max: 17 },
    ];

    if (!wind || !gust) return "Нет данных";

    // 1. Адаптация таблицы под вес райдера
    const ratio = riderWeight / BASE_WEIGHT;
    const weightFactor = Math.pow(ratio, 0.75); 

    const personalChart = kiteChart.map(k => ({
        size: k.size,
        min: k.min * weightFactor,
        max: k.max * weightFactor
    }));

    // 2. Фильтруем подходящие кайты
    // Кайт подходит, если:
    // - Текущий ветер выше его минимума (он потянет)
    // - Порыв ветра ниже его максимума (его не вывернет/не унесет тебя)
    let validKites = personalChart.filter(k => 
        wind >= k.min && 
        gust <= k.max
    );

    if (validKites.length === 0) {
        if (wind < personalChart[personalChart.length - 1].min) return "~";
        return "!!!";
    }

    // 3. Сортируем от меньшего к большему
    validKites.sort((a, b) => a.size - b.size);

    // 4. Формируем строку с результатами
    const resultStrings = validKites.map(k => {
        let warning = "";
        
        // Процент загрузки кайта по порыву
        const loadFactor = gust / k.max;

        if (loadFactor > 0.95) {
            warning = " !!";
        } else if (loadFactor > 0.85) {
            warning = " !";
        } else if (loadFactor < 0.6) {
            warning = " *";
        }

        return `${k.size}${warning}`;
    });

    return resultStrings.join('<br>');
}

// ПРИМЕР: 
// При ветре 21 и порыве 26 для 65кг выведет:
// 6m
// 7m ⚠️

/*function getKiteSize(wind, gust, riderWeight = 65, preferBig = false) {
    const BASE_WEIGHT = 75;
    
    // Официальная таблица Moto X для 75кг
    const kiteChart = [
        { size: 4,  min: 26, max: 39 },
        { size: 5,  min: 24, max: 37 },
        { size: 6,  min: 21, max: 35 },
        { size: 7,  min: 19, max: 33 },
        { size: 8,  min: 15, max: 30 },
        { size: 9,  min: 13, max: 28 },
        { size: 10, min: 12, max: 25 },
        { size: 11, min: 11, max: 22 },
        { size: 12, min: 9,  max: 20 },
        { size: 14, min: 7,  max: 17 },
    ];

    if (!wind || !gust) return null;

    // 1. Адаптация таблицы под вес
    const weightFactor = Math.pow(riderWeight / BASE_WEIGHT, 0.75); 
    const personalChart = kiteChart.map(k => ({
        size: k.size,
        min: k.min * weightFactor,
        max: k.max * weightFactor
    }));

    // 2. Находим ВСЕ кайты, которые тянут в этот ветер и безопасны на порывах
    // Мы фильтруем так: базовый ветер выше минимума И порыв ниже максимума
    let validKites = personalChart.filter(k => 
        wind >= k.min && 
        gust <= k.max
    );

    // Если ничего не подошло (слишком слабо или слишком сильно)
    if (validKites.length === 0) {
        if (wind < personalChart[personalChart.length - 1].min) return 'no wind';
        return '⚠️ Overpower';
    }

    // 3. Формируем массив результатов с оценкой рисков
    const results = validKites.map(k => {
        let warning = '';
        // Если порыв занимает более 85% рабочего диапазона для твоего веса
        if (gust > k.max * 0.85) warning = '⚠️';
        if (gust > k.max * 0.95) warning = '⚠️‼️';
        
        return {
            size: k.size,
            label: k.size + 'm' + (warning ? ' ' + warning : ''),
            isRisky: warning !== ''
        };
    });

    // 4. Сортируем: большие в начале
    results.sort((a, b) => b.size - a.size);

    // 5. Выбираем "Главный совет" на основе флага
    // Если preferBig = true, берем самый большой (для прыжков/лайтвинда)
    // Если false, берем самый маленький (безопасный/комфортный)
    const recommended = preferBig ? results[0] : results[results.length - 1];

    return {
        recommended: recommended.label,
        allSizes: results.map(r => r.label),
        raw: results // Для отладки
    };
}*/

// ПРИМЕР ИСПОЛЬЗОВАНИЯ:
// const advice = getKiteSize(21, 26, 65, true);
// console.log(advice.recommended); // "7m"
// console.log(advice.allSizes);   // ["7m", "6m"]

/*function getKiteSize(wind, gust, riderWeight = 65) {
    const BASE_WEIGHT = 75;
    
    // Официальная таблица Moto X для 75кг
    const kiteChart = [
        { size: 4,  min: 26, max: 39 },
        { size: 5,  min: 24, max: 37 },
        { size: 6,  min: 21, max: 35 },
        { size: 7,  min: 19, max: 33 },
        { size: 8,  min: 15, max: 30 },
        { size: 9,  min: 13, max: 28 },
        { size: 10, min: 12, max: 25 },
        { size: 11, min: 11, max: 22 },
        { size: 12, min: 9,  max: 20 },
        { size: 14, min: 7,  max: 17 },
    ];

    if (!wind || !gust) return null;

    // 1. Учитываем вес сразу (сдвигаем ветровые диапазоны)
    // Чем легче райдер, тем раньше для него наступает предел кайта
    const ratio = riderWeight / BASE_WEIGHT;
    const weightFactor = Math.pow(ratio, 0.75); 

    // Создаем персональную таблицу для 65кг
    const personalChart = kiteChart.map(k => ({
        size: k.size,
        min: k.min * weightFactor,
        max: k.max * weightFactor
    }));

    // 2. Ищем все кайты, в диапазон которых мы попадаем базовым ветром
    let candidates = personalChart.filter(k => wind >= k.min && wind <= k.max);

    if (candidates.length === 0) {
        if (wind < personalChart[personalChart.length - 1].min) return 'no wind';
        return '⚠️'; // Передоз для всех размеров
    }

    // 3. Выбираем лучший кайт. 
    // Обычно это самый большой из безопасных (чтобы прыгать) 
    // ИЛИ средний, если порывы сильные.
    // Давай отсортируем кандидатов от больших к маленьким
    candidates.sort((a, b) => b.size - a.size);

    let best = null;
    let warning = '';

    for (let k of candidates) {
        // Если порыв входит в диапазон - это наш кандидат
        if (gust <= k.max) {
            best = k;
            
            // Если порыв очень близко к краю (90% и выше от max) — добавим знак
            if (gust > k.max * 0.9) {
                warning = ' ⚠️';
            }
            break; // Берем первый (самый большой), который прошел по порыву
        }
    }

    // Если даже самый маленький кайт из подошедших по ветру не держит порыв
    if (!best) {
        // Берем самый маленький из возможных и ставим жесткое предупреждение
        best = candidates[candidates.length - 1];
        warning = ' ⚠️‼️';
    }

    return best.size + 'm' + warning;
}*/

/*function getKiteSize(wind, gust, riderWeight = 65) {
    const BASE_WEIGHT = 75;

    // ОФИЦИАЛЬНАЯ ТАБЛИЦА CABRINHA MOTO X (для 75кг)
    const kiteChart = [
        { size: 4,  min: 26, max: 39 },
        { size: 5,  min: 24, max: 37 },
        { size: 6,  min: 21, max: 35 },
        { size: 7,  min: 19, max: 33 },
        { size: 8,  min: 15, max: 30 },
        { size: 9,  min: 13, max: 28 },
        { size: 10, min: 12, max: 25 },
        { size: 11, min: 11, max: 22 },
        { size: 12, min: 9,  max: 20 },
        { size: 14, min: 7,  max: 17 },
    ];

    const MIN_WIND = 7;
    const MAX_SAFE_GUST = 40; 
    const MAX_SAFE_WIND = 38;

    if (!wind || !gust) return null;
    if (wind < MIN_WIND) return 'no wind';
    if (gust >= MAX_SAFE_GUST || wind > MAX_SAFE_WIND) return '⚠️';

    // 1. Рассчитываем эффективный ветер. 
    // Для Moto X (фрирайд/аллраунд) порывы важны, но не должны обрезать размер слишком сильно.
    const spread = gust - wind;
    const effectiveWind = wind + (spread * 0.3); 

    // 2. Ищем подходящих кандидатов
    const candidates = kiteChart.filter(k => 
        effectiveWind >= k.min && 
        effectiveWind <= k.max &&
        gust <= k.max + 2 // Небольшой допуск по порывам для безопасности
    );

    if (candidates.length === 0) return '⚠️';

    // 3. ГЛАВНОЕ ИСПРАВЛЕНИЕ: Вместо .sort (a.size - b.size)[0] (который брал самый маленький)
    // Ищем кайт, для которого наш ветер ближе к "золотой середине" диапазона.
    const recommended = candidates.sort((a, b) => {
        const midA = (a.min + a.max) / 2;
        const midB = (b.min + b.max) / 2;
        return Math.abs(effectiveWind - midA) - Math.abs(effectiveWind - midB);
    })[0];

    // 4. Корректировка на вес 65кг (райдер легче базы)
    const ratio = riderWeight / BASE_WEIGHT;
    const weightFactor = Math.pow(ratio, 0.75); // Мягкий коэффициент
    
    let adjustedSize = recommended.size * weightFactor;

    // 5. Округление к ближайшему существующему размеру Cabrinha
    const availableSizes = kiteChart.map(k => k.size).sort((a, b) => a - b);
    const finalSize = availableSizes.reduce((prev, curr) => 
        Math.abs(curr - adjustedSize) < Math.abs(prev - adjustedSize) ? curr : prev
    );

    return finalSize + 'm';
}*/

/*function getKiteSize(wind, gust, riderWeight = 65) {
    const BASE_WEIGHT = 75;
    const MIN_WIND = 7;
    const MAX_SAFE_GUST = 38;
    const MAX_SAFE_WIND = 35;
    const MAX_SPREAD = 15; // Максимальная разница между ветром и порывом для безопасного катания

    // Таблица диапазонов (min - комфортный низ, max - предел контроля для 75кг)
    const kiteChart = [
        { size: 4,  min: 26, max: 39 },
        { size: 5,  min: 24, max: 37 },
        { size: 6,  min: 21, max: 35 },
        { size: 7,  min: 19, max: 33 },
        { size: 8,  min: 15, max: 30 },
        { size: 9,  min: 13, max: 28 },
        { size: 10, min: 12, max: 25 },
        { size: 11, min: 11, max: 22 },
        { size: 12, min: 9,  max: 20 },
        { size: 14, min: 7,  max: 17 },
    ];

    if (!wind || !gust) return null;
    if (wind < MIN_WIND) return 'no wind';
    if (gust >= MAX_SAFE_GUST || wind > MAX_SAFE_WIND) return '⚠️ Too Windy';
    
    const spread = gust - wind;
    if (spread >= MAX_SPREAD) return '⚠️ Gusty';

    // 1. Считаем эффективный ветер (учитываем порывы, но мягче)
    // Чем больше разрыв (spread), тем больше мы берем поправку на "рванину"
    let gustInfluence = 0.25; 
    if (spread > 10) gustInfluence = 0.4;
    
    const effectiveWind = wind + (spread * gustInfluence);

    // 2. Коэффициент веса (нормализованный)
    // Возведение в степень 0.7 дает более плавную коррекцию, чем линейная зависимость
    const weightFactor = Math.pow(riderWeight / BASE_WEIGHT, 0.7);

    // 3. Подбираем идеальный размер без учета веса
    // Ищем кайт, где effectiveWind максимально близок к середине (Sweet Spot)
    let bestSizeEntry = null;
    let minDiff = 999;

    kiteChart.forEach(k => {
        const sweetSpot = (k.min + k.max) / 2;
        const diff = Math.abs(effectiveWind - sweetSpot);
        
        // Проверяем, чтобы ветер вообще входил в диапазон кайта
        // И чтобы порыв не убил нас (gust <= k.max)
        if (effectiveWind >= k.min && effectiveWind <= k.max && gust <= k.max) {
            if (diff < minDiff) {
                minDiff = diff;
                bestSizeEntry = k;
            }
        }
    });

    if (!bestSizeEntry) {
        // Если ничего не подошло идеально, берем самый близкий по безопасности
        return 'Check conditions';
    }

    // 4. Применяем вес райдера к выбранному размеру
    let finalSize = bestSizeEntry.size * weightFactor;

    // 5. Округляем до ближайшего существующего размера в линейке
    const availableSizes = kiteChart.map(k => k.size).sort((a, b) => a - b);
    
    function getNearestSize(target) {
        return availableSizes.reduce((prev, curr) => 
            Math.abs(curr - target) < Math.abs(prev - target) ? curr : prev
        );
    }

    let roundedSize = getNearestSize(finalSize);

    // Финальная проверка на передоз из-за веса
    // Если райдер легкий и округление пошло вверх, проверяем не опасно ли это
    if (riderWeight < 70) {
        const checkKite = kiteChart.find(k => k.size === roundedSize);
        if (checkKite && gust > checkKite.max - 2) { 
            // Если порыв слишком близок к краю диапазона для легкого веса — берем на размер меньше
            const idx = availableSizes.indexOf(roundedSize);
            if (idx > 0) roundedSize = availableSizes[idx - 1];
        }
    }

    return roundedSize + 'm';
}*/

/*function getKiteSize(wind, gust, riderWeight = 65) {
    const BASE_WEIGHT = 75;

    const MIN_WIND = 7;
    const MAX_SAFE_GUST = 35;
    const MAX_SAFE_WIND = 38;
    const MAX_SPREAD = 12;

    const kiteChart = [
        { size: 4,  min: 26, max: 39 },
        { size: 5,  min: 24, max: 37 },
        { size: 6,  min: 21, max: 35 },
        { size: 7,  min: 19, max: 33 },
        { size: 8,  min: 15, max: 30 },
        { size: 9,  min: 13, max: 28 },
        { size: 10, min: 12, max: 25 },
        { size: 11, min: 11, max: 22 },
        { size: 12, min: 9,  max: 20 },
        { size: 14, min: 7,  max: 17 },
    ];

    const availableSizes =
        kiteChart
            .map(k => k.size)
            .sort((a, b) => a - b);

    function getNearestBalancedSize(size) {
        let nearest = availableSizes[0];

        for (let s of availableSizes) {
            if (Math.abs(s - size) <
                Math.abs(nearest - size)) {

                nearest = s;
            }
        }

        return nearest;
    }

    if (!wind || !gust)
        return null;

    if (wind < MIN_WIND)
        return 'no wind';

    if (gust >= MAX_SAFE_GUST || wind > MAX_SAFE_WIND)
        return '⚠️';

    const spread = gust - wind;

    if (spread >= MAX_SPREAD)
        return '⚠️';

    let gustFactor = 0.3;

    if (spread >= 8)
        gustFactor = 0.4;

    if (spread >= 10)
        gustFactor = 0.5;

    let effectiveWind =
        wind + spread * gustFactor;

    if (spread >= 9)
        effectiveWind += 1;

    const candidates =
        kiteChart.filter(k =>
            effectiveWind >= k.min &&
            effectiveWind <= k.max &&
            gust <= k.max
        );

    if (candidates.length === 0)
        return null;

    const recommended =
        candidates
            .sort((a, b) =>
                a.size - b.size
            )[0];

    const ratio = riderWeight / BASE_WEIGHT;

    const safeRatio =
        Math.max(0.7,
        Math.min(1.4, ratio));

    const weightFactor = Math.pow(safeRatio, 0.8);

    let adjustedSize = recommended.size * weightFactor;

    adjustedSize = getNearestBalancedSize(adjustedSize);

    if (effectiveWind > 27 && spread >= 8) {
        const index = availableSizes.indexOf(adjustedSize);

        if (index > 0) {
            adjustedSize = availableSizes[index - 1];
        }
    }

    return adjustedSize + 'm';
}
*/