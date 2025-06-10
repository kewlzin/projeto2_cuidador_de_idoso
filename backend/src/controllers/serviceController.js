const Service = require('../models/ServiceOffer');
const Request = require('../models/ServiceRequest');
const db = require('../database');

// Helper para checar se valor é vazio ou undefined
function isEmpty(value) {
  return (
    value === undefined ||
    value === null ||
    (typeof value === 'string' && value.trim() === '')
  );
}

async function createOffer(req, res) {
  try {
    const userId = req.user.id;

    // 1. Verifica se o usuário logado tem perfil de caregiver
    const caregiverResult = await db.query(
      `SELECT id
       FROM caregiver_profiles
       WHERE user_id = $1`,
      [userId]
    );

    console.log("Dados recebidos no backend para createOffer:", req.body);
    

    if (!caregiverResult.rows[0]) {
      return res
        .status(400)
        .json({ error: 'Perfil de cuidador não encontrado para este usuário.' });
    }

    const caregiverId = caregiverResult.rows[0].id;

    // 2. Valida campos obrigatórios no body
    const { title, description, hourly_rate, location, availableAt } = req.body;
    if (
      isEmpty(title) ||
      isEmpty(description) ||
      isEmpty(hourly_rate) ||
      isEmpty(availableAt) ||
      isEmpty(location)

    ) {
      return res.status(400).json({
        error:
          'Dados incompletos. Certifique-se de informar title, description, hourly_rate e location.',
      });
    }

    // 3. Monta o objeto de dados para a oferta
    const offerData = {
      title: title.trim(),
      description: description.trim(),
      hourly_rate: Number(hourly_rate),
      location: location.trim(),
      availableAt: availableAt
    };

    console.log("Valor de availableAt recebido no backend:", availableAt);
    // 4. Chama o método de criação, passando caregiverId corretamente
    const newOffer = await Service.createServiceOffer(caregiverId, offerData);

    return res.status(201).json(newOffer);
  } catch (err) {
    console.error('Erro em createOffer:', err);
    return res
      .status(500)
      .json({ error: 'Erro interno do servidor ao criar oferta de serviço.' });
  }
}

async function requestService(req, res) {
  try {
    const userId = req.user.id;

    // 1. O paciente logado deve ter role = 'patient'
    if (req.user.role !== 'patient') {
      return res
        .status(403)
        .json({ error: 'Apenas pacientes podem solicitar um serviço.' });
    }

    const { service_id } = req.body;
    if (!service_id) {
      return res
        .status(400)
        .json({ error: 'O campo service_id é obrigatório.' });
    }

    // 2. Verifica se o serviço existe e está ativo
    const serviceResult = await db.query(
      `SELECT so.id,
              so.caregiver_id,
              cp.user_id AS caregiver_user_id
       FROM service_offers so
       JOIN caregiver_profiles cp ON cp.id = so.caregiver_id
       WHERE so.id = $1
         AND so.active = true`,
      [service_id]
    );

    if (!serviceResult.rows[0]) {
      return res
        .status(404)
        .json({ error: 'Serviço não encontrado ou não está ativo.' });
    }

    const { caregiver_user_id } = serviceResult.rows[0];

    // 3. Impede que o próprio caregiver (criador) faça a requisição
    if (caregiver_user_id === userId) {
      return res
        .status(400)
        .json({ error: 'Você não pode solicitar seu próprio serviço.' });
    }

    // 4. Verifica se já existe requisição pendente deste paciente para este serviço
    const existingRequest = await db.query(
      `SELECT id
       FROM service_requests
       WHERE service_id = $1
         AND patient_id = $2
         AND status = 'pendente'`,
      [service_id, userId]
    );

    if (existingRequest.rows.length > 0) {
      return res.status(400).json({
        error: 'Já existe uma requisição pendente para este serviço.',
      });
    }

    // 5. Se passou em todas as validações, cria a requisição
    const newRequest = await Request.createServiceRequest(service_id, userId);
    return res.status(201).json(newRequest);
  } catch (err) {
    console.error('Erro em requestService:', err);
    return res
      .status(500)
      .json({ error: 'Erro interno do servidor ao requisitar serviço.' });
  }
}

async function getAllOffers(req, res) {
  try {
    const result = await db.query(
      `SELECT 
         so.id AS offer_id,
         so.title,
         so.description,
         so.hourly_rate,
         so.location,
         so.active,
         so.created_at AS offer_created_at,

         cp.id AS caregiver_profile_id,
         cp.bio,
         cp.experience_years,
         cp.certifications,
         cp.verified AS caregiver_verified,
         cp.created_at AS caregiver_created_at,

         u.id AS caregiver_user_id,
         u.name AS caregiver_name,
         u.email AS caregiver_email,
         u.phone AS caregiver_phone

       FROM service_offers so
       JOIN caregiver_profiles cp ON cp.id = so.caregiver_id
       JOIN users u ON u.id = cp.user_id
       WHERE so.active = true
       ORDER BY so.created_at DESC`
    );

    // Monta um array de objetos no formato:
    // {
    //   offer_id, title, description, hourly_rate, location, active, offer_created_at,
    //   caregiver: { caregiver_profile_id, bio, experience_years, certifications, verified, created_at,
    //               user: { id, name, email, phone } }
    // }
    const offers = result.rows.map((row) => ({
      offer_id: row.offer_id,
      title: row.title,
      description: row.description,
      hourly_rate: row.hourly_rate,
      location: row.location,
      active: row.active,
      created_at: row.offer_created_at,

      caregiver: {
        caregiver_profile_id: row.caregiver_profile_id,
        bio: row.bio,
        experience_years: row.experience_years,
        certifications: row.certifications,
        verified: row.caregiver_verified,
        created_at: row.caregiver_created_at,

        user: {
          id: row.caregiver_user_id,
          name: row.caregiver_name,
          email: row.caregiver_email,
          phone: row.caregiver_phone,
        },
      },
    }));

    return res.json(offers);
  } catch (err) {
    console.error('Erro em getAllOffers:', err);
    return res
      .status(500)
      .json({ error: 'Erro interno do servidor ao listar ofertas.' });
  }
}

/**
 * GET /api/service-offers/me
 * Lista apenas as ofertas do cuidador logado (usuário com role = 'caregiver').
 */
async function getMyOffers(req, res) {
  try {
    const userId = req.user.id;

    // 1. Verifica se o usuário é caregiver e obtém o ID do perfil
    const caregiverResult = await db.query(
      `SELECT id
       FROM caregiver_profiles
       WHERE user_id = $1`,
      [userId]
    );

    if (!caregiverResult.rows[0]) {
      // Se o usuário não tiver perfil de caregiver, retorna array vazio
      return res.json([]);
    }

    const caregiverProfileId = caregiverResult.rows[0].id;

    // 2. Busca as ofertas desse caregiver
    const result = await db.query(
      `SELECT 
         so.id AS offer_id,
         so.title,
         so.description,
         so.hourly_rate,
         so.location,
         so.active,
         so.created_at AS offer_created_at,

         cp.id AS caregiver_profile_id,
         cp.bio,
         cp.experience_years,
         cp.certifications,
         cp.verified AS caregiver_verified,
         cp.created_at AS caregiver_created_at,

         u.id AS caregiver_user_id,
         u.name AS caregiver_name,
         u.email AS caregiver_email,
         u.phone AS caregiver_phone

       FROM service_offers so
       JOIN caregiver_profiles cp ON cp.id = so.caregiver_id
       JOIN users u ON u.id = cp.user_id
       WHERE so.active = true
         AND cp.id = $1
       ORDER BY so.created_at DESC`,
      [caregiverProfileId]
    );

    const myOffers = result.rows.map((row) => ({
      offer_id: row.offer_id,
      title: row.title,
      description: row.description,
      hourly_rate: row.hourly_rate,
      location: row.location,
      active: row.active,
      created_at: row.offer_created_at,

      caregiver: {
        caregiver_profile_id: row.caregiver_profile_id,
        bio: row.bio,
        experience_years: row.experience_years,
        certifications: row.certifications,
        verified: row.caregiver_verified,
        created_at: row.caregiver_created_at,

        user: {
          id: row.caregiver_user_id,
          name: row.caregiver_name,
          email: row.caregiver_email,
          phone: row.caregiver_phone,
        },
      },
    }));

    return res.json(myOffers);
  } catch (err) {
    console.error('Erro em getMyOffers:', err);
    return res
      .status(500)
      .json({ error: 'Erro interno do servidor ao listar ofertas do usuário.' });
  }
}

async function getOfferById(req, res) {
    try {
        const { id } = req.params;

        const result = await db.query(
            `SELECT
                so.id,
                so.title,
                so.description,
                so.hourly_rate AS "hourlyRate",
                so.location,
                so.active,
                so.created_at AS "createdAt",
                so.available_at AS "availableAt", -- GARANTIR QUE ESTÁ AQUI

                cp.id AS "caregiverId",
                cp.user_id AS "caregiverUserId", -- user_id do perfil do cuidador
                cp.bio,
                cp.experience_years AS "experienceYears",
                cp.certifications,
                cp.verified AS "caregiverVerified",
                cp.created_at AS "caregiverCreatedAt",

                u.id AS "userId", -- user.id da tabela users, para o objeto user do cuidador
                u.name AS "userName",
                u.email AS "userEmail",
                u.phone AS "userPhone",
                u.tipo AS "userType", -- O tipo de usuário (caregiver, patient, etc.)
                u.created_at AS "userCreatedAt"
            FROM service_offers so
            JOIN caregiver_profiles cp ON cp.id = so.caregiver_id
            JOIN users u ON u.id = cp.user_id
            WHERE so.id = $1
                AND so.active = true`
            , [id]
        );

        const row = result.rows[0]; // Pega o primeiro (e único) resultado

        if (!row) { // Se não encontrou nenhuma linha
            return res.status(404).json({ error: 'Oferta não encontrada.' });
        }
        
        // **ESTE BLOCO MONTA O OBJETO serviceOffer PARA O FRONTEND**
        // AQUI ESTÁ A PARTE CRÍTICA QUE ANINHA 'CAREGIVER' E 'USER'
        const serviceOffer = {
            id: row.id, // ID da oferta
            title: row.title,
            description: row.description,
            hourlyRate: Number(row.hourlyRate),
            location: row.location,
            active: row.active,
            createdAt: row.createdAt,
            availableAt: row.availableAt, // availableAt está no nível correto aqui
            
            // CONSTRÓI O OBJETO 'CAREGIVER' ANINHADO COMO O FRONTEND ESPERA
            caregiver: { 
                id: row.caregiverId,
                userId: row.caregiverUserId, 
                bio: row.bio,
                experienceYears: row.experienceYears,
                certifications: row.certifications,
                verified: row.caregiverVerified,
                createdAt: row.caregiverCreatedAt,
                user: { // CONSTRÓI O OBJETO 'USER' ANINHADO DENTRO DO CAREGIVER
                    id: row.userId, 
                    name: row.userName,
                    email: row.userEmail,
                    phone: row.userPhone,
                    type: row.userType, 
                    createdAt: row.userCreatedAt,
                },
            },
        };

        return res.json(serviceOffer); // Retorna o objeto UNICO, com 'caregiver' e 'user' aninhados.
    } catch (err) {
        console.error('Erro em getOfferById:', err);
        return res.status(500).json({ error: 'Erro interno do servidor ao buscar oferta.' });
    }
}


module.exports = {
  createOffer,
  requestService,
  getAllOffers,
  getMyOffers,
  getOfferById,
};