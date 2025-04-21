const Note = require('../models/MedicalNote');

async function create(req, res) {
  const { senior_id, note } = req.body;
  const medicalNote = await Note.createMedicalNote(req.user.id, senior_id, note);
  res.status(201).json(medicalNote);
}

module.exports = { create };
