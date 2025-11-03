import React, { useState, useRef, useEffect } from "react";
import { PieChart, Pie, ResponsiveContainer } from "recharts";
import { Course, Attendance } from "@/lib/types";
import { X } from "lucide-react";

interface AttendanceChartProps {
  courses: Course[];
  attendance: Attendance[];
}

export function AttendanceChart({ courses, attendance }: AttendanceChartProps) {
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const detailsRef = useRef<HTMLDivElement>(null);

  // Calculate overall attendance data
  const totalClasses = attendance.length;
  const presentClasses = attendance.filter((a) => a.status === "present").length;
  const absentClasses = totalClasses - presentClasses;
  const overallPercentage = totalClasses ? (presentClasses / totalClasses) * 100 : 0;

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

  // Preserve user state
  useEffect(() => {
    const savedState = localStorage.getItem('attendanceDetailsOpen');
    if (savedState === 'true') {
      setIsDetailsOpen(true);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('attendanceDetailsOpen', isDetailsOpen.toString());
  }, [isDetailsOpen]);

  // Handle click outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (detailsRef.current && !detailsRef.current.contains(event.target as Node)) {
        setIsDetailsOpen(false);
      }
    };

    if (isDetailsOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDetailsOpen]);

  const toggleDetails = () => {
    setIsDetailsOpen(!isDetailsOpen);
  };

  return (
    <div className="bg-[#1A1F3A] dark:bg-gradient-to-b dark:from-white dark:to-[#f9fafb] rounded-3xl p-6 md:p-8 shadow-lg dark:shadow-[inset_0_1px_3px_rgba(255,255,255,0.7),0_4px_12px_rgba(0,0,0,0.08)] transition-all duration-300 ease-in-out hover:scale-[1.01] dark:hover:shadow-[inset_0_1px_2px_rgba(255,255,255,0.8),0_6px_20px_rgba(0,0,0,0.12)]">
      {/* Header section */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-white dark:text-[#111827]">
          My Attendance
        </h3>

        {/* Overall attendance pie chart - clickable */}
        <div
          className="relative cursor-pointer group"
          onClick={toggleDetails}
          title="View Details"
        >
          <div className="w-20 h-20 bg-white dark:bg-gray-800 rounded-lg shadow-md flex items-center justify-center transition-transform duration-200 group-hover:scale-105">
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
                  animationBegin={isDetailsOpen ? 0 : 300}
                  animationDuration={800}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          {/* Hover tooltip */}
          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
            View Details
          </div>
        </div>
      </div>

      {/* Detailed attendance bars - conditionally rendered */}
      {isDetailsOpen && (
        <div
          ref={detailsRef}
          className="bg-[#0F1419] dark:bg-gray-900 rounded-2xl p-6 mt-6 border border-gray-700 dark:border-gray-600 transition-all duration-400 ease-in-out animate-in slide-in-from-top-2"
        >
          {/* Close button */}
          <div className="flex justify-end mb-4">
            <button
              onClick={() => setIsDetailsOpen(false)}
              className="p-2 hover:bg-gray-700 dark:hover:bg-gray-800 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-400 hover:text-white" />
            </button>
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

              // Get color based on attendance percentage
              const getAttendanceColor = (percentage: number) => {
                if (percentage < 75) return "#ef4444"; // Red for < 75%
                if (percentage >= 85) return "#10b981"; // Green for >= 85%
                return "#fbbf24"; // Yellow for 75-84%
              };

              const barColor = getAttendanceColor(percentage);

              return (
                <div
                  key={index}
                  className="flex flex-col"
                  data-subject={course.name}
                >
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex flex-col">
                      <span className="font-medium text-gray-300 dark:text-[#374151]">
                        {course.name}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-[#6b7280]">
                        {course.code}
                      </span>
                    </div>
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
                          background: barColor,
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
      )}
    </div>
  );
}
