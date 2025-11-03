import { BookOpen, User, Calendar, FileText, ChevronDown, ChevronUp } from "lucide-react";
import { Course, Attendance } from "@/lib/types";
import { useState } from "react";

interface CourseListProps {
  courses: Course[];
  attendance: Attendance[];
  onCourseClick?: (course: Course) => void;
}

export function CourseList({
  courses,
  attendance,
  onCourseClick,
}: CourseListProps) {
  const [expandedCard, setExpandedCard] = useState<number | null>(null);

  const toggleCard = (courseId: number) => {
    setExpandedCard(expandedCard === courseId ? null : courseId);
  };

  return (
    <div>
      <h3 className="text-xl font-bold mb-4 text-gray-700 dark:text-white">My Subjects</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {courses.map((course, index) => {
          // normalize id field: backend may return `id` or `course_id`
          const courseId =
            (course as any).id ?? (course as any).course_id ?? index;
          const colors = [
            "from-blue-500 to-blue-700",
            "from-pink-500 to-pink-700",
            "from-green-500 to-green-700",
            "from-orange-500 to-orange-700",
            "from-violet-500 to-violet-700",
            "from-teal-500 to-teal-700",
          ];
          const colorClass = colors[index % colors.length];
          const isExpanded = expandedCard === courseId;

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
              className={`bg-gradient-to-br ${colorClass} rounded-2xl cursor-pointer hover:scale-105 transition-all duration-300 hover:shadow-xl text-white overflow-hidden`}
              onClick={() => toggleCard(courseId)}
            >
              {/* Header - Always visible */}
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <BookOpen className="w-6 h-6" />
                  <div className="flex items-center gap-2">
                    <span className="text-sm bg-white/20 px-3 py-1 rounded-full">
                      {course.code}
                    </span>
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </div>
                </div>
                <h4 className="text-lg font-bold mb-2">{course.name}</h4>
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span>Attendance</span>
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

              {/* Expanded Details */}
              <div
                className={`transition-all duration-500 ease-in-out overflow-hidden ${
                  isExpanded ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                }`}
              >
                <div className="px-6 pb-6 space-y-4">
                  {/* Attendance Details */}
                  <div className="bg-white/10 rounded-lg p-4">
                    <h5 className="font-semibold mb-2 flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      Attendance Details
                    </h5>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <div className="text-white/70">Total Classes</div>
                        <div className="font-bold">{totalClasses}</div>
                      </div>
                      <div>
                        <div className="text-white/70">Present</div>
                        <div className="font-bold text-green-300">{presentClasses}</div>
                      </div>
                      <div>
                        <div className="text-white/70">Absent</div>
                        <div className="font-bold text-red-300">{totalClasses - presentClasses}</div>
                      </div>
                    </div>
                  </div>

                  {/* Assignments */}
                  <div className="bg-white/10 rounded-lg p-4">
                    <h5 className="font-semibold mb-2 flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      Recent Assignments
                    </h5>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Lab Report 4</span>
                        <span className="text-green-300">88/100</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Midterm Exam</span>
                        <span className="text-yellow-300">79/100</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Essay Outline</span>
                        <span className="text-green-300">93/100</span>
                      </div>
                    </div>
                  </div>

                  {/* Instructor Info */}
                  <div className="bg-white/10 rounded-lg p-4">
                    <h5 className="font-semibold mb-2 flex items-center gap-2">
                      <User className="w-4 h-4" />
                      Instructor
                    </h5>
                    <div className="text-sm">
                      <div className="font-medium">Dr. Sarah Johnson</div>
                      <div className="text-white/70">sarah.johnson@unihub.edu</div>
                      <div className="text-white/70">Office: Room 301</div>
                    </div>
                  </div>

                  {/* Schedule */}
                  <div className="bg-white/10 rounded-lg p-4">
                    <h5 className="font-semibold mb-2 flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      Schedule
                    </h5>
                    <div className="text-sm text-white/70">
                      {course.schedule || "Mon, Wed 09:15-10:10"}
                    </div>
                    <div className="text-sm text-white/70">
                      {course.classroom || "B201"}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
