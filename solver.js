function showMessage(type, text) {
    const msgBox = document.getElementById("msgBox");
    msgBox.innerHTML = `
        <div class="alert alert-${type} alert-dismissible fade show" role="alert">
            ${text}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>
    `;
}

// Zamiana znaku na wartość cyfry (0-35)
function charToValue(ch) {
    const c = ch.toUpperCase();
    const code = c.charCodeAt(0);

    if (code >= 48 && code <= 57) {
        // '0' - '9'
        return code - 48;
    } else if (code >= 65 && code <= 90) {
        // 'A' - 'Z'
        return code - 55; // 'A' = 10
    }
    return -1; // nieprawidłowy znak
}

// Wykrywanie podstawy systemu na podstawie wpisanego ciągu
function detectBase(numStr) {
    if (!numStr) return null;

    // Rozpoznawanie prefiksów 0b, 0o, 0x
    if (/^0[bB][01]+$/.test(numStr)) {
        return 2;
    }
    if (/^0[oO][0-7]+$/.test(numStr)) {
        return 8;
    }
    if (/^0[xX][0-9a-fA-F]+$/.test(numStr)) {
        return 16;
    }

    // Ogólne wykrywanie minimalnej podstawy na podstawie najwyższej cyfry
    let maxVal = -1;
    for (let ch of numStr) {
        if (ch === ' ' || ch === '_' ) continue; // opcjonalnie ignorujemy spacje/podkreślenia

        const val = charToValue(ch);
        if (val === -1) {
            // Nieznany znak – nie umiemy wykryć
            return null;
        }
        if (val > maxVal) maxVal = val;
    }

    if (maxVal === -1) return null;

    let base = maxVal + 1;
    if (base < 2) base = 2;
    if (base > 36) return null; // poza zakresem parseInt

    return base;
}

function calculate() {
    const numbers = document.querySelectorAll(".number");
    const bases = document.querySelectorAll(".base");
    let decimalNumbers = [];
    let outputText = "";

    // Czyścimy stare komunikaty
    document.getElementById("msgBox").innerHTML = "";

    for (let i = 0; i < numbers.length; i++) {
        let numStr = numbers[i].value.trim();
        let base = parseInt(bases[i].value);

        if (!numStr) {
            showMessage("danger", `Brak liczby w panelu <b>${i + 1}</b>.`);
            document.getElementById("output").style.display = "none";
            return;
        }

        if (isNaN(base) || base < 2 || base > 36) {
            showMessage("danger", `Nieprawidłowy system liczbowy w panelu <b>${i + 1}</b>.`);
            document.getElementById("output").style.display = "none";
            return;
        }

        // Obsługa prefiksów 0b / 0o / 0x
        if (/^0[bB]/.test(numStr) && base === 2) {
            numStr = numStr.slice(2);
        } else if (/^0[oO]/.test(numStr) && base === 8) {
            numStr = numStr.slice(2);
        } else if (/^0[xX]/.test(numStr) && base === 16) {
            numStr = numStr.slice(2); // tu niekoniecznie trzeba, ale jest czyściej
        }

        let decimal = parseInt(numStr, base);
        if (isNaN(decimal)) {
            showMessage("danger", `Nie udało się zamienić liczby "<b>${numbers[i].value.trim()}</b>" w systemie <b>${base}</b> (panel ${i + 1}).`);
            document.getElementById("output").style.display = "none";
            return;
        }

        decimalNumbers.push(decimal);
        outputText += `${i + 1}: <b>${decimal}</b><br>`;
    }

    let result = decimalNumbers.reduce((acc, val) => acc & val);
    outputText += `<br>Kod dostępu: <b>${result}</b>`;

    const outputDiv = document.getElementById("output");
    outputDiv.innerHTML = outputText;
    outputDiv.style.display = "block"; 
}

// Automatyczne wykrywanie systemu przy wpisywaniu liczby
document.addEventListener("DOMContentLoaded", () => {
    const numberInputs = document.querySelectorAll(".number");
    const baseInputs = document.querySelectorAll(".base");

    numberInputs.forEach((input, index) => {
        input.addEventListener("input", () => {
            const value = input.value.trim();
            if (!value) return;

            const detected = detectBase(value);
            if (detected !== null) {
                baseInputs[index].value = detected;
            }
        });
    });
});
