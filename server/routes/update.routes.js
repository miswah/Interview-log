const express = require("express");
const router = express.Router();

/**Import Middlewares */
const cleanBody = require("../middlewares/cleanbody");
const validateToken = require("../middlewares/validateToken");

/**Import Controller */
const UpdateController = require("../src/updates/update.controller");

/**Define Routes */
router.post("/create", cleanBody, validateToken, UpdateController.Create);
router.get("/all/:entry_id", cleanBody, validateToken, UpdateController.All);

module.exports = router;
