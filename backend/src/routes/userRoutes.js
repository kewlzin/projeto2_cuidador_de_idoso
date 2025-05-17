const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authenticate = require('../middlewares/authMiddleware');
const { getCurrentUser } = require('../controllers/userController');
const multer = require('multer');

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
  });
  const upload = multer({ storage });

//router.post('/register', userController.register);
router.post('/register', upload.array('documents'), userController.register);
router.post('/login', userController.login);
router.get('/me', authenticate, getCurrentUser);

module.exports = router;
