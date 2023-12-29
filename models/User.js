const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Check if the model is already defined, and only define it if it's not
const UserSchema = mongoose.models.User
  ? mongoose.model('User').schema
  : new mongoose.Schema({
    email: {
      type: String,
      required: [true, "Please Add a Email"],
      unique: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please add a valid email",
      ],
    },
    password: {
      type: String,
      required: [true, "Please Add a Password"],
      minlength: 6,
      select: false,
    },
    });

// Add pre-save hook for password hashing
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    return next(error);
  }
});

// Add authenticate method
UserSchema.statics.authenticate = async function (username, password) {
  const user = await this.findOne({ username });

  if (!user) {
    throw new Error('Authentication failed. User not found.');
  }

  const isPasswordMatch = await bcrypt.compare(password, user.password);

  if (!isPasswordMatch) {
    throw new Error('Authentication failed. Incorrect password.');
  }

  return user;
};

const User = mongoose.models.User || mongoose.model('User', UserSchema);

module.exports = User;
