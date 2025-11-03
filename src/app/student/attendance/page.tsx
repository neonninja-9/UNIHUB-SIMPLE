"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Attendance, Student, Course } from "@/lib/types";
import { Sidebar } from "@/components/student/dashboard/sidebar";
import { AttendanceChart } from "@/components/student/dashboard/components/attendance-chart";
import { DashboardHeader } from "@/components/student/dashboard/components/header";

// Loading component
const LoadingSpinner = () => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center">
    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
  </div>
);

export default function AttendancePage() {
  const router = useRouter();
  const [student, setStudent] = useState<Student | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    // Mock data for attendance page
    setStudent({
      id: 1,
      user_id: 1,
      name: "Alex Thompson",
      roll_number: "S101",
      class_section: "A",
      phone: "1234567890",
      address: "123 Main St",
      parent_name: "John Thompson",
      parent_phone: "555-1234",
      email: "alex.thompson@student.unihub.com",
      enrollment_no: "EN2024001",
      date_of_birth: "2000-05-15",
      blood_group: "O+",
      institution_name: "University of Technology",
      id_card_no: "IDC2024001",
      profile_photo: "https://placehold.co/100x100/E2E8F0/4A5568?text=AT",
    });

    setCourses([
      {
        id: 1,
        code: "PHYS 301",
        name: "Modern Physics",
        schedule: "Mon,Wed 09:15-10:10",
        classroom: "B201",
        credits: 3,
        description: "",
        faculty_id: 2,
        created_at: "",
        updated_at: "",
      },
      {
        id: 2,
        code: "MATH 102",
        name: "Calculus II",
        schedule: "Tue,Thu 10:15-11:10",
        classroom: "A101",
        credits: 4,
        description: "",
        faculty_id: 3,
        created_at: "",
        updated_at: "",
      },
      {
        id: 3,
        code: "ENGL 110",
        name: "Intro to Literature",
        schedule: "Mon,Wed,Fri 11:15-12:10",
        classroom: "C301",
        credits: 3,
        description: "",
        faculty_id: 4,
        created_at: "",
        updated_at: "",
      },
      {
        id: 4,
        code: "CHEM 201",
        name: "Organic Chemistry",
        schedule: "Tue,Thu 13:15-14:10",
        classroom: "D201",
        credits: 4,
        description: "",
        faculty_id: 5,
        created_at: "",
        updated_at: "",
      },
      {
        id: 5,
        code: "CS 101",
        name: "Introduction to Programming",
        schedule: "Mon,Wed 14:15-15:10",
        classroom: "E101",
        credits: 3,
        description: "",
        faculty_id: 6,
        created_at: "",
        updated_at: "",
      },
    ]);

    setAttendance([
      // Mock attendance data
      ...Array(15)
        .fill(0)
        .map((_, i) => ({
          id: i + 1,
          student_id: 1,
          course_id: 1,
          date: `2025-10-${(i + 1).toString().padStart(2, "0")}`,
          status: (i % 4 === 0 ? "absent" : "present") as
            | "present"
            | "absent"
            | "late",
          created_at: "",
          updated_at: "",
        })),
      ...Array(12)
        .fill(0)
        .map((_, i) => ({
          id: 100 + i,
          student_id: 1,
          course_id: 2,
          date: `2025-10-${(i + 1).toString().padStart(2, "0")}`,
          status: (i % 5 === 0 ? "absent" : "present") as
            | "present"
            | "absent"
            | "late",
          created_at: "",
          updated_at: "",
        })),
      ...Array(14)
        .fill(0)
        .map((_, i) => ({
          id: 200 + i,
          student_id: 1,
          course_id: 3,
          date: `2025-10-${(i + 1).toString().padStart(2, "0")}`,
          status: (i % 6 === 0 ? "absent" : "present") as
            | "present"
            | "absent"
            | "late",
          created_at: "",
          updated_at: "",
        })),
      ...Array(11)
        .fill(0)
        .map((_, i) => ({
          id: 300 + i,
          student_id: 1,
          course_id: 4,
          date: `2025-10-${(i + 1).toString().padStart(2, "0")}`,
          status: (i % 3 === 0 ? "absent" : "present") as
            | "present"
            | "absent"
            | "late",
          created_at: "",
          updated_at: "",
        })),
      ...Array(16)
        .fill(0)
        .map((_, i) => ({
          id: 400 + i,
          student_id: 1,
          course_id: 5,
          date: `2025-10-${(i + 1).toString().padStart(2, "0")}`,
          status: (i % 7 === 0 ? "absent" : "present") as
            | "present"
            | "absent"
            | "late",
          created_at: "",
          updated_at: "",
        })),
    ]);

    setLoading(false);
  }, [router]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!student) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2 text-gray-700">
            Unable to load student data
          </h2>
          <button
            onClick={() => router.push("/")}
            className="text-blue-600 hover:underline"
          >
            Return to login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-700 flex flex-col">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 w-full">
        <DashboardHeader
          student={student}
          onMenuClick={() => setSidebarOpen(true)}
          sidebarOpen={sidebarOpen}
          searchQuery=""
          onSearchChange={() => {}}
          onRefresh={() => {}}
          refreshing={false}
          onIDCardClick={() => {}}
        />

        <div className="p-4 md:p-6 max-w-7xl mx-auto">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Attendance Overview
            </h1>
            <p className="text-gray-600">
              Track your attendance across all enrolled courses
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition-shadow duration-300">
            <AttendanceChart courses={courses} attendance={attendance} />
          </div>

          {/* Detailed attendance breakdown */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => {
              const courseAttendance = attendance.filter(
                (a) => a.course_id === course.id,
              );
              const totalClasses = courseAttendance.length;
              const presentClasses = courseAttendance.filter(
                (a) => a.status === "present",
              ).length;
              const absentClasses = totalClasses - presentClasses;
              const percentage = totalClasses
                ? (presentClasses / totalClasses) * 100
                : 0;

              return (
                <div
                  key={course.id}
                  className="bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition-shadow duration-300"
                >
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    {course.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">{course.code}</p>

                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">
                        Total Classes
                      </span>
                      <span className="font-medium">{totalClasses}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-green-600">Present</span>
                      <span className="font-medium text-green-600">
                        {presentClasses}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-red-600">Absent</span>
                      <span className="font-medium text-red-600">
                        {absentClasses}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Percentage</span>
                      <span className="font-medium">
                        {Math.round(percentage)}%
                      </span>
                    </div>
                  </div>

                  <div className="mt-4">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
