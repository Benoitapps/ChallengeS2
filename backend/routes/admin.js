const express = require('express');
const router = express.Router();
const adminCtrl = require('../controllers/admin');
const auth = require('../middleware/auth');
const adminMiddleware = require('../middleware/adminMiddleware');
const authMiddleware = require('../middleware/authMiddleware');


router.get('/notverified', adminMiddleware, adminCtrl.getUserNotVerified);
router.put('/verified/:id',adminMiddleware, adminCtrl.UserVerified);

router.get('/alluser', adminCtrl.getAllUser);
router.put('/taketoken/:userId/:tokenid', adminCtrl.updateToken);

router.get('/token/:userId', adminCtrl.getTokenUserbyId);

module.exports = router;