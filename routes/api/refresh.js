const express = require("express");
const router = express.Router();

const {
  handleRefreshToken,
} = require("../../controllers/UserControllers/refreshTokenController");

router.get("/", handleRefreshToken);

module.exports = router;
