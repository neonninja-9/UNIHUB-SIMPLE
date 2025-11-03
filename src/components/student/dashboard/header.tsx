"use client";
import React from "react";
import { useTheme } from "@/hooks/use-theme";
import { Sun, Moon, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  onMenuClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  const { darkMode, setDarkMode } = useTheme();

  return (
    <header className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 shadow-md">
      <div className="flex items-center">
        <Button
          variant="ghost"
          size="icon"
          onClick={onMenuClick}
          className="md:hidden"
        >
          <Menu className="w-6 h-6" />
        </Button>
        <h1 className="text-xl font-bold ml-4">Student Portal</h1>
      </div>
      <div className="flex items-center">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setDarkMode(!darkMode)}
        >
          {darkMode ? (
            <Sun className="w-6 h-6" />
          ) : (
            <Moon className="w-6 h-6" />
          )}
        </Button>
      </div>
    </header>
  );
};
