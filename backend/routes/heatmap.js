const express = require('express');
const router = express.Router();
const HeatmapCtrl = require('../controllers/heatmap');
const auth = require('../middleware/auth');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/',authMiddleware, HeatmapCtrl.getHeatmapClic);

router.post('/mouse',authMiddleware, HeatmapCtrl.getHeatmapMouse);

router.post('/upload',authMiddleware, HeatmapCtrl.uploadImage);
router.post('/upload/get',authMiddleware, HeatmapCtrl.getImageSrc);
router.post('/upload/getOne',authMiddleware, HeatmapCtrl.getOneImageSrc);

module.exports = router;