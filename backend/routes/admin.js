const express = require('express');
const router = express.Router();
const adminCtrl = require('../controllers/admin');
const auth = require('../middleware/auth');


router.get('/notverified', adminCtrl.getUserNotVerified);
router.put('/verified/:id', adminCtrl.UserVerified);

module.exports = router;