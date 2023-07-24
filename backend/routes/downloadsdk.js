const express = require('express');
const router = express.Router();
const sdkCtrl = require('../controllers/downloadsdk');
const auth = require('../middleware/auth');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/',authMiddleware, sdkCtrl.getSDK);

module.exports = router;