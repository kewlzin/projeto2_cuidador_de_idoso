const db = require('../database');

async function createDoctorProfile(userId, data) {
  const result = await db.query(
    `INSERT INTO doctor_profiles (user_id, crm, specialty, institution, documents, verified)
     VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
    [userId, data.crm, data.specialty, data.institution, data.documents, false]
  );
  return result.rows[0];
}

module.exports = { createDoctorProfile };