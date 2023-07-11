const express = require('express');
const router = express.Router();
const kpiCtrl = require('../controllers/kpi');
const auth = require('../middleware/auth');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', kpiCtrl.someOtherFunction);

module.exports = router;