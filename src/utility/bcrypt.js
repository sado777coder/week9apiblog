const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Hash password
const hashPassowrd = async (password) => {
  const salt = await bcrypt.genSalt(12);
  const hash = await bcrypt.hash(password, salt);
  return hash; // was "hashed" typo in your snippet
};

// Generate JWT
const generateToken = (user) => {
  return jwt.sign(
    { userId: user._id, username: user.name },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

module.exports = {
  hashPassowrd,
  generateToken,
};