const User = require("../models/user");

const { validationResult } = require("express-validator");

exports.getStatus = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);

    if (!user) {
      const error = new Error("No user with this Id. Please signin again!");
      error.statusCode = 401;
      throw error;
    }

    res.status(200).json({
      message: "Get user status successfully",
      status: user.status,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.updateStatus = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const error = new Error("Invalid input");
    error.statusCode = 422;
    error.data = errors.array();
    throw error;
  }

  const newStatus = req.body.status;
  User.findById(req.userId)
    .then((user) => {
      if (!user) {
        const error = new Error("No user with this Id. Please signin again!");
        error.statusCode = 404;
        throw error;
      }

      user.status = newStatus;
      return user.save();
    })
    .then((result) => {
      console.log("Updated user status");
      res.status(200).json({
        message: "Updated user status successfully",
        userId: result._id,
        status: result.status,
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};
