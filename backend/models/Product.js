import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    default: "https://via.placeholder.com/150", // Default image if not provided
  },
}, {
  timestamps: true, // adds createdAt and updatedAt automatically
});

const Product = mongoose.model("Product", productSchema);

export default Product;
