const mongoose = require("mongoose");
const Department = require("../Models/department");
const Employee = require("../Models/employee");
const WeeklyHoliday = require("../Models/GeneralSitting");
const OfficialHoliday = require("../Models/officialHolidays");
const Attendance = require("../Models/attendance");
const SalaryAdjustments = require("../Models/salaryAdjustments");

const dayjs = require("dayjs");

mongoose
  .connect("mongodb://localhost:27017/HR") // choose your db name
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("DB Connection Error:", err));

// Main function
async function seedData() {
  try {
    //  Delete old data
    await Department.deleteMany();
    await Employee.deleteMany();
    await WeeklyHoliday.deleteMany();
    await OfficialHoliday.deleteMany();
    await Attendance.deleteMany();
    await SalaryAdjustments.deleteMany();

    //  Add departments
    const departments = await Department.insertMany([
      { name: "IT" },
      { name: "HR" },
    ]);

    // Weekly settings
    await WeeklyHoliday.create({
      method: "money",
      add: 25,
      deduct: 20,
      offDay1: "Friday",
      offDay2: "Saturday",
    });

    //  Official holidays
    await OfficialHoliday.insertMany([
      { name: "Eid Fitr", date: new Date("2025-04-01") },
      { name: "Eid Adha", date: new Date("2025-06-16") },
      { name: "July Revolution", date: new Date("2025-07-23") },
    ]);

    //  Add employees
    const employees = await Employee.insertMany([
      {
        name: "Fatma Ali",
        address: "Cairo Egypt",
        phone: "01012345678",
        gender: "female",
        nationality: "Egyptian",
        dob: new Date("1998-01-01"),
        ssn: "12345678901234",
        hiredDate: new Date("2024-01-01"),
        department: departments[0]._id,
        salary: 6000,
        jobTitle: "Frontend Developer",
        checkIn: "09:00",
        checkOut: "17:00",
      },
      {
        name: "Omar Said",
        address: "Alexandria Egypt",
        phone: "01098765432",
        gender: "male",
        nationality: "Egyptian",
        dob: new Date("1995-04-15"),
        ssn: "98765432109876",
        hiredDate: new Date("2023-11-10"),
        department: departments[1]._id,
        salary: 7000,
        jobTitle: "HR Specialist",
        checkIn: "09:00",
        checkOut: "17:00",
      },
    ]);

    // Attendance for a specific day
    const date = new Date("2025-06-28");

    await Attendance.create([
      {
        employeeId: employees[0]._id,
        date: date,
        checkIn: "09:10",
        checkOut: "18:00",
        totalHours: 8.83,
        lateMinutes: 10,
        overtimeMinutes: 60,
      },
      {
        employeeId: employees[1]._id,
        date: date,
        checkIn: "09:00",
        checkOut: "17:00",
        totalHours: 8,
        lateMinutes: 0,
        overtimeMinutes: 0,
      },
    ]);

    // Salary adjustments
    await SalaryAdjustments.create([
      {
        employeeId: employees[0]._id,
        date: date,
        type: "deduction",
        amount: (10 / 60) * 20,
        reason: "Late arrival",
      },
      {
        employeeId: employees[0]._id,
        date: date,
        type: "addition",
        amount: (60 / 60) * 25,
        reason: "Overtime",
      },
    ]);

    console.log("Static data inserted successfully.");
    process.exit();
  } catch (err) {
    console.error("Error while inserting:", err.message);
    process.exit(1);
  }
}

seedData();
