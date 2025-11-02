"use client";
import React, { useState } from "react";
import {
  Home,
  Calendar,
  FileText,
  Book,
  ClipboardList,
  Clock,
  Users,
  Calculator,
  Briefcase,
  DollarSign,
  IdCard,
  MessageSquare,
  Globe,
  BookOpen,
  GraduationCap,
  Wifi,
  Trophy,
  Zap,
  Bus,
  DoorOpen,
  LogOut,
  ChevronDown,
  ChevronUp,
  Menu,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onToggle?: () => void;
  activeItem?: string;
  onItemClick?: (item: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  onToggle,
  activeItem = "",
  onItemClick,
}) => {
  const router = useRouter();
  const [expandedMenus, setExpandedMenus] = useState<Set<string>>(new Set());

  const toggleMenu = (menu: string) => {
    const newExpanded = new Set(expandedMenus);
    if (newExpanded.has(menu)) {
      newExpanded.delete(menu);
    } else {
      newExpanded.add(menu);
    }
    setExpandedMenus(newExpanded);
  };

  const handleItemClick = (item: string) => {
    if (onItemClick) onItemClick(item);
  };

  const menuItems = [
    { id: "home", label: "Home", icon: Home },
    { id: "calendar", label: "My Calendar", icon: Calendar },
    { id: "sap", label: "SAP", icon: FileText },
    { id: "courses", label: "My Courses", icon: Book },
    { id: "registration", label: "Registration", icon: ClipboardList },
    { id: "timetable", label: "Time Table", icon: Clock },
    { id: "faculty", label: "My Faculty", icon: Users },
    {
      id: "examination",
      label: "Examination",
      icon: Calculator,
      expandable: true,
      subItems: ["View Results", "Exam Schedule"],
    },
    {
      id: "placement",
      label: "OS & ATPC Placement",
      icon: Briefcase,
      expandable: true,
      subItems: ["Placement Drives", "Company Info"],
    },
    {
      id: "documents",
      label: "Student Document",
      icon: FileText,
      expandable: true,
      subItems: ["Certificates", "Transcripts"],
    },
    { id: "fees", label: "Fee Details", icon: DollarSign },
    { id: "iad", label: "IAD", icon: IdCard },
    { id: "osec", label: "Osec Registration", icon: FileText },
    { id: "suggestion", label: "Suggestion Box", icon: MessageSquare },
    { id: "globaltimes", label: "The Global Times", icon: Globe },
    {
      id: "ntcc",
      label: "NTCC",
      icon: BookOpen,
      expandable: true,
      subItems: ["Courses", "Resources"],
    },
    { id: "scholarship", label: "Scholarship", icon: GraduationCap },
    { id: "wifi", label: "Register for WiFi", icon: Wifi },
    { id: "abcid", label: "ABC ID", icon: IdCard },
    { id: "research", label: "Research Repository", icon: Book },
    { id: "hostel", label: "Hostel", icon: Home },
    { id: "achievement", label: "Achievement", icon: Trophy },
    { id: "asap", label: "ASAP", icon: Zap },
    { id: "transcript", label: "Apply for Transcript", icon: FileText },
    { id: "bus", label: "Apply for Charter Bus Service", icon: Bus },
    { id: "withdrawal", label: "Withdrawal", icon: DoorOpen },
    { id: "logout", label: "Logout", icon: LogOut },
  ];

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
          onClick={onClose}
        />
      )}

      <div
        className={`fixed inset-y-0 left-0 z-30 w-64 bg-white border-r border-gray-200 shadow-lg transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out flex flex-col h-full`}
      >
        <div className="p-5 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-blue-600">UNIHUB</h1>
            <div className="flex items-center gap-2">
              {onToggle && (
                <button
                  onClick={onToggle}
                  className="p-1 hover:bg-gray-100 rounded-lg"
                >
                  <Menu className="w-5 h-5 text-gray-500" />
                </button>
              )}
              <button
                onClick={onClose}
                className="p-1 hover:bg-gray-100 rounded-lg md:hidden"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
          </div>
          <p className="text-gray-500 text-sm mt-1">Student Portal</p>
        </div>
        <nav className="flex-1 flex flex-col justify-between h-0">
          <div className="overflow-y-auto flex-1">
            <ul className="py-2">
              {menuItems.map((item) => (
                <li key={item.id}>
                  <div
                    className={`px-5 py-3 text-gray-700 hover:bg-blue-50 cursor-pointer border-l-4 transition-colors ${
                      activeItem === item.id
                        ? "border-blue-500 bg-blue-50 text-blue-700"
                        : "border-transparent hover:border-blue-300"
                    } flex items-center justify-between`}
                    onClick={() => {
                      if (item.expandable) {
                        toggleMenu(item.id);
                      } else {
                        handleItemClick(item.id);
                      }
                    }}
                  >
                    <div className="flex items-center">
                      <item.icon className="w-5 h-5 mr-3 text-gray-500" />
                      <span>{item.label}</span>
                    </div>
                    {item.expandable && (
                      <div>
                        {expandedMenus.has(item.id) ? (
                          <ChevronUp className="w-4 h-4 text-gray-500" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-gray-500" />
                        )}
                      </div>
                    )}
                  </div>
                  {item.expandable && expandedMenus.has(item.id) && (
                    <ul className="ml-8 transition-all duration-300 ease-in-out">
                      {item.subItems?.map((subItem, index) => (
                        <li
                          key={index}
                          className="px-5 py-2 text-gray-600 hover:bg-gray-100 cursor-pointer border-l-4 border-transparent hover:border-blue-300 transition-colors"
                          onClick={() => handleItemClick(`${item.id}-${subItem}`)}
                        >
                          {subItem}
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </nav>
      </div>
    </>
  );
};
