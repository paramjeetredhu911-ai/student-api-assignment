const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  duration: { type: String, required: true }, // e.g., '15 days'
  instructor: { type: String, required: true },
  // Task Requirement: Array of ObjectIds referencing Student
  students: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Student' }]
});

module.exports = mongoose.model('Course', CourseSchema);
