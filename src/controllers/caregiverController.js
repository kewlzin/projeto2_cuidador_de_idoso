const Caregiver = require('../models/CaregiverProfile');
//TODO: tudo KKKK
async function create(req, res) {
  const profile = await Caregiver.createCaregiverProfile(req.user.id, req.body);
  res.status(201).json(profile);
}

module.exports = { create };