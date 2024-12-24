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
        const { productname, price, category, bestseller, description} = req.body;
        const image = req.file ? req.file.filename : undefined;

        const firmId = req.params.firmId;
        const firm = await Firm.findById(firmId);
        if (!firm) {
            return res.status(404).json({ message: "Firm not found" });
        }
        const products = new Product({
            productname,
            price,
            category,
            image,
            bestseller,
            description,
            firm: firm._id
        });

        const savedProduct = await products.save();
        firm.products.push(savedProduct);
        await firm.save();

        return res.status(200).json({ message: "Product added successfully", product: savedProduct });

    } catch (error) {
        console.error("Error adding product:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

const getProductbyFirm = async(req, res)=>{
    try {
        const firmId = req.params.firmId;
        const firm = await Firm.findById(firmId);
        if (!firm) {
            return res.status(404).json({ message: "Firm not found" });
        }
        const restaurentName = firm.firmname;
        const products = await Product.find({firm: firmId});
        res.status(200).json({restaurentName, products});
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal server error" });
    }
}
const deletebyProduct = async(req,res)=>{
    try {
        const productId = req.params.productId;
        const deletedProduct = await Product.findByIdAndDelete(productId);
        if(!deletedProduct){
            return res.status(404).json({error:'no product found'});
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal server error" });
    }
}

module.exports ={ addproduct:[upload.single('image'),addproduct], getProductbyFirm ,deletebyProduct};