const express = require('express');
const router = express.Router();
const adminController = require('../Controllers/adminController');
const validateAdmin = require('../Validation/admin');

// POST /add-admin
router.post('/add-admin', validateAdmin, adminController.addAdmin);

module.exports = router;
