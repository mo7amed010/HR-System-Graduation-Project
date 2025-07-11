const express = require("express");
const router = express.Router();
const chatbotController = require("../Controllers/chatbot.controller");

router.get("/total-employees", chatbotController.getTotalEmployees);

router.get("/attended-today", chatbotController.getAttendedToday);

router.get("/absent-today", chatbotController.getAbsentToday);

module.exports = router;
