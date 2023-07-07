const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/user');
const auth = require('../middleware/auth');

router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);
router.post('/logout', userCtrl.logout);

// Test route exemple
router.get('/test', (req, res) => res.status(200).json({ message: 'Test' }));

module.exports = router;