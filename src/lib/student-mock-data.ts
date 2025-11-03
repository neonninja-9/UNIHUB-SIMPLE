export const mockStudent = {
  name: "Alex Thompson",
  avatarUrl: "https://placehold.co/100x100/E2E8F0/4A5568?text=AT",
};

export const mockStudentCourses = [
  {
    id: 1,
    title: "Modern Physics",
    code: "PHYS 301",
    teacher: "Dr. Evelyn Reed",
    progress: 75,
    nextAssignment: "Lab Report 5",
    nextAssignmentDue: "Today, 11:59 PM",
  },
  {
    id: 2,
    title: "Calculus II",
    code: "MATH 102",
    teacher: "Dr. Alan Grant",
    progress: 60,
    nextAssignment: "Chapter 4 Problems",
    nextAssignmentDue: "Next Monday",
  },
  {
    id: 3,
    title: "Intro to Literature",
    code: "ENGL 110",
    teacher: "Prof. Eleanor Vance",
    progress: 85,
    nextAssignment: "Final Essay",
    nextAssignmentDue: "Next Friday",
  },
];

export const mockRecentGrades = [
  { id: 1, course: "Modern Physics", title: "Lab Report 4", grade: "A-" },
  { id: 2, course: "Calculus II", title: "Midterm Exam", grade: "B+" },
  {
    id: 3,
    course: "Intro to Literature",
    title: "Gatsby Essay Outline",
    grade: "A",
  },
];

export const mockStudentUpcomingEvents = [
  {
    id: 1,
    type: "exam",
    title: "Calculus II Midterm",
    time: "Oct 25, 1:00 PM",
  },
  { id: 2, type: "quiz", title: "Physics Quiz 3", time: "Oct 27, 10:00 AM" },
  {
    id: 3,
    type: "reminder",
    title: "Submit Literature Essay",
    time: "Oct 28, 11:59 PM",
  },
];
