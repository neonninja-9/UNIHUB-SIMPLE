import {
  AlertCircle,
  CalendarDays,
  Clock,
  FileText,
  Users,
} from "lucide-react";

export function UpcomingEventsWidget({ events }: { events: any[] }) {
  const eventIcons: Record<string, JSX.Element> = {
    exam: <FileText className="w-5 h-5 text-red-500" />,
    meeting: <Users className="w-5 h-5 text-blue-500" />,
    reminder: <AlertCircle className="w-5 h-5 text-yellow-500" />,
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm col-span-1">
      <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">
        Upcoming Events
      </h2>
      <ul className="space-y-4">
        {events.map((event: any) => (
          <li key={event.id} className="flex items-start gap-4">
            <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-full mt-1">
              {eventIcons[event.type] || (
                <CalendarDays className="w-5 h-5 text-gray-500" />
              )}
            </div>
            <div>
              <h3 className="font-medium text-gray-800 dark:text-gray-200">
                {event.title}
              </h3>
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
}
