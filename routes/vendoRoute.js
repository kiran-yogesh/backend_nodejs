const vendorController = require('../controllers/vendorController');
const express = require('express');
const route = express.Router();

route.post('/register', vendorController.vendoRegister);
route.post('/login',vendorController.vendorLogin);
route.get('/all-vendors',vendorController.getVendors);
route.get('/single-vendor/:id',vendorController.getVendorbyid);
module.exports = route;