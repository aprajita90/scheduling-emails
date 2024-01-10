const express = require('express');
const mongoose = require('mongoose');
const cron = require('node-cron');
const sgMail = require('@sendgrid/mail');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

mongoose.connect('mongodb://localhost:27017/emailScheduler', { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));

const scheduleSchema = new mongoose.Schema({
  email: String,
  subject: String,
  body: String,
  scheduledAt: Date,
  sent: { type: Boolean, default: false },
});

const Schedule = mongoose.model('Schedule', scheduleSchema);

sgMail.setApiKey('YOUR_SENDGRID_API_KEY');

cron.schedule('* * * * *', async () => {
  const now = new Date();
  const schedules = await Schedule.find({ scheduledAt: { $lte: now }, sent: false });

  schedules.forEach(async (schedule) => {
    try {
      await sgMail.send({
        to: schedule.email,
        from: 'your@example.com',
        subject: schedule.subject,
        text: schedule.body,
      });

      await Schedule.findByIdAndUpdate(schedule._id, { sent: true });
    } catch (error) {
      console.error('Error sending email:', error);
    }
  });
});

app.post('/schedule', async (req, res) => {
  try {
    const { email, subject, body, scheduledAt } = req.body;
    const newSchedule = new Schedule({ email, subject, body, scheduledAt });
    await newSchedule.save();

    res.status(201).json(newSchedule);
  } catch (error) {
    console.error('Error scheduling email:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/schedules', async (req, res) => {
  try {
    const schedules = await Schedule.find();
    res.json(schedules);
  } catch (error) {
    console.error('Error retrieving schedules:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/schedule/:id', async (req, res) => {
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
  });
  
  app.put('/schedule/:id', async (req, res) => {
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
  });
  
  app.delete('/schedule/:id', async (req, res) => {
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
  });
  
  app.get('/failed-schedules', async (req, res) => {
    try {
      const failedSchedules = await Schedule.find({ sent: false });
      res.json(failedSchedules);
    } catch (error) {
      console.error('Error retrieving failed schedules:', error);
      res.status(500).send('Internal Server Error');
    }
  });
  

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
