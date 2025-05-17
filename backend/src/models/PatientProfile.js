const db = require('../database');

async function createPatientProfile(userId, data) {
  const result = await db.query(
    `INSERT INTO patient_profiles (user_id, full_name, age, address, phone)
     VALUES ($1, $2, $3, $4, $5) RETURNING *`,
    [userId, data.full_name, data.age, data.address, data.phone]
  );
  return result.rows[0];
}

module.exports = { createPatientProfile };