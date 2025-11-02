import { Search, Bell, Moon, Menu, Sun, RefreshCw } from "lucide-react";
import { Student } from "@/lib/types";
import { useTheme } from "@/hooks/use-theme";

interface HeaderProps {
  student?: Student;
  onMenuClick: () => void;
  sidebarOpen: boolean;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  onRefresh?: () => void;
  refreshing?: boolean;
}

export function DashboardHeader({
  student,
  onMenuClick,
  sidebarOpen,
  searchQuery = "",
  onSearchChange,
  onRefresh,
  refreshing = false,
}: HeaderProps) {
  const { darkMode, setDarkMode } = useTheme();

  return (
    <header className="bg-[#1A1F3A] border-b border-gray-800 dark:bg-white dark:border-gray-200 shadow-lg dark:shadow-[0_4px_12px_rgba(0,0,0,0.08)]">
      <div className="px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <button
            onClick={onMenuClick}
            className="p-2 hover:bg-gray-800 rounded-lg dark:hover:bg-gray-200"
          >
            <Menu className="w-6 h-6 text-gray-400 dark:text-gray-600" />
          </button>
          {!sidebarOpen && (
            <>
              <h1 className="text-xl font-bold text-blue-400 dark:text-blue-600">
                UNIHUB
              </h1>
              <span className="text-gray-400 text-sm dark:text-gray-600">
                Student Portal
              </span>
            </>
          )}
        </div>

        <div className="flex-1 max-w-2xl mx-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 dark:text-gray-600" />
            <input
              type="text"
              placeholder="Search courses..."
              value={searchQuery}
              onChange={(e) => onSearchChange?.(e.target.value)}
              className="w-full bg-[#0A0E27] border border-gray-700 rounded-lg pl-10 pr-4 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors dark:bg-white dark:border-gray-300 dark:text-gray-900 dark:placeholder-gray-500"
            />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={onRefresh}
            disabled={refreshing}
            className="p-2 hover:bg-gray-800 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed dark:hover:bg-gray-200 transition-colors"
          >
            <RefreshCw className={`w-5 h-5 text-gray-400 dark:text-gray-600 ${refreshing ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={() => setDarkMode?.(!darkMode)}
            className="p-2 hover:bg-gray-800 rounded-lg dark:hover:bg-gray-200"
            aria-label="Toggle dark mode"
            disabled={!setDarkMode}
            title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            {darkMode ? (
              <Sun className="w-5 h-5 text-gray-400 dark:text-gray-600" />
            ) : (
              <Moon className="w-5 h-5 text-gray-400 dark:text-gray-600" />
            )}
          </button>
          <button className="p-2 hover:bg-gray-800 rounded-lg relative dark:hover:bg-gray-200 transition-colors">
            <Bell className="w-5 h-5 text-gray-400 dark:text-gray-600" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
          <div className="flex items-center gap-2 ml-2">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center font-bold">
              {student?.name?.slice(0, 2).toUpperCase() || "ST"}
            </div>
            <div className="text-sm">
              <div className="font-semibold text-white dark:text-gray-900">
                {student?.name || "Loading..."}
              </div>
              <div className="text-gray-400 text-xs dark:text-gray-600">
                Student
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
