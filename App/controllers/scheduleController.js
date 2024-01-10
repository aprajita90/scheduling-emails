const Schedule = require('../models/scheduleSchema');
const mongoose = require('mongoose')


exports.createSchedule = async (req, res) => {
    try {
        const { email, subject, body, scheduledAt } = req.body;
        const newSchedule = new Schedule({ email, subject, body, scheduledAt });
        await newSchedule.save();
    
        res.status(201).json(newSchedule);
      } catch (error) {
        console.error('Error scheduling email:', error);
        res.status(500).send('Internal Server Error');
      }
}

exports.getSchedules = async (req, res) => {
    try {
        const schedules = await Schedule.find();
        res.json(schedules);
      } catch (error) {
        console.error('Error retrieving schedules:', error);
        res.status(500).send('Internal Server Error');
      }
}

exports.getIndividualSchedule = async (req, res) => {
    try {
        const scheduleId = req.params.id;
        if (!mongoose.Types.ObjectId.isValid(scheduleId)) {
          return res.status(400).send('Invalid Schedule ID');
        }
    
        const schedule = await Schedule.findById(scheduleId);
        if (!schedule) {
          return res.status(404).send('Schedule not found');
        }
    
        res.json(schedule);
      } catch (error) {
        console.error('Error retrieving schedule:', error);
        res.status(500).send('Internal Server Error');
      }
}

exports.updateIndividualSchedule = async (req, res) => {
    try {
        const updatedSchedule = await Schedule.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedSchedule) {
          return res.status(404).send('Schedule not found');
        }
        res.json(updatedSchedule);
      } catch (error) {
        console.error('Error updating schedule:', error);
        res.status(500).send('Internal Server Error');
      }
}

exports.deleteIndividualSchedule = async (req, res) => {
    try {
        const deletedSchedule = await Schedule.findByIdAndDelete(req.params.id);
        if (!deletedSchedule) {
          return res.status(404).send('Schedule not found');
        }
        res.json(deletedSchedule);
      } catch (error) {
        console.error('Error deleting schedule:', error);
        res.status(500).send('Internal Server Error');
      }
}

exports.faildSchedules = async (req, res) => {
    try {
        const failedSchedules = await Schedule.find({ sent: false });
        res.json(failedSchedules);
      } catch (error) {
        console.error('Error retrieving failed schedules:', error);
        res.status(500).send('Internal Server Error');
      }
}