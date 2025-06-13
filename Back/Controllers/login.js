const { CatchAsync } = require("../Utils/CatchAsync");
const AppError = require("../Utils/AppError");
const userModel = require("../Models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.login = async (req, res, next) => {
  let { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(400)
      .json({ status: "You must provide email and password" });
  }
  let user = await userModel.findOne({ email });
  if (!user) {
    return res.status(404).json({ status: "User not found" });
  }
  let isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    return res.status(400).json({ status: "Invalid email or password" });
  }
  let token = jwt.sign(
    { id: user._id, email: user.email, username: user.username },
    process.env.SECRET_KEY
  );
  if (token) {
    return res.json({ status: "success", token });
  } else {
    console.log(err);
    next(new AppError(500, "Error logging in"));
  }
};
