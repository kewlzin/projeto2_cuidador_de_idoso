// routes/appointments.js

const express = require("express");
const router = express.Router();
const appointmentController = require("../controllers/appointmentController");
const authenticate = require('../middlewares/authMiddleware');

// POST /api/appointments → cria um agendamento
router.post(
  "/",
  authenticate, // garante que req.user esteja preenchido
  appointmentController.createAppointment
);

router.get(
  "/patient",
  authenticate,
  appointmentController.getAppointmentsByPatient
);

// GET /api/appointments/caregiver  → lista agendamentos do cuidador logado
router.get(
  "/caregiver",
  authenticate,
  appointmentController.getAppointmentsByCaregiver
);

router.patch("/:id/cancel", authenticate, appointmentController.cancelAppointment);

module.exports = router;
