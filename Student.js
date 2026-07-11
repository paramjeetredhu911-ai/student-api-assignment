const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const StudentSchema = new mongoose.Schema({
  name: { type: String, required: true, minlength: 2 },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true, match: /^\d{10}$/ },
  course: { type: String, required: true, enum: ['Frontend Development', 'Backend Development', 'Full Stack Development'] },
  // Task Requirement: Password field hidden by default (select: false)
  password: { type: String, required: true, minlength: 6, select: false }
});

// Task Requirement: Pre-save hook to hash password
StudentSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Task Requirement: Instance method to compare password
StudentSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Task Requirement: Instance method to generate JWT token
StudentSchema.methods.generateToken = function () {
  return jwt.sign(
    { id: this._id }, 
    process.env.JWT_SECRET || 'yoursecretkey', 
    { expiresIn: '7d' }
  );
};

module.exports = mongoose.model('Student', StudentSchema);
