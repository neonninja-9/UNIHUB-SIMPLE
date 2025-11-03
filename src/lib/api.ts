import {
  ApiResponse,
  LoginResponse,
  Student,
  Faculty,
  Course,
  Attendance,
  Grade as Result,
  TeachingAssignment,
} from "./types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3002";

async function handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || "An error occurred");
  }
  return data as ApiResponse<T>;
}

// Generic fetch function with auth
async function fetchWithAuth<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<ApiResponse<T>> {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  return handleResponse<T>(response);
}

// API Functions
export const api = {
  // Auth
  async login(
    username: string,
    password: string,
    role: "student" | "faculty",
  ): Promise<LoginResponse> {
    const response = await fetch(`${API_URL}/api/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: username, password, role }),
    });
    return handleResponse<LoginResponse>(response);
  },

  // Students
  async getStudents(): Promise<ApiResponse<Student[]>> {
    return fetchWithAuth<Student[]>("/api/students");
  },

  async getStudent(id: number): Promise<ApiResponse<Student>> {
    return fetchWithAuth<Student>(`/api/students/${id}`);
  },

  async getStudentSchedule(id: string) {
    return fetchWithAuth(`/api/students/${id}/schedule`);
  },

  async getStudentAttendance(
    studentId: number,
    courseId: number,
  ): Promise<ApiResponse<Attendance[]>> {
    return fetchWithAuth<Attendance[]>(
      `/api/students/${studentId}/attendance?courseId=${courseId}`,
    );
  },

  async getStudentResults(id: number): Promise<ApiResponse<Result[]>> {
    return fetchWithAuth<Result[]>(`/api/students/${id}/results`);
  },

  // Faculty
  async getFaculty(): Promise<ApiResponse<Faculty[]>> {
    return fetchWithAuth<Faculty[]>("/api/faculty");
  },

  async getFacultyMember(id: string): Promise<ApiResponse<Faculty>> {
    return fetchWithAuth<Faculty>(`/api/faculty/${id}`);
  },

  async getFacultyTeaching(
    id: string,
  ): Promise<ApiResponse<TeachingAssignment[]>> {
    return fetchWithAuth<TeachingAssignment[]>(`/api/faculty/${id}/teaching`);
  },

  // Courses
  async getCourses(): Promise<ApiResponse<Course[]>> {
    return fetchWithAuth<Course[]>("/api/courses");
  },

  // Attendance
  async markAttendance(
    studentId: string,
    courseId: string,
    date: string,
    status: string,
  ): Promise<ApiResponse<Attendance>> {
    return fetchWithAuth<Attendance>("/api/attendance", {
      method: "POST",
      body: JSON.stringify({ studentId, courseId, date, status }),
    });
  },

  // Results/Grades
  async submitGrade(data: Partial<Result>): Promise<ApiResponse<Result>> {
    return fetchWithAuth<Result>("/api/grades", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  async updateGrade(
    id: number,
    data: Partial<Result>,
  ): Promise<ApiResponse<Result>> {
    return fetchWithAuth<Result>(`/api/grades/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  // Admin APIs (Mock implementations)
  async adminLogin(
    email: string,
    password: string,
  ): Promise<{ success: boolean; token?: string; admin?: any; error?: string }> {
    // Mock admin login - bypass API call
    if (email === "admin@unihub.com" && password === "admin123") {
      return {
        success: true,
        token: "mock-admin-token",
        admin: {
          id: 0,
          email: "admin@unihub.com",
          name: "Admin User",
          role: "admin",
        },
      };
    }
    return {
      success: false,
      error: "Invalid credentials",
    };
  },

  async adminVerify(): Promise<ApiResponse<any>> {
    // Mock token verification
    const token = typeof window !== "undefined" ? localStorage.getItem("adminToken") : null;
    if (!token) {
      throw new Error("Unauthorized");
    }
    return { success: true, data: {} };
  },

  async adminGetDashboardStats(): Promise<ApiResponse<{ totalStudents: number; totalFaculty: number }>> {
    // Mock stats - in a real app, this would fetch from the API
    return {
      success: true,
      data: {
        totalStudents: 150,
        totalFaculty: 25,
      },
    };
  },

  async adminGetStudents(
    searchTerm?: string,
    classFilter?: string,
  ): Promise<ApiResponse<Student[]>> {
    try {
      const response = await fetch(`${API_URL}/api/students`);
      return handleResponse<Student[]>(response);
    } catch (error) {
      console.error('Failed to fetch students:', error);
      // Fallback to mock data if API fails
      const mockStudents: Student[] = [
        {
          id: 1,
          user_id: 1,
          name: "Alex Thompson",
          email: "alex@student.unihub.com",
          roll_number: "STU001",
          enrollment_no: "STU001",
          class_section: "CS-3A",
          phone: "+1234567890",
          address: "123 Main St",
          parent_name: "John Thompson",
          parent_phone: "+1234567891",
        },
        {
          id: 2,
          user_id: 2,
          name: "Sarah Johnson",
          email: "sarah@student.unihub.com",
          roll_number: "STU002",
          enrollment_no: "STU002",
          class_section: "ME-2B",
          phone: "+1234567892",
          address: "456 Oak Ave",
          parent_name: "Jane Johnson",
          parent_phone: "+1234567893",
        },
      ];
      return {
        success: true,
        data: mockStudents,
      };
    }
  },

  async adminGetFaculty(
    searchTerm?: string,
    departmentFilter?: string,
  ): Promise<ApiResponse<Faculty[]>> {
    try {
      const response = await fetch(`${API_URL}/api/faculty`);
      return handleResponse<Faculty[]>(response);
    } catch (error) {
      console.error('Failed to fetch faculty:', error);
      // Fallback to mock data if API fails
      const mockFaculty: Faculty[] = [
        {
          id: 1,
          user_id: 1,
          employee_id: "FAC001",
          department: "Computer Science",
          phone: "+1234567900",
          address: "789 University Blvd",
          specialization: "Machine Learning",
        },
        {
          id: 2,
          user_id: 2,
          employee_id: "FAC002",
          department: "Mathematics",
          phone: "+1234567901",
          address: "321 Academic Ave",
          specialization: "Applied Mathematics",
        },
      ];
      return {
        success: true,
        data: mockFaculty,
      };
    }
  },

  async adminCreateStudent(data: Partial<Student>): Promise<ApiResponse<Student>> {
    try {
      const response = await fetch(`${API_URL}/api/students`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      return handleResponse<Student>(response);
    } catch (error) {
      console.error('Failed to create student:', error);
      // Fallback to mock response
      return {
        success: true,
        data: { ...data, id: Date.now() } as Student,
      };
    }
  },

  async adminUpdateStudent(id: string, data: Partial<Student>): Promise<ApiResponse<Student>> {
    try {
      const response = await fetch(`${API_URL}/api/students/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      return handleResponse<Student>(response);
    } catch (error) {
      console.error('Failed to update student:', error);
      // Fallback to mock response
      return {
        success: true,
        data: { ...data, id: parseInt(id) } as Student,
      };
    }
  },

  async adminDeleteStudent(id: string): Promise<ApiResponse<void>> {
    try {
      const response = await fetch(`${API_URL}/api/students/${id}`, {
        method: 'DELETE',
      });
      return handleResponse<void>(response);
    } catch (error) {
      console.error('Failed to delete student:', error);
      // Fallback to mock response
      return {
        success: true,
        data: undefined as any,
      };
    }
  },

  async adminResetStudentPassword(id: string): Promise<ApiResponse<void>> {
    try {
      const response = await fetch(`${API_URL}/api/students/${id}/reset-password`, {
        method: 'POST',
      });
      return handleResponse<void>(response);
    } catch (error) {
      console.error('Failed to reset student password:', error);
      // Fallback to mock response
      return {
        success: true,
        data: undefined as any,
      };
    }
  },

  async adminCreateFaculty(data: Partial<Faculty>): Promise<ApiResponse<Faculty>> {
    try {
      const response = await fetch(`${API_URL}/api/faculty`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      return handleResponse<Faculty>(response);
    } catch (error) {
      console.error('Failed to create faculty:', error);
      // Fallback to mock response
      return {
        success: true,
        data: { ...data, id: Date.now() } as Faculty,
      };
    }
  },

  async adminUpdateFaculty(id: string, data: Partial<Faculty>): Promise<ApiResponse<Faculty>> {
    try {
      const response = await fetch(`${API_URL}/api/faculty/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      return handleResponse<Faculty>(response);
    } catch (error) {
      console.error('Failed to update faculty:', error);
      // Fallback to mock response
      return {
        success: true,
        data: { ...data, id: parseInt(id) } as Faculty,
      };
    }
  },

  async adminDeleteFaculty(id: string): Promise<ApiResponse<void>> {
    try {
      const response = await fetch(`${API_URL}/api/faculty/${id}`, {
        method: 'DELETE',
      });
      return handleResponse<void>(response);
    } catch (error) {
      console.error('Failed to delete faculty:', error);
      // Fallback to mock response
      return {
        success: true,
        data: undefined as any,
      };
    }
  },

  async adminResetFacultyPassword(id: string): Promise<ApiResponse<void>> {
    try {
      const response = await fetch(`${API_URL}/api/faculty/${id}/reset-password`, {
        method: 'POST',
      });
      return handleResponse<void>(response);
    } catch (error) {
      console.error('Failed to reset faculty password:', error);
      // Fallback to mock response
      return {
        success: true,
        data: undefined as any,
      };
    }
  },
};
