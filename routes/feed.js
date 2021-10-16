const feedController = require("../controllers/feed");
const isAuth = require("../middleware/is-auth");

const { body } = require("express-validator");
const express = require("express");

const router = express.Router();

// GET feed/posts -> list posts
router.get("/posts", isAuth, feedController.getPosts);

// POST feed.post -> created post
router.post(
  "/post",
  isAuth,
  [body("title").trim().isLength(5), body("content").trim().isLength(5)],
  feedController.createPost
);

// GET feed/posts/:postId -> specific post
router.get("/post/:postId", isAuth, feedController.getPost);

// PUT feed/posts/:postId -> specific updated post
router.put(
  "/post/:postId",
  isAuth,
  [body("title").trim().isLength(5), body("content").trim().isLength(5)],
  feedController.updatePost
);

// DELETE feed/post
router.delete("/post/:postId", isAuth, feedController.deletePost);

module.exports = router;
