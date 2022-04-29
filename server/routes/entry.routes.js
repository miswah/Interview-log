const express = require("express");
const router = express.Router();

/**Import Middlewares */
const cleanBody = require("../middlewares/cleanbody");
const validateToken = require("../middlewares/validateToken");

/**Import Controller */
const EntryController = require("../src/entries/entries.controller");

/**Define Routes */
router.post("/create", cleandBody, validateToken, EntryController.Create);

module.exports = router;
