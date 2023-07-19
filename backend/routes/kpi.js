const express = require('express');
const router = express.Router();
const kpiCtrl = require('../controllers/kpi');
const kpiBddCtrl = require('../controllers/kpiBdd');
const auth = require('../middleware/auth');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/',authMiddleware, kpiCtrl.getKPI);
router.post('/post/:nameCard/:resperiod',authMiddleware, kpiCtrl.kpiChoice);

router.get('/bdd/:id',authMiddleware, kpiBddCtrl.getKpiUser);
router.get('/bddnot/:id',authMiddleware, kpiBddCtrl.getKpiNotUser);

router.post('/addbdd/:userId/:kpiNameId',authMiddleware, kpiBddCtrl.addKpiToUser);
router.delete('/removebdd/:userId/:kpiNameId',authMiddleware, kpiBddCtrl.removeKpiFromUser);

router.get('/bddkpi',authMiddleware, kpiBddCtrl.getAllKpiNames);


module.exports = router;