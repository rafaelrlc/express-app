const express = require("express");
const router = express.Router();

const { userLogin } = require("../../controllers/authController");

router.post("/", userLogin);

module.exports = router;
