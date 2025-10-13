const express = require('express');
const router = express.Router();
const isLoggedIn = require("../middleware/isLoggedIn");
const { 
    registerUser, 
    loginUser,
    logout, 

} =  require("../controllers/authController");

router.get("/", (req,res)=>{
    res.send("Hey");
});

router.post("/register", registerUser);

router.post("/login", loginUser);

router.get("/logout", isLoggedIn, logout);

module.exports = router;