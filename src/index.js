const express = require("express");
const app = express();
const path = require("path");
const { create } = require("express-handlebars");

const varmiddleware = require("../middleware/varmiddleware")
const userMiddleware = require("../middleware/userMiddleware");

const cookieParser = require('cookie-parser')
// routes
const pagesRoutes = require("./pages/pages");
const authRoutes = require("./auth/auth");
// configs
const mongoose = require("mongoose");
require("dotenv").config();
const flash = require("connect-flash");
const session = require("express-session");
//helpers
const userHelper = require("../utils/index");

const hbs = create({ defaultLayout: "main", extname: ".hbs", helpers: userHelper });

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(express.json());
app.use(varmiddleware)
app.use(userMiddleware)
app.use(cookieParser());
app.engine("hbs", hbs.engine);
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "views"));

app.use(pagesRoutes);
app.use(authRoutes);

// Use session middleware
app.use(
  session({
    secret: "your_secret_key",
    resave: false,
    saveUninitialized: false,
  })
);
// Use flash middleware
app.use(flash());

mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });

const PORT = process.env.PORT || 4545;

app.listen(PORT, () => {
  console.log(`listening on ${PORT}`);
});
