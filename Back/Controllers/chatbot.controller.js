const Employee = require("../Models/employee");
const Attendance = require("../Models/attendance");
const SalaryAdjustment = require("../Models/salaryAdjustments");
const dayjs = require("dayjs");

exports.getTotalEmployees = async (req, res) => {
  const totalEmployees = await Employee.countDocuments();
  res.json({ totalEmployees });
};

exports.getAttendedToday = async (req, res) => {
  try {
    const today = dayjs().format("YYYY-MM-DD");
    const start = dayjs(today).startOf("day").toDate();
    const end = dayjs(today).endOf("day").toDate();

    const attendanceRecords = await Attendance.find({
      date: { $gte: start, $lte: end },
    });

    const attendedToday = attendanceRecords.length;
    res.json({ attendedToday });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error getting attendedToday", error: err.message });
  }
};

exports.getAbsentToday = async (req, res) => {
  try {
    const today = dayjs().format("YYYY-MM-DD");
    const start = dayjs(today).startOf("day").toDate();
    const end = dayjs(today).endOf("day").toDate();

    const totalEmployees = await Employee.countDocuments();
    const attendanceRecords = await Attendance.find({
      date: { $gte: start, $lte: end },
    });

    const attendedToday = attendanceRecords.length;
    const absentToday = totalEmployees - attendedToday;

    res.json({ absentToday });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error getting absentToday", error: err.message });
  }
};
