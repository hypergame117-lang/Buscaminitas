const FILAS = 6;
const COLUMNAS = 6;
const BOMBAS = 7;
let tablero = [];
let gameOver = false;

function iniciarJuego() {
    gameOver = false;
    const contenedor = document.getElementById('tablero');
    contenedor.innerHTML = '';
    
    // Crear matriz vacía
    tablero = Array.from({ length: FILAS }, () => Array(COLUMNAS).fill(0));

    // 1. Colocar 7 bombas aleatorias
    let bombasColocadas = 0;
    while (bombasColocadas < BOMBAS) {
        let f = Math.floor(Math.random() * FILAS);
        let c = Math.floor(Math.random() * COLUMNAS);
        if (tablero[f][c] !== 'B') {
            tablero[f][c] = 'B';
            bombasColocadas++;
        }
    }

    // 2. Calcular números (bombas alrededor)
    for (let f = 0; f < FILAS; f++) {
        for (let c = 0; c < COLUMNAS; c++) {
            if (tablero[f][c] === 'B') continue;
            let contador = 0;
            for (let i = -1; i <= 1; i++) {
                for (let j = -1; j <= 1; j++) {
                    if (tablero[f + i]?.[c + j] === 'B') contador++;
                }
            }
            tablero[f][c] = contador;
        }
    }

    // 3. Dibujar el tablero
    for (let f = 0; f < FILAS; f++) {
        for (let c = 0; c < COLUMNAS; c++) {
            const div = document.createElement('div');
            div.classList.add('celda');
            div.id = `celda-${f}-${c}`; // ID único para encontrarla fácil
            div.addEventListener('click', () => revelarCelda(f, c));
            contenedor.appendChild(div);
        }
    }
}

function revelarCelda(f, c) {
    // Si ya está revelada o el juego terminó, no hacer nada
    const div = document.getElementById(`celda-${f}-${c}`);
    if (gameOver || !div || div.classList.contains('revelada')) return;

    div.classList.add('revelada');
    let valor = tablero[f][c];

    if (valor === 'B') {
        div.innerHTML = '💣';
        div.classList.add('bomba');
        gameOver = true;
        revelarTodasLasBombas();
        setTimeout(() => alert('¡BOOM! Has perdido.'), 100);
    } 
    else if (valor > 0) {
        // Si tiene un número, solo mostramos ese número y su color
        div.innerHTML = valor;
        div.classList.add(`num-${valor}`);
    } 
    else {
        // SI ES VACÍA (0): Aquí ocurre la magia de la cascada
        // Buscamos los 8 vecinos y los revelamos
        for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
                if (i === 0 && j === 0) continue; // No revelarse a sí mismo otra vez
                let nf = f + i;
                let nc = c + j;
                // Solo disparamos la función si el vecino está dentro del tablero
                if (nf >= 0 && nf < FILAS && nc >= 0 && nc < COLUMNAS) {
                    revelarCelda(nf, nc);
                }
            }
        }
    }
    
    verificarVictoria();
}

function revelarTodasLasBombas() {
    for (let f = 0; f < FILAS; f++) {
        for (let c = 0; c < COLUMNAS; c++) {
            if (tablero[f][c] === 'B') {
                const celda = document.getElementById(`celda-${f}-${c}`);
                celda.classList.add('revelada', 'bomba');
                celda.innerHTML = '💣';
            }
        }
    }
}

function verificarVictoria() {
    const celdas = document.querySelectorAll('.celda');
    const reveladas = document.querySelectorAll('.celda.revelada');
    // Si las celdas que faltan por revelar son exactamente el número de bombas... ¡Ganaste!
    if (celdas.length - reveladas.length === BOMBAS && !gameOver) {
        gameOver = true;
        setTimeout(() => alert('¡Felicidades! Has despejado el tablero. 🎉'), 200);
    }
}

iniciarJuego();
