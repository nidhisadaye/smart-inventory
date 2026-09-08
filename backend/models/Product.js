const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: String,
  category: String,
  price: Number,
  quantity: Number,
  minStock: Number,
  maxStock: Number
});

module.exports = mongoose.model("Product", productSchema);