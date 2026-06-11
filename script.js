let display = document.getElementById('display');
let historyList = document.getElementById('historyList');
let themeToggleBtn = document.getElementById('themeToggle');
// fungsi dari document.getElementById adalah Metode getElementById() antarmuka ini Document mengembalikan Element objek yang mewakili elemen yang id propertinya cocok dengan string yang ditentukan. Karena ID elemen harus unik jika ditentukan, ini merupakan cara yang berguna untuk mengakses elemen tertentu dengan cepat.
// sumber : https://developer.mozilla.org/en-US/docs/Web/API/Document/getElementById

let currentInput = '0';
let operator = null;
let previousInput = null;
let shouldResetDisplay = false;
let historyEntries = JSON.parse(localStorage.getItem('calculatorHistory') || '[]');
// fungsi dari JSON.parse(localStorage.getItem adalah untuk untuk mengkonversi JSON string ke dalam object JavaScript.
// sumber : https://dikiharifwibowo.medium.com/panduan-menggunakan-localstorage-di-javascript-fcb9296859a

function updateDisplay() {
    if (operator !== null && previousInput !== null) {
        display.value = previousInput + operator + (shouldResetDisplay ? '' : currentInput);
    } else {
        display.value = currentInput;
    }
}
// fungsi dari function updateDisplay adalah untuk memperbarui nilai yang ditampilkan 
// sumber : https://dev.to/stewyearth/making-a-simple-counter-in-javascript-html-2ici

function appendNumber(num) {
    if (shouldResetDisplay) {
        currentInput = num;
        shouldResetDisplay = false;
    } else {
        // Prevent multiple leading zeros
        if (currentInput === '0' && num !== '.') {
            currentInput = num;
        } else {
            // Prevent multiple decimals
            if (num === '.' && currentInput.includes('.')) {
                return;
            }
            currentInput += num;
        }
    }
    updateDisplay();
}
// fungsi dari function appendNumber adalah Metode append() menyisipkan konten yang ditentukan di akhir elemen yang dipilih.
// sumber: https://www.w3schools.com/jquery/html_append.asp

function appendOperator(op) {
    if (operator !== null && !shouldResetDisplay) {
        calculate();
    }
    operator = op;
    previousInput = currentInput;
    shouldResetDisplay = true;
    updateDisplay();
}
// fungsi dari function appendOperator adalah untuk menambahkan operator ke dalam perhitungan
// sumber: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/parseFloat

function calculate() {
    if (operator === null || previousInput === null) {
        return;
    }

    let result;
    const prev = parseFloat(previousInput);
    const current = parseFloat(currentInput);

    switch (operator) {
        case '+':
            result = prev + current;
            break;
        case '-':
            result = prev - current;
            break;
        case '*':
            result = prev * current;
            break;
        case '/':
            if (current === 0) {
                alert('Cannot divide by zero!');
                clearDisplay();
                return;
            }
            result = prev / current;
            break;
        default:
            return;
    }

    const expression = `${previousInput} ${operator} ${currentInput} = ${result}`;
    addHistory(expression);

    currentInput = result.toString();
    operator = null;
    previousInput = null;
    shouldResetDisplay = true;
    updateDisplay();
}

function clearDisplay() {
    currentInput = '0';
    operator = null;
    previousInput = null;
    shouldResetDisplay = false;
    updateDisplay();
}

function deleteLast() {
    if (currentInput.length > 1) {
        currentInput = currentInput.slice(0, -1);
    } else {
        currentInput = '0';
    }
    updateDisplay();
}

function addHistory(entry) {
    historyEntries.unshift(entry);
    if (historyEntries.length > 12) {
        historyEntries.pop();
    }
    saveHistory();
    renderHistory();
}

function saveHistory() {
    localStorage.setItem('calculatorHistory', JSON.stringify(historyEntries));
}

function renderHistory() {
    if (!historyEntries.length) {
        historyList.innerHTML = '<li class="history-item">Belum ada riwayat.</li>';
        return;
    }

    historyList.innerHTML = historyEntries
        .map(item => `<li class="history-item">${item}</li>`)
        .join('');
}

function clearHistory() {
    historyEntries = [];
    saveHistory();
    renderHistory();
}

function toggleTheme() {
    const isDark = document.body.classList.toggle('dark-theme');
    localStorage.setItem('calculatorTheme', isDark ? 'dark' : 'light');
    updateThemeButton();
}

function updateThemeButton() {
    if (!themeToggleBtn) return;
    if (document.body.classList.contains('dark-theme')) {
        themeToggleBtn.textContent = '☀️ Mode Terang';
    } else {
        themeToggleBtn.textContent = '🌙 Mode Gelap';
    }
}

function loadTheme() {
    const savedTheme = localStorage.getItem('calculatorTheme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-theme');
    } else {
        document.body.classList.remove('dark-theme');
    }
    updateThemeButton();
}

// Keyboard support
document.addEventListener('keydown', (e) => {
    if (e.key >= '0' && e.key <= '9') appendNumber(e.key);
    if (e.key === '.') appendNumber('.');
    if (e.key === '+' || e.key === '-') appendOperator(e.key);
    if (e.key === '*') {
        e.preventDefault();
        appendOperator('*');
    }
    if (e.key === '/') {
        e.preventDefault();
        appendOperator('/');
    }
    if (e.key === 'Enter' || e.key === '=') {
        e.preventDefault();
        calculate();
    }
    if (e.key === 'Backspace') {
        e.preventDefault();
        deleteLast();
    }
    if (e.key === 'Escape') {
        e.preventDefault();
        clearDisplay();
    }
});

loadTheme();
// fungsi dari loadTheme adalah untuk memuat tema yang disimpan 
// sumber: https://www.w3schools.com/jsref/event_onload.asp
renderHistory();
// fungsi dari renderHistory adalah untuk menampilkan riwayat perhitungan yang disimpan 
// sumber: https://developer.mozilla.org/en-US/docs/Web/API/History_API
updateDisplay();
// fungsi dari updateDisplay adalah untuk memperbarui nilai yang ditampilkan
// sumber: https://dev.to/stewyearth/making-a-simple-counter-in-javascript-html-2ici