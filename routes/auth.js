const express = require("express");

const { body } = require("express-validator");
const authController = require("../controllers/auth");

const User = require("../models/user");

const router = express.Router();

// PUT auth/signup/
router.put(
  "/signup",
  [
    body("email", "Invalid Email")
      .isEmail()
      .custom((value, { req }) => {
        return User.findOne({ email: value }).then((user) => {
          if (user) {
            return Promise.reject("Email is existed. Please try another email");
          }
        });
      })
      .normalizeEmail(),
    body("name").trim().not().isEmpty(),
    body("password").trim().isLength({ min: 5 }),
  ],
  authController.signup
);


router.post("/login", authController.login)

module.exports = router;
