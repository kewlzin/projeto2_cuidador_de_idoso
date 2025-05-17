const Service = require('../models/ServiceOffer');
const Request = require('../models/ServiceRequest');

async function createOffer(req, res) {
  const offer = await Service.createServiceOffer(req.user.id, req.body);
  res.status(201).json(offer);
}

async function requestService(req, res) {
  const { service_id } = req.body;
  const request = await Request.createServiceRequest(service_id, req.user.id);
  res.status(201).json(request);
}

module.exports = { createOffer, requestService };
