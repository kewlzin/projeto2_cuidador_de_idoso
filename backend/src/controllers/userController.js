const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../database');
const { createCaregiverProfile } = require('../models/CaregiverProfile');
const { createDoctorProfile } = require('../models/DoctorProfile');
const { createPatientProfile } = require('../models/PatientProfile');
const User = require('../models/User');

async function register(req, res) {
  const { full_name, email, password, role, ...profileData } = req.body;

  if (!['patient','caregiver','doctor'].includes(role)) {
    return res.status(400).json({ error: 'Tipo de usuário inválido.' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const userResult = await db.query(
      'INSERT INTO users (name, email, password_hash, tipo) VALUES ($1, $2, $3, $4) RETURNING *',
      [full_name, email, hashedPassword, role]
    );
    const user = userResult.rows[0];

    if (role === 'patient') {
      // aqui adicionamos full_name no objeto passado
      await createPatientProfile(user.id, { full_name, ...profileData });
    } else if (role === 'caregiver') {
      await createCaregiverProfile(user.id, profileData);
    } else if (role === 'doctor') {
      await createDoctorProfile(user.id, profileData);
    }

    res.status(201).json({ message: 'Usuário registrado com sucesso', user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao registrar usuário' });
  }
}

// src/controllers/userController.js

async function login(req, res) {
  const { email, password } = req.body;

  try {
    const result = await db.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );
    const user = result.rows[0];

    // se não encontrar usuário ou senha inválida, retorna 401
    if (
      !user ||
      !(await bcrypt.compare(password, user.password_hash))
    ) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    // assina o token com id e tipo (campo no banco)
    const token = jwt.sign(
      { id: user.id, role: user.tipo },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.status(200).json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao realizar login' });
  }
}

async function getUser(req, res) {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) {
    return res.status(400).json({ error: 'ID inválido' });
  }
  const result = await db.query('SELECT * FROM users WHERE id = $1', [id]);
  if (!result.rows[0]) {
    return res.status(404).json({ error: 'Usuário não encontrado' });
  }
  res.status(200).json(result.rows[0]);
}


async function getCurrentUser(req, res) {
  try {
    const userId = req.user.id;                  // já vem do authMiddleware
    const result = await db.query(
      'SELECT id, name, email, phone, tipo AS role, created_at \
       FROM users WHERE id = $1',
      [userId]
    );

    const user = result.rows[0];
    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    return res.json(user);
  } catch (err) {
    console.error('Erro ao buscar usuário atual:', err);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
}

module.exports = { register, login, getUser, getCurrentUser };