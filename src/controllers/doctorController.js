const Doctor = require('../models/DoctorProfile');

async function create(req, res) {
  const profile = await Doctor.createDoctorProfile(req.user.id, req.body);
  res.status(201).json(profile);
}

module.exports = { create };