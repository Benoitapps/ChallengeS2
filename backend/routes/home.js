const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/user');
const auth = require('../middleware/auth');
const authMiddleware = require('../middleware/authMiddleware');


router.get('/co',authMiddleware, userCtrl.getUser);
router.get('/',authMiddleware, userCtrl.getConnectedUser);

module.exports = router;