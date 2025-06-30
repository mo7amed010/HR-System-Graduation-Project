const AttendanceModel = require("../Models/attendance");
const EmployeeModel = require("../Models/employee");
const WeeklyModel = require("../Models/GeneralSitting");
const SalaryAdjustments = require("../Models/salaryAdjustments");
const OfficialHolidayModel = require("../Models/officialHolidays");
const attendanceValidation = require("../Validation/attendance.validation");

const dayjs = require("dayjs");

//  add attendance
const createAttendance = async (req, res) => {
  try {
    const { error } = attendanceValidation.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    const { employeeId, date, checkIn, checkOut } = req.body;

    // prevent duplication
    const startOfDay = dayjs(date).startOf("day").toDate();
    const endOfDay = dayjs(date).endOf("day").toDate();

    const existing = await AttendanceModel.findOne({
      employeeId,
      date: { $gte: startOfDay, $lte: endOfDay },
    });

    if (existing) {
      return res.status(400).json({
        message: "Attendance already recorded for this employee on this date.",
      });
    }

    const employee = await EmployeeModel.findById(employeeId);
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    const dayDate = dayjs(date).format("YYYY-MM-DD");
    const officialCheckIn = `${dayDate} ${employee.checkIn}`;
    const officialCheckOut = `${dayDate} ${employee.checkOut}`;
    const actualCheckIn = `${dayDate} ${checkIn}`;
    const actualCheckOut = `${dayDate} ${checkOut}`;

    const settings = await WeeklyModel.findOne();

    // check if the day is an official holiday
    const isHoliday = await OfficialHolidayModel.findOne({
      date: {
        $gte: dayjs(date).startOf("day").toDate(),
        $lte: dayjs(date).endOf("day").toDate(),
      },
    });

    if (isHoliday) {
      const totalMinutes = dayjs(actualCheckOut).diff(
        dayjs(actualCheckIn),
        "minute"
      );
      const totalHours = totalMinutes / 60;

      const attendance = await AttendanceModel.create({
        employeeId,
        date: dayjs(date).toDate(),
        checkIn,
        checkOut,
        lateMinutes: 0,
        overtimeMinutes: totalMinutes,
        totalHours,
      });

      if (settings && settings.method === "money") {
        const amount = Number(
          ((totalMinutes / 60) * settings.add * 2).toFixed(2)
        ); // ×2 for holidays
        if (!isNaN(amount)) {
          await SalaryAdjustments.create({
            employeeId,
            date,
            type: "addition",
            amount,
            reason: "Worked on official holiday",
          });
        }
      }

      return res.status(201).json({
        message: "Attendance recorded on official holiday with overtime",
        data: attendance,
      });
    }

    // if not holiday → continue as normal
    const lateMinutes = Math.max(
      0,
      dayjs(actualCheckIn).diff(dayjs(officialCheckIn), "minute")
    );
    const overtimeMinutes = Math.max(
      0,
      dayjs(actualCheckOut).diff(dayjs(officialCheckOut), "minute")
    );
    const totalHours =
      dayjs(actualCheckOut).diff(dayjs(actualCheckIn), "minute") / 60;

    if ([lateMinutes, overtimeMinutes, totalHours].some(isNaN)) {
      return res
        .status(400)
        .json({ message: "Invalid time format or internal error" });
    }

    const attendance = await AttendanceModel.create({
      employeeId,
      date: dayjs(date).toDate(),
      checkIn,
      checkOut,
      lateMinutes,
      overtimeMinutes,
      totalHours,
    });

    if (settings) {
      if (lateMinutes > 0) {
        let amount;
        if (settings.method === "money") {
          amount = Number(((lateMinutes / 60) * settings.deduct).toFixed(2));
        } else if (settings.method === "hours") {
          amount = Number((lateMinutes / 60).toFixed(2));
        }

        if (!isNaN(amount)) {
          await SalaryAdjustments.create({
            employeeId,
            date,
            type: "deduction",
            amount,
            reason: "Late arrival",
          });
        }
      }

      if (overtimeMinutes > 0) {
        let amount;
        if (settings.method === "money") {
          amount = Number(((overtimeMinutes / 60) * settings.add).toFixed(2));
        } else if (settings.method === "hours") {
          amount = Number((overtimeMinutes / 60).toFixed(2));
        }

        if (!isNaN(amount)) {
          await SalaryAdjustments.create({
            employeeId,
            date,
            type: "addition",
            amount,
            reason: "Overtime",
          });
        }
      }
    }

    res
      .status(201)
      .json({ message: "Attendance recorded successfully", data: attendance });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// show attendance (filteration: date, employeeId)
const getAttendance = async (req, res) => {
  try {
    const { date, employeeId } = req.query;

    let query = {};
    if (date) {
      const start = new Date(date);
      const end = new Date(date);
      end.setDate(end.getDate() + 1);
      query.date = { $gte: start, $lt: end };
    }
    if (employeeId) {
      query.employeeId = employeeId;
    }

    const attendanceRecords = await AttendanceModel.find(query).populate(
      "employeeId",
      "name"
    );

    res.status(200).json(attendanceRecords);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// edit attendance record
const updateAttendance = async (req, res) => {
  try {
    const { checkIn, checkOut } = req.body;

    if (!checkIn || !checkOut) {
      return res
        .status(400)
        .json({ message: "checkIn and checkOut are required" });
    }

    const attendance = await AttendanceModel.findById(req.params.id);
    if (!attendance) {
      return res.status(404).json({ message: "Attendance record not found" });
    }

    const employee = await EmployeeModel.findById(attendance.employeeId);
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    const date = dayjs(attendance.date).format("YYYY-MM-DD");

    const officialCheckIn = `${date} ${employee.checkIn}`;
    const officialCheckOut = `${date} ${employee.checkOut}`;
    const updatedCheckIn = `${date} ${checkIn}`;
    const updatedCheckOut = `${date} ${checkOut}`;

    const lateMinutes = Math.max(
      0,
      dayjs(updatedCheckIn).diff(dayjs(officialCheckIn), "minute")
    );
    const overtimeMinutes = Math.max(
      0,
      dayjs(updatedCheckOut).diff(dayjs(officialCheckOut), "minute")
    );
    const totalHours =
      dayjs(updatedCheckOut).diff(dayjs(updatedCheckIn), "minute") / 60;

    if ([lateMinutes, overtimeMinutes, totalHours].some(isNaN)) {
      return res.status(400).json({ message: "Invalid date or time format" });
    }

    attendance.checkIn = checkIn;
    attendance.checkOut = checkOut;
    attendance.totalHours = totalHours;
    attendance.lateMinutes = lateMinutes;
    attendance.overtimeMinutes = overtimeMinutes;

    await attendance.save();

    res.status(200).json({ message: "Attendance updated", data: attendance });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// delete attendance record
const deleteAttendance = async (req, res) => {
  try {
    const attendance = await AttendanceModel.findById(req.params.id);
    if (!attendance) {
      return res.status(404).json({ message: "Attendance not found" });
    }

    // Delete related salary adjustments for this attendance
    await SalaryAdjustments.deleteMany({
      employeeId: attendance.employeeId,
      date: {
        $gte: dayjs(attendance.date).startOf("day").toDate(),
        $lte: dayjs(attendance.date).endOf("day").toDate(),
      },
    });

    await AttendanceModel.findByIdAndDelete(req.params.id);

    res
      .status(200)
      .json({ message: "Attendance and related salary adjustments deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  createAttendance,
  getAttendance,
  updateAttendance,
  deleteAttendance,
};
