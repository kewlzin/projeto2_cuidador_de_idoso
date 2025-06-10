// src/models/ServiceOffer.js

const db = require('../database');

/**
 * Cria um novo serviço oferecido por um cuidador/enfermeiro.
 * @param {number} caregiverId - ID do caregiver_profile.
 * @param {Object} data
 * @param {string} data.title - Título do serviço.
 * @param {string} data.description - Descrição do serviço.
 * @param {number} data.hourly_rate - Valor por hora do serviço.
 * @param {string} data.location - Localização onde o serviço é oferecido.
 * @param {string} data.availableAt - Data e hora exata de disponibilidade (formato ISO 8601, ex: "2025-06-15T10:00:00Z").
 * @returns {Promise<Object>} - Retorna o registro do serviço criado.
 */
async function createServiceOffer(caregiverId, data) {
const { title, description, hourly_rate, location, availableAt } = data; // <--- O availableAt PRECISA ser desestruturado aqui
  const result = await db.query(
    `INSERT INTO service_offers (caregiver_id, title, description, hourly_rate, location, active, available_at)
     VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`, // <--- available_at precisa ser incluído na lista de colunas
    [caregiverId, title, description, hourly_rate, location, true, availableAt] // <--- availableAt precisa ser incluído nos parâmetros
  );
  return result.rows[0];
}
/**
 * Busca uma oferta de serviço pelo ID, incluindo os detalhes do cuidador e a data/hora de disponibilidade.
 * @param {number} serviceOfferId - ID da oferta de serviço.
 * @returns {Promise<Object>} - Retorna o registro do serviço com seus detalhes.
 */
async function getServiceOfferById(serviceOfferId) {
    const result = await db.query(
        `SELECT
            so.id,
            so.title,
            so.description,
            so.hourly_rate AS "hourlyRate",
            so.location,
            so.active,
            so.created_at AS "createdAt",
            so.available_at AS "availableAt", -- <-- Adicionado aqui!

            cp.id AS "caregiverId",
            cp.user_id AS "caregiverUserId",
            cp.bio,
            cp.experience_years AS "experienceYears",
            cp.certifications,
            cp.verified AS "caregiverVerified",
            cp.created_at AS "caregiverCreatedAt",

            u.id AS "userId",
            u.name AS "userName",
            u.email AS "userEmail",
            u.phone AS "userPhone",
            u.tipo AS "userType",
            u.created_at AS "userCreatedAt"
        FROM service_offers so
        JOIN caregiver_profiles cp ON cp.id = so.caregiver_id
        JOIN users u ON u.id = cp.user_id
        WHERE so.id = $1
            AND so.active = true`
        , [serviceOfferId]
    );
    return result.rows[0];
}


module.exports = {
  createServiceOffer,
  getServiceOfferById, // Exporta a nova função para que o controller possa usá-la
};