const db = require('../database');

async function createCaregiverProfile(userId, data) {
  const result = await db.query(
    `INSERT INTO caregiver_profiles (user_id, bio, experience_years, certifications, verified)
     VALUES ($1, $2, $3, $4, $5) RETURNING *`,
    [userId, data.bio, data.experience_years, data.certifications, false]
  );
  return result.rows[0];
}

module.exports = { createCaregiverProfile };