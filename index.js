// утилиты
function calculateCompressionRatio(original, compressed) {
    const originalSize = JSON.stringify(original).length;
    const compressedSize = compressed.length;

    return Math.round(((originalSize - compressedSize) / originalSize) * 100) + "%";
}


function generateSameDigitsArray(length, digits) {
    const arr = [];

    const source = Array.isArray(digits) ? digits : [digits];

    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * source.length);
        arr.push(source[randomIndex]);
    }

    return arr;
}

function generateRandomArray(length) {
    const arr = [];
    for (let i = 0; i < length; i++) {
        const random = Math.floor(Math.random() * 300) + 1;
        arr.push(random);
    }

    return arr;
}

function generateUnicArray() {
    const arr = [];

    for (let i = 1; i <= 300; i++) {
        for (let j = 0; j < 3; j++) {
            arr.push(i);
        }
    }

    return arr;
}

function testCompression(arrays) {
    const results = [];

    arrays.forEach(originalArray => {
        const serializedArray = serialize(originalArray);

        const ratio = calculateCompressionRatio(originalArray, serializedArray);

        results.push({
            originalArray,
            serializedArray,
            ratio,
        });
    });

    return results;
}

function allValuesEqual(obj) {
    const values = new Set(Object.values(obj));
    return values.size === 1 ? Object.values(obj)[0] : false;
}


function convertToAscii(str) {
    return str.replace(/\d+/g, n => {
        if (n > 126 || [44, 45, 58].includes(n)) return n;
        return String.fromCharCode(n);
    });
}

// основные функции 
function serialize(arr) {

    let str = '';

    let numRepeats = 0;
    let rangeStartIndex = null;
    let rangeLength = 0;
    let rangeRepeats = {};

    const sortedArr = [...arr].sort((a, b) => a - b);
    for (let i = 0; i < sortedArr.length; i++) {


        // Проверка на повторения
        if (sortedArr[i] === sortedArr[i + 1]) {
            rangeRepeats[sortedArr[i]] = (rangeRepeats[sortedArr[i]] || 0) + 1;
            numRepeats++;
        }

        // Проверка на диапозоны
        if (i < sortedArr.length - 1 && (sortedArr[i] + 1 === sortedArr[i + 1])) {
            rangeLength++;
            if (rangeStartIndex === null) rangeStartIndex = i;
        }

        if (i === sortedArr.length - 1 || (i < sortedArr.length - 1 && sortedArr[i] + 1 !== sortedArr[i + 1]) && sortedArr[i] !== sortedArr[i + 1]) {
            finalizeConvertaition();
        }


        function finalizeConvertaition() {
            // Добавляем в строку диапозоны
            if (rangeLength > 1) {

                // Проверка на повторения в диапозоне
                if (Object.keys(rangeRepeats).length > 0) {
                    // Проверка на равное количество повторений у чисел 
                    const areRepeatsEqual = allValuesEqual(rangeRepeats);
                    if (!areRepeatsEqual) {
                        console.log(areRepeatsEqual);
                        for (j = sortedArr[rangeStartIndex]; j <= sortedArr[i]; j++) {
                            str += `${j}${rangeRepeats[j] ? `:${rangeRepeats[j] + 1}` : ''},`;
                        }
                    } else {
                        str += `${sortedArr[rangeStartIndex]}-${sortedArr[i]}:${areRepeatsEqual + 1},`;
                    }
                } else {
                    str += `${sortedArr[rangeStartIndex]}-${sortedArr[i]},`;
                }
            }
            // Добавляем дубликаты 
            else if (numRepeats > 0) {
                str += `${sortedArr[i]}:${numRepeats + 1},`;
            }
            // Добавляем обычные числа
            else if (numRepeats === 0 && rangeLength < 1) {
                str += `${sortedArr[i]},`;
            }

            rangeRepeats = {};
            rangeStartIndex = null;
            rangeLength = 0;
            numRepeats = 0;
        }
    }

    str = convertToAscii(str);

    // удаляем последнюю запятую
    return str.slice(0, -1);
}

function deserialize(str) {
    const arr = [];
    str.split(',').forEach(el => {

        const getNum = s => s.length > 1 ? +s : s.charCodeAt(0);

        if (el.includes(':') && el.includes('-')) {
            const [start, end, count] = el.split(/-|:/);
            const rangeStart = getNum(start);
            const rangeEnd = getNum(end);
            const rangeCount = getNum(count);

            for (let i = rangeStart; i <= rangeEnd; i++) {
                for (let j = 0; j < rangeCount; j++) {
                    arr.push(i);
                }
            }
        } else if (el.includes('-')) {
            const [start, end] = el.split('-');
            const rangeStart = getNum(start);
            const rangeEnd = getNum(end);

            for (let i = rangeStart; i <= rangeEnd; i++) {
                arr.push(i);
            }
        } else if (el.includes(':')) {
            let [num, count] = el.split(':');
            num = getNum(num);
            count = getNum(count);

            for (let i = 0; i < count; i++) {
                arr.push(num);
            }
        } else {
            const num = getNum(el);
            arr.push(num);
        }

    });

    return arr;
}

// простые массивы 
const arr1 = [1, 2, 3, 4, 5];
const arr2 = [1, 1, 3, 3];
const arr3 = [4, 1, 1, 3, 3, 2, 1, 4];

// случайные(с 50, 100 и 500 и 1000 случайных чисел)
const arr4 = generateRandomArray(50);
const arr5 = generateRandomArray(100);
const arr6 = generateRandomArray(500);
const arr7 = generateRandomArray(1000);

// граничные(все числа из: 1 знака, 2х знаков, 3х знаков)
const arr8 = generateSameDigitsArray(600, 9);
const arr9 = generateSameDigitsArray(100, [5, 7]);
const arr10 = generateSameDigitsArray(800, [8, 2, 4]);

// каждого числа по 3 - всего чисел 900
const arr11 = generateUnicArray();

// ТЕСТЫ 
const check = testCompression([arr1, arr2, arr3, arr4, arr5, arr6, arr7, arr8, arr9, arr10, arr11]);
console.log(check);