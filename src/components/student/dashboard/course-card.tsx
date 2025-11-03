import { BookOpen, ChevronRight } from "lucide-react";

export const CourseCard = ({ course }: { course: any }) => {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
            {course.code}
          </p>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mt-1">
            {course.title}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
            {course.teacher}
          </p>
        </div>
        <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-full">
          <BookOpen className="w-5 h-5 text-blue-600 dark:text-blue-400" />
        </div>
      </div>
      <div className="mt-4">
        <div className="flex justify-between items-center mb-1">
          <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
            Progress
          </span>
          <span className="text-sm font-bold text-gray-800 dark:text-white">
            {course.progress}%
          </span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
          <div
            className="bg-blue-600 h-2.5 rounded-full"
            style={{ width: `${course.progress}%` }}
          ></div>
        </div>
      </div>
      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Next: {course.nextAssignment}
        </p>
        <p className="text-sm font-medium text-gray-700 dark:text-gray-200">
          Due: {course.nextAssignmentDue}
        </p>
      </div>
    </div>
  );
};
