const usersDB = {
  users: require("../model/users.json"),
  setUsers: function (data) {
    this.users = data;
  },
};

const bcrypt = require("bcrypt");

const userLogin = async (req, res) => {
  const { user, pwd } = req.body;
  if (!user || !pwd) {
    res.json({ message: "User and password required" });
  }
  const foundUser = usersDB.users.find((person) => person.username === user);
  if (!foundUser) {
    return res.sendStatus(401); // Unauthorized
  }
  // evaluate password

  const match = await bcrypt.compare(pwd, foundUser.password);
  if (match) {
    // create JWTs
    res.json({ success: `User ${user} is logged in!` });
  } else {
    res.sendStatus(401);
  }
};

module.exports = { userLogin };
