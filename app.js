process.removeAllListeners('warning');
process.on('warning', (warning) => {
    if (warning.name === 'DeprecationWarning' && warning.message.includes('util.isArray')) {
        return; // Ignore this specific warning
    }
    console.warn(warning);
});

const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const path = require("path");
const expressSession = require("express-session");
const flash = require("connect-flash");

require("dotenv").config();

const ownersRouter = require("./routes/ownersRouter");
const productsRouter = require("./routes/productsRouter");
const usersRouter = require("./routes/usersRouter");
const indexRouter = require("./routes/index");

const db = require("./config/mongoose-connection");

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());

app.use(
    expressSession({
        resave: false,
        saveUninitialized: false,
        secret: process.env.EXPRESS_SESSION_SECRET,
    })
);
app.use(flash());

app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");

app.use("/users", usersRouter);
app.use("/", indexRouter);
app.use("/owners",ownersRouter);
app.use("/products", productsRouter);

// Global error handler
app.use((err, req, res, next) => {
    console.error('Global error handler:', err);
    req.flash('error', 'Something went wrong. Please try again.');
    
    // If the original request was for an owner route, redirect to owner login
    if (req.path.startsWith('/owners')) {
        return res.redirect('/owners/login');
    }
    
    res.redirect('/shop');
});

// 404 handler - must be last
app.use((req, res) => {
    res.status(404).render('404', { 
        loggedin: false, 
        cartCount: 0,
        error: 'Page not found' 
    });
});

app.listen(3000,()=>{
    console.log("Server started at http://localhost:3000");
    
})

module.exports = app;