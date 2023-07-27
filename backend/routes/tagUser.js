const express = require('express');
const router = express.Router();
const kpiCtrl = require('../controllers/tagUser');
const kpiBddCtrl = require('../controllers/tagUserBdd');
const auth = require('../middleware/auth');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/',authMiddleware, kpiCtrl.getTag);
router.post('/post/:nameCard/:resperiod',authMiddleware, kpiCtrl.tagChoice);

router.get('/bdd/:id',authMiddleware, kpiBddCtrl.getTagUser);//

router.get('/bddnot/:id',authMiddleware, kpiBddCtrl.getTagNotUser);//

router.post('/addbdd/:userId/:tagNameId',authMiddleware, kpiBddCtrl.addTagToUser);//
router.delete('/removebdd/:userId/:tagNameId',authMiddleware, kpiBddCtrl.removeTagFromUser);

router.get('/bddtag',authMiddleware, kpiBddCtrl.getAllTag);//


module.exports = router;