const mongoose = require("mongoose");
const { v4 } = require("uuid");

const ProductSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    default: v4(),
  },
  name: {
    type: String,
  },
  price: {
    type: Number,
  },
  description: {
    type: String,
  },
  pic: {
    type: String,
  },
  category_id: {
    type: String,
    required: true,
  },
});

const products = mongoose.model("products", ProductSchema);
module.exports = products;
