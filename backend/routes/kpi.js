const express = require('express');
const router = express.Router();
const kpiCtrl = require('../controllers/kpi');
const auth = require('../middleware/auth');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', kpiCtrl.getKPI);
router.post('/post/:nameCard/:resperiod', kpiCtrl.kpiChoice);

module.exports = router;