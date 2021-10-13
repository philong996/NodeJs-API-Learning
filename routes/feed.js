const feedController = require("../controllers/feed")

const express = require("express");

const router = express.Router();

// GET feed/posts -> list posts
router.get('/posts', feedController.getPosts)

// POST feed.posts 
router.post("/posts", feedController.createPost)

module.exports = router;