"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Home,
  User,
  BookOpen,
  FileText,
  Calendar,
  Newspaper,
  Lightbulb,
  ChevronDown,
  ChevronRight,
  Menu,
  X,
  GraduationCap,
  Users,
  Clock,
  FolderOpen,
  Library,
  MessageSquare,
  Building,
  FileSignature,
  Video,
  Database,
  Edit,
  CheckSquare,
  RotateCcw,
  Upload,
  Book,
  Monitor,
  Zap,
  Search,
  Timer,
  Microscope,
  FileCheck,
  Briefcase,
  Download,
  LogOut,
} from "lucide-react";

interface FacultySidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

export const FacultySidebar: React.FC<FacultySidebarProps> = ({
  isOpen,
  onToggle,
}) => {
  const pathname = usePathname();
  const router = useRouter();
  const [openMenus, setOpenMenus] = useState<{ [key: string]: boolean }>({});

  const toggleMenu = (menu: string) => {
    setOpenMenus((prev) => ({ ...prev, [menu]: !prev[menu] }));
  };

  const menuSections = [
    {
      title: "Main",
      items: [
        { name: "🏠 Home", icon: Home, href: "/teacher/dashboard" },
        { name: "Dashboard", icon: User, href: "/teacher/dashboard" },
        { name: "Profile", icon: User, href: "/teacher/profile" },
      ],
    },
    {
      title: "Academics",
      items: [
        {
          name: "LMS (Learning Management System)",
          icon: BookOpen,
          href: "/teacher/lms",
        },
        { name: "Turnitin", icon: FileCheck, href: "/teacher/turnitin" },
        { name: "Planning", icon: FileText, href: "/teacher/planning" },
        {
          name: "Research Facilities",
          icon: Microscope,
          href: "/teacher/research",
        },
        {
          name: "Visiting Faculty",
          icon: Users,
          href: "/teacher/visiting-faculty",
        },
        {
          name: "Medical Insurance",
          icon: Briefcase,
          href: "/teacher/medical-insurance",
        },
        { name: "FDP Programmes", icon: GraduationCap, href: "/teacher/fdp" },
        { name: "Downloads", icon: Download, href: "/teacher/downloads" },
        { name: "Notice Board", icon: FileText, href: "/teacher/notice-board" },
        {
          name: "Classroom Recordings",
          icon: Video,
          href: "/teacher/recordings",
        },
        {
          name: "Institutional Data",
          icon: Database,
          href: "/teacher/institutional-data",
        },
      ],
    },
    {
      title: "Attendance Management",
      items: [
        {
          name: "Edit Attendance",
          icon: Edit,
          href: "/teacher/edit-attendance",
        },
        {
          name: "Mark Attendance",
          icon: CheckSquare,
          href: "/teacher/mark-attendance",
        },
        {
          name: "Re-Schedule Class",
          icon: RotateCcw,
          href: "/teacher/reschedule",
        },
        {
          name: "Host Documents",
          icon: Upload,
          href: "/teacher/host-documents",
        },
      ],
    },
    {
      title: "Library & Resources",
      items: [
        { name: "e-Library", icon: Library, href: "/teacher/e-library" },
        {
          name: "MS Teams Groups",
          icon: MessageSquare,
          href: "/teacher/teams",
        },
        { name: "Bridge Courses", icon: Zap, href: "/teacher/bridge-courses" },
        { name: "Scopus", icon: Search, href: "/teacher/scopus" },
        {
          name: "Time Office (Beta)",
          icon: Timer,
          href: "/teacher/time-office",
        },
      ],
    },
    {
      title: "R&D and Case Study",
      items: [
        {
          name: "R&D Equipment",
          icon: Microscope,
          href: "/teacher/rnd-equipment",
        },
        {
          name: "AMC Case Study",
          icon: FileText,
          href: "/teacher/amc-case-study",
        },
        {
          name: "Flexi Courses",
          icon: BookOpen,
          href: "/teacher/flexi-courses",
        },
      ],
    },
    {
      title: "Extra Sections",
      items: [
        { name: "📅 Calendar", icon: Calendar, href: "/teacher/calendar" },
        {
          name: "📰 News & Events",
          icon: Newspaper,
          href: "/teacher/news-events",
        },
        { name: "📢 Notices", icon: FileText, href: "/teacher/notices" },
        {
          name: "💡 Funding Opportunities",
          icon: Lightbulb,
          href: "/teacher/funding",
        },
      ],
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-full w-64 bg-slate-900 text-gray-100 shadow-xl z-50 transform transition-transform duration-300 ease-in-out lg:translate-x-0 overflow-y-auto ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Header with Logo and Toggle */}
        <div className="flex items-center justify-between p-4 border-b border-slate-700">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-8 h-8 text-blue-400" />
            <span className="text-xl font-bold text-white">Faculty Portal</span>
          </div>
          <button
            onClick={onToggle}
            className="lg:hidden text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 flex flex-col justify-between">
          <div>
            {menuSections.map((section) => (
              <div key={section.title} className="mb-6">
                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 px-2">
                  {section.title}
                </h3>
                <ul className="space-y-1">
                  {section.items.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                      <li key={item.name}>
                        <Link
                          href={item.href}
                          className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-slate-800 hover:text-white ${
                            isActive
                              ? "bg-blue-600 text-white shadow-md"
                              : "text-gray-300"
                          }`}
                        >
                          <item.icon className="w-5 h-5 flex-shrink-0" />
                          <span className="truncate">{item.name}</span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>

          {/* Logout Button */}
          <div className="mt-auto pt-4 border-t border-slate-700">
            <button
              onClick={() => {
                localStorage.clear();
                router.push("/");
              }}
              className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm font-medium text-red-400 hover:bg-red-900/20 hover:text-red-300 transition-all duration-200"
            >
              <LogOut className="w-5 h-5 flex-shrink-0" />
              <span>Logout</span>
            </button>
          </div>
        </nav>
      </aside>
    </>
  );
};
