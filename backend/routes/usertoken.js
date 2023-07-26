const express = require('express');
const router = express.Router();
const userTokenCtrl = require('../controllers/usertoken');
const auth = require('../middleware/auth');
const authMiddleware = require('../middleware/authMiddleware');

router.patch('/:id',authMiddleware, userTokenCtrl.updateToken);

module.exports = router;