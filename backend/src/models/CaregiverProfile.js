const db = require('../database');

async function createCaregiverProfile(userId, data) {
  // Garantir que certifications seja um array para o PostgreSQL TEXT[]
  let certificationsArray = [];
  if (data.certifications !== undefined) {
    if (Array.isArray(data.certifications)) {
      certificationsArray = data.certifications;
    } else if (typeof data.certifications === 'string') {
      // Caso venha string única ou CSV
      certificationsArray = data.certifications.includes(',')
        ? data.certifications.split(',').map(item => item.trim())
        : [data.certifications.trim()];
    }
  }

  const result = await db.query(
    `INSERT INTO caregiver_profiles (user_id, bio, experience_years, certifications, verified)
     VALUES ($1, $2, $3, $4, $5) RETURNING *`,
    [userId, data.bio, data.experience_years, certificationsArray, false]
  );
  return result.rows[0];
}

module.exports = { createCaregiverProfile };