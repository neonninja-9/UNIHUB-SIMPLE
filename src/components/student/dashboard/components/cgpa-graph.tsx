import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface CGPAGraphProps {
  onClose: () => void;
}

// Mock CGPA data for semesters 1-10
const cgpaData = [
  { semester: 1, cgpa: 7.2 },
  { semester: 2, cgpa: 7.8 },
  { semester: 3, cgpa: 8.1 },
  { semester: 4, cgpa: 7.9 },
  { semester: 5, cgpa: 8.3 },
  { semester: 6, cgpa: 8.5 },
  { semester: 7, cgpa: 8.2 },
  { semester: 8, cgpa: 8.7 },
  { semester: 9, cgpa: 8.4 },
  { semester: 10, cgpa: 8.6 },
];

export function CGPAGraph({ onClose }: CGPAGraphProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-[#1A1F3A] dark:bg-white rounded-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white dark:text-gray-900">
            CGPA Progression
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white dark:text-gray-600 dark:hover:text-gray-900 text-2xl"
          >
            ×
          </button>
        </div>

        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={cgpaData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis
                dataKey="semester"
                stroke="#9CA3AF"
                label={{
                  value: "Semester",
                  position: "insideBottom",
                  offset: -5,
                  style: { textAnchor: "middle", fill: "#9CA3AF" },
                }}
              />
              <YAxis
                stroke="#9CA3AF"
                domain={[0, 10]}
                label={{
                  value: "CGPA",
                  angle: -90,
                  position: "insideLeft",
                  style: { textAnchor: "middle", fill: "#9CA3AF" },
                }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1A1F3A",
                  border: "1px solid #374151",
                  borderRadius: "8px",
                  color: "#FFFFFF",
                }}
                labelStyle={{ color: "#FFFFFF" }}
              />
              <Bar
                dataKey="cgpa"
                fill="#3B82F6"
                radius={[4, 4, 0, 0]}
                name="CGPA"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-4 text-center text-gray-400 dark:text-gray-600 text-sm">
          Click outside or press × to close
        </div>
      </div>
    </div>
  );
}
