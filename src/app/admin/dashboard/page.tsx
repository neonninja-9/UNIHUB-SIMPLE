"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AdminLayout from "@/components/admin/admin-layout";
import { api } from "@/lib/api";

export default function AdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState({ totalStudents: 0, totalFaculty: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      router.push("/admin/login");
      return;
    }

    // Verify token is valid
    const verifyToken = async () => {
      try {
        await api.adminVerify();
        fetchStats();
      } catch (err) {
        localStorage.removeItem("adminToken");
        localStorage.removeItem("admin");
        router.push("/admin/login");
      }
    };

    verifyToken();
  }, [router]);

  const fetchStats = async () => {
    try {
      const response = await api.adminGetDashboardStats();
      if (response.success) {
        setStats(response.data);
      }
    } catch (err: any) {
      setError(err.message || "Failed to load dashboard statistics");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-600 dark:text-gray-400">Loading dashboard...</div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400">Welcome to the UniHub administration panel</p>
        </div>

        {error && (
          <div className="p-4 bg-red-100 dark:bg-red-900/20 border border-red-400 dark:border-red-500 text-red-700 dark:text-red-400 rounded-lg">
            {error}
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Students Card */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border-l-4 border-blue-500 dark:border-blue-400">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">Total Students</p>
                <p className="text-3xl font-bold text-gray-800 dark:text-gray-100 mt-2">{stats.totalStudents}</p>
              </div>
              <div className="bg-blue-100 dark:bg-blue-900/30 p-4 rounded-full">
                <span className="text-3xl">👨‍🎓</span>
              </div>
            </div>
            <button
              onClick={() => router.push("/admin/students")}
              className="mt-4 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm font-medium"
            >
              View All Students →
            </button>
          </div>

          {/* Faculty Card */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border-l-4 border-purple-500 dark:border-purple-400">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">Total Faculty</p>
                <p className="text-3xl font-bold text-gray-800 dark:text-gray-100 mt-2">{stats.totalFaculty}</p>
              </div>
              <div className="bg-purple-100 dark:bg-purple-900/30 p-4 rounded-full">
                <span className="text-3xl">👨‍🏫</span>
              </div>
            </div>
            <button
              onClick={() => router.push("/admin/faculty")}
              className="mt-4 text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 text-sm font-medium"
            >
              View All Faculty →
            </button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => router.push("/admin/students?action=add")}
              className="p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-blue-500 dark:hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition text-center"
            >
              <span className="text-2xl mb-2 block">➕</span>
              <p className="font-medium text-gray-700 dark:text-gray-300">Add Student</p>
            </button>
            <button
              onClick={() => router.push("/admin/faculty?action=add")}
              className="p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-purple-500 dark:hover:border-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition text-center"
            >
              <span className="text-2xl mb-2 block">➕</span>
              <p className="font-medium text-gray-700 dark:text-gray-300">Add Faculty</p>
            </button>
            <button
              onClick={fetchStats}
              className="p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-green-500 dark:hover:border-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 transition text-center"
            >
              <span className="text-2xl mb-2 block">🔄</span>
              <p className="font-medium text-gray-700 dark:text-gray-300">Refresh Stats</p>
            </button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

