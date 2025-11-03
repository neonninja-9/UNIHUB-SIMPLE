"use client";

import React from "react";
import { Sidebar } from "@/components/student/dashboard/sidebar";
import { DashboardHeader } from "@/components/student/dashboard/components/header";
import DigiLockerWidget from "@/components/DigiLockerWidget";

export default function DigiLockerPage() {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  // Mock student data - in real app, get from auth context
  const student = {
    id: 1,
    user_id: 1,
    name: "Alex Doe",
    roll_number: "S101",
    class_section: "CS-A",
    phone: "+91-9876543210",
    address: "Delhi, India",
    parent_name: "John Doe",
    parent_phone: "+91-9876543211",
    email: "alex.doe@unihub.com",
  };

  return (
    <div className="min-h-screen bg-[#0A0E27] text-white flex">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 w-full">
        <DashboardHeader
          student={student}
          onMenuClick={() => setSidebarOpen(true)}
          sidebarOpen={sidebarOpen}
        />
        <div className="p-4 md:p-6 max-w-4xl mx-auto">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-white mb-2">DigiLocker</h1>
            <p className="text-gray-400">
              Access and manage your verified documents from DigiLocker
            </p>
          </div>
          <DigiLockerWidget userType="student" />
        </div>
      </div>
    </div>
  );
}
