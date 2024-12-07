const Firm = require('../models/Firm');
const Vendor = require('../models/Vendor');
const multer = require('multer');
const express = require('express');
const path = require('path');

const app = express();

// Set up storage configuration for multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Directory to save uploaded images
    },
    filename: (req, file, cb) => {
        cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`); // Rename the file
    }
});
const upload = multer({ storage });

// Function to add a new firm
const addFirm = async (req, res) => {
   try {
       const { firmname, area, category, region, offer } = req.body;
       const image = req.file ? req.file.filename : undefined;

       // Fetch the vendor by ID
       const vendor = await Vendor.findById(req.vendorId);

       // Check if vendor exists
       if (!vendor) {
           return res.status(404).json({ message: "Vendor not found" });
       }

       // Create a new firm document
       const firm = new Firm({
           firmname,
           area,
           category,
           region,
           offer,
           image,
           vendor: vendor._id
       });

       // Save the firm document
       const savedFirm =await firm.save();
       vendor.firm.push(savedFirm);
       await vendor.save();

       return res.status(200).json({ message: "Firm added successfully" });
   } catch (error) {
       console.error("Error adding firm:", error);
       return res.status(500).json({ error: "Internal server error" });
   }
}
const deletebyFirm = async(req,res)=>{
    try {
        const firmId = req.params.firmId;
        const deletedFirm = await Firm.findByIdAndDelete(firmId);
        if(!deletedFirm){
            return res.status(404).json({error:'no firm found'});
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal server error" });
    }
}

// Export the addFirm function with the upload middleware applied
module.exports = {
   addFirm: [upload.single('image'), addFirm,deletebyFirm]
};
