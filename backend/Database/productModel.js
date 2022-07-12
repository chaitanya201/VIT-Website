const mongoose = require("mongoose");
const productSchema = new mongoose.Schema({
  image: String,
  name: String,
  quantity: Number,
  cost: Number,
  condition: String,
  date: String,
});

const Product = new mongoose.model("Product", productSchema);
module.exports = Product;
