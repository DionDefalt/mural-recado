# 📌 Mural de Recados

Um mural de recados **full-stack**: qualquer pessoa pode deixar um bilhete, escolher a cor da nota e apagar recados. Feito com **Node.js + Express** no back-end e **HTML/CSS/JS puro** no front-end, com persistência em arquivo JSON.

## ✨ Funcionalidades

- Publicar recados com nome (opcional), mensagem e cor
- Listar todos os recados, mais recentes primeiro
- Apagar qualquer recado
- Validação no back-end (mensagem obrigatória, limite de 280 caracteres)
- Dados persistem entre reinicializações do servidor (arquivo `data.json`)

## 🖥️ Como rodar localmente

Requer **Node.js** instalado ([nodejs.org](https://nodejs.org), versão LTS).

```bash
git clone https://github.com/SEU-USUARIO/mural-recados.git
cd mural-recados
npm install
npm start
```

Depois acesse **http://localhost:3000** no navegador.

## 🗂️ Estrutura do projeto

```
mural-recados/
├── server.js         # servidor Express e rotas da API
├── package.json
├── data.json         # "banco de dados" em arquivo JSON
├── public/
│   ├── index.html
│   ├── style.css
│   └── script.js
└── README.md
```

## 🔌 Rotas da API

| Método | Rota | Descrição |
|---|---|---|
| GET | `/api/recados` | Lista todos os recados |
| POST | `/api/recados` | Cria um novo recado (`{ autor, mensagem, cor }`) |
| DELETE | `/api/recados/:id` | Remove um recado pelo id |

## 🧠 O que este projeto demonstra

- Criação de uma API REST simples com Express
- Comunicação front-end ↔ back-end via `fetch`
- Persistência de dados no servidor (sem precisar configurar um banco de dados de verdade ainda)
- Validação de dados tanto no front-end quanto no back-end
- Organização de um projeto full-stack em pastas separadas por responsabilidade

## 🚀 Deploy (colocar no ar de graça)

Esse projeto pode ser publicado gratuitamente no [Render](https://render.com):

1. Suba o projeto pro GitHub (mesmo processo dos outros projetos)
2. Crie uma conta no Render e clique em **New → Web Service**
3. Conecte seu repositório `mural-recados`
4. Configure:
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
5. Clique em **Create Web Service**

Em alguns minutos você terá um link público, tipo `https://mural-recados.onrender.com`.

> **Atenção**: no plano gratuito do Render, os dados salvos em `data.json` podem ser apagados quando o serviço reinicia (o disco não é permanente). Para persistência de verdade em produção, o próximo passo seria migrar para um banco de dados como PostgreSQL ou MongoDB.

## 🚀 Próximos passos (ideias de evolução)

- [ ] Migrar o armazenamento de `data.json` para um banco de dados real
- [ ] Adicionar autenticação simples (cada pessoa só apaga seus próprios recados)
- [ ] Adicionar reações (tipo "curtir") nos recados
- [ ] Escrever testes automatizados para as rotas da API

---

Feito como parte do meu aprendizado em desenvolvimento full-stack.
