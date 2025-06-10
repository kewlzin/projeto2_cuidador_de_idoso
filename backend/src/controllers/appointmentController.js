// src/controllers/appointmentController.js

const db = require("../database");
const Appointment = require("../models/Appointment");
const ServiceOfferModel = require("../models/ServiceOffer"); // Importe para buscar detalhes da oferta

/**
 * POST /api/appointments
 * Cria um novo agendamento a partir de uma oferta de serviço.
 */
async function createAppointment(req, res) {
  try {
    const patientId = req.user.id;

    const {
      serviceOfferId, // <-- NOVO: Agora espera o ID da oferta
      patientName,
      patientAge,
      address,
      notes,
    } = req.body;

    // 1) Validações básicas
    const errors = {};
    if (!serviceOfferId) errors.serviceOfferId = "ID da oferta de serviço é obrigatório";
    if (!patientName) errors.patientName = "Nome do paciente é obrigatório";
    // Melhor validação para idade
    if (patientAge === undefined || patientAge === null || patientAge === "" || isNaN(Number(patientAge)))
      errors.patientAge = "Idade do paciente é obrigatória e deve ser um número válido";
    if (!address) errors.address = "Endereço é obrigatório";

    if (Object.keys(errors).length) {
      return res.status(400).json({ errors });
    }

    // 2) Buscar a oferta de serviço para pegar o caregiverId e a data/hora
    const serviceOffer = await ServiceOfferModel.getServiceOfferById(serviceOfferId);

    if (!serviceOffer) {
      return res.status(404).json({ error: "Oferta de serviço não encontrada ou não está ativa." });
    }

    // 3) Verifica se a data/hora da oferta já passou (previne agendamentos para o passado)
    if (new Date(serviceOffer.availableAt) < new Date()) {
        return res.status(400).json({ error: "A oferta de serviço selecionada já expirou. Por favor, escolha outra." });
    }

    // 4) Opcional: Verifica se já existe agendamento para este slot específico
    //    Isso pode ser crucial para evitar agendamentos duplicados para a mesma oferta.
    const existingAppointmentCheck = await db.query(
        `SELECT id FROM appointments
         WHERE patient_id = $1
           AND service_offer_id = $2`, // Verifica pelo ID da oferta de serviço
        [patientId, serviceOfferId]
    );

    if (existingAppointmentCheck.rows.length > 0) {
        return res.status(400).json({ error: "Você já possui um agendamento para este serviço e horário." });
    }


    // 5) Chama o model para inserção
    const newAppointment = await Appointment.createAppointment({
      caregiverId: serviceOffer.caregiverId, // Pega o ID do cuidador da oferta
      patientId: Number(patientId),
      serviceOfferId: Number(serviceOfferId), // Passa o ID da oferta para o modelo
      patientName: patientName.trim(),
      patientAge: Number(patientAge),
      address: address.trim(),
      notes: notes ? notes.trim() : null,
    });

    return res.status(201).json(newAppointment);
  } catch (err) {
    console.error("Erro em createAppointment:", err);
    return res.status(500).json({ error: "Erro interno do servidor ao criar agendamento." });
  }
}

// Funções de listagem: Adicione JOIN com service_offers para trazer os detalhes
async function getAppointmentsByPatient(req, res) {
  try {
    const patientId = req.user.id;
    const result = await db.query(
      `SELECT
           a.id,
           -- Extrai date e time de service_offers.available_at para compatibilidade com o frontend
           TO_CHAR(so.available_at, 'YYYY-MM-DD') AS date, -- <--- Adicionado: Formata para 'YYYY-MM-DD'
           TO_CHAR(so.available_at, 'HH24:MI') AS time,     -- <--- Adicionado: Formata para 'HH:mm'
           a.patient_name AS "patientName", a.patient_age AS "patientAge",
           a.address, a.notes, a.created_at AS "createdAt", a.status,
           -- Dados do cuidador
           cp.user_id AS "caregiverUserId", u_caregiver.name AS "caregiverName",
           -- Dados da oferta de serviço (DE ONDE A DATA/HORA VIRÁ AGORA)
           so.id AS "serviceOfferId", so.title AS "serviceTitle", so.description AS "serviceDescription",
           so.hourly_rate AS "serviceHourlyRate", so.location AS "serviceLocation", so.available_at AS "serviceAvailableAt"
         FROM appointments a
         JOIN caregiver_profiles cp ON cp.id = a.caregiver_id
         JOIN users u_caregiver ON u_caregiver.id = cp.user_id
         LEFT JOIN service_offers so ON so.id = a.service_offer_id
         WHERE a.patient_id = $1 AND a.status <> 'cancelado'
         ORDER BY so.available_at, a.created_at`, // Ordena pela data/hora da oferta
      [patientId]
    );
    return res.json(result.rows);
  } catch (err) { console.error("Erro em getAppointmentsByPatient:", err); return res.status(500).json({ error: "Erro interno." }); }
}

async function getAppointmentsByPatient(req, res) {
  try {
    const patientId = req.user.id;
    const result = await db.query(
      `SELECT
           a.id,
           TO_CHAR(so.available_at, 'YYYY-MM-DD') AS date,
           TO_CHAR(so.available_at, 'HH24:MI') AS time,
           a.patient_name AS "patientName", a.patient_age AS "patientAge",
           a.address, a.notes, a.created_at AS "createdAt", a.status,
           cp.user_id AS "caregiverUserId", u_caregiver.name AS "caregiverName",
           so.id AS "serviceOfferId", so.title AS "serviceTitle", so.description AS "serviceDescription",
           CAST(so.hourly_rate AS NUMERIC) AS "serviceHourlyRate", -- <--- AQUI A CONVERSÃO CRÍTICA!
           so.location AS "serviceLocation", so.available_at AS "serviceAvailableAt"
         FROM appointments a
         JOIN caregiver_profiles cp ON cp.id = a.caregiver_id
         JOIN users u_caregiver ON u_caregiver.id = cp.user_id
         LEFT JOIN service_offers so ON so.id = a.service_offer_id
         WHERE a.patient_id = $1 AND a.status <> 'cancelado'
         ORDER BY so.available_at, a.created_at`,
      [patientId]
    );
    return res.json(result.rows);
  } catch (err) { console.error("Erro em getAppointmentsByPatient:", err); return res.status(500).json({ error: "Erro interno." }); }
}

async function getAppointmentsByCaregiver(req, res) {
  try {
    const userId = req.user.id;
    const caregiverProfileResult = await db.query(`SELECT id FROM caregiver_profiles WHERE user_id = $1`, [userId]);
    if (!caregiverProfileResult.rows[0]) return res.status(403).json({ error: "Perfil de cuidador não encontrado." });
    const caregiverProfileId = caregiverProfileResult.rows[0].id;

    const result = await db.query(
      `SELECT
           a.id,
           TO_CHAR(so.available_at, 'YYYY-MM-DD') AS date,
           TO_CHAR(so.available_at, 'HH24:MI') AS time,
           a.patient_name AS "patientName", a.patient_age AS "patientAge",
           a.address, a.notes, a.created_at AS "createdAt", a.status,
           u_patient.id AS "patientUserId", u_patient.name AS "patientNameFull", u_patient.email AS "patientEmail",
           so.id AS "serviceOfferId", so.title AS "serviceTitle", so.description AS "serviceDescription",
           CAST(so.hourly_rate AS NUMERIC) AS "serviceHourlyRate", -- <--- AQUI A CONVERSÃO CRÍTICA!
           so.location AS "serviceLocation", so.available_at AS "serviceAvailableAt"
         FROM appointments a
         JOIN users u_patient ON u_patient.id = a.patient_id
         LEFT JOIN service_offers so ON so.id = a.service_offer_id
         WHERE a.caregiver_id = $1 AND a.status <> 'cancelado'
         ORDER BY so.available_at, a.created_at`,
      [caregiverProfileId]
    );
    return res.json(result.rows);
  } catch (err) { console.error("Erro em getAppointmentsByCaregiver:", err); return res.status(500).json({ error: "Erro interno." }); }
}


// Mantenha sua função cancelAppointment existente aqui, exportando-a no module.exports
// Exemplo:
async function cancelAppointment(req, res) {
    try {
        const appointmentId = Number(req.params.id);
        const userId = req.user.id;

        const result = await db.query(
            `SELECT
                a.patient_id,
                cp.user_id AS caregiver_user_id,
                a.status
            FROM appointments a
            JOIN caregiver_profiles cp
                ON cp.id = a.caregiver_id
            WHERE a.id = $1`,
            [appointmentId]
        );
        const row = result.rows[0];
        if (!row) {
            return res.status(404).json({ error: "Agendamento não encontrado." });
        }

        const isPatient = row.patient_id === userId;
        const isCaregiver = row.caregiver_user_id === userId;
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
  cancelAppointment, // Certifique-se de que está aqui!
};