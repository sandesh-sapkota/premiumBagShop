const jwt = require('jsonwebtoken');
const ownermodel = require('../models/ownermodel');

module.exports = async (req,res, next) => {
    console.log("isOwnerLoggedIn middleware - checking token");
    console.log("Cookies:", req.cookies);
    
    if(!req.cookies.token){
        console.log("No token found");
        req.flash("error", "You need to login first");
        return res.redirect("/owners/login");
    }
    try{
        let decoded = jwt.verify(req.cookies.token, process.env.JWT_KEY);
        console.log("Token decoded:", decoded);
        
        let owner = await ownermodel
            .findOne({email: decoded.email})
            .select("-password");

        console.log("Owner found:", owner);
        
        if (!owner) {
            req.flash("error", "Owner not found");
            return res.redirect("/owners/login");
        }

        req.owner = owner;
        console.log("Owner authenticated, proceeding to next middleware");
        next();
    }
    catch(err){
        console.log("Middleware error:", err);
        req.flash("error", "something went wrong");
        res.redirect("/owners/login");
    }
};