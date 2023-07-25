const express = require('express');
const router = express.Router();
const userTokenCtrl = require('../controllers/usertoken');
const auth = require('../middleware/auth');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/',authMiddleware, userTokenCtrl.updateToken);

module.exports = router;