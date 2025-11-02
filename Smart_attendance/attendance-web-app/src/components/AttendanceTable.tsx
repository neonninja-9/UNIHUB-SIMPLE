import React, { useEffect, useState } from "react";

interface Student {
  id: string;
  name: string;
  enrollment: string;
  descriptor: Float32Array;
}

interface AttendanceRecord {
  studentId: string;
  date: string;
  status: string;
}

interface AttendanceTableProps {
  students: Student[];
  attendance: { [key: string]: boolean };
}

const AttendanceTable: React.FC<AttendanceTableProps> = ({
  students,
  attendance,
}) => {
  const [attendanceRecords, setAttendanceRecords] = useState<
    AttendanceRecord[]
  >([]);

  // Fetch attendance records from backend
  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/attendance");
        const data = await response.json();
        setAttendanceRecords(data);
      } catch (error) {
        console.error("Error fetching attendance:", error);
      }
    };
    fetchAttendance();
  }, [attendance]); // Refetch when attendance changes

  // Get latest attendance status for each student
  const getLatestStatus = (studentId: string) => {
    const records = attendanceRecords.filter((r) => r.studentId === studentId);
    if (records.length === 0) return "Absent";
    const latest = records.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    )[0];
    return latest.status === "present" ? "Present" : "Absent";
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Attendance Table</h2>
      <div className="overflow-x-auto">
        <table className="w-full table-auto border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-4 py-2">Name</th>
              <th className="border border-gray-300 px-4 py-2">
                Enrollment No.
              </th>
              <th className="border border-gray-300 px-4 py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student.id} className="hover:bg-gray-50">
                <td className="border border-gray-300 px-4 py-2">
                  {student.name}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {student.enrollment}
                </td>
                <td
                  className={`border border-gray-300 px-4 py-2 ${getLatestStatus(student.id) === "Present" ? "text-green-600" : "text-red-600"}`}
                >
                  {getLatestStatus(student.id)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {students.length === 0 && (
        <p className="text-gray-500 mt-4">
          No students registered yet. Capture faces first.
        </p>
      )}
    </div>
  );
};

export default AttendanceTable;
