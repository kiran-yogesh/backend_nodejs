const Vendor = require('../models/Vendor');
const jwt = require('jsonwebtoken');
const bcpt = require('bcryptjs');
const dotEnv = require('dotenv');
const mongoose = require('mongoose');

dotEnv.config();
const secret = process.env.secretKey;

const vendoRegister = async (req, res) => {
   const { username, email, password } = req.body;

   try {
       if (!username || !email || !password) {
           return res.status(400).json({ error: "All fields are required" });
       }
       const existingVendor = await Vendor.findOne({ email });
       if (existingVendor) {
           return res.status(400).json({ error: "Email already exists" });
       }

       const hashedPassword = await bcpt.hash(password, 10);

       const newVendor = new Vendor({
           username,
           email,
           password: hashedPassword,
       });  
       await newVendor.save();
       res.status(201).json({ message: "Vendor registered successfully" });
       console.log('Vendor registered successfully');
   } catch (error) {
       console.error("Error during registration:", error);
       res.status(500).json({ error: "Internal server error" });
   }
};
const vendorLogin = async(req,res)=>{
    const{email,password}=req.body;
      try {
         const vendor = await Vendor.findOne({email});
         if(!vendor || !(await bcpt.compare(password,vendor.password))){
            return res.status(400).json({error:"Invalid Email or Password"});
         }
         const token = jwt.sign({vendorId: vendor._id},secret,{expiresIn:"1h"});
         const vendorId = vendor._id;
         res.status(200).json({success:"Login successful",token,vendorId});
         console.log(email,"this token",token);
         
      } catch (error) {
         res.status(400).json({message:"error"})
      }
}
const getVendors = async(req,res)=>{
   try {
      const vendors = await Vendor.find({}).populate('firm');
      res.json({vendors})
   } catch (error) {
      console.log();
      res.status(500).json({message:"internal error"})
   }       
}
const getVendorbyid = async (req, res) => {
   const vendorid = req.params.id;
   if (!mongoose.Types.ObjectId.isValid(vendorid)) {
       return res.status(400).json({ message: "Invalid vendor ID" });
   }

   try {
       const vendor = await Vendor.findById(vendorid).populate('firm');
       if (!vendor) {
           return res.status(404).json({ message: "Vendor not found" });
       }

       const vendorFirmid = vendor.firm[0]._id;
       res.status(200).json({ vendorid, vendorFirmid });
       console.log(vendorFirmid);
   } catch (error) {
       console.error("Error fetching vendor by ID:", error);
       res.status(500).json({ error: "Internal server error" });
   }
};
module.exports={vendoRegister,vendorLogin,getVendors,getVendorbyid}
