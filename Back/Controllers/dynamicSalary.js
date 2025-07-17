const mongoose = require("mongoose");
const Employee = require("../Models/employee");
const Attendance = require("../Models/attendance");
const Adjustment = require("../Models/salaryAdjustments");
const WeeklyHoliday = require("../Models/weeklyHolidays");
const OfficialHoliday = require("../Models/officialHolidays");
const GeneralSetting = require("../Models/GeneralSitting");
const { CatchAsync } = require("../Utils/CatchAsync");

const calculateDynamicPayroll = CatchAsync(async (req, res, next) => {
  const { year, month, name } = req.query;

  const selectedYear = year ? parseInt(year) : new Date().getFullYear();
  const selectedMonth = month ? parseInt(month) - 1 : new Date().getMonth();

  if (year && isNaN(parseInt(year))) {
    return res.status(400).json({ message: "السنة غير صالحة" });
  }
  if (month && isNaN(parseInt(month))) {
    return res.status(400).json({ message: "الشهر غير صالح" });
  }
  if (selectedMonth < 0 || selectedMonth > 11) {
    return res.status(400).json({ message: "الشهر غير صحيح" });
  }

  const start = new Date(selectedYear, selectedMonth, 1);
  const end = new Date(selectedYear, selectedMonth + 1, 0);
  end.setHours(23, 59, 59, 999);

  const employees = await Employee.find(
    name ? { name: { $regex: name, $options: "i" } } : {}
  );

  if (name && employees.length === 0) {
    return res.status(404).json({
      message: "لا يوجد موظف بهذا الاسم.",
    });
  }

  const weeklyHolidays = await WeeklyHoliday.find().lean();
  const officialHolidays = await OfficialHoliday.find({
    date: { $gte: start, $lte: end },
  }).lean();

  const officialHolidayDates = officialHolidays.map(
    (h) => h.date.toISOString().split("T")[0]
  );
  const weeklyOffDays = weeklyHolidays.map((h) => h.name.toLowerCase());

  let totalNetSalary = 0;

  const payrollData = await Promise.all(
    employees.map(async (emp) => {
      const baseSalary = emp.salary || 0;
      const dailyRate = baseSalary / 22;

      const attendances = await Attendance.find({
        employeeId: emp._id,
        date: { $gte: start, $lte: end },
      });

      const adjustments = await Adjustment.find({
        employeeId: emp._id,
        date: { $gte: start, $lte: end },
      });

      let totalAdditions = 0;
      let totalDeductions = 0;

      adjustments.forEach((adj) => {
        if (adj.type === "addition") totalAdditions += adj.amount;
        else if (adj.type === "deduction") totalDeductions += adj.amount;
      });

      const totalDays = [];
      for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
        const day = new Date(d);
        const iso = day.toISOString().split("T")[0];
        const isWeekend = weeklyOffDays.includes(
          day.toLocaleString("en-US", { weekday: "long" }).toLowerCase()
        );
        const isHoliday = officialHolidayDates.includes(iso);
        if (!isWeekend && !isHoliday) totalDays.push(iso);
      }

      const attendedDates = attendances.map(
        (a) => a.date.toISOString().split("T")[0]
      );
      const attendedDays = totalDays.filter((d) =>
        attendedDates.includes(d)
      ).length;

      const earnedSoFar = attendedDays * dailyRate;
      const netSalary = earnedSoFar + totalAdditions - totalDeductions;

      totalNetSalary += netSalary;

      return {
        employee: {
          id: emp._id,
          name: emp.name,
        },
        period: `${start.toISOString().split("T")[0]} to ${
          end.toISOString().split("T")[0]
        }`,
        workingDays: totalDays.length,
        attendedDays,
        baseSalary,
        dailyRate: dailyRate.toFixed(2),
        earnedSoFar: earnedSoFar.toFixed(2),
        totalAdditions: totalAdditions.toFixed(2),
        totalDeductions: totalDeductions.toFixed(2),
        netSalary: netSalary.toFixed(2),
      };
    })
  );

  const hasData = payrollData.some(
    (e) =>
      e.attendedDays > 0 ||
      parseFloat(e.totalAdditions) > 0 ||
      parseFloat(e.totalDeductions) > 0
  );

  if (!hasData) {
    return res.status(404).json({
      message: "لا توجد نتائج لهذا الشهر.",
    });
  }

  res.status(200).json({
    totalEmployees: employees.length,
    totalNetSalary: totalNetSalary.toFixed(2),
    employeesPayroll: payrollData,
  });
});

module.exports = {
  calculateDynamicPayroll,
};
