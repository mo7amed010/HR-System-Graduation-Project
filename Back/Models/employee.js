const mongoose = require("mongoose");

const employeeSechma = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Full name is required"],
      minLength: [10, "Full name must be at least 10 characters"],
      maxLength: [35, "Full name must be at most 35 characters"],
    },
    address: {
      type: String,
      required: [true, "Address is required"],
      minLength: [10, "Address must be at least 10 characters"],
    },
    phone: {
      type: String,
      required: [true, "Phone is required"],
      unique: [true, "phone is not unique"],
      minLength: [11, "phone must be 11 numbers"],
      maxLength: [11, "phone must be 11 numbers"],
    },
    gender: {
      type: String,
      enum: ["user", "seller"],
      required: [true, "Gender is required"],
    },
    nationality: {
      type: String,
      required: [true, "Nationality is required"],
      minLength: [3, "Nationality must be at least 3 characters"],
    },
    dob: {
      type: Date,
      required: [true, "Date of birth is required"],
    },
    ssn: {
      type: String,
      required: [true, "SSN is required"],
      unique: [true, "SSN is not unique"],
      minLength: [14, "SSN must be 14 numbers"],
      maxLength: [14, "SSN must be 14 numbers"],
    },
    hiredDate: {
      type: Date,
      required: [true, "Hired date is required"],
    },
    department: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "department",
      required: [true, "Department is required"],
    },
    salary: {
      type: Number,
      required: [true, "Salary is required"],
    },
    checkIn: {
      type: Date,
      required: [true, "Clock in is required"],
    },
    checkOut: {
      type: Date,
      required: [true, "Clock out is required"],
    },
  },
  { timestamps: true }
);

const employeeModel = mongoose.model("employee", employeeSechma);
module.exports = employeeModel;
