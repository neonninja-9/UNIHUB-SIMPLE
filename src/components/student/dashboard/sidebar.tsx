"use client";
import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Info,
  GraduationCap,
  MessageSquare,
  BookOpen,
  Building,
  CreditCard,
  Library,
  FileText,
  Trophy,
  Bus,
  ChevronDown,
  ChevronRight,
  LogOut,
} from "lucide-react";
import { useRouter } from "next/navigation";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [openMenus, setOpenMenus] = useState<{ [key: string]: boolean }>({});

  const toggleMenu = (menu: string) => {
    setOpenMenus((prev) => ({ ...prev, [menu]: !prev[menu] }));
  };

  const menuItems = [
    { name: "Home", icon: Home, href: "/student/dashboard", subItems: [] },
    {
      name: "Attendance",
      icon: GraduationCap,
      href: "/student/attendance",
      subItems: [],
    },
    { name: "Courses", icon: BookOpen, href: "/student/courses", subItems: [] },
    {
      name: "DigiLocker",
      icon: FileText,
      href: "/student/digilocker",
      subItems: [],
    },
    {
      name: "General Information",
      icon: Info,
      subItems: [
        "ACADEMIC CALENDER",
        "YOUR PROFILE",
        "eXAMINATION PAPER",
        "INTERNAL/FINAL EXAMINATION",
        "SYLLABUS",
        "GRIEVANCE",
        "ONLINE FORM APPROVAL STATUS",
        "STUDENT PROGRESSION INDEX",
        "STUDENT PROGRESSION DIARY",
        "CONTACT DETAIL",
        "OTHER SERVICE REQUEST",
        "ABCID VERIFICATION",
      ],
    },
    {
      name: "Academics",
      icon: GraduationCap,
      subItems: [
        "ONLINE CLASS ASSIGNMENT",
        "E-ONLINE TEACHING PLATFORM",
        "ONLINE TEST PORTAL",
      ],
    },
    {
      name: "Communications",
      icon: MessageSquare,
      subItems: ["QUERY TO FACULTY", "COMMUNICATION"],
    },
    {
      name: "Academic",
      icon: BookOpen,
      subItems: [
        "E-ONLINE TEACHING PLATFORM",
        "STUDENT PROGRESS ENTRY",
        "ONLINE CLASS RECORDING",
        "TIME TABLE",
        "COURSE OUTLINE",
        "ASSESSMENT MARKS",
        "ONLINE TEST PORTAL",
        "EXAM RESULT",
        "CURRENT BACKLOG",
        "SUBJECT CHOICE FILLING",
        "ASSIGNMENTS",
        "ASSESSMENT SUBMISSION",
        "SPECIAL LEAVE REQUEST",
        "ATTENDANCE STATUS",
        "ATTENDANCE SUB/WISE",
        "LEAVE APPLICATION",
        "PLAGIARISM CHECK",
      ],
    },
    {
      name: "Hostel",
      icon: Building,
      subItems: [
        "HOSTEL/BUS SERVICE REQUEST",
        "HOSTEL COMPLAINT/REQUEST",
        "APPLY FOR HOSTEL",
        "HOSTEL REGISTRATION",
      ],
    },
    {
      name: "Fees Transaction",
      icon: CreditCard,
      subItems: [
        "VERIFIED TRANSACTION",
        "PAY FEE ONLINE",
        "OTHER FEE PRINT",
        "FEES RECEIPTS",
        "STUDENT LEDGER",
        "ONLINE FEE TRANSACTION STATUS",
        "FEES INSTALLMENT CHART",
        "OTHER LEDGER",
      ],
    },
    {
      name: "Library",
      icon: Library,
      subItems: [
        "OPAC",
        "CIRCULATION LEDGER",
        "FINE RECORDS",
        "LIBRARY RULES & CIRCULAR",
        "EBOOK CENTER",
      ],
    },
    {
      name: "Student Document",
      icon: FileText,
      subItems: ["DOCUMENT DOWNLOADS"],
    },
    {
      name: "Non Academics",
      icon: Trophy,
      subItems: ["SPORTS TOURNAMENTS", "COMPETITIONS", "BEHAVIOUR"],
    },
    {
      name: "Transportation",
      icon: Bus,
      subItems: ["BUS STOPS", "BUS ROUTES", "APPLY BUS STOPS"],
    },
    { name: "Achievement", icon: Trophy, subItems: [] },
    { name: "Logout", icon: LogOut, subItems: [] },
  ];

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed left-0 top-0 h-screen w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 overflow-y-auto z-30 transform transition-all duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-5 bg-blue-600 dark:bg-blue-700 border-b border-gray-200 dark:border-gray-700 transition-colors duration-300">
          <h1 className="text-2xl font-bold text-white">UNIHUB</h1>
          <p className="text-blue-100 dark:text-blue-200 text-sm mt-1">Student Portal</p>
        </div>
        <nav className="flex-1">
          <ul>
            {menuItems.map((item) => (
              <li key={item.name}>
                {item.subItems.length > 0 ? (
                  <>
                    <div
                      className="px-5 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer flex items-center justify-between transition-colors"
                      onClick={() => toggleMenu(item.name)}
                    >
                      <div className="flex items-center">
                        <item.icon className="w-5 h-5 mr-3 text-gray-400 dark:text-gray-500" />
                        {item.name}
                      </div>
                      {openMenus[item.name] ? (
                        <ChevronDown className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                      )}
                    </div>
                    <div
                      className={`overflow-hidden transition-all duration-300 ${
                        openMenus[item.name] ? "max-h-96" : "max-h-0"
                      }`}
                    >
                      <ul className="ml-8">
                        {item.subItems.map((subItem) => (
                          <li
                            key={subItem}
                            className="px-5 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer transition-colors"
                            onClick={() => {
                              if (subItem === "QUERY TO FACULTY") {
                                router.push("/student/suggestion-box");
                              }
                              // Add other sub-item navigation logic here if needed
                            }}
                          >
                            {subItem}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </>
                ) : item.name === "Logout" ? (
                  <button
                    onClick={() => {
                      localStorage.clear();
                      router.push("/");
                    }}
                    className="flex items-center gap-3 w-full px-5 py-3 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 font-medium transition-colors"
                  >
                    <item.icon className="w-5 h-5" />
                    <span>{item.name}</span>
                  </button>
                ) : (
                  <Link
                    href={item.href || "#"}
                    className={`flex items-center px-5 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-blue-600 dark:hover:text-blue-400 transition-colors ${pathname === item.href ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border-r-4 border-blue-600 dark:border-blue-400" : ""}`}
                  >
                    <item.icon className="w-5 h-5 mr-3 text-gray-400 dark:text-gray-500" />
                    {item.name}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </>
  );
};
