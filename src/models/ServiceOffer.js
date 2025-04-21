const db = require('../database');

async function createServiceOffer(caregiverId, data) {
  const result = await db.query(
    `INSERT INTO service_offers (caregiver_id, title, description, hourly_rate, location, active)
     VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
    [caregiverId, data.title, data.description, data.hourly_rate, data.location, true]
  );
  return result.rows[0];
}

module.exports = { createServiceOffer };
