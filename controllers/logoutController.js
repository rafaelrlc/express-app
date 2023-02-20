const usersDB = {
  users: require("../model/users.json"),
  setUsers: function (data) {
    this.users = data;
  },
};
const jwt = require("jsonwebtoken");
require("dotenv").config();
const fsPromisses = require("fs").promises;
const path = require("path");

const handleLogout = async (req, res) => {
  // On client also delete the acessToken

  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(204); // no content

  const refreshToken = cookies.jwt;

  // Is refreshToken in database
  const foundUser = usersDB.users.find(
    (person) => person.refreshToken === refreshToken
  );
  if (!foundUser) {
    res.clearCookie("jwt", { httpOnly: true });
    return res.sendStatus(204); // no content
  }

  // Delete refreshToken in databse
  const otherUsers = usersDB.users.filter(
    (user) => user.refreshToken !== foundUser.refreshToken
  );
  const currentUser = { ...foundUser, refreshToken: "" }; // erase refresh token
  usersDB.setUsers([...otherUsers, currentUser]);

  await fsPromisses.writeFile(
    path.join(__dirname, "..", "model", "users.json"),
    JSON.stringify(usersDB.users)
  );

  res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true });
  res.sendStatus(204);
};

module.exports = { handleLogout };
