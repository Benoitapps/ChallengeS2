const express = require('express');
const router = express.Router();
const chartsCtrl = require('../controllers/charts');
const chartsBddCtrl = require('../controllers/chartsBdd');
const auth = require('../middleware/auth');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/',authMiddleware, chartsCtrl.getCharts);
router.post('/post/:nameCard/:resperiod',authMiddleware, chartsCtrl.getCharts);

router.get('/bdd/:id',authMiddleware, chartsBddCtrl.getChartsUser);
router.get('/bddnot/:id',authMiddleware, chartsBddCtrl.getChartsNotUser);

router.post('/addbdd/:userId/:chartsNameId',authMiddleware, chartsBddCtrl.addChartsToUser);
router.delete('/removebdd/:userId/:chartsNameId',authMiddleware, chartsBddCtrl.removeChartsFromUser);

router.get('/bddcharts',authMiddleware, chartsBddCtrl.getAllChartsNames);


module.exports = router;