const express = require('express');
const router = express.Router();
const kpiCtrl = require('../controllers/kpi');
const kpiBddCtrl = require('../controllers/kpiBdd');
const auth = require('../middleware/auth');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', kpiCtrl.getKPI);
router.post('/post/:nameCard/:resperiod', kpiCtrl.kpiChoice);

router.get('/bdd/:id', kpiBddCtrl.getKpiUser);
router.get('/bddnot/:id', kpiBddCtrl.getKpiNotUser);

router.post('/addbdd/:userId/:kpiNameId', kpiBddCtrl.addKpiToUser);
router.delete('/removebdd/:userId/:kpiNameId', kpiBddCtrl.removeKpiFromUser);

router.get('/bddkpi', kpiBddCtrl.getAllKpiNames);


module.exports = router;