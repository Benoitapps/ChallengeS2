const express = require('express');
const router = express.Router();
const tagCtrl = require('../controllers/tag');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', authMiddleware, tagCtrl.all);
router.post('/create', authMiddleware, tagCtrl.create);
router.delete('/delete/:id', authMiddleware, tagCtrl.deleteItem);
router.put('/update/:id', authMiddleware, tagCtrl.updateName);

module.exports = router;