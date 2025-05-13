require('dotenv').config();
const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

function nomePareceFalso(email) {
  const nome = email.split('@')[0].toLowerCase();

  if (nome.length < 4) return true;
  if (/(.)\1{4,}/.test(nome)) return true;

  const padroes = ['asdf', 'qwer', 'zxcv', '123456', '1111', 'aaaa', 'abc', 'test', 'fake'];
  return padroes.some(p => nome.includes(p));
}

app.post('/verificar-email', async (req, res) => {
  const { email } = req.body;

  const apiKey = process.env.MAILBOXLAYER_KEY;
  const url = `http://apilayer.net/api/check?access_key=${apiKey}&email=${email}&smtp=1&format=1`;

  try {
    const resposta = await fetch(url);
    const dados = await resposta.json();
    console.log("📬 Dados da API:", JSON.stringify(dados, null, 2));

    const validoAPI =
      dados.format_valid === true &&
      dados.mx_found === true &&
      dados.smtp_check === true &&
      dados.disposable === false &&
      typeof dados.score === 'number' &&
      dados.score >= 0.7 &&
      !nomePareceFalso(email);

    res.json({ email, valid: validoAPI });

  } catch (erro) {
    console.error('❌ Erro ao verificar e-mail:', erro);
    res.status(500).json({ error: 'Erro ao verificar e-mail' });
  }
});

app.listen(3000, () => {
  console.log('🚀 Servidor rodando em http://localhost:3000');
});
