function showMessage(type, text) {
    const msgBox = document.getElementById("msgBox");
    msgBox.innerHTML = `
        <div class="alert alert-${type} alert-dismissible fade show" role="alert">
            ${text}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>
    `;
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

        // Walidacja
        if (!numStr || isNaN(base) || base < 2 || base > 36) {
            showMessage("danger", `Nieprawidłowa liczba lub system w panelu <b>${i + 1}</b>.`);
            document.getElementById("output").style.display = "none";
            return;
        }

        let decimal = parseInt(numStr, base);
        if (isNaN(decimal)) {
            showMessage("danger", `Nie udało się zamienić liczby "<b>${numStr}</b>" w systemie <b>${base}</b>.`);
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
