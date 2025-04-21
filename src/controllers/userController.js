const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

async function register(req, res) {
  const { name, email, password, tipo } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.createUser({
    name,
    email,
    passwordHash: hashedPassword,
    tipo
  });

  res.status(201).json(user);
}

async function login(req, res) {
  const { email, password } = req.body;
  const user = await User.findByEmail(email);

  if (!user) return res.status(401).json({ error: 'Usuário não encontrado' });

  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) return res.status(401).json({ error: 'Senha incorreta' });

  const token = jwt.sign({ id: user.id, tipo: user.tipo }, process.env.JWT_SECRET, {
    expiresIn: '1d'
  });

  res.json({ token, user });
}

module.exports = {
  register,
  login
};
