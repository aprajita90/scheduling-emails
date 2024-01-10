const express = require('express');
const scheduleController = require('../controllers/scheduleController');

const router = express.Router();

router.post('/schedule', scheduleController.createSchedule);
router.get('/schedules', scheduleController.getSchedules)
router.get('/schedule/:id', scheduleController.getIndividualSchedule)
router.put('/schedule/:id', scheduleController.updateIndividualSchedule)
router.delete('/schedule/:id', scheduleController.deleteIndividualSchedule)
router.get('/failed-schedules', scheduleController.faildSchedules)



module.exports = router;