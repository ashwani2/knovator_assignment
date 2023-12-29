const express = require("express");
const postController = require("../controllers/post.controller");
const passport = require("../config/passport-config");

const router = express.Router();

router.use(passport.authenticate("jwt", { session: false }));
router.post("/", postController.createPost);
router.get("/", postController.getAllPosts);
router.get("/:postId", postController.getPost);
router.put("/:postId", postController.updatePost);
router.delete("/:postId", postController.deletePost);

router.get(
  "/nearby/:latitude/:longitude",
  postController.getPostsNearby
);

module.exports = router;
