const fs = require("fs");
const path = require("path");

const Post = require("../models/post");
const User = require("../models/user");

const io = require("../socket");

const { validationResult } = require("express-validator");

const clearImage = (imagePath) => {
  imagePath = path.join(__dirname, "..", imagePath);
  fs.unlink(imagePath, (err) => {
    if (err) {
      console.log(err);
    }
  });
};

exports.getPosts = async (req, res, next) => {
  const currentPage = req.query.page || 1;
  const limitPerPage = 2;
  let totalPosts;
  let posts;
  try {
    totalPosts = await Post.find().countDocuments();
    posts = await Post.find()
      .populate("creator")
      .sort({ createdAt: -1 })
      .skip((currentPage - 1) * limitPerPage)
      .limit(limitPerPage);

    res.status(200).json({
      message: "Posts are fetched",
      posts: posts,
      totalItems: totalPosts,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.createPost = async (req, res, next) => {
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
  const content = req.body.content;
  const imageUrl = req.file.path.replace("\\", "/");

  try {
    // save post
    const post = new Post({
      title: title,
      content: content,
      imageUrl: imageUrl,
      creator: req.userId,
    });
    await post.save();

    // save posts of user
    const user = await User.findById(req.userId);
    user.posts.push(post);
    const result = await user.save();

    console.log("Created Post");
    console.log(post);
    io.getIO().emit("posts", {
      action: "create",
      post: { ...post._doc, creator: { _id: result._id, name: result.name } },
    });
    res.status(201).json({
      message: "A Post created successfully!",
      post: post,
      creator: { _id: result._id, name: result.name },
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.getPost = async (req, res, next) => {
  const postId = req.params.postId;
  try {
    const post = await Post.findById(postId);
    if (!post) {
      const error = new Error("A post is not found");
      error.statusCode = 404;
      throw error;
    }
    res.status(200).json({ message: "A post is fetched", post: post });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.updatePost = async (req, res, next) => {
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

  try {
    const post = await Post.findById(postId).populate("creator");
    if (!post) {
      const error = new Error("This post is not found");
      error.statusCode = 404;
      throw error;
    }
    console.log(post.creator.toString());
    if (post.creator._id.toString() !== req.userId) {
      const error = new Error("User is not authorized to do this action");
      error.statusCode = 403;
      throw error;
    }

    if (imageUrl !== post.imageUrl) {
      clearImage(post.imageUrl);
    }

    post.title = title;
    post.content = content;
    post.imageUrl = imageUrl.replace("\\", "/");
    const result = await post.save();

    console.log("Updated Post");
    io.getIO().emit("posts", { action: "update", post: result });
    res.status(200).json({
      message: "Post is updated",
      post: result,
    });
  } catch (err) {
    console.log(err);
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.deletePost = async (req, res, next) => {
  const postId = req.params.postId;
  let deletedPost;

  try {
    deletedPost = await Post.findById(postId);
    if (!deletedPost) {
      const error = new Error("Found no post with this Id");
      error.statusCode = 404;
      throw error;
    }

    // check the user
    if (deletedPost.creator.toString() !== req.userId) {
      const error = new Error("User is not authorized to do this action");
      error.statusCode = 403;
      throw error;
    }

    clearImage(deletedPost.imageUrl);
    await Post.findByIdAndRemove(deletedPost._id);

    const user = await User.findById(req.userId);
    user.posts = user.posts.filter(
      (p) => p.toString() !== deletedPost._id.toString()
    );
    await user.save();

    console.log("Deleted Post");
    io.getIO().emit("posts", { action: "delete", post: postId });
    res.status(200).json({
      message: "Deleted the post",
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
