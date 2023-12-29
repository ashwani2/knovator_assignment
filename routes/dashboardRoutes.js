// routes/dashboard.js
const express = require("express");
const passport = require("../config/passport-config");
const postController = require("../controllers/post.controller");

const router = express.Router();

// Dashboard route requiring JWT authentication
router.get(
  "/postCount",
  passport.authenticate("jwt", { session: false }),
  postController.postCount
);

module.exports = router;
