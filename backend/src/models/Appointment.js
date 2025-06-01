// models/Appointment.js

const db = require("../database");

/**
 * Insere um novo agendamento na tabela `appointments`.
 * @param {Object} data
 * @param {number} data.caregiverId  – ID do caregiver_profile
 * @param {number} data.patientId    – ID do usuário que criou o agendamento (req.user.id)
 * @param {string} data.date         – “YYYY-MM-DD”
 * @param {string} data.time         – “HH:mm”
 * @param {string} data.patientName
 * @param {number} data.patientAge
 * @param {string} data.address
 * @param {string} [data.notes]
 * @returns {Promise<Object>}        – Retorna o registro criado
 */
async function createAppointment(data) {
  const {
    caregiverId,
    patientId,
    date,
    time,
    patientName,
    patientAge,
    address,
    notes,
  } = data;

  const result = await db.query(
    `INSERT INTO appointments
      (caregiver_id, patient_id, date, time, patient_name, patient_age, address, notes)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
     RETURNING *`,
    [
      caregiverId,
      patientId,
      date,
      time,
      patientName,
      patientAge,
      address,
      notes || null,
    ]
  );

  return result.rows[0];
}

module.exports = {
  createAppointment,
};
