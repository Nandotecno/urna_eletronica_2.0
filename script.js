const telaConteudo = document.querySelector('.tela-conteudo');
const avisoInicial = document.querySelector('.aviso-inicial');
const instrucao = document.querySelector('.instrucao');
const cargo = document.querySelector('.cargo');
const entradaNumeros = document.querySelector('.entrada-numeros');
const num1Div = document.getElementById('num1');
const num2Div = document.getElementById('num2');
const candidatoInfoDiv = document.querySelector('.candidato-info');
const avisoRodape = document.querySelector('.aviso-rodape');
const votoBrancoNuloDiv = document.querySelector('.voto-branco-nulo');
const fimDiv = document.getElementById('fim');

const resultado13 = document.getElementById('resultado-13');
const resultado22 = document.getElementById('resultado-22');
const resultadoBranco = document.getElementById('resultado-branco');
const resultadoNulo = document.getElementById('resultado-nulo');
const resultado13Real = document.getElementById('resultado-13-real');


const candidatos = {
    '13': { nome: 'LULA', partido: 'PT', foto: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 130"><rect width="100" height="130" fill="#dcdcdc"/><text x="50" y="75" font-family="Arial" font-size="70" fill="#555" text-anchor="middle">L</text></svg>' },
    '22': { nome: 'BOLSONARO', partido: 'PL', foto: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 130"><rect width="100" height="130" fill="#dcdcdc"/><text x="50" y="75" font-family="Arial" font-size="70" fill="#555" text-anchor="middle">B</text></svg>' }
};

let numeroAtual = '';
let votoEmBranco = false;
let etapaConcluida = false;

// --- Contadores de Votos ---
let votosLulaReal = 0; // Contador real de votos para Lula
let votosLulaComputado = 0; // Contador ajustado conforme a regra
let votosBolsonaro = 0;
let votosBranco = 0;
let votosNulo = 0;


function limparTela() {
    numeroAtual = '';
    votoEmBranco = false;
    etapaConcluida = false;

    instrucao.style.display = 'block';
    instrucao.classList.add('pisca');
    cargo.style.display = 'block';
    entradaNumeros.style.display = 'flex';
    avisoRodape.style.display = 'block';
    avisoInicial.style.display = 'none'; // Esconde aviso inicial após primeiro voto
    candidatoInfoDiv.style.visibility = 'hidden';
    candidatoInfoDiv.innerHTML = '';
    votoBrancoNuloDiv.style.display = 'none';
    votoBrancoNuloDiv.innerHTML = '';
    fimDiv.style.visibility = 'hidden';

    num1Div.textContent = '';
    num1Div.classList.remove('pisca');
    num2Div.textContent = '';
}

function atualizarInterface() {
    if (etapaConcluida) return; // Não atualiza se já mostrou FIM

    if (votoEmBranco) {
        instrucao.style.display = 'block';
        cargo.style.display = 'block';
        entradaNumeros.style.display = 'none';
        candidatoInfoDiv.style.visibility = 'hidden';
        votoBrancoNuloDiv.style.display = 'block';
        votoBrancoNuloDiv.innerHTML = 'VOTO EM BRANCO';
        avisoRodape.style.display = 'block';
        num1Div.textContent = '';
        num2Div.textContent = '';
    } else {
        num1Div.textContent = numeroAtual[0] || '';
        num2Div.textContent = numeroAtual[1] || '';

        if (numeroAtual.length === 0) {
            num1Div.classList.add('pisca');
            candidatoInfoDiv.style.visibility = 'hidden';
            votoBrancoNuloDiv.style.display = 'none';
            instrucao.style.display = 'block';
             instrucao.classList.add('pisca');
        } else {
            num1Div.classList.remove('pisca');
            if (numeroAtual.length === 1) {
                 instrucao.classList.remove('pisca');
                 num2Div.classList.add('pisca');
            } else {
                 num2Div.classList.remove('pisca');
                 instrucao.classList.remove('pisca'); // Para de piscar instrução tb
            }

            const candidato = candidatos[numeroAtual];
            if (candidato) {
                candidatoInfoDiv.style.visibility = 'visible';
                candidatoInfoDiv.innerHTML = `
                    <div class="candidato-dados">
                        Nome: <span>${candidato.nome}</span><br>
                        Partido: <span>${candidato.partido}</span>
                    </div>
                    <div class="candidato-foto">${candidato.foto}</div>
                `;
                votoBrancoNuloDiv.style.display = 'none';
            } else if (numeroAtual.length === 2) {
                candidatoInfoDiv.style.visibility = 'hidden';
                votoBrancoNuloDiv.style.display = 'block';
                votoBrancoNuloDiv.innerHTML = 'VOTO NULO';
            } else {
                 candidatoInfoDiv.style.visibility = 'hidden';
                 votoBrancoNuloDiv.style.display = 'none';
            }
        }
    }
}

function cliqueNumero(num) {
    if (etapaConcluida || votoEmBranco) return;
    if (numeroAtual.length < 2) {
        numeroAtual += num;
        atualizarInterface();
    }
}

function cliqueBranco() {
    if (etapaConcluida) return;
    if (numeroAtual === '') {
        votoEmBranco = true;
        numeroAtual = ''; // Garante que não há número
        atualizarInterface();
    } else {
        // Não permite votar em branco se já digitou algo
        alert("Para votar em BRANCO, o campo de número deve estar vazio.\nAperte CORRIGE para apagar o campo.");
    }
}

function cliqueCorrige() {
    if (etapaConcluida) return;
    limparTelaAposConfirmacao(); // Usa a função de reset parcial
}

function cliqueConfirma() {
    if (etapaConcluida) return;

    if (votoEmBranco) {
        votosBranco++;
        finalizarVoto();
    } else if (numeroAtual.length === 2) {
        if (candidatos[numeroAtual]) {
            if (numeroAtual === '13') {
                votosLulaReal++;
                // Aplica a regra especial: a cada 3 votos, adiciona 2 extras
                // Total = (floor(real / 3) * 3) + (floor(real / 3) * 2) + (real % 3)
                // Total = floor(real / 3) * 5 + (real % 3)
                votosLulaComputado = Math.floor(votosLulaReal / 3) * 5 + (votosLulaReal % 3);
            } else if (numeroAtual === '22') {
                votosBolsonaro++;
            }
            finalizarVoto();
        } else {
            // Voto Nulo por número inexistente
            votosNulo++;
            finalizarVoto();
        }
    } else {
        // Voto incompleto, não confirma
        alert("Número de candidato incompleto.");
    }
}

function finalizarVoto() {
    etapaConcluida = true;
    fimDiv.style.visibility = 'visible';
    // Tocar som da urna (opcional, requer elemento audio)
    // urnaSom.play();

    // Esconder elementos da tela, exceto FIM
    instrucao.style.display = 'none';
    cargo.style.display = 'none';
    entradaNumeros.style.display = 'none';
    candidatoInfoDiv.style.visibility = 'hidden';
    avisoRodape.style.display = 'none';
    votoBrancoNuloDiv.style.display = 'none'; // Esconde msg de nulo/branco


    atualizarResultados();

    // Resetar para o próximo voto após um tempo
    setTimeout(limparTelaAposConfirmacao, 1500); // Espera 1.5 segundos
}

function limparTelaAposConfirmacao() {
    // Função para resetar a tela para um novo voto ou após CORRIGE
    numeroAtual = '';
    votoEmBranco = false;
    etapaConcluida = false; // Permite nova interação

    fimDiv.style.visibility = 'hidden'; // Esconde FIM
    avisoInicial.style.display = 'none'; // Mantem escondido ou mostra novamente
    instrucao.style.display = 'block';
    instrucao.classList.add('pisca');
    cargo.style.display = 'block';
    entradaNumeros.style.display = 'flex';
    avisoRodape.style.display = 'block';
    candidatoInfoDiv.style.visibility = 'hidden';
    candidatoInfoDiv.innerHTML = '';
    votoBrancoNuloDiv.style.display = 'none';
    votoBrancoNuloDiv.innerHTML = '';

    num1Div.textContent = '';
    num1Div.classList.add('pisca'); // Pisca o primeiro número
    num2Div.textContent = '';
    num2Div.classList.remove('pisca'); // Garante que o segundo não pisca
}


function atualizarResultados() {
    resultado13.textContent = votosLulaComputado;
    resultado13Real.textContent = votosLulaReal;
    resultado22.textContent = votosBolsonaro;
    resultadoBranco.textContent = votosBranco;
    resultadoNulo.textContent = votosNulo;
}

// Inicialização
window.onload = () => {
    limparTela(); // Começa com a tela limpa e pronta
    avisoInicial.style.display = 'block'; // Mostra o aviso inicial
    instrucao.style.display = 'none'; // Esconde outras partes
    cargo.style.display = 'none';
    entradaNumeros.style.display = 'none';
    avisoRodape.style.display = 'none';
    // Chama limparTela novamente para configurar o estado inicial de voto
    setTimeout(limparTelaAposConfirmacao, 50); // Pequeno delay para garantir a renderização inicial
};

