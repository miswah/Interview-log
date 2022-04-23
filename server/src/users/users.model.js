const mongooes = require("mongoose");
const bcrypt = require("bcryptjs");
const Schema = mongooes.Schema;

/**Define the main schema for user profile */
const userSchema = new Schema(
  {
    userId: { type: String, require: true, unique: true },
    email: { type: String, require: true, unique: true },
    name: { type: String, require: true },
    active: { type: Boolean, require: true, default: true },
    password: { type: String, require: true },
    resetPasswordToken: { type: String, default: null },
    resetPasswordExpires: { type: Date, default: null },
    emailToken: { type: String, default: null },
    emailTokenExpires: { type: Date, default: null },
    accessToken: { type: String, default: null },
    role: { type: String, default: "user" },
  },
  {
    timestamps: {
      createdAt: "createdAt",
      updatedAt: "updatedAt",
    },
  }
);

//Assign Schmea and set a collection name for mongo
const User = mongooes.model("users", userSchema);
module.exports = User;

/**Hashing Password function */
module.exports.hashPassword = async (password) => {
  try {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
  } catch (error) {
    throw new Error("Hashing failed - User Model", error);
  }
};

/** Verify Password Function */
module.exports.comparePasswords = async (inputPassword, hashedPassword) => {
  try {
    return await bcrypt.compare(inputPassword, hashedPassword);
  } catch (error) {
    throw new Error("Comparison failed", error);
  }
};
