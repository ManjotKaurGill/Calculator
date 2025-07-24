document.addEventListener('DOMContentLoaded', () => {
    const display = document.getElementById('display');
    const historyList = document.getElementById('history-list');
    let currentExpression = '';
    let memory = 0;
    let history = [];

    document.querySelectorAll('.btn').forEach(button => {
        button.addEventListener('click', () => {
            const value = button.getAttribute('data-value');
            handleInput(value);
        });
    });

    document.addEventListener('keydown', (e) => {
        const key = e.key;
        if (/[\d.+\-*/%]/.test(key)) {
            handleInput(key);
        } else if (key === 'Enter') {
            handleInput('=');
        } else if (key === 'Backspace') {
            handleInput('⌫');
        } else if (key === 'Escape') {
            handleInput('C');
        }
    });

    function handleInput(value) {
        if (value === 'C') {
            currentExpression = '';
        } else if (value === '⌫') {
            currentExpression = currentExpression.slice(0, -1);
        } else if (value === '=') {
            try {
                // Handle percentage if present
                currentExpression = handlePercentage(currentExpression);
                const result = eval(currentExpression);
                addToHistory(currentExpression + ' = ' + result);
                currentExpression = result.toString();
            } catch {
                currentExpression = 'Error';
            }
        } else if (value === 'MR') {
            currentExpression += memory.toString();
        } else if (value === '%') {
            currentExpression += '%';
        } else {
            currentExpression += value;
        }

        updateDisplay();
    }

    function handlePercentage(expr) {
        // Convert expressions like "50+10%" to "50+(50*10/100)"
        return expr.replace(/(\d+(\.\d+)?)%/g, (match, num) => {
            return `(${num}/100)`;
        });
    }

    function addToHistory(entry) {
        history.unshift(entry); // newest on top
        if (history.length > 10) history.pop(); // limit to last 10
        renderHistory();
    }

    function renderHistory() {
        historyList.innerHTML = '';
        history.forEach(item => {
            const li = document.createElement('li');
            li.textContent = item;
            li.style.cursor = 'pointer';

            // 🟡 On click: extract expression part before '='
            li.addEventListener('click', () => {
                const [expr] = item.split('='); // gets only expression part
                currentExpression = expr.trim(); // set to input box
                updateDisplay();
            });

            historyList.appendChild(li);
        });
    }

    function updateDisplay() {
        display.value = currentExpression;
    }
});
