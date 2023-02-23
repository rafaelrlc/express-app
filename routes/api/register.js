const express = require("express");
const router = express.Router();

const {
  handleNewUser,
} = require("../../controllers/UserControllers/registerController");

router.post("/", handleNewUser);

module.exports = router;
