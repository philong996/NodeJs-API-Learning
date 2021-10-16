require("dotenv").config();
JWT_SECRET = process.env.JWT_SECRET;

const User = require("../models/user");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");

exports.signup = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error(
      "Validation for signup fails! Please correct user input"
    );
    error.statusCode = 422;
    error.data = errors.array();
    throw error;
  }

  const email = req.body.email;
  const name = req.body.name;
  const password = req.body.password;

  bcrypt
    .hash(password, 12)
    .then((hashPassword) => {
      const user = new User({
        email: email,
        name: name,
        password: hashPassword,
        status: "active",
        posts: [],
      });

      return user.save();
    })
    .then((result) => {
      console.log("Created User");
      res.status(201).json({
        message: "User is created",
        userId: result._id,
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.login = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  let loadedUser;

  User.findOne({ email: email })
    .then((user) => {
      if (!user) {
        const error = new Error("Not found any user");
        error.statusCode = 401;
        throw error;
      }
      loadedUser = user;
      return bcrypt.compare(password, user.password);
    })
    .then((result) => {
      if (!result) {
        const error = new Error("Password is wrong");
        error.statusCode = 401;
        throw error;
      }

      const token = jwt.sign(
        {
          email: loadedUser.email,
          userId: loadedUser._id,
        },
        JWT_SECRET,
        { expiresIn: "1h" }
      );

      res.status(200).json({ token: token, userId: loadedUser._id });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};
