module.exports = {
  students: [
    { 
      id: 1, 
      name: "Alex Doe", 
      email: "alex.doe@unihub.com", 
      roll_number: "STU001",
      class_section: "A",
      phone: "1234567890",
      address: "123 Main St",
      parent_name: "John Doe",
      parent_phone: "0987654321",
      enrollment_no: "ENR001",
      password: "password123",
      role: "student" 
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane.smith@unihub.com",
      roll_number: "STU002",
      class_section: "B",
      phone: "9876543210",
      address: "456 Oak Ave",
      parent_name: "Jane Parent",
      parent_phone: "0123456789",
      enrollment_no: "ENR002",
      password: "password123",
      role: "student",
    },
  ],
  faculty: [
    { 
      id: 1, 
      name: "Emily Reed", 
      email: "e.reed@unihub.com", 
      employee_id: "EMP001",
      department: "Computer Science",
      phone: "5555555555",
      address: "789 University Blvd",
      specialization: "Data Structures",
      password: "password123",
      role: "faculty" 
    },
  ],
  admins: [
    { 
      id: 1, 
      name: "System Administrator", 
      email: "admin@unihub.com", 
      password: "admin123",
      role: "admin" 
    },
  ],
  schedules: {
    1: [
      { courseId: 101, name: "Mathematics", time: "Mon 9am" },
      { courseId: 102, name: "Physics", time: "Wed 11am" },
    ],
    2: [{ courseId: 101, name: "Mathematics", time: "Mon 9am" }],
  },
  courses: [
    { id: 101, name: "Mathematics", facultyId: 1 },
    { id: 102, name: "Physics", facultyId: 1 },
  ],
  attendance: [
    { studentId: 1, courseId: 101, date: "2025-10-01", status: "Present" },
    { studentId: 1, courseId: 102, date: "2025-10-02", status: "Absent" },
    { studentId: 2, courseId: 101, date: "2025-10-01", status: "Present" },
  ],
  results: [
    { studentId: 1, courseId: 101, grade: "A" },
    { studentId: 1, courseId: 102, grade: "B+" },
    { studentId: 2, courseId: 101, grade: "A-" },
  ],
  teachingAssignments: [
    { facultyId: 1, courseId: 101 },
    { facultyId: 1, courseId: 102 },
  ],
  notices: [
    { id: 1, message: "Welcome to UniHub!", date: "2025-10-01" },
    { id: 2, message: "Exam schedule released.", date: "2025-10-05" },
  ],
  // New data for face recognition
  studentFaces: [
    { studentId: 1, faceEmbedding: null }, // Will store face embeddings
    { studentId: 2, faceEmbedding: null },
  ],
  faceAttendance: [], // Store face-based attendance records
  // New data for DigiLocker documents
  studentDocuments: {
    1: [
      {
        id: "1",
        name: "Class 10 Marksheet",
        type: "Academic Certificate",
        issuer: "Central Board of Secondary Education",
        issueDate: "2020-05-15",
        status: "active",
        downloadUrl: "#",
        previewUrl: "#",
      },
      {
        id: "2",
        name: "Class 12 Marksheet",
        type: "Academic Certificate",
        issuer: "Central Board of Secondary Education",
        issueDate: "2022-05-20",
        status: "active",
        downloadUrl: "#",
        previewUrl: "#",
      },
      {
        id: "3",
        name: "Bachelor Degree Certificate",
        type: "Degree Certificate",
        issuer: "University of Delhi",
        issueDate: "2024-06-10",
        status: "pending",
        downloadUrl: "#",
        previewUrl: "#",
      },
      {
        id: "4",
        name: "Aadhaar Card",
        type: "Identity Document",
        issuer: "Unique Identification Authority of India",
        issueDate: "2018-03-12",
        status: "active",
        downloadUrl: "#",
        previewUrl: "#",
      },
    ],
    2: [
      {
        id: "5",
        name: "Class 10 Marksheet",
        type: "Academic Certificate",
        issuer: "Central Board of Secondary Education",
        issueDate: "2020-05-15",
        status: "active",
        downloadUrl: "#",
        previewUrl: "#",
      },
    ],
  },
};
