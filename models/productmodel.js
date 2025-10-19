const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    name: String,
    image: Buffer,
    price: Number,
    discount: {
        type: Number,
        default: 0
    },
    category: {
        type: String,
        default: 'general'
    },
    quantity: {
        type: Number,
        default: 0
    },
    description: {
        type: String,
        default: ''
    },
    bg_color: String,
    panelcolor: String,
    textcolor: String,
}, {
    timestamps: true
});

module.exports = mongoose.model("product", productSchema);