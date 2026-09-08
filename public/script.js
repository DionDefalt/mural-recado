// ------------------------------------------------------
// Mural de Recados — front-end
// ------------------------------------------------------
// Todo o estado vive no servidor; este arquivo só busca,
// envia e apaga dados através da API em /api/recados.

const API_URL = '/api/recados';

const composer = document.getElementById('composer');
const autorInput = document.getElementById('autorInput');
const mensagemInput = document.getElementById('mensagemInput');
const charCounter = document.getElementById('charCounter');
const colorPicker = document.getElementById('colorPicker');
const notesGrid = document.getElementById('notesGrid');
const emptyState = document.getElementById('emptyState');
const submitButton = composer.querySelector('.composer__pin-button');

let corSelecionada = 'amarelo';

// ------------------------------------------------------
// Seleção de cor do bilhete
// ------------------------------------------------------

colorPicker.addEventListener('click', (event) => {
  const swatch = event.target.closest('.swatch');
  if (!swatch) return;

  corSelecionada = swatch.dataset.cor;
  colorPicker
    .querySelectorAll('.swatch')
    .forEach((s) => s.classList.toggle('is-active', s === swatch));
});

// ------------------------------------------------------
// Contador de caracteres
// ------------------------------------------------------

mensagemInput.addEventListener('input', () => {
  const restantes = 280 - mensagemInput.value.length;
  charCounter.textContent = `${restantes} caracteres restantes`;
});

// ------------------------------------------------------
// Buscar e renderizar os recados
// ------------------------------------------------------

async function carregarRecados() {
  try {
    const resposta = await fetch(API_URL);
    if (!resposta.ok) throw new Error('Falha ao buscar recados');

    const recados = await resposta.json();
    renderizar(recados);
  } catch (erro) {
    console.error(erro);
    notesGrid.innerHTML = '';
    emptyState.hidden = false;
    emptyState.textContent = 'Não foi possível carregar o mural. Tente recarregar a página.';
  }
}

function renderizar(recados) {
  emptyState.hidden = recados.length > 0;
  notesGrid.innerHTML = '';

  recados.forEach((recado) => {
    const nota = document.createElement('article');
    nota.className = `nota nota--${recado.cor}`;

    nota.innerHTML = `
      <div class="nota__pin"></div>
      <p class="nota__mensagem"></p>
      <div class="nota__rodape">
        <span class="nota__autor"></span>
        <button class="nota__excluir">apagar</button>
      </div>
    `;

    // textContent evita que uma mensagem maliciosa vire HTML/script
    nota.querySelector('.nota__mensagem').textContent = recado.mensagem;
    nota.querySelector('.nota__autor').textContent = recado.autor;

    nota.querySelector('.nota__excluir').addEventListener('click', () => {
      excluirRecado(recado.id);
    });

    notesGrid.appendChild(nota);
  });
}

// ------------------------------------------------------
// Criar um novo recado
// ------------------------------------------------------

composer.addEventListener('submit', async (event) => {
  event.preventDefault();

  const mensagem = mensagemInput.value.trim();
  if (!mensagem) return;

  submitButton.disabled = true;

  try {
    const resposta = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        autor: autorInput.value.trim(),
        mensagem,
        cor: corSelecionada,
      }),
    });

    if (!resposta.ok) {
      const erro = await resposta.json();
      throw new Error(erro.erro || 'Não foi possível publicar o recado.');
    }

    mensagemInput.value = '';
    charCounter.textContent = '280 caracteres restantes';
    await carregarRecados();
  } catch (erro) {
    alert(erro.message);
  } finally {
    submitButton.disabled = false;
  }
});

// ------------------------------------------------------
// Excluir um recado
// ------------------------------------------------------

async function excluirRecado(id) {
  try {
    const resposta = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    if (!resposta.ok && resposta.status !== 204) {
      throw new Error('Não foi possível apagar o recado.');
    }
    await carregarRecados();
  } catch (erro) {
    alert(erro.message);
  }
}

// Primeira carga ao abrir a página
carregarRecados();
