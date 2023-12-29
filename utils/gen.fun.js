const passport = require("passport");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const generateJwtToken = (user) => {
  const payload = {
    sub: user._id,
    username: user.email,
  };

  return jwt.sign(payload, "your_secret_key", { expiresIn: "1h" });
};

module.exports = {
  generateJwtToken
};
