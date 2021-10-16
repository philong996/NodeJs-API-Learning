const fs = require("fs");
const path = require("path");

const Post = require("../models/post");

const { validationResult } = require("express-validator");

const clearImage = (imagePath) => {
  imagePath = path.join(__dirname, "..", imagePath);
  fs.unlink(imagePath, (err) => {
    if (err) {
      console.log(err);
    }
  });
};

exports.getPosts = (req, res, next) => {
  const currentPage = req.query.page || 1;
  const limitPerPage = 2;
  let totalPosts;

  Post.find()
    .countDocuments()
    .then((result) => {
      totalPosts = result;

      return Post.find()
        .skip((currentPage - 1) * limitPerPage)
        .limit(limitPerPage);
    })
    .then((posts) => {
      res.status(200).json({
        message: "Posts are fetched",
        posts: posts,
        totalItems: totalPosts,
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
    const error = new Error("Validation fails. User input is incorrect!");
    error.statusCode = 422;
    throw error;
  }
  if (!req.file) {
    const error = new Error("No image is provided");
    error.statusCode = 422;
    throw error;
  }

  const title = req.body.title;
  const content = req.body.title;
  const imageUrl = req.file.path.replace("\\", "/");

  const post = new Post({
    title: title,
    content: content,
    imageUrl: imageUrl,
    creator: { name: "Long" },
  });
  post
    .save()
    .then((result) => {
      console.log("Created Post");
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

exports.updatePost = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const error = new Error("Validation fails. User input is incorrect!");
    error.statusCode = 422;
    throw error;
  }

  const postId = req.params.postId;
  const title = req.body.title;
  const content = req.body.content;
  let imageUrl = req.body.image;

  if (req.file) {
    imageUrl = req.file.path;
  }

  Post.findById(postId)
    .then((post) => {
      if (!post) {
        const error = new Error("This post is not found");
        error.statusCode = 404;
        throw error;
      }
      if (imageUrl !== post.imageUrl) {
        clearImage(post.imageUrl);
      }

      post.title = title;
      post.content = content;
      post.imageUrl = imageUrl.replace("\\", "/");
      return post.save();
    })
    .then((result) => {
      console.log("Updated Post");
      res.status(200).json({
        message: "Post is updated",
        post: result,
      });
    })
    .catch((err) => {
      console.log(err);
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.deletePost = (req, res, next) => {
  const postId = req.params.postId;

  Post.findById(postId)
    .then((post) => {
      if (!post) {
        const error = new Error("Found no post with this Id");
        error.statusCode = 404;
        throw error;
      }

      // check the user

      clearImage(post.imageUrl);
      return Post.findByIdAndRemove(post._id);
    })
    .then((result) => {
      console.log("Deleted Post");
      res.status(200).json({
        message: "Deleted the post",
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};
