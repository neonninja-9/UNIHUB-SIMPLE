import React from "react";

export function StatCard({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ComponentType<any>;
  label: string;
  value: number;
  color: string;
}) {
  const colors: Record<string, string> = {
    blue: "text-blue-600 bg-blue-100 dark:bg-blue-900/50 dark:text-blue-300",
    green:
      "text-green-600 bg-green-100 dark:bg-green-900/50 dark:text-green-300",
    yellow:
      "text-yellow-600 bg-yellow-100 dark:bg-yellow-900/50 dark:text-yellow-300",
  };
  const Icon = icon;

  return (
    <div className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-sm flex items-center gap-4">
      <div className={`p-3 rounded-full ${colors[color] || colors.blue}`}>
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <span className="text-3xl font-bold text-gray-800 dark:text-gray-100">
          {value}
        </span>
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
          {label}
        </p>
      </div>
    </div>
  );
}
