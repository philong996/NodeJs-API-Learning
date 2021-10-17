require("dotenv").config();
JWT_SECRET = process.env.JWT_SECRET;

const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const authenHeader = req.get("Authorization");
  if (!authenHeader) {
    const error = new Error("Not Authentication");
    error.statusCode = 401;
    throw error;
  }

  const token = authenHeader.split(" ")[1];
  let decodedToken;
  try {
    decodedToken = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    err.statusCode = 500;
    throw err;
  }
  

  if (!decodedToken) {
    const error = new Error("Token is invalid");
    error.statusCode = 401;
    throw error;
  }
  req.userId = decodedToken.userId;
  next();
};
