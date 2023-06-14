const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/user');

router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);

// Test route exemple
router.get('/test', (req, res) => res.status(200).json({ message: 'Test' }));

module.exports = router;