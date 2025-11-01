// User types
export interface User {
  id: number;
  username: string;
  role: "student" | "faculty";
  email: string;
  name: string;
  created_at: string;
  updated_at: string;
}

// Student types
export interface Student {
  id: number;
  user_id: number;
  name: string;
  roll_number: string;
  class_section: string;
  phone: string;
  address: string;
  parent_name: string;
  parent_phone: string;
  email: string;
}

// Faculty types
export interface Faculty {
  id: number;
  user_id: number;
  employee_id: string;
  department: string;
  phone: string;
  address: string;
  specialization: string;
}

// Course types
export interface Course {
  id: number;
  code: string;
  name: string;
  description: string;
  faculty_id: number;
  credits: number;
  schedule: string;
  classroom: string;
  created_at: string;
  updated_at: string;
}

// Assignment types
export interface Assignment {
  id: number;
  course_id: number;
  title: string;
  description: string;
  due_date: string;
  total_marks: number;
  created_at: string;
  updated_at: string;
}

// Grade types
export interface Grade {
  id: number;
  student_id: number;
  course_id: number;
  assignment_id: number;
  marks_obtained: number | null;
  feedback: string;
  due_date: string;
  title: string;
  total_marks: number;
  created_at: string;
  updated_at: string;
}

// Attendance types
export interface Attendance {
  id: number;
  student_id: number;
  course_id: number;
  date: string;
  status: "present" | "absent" | "late";
  created_at: string;
  updated_at: string;
}

export interface PendingTask {
  id: number;
  title: string;
  course: string;
  dueDate: string;
  priority?: "low" | "medium" | "high";
}

// Event types
export interface Event {
  id: number;
  title: string;
  description: string;
  date: string;
  type: "academic" | "cultural" | "sports" | "other";
  created_at: string;
  updated_at: string;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

export interface LoginResponse {
  success: boolean;
  message?: string;
  user?: User;
  token?: string;
  error?: string;
}

export interface TeachingAssignment {
  course_id: number;
  course_name: string;
  credits: number;
  schedule: string;
  department: string;
}

export interface ErrorResponse {
  success: false;
  error: string;
}
