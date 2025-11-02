"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  mockStudent,
  mockStudentCourses,
  mockRecentGrades,
} from "@/lib/student-mock-data";
import { Attendance, Student, Course, Grade, PendingTask } from "@/lib/types";
import { api } from "@/lib/api";
import { Sidebar } from "@/components/student/dashboard/sidebar";
import {
  WelcomeCard,
  StatsCards,
  QuickLinks,
  Deadlines,
  Schedule,
  AttendanceChart,
  NotificationBoard,
  ResourceHub,
  MobileEngagementCard,
} from "@/components/student/dashboard/components";
import { DashboardHeader } from "@/components/student/dashboard/components/header";
import DigiLockerWidget from "@/components/DigiLockerWidget";
import { Chatbot } from "@/components/ui/chatbot";
import { useToast } from "@/hooks/use-toast";
import { CourseList } from "@/components/student/dashboard/components/course-list";
import { IDCardModal } from "@/components/student/dashboard/components/IDCardModal";

// Loading component
const LoadingSpinner = () => (
  <div className="min-h-screen bg-[#0A0E27] flex items-center justify-center">
    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white"></div>
  </div>
);

export default function StudentDashboard() {
  const router = useRouter();
  const { toast } = useToast();
  const [student, setStudent] = useState<Student | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [grades, setGrades] = useState<Grade[]>([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [pendingTasks, setPendingTasks] = useState<PendingTask[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [showIDCardModal, setShowIDCardModal] = useState(false);

  useEffect(() => {
    // Instead of fetching from API, use mock data
    setStudent({
      id: 1,
      user_id: 1,
      ...mockStudent,
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
      {
        id: 6,
        code: "BIO 150",
        name: "Biology Fundamentals",
        schedule: "Tue,Thu,Fri 09:15-10:10",
        classroom: "F201",
        credits: 3,
        description: "",
        faculty_id: 7,
        created_at: "",
        updated_at: "",
      },
      {
        id: 7,
        code: "HIST 205",
        name: "World History",
        schedule: "Mon,Wed 15:15-16:10",
        classroom: "G301",
        credits: 3,
        description: "",
        faculty_id: 8,
        created_at: "",
        updated_at: "",
      },
      {
        id: 8,
        code: "ECON 101",
        name: "Principles of Economics",
        schedule: "Tue,Thu 11:15-12:10",
        classroom: "H101",
        credits: 3,
        description: "",
        faculty_id: 9,
        created_at: "",
        updated_at: "",
      },
      {
        id: 9,
        code: "PSY 200",
        name: "Psychology",
        schedule: "Mon,Fri 10:15-11:10",
        classroom: "I201",
        credits: 3,
        description: "",
        faculty_id: 10,
        created_at: "",
        updated_at: "",
      },
      {
        id: 10,
        code: "ART 110",
        name: "Digital Art",
        schedule: "Wed,Fri 13:15-14:10",
        classroom: "J101",
        credits: 2,
        description: "",
        faculty_id: 11,
        created_at: "",
        updated_at: "",
      },
      {
        id: 11,
        code: "MUS 120",
        name: "Music Theory",
        schedule: "Tue,Thu 15:15-16:10",
        classroom: "K201",
        credits: 2,
        description: "",
        faculty_id: 12,
        created_at: "",
        updated_at: "",
      },
      {
        id: 12,
        code: "PHIL 150",
        name: "Introduction to Philosophy",
        schedule: "Mon,Wed 12:15-13:10",
        classroom: "L301",
        credits: 3,
        description: "",
        faculty_id: 13,
        created_at: "",
        updated_at: "",
      },
    ]);
    setGrades([
      {
        id: 1,
        student_id: 1,
        course_id: 1,
        assignment_id: 1,
        marks_obtained: 88,
        feedback: "Well done",
        due_date: "2025-11-02",
        title: "Lab Report 4",
        total_marks: 100,
        created_at: "",
        updated_at: "",
      },
      {
        id: 2,
        student_id: 1,
        course_id: 2,
        assignment_id: 2,
        marks_obtained: 79,
        feedback: "Good",
        due_date: "2025-11-06",
        title: "Midterm Exam",
        total_marks: 100,
        created_at: "",
        updated_at: "",
      },
      {
        id: 3,
        student_id: 1,
        course_id: 3,
        assignment_id: 3,
        marks_obtained: 93,
        feedback: "Excellent",
        due_date: "2025-11-12",
        title: "Gatsby Essay Outline",
        total_marks: 100,
        created_at: "",
        updated_at: "",
      },
    ]);
    setAttendance([
      // Mock attendance for all 12 courses
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
      ...Array(13)
        .fill(0)
        .map((_, i) => ({
          id: 500 + i,
          student_id: 1,
          course_id: 6,
          date: `2025-10-${(i + 1).toString().padStart(2, "0")}`,
          status: (i % 4 === 0 ? "absent" : "present") as
            | "present"
            | "absent"
            | "late",
          created_at: "",
          updated_at: "",
        })),
      ...Array(10)
        .fill(0)
        .map((_, i) => ({
          id: 600 + i,
          student_id: 1,
          course_id: 7,
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
          id: 700 + i,
          student_id: 1,
          course_id: 8,
          date: `2025-10-${(i + 1).toString().padStart(2, "0")}`,
          status: (i % 6 === 0 ? "absent" : "present") as
            | "present"
            | "absent"
            | "late",
          created_at: "",
          updated_at: "",
        })),
      ...Array(12)
        .fill(0)
        .map((_, i) => ({
          id: 800 + i,
          student_id: 1,
          course_id: 9,
          date: `2025-10-${(i + 1).toString().padStart(2, "0")}`,
          status: (i % 3 === 0 ? "absent" : "present") as
            | "present"
            | "absent"
            | "late",
          created_at: "",
          updated_at: "",
        })),
      ...Array(9)
        .fill(0)
        .map((_, i) => ({
          id: 900 + i,
          student_id: 1,
          course_id: 10,
          date: `2025-10-${(i + 1).toString().padStart(2, "0")}`,
          status: (i % 4 === 0 ? "absent" : "present") as
            | "present"
            | "absent"
            | "late",
          created_at: "",
          updated_at: "",
        })),
      ...Array(11)
        .fill(0)
        .map((_, i) => ({
          id: 1000 + i,
          student_id: 1,
          course_id: 11,
          date: `2025-10-${(i + 1).toString().padStart(2, "0")}`,
          status: (i % 5 === 0 ? "absent" : "present") as
            | "present"
            | "absent"
            | "late",
          created_at: "",
          updated_at: "",
        })),
      ...Array(13)
        .fill(0)
        .map((_, i) => ({
          id: 1100 + i,
          student_id: 1,
          course_id: 12,
          date: `2025-10-${(i + 1).toString().padStart(2, "0")}`,
          status: (i % 6 === 0 ? "absent" : "present") as
            | "present"
            | "absent"
            | "late",
          created_at: "",
          updated_at: "",
        })),
    ]);
    setPendingTasks([
      {
        id: 1,
        title: "Finish lab report",
        course: "Modern Physics",
        dueDate: "2025-11-02",
        priority: "high",
      },
      {
        id: 2,
        title: "Read chapters 5-6",
        course: "Calculus II",
        dueDate: "2025-11-05",
        priority: "medium",
      },
      {
        id: 3,
        title: "Essay outline review",
        course: "Intro to Literature",
        dueDate: "2025-11-09",
        priority: "low",
      },
    ]);
    setLoading(false);
  }, [router]);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      // Re-fetch data
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const [courseRes, gradesRes] = await Promise.all([
        api.getCourses(),
        api.getStudentResults(user.id)
      ]);

      const coursesData = ((courseRes && (courseRes as any).data) ? (courseRes as any).data : courseRes) as Course[] || [];
      setCourses(coursesData);
      const gradesData = (gradesRes && (gradesRes as any).data) ? (gradesRes as any).data : gradesRes || [];
      setGrades(gradesData);

      const attendancePromises = coursesData.map(course =>
        api.getStudentAttendance(user.id, course.id)
      );
      const attendanceResults = await Promise.all(attendancePromises);
      const allAttendance = attendanceResults.flatMap((res: any) => (res && res.data) ? res.data : res || []);
      setAttendance(allAttendance as Attendance[]);

      toast({
        title: "Dashboard refreshed",
        description: "Your data has been updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Refresh failed",
        description: "Unable to refresh data. Please try again.",
      });
    } finally {
      setRefreshing(false);
    }
  };

  const handleQuickLinkClick = (link: string) => {
    toast({
      title: `${link} clicked`,
      description: `Navigating to ${link}...`,
    });
    // Here you would implement actual navigation
  };

  const handleCourseClick = (course: Course) => {
    setSelectedCourse(course);
    toast({
      title: course.name,
      description: `Viewing details for ${course.name}`,
    });
  };

  const filteredCourses = courses.filter(course =>
    course.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!student) {
    return (
      <div className="min-h-screen bg-[#0A0E27] flex items-center justify-center">
        <div className="text-white text-center">
          <h2 className="text-xl font-semibold mb-2">
            Unable to load student data
          </h2>
          <button
            onClick={() => router.push("/")}
            className="text-indigo-400 hover:underline"
          >
            Return to login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0E27] text-white flex-col flex dark:bg-[#f9fafb] dark:text-gray-900 transition-colors duration-300">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 w-full">
        <DashboardHeader
          student={student}
          onMenuClick={() => setSidebarOpen(true)}
          sidebarOpen={sidebarOpen}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onRefresh={handleRefresh}
          refreshing={refreshing}
          onIDCardClick={() => setShowIDCardModal(true)}
        />

        {/* Responsive Main Content */}
        <div className="p-2 sm:p-4 md:p-6 max-w-full md:max-w-[1600px] mx-auto transition-all duration-300">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {/* Left & Center Content */}
            <div className="sm:col-span-2 space-y-4 md:space-y-6">
              <WelcomeCard student={student} />
              <MobileEngagementCard
                attendance={attendance}
                courses={courses}
                pendingTasks={pendingTasks}
              />
              <StatsCards
                grades={grades}
                attendance={attendance}
                courses={courses}
                onStatClick={(stat) => toast({ title: stat, description: `Viewing ${stat} details` })}
              />
              <AttendanceChart
                courses={filteredCourses}
                attendance={attendance}
              />

              <CourseList
                courses={filteredCourses}
                attendance={attendance}
                onCourseClick={handleCourseClick}
              />

              <QuickLinks onLinkClick={handleQuickLinkClick} />
            </div>

            {/* Right Sidebar Widgets */}
            <div className="space-y-4 md:space-y-6">
              <Deadlines courses={courses} grades={grades} />
              <Schedule courses={courses} />
              <NotificationBoard
                courses={courses}
                grades={grades}
                attendance={attendance}
              />
              <ResourceHub />
              <DigiLockerWidget userType="student" />
            </div>
          </div>
        </div>
      </div>
      <Chatbot userType="student" userData={student} />
      <IDCardModal
        isOpen={showIDCardModal}
        onClose={() => setShowIDCardModal(false)}
        student={student}
      />
    </div>
  );
}
