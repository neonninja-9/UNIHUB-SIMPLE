import { mockTeacher } from "@/lib/mock-data";
import { Bell, ChevronDown, Menu, Moon, Search, Sun } from "lucide-react";
import { useTheme } from "@/hooks/use-theme";

export function Header({ onMenuClick }: { onMenuClick: () => void }) {
  const { darkMode, setDarkMode } = useTheme();

  return (
    <header className="sticky top-0 z-20 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between h-16 px-4 md:px-8">
        {/* Left Side: Mobile Menu & Search */}
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuClick}
            className="lg:hidden text-gray-600 dark:text-gray-300"
          >
            <Menu className="w-6 h-6" />
          </button>

          <div className="relative hidden sm:block">
            <input
              type="text"
              placeholder="Search courses, students..."
              className="pl-10 pr-4 py-2 w-64 bg-gray-100 dark:bg-gray-800 border border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          </div>
        </div>

        {/* Right Side: Actions & Profile */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white"
          >
            {darkMode ? (
              <Sun className="w-5 h-5" />
            ) : (
              <Moon className="w-5 h-5" />
            )}
          </button>

          <button className="relative text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white">
            <Bell className="w-5 h-5" />
            {mockTeacher.notifications > 0 && (
              <span className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                {mockTeacher.notifications}
              </span>
            )}
          </button>

          <div className="flex items-center gap-3">
            <img
              src={mockTeacher.avatarUrl}
              alt="User Avatar"
              className="w-9 h-9 rounded-full object-cover border-2 border-gray-300 dark:border-gray-600"
              onError={(e) =>
                ((e.target as HTMLImageElement).src =
                  "https://placehold.co/100x100/E2E8F0/4A5568?text=ER")
              }
            />
            <div className="hidden md:block">
              <span className="font-semibold text-sm text-gray-800 dark:text-gray-200">
                {mockTeacher.name}
              </span>
              <p className="text-xs text-gray-500">Teacher</p>
            </div>
            <ChevronDown className="w-4 h-4 text-gray-400 hidden md:block" />
          </div>
        </div>
      </div>
    </header>
  );
}
