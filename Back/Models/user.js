const mongoose = require("mongoose");
const bcryptjs = require("bcryptjs");

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "First name is required"],
      minLength: [3, "min length is 3"],
      maxLength: [15, "max length is 15"],
    },
    username: {
      type: String,
      required: [true, "Username is required"],
      unique: [true, "it's not unique"],
      minLength: [4, "Username must be 4 character"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: [true, "it's not unique"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minLength: [8, "[Password must be 8 character or more]"],
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  let salt = await bcryptjs.genSalt(10);
  console.log(this);

  let hashedPass = await bcryptjs.hash(this.password, salt);
  this.password = hashedPass;
  next();
});

const userModel = mongoose.model("user", userSchema);
module.exports = userModel;
