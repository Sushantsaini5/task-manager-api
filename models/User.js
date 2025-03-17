const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"], // ✅ Email validation
    },
    password: { type: String, required: true, minlength: 6 },
  },
  { timestamps: true } // ✅ Adds createdAt & updatedAt automatically
);

// 🔹 Hash password before saving
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next(); // ✅ Only hash if modified
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// 🔹 Method to compare password (for login)
UserSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// 🔹 Export the model
module.exports = mongoose.model("User", UserSchema);
