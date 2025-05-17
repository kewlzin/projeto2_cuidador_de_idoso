const db = require('../database');

async function createMedicalNote(doctorId, patientId, note) {
  const result = await db.query(
    `INSERT INTO medical_notes (doctor_id, patient_id, note, created_at)
     VALUES ($1, $2, $3, NOW()) RETURNING *`,
    [doctorId, patientId, note]
  );
  return result.rows[0];
}

module.exports = { createMedicalNote };