import { BookOpen } from "lucide-react";
import { Course, Attendance } from "@/lib/types";

interface CourseListProps {
  courses: Course[];
  attendance: Attendance[];
  onCourseClick?: (course: Course) => void;
}

export function CourseList({ courses, attendance, onCourseClick }: CourseListProps) {
  return (
    <div>
      <h3 className="text-xl font-bold mb-4">My Courses</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {courses.map((course, index) => {
          // normalize id field: backend may return `id` or `course_id`
          const courseId =
            (course as any).id ?? (course as any).course_id ?? index;
          const colors = [
            "from-blue-500 to-blue-700 dark:from-[#60a5fa] dark:to-[#3b82f6]",
            "from-pink-500 to-pink-700 dark:from-[#f472b6] dark:to-[#ec4899]",
            "from-green-500 to-green-700 dark:from-[#34d399] dark:to-[#10b981]",
            "from-orange-500 to-orange-700 dark:from-[#fbbf24] dark:to-[#f59e0b]",
            "from-violet-500 to-violet-700 dark:from-[#a78bfa] dark:to-[#8b5cf6]",
            "from-teal-500 to-teal-700 dark:from-[#5eead4] dark:to-[#14b8a6]",
          ];
          const colorClass = colors[index % colors.length];

          // Calculate course progress
          const courseAttendance = attendance.filter(
            (a) => a.course_id === courseId,
          );
          const totalClasses = courseAttendance.length;
          const presentClasses = courseAttendance.filter(
            (a) => a.status === "present",
          ).length;
          const progress = totalClasses
            ? (presentClasses / totalClasses) * 100
            : 0;

          return (
            <div
              key={courseId}
              className={`bg-gradient-to-br ${colorClass} rounded-xl p-6 cursor-pointer hover:scale-105 transition-all duration-200 hover:shadow-xl`}
              onClick={() => onCourseClick?.(course)}
            >
              <div className="flex items-center justify-between mb-4">
                <BookOpen className="w-6 h-6" />
                <span className="text-sm bg-white/20 px-3 py-1 rounded-full">
                  {course.code}
                </span>
              </div>
              <h4 className="text-lg font-bold mb-2">{course.name}</h4>
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-1">
                  <span>Progress</span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <div className="w-full bg-white/20 rounded-full h-2">
                  <div
                    className="bg-white rounded-full h-2 transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
