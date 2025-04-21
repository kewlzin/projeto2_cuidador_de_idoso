const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../database');
const { createCaregiverProfile } = require('../models/CaregiverProfile');
const { createDoctorProfile } = require('../models/DoctorProfile');
const { createPatientProfile } = require('../models/PatientProfile');

async function register(req, res) {
  const { email, password, role, ...profileData } = req.body;

  if (!['patient', 'caregiver', 'doctor'].includes(role)) {
    return res.status(400).json({ error: 'Tipo de usuário inválido.' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const userResult = await db.query(
      'INSERT INTO users (email, password, role) VALUES ($1, $2, $3) RETURNING *',
      [email, hashedPassword, role]
    );

    const user = userResult.rows[0];

    if (role === 'patient') {
      await createPatientProfile(user.id, profileData);
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

async function login(req, res) {
  const { email, password } = req.body;

  try {
    const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    const user = result.rows[0];

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: '1d'
    });

    res.status(200).json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao realizar login' });
  }
}

module.exports = { register, login };