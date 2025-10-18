    const usermodel = require('../models/usermodel');

// Utility function to clean up invalid cart items
const cleanupCart = async (user) => {
    if (!user || !user.cart) return user;
    
    const originalLength = user.cart.length;
    user.cart = user.cart.filter(item => 
        item && item.product && item.product.toString && item.product.toString()
    );
    
    if (user.cart.length < originalLength) {
        await user.save();
        console.log(`Cleaned up ${originalLength - user.cart.length} invalid cart items`);
    }
    
    return user;
};

// Get cart count safely
const getCartCount = (user) => {
    return user && user.cart ? user.cart.length : 0;
};

// Calculate cart total value
const calculateCartTotal = (cart) => {
    return cart.reduce((total, item) => {
        if (item.product && typeof item.product === 'object') {
            const price = (item.product.price || 0) - (item.product.discount || 0);
            return total + (price * (item.quantity || 1));
        }
        return total;
    }, 0);
};

// Find cart item by product ID
const findCartItem = (cart, productId) => {
    return cart.find(item => 
        item.product && 
        item.product.toString && 
        item.product.toString() === productId
    );
};

module.exports = {
    cleanupCart,
    getCartCount,
    calculateCartTotal,
    findCartItem
};