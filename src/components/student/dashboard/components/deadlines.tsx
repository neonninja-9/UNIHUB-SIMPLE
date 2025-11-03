import { Clock, AlertCircle } from "lucide-react";
import { Course, Grade } from "@/lib/types";

interface DeadlinesProps {
  courses: Course[];
  grades: Grade[];
}

export function Deadlines({ courses, grades }: DeadlinesProps) {
  return (
    <div className="bg-[#1A1F3A] dark:bg-white rounded-xl p-6 shadow-lg dark:shadow-[0_4px_12px_rgba(0,0,0,0.08)]">
      <h3 className="text-xl font-bold mb-4 text-white dark:text-[#1f2937]">
        Upcoming Deadlines
      </h3>
      <div className="space-y-4">
        {courses.map((course) => {
          const courseGrades = grades.filter((g) => g.course_id === course.id);
          const upcomingGrades = courseGrades.filter((g) => !g.marks_obtained); // Not graded yet

          return upcomingGrades.map((grade, index) => {
            const dueDate = new Date(grade.due_date);
            const today = new Date();
            const diffDays = Math.ceil(
              (dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
            );
            const isUrgent = diffDays <= 2;

            return (
              <div key={grade.id} className="flex items-start gap-3">
                <div
                  className={`w-10 h-10 rounded-full ${
                    isUrgent ? "bg-red-500/20" : "bg-blue-500/20"
                  } flex items-center justify-center flex-shrink-0`}
                >
                  {isUrgent ? (
                    <AlertCircle className="w-5 h-5 text-red-400" />
                  ) : (
                    <Clock className="w-5 h-5 text-blue-400" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-sm text-white dark:text-[#1f2937]">{`Assignment ${index + 1}`}</div>
                  <div className="text-xs text-gray-400 dark:text-[#6b7280]">
                    {course.name}
                  </div>
                  <div
                    className={`text-xs mt-1 ${
                      isUrgent
                        ? "text-red-400 dark:text-[#ef4444]"
                        : "text-gray-300 dark:text-[#6b7280]"
                    }`}
                  >
                    Due in {diffDays} {diffDays === 1 ? "day" : "days"}
                  </div>
                </div>
              </div>
            );
          });
        })}
      </div>
    </div>
  );
}
