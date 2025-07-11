const express = require("express");
const router = express.Router();
const { auth } = require("../Middlewares/auth");
const { validation } = require("../Middlewares/validation");
const { login, registerUser } = require("../Controllers/login");

router.post("/register", registerUser);
router.post("/login", login);
//router.use(auth);

module.exports = router;
