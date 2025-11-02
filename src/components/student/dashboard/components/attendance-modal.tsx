"use client";

import React from "react";
import { Attendance, Course } from "@/lib/types";
import { X, Calendar, CheckCircle, XCircle, Clock } from "lucide-react";

interface AttendanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  attendance: Attendance[];
  courses: Course[];
}

export function AttendanceModal({
  isOpen,
  onClose,
  attendance,
  courses,
}: AttendanceModalProps) {
  if (!isOpen) return null;

  const getCourseName = (courseId: number) => {
    const course = courses.find((c) => c.id === courseId);
    return course ? `${course.code} - ${course.name}` : `Course ${courseId}`;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "present":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "absent":
        return <XCircle className="w-4 h-4 text-red-500" />;
      case "late":
        return <Clock className="w-4 h-4 text-yellow-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "present":
        return "text-green-600 bg-green-100 dark:bg-green-900 dark:text-green-200";
      case "absent":
        return "text-red-600 bg-red-100 dark:bg-red-900 dark:text-red-200";
      case "late":
        return "text-yellow-600 bg-yellow-100 dark:bg-yellow-900 dark:text-yellow-200";
      default:
        return "text-gray-600 bg-gray-100 dark:bg-gray-700 dark:text-gray-200";
    }
  };

  // Group attendance by course
  const groupedAttendance = attendance.reduce((acc, record) => {
    if (!acc[record.course_id]) {
      acc[record.course_id] = [];
    }
    acc[record.course_id].push(record);
    return acc;
  }, {} as Record<number, Attendance[]>);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            My Attendance
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {Object.keys(groupedAttendance).length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400">
                No attendance records found.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {Object.entries(groupedAttendance).map(([courseId, records]) => {
                const courseName = getCourseName(Number(courseId));
                const totalClasses = records.length;
                const presentClasses = records.filter(
                  (r) => r.status === "present"
                ).length;
                const attendancePercentage = totalClasses
                  ? Math.round((presentClasses / totalClasses) * 100)
                  : 0;

                return (
                  <div
                    key={courseId}
                    className="border border-gray-200 dark:border-gray-700 rounded-lg p-4"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {courseName}
                      </h3>
                      <div className="text-right">
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {presentClasses}/{totalClasses} classes
                        </div>
                        <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
                          {attendancePercentage}%
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {records
                        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                        .map((record) => (
                          <div
                            key={record.id}
                            className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                          >
                            <div className="flex items-center gap-3">
                              {getStatusIcon(record.status)}
                              <div>
                                <div className="text-sm font-medium text-gray-900 dark:text-white">
                                  {new Date(record.date).toLocaleDateString()}
                                </div>
                                <div className={`text-xs px-2 py-1 rounded-full ${getStatusColor(record.status)}`}>
                                  {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
