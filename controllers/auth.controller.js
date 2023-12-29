
const { validationResult } = require("express-validator");
const asyncHandler = require("../middlewares/async");
const { generateJwtToken } = require("../utils/gen.fun");
const ErrorResponse = require("../utils/errorResponse");
const User = require("../models/User");

// Register a new user

exports.register = asyncHandler(async (req, res) => {
  // Validate request
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new ErrorResponse(`${errors.array()}`, 404));
  }

  const { email, password } = req.body;

  
    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(new ErrorResponse(`User Already exists`));
    }

    // Create a new user
    const newUser = new User({ email, password });
    await newUser.save();

    const token = generateJwtToken(newUser)

    res.json({ message: "User registered successfully",token });
  
});

// Login 
exports.login = asyncHandler((req, res) => {
  try {
    const token = generateJwtToken(req.user)

    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});
