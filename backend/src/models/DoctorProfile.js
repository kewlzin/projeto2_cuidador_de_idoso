const db = require('../database');

async function createDoctorProfile(userId, data) {
  let documentsArray = [];
  if (data.documents !== undefined) {
    if (Array.isArray(data.documents)) {
      documentsArray = data.documents;
    } else if (typeof data.documents === 'string') {
      documentsArray = data.documents.includes(',')
        ? data.documents.split(',').map(item => item.trim())
        : [data.documents.trim()];
    }
  }

  const result = await db.query(
    `INSERT INTO doctor_profiles (user_id, crm, specialty, institution, documents, verified)
     VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
    [userId, data.crm, data.specialty, data.institution, documentsArray, false]
  );
  return result.rows[0];
}

module.exports = { createDoctorProfile };