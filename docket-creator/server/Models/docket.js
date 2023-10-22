const mongoose = require('mongoose');

const docketSchema = new mongoose.Schema({
  name: String,
  startTime: String,
  endTime: String,
  hoursWorked: Number,
  ratePerHour: Number,
  poNumber: String,
  supplier: String,
});

const Docket = mongoose.model('Docket', docketSchema);

module.exports = Docket;