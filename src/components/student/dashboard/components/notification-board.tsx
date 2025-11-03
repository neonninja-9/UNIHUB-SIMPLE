import { Course, Grade, Attendance } from "@/lib/types";

interface NotificationBoardProps {
  courses: Course[];
  grades: Grade[];
  attendance: Attendance[];
}

export function NotificationBoard({
  courses,
  grades,
  attendance,
}: NotificationBoardProps) {
  const generateNotifications = () => {
    const notifications = [];
    const today = new Date();
    const twoDaysFromNow = new Date(today);
    twoDaysFromNow.setDate(today.getDate() + 2);

    // Assignment due notifications
    grades.forEach((grade) => {
      if (!grade.marks_obtained) {
        // Not graded yet, so due
        const dueDate = new Date(grade.due_date);
        if (dueDate <= twoDaysFromNow && dueDate >= today) {
          const course = courses.find((c) => c.id === grade.course_id);
          const diffDays = Math.ceil(
            (dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
          );
          notifications.push({
            id: `assignment-${grade.id}`,
            title: "Assignment Due Soon",
            message: `${grade.title} for ${course?.name || "Unknown Course"} is due in ${diffDays} day${diffDays === 1 ? "" : "s"}`,
            time:
              diffDays === 0
                ? "Today"
                : `${diffDays} day${diffDays === 1 ? "" : "s"} ago`,
            type: diffDays <= 1 ? "warning" : "info",
          });
        }
      }
    });

    // Current class absent notifications
    const todayStr = today.toISOString().split("T")[0];
    attendance.forEach((att) => {
      if (att.date === todayStr && att.status === "absent") {
        const course = courses.find((c) => c.id === att.course_id);
        notifications.push({
          id: `absent-${att.id}`,
          title: "Class Absence Detected",
          message: `You were marked absent for ${course?.name || "Unknown Course"} today`,
          time: "Today",
          type: "warning",
        });
      }
    });

    // Static notifications for now (can be removed or made dynamic later)
    notifications.push(
      {
        id: "static-1",
        title: "Class Cancelled",
        message: "Physics class on Friday is cancelled",
        time: "1 day ago",
        type: "info",
      },
      {
        id: "static-2",
        title: "Grade Posted",
        message: "Your Chemistry grade has been posted",
        time: "3 days ago",
        type: "success",
      },
    );

    return notifications;
  };

  const notifications = generateNotifications();

  return (
    <div className="bg-[#1A1F3A] rounded-xl p-6 dark:bg-white dark:border dark:border-gray-200">
      <h3 className="text-xl font-bold mb-4 text-white dark:text-gray-900">
        Notifications
      </h3>
      <div className="space-y-4">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className="border-l-4 border-blue-500 pl-4 py-2"
          >
            <div className="flex justify-between items-start">
              <div>
                <h4 className="text-sm font-semibold text-white dark:text-gray-900">
                  {notification.title}
                </h4>
                <p className="text-xs text-gray-300 mt-1 dark:text-gray-600">
                  {notification.message}
                </p>
              </div>
              <span className="text-xs text-gray-500 dark:text-gray-500">
                {notification.time}
              </span>
            </div>
          </div>
        ))}
      </div>
      <button className="w-full text-center text-blue-400 hover:text-blue-300 text-sm mt-4 dark:text-blue-600 dark:hover:text-blue-700">
        View All Notifications
      </button>
    </div>
  );
}
