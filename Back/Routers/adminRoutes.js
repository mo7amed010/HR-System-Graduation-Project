const express = require("express");
const adminController = require("../Controllers/adminController");
const { validateAdmin, validateAdminUpdate } = require("../Validation/admin");

const router = express.Router();

router.post("/", validateAdmin, adminController.addAdmin);
router.get("/", adminController.getAllAdmins);
router.get("/search", adminController.searchAdmins);
router.get("/:id", adminController.getAdminById);
router.patch("/:id", validateAdminUpdate, adminController.updateAdmin);
router.delete("/:id", adminController.deleteAdmin);

module.exports = router; 