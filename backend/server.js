const express = require("express");
const cors = require("cors");
require("dotenv").config();
const pool = require("./db");

// Import models
const Student = require("./models/students");
const Faculty = require("./models/faculty");
const Attendance = require("./models/attendance");
const Course = require("./models/courses");
const Result = require("./models/results");
const Schedule = require("./models/schedules");
const TeachingAssignment = require("./models/teachingAssignments");
const Admin = require("./models/admins");

const app = express();
const PORT = process.env.BACKEND_PORT || 3002;

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", message: "Backend is running" });
});

// Student routes
app.get("/api/students", async (req, res) => {
  try {
    const students = await Student.findAll();
    res.json(students);
  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).json({ error: "Failed to fetch students" });
  }
});

app.get("/api/students/:id", async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ error: "Student not found" });
    res.json(student);
  } catch (error) {
    console.error('Error fetching student:', error);
    res.status(500).json({ error: "Failed to fetch student" });
  }
});

app.get("/api/students/:id/schedule", async (req, res) => {
  try {
    const schedule = await Schedule.findByStudentId(req.params.id);
    res.json(schedule);
  } catch (error) {
    console.error('Error fetching schedule:', error);
    res.status(500).json({ error: "Failed to fetch schedule" });
  }
});

// Faculty routes
app.get("/api/faculty", async (req, res) => {
  try {
    const faculty = await Faculty.findAll();
    res.json(faculty);
  } catch (error) {
    console.error('Error fetching faculty:', error);
    res.status(500).json({ error: "Failed to fetch faculty" });
  }
});

app.get("/api/faculty/:id", async (req, res) => {
  try {
    const faculty = await Faculty.findById(req.params.id);
    if (!faculty)
      return res.status(404).json({ error: "Faculty member not found" });
    res.json(faculty);
  } catch (error) {
    console.error('Error fetching faculty:', error);
    res.status(500).json({ error: "Failed to fetch faculty member" });
  }
});

// Authentication
app.post("/api/login", async (req, res) => {
  try {
    const { email, role } = req.body;
    let user;
    if (role === "student") {
      user = await Student.findByEmail(email);
    } else if (role === "faculty") {
      user = await Faculty.findByEmail(email);
    } else if (role === "admin") {
      user = await Admin.findByEmail(email);
    }
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    res.json({
      success: true,
      user: { id: user.id, name: user.name, email: user.email, role },
    });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ error: "Login failed" });
  }
});

// Additional routes for results and attendance
app.get("/api/students/:id/attendance", async (req, res) => {
  try {
    const { courseId } = req.query;
    const attendance = await Attendance.findByStudentAndCourse(req.params.id, courseId);
    res.json(attendance);
  } catch (error) {
    console.error('Error fetching attendance:', error);
    res.status(500).json({ error: "Failed to fetch attendance" });
  }
});

app.get("/api/students/:id/results", async (req, res) => {
  try {
    const results = await Result.findByStudentId(req.params.id);
    res.json(results);
  } catch (error) {
    console.error('Error fetching results:', error);
    res.status(500).json({ error: "Failed to fetch results" });
  }
});

// Faculty teaching assignments
app.get("/api/faculty/:id/teaching", async (req, res) => {
  try {
    const assignments = await TeachingAssignment.findByFacultyId(req.params.id);
    res.json(assignments);
  } catch (error) {
    console.error('Error fetching teaching assignments:', error);
    res.status(500).json({ error: "Failed to fetch teaching assignments" });
  }
});

// Course routes
app.get("/api/courses", async (req, res) => {
  try {
    const courses = await Course.findAll();
    res.json(courses);
  } catch (error) {
    console.error('Error fetching courses:', error);
    res.status(500).json({ error: "Failed to fetch courses" });
  }
});

// Admin routes for students
app.post("/api/students", async (req, res) => {
  try {
    const studentData = req.body;
    
    // Validate required fields
    if (!studentData.name || !studentData.email) {
      return res.status(400).json({ error: "Name and email are required" });
    }
    
    const result = await Student.create(studentData);
    res.json({ success: true, data: result });
  } catch (error) {
    console.error('Error creating student:', error);
    
    // Provide more detailed error message
    let errorMessage = "Failed to create student";
    if (error.code === '23505') { // Unique violation
      errorMessage = error.constraint?.includes('email') 
        ? "A student with this email already exists"
        : error.constraint?.includes('enrollment') 
          ? "A student with this enrollment number already exists"
          : "A student with this information already exists";
    } else if (error.code === '23503') { // Foreign key violation
      errorMessage = "Invalid reference data";
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    res.status(500).json({ 
      error: errorMessage,
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

app.put("/api/students/:id", async (req, res) => {
  try {
    const studentData = req.body;
    const result = await Student.update(req.params.id, studentData);
    if (!result) return res.status(404).json({ error: "Student not found" });
    res.json({ success: true, data: result });
  } catch (error) {
    console.error('Error updating student:', error);
    res.status(500).json({ error: "Failed to update student" });
  }
});

app.delete("/api/students/:id", async (req, res) => {
  try {
    const result = await Student.delete(req.params.id);
    if (!result) return res.status(404).json({ error: "Student not found" });
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting student:', error);
    res.status(500).json({ error: "Failed to delete student" });
  }
});

app.post("/api/students/:id/reset-password", async (req, res) => {
  try {
    // In a real implementation, this would send a password reset email
    // For now, we'll just return success
    res.json({ success: true });
  } catch (error) {
    console.error('Error resetting student password:', error);
    res.status(500).json({ error: "Failed to reset password" });
  }
});

// Admin routes for faculty
app.post("/api/faculty", async (req, res) => {
  try {
    const facultyData = req.body;
    const result = await Faculty.create(facultyData);
    res.json({ success: true, data: result });
  } catch (error) {
    console.error('Error creating faculty:', error);
    res.status(500).json({ error: "Failed to create faculty" });
  }
});

app.put("/api/faculty/:id", async (req, res) => {
  try {
    const facultyData = req.body;
    const result = await Faculty.update(req.params.id, facultyData);
    if (!result) return res.status(404).json({ error: "Faculty not found" });
    res.json({ success: true, data: result });
  } catch (error) {
    console.error('Error updating faculty:', error);
    res.status(500).json({ error: "Failed to update faculty" });
  }
});

app.delete("/api/faculty/:id", async (req, res) => {
  try {
    const result = await Faculty.delete(req.params.id);
    if (!result) return res.status(404).json({ error: "Faculty not found" });
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting faculty:', error);
    res.status(500).json({ error: "Failed to delete faculty" });
  }
});

app.post("/api/faculty/:id/reset-password", async (req, res) => {
  try {
    // In a real implementation, this would send a password reset email
    // For now, we'll just return success
    res.json({ success: true });
  } catch (error) {
    console.error('Error resetting faculty password:', error);
    res.status(500).json({ error: "Failed to reset password" });
  }
});

// Attendance marking (for faculty)
app.post("/api/attendance", async (req, res) => {
  try {
    const attendanceData = req.body;
    const result = await Attendance.create(attendanceData);
    res.json({ success: true, attendance: result });
  } catch (error) {
    console.error('Error creating attendance:', error);
    res.status(500).json({ error: "Failed to create attendance record" });
  }
});

// Bulk attendance sync endpoint
app.post("/api/attendance/bulk", async (req, res) => {
  try {
    const attendanceRecords = req.body; // Array of attendance records
    if (!Array.isArray(attendanceRecords)) {
      return res.status(400).json({ error: "Expected array of attendance records" });
    }

    console.log("Bulk attendance sync received:", attendanceRecords.length, "records");

    const result = await Attendance.bulkCreate(attendanceRecords);
    res.json({ success: true, synced: result.length });
  } catch (error) {
    console.error('Error bulk creating attendance:', error);
    res.status(500).json({ error: "Failed to sync attendance records" });
  }
});

// Face recognition routes (keeping for now, but should be migrated to database later)
app.get("/api/student-faces", async (req, res) => {
  try {
    const StudentFace = require('./models/studentFaces');
    const faces = await StudentFace.findAll();
    res.json({ success: true, data: faces });
  } catch (error) {
    console.error('Error fetching student faces:', error);
    res.status(500).json({ error: "Failed to fetch student faces" });
  }
});

app.post("/api/student-faces/:studentId", async (req, res) => {
  try {
    const { studentId } = req.params;
    const { faceEmbedding, whatsappNumber } = req.body;

    console.log(`Received face embedding request for student ID: ${studentId}`);
    console.log(`Face embedding type: ${typeof faceEmbedding}, is array: ${Array.isArray(faceEmbedding)}, length: ${Array.isArray(faceEmbedding) ? faceEmbedding.length : 'N/A'}`);

    // Validate studentId
    const studentIdNum = parseInt(studentId, 10);
    if (isNaN(studentIdNum)) {
      console.error('Invalid student ID:', studentId);
      return res.status(400).json({ error: "Invalid student ID" });
    }

    if (!faceEmbedding) {
      console.error('Face embedding is missing');
      return res.status(400).json({ error: "Face embedding is required" });
    }

    if (!Array.isArray(faceEmbedding)) {
      console.error('Face embedding is not an array:', typeof faceEmbedding);
      return res.status(400).json({ error: "Face embedding must be an array" });
    }

    // Validate face embedding array
    if (faceEmbedding.length === 0) {
      console.error('Face embedding array is empty');
      return res.status(400).json({ error: "Face embedding array cannot be empty" });
    }

    // Check if embedding contains valid numbers
    if (!faceEmbedding.every(val => typeof val === 'number' && !isNaN(val))) {
      console.error('Face embedding contains invalid values');
      return res.status(400).json({ error: "Face embedding must contain only valid numbers" });
    }

    console.log(`Saving face embedding for student ${studentIdNum}, embedding size: ${faceEmbedding.length}`);

    const StudentFace = require('./models/studentFaces');
    const result = await StudentFace.create(studentIdNum, faceEmbedding, whatsappNumber || null);
    
    console.log(`Face embedding saved successfully for student ${studentIdNum}`);
    res.json({ success: true, data: result });
  } catch (error) {
    console.error('Error storing face embedding:', error);
    console.error('Error stack:', error.stack);
    
    // Provide more detailed error message
    const errorMessage = error.message || "Failed to store face embedding";
    const isTableError = error.message && error.message.includes('does not exist');
    
    if (isTableError) {
      return res.status(500).json({ 
        error: "Database table not found. Please run the migration script to create the student_faces table.",
        details: error.message
      });
    }
    
    // Check for foreign key constraint errors
    if (error.code === '23503') {
      return res.status(400).json({ 
        error: "Student not found. Please ensure the student exists before saving face data.",
        details: error.message
      });
    }
    
    res.status(500).json({ 
      error: errorMessage,
      details: process.env.NODE_ENV === 'development' ? error.message : undefined,
      code: error.code
    });
  }
});

app.post("/api/face-attendance", async (req, res) => {
  try {
    const { studentId, courseId, date } = req.body;
    const record = {
      student_id: studentId,
      course_id: courseId,
      date: date,
      status: "present"
    };

    const result = await Attendance.create(record);
    res.json({ success: true, record: result });
  } catch (error) {
    console.error('Error creating face attendance:', error);
    res.status(500).json({ error: "Failed to create face attendance record" });
  }
});

// Chat API route
app.post("/api/chat", (req, res) => {
  const { message } = req.body;
  if (!message) {
    return res.status(400).json({ error: "Message is required" });
  }

  const { spawn } = require("child_process");
  const pythonProcess = spawn("python", ["backend/chatbot.py", message]);

  let result = "";
  let error = "";

  pythonProcess.stdout.on("data", (data) => {
    result += data.toString();
  });

  pythonProcess.stderr.on("data", (data) => {
    error += data.toString();
  });

  pythonProcess.on("close", (code) => {
    if (code !== 0) {
      console.error("Python script error:", error);
      return res.status(500).json({ error: "Failed to process chat message" });
    }

    try {
      const response = JSON.parse(result.trim());
      res.json(response);
    } catch (parseError) {
      console.error("JSON parse error:", parseError);
      res.status(500).json({ error: "Invalid response from chat service" });
    }
  });

  pythonProcess.on("error", (err) => {
    console.error("Failed to start Python process:", err);
    res.status(500).json({ error: "Chat service unavailable" });
  });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server is running on port ${PORT}`);
});
