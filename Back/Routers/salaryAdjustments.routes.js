const express = require("express");
const router = express.Router();
const SalaryAdjustments = require("../Models/salaryAdjustments");

// GET all salary adjustments
router.get("/", async (req, res) => {
  try {
    const adjustments = await SalaryAdjustments.find().populate(
      "employeeId",
      "name"
    );
    res.status(200).json(adjustments);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// DELETE a salary adjustment by ID
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await SalaryAdjustments.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: "Adjustment not found" });
    }

    res.status(200).json({ message: "Adjustment deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;
