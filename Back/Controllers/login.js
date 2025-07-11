const { CatchAsync } = require("../Utils/CatchAsync");
const AppError = require("../Utils/AppError");
const userModel = require("../Models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.registerUser = CatchAsync(async (req, res) => {
  const { name ,username, email, password } = req.body;

  // Basic validation
  if (!username || !email || !password) {
    throw new AppError(400, "Username, email and password are required");
  }

  // Check if the email already exists
  const existingUser = await userModel.findOne({ email });
  if (existingUser) {
    throw new AppError(400, "Email already exists");
  }

  // Check if the username already exists
  const existingUsername = await userModel.findOne({ username });
  if (existingUsername) {
    throw new AppError(400, "Username already exists");
  }

  // Create new user - password will be hashed by the pre-save hook
  const user = await userModel.create({
    name,
    username,
    email,
    password, // No need to hash here - the schema pre-save hook will do it
  });

  // Send response without sending the password
  res.status(201).json({
    status: "success",
    data: {
      name:user.name,
      username: user.username,
      email: user.email,
    },
  });
});

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
