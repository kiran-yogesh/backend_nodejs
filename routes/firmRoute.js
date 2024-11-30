const express = require('express');
const verifyToken = require('../middlewares/verifyToken');
const firmController = require('../controllers/firmController');

const router = express.Router();
router.post('/addfirm',verifyToken, firmController.addFirm);
router.get('/uploads/:imageName',(req,res)=>{
     const imageName = req.params.imageName;
     res.headersSent('Content-type','image/jpeg');
     res.sendFile(path.join(__dirname,'..','uploads',imageName));
});
router.delete('/:firmId', firmController.deletebyFirm);
module.exports = router;