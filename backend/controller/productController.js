const Product = require("../models/Product");
const cloudinary = require("../config/cloudinary");

// Get all products
const getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const createProduct = async (req, res) => {
  try {
    const { name, description, price, category, stock } = req.body;
    const image = req.file
      ? await cloudinary.uploader.upload(req.file.path)
      : null;
    const newProduct = new Product({
      name,
      description,
      price,
      category,
      stock,
      imageUrl: image ? image.secure_url : null,
    });
    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { getProducts, getProductById, createProduct };
