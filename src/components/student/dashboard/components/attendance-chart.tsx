import React from "react";
import { PieChart, Pie, ResponsiveContainer } from "recharts";
import { Course, Attendance } from "@/lib/types";

interface AttendanceChartProps {
  courses: Course[];
  attendance: Attendance[];
}

export function AttendanceChart({ courses, attendance }: AttendanceChartProps) {
  return (
    <div className="bg-[#1A1F3A] dark:bg-gradient-to-b dark:from-white dark:to-[#f9fafb] rounded-3xl p-6 md:p-8 shadow-lg dark:shadow-[inset_0_1px_3px_rgba(255,255,255,0.7),0_4px_12px_rgba(0,0,0,0.08)] transition-all duration-300 ease-in-out hover:scale-[1.01] dark:hover:shadow-[inset_0_1px_2px_rgba(255,255,255,0.8),0_6px_20px_rgba(0,0,0,0.12)]">
      {/* Header section */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-white dark:text-[#111827]">
          My Attendance
        </h3>

        {/* Overall attendance small box with pie chart */}
        <div className="relative">
          {(() => {
            const totalClasses = attendance.length;
            const presentClasses = attendance.filter(
              (a) => a.status === "present",
            ).length;
            const absentClasses = totalClasses - presentClasses;
            const overallPercentage = totalClasses
              ? (presentClasses / totalClasses) * 100
              : 0;

            // Determine color based on attendance percentage
            let attendanceColor;
            if (overallPercentage < 75) {
              attendanceColor = "#ef4444"; // Red for < 75%
            } else if (overallPercentage >= 85) {
              attendanceColor = "#10b981"; // Green for >= 85%
            } else {
              attendanceColor = "#fbbf24"; // Yellow for 75-84%
            }

            const data = [
              { name: "Present", value: presentClasses, fill: attendanceColor },
              { name: "Absent", value: absentClasses, fill: "#e5e7eb" },
            ];

            return (
              <div className="w-20 h-20 bg-white dark:bg-gray-800 rounded-lg shadow-md flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={data}
                      dataKey="value"
                      cx="50%"
                      cy="50%"
                      innerRadius={15}
                      outerRadius={30}
                      startAngle={90}
                      endAngle={-270}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            );
          })()}
        </div>
      </div>

      {/* Subject rows */}
      <div className="space-y-6">
        {courses.map((course, index) => {
          const courseAttendance = attendance.filter(
            (a) => a.course_id === course.id,
          );
          const totalClasses = courseAttendance.length;
          const presentClasses = courseAttendance.filter(
            (a) => a.status === "present",
          ).length;
          const percentage = totalClasses
            ? (presentClasses / totalClasses) * 100
            : 0;

          // Get gradient colors based on subject
          const getSubjectColors = (subjectName: string) => {
            const name = subjectName.toLowerCase();
            if (name.includes("math"))
              return { start: "#34d399", end: "#10b981" };
            if (name.includes("data") || name.includes("structures"))
              return { start: "#60a5fa", end: "#2563eb" };
            if (name.includes("behavioural") || name.includes("science"))
              return { start: "#f472b6", end: "#ec4899" };
            if (name.includes("communication") || name.includes("skills"))
              return { start: "#fbbf24", end: "#f59e0b" };
            // Default colors
            return { start: "#34d399", end: "#10b981" };
          };

          const colors = getSubjectColors(course.name);

          return (
            <div
              key={index}
              className="flex flex-col"
              data-subject={course.name}
            >
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium text-gray-300 dark:text-[#374151]">
                  {course.name}
                </span>
                <span className="text-sm font-medium text-gray-400 dark:text-[#4b5563]">
                  {Math.round(percentage)}%
                </span>
              </div>

              {/* Progress bar */}
              <div className="relative h-3 bg-[#e5e7eb] rounded-xl overflow-hidden shadow-[inset_0_1px_2px_rgba(0,0,0,0.05)]">
                <div
                  className="absolute left-0 top-0 h-full rounded-xl animate-[fillGrow_1.2s_ease-out]"
                  style={
                    {
                      width: `${percentage}%`,
                      background: `linear-gradient(90deg, ${colors.start}, ${colors.end})`,
                      "--percent": `${percentage}%`,
                    } as React.CSSProperties
                  }
                />
                <span className="absolute right-2 top-[-18px] text-xs font-medium text-gray-400 dark:text-[#4b5563]">
                  {Math.round(percentage)}%
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
