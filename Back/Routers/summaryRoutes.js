const express = require("express");
const router = express.Router();
const { auth } = require("../Middlewares/auth");
const {
  getEmployeeSummary,
  getEmployeesForSummary,
} = require("../Controllers/summaryController");

// Apply authentication middleware
router.use(auth);

// Get employee summary
router.get("/:id/summary", getEmployeeSummary);

// Get all employees for summary selection
router.get("/summary/list", getEmployeesForSummary);

module.exports = router; 