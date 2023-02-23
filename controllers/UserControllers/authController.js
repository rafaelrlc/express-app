const User = require("../../model/User");

const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const userLogin = async (req, res) => {
  const { user, pwd } = req.body;
  if (!user || !pwd) {
    res.json({ message: "User and password required" });
  }

  // evaluate user
  const foundUser = await User.findOne({ username: user }).exec();
  if (!foundUser) {
    res.sendStatus(401); // Unauthorized
  }

  // evaluate password
  const match = await bcrypt.compare(pwd, foundUser.password);
  if (match) {
    const roles = Object.values(foundUser.roles);
    console.log(roles);
    const accessToken = jwt.sign(
      {
        UserInfo: {
          username: foundUser.username,
          roles: roles,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "1h" }
    );
    const refreshToken = jwt.sign(
      { username: foundUser.username },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "1d" }
    );

    // saving refresh token with current user
    foundUser.refreshToken = refreshToken;
    const result = await foundUser.save();
    console.log(result);

    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      sameSite: "None",
      //secure: true,
      maxAge: 24 * 60 * 60 * 1000,
    });
    res.json({ accessToken });
  } else {
    res.sendStatus(401); // Unathorized
  }
};

module.exports = { userLogin };
