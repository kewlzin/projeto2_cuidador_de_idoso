const db = require('../database');

async function createUser({ name, email, passwordHash, tipo }) {
  const result = await db.query(
    'INSERT INTO users (name, email, password_hash, tipo) VALUES ($1, $2, $3, $4) RETURNING *',
    [name, email, passwordHash, tipo]
  );
  return result.rows[0];
}

async function findByEmail(email) {
  const result = await db.query(
    'SELECT * FROM users WHERE email = $1',
    [email]
  );
  return result.rows[0];
}

module.exports = {
  createUser,
  findByEmail
};
