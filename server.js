const express = require('express');
const app = express();
app.use(express.json());

// In-memory array acting as our database fallback
let students = [
  { id: "1", name: "Paramjeet", email: "param@example.com", phone: "1234567890", course: "Frontend Development" }
];

// 1. POST /api/students (Create student)
app.post('/api/students', (req, res) => {
  const { name, email, phone, course } = req.body;
  if (!name || !email || !phone || !course) {
    return res.status(400).json({ error: "All fields are required" });
  }
  const newStudent = { id: Date.now().toString(), name, email, phone, course };
  students.push(newStudent);
  res.status(201).json(newStudent);
});

// 2. GET /api/students (Get all students with optional course filtering)
app.get('/api/students', (req, res) => {
  const { course } = req.query;
  if (course) {
    const filteredStudents = students.filter(s => s.course.toLowerCase() === course.toLowerCase());
    return res.status(200).json(filteredStudents);
  }
  res.status(200).json(students);
});

// 3. GET /api/students/:id (Get single student)
app.get('/api/students/:id', (req, res) => {
  const student = students.find(s => s.id === req.params.id);
  if (!student) return res.status(404).json({ error: "Student not found" });
  res.status(200).json(student);
});

// 4. PATCH /api/students/:id (Update student partially)
app.patch('/api/students/:id', (req, res) => {
  const student = students.find(s => s.id === req.params.id);
  if (!student) return res.status(404).json({ error: "Student not found" });
  
  if (req.body.name) student.name = req.body.name;
  if (req.body.email) student.email = req.body.email;
  if (req.body.phone) student.phone = req.body.phone;
  if (req.body.course) student.course = req.body.course;

  res.status(200).json(student);
});

// 5. DELETE /api/students/:id (Delete student)
app.delete('/api/students/:id', (req, res) => {
  const index = students.findIndex(s => s.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: "Student not found" });
  
  students.splice(index, 1);
  res.status(200).json({ message: "Student deleted successfully" });
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
