const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true
    },

    name: {
      type: String,
      trim: true
    },

    profileImage: {
      type: String,
      default: ""
    },

    hashedPassword: {
      type: String,
      required: true
    },
  },
  { timestamps: true }
);

userSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    delete returnedObject.hashedPassword;
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
