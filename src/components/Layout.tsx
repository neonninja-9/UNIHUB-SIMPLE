import React from "react";
import Link from "next/link";

interface LayoutProps {
  children: React.ReactNode;
  user?: {
    name: string;
    role: string;
  };
  navLinks?: Array<{
    href: string;
    label: string;
    icon?: string;
  }>;
}

export const Layout: React.FC<LayoutProps> = ({
  children,
  user,
  navLinks = [],
}) => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900">UNIHUB</h1>
            </div>
            {user && (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-700">
                  Welcome, {user.name.split(" ")[0]} ({user.role})
                </span>
                <Link
                  href="/"
                  className="text-blue-600 hover:text-blue-800 text-sm"
                >
                  Logout
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        {navLinks.length > 0 && (
          <nav className="w-64 bg-white shadow-sm min-h-screen border-r border-gray-200">
            <div className="p-4">
              <ul className="space-y-2">
                {navLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md transition-colors duration-200"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </nav>
        )}

        {/* Main Content */}
        <main className={`flex-1 ${navLinks.length > 0 ? "p-8" : "p-4"}`}>
          {children}
        </main>
      </div>
    </div>
  );
};
