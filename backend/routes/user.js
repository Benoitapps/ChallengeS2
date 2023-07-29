const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/user');
const auth = require('../middleware/auth');
const authMiddleware = require('../middleware/authMiddleware');


router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);
router.post('/logout', userCtrl.logout);

router.get('/test', (req, res) => res.status(200).json({ message: 'Test' }));


module.exports = router;