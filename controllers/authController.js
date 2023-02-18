const usersDB = {
  users: require("../model/users.json"),
  setUsers: function (data) {
    this.users = data;
  },
};

const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
require("dotenv").config();
const fsPromisses = require("fs").promises;
const path = require("path");

const userLogin = async (req, res) => {
  const { user, pwd } = req.body;
  if (!user || !pwd) {
    res.json({ message: "User and password required" });
  }
  const foundUser = usersDB.users.find((person) => person.username === user);
  if (!foundUser) {
    res.sendStatus(401); // Unauthorized
  }
  // evaluate password

  const match = await bcrypt.compare(pwd, foundUser.password);
  if (match) {
    const accessToken = jwt.sign(
      { username: foundUser.username },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "30s" }
    );
    const refreshToken = jwt.sign(
      { username: foundUser.username },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "1d" }
    );

    res.json({ success: `User ${user} is logged in!` });
  } else {
    res.sendStatus(401);
  }
};

module.exports = { userLogin };
