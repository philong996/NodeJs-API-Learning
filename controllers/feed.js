const Post = require("../models/post");

const { validationResult } = require("express-validator");

exports.getPosts = (req, res, next) => {
  res.status(200).json({
    posts: [
      {
        _id: "1",
        title: "First post",
        imageUrl: "images/Landscape-Color.jpg",
        content: "content 1",
        createdAt: new Date(),
        creator: { name: "Long" },
      },
    ],
  });
};

exports.createPost = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const errors = new Error("Invalidation input");
    errors.statusCode = 422;

    throw errors;
  }

  const title = req.body.title;
  const content = req.body.title;

  const post = new Post({
    title: title,
    content: content,
    imageUrl: "images/tree.jpg",
    creator: { name: "Long" },
  });
  post
    .save()
    .then((result) => {
      console.log(result);
      res.status(201).json({
        message: "A Post created successfully!",
        post: result,
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};
