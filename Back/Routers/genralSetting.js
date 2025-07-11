const express = require("express");
const router = express.Router();
// const { auth } = require("../Middlewares/auth");
const { validation } = require("../Middlewares/validation");
const {updateAll,getAll } = require("../Controllers/generalSettingController");
const settingValidation = require("../Validation/generalSetting");

// router.use(auth);
 
router.put("/", validation(settingValidation), updateAll);
router.get("/", getAll);
module.exports = router;