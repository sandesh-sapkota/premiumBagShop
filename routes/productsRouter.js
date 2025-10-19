const express = require('express');
const router = express.Router();
const upload = require("../config/multer-config");
const productmodel = require('../models/productmodel');
const isOwnerLoggedIn = require("../middleware/isOwnerLoggedIn");

router.post("/create", upload.single("image"), async(req,res)=>{
    try{
        let { name, price, discount, category, quantity, description, bgcolor, panelcolor, textcolor } = req.body;
    
    let product = await productmodel.create({
        image: req.file.buffer,
        name,
        price: parseFloat(price),
        discount: parseFloat(discount) || 0,
        category: category || 'general',
        quantity: parseInt(quantity) || 0,
        description: description || '',
        bgcolor,
        panelcolor,
        textcolor,
    });
    req.flash("success", "Products created successfully");
    res.redirect("/owners/admin");

    }catch(err){
        res.send(err.message);
    }
});

// Edit product route
router.post("/edit/:id", isOwnerLoggedIn, upload.single("image"), async (req, res) => {
    try {
        const { id } = req.params;
        let { name, price, discount, category, quantity, description } = req.body;
        
        const updateData = {
            name,
            price: parseFloat(price),
            discount: parseFloat(discount) || 0,
            category,
            quantity: parseInt(quantity),
            description
        };

        // If new image is uploaded, update it
        if (req.file) {
            updateData.image = req.file.buffer;
        }

        const updatedProduct = await productmodel.findByIdAndUpdate(id, updateData, { new: true });
        
        if (!updatedProduct) {
            return res.status(404).json({ 
                success: false, 
                message: "Product not found" 
            });
        }

        res.json({ 
            success: true, 
            message: `Product "${name}" updated successfully!`,
            product: updatedProduct
        });
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
});

// Delete product route
router.post("/delete/:id", isOwnerLoggedIn, async (req, res) => {
    try {
        const { id } = req.params;
        const deletedProduct = await productmodel.findByIdAndDelete(id);
        
        if (!deletedProduct) {
            return res.status(404).json({ 
                success: false, 
                message: "Product not found" 
            });
        }

        res.json({ 
            success: true, 
            message: "Product deleted successfully"
        });
    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
});

module.exports = router;