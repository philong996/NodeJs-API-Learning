const userController = require("../controllers/user");
const isAuth = require("../middleware/is-auth");

const { body } = require("express-validator");

const express = require("express");

const router = new express.Router();

router.get("/status", isAuth, userController.getStatus);

router.patch(
  "/status",
  isAuth,
  body("status", "Invalid user status").trim().not().isEmpty(),
  userController.updateStatus
);

module.exports = router;
