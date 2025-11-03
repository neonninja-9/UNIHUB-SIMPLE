export const mockTeacher = {
  name: "Dr. Evelyn Reed",
  avatarUrl: "https://placehold.co/100x100/E2E8F0/4A5568?text=ER",
  notifications: 3,
};

export const mockCourses = [
  {
    id: 1,
    title: "Modern Physics",
    code: "PHYS 301",
    students: 45,
    nextClass: "Tomorrow, 10:00 AM",
  },
  {
    id: 2,
    title: "Calculus II",
    code: "MATH 102",
    students: 62,
    nextClass: "Today, 1:00 PM",
  },
  {
    id: 3,
    title: "Intro to Literature",
    code: "ENGL 110",
    students: 50,
    nextClass: "Tomorrow, 2:00 PM",
  },
];

export const mockAssignments = [
  {
    id: 1,
    title: "Lab Report 5",
    course: "Modern Physics",
    submitted: 30,
    total: 45,
    due: "Today, 11:59 PM",
  },
  {
    id: 2,
    title: "Chapter 3 Problems",
    course: "Calculus II",
    submitted: 50,
    total: 62,
    due: "Yesterday",
  },
  {
    id: 3,
    title: "Essay: The Great Gatsby",
    course: "Intro to Literature",
    submitted: 15,
    total: 50,
    due: "Next Friday",
  },
];

export const mockUpcomingEvents = [
  {
    id: 1,
    type: "exam",
    title: "Calculus II Midterm",
    time: "Oct 25, 1:00 PM",
  },
  { id: 2, type: "meeting", title: "Faculty Meeting", time: "Oct 26, 3:00 PM" },
  {
    id: 3,
    type: "reminder",
    title: "Submit Final Grades",
    time: "Oct 28, 5:00 PM",
  },
];
