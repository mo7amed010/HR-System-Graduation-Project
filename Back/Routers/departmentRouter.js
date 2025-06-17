
const express = require("express");

const { validation } = require("../Middlewares/validation"); // 1
const { create } = require("../Validation/departmentValidation"); // 2

const {
  getAllDepartments,
  getDepartment,
  createDepartment,
  updateDepartment,
  deleteDepartment,
} = require("../Controllers/departmentController");

const router = express.Router();

router.route("/")
  .get(getAllDepartments)
  .post(validation(create), createDepartment); // 3

router.route("/:id")
  .get(getDepartment)
  .put(updateDepartment)
  .delete(deleteDepartment);

module.exports = router;
