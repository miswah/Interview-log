const express = require("express");
const router = express.Router();

/**Import Middlewares */
const cleanBody = require("../middlewares/cleanbody");
const validateToken = require("../middlewares/validateToken");

/**Controller Import */
const AuthController = require("../src/users/users.controller");

/**Define Routes */
router.post("/signup", cleanBody, AuthController.Signup);
router.post("/login", cleanBody, AuthController.Login);
router.put("/logout", cleanBody, validateToken, AuthController.Logout);

module.exports = router;
