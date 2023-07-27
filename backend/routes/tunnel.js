const express = require('express');
const router = express.Router();
const tunnelCtrl = require('../controllers/tunnel');

router.get('/', tunnelCtrl.all);
router.post('/create', tunnelCtrl.create);
router.delete('/delete/:id', tunnelCtrl.deleteItem);
router.post('/stats/:id', tunnelCtrl.getStats);

module.exports = router;