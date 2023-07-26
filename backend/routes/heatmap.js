const express = require('express');
const router = express.Router();
const HeatmapCtrl = require('../controllers/heatmap');
const auth = require('../middleware/auth');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', HeatmapCtrl.getHeatmapClic);

router.post('/mouse', HeatmapCtrl.getHeatmapMouse);

router.post('/upload', HeatmapCtrl.uploadImage);
router.post('/upload/get', HeatmapCtrl.getImageSrc);
router.post('/upload/getOne', HeatmapCtrl.getOneImageSrc);

module.exports = router;