const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },
        category: {
            type: String,
            required: true,
            trim: true
        },
        price: {
            type: Number,
            required: true,
            min: 0
        },
        quantity: {
            type: Number,
            required: true,
            min: 0,
            default: 0
        },
        minStock: {
            type: Number,
            required: true,
            min: 0,
            default: 5
        },
        maxStock: {
            type: Number,
            required: true,
            min: 0,
            default: 100
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Product", productSchema);