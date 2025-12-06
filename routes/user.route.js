const express = require("express");
const {
    registerUser,
    loginUser
} = require("../controllers/user.controler.js");

const router = express.Router();

 router.post("/sign-up", registerUser);
 router.post("/login", loginUser);

 module.exports = router;