const express = require("express");
const requireAuth = require("../middlewares/requireAuth");
const validate = require("../middlewares/validate");
const {
  registerValidator,
  loginValidator,
} = require("../validators/user.validation");
const {
  registerUser,
  loginUser,
  logoutUser,
} = require("../controllers/user.controler");

const router = express.Router();

// User registration
router.post(
  "/sign-up",
  validate(registerValidator),
  registerUser
);

// User login
router.post(
  "/login",
  validate(loginValidator),
  loginUser
);

// User logout
router.post("/logout", requireAuth, logoutUser);

module.exports = router;