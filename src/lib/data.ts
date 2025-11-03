export type Student = {
  id: string;
  name: string;
  email: string;
  attendance: number;
  marks: { subject: string; score: number }[];
};

export type Teacher = {
  id: string;
  name: string;
  email: string;
};

export type ScheduleItem = {
  time: string;
  subject: string;
  teacher: string;
};

export type Notice = {
  id: string;
  title: string;
  content: string;
  date: string;
};

export const studentData: Student = {
  id: "S001",
  name: "Alex Doe",
  email: "alex.doe@unihub.com",
  attendance: 92,
  marks: [
    { subject: "Mathematics", score: 88 },
    { subject: "Physics", score: 95 },
    { subject: "Computer Science", score: 91 },
    { subject: "English", score: 82 },
  ],
};

export const teacherData: Teacher = {
  id: "T001",
  name: "Dr. Evelyn Reed",
  email: "e.reed@unihub.com",
};

export const scheduleData: ScheduleItem[] = [
  { time: "09:00 - 10:00", subject: "Mathematics", teacher: "Mr. Smith" },
  { time: "10:00 - 11:00", subject: "Physics", teacher: "Dr. Reed" },
  { time: "11:15 - 12:15", subject: "Computer Science", teacher: "Ms. Jones" },
  { time: "13:30 - 14:30", subject: "English", teacher: "Mr. Brown" },
];

export const noticeBoardData: Notice[] = [
  {
    id: "N01",
    title: "Mid-term Examinations",
    content:
      "The mid-term examination schedule has been posted. Please check the main notice board.",
    date: "2 days ago",
  },
  {
    id: "N02",
    title: "Annual Sports Day",
    content: "Registrations for the annual sports day are now open.",
    date: "5 days ago",
  },
];

export const classPerformanceData = `
- Student A: Math 85, Physics 90, Attendance 95%
- Student B: Math 60, Physics 72, Attendance 80%
- Student C: Math 92, Physics 95, Attendance 98%
- Student D: Math 75, Physics 68, Attendance 88%
- Student E: Math 55, Physics 60, Attendance 75%
- Student F: Math 88, Physics 85, Attendance 96%
Overall class average for Math is 75.8.
Overall class average for Physics is 78.3.
Students B and E are struggling with core concepts, showing lower marks and attendance.
`;

export const classStudentList = [
  { id: "S101", name: "Alice Johnson" },
  { id: "S102", name: "Bob Williams" },
  { id: "S103", name: "Charlie Brown" },
  { id: "S104", name: "Diana Miller" },
  { id: "S105", name: "Ethan Davis" },
];

export const uploadedFiles = [
  { name: "Chapter 1 - Introduction.pdf", size: "2.3 MB", date: "2024-05-10" },
  { name: "Quantum Mechanics Notes.docx", size: "850 KB", date: "2024-05-08" },
  { name: "Assignment_3.pdf", size: "1.1 MB", date: "2024-05-05" },
];
