const express = require("express");
const { calculateDynamicPayroll } = require("../Controllers/dynamicSalary");

const router = express.Router();

router.get("/", calculateDynamicPayroll);

module.exports = router;
