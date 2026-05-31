const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mysql = require('mysql2/promise');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// MySQL Connection Pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'mysql',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'password123',
  database: process.env.DB_NAME || 'student_registration',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Initialize Database
async function initializeDatabase() {
  try {
    const connection = await pool.getConnection();
    
    // Create database if it doesn't exist
    await connection.query(`CREATE DATABASE IF NOT EXISTS student_registration`);
    
    // Use the database
    await connection.changeUser({ database: 'student_registration' });
    
    // Create students table
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS students (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) NOT NULL UNIQUE,
        phone VARCHAR(15) NOT NULL,
        dateOfBirth DATE NOT NULL,
        gender VARCHAR(10) NOT NULL,
        address VARCHAR(255) NOT NULL,
        city VARCHAR(50) NOT NULL,
        state VARCHAR(50) NOT NULL,
        zipCode VARCHAR(10) NOT NULL,
        enrollmentDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `;
    
    await connection.query(createTableQuery);
    connection.release();
    console.log('Database initialized successfully!');
  } catch (error) {
    console.error('Database initialization error:', error);
    process.exit(1);
  }
}

// Routes

// Get all students
app.get('/api/students', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [students] = await connection.query('SELECT * FROM students ORDER BY enrollmentDate DESC');
    connection.release();
    res.json(students);
  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).json({ error: 'Failed to fetch students' });
  }
});

// Get student by ID
app.get('/api/students/:id', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [student] = await connection.query('SELECT * FROM students WHERE id = ?', [req.params.id]);
    connection.release();
    
    if (student.length === 0) {
      return res.status(404).json({ error: 'Student not found' });
    }
    res.json(student[0]);
  } catch (error) {
    console.error('Error fetching student:', error);
    res.status(500).json({ error: 'Failed to fetch student' });
  }
});

// Create new student
app.post('/api/students', async (req, res) => {
  try {
    const { name, email, phone, dateOfBirth, gender, address, city, state, zipCode } = req.body;
    
    if (!name || !email || !phone || !dateOfBirth || !gender || !address || !city || !state || !zipCode) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    
    const connection = await pool.getConnection();
    const [result] = await connection.query(
      'INSERT INTO students (name, email, phone, dateOfBirth, gender, address, city, state, zipCode) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [name, email, phone, dateOfBirth, gender, address, city, state, zipCode]
    );
    connection.release();
    
    res.status(201).json({ 
      message: 'Student registered successfully', 
      studentId: result.insertId 
    });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: 'Email already exists' });
    }
    console.error('Error creating student:', error);
    res.status(500).json({ error: 'Failed to register student' });
  }
});

// Update student
app.put('/api/students/:id', async (req, res) => {
  try {
    const { name, email, phone, dateOfBirth, gender, address, city, state, zipCode } = req.body;
    
    const connection = await pool.getConnection();
    const [result] = await connection.query(
      'UPDATE students SET name = ?, email = ?, phone = ?, dateOfBirth = ?, gender = ?, address = ?, city = ?, state = ?, zipCode = ? WHERE id = ?',
      [name, email, phone, dateOfBirth, gender, address, city, state, zipCode, req.params.id]
    );
    connection.release();
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Student not found' });
    }
    
    res.json({ message: 'Student updated successfully' });
  } catch (error) {
    console.error('Error updating student:', error);
    res.status(500).json({ error: 'Failed to update student' });
  }
});

// Delete student
app.delete('/api/students/:id', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [result] = await connection.query('DELETE FROM students WHERE id = ?', [req.params.id]);
    connection.release();
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Student not found' });
    }
    
    res.json({ message: 'Student deleted successfully' });
  } catch (error) {
    console.error('Error deleting student:', error);
    res.status(500).json({ error: 'Failed to delete student' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running' });
});

// Start server
const PORT = process.env.PORT || 5000;

initializeDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}).catch(error => {
  console.error('Failed to start server:', error);
  process.exit(1);
});
