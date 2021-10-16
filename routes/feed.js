const feedController = require("../controllers/feed");

const { body } = require("express-validator");
const express = require("express");

const router = express.Router();

// GET feed/posts -> list posts
router.get("/posts", feedController.getPosts);

// POST feed.posts
router.post(
  "/post",
  [body("title").trim().isLength(5), body("content").trim().isLength(5)],
  feedController.createPost
);

// GET feed/posts/:postId -> specific post
router.get("/post/:postId", feedController.getPost);

// PUT feed/posts/:postId -> specific updated post
router.put(
  "/post/:postId",
  [body("title").trim().isLength(5), body("content").trim().isLength(5)],
  feedController.updatePost
);

router.delete("/post/:postId", feedController.deletePost);

module.exports = router;
