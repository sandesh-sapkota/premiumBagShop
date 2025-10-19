const express = require('express');
const router = express.Router();
const ownerModel = require("../models/ownermodel");
const upload = require("../config/multer-config"); 
const productModel = require("../models/productmodel");
const { loginOwner, registerOwner } = require("../controllers/authController");
const isOwnerLoggedIn = require("../middleware/isOwnerLoggedIn");

if(process.env.NODE_ENV === "development"){
    router.post("/create", async(req,res)=>{
    let owners =  await ownerModel.find() ;
        if(owners.length >0){
        return res
            .status(504)
            .send("You don't have permission to create a new owner.");  
        }
        let {fullname, email, password} = req.body;
        let createdOwner = await ownerModel.create({
        fullname,
        email,
        password,
        });

        res.status(201).send(createdOwner);
    });
}

// Owner Login Routes
router.get("/login", (req, res) => {
    let error = req.flash("error");
    res.render("owner-login", { error });
});

router.post("/login", loginOwner);

// Owner Signup Routes
router.get("/signup", (req, res) => {
    let error = req.flash("error");
    res.render("owner-signup", { error });
});

router.post("/signup", registerOwner);

router.get("/admin", isOwnerLoggedIn, async (req,res)=>{
    try {
        let success = req.flash("success");
        let products = await productModel.find();
        
        // Calculate statistics
        const totalProducts = products.length;
        const totalOrders = 0; // Will be calculated from orders collection
        const totalRevenue = 0; // Will be calculated from orders
        const totalCustomers = 0; // Will be calculated from users
        
        res.render("admin-dashboard", { 
            success,
            products,
            totalProducts,
            totalOrders,
            totalRevenue,
            totalCustomers
        });
    } catch(error) {
        console.error(error);
        res.status(500).send("Error loading admin dashboard");
    }
});

router.get('/product/create', isOwnerLoggedIn, (req, res)=> {
    let success = req.flash("success");
    let error = req.flash("error");
    res.render('createproducts', { success, error });
});

router.post('/product/create', isOwnerLoggedIn, upload.single("image"), async (req, res)=>{
    try {
        let { name, price, discount, category, quantity, description, bgcolor, panelcolor, textcolor } = req.body;
        
        if (!req.file) {
            req.flash("error", "Please upload a product image");
            return res.redirect("/owners/admin");
        }

        let product = await productModel.create({
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

        req.flash("success", `Product "${name}" created successfully!`);
        res.redirect("/owners/admin");
    } catch (error) {
        console.error(error);
        req.flash("error", "Error creating product: " + error.message);
        res.redirect("/owners/admin");
    }
});

// Delete product
router.delete('/product/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await productModel.findByIdAndDelete(id);
        req.flash("success", "Product deleted successfully");
        res.json({ success: true, message: "Product deleted" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
});

// Edit product
router.get('/product/edit/:id', async (req, res) => {
    try {
        const product = await productModel.findById(req.params.id);
        res.json(product);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});

// Update product
router.put('/product/:id', async (req, res) => {
    try {
        const { id } = req.params;
        let { name, price, discount, bgcolor, panelcolor, textcolor } = req.body;
        
        const updateData = {
            name,
            price: parseFloat(price),
            discount: parseFloat(discount),
        };

        // Only update colors if provided
        if (bgcolor) updateData.bgcolor = bgcolor;
        if (panelcolor) updateData.panelcolor = panelcolor;
        if (textcolor) updateData.textcolor = textcolor;

        const updatedProduct = await productModel.findByIdAndUpdate(id, updateData, { new: true });
        
        res.json({ 
            success: true, 
            message: `Product "${name}" updated successfully!`,
            product: updatedProduct
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;