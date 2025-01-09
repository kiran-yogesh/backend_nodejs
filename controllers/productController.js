const Product = require('../models/Product');
const multer = require('multer');
const Firm = require('../models/Firm');
const path = require('path');


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Directory to save uploaded images
    },
    filename: (req, file, cb) => {
        cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`); // Rename the file
    }
});
const upload = multer({ storage });


const addproduct = async (req, res) => {
    try {
        const { productname, price, category, bestseller, description } = req.body;
        const image = req.file ? req.file.filename : undefined;

        const firmId = req.params.firmId; // Get firmId from request params
        if (!firmId) {
            return res.status(400).json({ error: "Firm ID is required" });
        }

        
        if (!firmId.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({ error: "Invalid Firm ID" });
        }

        const firm = await Firm.findById(firmId);
        if (!firm) {
            return res.status(404).json({ error: "Firm not found" });
        }

        const newProduct = new Product({
            productname,
            price,
            category,
            image,
            bestseller,
            description,
            firm: firm._id
        });

        const savedProduct = await newProduct.save();

        firm.products.push(savedProduct);
        await firm.save();

        return res.status(200).json({
            message: "Product added successfully",
            product: savedProduct,
        });
    } catch (error) {
        console.error("Error adding product:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};


const getProductbyFirm = async (req, res) => {
    try {
        const firmId = req.params.firmIds;

        
        if (!firmId) {
            return res.status(400).json({ error: "Firm ID is required" });
        }

        
        if (!firmId.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({ error: "Invalid Firm ID" });
        }

        const firm = await Firm.findById(firmId);
        if (!firm) {
            return res.status(404).json({ error: "Firm not found" });
        }

        const products = await Product.find({ firm: firmId });

        return res.status(200).json({
            restaurentName: firm.firmname,
            products,
        });
    } catch (error) {
        console.error("Error fetching products:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};


const deletebyProduct = async (req, res) => {
    try {
        const productId = req.params.productId;

        if (!productId) {
            return res.status(400).json({ error: "Product ID is required" });
        }

     
        if (!productId.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({ error: "Invalid Product ID" });
        }

        const deletedProduct = await Product.findByIdAndDelete(productId);
        if (!deletedProduct) {
            return res.status(404).json({ error: "No product found" });
        }

        return res.status(200).json({ message: "Product deleted successfully" });
    } catch (error) {
        console.error("Error deleting product:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

// Export modules
module.exports = {
    addproduct: [upload.single('image'), addproduct],
    getProductbyFirm,
    deletebyProduct,
};
