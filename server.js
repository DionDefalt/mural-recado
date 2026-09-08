// ------------------------------------------------------
// Mural de Recados — servidor Express
// ------------------------------------------------------
// Serve o front-end (pasta /public) e uma API simples que
// lê e escreve os recados num arquivo JSON local.

const express = require('express');
const fs = require('fs/promises');
const path = require('path');
const crypto = require('crypto');

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, 'data.json');

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// ------------------------------------------------------
// Funções auxiliares de leitura/escrita do "banco de dados"
// ------------------------------------------------------

async function lerRecados() {
  try {
    const conteudo = await fs.readFile(DATA_FILE, 'utf-8');
    return JSON.parse(conteudo);
  } catch (erro) {
    // Se o arquivo não existir ainda, começamos com uma lista vazia
    if (erro.code === 'ENOENT') return [];
    throw erro;
  }
}

async function salvarRecados(recados) {
  await fs.writeFile(DATA_FILE, JSON.stringify(recados, null, 2));
}

// ------------------------------------------------------
// Rotas da API
// ------------------------------------------------------

// Lista todos os recados (mais recentes primeiro)
app.get('/api/recados', async (req, res) => {
  try {
    const recados = await lerRecados();
    const ordenados = [...recados].sort((a, b) => b.criadoEm - a.criadoEm);
    res.json(ordenados);
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: 'Não foi possível carregar os recados.' });
  }
});

// Cria um novo recado
app.post('/api/recados', async (req, res) => {
  const { autor, mensagem, cor } = req.body;

  if (!mensagem || !mensagem.trim()) {
    return res.status(400).json({ erro: 'A mensagem não pode estar vazia.' });
  }

  if (mensagem.length > 280) {
    return res.status(400).json({ erro: 'A mensagem pode ter no máximo 280 caracteres.' });
  }

  try {
    const recados = await lerRecados();

    const novoRecado = {
      id: crypto.randomUUID(),
      autor: (autor && autor.trim()) || 'Anônimo',
      mensagem: mensagem.trim(),
      cor: cor || 'amarelo',
      criadoEm: Date.now(),
    };

    recados.push(novoRecado);
    await salvarRecados(recados);

    res.status(201).json(novoRecado);
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: 'Não foi possível salvar o recado.' });
  }
});

// Remove um recado pelo id
app.delete('/api/recados/:id', async (req, res) => {
  try {
    const recados = await lerRecados();
    const existe = recados.some((r) => r.id === req.params.id);

    if (!existe) {
      return res.status(404).json({ erro: 'Recado não encontrado.' });
    }

    const restantes = recados.filter((r) => r.id !== req.params.id);
    await salvarRecados(restantes);

    res.status(204).send();
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: 'Não foi possível remover o recado.' });
  }
});

app.listen(PORT, () => {
  console.log(`Mural de Recados rodando em http://localhost:${PORT}`);
});
