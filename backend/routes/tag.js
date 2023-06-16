const express = require('express');
const router = express.Router();
const tagCtrl = require('../controllers/tag');

router.post('/', tagCtrl.save);

module.exports = router;