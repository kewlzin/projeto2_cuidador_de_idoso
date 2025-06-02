// controllers/appointmentController.js

const db = require("../database");
const Appointment = require("../models/Appointment");

/**
 * POST /api/appointments
 * Cria um novo agendamento, vinculando ao caregiver e ao paciente logado.
 */
async function createAppointment(req, res) {
  try {
    const patientId = req.user.id; // ← pega o ID do usuário logado

    const {
      caregiverId,
      date,
      time,
      patientName,
      patientAge,
      address,
      notes,
    } = req.body;

    // 1) Validações básicas
    const errors = {};
    if (!caregiverId) errors.caregiverId = "ID do cuidador é obrigatório";
    if (!date) errors.date = "Data é obrigatória";
    if (!time) errors.time = "Horário é obrigatório";
    if (!patientName) errors.patientName = "Nome do paciente é obrigatório";
    if ((patientAge === undefined || patientAge === "") && patientAge !== 0)
      errors.patientAge = "Idade do paciente é obrigatória";
    if (!address) errors.address = "Endereço é obrigatório";

    if (Object.keys(errors).length) {
      return res.status(400).json({ errors });
    }

    // 2) Verifica se o caregiver existe
    const caregiverResult = await db.query(
      `SELECT id FROM caregiver_profiles WHERE id = $1`,
      [caregiverId]
    );
    if (!caregiverResult.rows[0]) {
      return res
        .status(404)
        .json({ error: "Perfil de cuidador não encontrado." });
    }

    // 3) Verifica se o patientId (usuário logado) existe
    const userResult = await db.query(`SELECT id FROM users WHERE id = $1`, [
      patientId,
    ]);
    if (!userResult.rows[0]) {
      // (teoricamente não deve acontecer se o usuário está autenticado)
      return res.status(404).json({ error: "Usuário não encontrado." });
    }

    // 4) Chama o model para inserção, agora incluindo patientId
    const newAppointment = await Appointment.createAppointment({
      caregiverId: Number(caregiverId),
      patientId: Number(patientId),
      date, // ex.: "2025-06-15"
      time, // ex.: "14:00"
      patientName: patientName.trim(),
      patientAge: Number(patientAge),
      address: address.trim(),
      notes: notes ? notes.trim() : null,
    });

    return res.status(201).json(newAppointment);
  } catch (err) {
    console.error("Erro em createAppointment:", err);
    return res
      .status(500)
      .json({ error: "Erro interno do servidor ao criar agendamento." });
  }
}

async function getAppointmentsByPatient(req, res) {
  try {
    const patientId = req.user.id;

    // Busca todos os agendamentos onde patient_id = paciente logado
    // Faz join para trazer dados básicos do cuidador
    const result = await db.query(
      `SELECT
         a.id,
         a.date,
         a.time,
         a.patient_name AS "patientName",
         a.patient_age AS "patientAge",
         a.address,
         a.notes,
         a.created_at AS "createdAt",

         -- Dados do cuidador
         cp.user_id AS "caregiverUserId",
         u.name AS "caregiverName",
         u.email AS "caregiverEmail",
         u.phone AS "caregiverPhone"
       FROM appointments a
       JOIN caregiver_profiles cp ON cp.id = a.caregiver_id
       JOIN users u ON u.id = cp.user_id
       WHERE a.patient_id = $1
       AND a.status <> 'cancelado'
       ORDER BY a.date, a.time`,
      [patientId]
    );

    return res.json(result.rows);
  } catch (err) {
    console.error("Erro em getAppointmentsByPatient:", err);
    return res
      .status(500)
      .json({ error: "Erro interno do servidor ao buscar agendamentos." });
  }
}

async function getAppointmentsByCaregiver(req, res) {
  try {
    const userId = req.user.id;

    // 1) Encontra o caregiver_profile.id a partir de req.user.id
    const caregiverProfileResult = await db.query(
      `SELECT id FROM caregiver_profiles WHERE user_id = $1`,
      [userId]
    );
    if (!caregiverProfileResult.rows[0]) {
      return res
        .status(403)
        .json({ error: "Perfil de cuidador não encontrado para este usuário." });
    }
    const caregiverProfileId = caregiverProfileResult.rows[0].id;

    // 2) Busca todos os agendamentos onde caregiver_id = caregiverProfileId
    //    Faz join para trazer dados básicos do paciente (usuário)
    const result = await db.query(
      `SELECT
         a.id,
         a.date,
         a.time,
         a.patient_name AS "patientName",
         a.patient_age AS "patientAge",
         a.address,
         a.notes,
         a.created_at AS "createdAt",

         -- Dados do paciente
         u.id AS "patientUserId",
         u.name AS "patientNameFull",
         u.email AS "patientEmail",
         u.phone AS "patientPhone"
       FROM appointments a
       JOIN users u ON u.id = a.patient_id
       WHERE a.caregiver_id = $1
       AND a.status <> 'cancelado'
       ORDER BY a.date, a.time`,
      [caregiverProfileId]
    );

    return res.json(result.rows);
  } catch (err) {
    console.error("Erro em getAppointmentsByCaregiver:", err);
    return res
      .status(500)
      .json({ error: "Erro interno do servidor ao buscar agendamentos." });
  }
}


async function cancelAppointment(req, res) {
  try {
    const appointmentId = Number(req.params.id);
    const userId = req.user.id;

    const result = await db.query(
      `SELECT patient_id, caregiver_id, status 
         FROM appointments
        WHERE id = $1`,
      [appointmentId]
    );
    const row = result.rows[0];
    if (!row) {
      return res.status(404).json({ error: "Agendamento não encontrado." });
    }

    const isPatient = row.patient_id === userId;
    const isCaregiver = row.caregiver_id === userId;
    if (!isPatient && !isCaregiver) {
      return res
        .status(403)
        .json({ error: "Você não pode cancelar este agendamento." });
    }

    if (row.status === "cancelado") {
      return res
        .status(400)
        .json({ error: "Este agendamento já está cancelado." });
    }

    const updated = await Appointment.cancelAppointmentById(appointmentId);
    return res.json(updated);
  } catch (err) {
    console.error("Erro em cancelAppointment:", err);
    return res
      .status(500)
      .json({ error: "Erro interno ao cancelar agendamento." });
  }
}


module.exports = {
  createAppointment,
  getAppointmentsByPatient,
  getAppointmentsByCaregiver,
  cancelAppointment,
};
