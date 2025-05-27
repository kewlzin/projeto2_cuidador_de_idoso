const Service = require('../models/ServiceOffer');
const Request = require('../models/ServiceRequest');
const db = require('../database');

async function createOffer(req, res) {
  const caregiverResult = await db.query(
    'SELECT id FROM caregiver_profiles WHERE user_id = $1',
    [req.user.id]
  );

  if (!caregiverResult.rows[0]) {
    return res.status(400).json({ error: 'Perfil de cuidador não encontrado' });
  }

  const caregiverId = caregiverResult.rows[0].id;

  const offerData = {
    ...req.body,
    caregiverId, 
  };

  const offer = await Service.createServiceOffer(req.user.id, offerData);
  res.status(201).json(offer);
}

async function requestService(req, res) {
  const { service_id } = req.body;
  const request = await Request.createServiceRequest(service_id, req.user.id);
  res.status(201).json(request);
}

module.exports = { createOffer, requestService };
