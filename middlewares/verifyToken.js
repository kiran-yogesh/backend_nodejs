const Vendor = require('../models/Vendor');
const jwt = require('jsonwebtoken');
const dotEnv = require('dotenv');

const secret = process.env.secretKey;
dotEnv.config();

const verifyToken = async(req,res,next)=>{
    const token = req.headers.token;
    if(!token){
        return res.status(401).json({message:"token is required"});
    }
    try {
        const decoder = jwt.verify(token,secret);
        const vendor = await Vendor.findById(decoder.vendorId);
        if(!vendor){
            return res.status(404).json({error:"vendor not found"});
        }
        req.vendorId = vendor._id;
        next();
    } catch (error) {
        console.log(error);
        return res.status(401).json({error:"Invalid token"});
    } 
} 
module.exports = verifyToken;