const express = require('express');
const router = express.Router();
const serviceController = require('../controllers/serviceController');
const authenticate = require('../middlewares/authMiddleware');

router.post('/offer', authenticate, serviceController.createOffer);
router.get('/offers', authenticate, serviceController.getAllOffers);
router.get('/offers/:id', authenticate, serviceController.getOfferById);
router.post('/request', authenticate, serviceController.requestService);

module.exports = router;