import { Attendance } from './types';

// Generate attendance data for all students across multiple courses
export const generateMockAttendance = (): Attendance[] => {
  const attendance: Attendance[] = [];
  let id = 1;

  // For each student (1-50)
  for (let studentId = 1; studentId <= 50; studentId++) {
    // For each course (1-20)
    for (let courseId = 1; courseId <= 20; courseId++) {
      // Generate attendance for 30 days (October 2024)
      for (let day = 1; day <= 30; day++) {
        // Random attendance with bias towards present (85% present rate)
        const isPresent = Math.random() < 0.85;
        const status = isPresent ? "present" : "absent";

        attendance.push({
          id: id++,
          student_id: studentId,
          course_id: courseId,
          date: `2024-10-${day.toString().padStart(2, '0')}`,
          status: status as "present" | "absent" | "late",
          created_at: "2024-01-01T00:00:00Z",
          updated_at: "2024-01-01T00:00:00Z",
        });
      }
    }
  }

  return attendance;
};

export const mockAttendance = generateMockAttendance();
