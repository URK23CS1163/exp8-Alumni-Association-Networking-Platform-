const mongoose = require('mongoose');

const recordSchema = new mongoose.Schema({
  title: { type: String, required: true },
  note: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Record', recordSchema);
