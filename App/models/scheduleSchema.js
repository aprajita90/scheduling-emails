const mongoose = require('mongoose');

const scheduleSchema = new mongoose.Schema({
    email: String,
    subject: String,
    body: String,
    scheduledAt: Date,
    sent: { type: Boolean, default: false },
});

const Schedule = mongoose.model('Schedule', scheduleSchema);

module.exports = Schedule