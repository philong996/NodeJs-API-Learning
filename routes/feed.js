const feedController = require("../controllers/feed");

const { body } = require("express-validator");
const express = require("express");

const router = express.Router();

// GET feed/posts -> list posts
router.get("/posts", feedController.getPosts);

// POST feed.posts
router.post(
  "/posts",
  [body("title").trim().isLength(5), body("content").trim().isLength(5)],
  feedController.createPost
);

// GET feed/posts/:postId -> specific post
router.get("/posts/:postId", feedController.getPost);

module.exports = router;