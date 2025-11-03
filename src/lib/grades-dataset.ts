import { Grade } from './types';

// Generate grades for all students across multiple courses
export const generateMockGrades = (): Grade[] => {
  const grades: Grade[] = [];
  let id = 1;

  // Assignment types and their weights
  const assignments = [
    { title: "Midterm Exam", total_marks: 100, due_date: "2024-10-15" },
    { title: "Final Exam", total_marks: 100, due_date: "2024-12-15" },
    { title: "Assignment 1", total_marks: 50, due_date: "2024-09-15" },
    { title: "Assignment 2", total_marks: 50, due_date: "2024-10-15" },
    { title: "Project", total_marks: 100, due_date: "2024-11-15" },
    { title: "Quiz 1", total_marks: 25, due_date: "2024-09-20" },
    { title: "Quiz 2", total_marks: 25, due_date: "2024-10-20" },
    { title: "Lab Report", total_marks: 50, due_date: "2024-11-01" },
  ];

  // For each student (1-50)
  for (let studentId = 1; studentId <= 50; studentId++) {
    // For each course (1-20)
    for (let courseId = 1; courseId <= 20; courseId++) {
      // For each assignment type
      assignments.forEach((assignment, assignmentIndex) => {
        // Generate random marks (with some students performing better)
        const baseScore = studentId <= 10 ? 85 : studentId <= 25 ? 75 : 65; // Top 20% get higher scores
        const variation = Math.random() * 20 - 10; // ±10 variation
        const marks = Math.max(0, Math.min(assignment.total_marks,
          Math.round(baseScore + variation)));

        grades.push({
          id: id++,
          student_id: studentId,
          course_id: courseId,
          assignment_id: assignmentIndex + 1,
          marks_obtained: marks,
          feedback: marks >= 80 ? "Excellent work!" :
                   marks >= 70 ? "Good performance." :
                   marks >= 60 ? "Satisfactory. Room for improvement." :
                   "Needs significant improvement.",
          due_date: assignment.due_date,
          title: assignment.title,
          total_marks: assignment.total_marks,
          created_at: "2024-01-01T00:00:00Z",
          updated_at: "2024-01-01T00:00:00Z",
        });
      });
    }
  }

  return grades;
};

export const mockGrades = generateMockGrades();
