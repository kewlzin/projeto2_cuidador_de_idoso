// src/models/Appointment.js

const db = require("../database");

/**
 * Insere um novo agendamento na tabela `appointments`.
 * @param {Object} data
 * @param {number} data.caregiverId  – ID do caregiver_profile
 * @param {number} data.patientId    – ID do usuário que criou o agendamento (req.user.id)
 * @param {number} data.serviceOfferId - ID da oferta de serviço selecionada.
 * @param {string} data.patientName
 * @param {number} data.patientAge
 * @param {string} data.address
 * @param {string} [data.notes]
 * @returns {Promise<Object>}        – Retorna o registro criado
 */
async function createAppointment(data) {
  const {
    caregiverId,
    patientId,
    serviceOfferId, // <-- NOVO: ID da oferta de serviço
    patientName,
    patientAge,
    address,
    notes,
  } = data;

  // 1. Buscar a data e hora do serviceOffer usando o serviceOfferId
  //    Nota: 'db.query' direto aqui, sem importar ServiceOfferModel, para manter a simplicidade.
  const serviceOfferResult = await db.query(
    `SELECT available_at FROM service_offers WHERE id = $1`,
    [serviceOfferId]
  );

  if (!serviceOfferResult.rows[0]) {
    throw new Error("Oferta de serviço não encontrada para o agendamento.");
  }

  const availableAt = serviceOfferResult.rows[0].available_at;
  // REMOVIDO: Extração de 'date' e 'time' para uso em colunas de appointments.
  // As colunas 'date' e 'time' foram removidas da tabela 'appointments' no banco.
  // Agora, o agendamento é diretamente vinculado ao service_offer_id,
  // e a data/hora é inferida de service_offers.available_at nas consultas.


  const result = await db.query(
    // AQUI ESTÁ A MUDANÇA: Remova 'date', 'time' da lista de colunas e de valores
    `INSERT INTO appointments
      (caregiver_id, patient_id, patient_name, patient_age, address, notes, service_offer_id)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *`,
    [
      caregiverId,
      patientId,
      // REMOVIDO: date, time
      patientName,
      patientAge,
      address,
      notes || null,
      serviceOfferId // <-- Salva o ID da oferta no agendamento
    ]
  );

  return result.rows[0];
}

async function cancelAppointmentById(appointmentId) {
    const result = await db.query(
      `UPDATE appointments
        SET status = 'cancelado'
       WHERE id = $1
       RETURNING *`,
      [appointmentId]
    );
    return result.rows[0];
  }

module.exports = {
  createAppointment,
  cancelAppointmentById,
};