require("dotenv").config();
const redisClient = require("../config/redis");
const userModel = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { hashPassowrd } = require("../utility/bcrypt");

// REGISTER USER
const registerUser = async (req, res, next) => {
  try {
    const { email, password, name } = req.body;

    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hash = await hashPassowrd(password);

    const user = new userModel({
      email,
      password: hash,
      name,
    });

    await user.save();

    return res.status(201).json({
      message: "User is registered successfully",
    });
  } catch (error) {
    next(error);
  }
};

// LOGIN USER
const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User does not exist" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { userId: user.id, username: user.name },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.status(200).json({
      message: "logged in",
      user: {
        _id: user.id,
        email: user.email,
        name: user.name,
      },
      token,
    });
  } catch (error) {
    next(error);
  }
};

// LOGOUT USER
const logoutUser = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];

    await redisClient.setEx(token, 7 * 24 * 60 * 60, "blacklisted");

    return res.status(200).json({
      message: "Logged out successfully",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { loginUser, registerUser, logoutUser };