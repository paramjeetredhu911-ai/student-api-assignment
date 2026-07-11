const express = require('express');
const jwt = require('jsonwebtoken');
const app = express();
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET || 'yoursecretkey';

// Mock in-memory database storage
let studentsInMemory = [];
let coursesInMemory = [];

// PROTECT MIDDLEWARE
const protect = (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token) {
    return res.status(401).json({ success: false, message: "No token provided." });
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // Contains student payload like userId or id
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: "Invalid token." });
  }
};

// --- AUTH ENDPOINTS ---
app.post('/api/auth/signup', (req, res) => {
  const { name, email, phone, course, password } = req.body;
  const id = Date.now().toString(); // Simulating ObjectId string
  const token = jwt.sign({ id, name, email }, JWT_SECRET, { expiresIn: '7d' });
  const newStudent = { id, name, email, phone, course };
  studentsInMemory.push(newStudent);
  res.status(201).json({ name, email, token });
});

// --- TASK #3 COURSE ROUTES (Registered at /api/courses) ---

// 1. POST /api/courses (Protected)
app.post('/api/courses', protect, (req, res) => {
  const { title, description, duration, instructor } = req.body;
  if (!title || !description || !duration || !instructor) {
    return res.status(400).json({ error: "All course fields are required" });
  }
  
  const newCourse = {
    id: (coursesInMemory.length + 1).toString(),
    title,
    description,
    duration,
    instructor,
    students: [] // empty enrollment array initially
  };
  
  coursesInMemory.push(newCourse);
  res.status(201).json(newCourse);
});

// 2. GET /api/courses (Public - Simulating populated student fields)
app.get('/api/courses', (req, res) => {
  // Simulates returning only the name and email of each enrolled student
  const populatedCourses = coursesInMemory.map(course => {
    const fullStudents = course.students.map(studentId => {
      const studentObj = studentsInMemory.find(s => s.id === studentId) || {};
      return { name: studentObj.name || "Test Student", email: studentObj.email || "test@email.com" };
    });
    return { ...course, students: fullStudents };
  });

  res.status(200).json(populatedCourses);
});

// 3. POST /api/courses/:id/enroll (Protected)
app.post('/api/courses/:id/enroll', protect, (req, res) => {
  const course = coursesInMemory.find(c => c.id === req.params.id);
  if (!course) {
    return res.status(404).json({ error: "Course not found" });
  }

  // Task Requirement: Get student ID from decoded token payload
  const studentId = req.user.id;

  // Task Requirement: Check if student is already enrolled (Return 409 Conflict)
  if (course.students.includes(studentId)) {
    return res.status(409).json({ success: false, message: "You are already enrolled in this course." });
  }

  // Push student and save
  course.students.push(studentId);

  // Task Requirement: Return success message with total count
  res.status(200).json({
    success: true,
    message: "Enrolled successfully!",
    totalStudentsEnrolled: course.students.length
  });
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
