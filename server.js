const express = require('express');
const jwt = require('jsonwebtoken');
const app = express();
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET || 'yoursecretkey';

// In-memory array fallback database
let studentsInMemory = [];

// --- TASK #2 REQUIREMENT: PROTECT MIDDLEWARE ---
const protect = (req, res, next) => {
  let token;

  // 1. Check if the header is missing or does not start with Bearer
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    // 2. Extract the token by splitting on the space and taking the second part
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ 
      success: false, 
      message: "No token provided. Please log in." 
    });
  }

  try {
    // 3. Verify token with JWT_SECRET
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // 4. Set req.user to the decoded payload and call next()
    req.user = decoded;
    next();
  } catch (error) {
    // 5. If verification fails return 401
    return res.status(401).json({ 
      success: false, 
      message: "Invalid token. Please log in again." 
    });
  }
};

// --- TASK #1 AUTH ROUTES ---
app.post('/api/auth/signup', (req, res) => {
  const { name, email, phone, course, password } = req.body;
  if (!name || !email || !phone || !course || !password) {
    return res.status(400).json({ error: "All fields are required" });
  }
  
  // Create a real token with payload
  const token = jwt.sign({ name, email }, JWT_SECRET, { expiresIn: '7d' });
  const newStudent = { id: Date.now().toString(), name, email, phone, course, token };
  studentsInMemory.push(newStudent);
  
  res.status(201).json({ name, email, token });
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  const student = studentsInMemory.find(s => s.email === email);
  if (!student) {
    return res.status(401).json({ success: false, message: "Invalid email or password" });
  }
  res.status(200).json({ token: student.token });
});

// --- SECURED STUDENT ROUTES (Protected with the middleware) ---
// Note the 'protect' argument inserted before the route handler
app.get('/api/students', protect, (req, res) => {
  res.status(200).json(studentsInMemory);
});

app.post('/api/students', protect, (req, res) => {
  const { name, email, phone, course } = req.body;
  const newStudent = { id: Date.now().toString(), name, email, phone, course };
  studentsInMemory.push(newStudent);
  res.status(201).json(newStudent);
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
