const Doctor = require('../models/DoctorProfile');

async function create(req, res) {
  // Handle file upload
  const files = req.files || [];
  const filenames = files.map(f => f.filename);
  const profileData = { ...req.body, documents: filenames };
  const profile = await Doctor.createDoctorProfile(req.user.id, profileData);
  res.status(201).json(profile);
}
module.exports = { create };