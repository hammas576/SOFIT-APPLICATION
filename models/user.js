var mongoose = require("mongoose");
var UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: {
      type: String,
      lowercase: true,
      unique: true,
      required: true,
    },
    employeeTitle: { type: String },
    phoneStatus: { type: String, required: true },
    blocked: { type: Boolean, default: false },
    status: { type: Boolean, default: false },
    isValidated: { type: Boolean, default: false },
    imagePath: { type: String },
  },
  { strict: false }
);
module.exports = mongoose.model("User", UserSchema);
