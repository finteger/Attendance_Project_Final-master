const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Authentication routes
router.get('/login', (req, res) => res.render('login'));
router.post('/login', authController.login);
router.post('/logout', authController.logout);
router.get('/register', (req, res) => res.render('register'));
router.post('/register', authController.register);

module.exports = router;
