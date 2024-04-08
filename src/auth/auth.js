const express = require("express");
const router = express.Router();
const User = require("../../models/User");
const bcrypt = require("bcrypt");
const { genereteToken } = require("../../services/token");
const authDirect = require("../../middleware/registerDirect")

router.get("/login", authDirect, (req, res) => {
  res.render("login", {
    title: "Login",
    login: true,
    loginError: "Error",
  });
});

router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    try {
      // Find user by email
      const user = await User.findOne({ email });
  
      // If user not found
      if (!user) {
        req.flash("loginError", "Invalid credentials");
        return res.redirect("/login");
      }
  
      // Compare hashed password with input password
      const passwordMatch = await bcrypt.compare(password, user.password);
  
      if (!passwordMatch) {
        req.flash("loginError", "Invalid credentials");
        return res.redirect("/login");
      }
  
      // Passwords match, user is authenticated
      const token = genereteToken(user._id);
      res.cookie("token", token, { httpOnly: true, secure: true });
      res.redirect("/");
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
router.get("/logout", (req, res) => {
  res.clearCookie("token");
  res.redirect("/");
});

router.get("/register", authDirect, (req, res) => {
  res.render("register", {
    title: "Register",
    register: true,
    registerError: "Error",
  });
});

router.post("/register", async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const userData = {
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      email: req.body.email,
      password: hashedPassword,
    };
    const user = await User.create(userData);
    const token = genereteToken(user._id);
    res.cookie("token", token, { httpOnly: true, secure: true });
    console.log(token);
    res.redirect("/");
  } catch (error) {
    console.error("Register error:", error);
    res.redirect("/register");
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
