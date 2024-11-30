const productController = require('../controllers/productController');
const ProductController = require('../controllers/productController');
const express = require('express');
const route = express.Router();

route.post('/add-products/:firmId',ProductController.addproduct);
route.get('/:firmId/products',ProductController.getProductbyFirm);
route.get('/uploads/:imageName',(req,res)=>{
    const imageName = req.params.imageName;
    res.headersSent('Content-type','image/jpeg');
    res.sendFile(path.join(__dirname,'..','uploads',imageName));
});
route.delete('/:productId',productController.deletebyProduct);
module.exports=route;