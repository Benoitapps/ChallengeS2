const express = require('express');
const router = express.Router();
const tagCtrl = require('../controllers/tag');

router.get('/', tagCtrl.all);
router.post('/create', tagCtrl.create);
router.delete('/delete/:id', tagCtrl.deleteItem);

module.exports = router;