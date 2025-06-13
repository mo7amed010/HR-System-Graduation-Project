const express = require("express");
const router = express.Router();
const { auth } = require("../Middlewares/auth");
const { validation } = require("../Middlewares/validation");
const { login } = require("../Controllers/login");

router.post("/login", login);
router.use(auth);
module.exports = router;
