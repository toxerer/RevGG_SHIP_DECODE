function detectSuggestedBase(str) {
    str = str.trim().toUpperCase();
    if (!str) return null;

    // Dozwolone znaki: 0–9, A–F
    if (!/^[0-9A-F]+$/.test(str)) return null;

    let maxVal = 0;
    const letters = new Set();

    for (let ch of str) {
        let val;
        if (ch >= '0' && ch <= '9') {
            val = ch.charCodeAt(0) - 48; // '0' = 48
        } else {
            val = ch.charCodeAt(0) - 55; // 'A' = 65 → 10
            letters.add(ch);
        }
        if (val > maxVal) maxVal = val;
    }

    let minBase = Math.max(maxVal + 1, 2);
    if (minBase > 16) return null;

    const hasOnlyA = (letters.size === 1 && letters.has('A'));
    const hasEorF = letters.has('E') || letters.has('F');

    // 1) Szukamy podstaw, które dają 6-cyfrowy wynik w systemie 10
    const sixDigitCandidates = [];
    for (let base = minBase; base <= 16; base++) {
        const decimal = parseInt(str, base);
        if (decimal >= 100000 && decimal <= 999999) {

            // DODANA ZASADA:
            // Dla podstaw > 10 (11–16) akceptujemy tylko liczby > 900000
            if (base > 10 && decimal <= 900000) {
                continue;
            }

            sixDigitCandidates.push({ base, decimal });
        }
    }

    if (sixDigitCandidates.length > 0) {
        const bases = sixDigitCandidates.map(c => c.base);

        // Preferuj klasyczny HEX, jeśli pasuje
        if (bases.includes(16)) {
            return 16;
        }

        // Jeśli jedyną literą jest A i pasuje 15 → preferuj 15
        if (hasOnlyA && bases.includes(15)) {
            return 15;
        }

        // W pozostałych przypadkach – najmniejsza możliwa podstawa
        return Math.min(...bases);
    }

    // 2) Jeżeli żadna podstawa nie daje 6-cyfrowego wyniku,
    // używamy prostszych heurystyk:

    if (hasEorF) {
        return 16;
    }

    if (hasOnlyA && minBase <= 15) {
        return 15;
    }

    // Domyślnie: minimalna możliwa podstawa
    return minBase;
}
