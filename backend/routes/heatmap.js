const express = require('express');
const router = express.Router();
const HeatmapCtrl = require('../controllers/heatmap');
const auth = require('../middleware/auth');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', HeatmapCtrl.getHeatmapClic);

router.get('/mouse', HeatmapCtrl.getHeatmapMouse);

router.post('/upload', HeatmapCtrl.uploadImage);


module.exports = router;