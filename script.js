const FILAS = 6;
const COLUMNAS = 6;
const BOMBAS = 7;
let tablero = [];

function iniciarJuego() {
    const contenedor = document.getElementById('tablero');
    contenedor.innerHTML = '';
    tablero = Array.from({ length: FILAS }, () => Array(COLUMNAS).fill(0));

    // 1. Colocar bombas aleatorias
    let bombasColocadas = 0;
    while (bombasColocadas < BOMBAS) {
        let f = Math.floor(Math.random() * FILAS);
        let c = Math.floor(Math.random() * COLUMNAS);
        if (tablero[f][c] !== 'B') {
            tablero[f][c] = 'B';
            bombasColocadas++;
        }
    }

    // 2. Calcular números (vecinos)
    for (let f = 0; f < FILAS; f++) {
        for (let c = 0; c < COLUMNAS; c++) {
            if (tablero[f][c] === 'B') continue;
            let contador = 0;
            // Revisar las 8 celdas vecinas
            for (let i = -1; i <= 1; i++) {
                for (let j = -1; j <= 1; j++) {
                    if (tablero[f + i]?.[c + j] === 'B') contador++;
                }
            }
            tablero[f][c] = contador;
        }
    }

    // 3. Renderizar en el HTML
    for (let f = 0; f < FILAS; f++) {
        for (let c = 0; c < COLUMNAS; c++) {
            const div = document.createElement('div');
            div.classList.add('celda');
            div.dataset.fila = f;
            div.dataset.col = c;
            div.addEventListener('click', () => revelarCelda(div, f, c));
            contenedor.appendChild(div);
        }
    }
}

function revelarCelda(div, f, c) {
    if (div.classList.contains('revelada')) return;
    
    div.classList.add('revelada');
    let valor = tablero[f][c];
    
    if (valor === 'B') {
        div.innerHTML = '💣';
        div.classList.add('bomba');
        alert('¡BOOM! Juego terminado.');
        iniciarJuego(); // Reiniciar
    } else {
        div.innerHTML = valor > 0 ? valor : '';
    }
}

iniciarJuego();
