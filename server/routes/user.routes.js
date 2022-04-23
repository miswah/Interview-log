const express = require("express");
const router = express.Router();

/**Import Middlewares */
const cleanBody = require("../middlewares/cleanbody");

/**Controller Import */
const AuthController = require("../src/users/users.controller");

/**Define Routes */
router.post("/signup", cleanBody, AuthController.Signup);
router.post("/login", cleanBody, AuthController.Login);

module.exports = router;
