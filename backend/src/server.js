const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const sequelize = require('./database');
const User = require('./models/User');
const CipherKey = require('./models/CipherKey');
const { caesarCipher } = require('./utils/caesar');
const { authMiddleware, JWT_SECRET } = require('./middlewares/auth');

const app = express();
app.use(cors());
app.use(express.json());

// 1. Cadastro de Usuário
app.post('/api/register', async (req, res) => {
  try {
    const username = req.body.username?.trim();
    const password = req.body.password;

    if (!username || !password) {
      return res.status(400).json({ error: 'Informe usuário e senha.' });
    }

    const exists = await User.findOne({ where: { username } });
    if (exists) {
      return res.status(409).json({ error: 'Usuário já cadastrado.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({ username, password: hashedPassword });

    return res.status(201).json({ message: 'Usuário cadastrado com sucesso!' });
  } catch (err) {
    return res.status(500).json({ error: 'Erro interno ao cadastrar usuário.' });
  }
});

// 2. Login com JWT
app.post('/api/login', async (req, res) => {
  try {
    const username = req.body.username?.trim();
    const password = req.body.password;

    if (!username || !password) {
      return res.status(400).json({ error: 'Informe usuário e senha.' });
    }

    const user = await User.findOne({ where: { username } });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: 'Usuário ou senha inválidos.' });
    }

    const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, {
      expiresIn: '2h',
    });

    return res.json({ token, username: user.username });
  } catch (err) {
    return res.status(500).json({ error: 'Erro interno no login.' });
  }
});

// 3. Criptografar (Rota Protegida por JWT)
app.post('/api/encrypt', authMiddleware, async (req, res) => {
  try {
    const { message, passo } = req.body;
    const shift = parseInt(passo, 10);

    if (!message || Number.isNaN(shift)) {
      return res.status(400).json({ error: 'Informe a mensagem e um passo numérico válido.' });
    }

    const encryptedMessage = caesarCipher(message, shift);
    // Gera um hash único alfanumérico (chave privada)
    const hash = crypto.randomBytes(16).toString('hex');

    await CipherKey.create({ hash, passo: shift, usado: false });

    return res.json({ encryptedMessage, hash });
  } catch (err) {
    return res.status(500).json({ error: 'Erro ao criptografar mensagem.' });
  }
});

// 4. Descriptografar (Rota Protegida por JWT + Uso Único do Hash)
app.post('/api/decrypt', authMiddleware, async (req, res) => {
  try {
    const encryptedMessage = req.body.encryptedMessage;
    const hash = req.body.hash?.trim();

    if (!encryptedMessage || !hash) {
      return res.status(400).json({ error: 'Informe a mensagem criptografada e o hash.' });
    }

    const keyRecord = await CipherKey.findOne({ where: { hash } });

    if (!keyRecord) {
      return res.status(404).json({ error: 'Hash inválido ou não encontrado.' });
    }

    if (keyRecord.usado) {
      return res.status(403).json({ error: 'Este hash já foi utilizado e não é mais válido.' });
    }

    // Descriptografa aplicando o passo invertido
    const decryptedMessage = caesarCipher(encryptedMessage, -keyRecord.passo);

    // Marca o hash como utilizado (uso único)
    keyRecord.usado = true;
    await keyRecord.save();

    return res.json({ decryptedMessage });
  } catch (err) {
    return res.status(500).json({ error: 'Erro ao descriptografar mensagem.' });
  }
});

const PORT = process.env.PORT || 3001;

sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`Backend rodando em http://localhost:${PORT}`);
  });
});
