import { mockRecentGrades } from "@/lib/student-mock-data";
import { FileCheck2 } from "lucide-react";

export const RecentGrades = () => {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
      <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">
        Recent Grades
      </h3>
      <div className="space-y-4">
        {mockRecentGrades.map((grade) => (
          <div key={grade.id} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-full">
                <FileCheck2 className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="font-semibold text-gray-800 dark:text-gray-200">
                  {grade.title}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {grade.course}
                </p>
              </div>
            </div>
            <span className="text-lg font-bold text-gray-800 dark:text-white">
              {grade.grade}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
