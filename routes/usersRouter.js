const express = require('express');
const router = express.Router();
const isLoggedIn = require("../middleware/isLoggedIn");
const { 
    registerUser, 
    loginUser,
    logoutUser, 

} =  require("../controllers/authController");

router.get("/", (req,res)=>{
    res.send("Hey");
});

router.post("/register", registerUser);

router.post("/login", loginUser);

router.get("/logout", isLoggedIn, logoutUser);

module.exports = router;