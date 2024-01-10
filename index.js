const express = require('express');
const mongoose = require('./configs/database');
const cron = require('node-cron');
const sgMail = require('@sendgrid/mail');
const scheduleRoute = require('./App/routes/scheduleRoute')
const Schedule = require('./App/models/scheduleSchema');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

const db = mongoose;
// db.on('error', console.error.bind(console, 'MongoDB connection error:'));

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
app.use('/api', scheduleRoute);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
