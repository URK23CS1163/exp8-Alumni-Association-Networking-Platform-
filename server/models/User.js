const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  verified: { type: Boolean, default: false },
  verifyToken: { type: String },
  resetToken: { type: String },
  resetTokenExpires: { type: Date },
  graduationYear: Number,
  department: String,
  currentCompany: String,
  location: String,
  skills: [String],
  role: { type: String, enum: ['alumni','admin'], default: 'alumni' },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
