const asyncHandler = require("../middlewares/async");
const Post = require("../models/Post");
const { validationResult } = require("express-validator");
const ErrorResponse = require("../utils/errorResponse");

//
//@desc     Create a new post
//@route    POST /post/
//@access   Private
exports.createPost = asyncHandler(async (req, res) => {
  // Validate request
  const errors = validationResult(req);
  console.log(errors);
  if (!errors.isEmpty()) {
    const validationErrors = errors
      .array()
      .map((error) => ({ [error.param]: error.msg }));
    return next(new ErrorResponse(`${validationErrors}`, 404));
  }

  const { title, body, latitude, longitude } = req.body;
  const createdBy = req.user._id;
  const newPost = new Post({
    title,
    body,
    createdBy,
    location: {
      type: "Point",
      coordinates: [latitude, longitude],
    },
  });

  await newPost.save();

  res.json({ message: "Post created successfully", post: newPost });
});

//@desc     Get all posts for the authenticated user
//@route    GET /post/
//@access   Private
exports.getAllPosts = asyncHandler(async (req, res) => {
  const posts = await Post.find({ createdBy: req.user._id });
  if (!posts) {
    return next(new ErrorResponse(`Posts Not FOund`, 404));
  }
  res.json(posts);
});

//@desc     Get a specific post for the authenticated user
//@route    POST /post/:id
//@access   Private
exports.getPost = asyncHandler(async (req, res) => {
  const postId = req.params.postId;

  const post = await Post.findOne({ _id: postId, createdBy: req.user._id });

  if (!post) {
    return next(new ErrorResponse(`Post Not FOund`, 404));
  }

  res.json(post);
});

//@desc     Update a specific post for the authenticated user
//@route    POST /post/:id
//@access   Private
exports.updatePost = asyncHandler(async (req, res) => {
  const postId = req.params.postId;
  const { title, body, latitude, longitude } = req.body;
  if (latitude || longitude) {
    const parsedLatitude = parseFloat(latitude);
    const parsedLongitude = parseFloat(longitude);

    if (isNaN(parsedLatitude) || isNaN(parsedLongitude)) {
      return res
        .status(400)
        .json({ error: "Invalid latitude or longitude values" });
    }
  }
  const updatedPost = await Post.findOneAndUpdate(
    { _id: postId, createdBy: req.user._id },
    {
      $set: {
        title,
        body,
        location: {
          type: "Point",
          coordinates: [parseFloat(latitude), parseFloat(longitude)],
        },
      },
    },
    { new: true, runValidators: false }
  );

  if (!updatedPost) {
    return next(new ErrorResponse(`Post Not FOund`, 404));
  }

  res.json({ message: "Post updated successfully", post: updatedPost });
});

//@desc     Delete a specific post for the authenticated user
//@route    POST /post/:id
//@access   Private
exports.deletePost = asyncHandler(async (req, res) => {
  const postId = req.params.postId;

  const deletedPost = await Post.findOneAndDelete({
    _id: postId,
    createdBy: req.user._id,
  });

  if (!deletedPost) {
    return next(new ErrorResponse(`Post Not FOund`, 404));
  }

  res.json({ message: "Post deleted successfully", post: deletedPost });
});

//@desc     Get posts near a given latitude and longitude
//@route    POST /post/nearby
//@access   Private
exports.getPostsNearby = asyncHandler(async (req, res) => {
  const { latitude, longitude } = req.params;

  const nearbyPosts = await Post.getNearbyPosts(latitude, longitude);

  if (!nearbyPosts) {
    return next(new ErrorResponse(`Something Went Wrong!`, 404));
  }

  res.json(nearbyPosts);
});

//@desc     Get posts Count
//@route    POST /dashboard/postCount
//@access   Private
exports.postCount = asyncHandler(async (req, res) => {
  const activePostCount = await Post.countDocuments({
    createdBy: req.user._id,
    isActive: true,
  });
  const inactivePostCount = await Post.countDocuments({
    createdBy: req.user._id,
    isActive: false,
  });

  res.json({ activePostCount, inactivePostCount });
});
