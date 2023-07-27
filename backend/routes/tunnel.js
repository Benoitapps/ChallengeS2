const express = require('express');
const router = express.Router();
const tunnelCtrl = require('../controllers/tunnel');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', authMiddleware, tunnelCtrl.all);
router.post('/create', authMiddleware, tunnelCtrl.create);
router.delete('/delete/:id', authMiddleware, tunnelCtrl.deleteItem);
router.post('/stats/:id', authMiddleware, tunnelCtrl.getStats);
router.put('/update/:id', authMiddleware, tunnelCtrl.updateName);

module.exports = router;