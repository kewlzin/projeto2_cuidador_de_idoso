const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../database');
const { createCaregiverProfile } = require('../models/CaregiverProfile');
const { createDoctorProfile } = require('../models/DoctorProfile');
const { createPatientProfile } = require('../models/PatientProfile');
const User = require('../models/User');

async function register(req, res) {
  const { full_name, email, password, role, phone, birth_date, ...profileData } = req.body;

  if (!['patient', 'caregiver', 'doctor'].includes(role)) {
    return res.status(400).json({ error: 'Tipo de usuário inválido.' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const userResult = await db.query(
      `INSERT INTO users (name, email, password_hash, tipo, phone, birth_date)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [full_name, email, hashedPassword, role, phone || null, birth_date || null]
    );
    const user = userResult.rows[0];

    if (role === 'patient') {
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

  try {
    const userResult = await db.query('SELECT * FROM users WHERE id = $1', [id]);
    const user = userResult.rows[0];
    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    // buscar perfil de cuidador, se existir
    const caregiverResult = await db.query(
      'SELECT * FROM caregiver_profiles WHERE user_id = $1',
      [user.id]
    );

    const caregiverProfile = caregiverResult.rows[0] || null;

    res.status(200).json({
      ...user,
      caregiverProfile,
    });

  } catch (error) {
    console.error('Erro no getUser:', error);
    res.status(500).json({ error: 'Erro interno no servidor' });
  }
}


// async function getCurrentUser(req, res) {
//   try {
//     const userId = req.user.id;

//     const result = await db.query(
//       `SELECT 
//          u.id,
//          u.name,
//          u.email,
//          u.phone,
//          u.tipo AS role,
//          u.created_at,
//          c.id AS caregiver_id 
//        FROM users u
//        LEFT JOIN caregiver_profiles c ON c.user_id = u.id
//        WHERE u.id = $1`,
//       [userId]
//     );

//     const user = result.rows[0];

//     if (!user) {
//       return res.status(404).json({ error: 'Usuário não encontrado' });
//     }

//     return res.json(user);
//   } catch (err) {
//     console.error('Erro ao buscar usuário atual:', err);
//     return res.status(500).json({ error: 'Erro interno do servidor' });
//   }
// }

async function getCurrentUser(req, res) {
  try {
    const userId = req.user.id;
    const userResult = await db.query(
      `SELECT 
         u.id,
         u.name,
         u.email,
         u.phone,
         u.tipo AS role,
         u.created_at
       FROM users u
       WHERE u.id = $1`,
      [userId]
    );

    const user = userResult.rows[0];

    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }
    let profile = null;

    if (user.role === 'caregiver') {
      const caregiverResult = await db.query(
        `SELECT
           id AS caregiver_id,
           bio,
           experience_years,
           certifications,
           verified,
           created_at
         FROM caregiver_profiles
         WHERE user_id = $1`,
        [userId]
      );
      profile = caregiverResult.rows[0] || null;
    }
    else if (user.role === 'doctor') {
      const doctorResult = await db.query(
        `SELECT
           id AS doctor_id,
           crm,
           specialty,
           institution,
           documents,
           verified,
           created_at
         FROM doctor_profiles
         WHERE user_id = $1`,
        [userId]
      );
      profile = doctorResult.rows[0] || null;
    }

    return res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      created_at: user.created_at,
      profile // será null para idosos
    });
  } catch (err) {
    console.error('Erro ao buscar usuário atual:', err);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
}


module.exports = { register, login, getUser, getCurrentUser };