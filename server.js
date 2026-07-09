const express = require('express');
const app = express();
app.use(express.json());

let students = [
  { id: "1", name: "Paramjeet", email: "param@example.com", phone: "1234567890", course: "Frontend Development" }
];

// --- EXISTING CRUD ROUTES ---
app.post('/api/students', (req, res, next) => {
  try {
    const { name, email, phone, course } = req.body;
    if (!name || !email || !phone || !course) {
      return res.status(400).json({ error: "All fields are required" });
    }
    const newStudent = { id: Date.now().toString(), name, email, phone, course };
    students.push(newStudent);
    res.status(201).json(newStudent);
  } catch (err) {
    next(err); // Passes errors straight to our custom error handler below
  }
});

app.get('/api/students', (req, res) => {
  const { course } = req.query;
  if (course) {
    const filteredStudents = students.filter(s => s.course.toLowerCase() === course.toLowerCase());
    return res.status(200).json(filteredStudents);
  }
  res.status(200).json(students);
});

app.get('/api/students/:id', (req, res) => {
  const student = students.find(s => s.id === req.params.id);
  if (!student) return res.status(404).json({ error: "Student not found" });
  res.status(200).json(student);
});

app.patch('/api/students/:id', (req, res) => {
  const student = students.find(s => s.id === req.params.id);
  if (!student) return res.status(404).json({ error: "Student not found" });
  
  if (req.body.name) student.name = req.body.name;
  if (req.body.email) student.email = req.body.email;
  if (req.body.phone) student.phone = req.body.phone;
  if (req.body.course) student.course = req.body.course;

  res.status(200).json(student);
});

app.delete('/api/students/:id', (req, res) => {
  const index = students.findIndex(s => s.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: "Student not found" });
  
  students.splice(index, 1);
  res.status(200).json({ message: "Student deleted successfully" });
});


// --- TASK #3 REQUIREMENT 1: 404 NOT FOUND MIDDLEWARE ---
// This handles requests to completely unknown routes
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: "Route not found"
  });
});


// --- TASK #3 REQUIREMENT 2: GLOBAL ERROR HANDLER ---
// Must contain exactly four parameters (err, req, res, next)
app.use((err, req, res, next) => {
  // Case A: ValidationError
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      message: err.message || "Validation failed"
    });
  }

  // Case B: Duplicate Key Error (code 11000)
  if (err.code === 11000) {
    return res.status(409).json({
      success: false,
      message: "Email already exists."
    });
  }

  // Case C: Standard fallback server error
  res.status(500).json({
    success: false,
    message: err.message || "Internal Server Error"
  });
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
