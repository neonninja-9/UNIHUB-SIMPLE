import { BookOpen, Users, AlertCircle, Award } from "lucide-react";
import { useState } from "react";
import { Grade, Attendance, Course } from "@/lib/types";
import { CGPAGraph } from "./cgpa-graph";

interface StatsCardsProps {
  grades: Grade[];
  attendance: Attendance[];
  courses: Course[];
  onStatClick?: (statType: string) => void;
}

export function StatsCards({
  grades,
  attendance,
  courses,
  onStatClick,
}: StatsCardsProps) {
  const calculateGPA = () => {
    const completedGrades = grades.filter((g) => g.marks_obtained !== null);
    const totalPoints = completedGrades.reduce((sum, grade) => {
      const percentage = (grade.marks_obtained || 0) / grade.total_marks;
      // Convert percentage to 4.0 scale
      let points = 0;
      if (percentage >= 0.9) points = 4.0;
      else if (percentage >= 0.8) points = 3.5;
      else if (percentage >= 0.7) points = 3.0;
      else if (percentage >= 0.6) points = 2.5;
      else if (percentage >= 0.5) points = 2.0;
      else points = 1.0;
      return sum + points;
    }, 0);
    return completedGrades.length
      ? (totalPoints / completedGrades.length).toFixed(2)
      : "N/A";
  };

  const calculateAttendance = () => {
    const totalClasses = attendance.length;
    const presentClasses = attendance.filter(
      (a) => a.status === "present",
    ).length;
    return totalClasses
      ? `${Math.round((presentClasses / totalClasses) * 100)}%`
      : "N/A";
  };

  const pendingTasks = grades.filter((g) => g.marks_obtained === null).length;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl">
      <StatCard
        icon={<BookOpen className="w-5 h-5 text-green-400" />}
        iconBg="bg-green-500/20"
        label="CGPA"
        value={calculateGPA()}
        onClick={() => onStatClick?.("CGPA")}
      />

      <StatCard
        icon={<Users className="w-5 h-5 text-blue-400" />}
        iconBg="bg-blue-500/20"
        label="Attendance"
        value={calculateAttendance()}
        onClick={() => onStatClick?.("Attendance")}
      />

      <StatCard
        icon={<AlertCircle className="w-5 h-5 text-purple-400" />}
        iconBg="bg-purple-500/20"
        label="Pending Tasks"
        value={pendingTasks}
        onClick={() => onStatClick?.("Pending Tasks")}
      />

      <StatCard
        icon={<Award className="w-5 h-5 text-yellow-400" />}
        iconBg="bg-yellow-500/20"
        label="Courses"
        value={courses.length}
        onClick={() => onStatClick?.("Courses")}
      />
    </div>
  );
}

interface StatCardProps {
  icon: React.ReactNode;
  iconBg: string;
  label: string;
  value: string | number;
  onClick?: () => void;
}

function StatCard({ icon, iconBg, label, value, onClick }: StatCardProps) {
  return (
    <div
      className="bg-[#1A1F3A] dark:bg-white rounded-xl p-5 shadow-lg dark:shadow-[0_4px_12px_rgba(0,0,0,0.08)] cursor-pointer hover:scale-105 transition-all duration-200 hover:shadow-xl"
      onClick={onClick}
    >
      <div className="flex items-center gap-3 mb-2">
        <div
          className={`w-10 h-10 rounded-full ${iconBg} flex items-center justify-center`}
        >
          {icon}
        </div>
      </div>
      <div className="text-gray-400 dark:text-[#6b7280] text-sm mb-1">
        {label}
      </div>
      <div className="text-3xl font-bold text-white dark:text-[#1f2937]">
        {value}
      </div>
    </div>
  );
}
