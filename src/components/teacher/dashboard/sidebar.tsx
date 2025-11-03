import {
  Book,
  BookOpen,
  CalendarDays,
  FileSignature,
  LayoutDashboard,
  LogOut,
  Settings,
  Users,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";

export function Sidebar({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
}) {
  const router = useRouter();
  const navItems = [
    { icon: LayoutDashboard, label: "Dashboard", active: true },
    { icon: BookOpen, label: "My Courses" },
    { icon: Users, label: "Students" },
    { icon: FileSignature, label: "Grades" },
    { icon: CalendarDays, label: "Calendar" },
    { icon: Settings, label: "Settings" },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      <div
        className={`fixed inset-0 bg-black/60 z-30 lg:hidden ${isOpen ? "block" : "hidden"}`}
        onClick={() => setIsOpen(false)}
      ></div>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 shadow-xl z-40
                     transform transition-transform duration-300 ease-in-out lg:translate-x-0
                     ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <Book className="w-8 h-8 text-blue-600" />
            <span className="text-xl font-bold">Guru</span>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="lg:hidden text-gray-500 hover:text-gray-800 dark:hover:text-white"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <nav className="flex flex-col justify-between h-[calc(100%-57px)] p-4">
          {/* Top Nav Items */}
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.label}>
                <a
                  href="#"
                  className={`flex items-center gap-3 p-3 rounded-lg font-medium transition-colors
                                ${
                                  item.active
                                    ? "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300"
                                    : "hover:bg-gray-100 dark:hover:bg-gray-800"
                                }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </a>
              </li>
            ))}
          </ul>

          {/* Bottom Logout */}
          <ul>
            <li>
              <button
                onClick={() => {
                  localStorage.clear();
                  router.push("/");
                }}
                className="flex items-center gap-3 w-full p-3 rounded-lg font-medium text-red-600 dark:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/50 transition-colors"
              >
                <LogOut className="w-5 h-5" />
                <span>Logout</span>
              </button>
            </li>
          </ul>
        </nav>
      </aside>
    </>
  );
}
