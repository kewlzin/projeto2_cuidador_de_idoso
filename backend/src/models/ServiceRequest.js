const db = require('../database');

async function createServiceRequest(serviceId, patientId) {
  const result = await db.query(
    `INSERT INTO service_requests (service_id, patient_id, request_date, status)
     VALUES ($1, $2, NOW(), 'pendente') RETURNING *`,
    [serviceId, patientId]
  );
  return result.rows[0];
}

module.exports = { createServiceRequest };
