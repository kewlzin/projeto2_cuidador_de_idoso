const express = require('express');
const router = express.Router();
const serviceController = require('../controllers/serviceController');
const authenticate = require('../middlewares/authMiddleware');

router.post('/offer', authenticate, serviceController.createOffer);
router.post('/request', authenticate, serviceController.requestService);