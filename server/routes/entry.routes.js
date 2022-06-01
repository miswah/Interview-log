const express = require("express");
const router = express.Router();

/**Import Middlewares */
const cleanBody = require("../middlewares/cleanbody");
const validateToken = require("../middlewares/validateToken");

/**Import Controller */
const EntryController = require("../src/entries/entries.controller");

/**Define Routes */
router.post("/create", cleanBody, validateToken, EntryController.Create);
router.get("/all", cleanBody, validateToken, EntryController.All);
router.get("/:entry_id", cleanBody, validateToken, EntryController.Fetch);

module.exports = router;
