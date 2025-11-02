const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// File paths
const studentsFile = path.join(__dirname, "students.json");
const attendanceFile = path.join(__dirname, "attendance.json");

// Helper functions
const readData = (filePath) => {
  try {
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, "utf8");
      return JSON.parse(data);
    }
    return [];
  } catch (error) {
    console.error("Error reading file:", error);
    return [];
  }
};

const writeData = (filePath, data) => {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error("Error writing file:", error);
  }
};

// Routes
app.get("/api/students", (req, res) => {
  const students = readData(studentsFile);
  res.json(students);
});

app.post("/api/students", (req, res) => {
  const students = readData(studentsFile);
  const newStudent = req.body;
  students.push(newStudent);
  writeData(studentsFile, students);
  res.json({ message: "Student added successfully" });
});

app.get("/api/attendance", (req, res) => {
  const attendance = readData(attendanceFile);
  res.json(attendance);
});

app.post("/api/attendance", (req, res) => {
  const attendance = readData(attendanceFile);
  const newAttendance = req.body;
  attendance.push(newAttendance);
  writeData(attendanceFile, attendance);
  res.json({ message: "Attendance recorded successfully" });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
