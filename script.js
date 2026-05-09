const FILAS = 6;
const COLUMNAS = 6;
const BOMBAS = 7;
let tablero = [];
let gameOver = false; // Bandera para detener el juego

function iniciarJuego() {
    gameOver = false;
    const contenedor = document.getElementById('tablero');
    contenedor.innerHTML = '';
    // Crear matriz vacía
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
            // Evento click
            div.addEventListener('click', () => revelarCelda(div, f, c));
            contenedor.appendChild(div);
        }
    }
}

function revelarCelda(div, f, c) {
    if (gameOver || div.classList.contains('revelada')) return;
    
    div.classList.add('revelada');
    let valor = tablero[f][c];
    
    if (valor === 'B') {
        // --- AQUÍ EL EMOTICONO ---
        div.innerHTML = '💣'; 
        div.classList.add('bomba');
        gameOver = true;
        
        // Revelar todas las demás bombas (opcional, pero queda bien)
        revelarTodasLasBombas();
        
        // Retraso pequeño antes del alert para que se vea la bomba
        setTimeout(() => alert('¡BOOM! Juego terminado.'), 100);
        
    } else if (valor > 0) {
        div.innerHTML = valor;
        // --- AQUÍ LOS COLORES ---
        // Añadimos la clase CSS correspondiente: num-1, num-2, etc.
        div.classList.add(`num-${valor}`);
    } else {
        // Si es cero, revelamos los vecinos automáticamente (recursión simple)
        // Esto hace el juego mucho más jugable.
        revelarVecinosVacios(f, c);
    }
}

// Función extra para revelar vecinos si la celda es '0'
function revelarVecinosVacios(f, c) {
    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            let nf = f + i;
            let nc = c + j;
            // Verificar límites
            if (nf >= 0 && nf < FILAS && nc >= 0 && nc < COLUMNAS) {
                const vecina = document.querySelector(`[data-fila="${nf}"][data-col="${nc}"]`);
                if (!vecina.classList.contains('revelada')) {
                    revelarCelda(vecina, nf, nc);
                }
            }
        }
    }
}

// Función para mostrar todas las bombas al perder
function revelarTodasLasBombas() {
    for (let f = 0; f < FILAS; f++) {
        for (let c = 0; c < COLUMNAS; c++) {
            if (tablero[f][c] === 'B') {
                const celdaBomba = document.querySelector(`[data-fila="${f}"][data-col="${c}"]`);
                celdaBomba.classList.add('revelada', 'bomba');
                celdaBomba.innerHTML = '💣';
            }
        }
    }
}

// Iniciar al cargar la página
iniciarJuego();
