const express = require("express");
const router = express.Router();
const { auth } = require("../Middlewares/auth");
const { validation } = require("../Middlewares/validation");
const {
  addEmployee,
  updateEmployee,
  deleteEmployee,
  getAll,
  getById,
} = require("../Controllers/employeeControllers");
const employeeValidation = require("../Validation/employee");

router.use(auth);
router.get("/", getAll);
router.get("/:id", getById);
router.post("/add", validation(employeeValidation), addEmployee);
router.put("/:id", validation(employeeValidation), updateEmployee);
router.delete("/:id", deleteEmployee);
module.exports = router;
