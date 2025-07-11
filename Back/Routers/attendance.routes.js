const express = require("express");
const router = express.Router();
const {
  createAttendance,
  getAttendance,
  updateAttendance,
  deleteAttendance,
} = require("../Controllers/attendance.controller");

router.post("/", createAttendance); //add
router.get("/", getAttendance); // show
router.put("/:id", updateAttendance); // edit
router.delete("/:id", deleteAttendance); // delete

module.exports = router;
