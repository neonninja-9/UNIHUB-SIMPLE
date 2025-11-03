import { mockStudentUpcomingEvents } from "@/lib/student-mock-data";
import {
  AlertCircle,
  CalendarDays,
  FileText,
  CheckCircle,
  Clock,
} from "lucide-react";

const eventIcons: Record<string, JSX.Element> = {
  exam: <FileText className="w-5 h-5 text-red-500" />,
  quiz: <CheckCircle className="w-5 h-5 text-blue-500" />,
  reminder: <AlertCircle className="w-5 h-5 text-yellow-500" />,
};

export const UpcomingEvents = () => {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
      <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">
        Upcoming Events
      </h3>
      <ul className="space-y-4">
        {mockStudentUpcomingEvents.map((event) => (
          <li key={event.id} className="flex items-start gap-4">
            <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-full mt-1">
              {eventIcons[event.type] || (
                <CalendarDays className="w-5 h-5 text-gray-500" />
              )}
            </div>
            <div>
              <p className="font-medium text-gray-800 dark:text-gray-200">
                {event.title}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                {event.time}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};
