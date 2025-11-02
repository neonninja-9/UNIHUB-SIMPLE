import React from "react";

interface ClassSchedule {
  time: string;
  subject: string;
  course: string;
  room: string;
}

const classes: ClassSchedule[] = [
  {
    time: "09:15 - 10:10",
    subject: "Attendance Taken",
    course: "BCA (Hons./Hons. with Research) I Semester",
    room: "A-2[A1]"
  },
  {
    time: "10:15 - 11:10",
    subject: "Attendance Taken",
    course: "B.Sc. (Computer Science) I Semester",
    room: "A-2[A2]"
  },
  {
    time: "11:15 - 12:10",
    subject: "Design and Analysis",
    course: "B.Tech (CSE) V Semester [Batch C - 2[C]]",
    room: "104"
  },
  {
    time: "12:15 - 13:10",
    subject: "Design and Analysis",
    course: "B.Tech (CSE) V Semester [Batch E - 1[E]]",
    room: "108"
  },
  {
    time: "15:15 - 16:10",
    subject: "Design and Analysis",
    course: "B.Tech (CSE) V Semester [Batch E - 1[E]]",
    room: "108"
  },
  {
    time: "16:15 - 17:10",
    subject: "Design and Analysis",
    course: "B.Tech (CSE) V Semester [Batch E - 1[E]]",
    room: "108"
  }
];

export function ScheduledClassesWidget() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">
        Scheduled Classes
      </h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-gray-700 dark:text-gray-300 uppercase bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3">Time</th>
              <th className="px-6 py-3">Subject</th>
              <th className="px-6 py-3">Course</th>
              <th className="px-6 py-3">Room</th>
            </tr>
          </thead>
          <tbody>
            {classes.map((cls, i) => (
              <tr key={i} className="bg-white dark:bg-gray-800 border-b dark:border-gray-700">
                <td className="px-6 py-4 font-medium text-gray-900 dark:text-gray-100 whitespace-nowrap">
                  {cls.time}
                </td>
                <td className="px-6 py-4 text-gray-700 dark:text-gray-300">
                  {cls.subject}
                </td>
                <td className="px-6 py-4 text-gray-700 dark:text-gray-300">
                  {cls.course}
                </td>
                <td className="px-6 py-4 text-gray-700 dark:text-gray-300">
                  {cls.room}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
