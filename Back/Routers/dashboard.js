const express = require("express");
const router = express.Router();
const { auth } = require("../Middlewares/auth");
const { validation } = require("../Middlewares/validation");

router.use(auth);
// router.get("/", (req, res) => console.log("working")); // for testing
module.exports = router;
