const canvas = document.getElementById('tetris');
const contexto = canvas.getContext('2d');
contexto.scale(30, 30);

const canvasProximaPeca = document.getElementById('proximaPeca');
const contextoProxima = canvasProximaPeca.getContext('2d');
contextoProxima.scale(30, 30);

const pecas = [
    [[1, 1, 1, 1]],                       
    [[1, 1, 1], [0, 1]],                  
    [[1, 1, 1], [1, 0]],                  
    [[1, 1, 0], [0, 1, 1]],               
    [[0, 1, 1], [1, 1, 0]],               
    [[1, 1], [1, 1]],                     
    [[1, 1, 1], [0, 0, 1]]                
];

let tabuleiro = Array.from({ length: 20 }, () => Array(10).fill(0));
let pecaAtual = pegarPecaAleatoria();
let proximaPeca = pegarPecaAleatoria();
let posicaoPeca = { x: 3, y: 0 };
let intervaloQueda = 500;
let tempoQueda = 0;
let pontuacao = 0;  

function pegarPecaAleatoria() {
    return pecas[Math.floor(Math.random() * pecas.length)];
}

function desenharPeca(peca, deslocamento, contexto, cor = 'blue') {
    peca.forEach((linha, y) => {
        linha.forEach((valor, x) => {
            if (valor) {
                contexto.fillStyle = cor;
                contexto.fillRect(x + deslocamento.x, y + deslocamento.y, 1, 1);
            }
        });
    });
}

function limparCanvas(contexto, canvas) {
    contexto.clearRect(0, 0, canvas.width, canvas.height);
}

function desenharTabuleiro() {
    tabuleiro.forEach((linha, y) => {
        linha.forEach((valor, x) => {
            if (valor) {
                contexto.fillStyle = 'gray';
                contexto.fillRect(x, y, 1, 1);
            }
        });
    });
}

function colidir(tabuleiro, peca, deslocamento) {
    for (let y = 0; y < peca.length; y++) {
        for (let x = 0; x < peca[y].length; x++) {
            if (peca[y][x] !== 0) {
                const tabuleiroX = x + deslocamento.x;
                const tabuleiroY = y + deslocamento.y;
                if (
                    tabuleiroX < 0 ||
                    tabuleiroX >= tabuleiro[0].length ||
                    tabuleiroY >= tabuleiro.length ||
                    (tabuleiroY >= 0 && tabuleiro[tabuleiroY][tabuleiroX] !== 0)
                ) {
                    return true;
                }
            }
        }
    }
    return false;
}

function mesclar(tabuleiro, peca, deslocamento) {
    peca.forEach((linha, y) => {
        linha.forEach((valor, x) => {
            if (valor) {
                tabuleiro[y + deslocamento.y][x + deslocamento.x] = valor;
            }
        });
    });
}

function removerLinhasCompletas() {
    outer: for (let y = tabuleiro.length - 1; y >= 0; y--) {
        for (let x = 0; x < tabuleiro[y].length; x++) {
            if (tabuleiro[y][x] === 0) {
                continue outer;
            }
        }
        tabuleiro.splice(y, 1);
        tabuleiro.unshift(Array(10).fill(0));
        pontuacao += 10; 
        atualizarPontuacao();
    }
}

function rotacionar(peca) {
    const novaPeca = peca[0].map((_, i) => peca.map(linha => linha[i]).reverse());
    if (!colidir(tabuleiro, novaPeca, posicaoPeca)) {
        pecaAtual = novaPeca;
    }
}

function colidir(tabuleiro, peca, deslocamento) {
    for (let y = 0; y < peca.length; y++) {
        for (let x = 0; x < peca[y].length; x++) {
            if (peca[y][x] !== 0) {
                const tabuleiroX = x + deslocamento.x;
                const tabuleiroY = y + deslocamento.y

                if (
                    tabuleiroX < 0 ||                         
                    tabuleiroX >= tabuleiro[0].length ||       
                    tabuleiroY >= tabuleiro.length ||          
                    (tabuleiroY >= 0 && tabuleiro[tabuleiroY][tabuleiroX] !== 0)
                ) {
                    return true;
                }
            }
        }
    }
    return false;
}

function rotacionar(peca) {
    const novaPeca = peca[0].map((_, i) => peca.map(linha => linha[i]).reverse());

        const deslocamentos = [
        { x: 0, y: 0 },
        { x: -1, y: 0 },
        { x: 1, y: 0 }
    ];

    for (const deslocamento of deslocamentos) {
        const novaPosicao = { x: posicaoPeca.x + deslocamento.x, y: posicaoPeca.y + deslocamento.y };
        if (!colidir(tabuleiro, novaPeca, novaPosicao)) {
            pecaAtual = novaPeca;
            posicaoPeca = novaPosicao;
            return;
        }
    }
}


function desenhar() {
    limparCanvas(contexto, canvas);
    desenharTabuleiro();
    desenharPeca(pecaAtual, posicaoPeca, contexto);

    if (Date.now() - tempoQueda > intervaloQueda) {
        posicaoPeca.y++;
        if (colidir(tabuleiro, pecaAtual, posicaoPeca)) {
            posicaoPeca.y--;
            mesclar(tabuleiro, pecaAtual, posicaoPeca);
            removerLinhasCompletas();
            pecaAtual = proximaPeca;
            posicaoPeca = { x: 3, y: 0 };
            proximaPeca = pegarPecaAleatoria();
            desenharProximaPeca();
            if (colidir(tabuleiro, pecaAtual, posicaoPeca)) {
                alert('Você perdeu! :(');
                resetarJogo();
            }
        }
        tempoQueda = Date.now();
    }
    requestAnimationFrame(desenhar);
}

function desenharProximaPeca() {
    limparCanvas(contextoProxima, canvasProximaPeca);
    desenharPeca(proximaPeca, { x: 1, y: 1 }, contextoProxima, 'blue');
}

function atualizarPontuacao() {
    const pontuacaoElemento = document.getElementById('pontuacao');
    pontuacaoElemento.textContent = `Pontuação: ${pontuacao}`;
}

function resetarJogo() {
    tabuleiro = Array.from({ length: 20 }, () => Array(10).fill(0));
    pontuacao = 0;
    atualizarPontuacao();
    pecaAtual = pegarPecaAleatoria();
    proximaPeca = pegarPecaAleatoria();
    posicaoPeca = { x: 3, y: 0 };
    desenharProximaPeca();
}

document.addEventListener('keydown', (evento) => {
    switch (evento.key) {
        case 'ArrowLeft':
            posicaoPeca.x--;
            if (colidir(tabuleiro, pecaAtual, posicaoPeca)) {
                posicaoPeca.x++;
            }
            break;
        case 'ArrowRight':
            posicaoPeca.x++;
            if (colidir(tabuleiro, pecaAtual, posicaoPeca)) {
                posicaoPeca.x--;
            }
            break;
        case 'ArrowDown':
            posicaoPeca.y++;
            if (colidir(tabuleiro, pecaAtual, posicaoPeca)) {
                posicaoPeca.y--;
            }
            break;
        case 'ArrowUp':
            rotacionar(pecaAtual);
            break;
    }
});

desenhar();
desenharProximaPeca();
