const express = require('express');
const router = express.Router();
const holidayController = require('../Controllers/holidayController');
const { auth } = require('../Middlewares/auth');
const { validation } = require('../Middlewares/validation');
const officialHolidays = require('../Validation/officialHolidays');
const { CatchAsync } = require('../Utils/CatchAsync');


router.post('/', auth, validation(officialHolidays),CatchAsync(holidayController.createHoliday));
router.get('/', auth,CatchAsync( holidayController.getHolidays));
router.get('/:id', auth,CatchAsync( holidayController.getHolidayById)); 
router.put('/:id', auth, validation(officialHolidays),CatchAsync(holidayController.updateHoliday));
router.delete('/:id', auth,CatchAsync(holidayController.deleteHoliday));

module.exports = router;