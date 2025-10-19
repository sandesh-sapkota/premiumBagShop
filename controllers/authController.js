const usermodel = require('../models/usermodel');
const ownermodel = require('../models/ownermodel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const { generateToken } = require('../utils/generateToken');

module.exports.registerUser = async (req,res) =>{
     try{
        let {fullname, email, password} = req.body;

        let user = await usermodel.findOne({ email });
        if (user) {
            req.flash("error", "You already have an account, please login.");
            return res.redirect("/");
        }

        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(password, salt, async(err, hash) => {
                if(err){
                    req.flash("error", err.message);
                    return res.redirect("/");
                }else{
                    let createdUser = await usermodel.create({
                        fullname,
                        email,
                        password: hash,
                    });                    
                    let token = generateToken(createdUser);
                    res.cookie("token", token);
                    req.flash("success", `Welcome to BOHO, ${fullname}! Your account has been created successfully.`);
                    res.redirect("/shop");
                }
            });
        });   
    }catch(err){
        req.flash("error", err.message);
        res.redirect("/");
    }
};

module.exports.loginUser = async (req, res) =>{
    try{
        let { email, password } = req.body;
    let user = await usermodel.findOne({ email });
    if(!user){
        req.flash("error", "Email or Password incorrect");
        return res.redirect("/");
    }
        
    bcrypt.compare(password, user.password, (err, result) => {
        if(result){
            let token = generateToken(user);
            res.cookie("token", token);
            req.flash("success", `Welcome back, ${user.fullname}!`);
            res.redirect("/shop");
        }else{
            req.flash("error", "Email or Password incorrect");
            return res.redirect("/");
        }
    });
    
    }catch(err){
    req.flash("error", err.message);
    res.redirect("/");
    }
};

module.exports.loginOwner = async (req, res) => {
    try{
        let { email, password } = req.body;
        console.log("Owner login attempt with email:", email);
        
        let owner = await ownermodel.findOne({ email });
        if(!owner){
            console.log("Owner not found");
            req.flash("error", "Email or password incorrect");
            return res.redirect("/owners/login");
        }
        
        bcrypt.compare(password, owner.password, (err, result) => {
            if(err){
                console.log("Bcrypt error:", err);
                req.flash("error", "Something went wrong");
                return res.redirect("/owners/login");
            }
            
            if(!result){
                console.log("Password incorrect");
                req.flash("error", "Email or password incorrect");
                return res.redirect("/owners/login");
            }else{
                console.log("Owner login successful, redirecting to /owners/admin");
                let token = generateToken(owner);
                res.cookie("token", token);
                req.flash("success", `Welcome back, ${owner.fullname}!`);
                return res.redirect("/owners/admin");
            }
        });

    }catch(err){
        console.log("LoginOwner catch error:", err);
        req.flash("error", "Something went wrong: " + err.message);
        return res.redirect("/owners/login");
    }
}

module.exports.logoutUser = (req, res) => {
    try{
        req.flash("success", "You have been logged out successfully!");
        req.session.destroy(() => {
            res.clearCookie("token");
            return res.redirect("/");
        })
    }catch(err){
        req.flash("success", "");
        req.flash("error", "Logout Failed");
    }
};

module.exports.registerOwner = async (req, res) => {
    try {
        let { fullname, email, password, confirm_password } = req.body;

        // Validate passwords match
        if (password !== confirm_password) {
            req.flash("error", "Passwords do not match");
            return res.redirect("/owners/signup");
        }

        // Check if owner already exists
        let owner = await ownermodel.findOne({ email });
        if (owner) {
            req.flash("error", "Email already registered. Please login instead.");
            return res.redirect("/owners/login");
        }

        // Hash password and create owner
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(password, salt, async (err, hash) => {
                if (err) {
                    req.flash("error", err.message);
                    return res.redirect("/owners/signup");
                } else {
                    let createdOwner = await ownermodel.create({
                        fullname,
                        email,
                        password: hash,
                    });

                    let token = generateToken(createdOwner);
                    res.cookie("token", token);
                    req.flash("success", `Welcome, ${fullname}! Your admin account has been created successfully.`);
                    res.redirect("/owners/admin");
                }
            });
        });
    } catch (err) {
        req.flash("error", err.message);
        res.redirect("/owners/signup");
    }
};
    

    
