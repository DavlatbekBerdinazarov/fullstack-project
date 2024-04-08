const express = require("express");
const Product = require("../../models/Product");
const router = express.Router();
const loginRedirect = require("../../middleware/addAuth");
const userMiddleware = require("../../middleware/userMiddleware");

router.get("/", async (req, res) => {
  const products = await Product.find().lean();
  res.render("index", {
    title: "Home",
    products: products.reverse(),
    userId: req.userId ? req.userId.toString() : null
  });
});

router.get("/products", async (req, res) => {
  const user = req.userId ? req.userId.toString() : null
  const myProducts = await Product.find({ user }).populate('user').lean();
  console.log(myProducts);
  res.render("products", {
    title: "Products",
    product: true,
    products: myProducts.reverse(),
    userId: req.userId ? req.userId.toString() : "Auth",
  });
});

router.get("/product/:id", async (req, res) => {
  try {
    const id = req.params.id;
    
    // Find the product by ID and populate the 'user' field
    const product = await Product.findById(id).populate('user').lean();

    // If the product doesn't exist, handle it appropriately
    if (!product) {
      return res.status(404).render("error", { message: "Product not found" });
    }

    // Render the product detail page with the selected product
    res.render("product", {
      product: product,
    });
  } catch (error) {
    // Handle any errors that occur during the query
    console.error("Error fetching product:", error);
    res.status(500).render("error", { message: "Internal server error" });
  }
});


router.get("/addproduct", loginRedirect, (req, res) => {
  res.render("addproduct", {
    title: "Add product",
    add: true,
  });
});

router.post("/addproduct", userMiddleware, async (req, res) => {
  console.log(req.body);
  try {
    // Extract form data from request body
    const { title, description, price, imageUrl } = req.body;

    // Check if all required fields are provided
    if (!title || !description || !price || !imageUrl) {
      return res.status(400).json({ message: "All fields are required" });
    }

    console.log(req.userId);

    // Create a new product instance using the Product model
    const product = await Product({ ...req.body, user: req.userId });

    // Save the product to the database
    await product.save();

    // Redirect to a success page or send a success response
    res.status(201).json({ message: "Product added successfully", product });
  } catch (error) {
    console.error("Error adding product:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
