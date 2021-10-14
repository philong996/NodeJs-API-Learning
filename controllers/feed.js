const Post = require("../models/post");

const { validationResult } = require("express-validator");

exports.getPosts = (req, res, next) => {
  Post.find()
    .then((posts) => {
      res.status(200).json({
        message: "Posts are fetched",
        posts: posts,
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.createPost = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const errors = new Error("Validation fails. User input is incorrect!");
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

exports.getPost = (req, res, next) => {
  const postId = req.params.postId;

  Post.findById(postId)
    .then((post) => {
      if (!post) {
        const error = new Error("A post is not found");
        error.statusCode = 404;
        throw error;
      }

      res.status(200).json({ message: "A post is fetched", post: post });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};
