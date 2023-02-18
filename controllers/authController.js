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

  // evaluate user
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
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "1d" }
    );

    // saving refresh token with current user

    const othersUsers = usersDB.users.filter(
      (person) => person.username !== foundUser.username
    ); // returns all users beside the current user

    const currentUser = { ...foundUser, refreshToken }; // {...foundUser, refreshToken} means {username, password, refreshToken}
    console.log(currentUser, othersUsers);
    usersDB.setUsers([...othersUsers, foundUser]); // {...othersUsers, foundUsers} means {user1, user2, user3, ..., othersUsers}

    await fsPromisses.writeFile(
      path.join(__dirname, "..", "model", "users.json"),
      JSON.stringify(usersDB.users)
    );

    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    });
    res.json({ accessToken });
  } else {
    res.sendStatus(401); // Unathorized
  }
};

module.exports = { userLogin };
