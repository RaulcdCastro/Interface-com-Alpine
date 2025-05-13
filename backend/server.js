require('dotenv').config();
const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

app.post('/verificar-email', async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'Email não fornecido' });
  }

  const apiKey = process.env.MAILBOXLAYER_KEY;
  const url = `http://apilayer.net/api/check?access_key=${apiKey}&email=${email}&format=1`;

  try {
    const resposta = await fetch(url);
    const dados = await resposta.json();

    console.log("📬 Dados da API:", JSON.stringify(dados, null, 2));

    const validoAPI =
      dados.format_valid === true &&
      dados.mx_found === true &&
      dados.smtp_check === true &&
      dados.disposable === false &&
      (typeof dados.score === 'number' ? dados.score >= 0.6 : true); // ← aqui o ajuste chave

    res.json({
      email,
      valid: validoAPI
    });

  } catch (erro) {
    console.error('❌ Erro ao verificar e-mail:', erro);
    res.status(500).json({ error: 'Erro ao verificar e-mail' });
  }
});

app.listen(3000, () => {
  console.log('🚀 Servidor rodando em http://localhost:3000');
});