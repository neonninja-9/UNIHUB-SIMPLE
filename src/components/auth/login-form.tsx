"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion"; // Animation library
import { api } from "@/lib/api";

// =======================
// Eye Icon Component
// =======================
const EyeIcon = ({
  showPassword,
  togglePasswordVisibility,
}: {
  showPassword: boolean;
  togglePasswordVisibility: () => void;
}) => (
  <svg
    onClick={togglePasswordVisibility}
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer"
  >
    {showPassword ? (
      <>
        <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path>
        <circle cx="12" cy="12" r="3"></circle>
      </>
    ) : (
      <>
        <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"></path>
        <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"></path>
        <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"></path>
        <line x1="2" x2="22" y1="2" y2="22"></line>
      </>
    )}
  </svg>
);

// =======================
// Student Illustration
// =======================
const StudentIllustration = () => (
  <motion.svg
    initial={{ y: 0 }}
    animate={{ y: [0, -10, 0] }}
    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
    viewBox="0 0 320 220"
    xmlns="http://www.w3.org/2000/svg"
    className="w-full h-auto max-w-sm drop-shadow-lg"
  >
    <g
      stroke="#FFFFFF"
      fill="none"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* Plant */}
      <g transform="translate(270, 155)">
        <path
          d="M 0 45 L 30 45 L 30 20 C 30 10, 0 10, 0 20 Z"
          fill="rgba(255,255,255,0.15)"
          stroke="none"
        />
        <path d="M 15 20 C 0 0, 15 -10, 25 -25" />
        <path d="M 15 20 C 30 0, 15 -10, 5 -25" />
      </g>

      {/* Person sitting */}
      <g transform="translate(180, 25)">
        <path
          d="M 30 50 L 50 70 L 80 60 L 60 40 Z"
          fill="rgba(255,255,255,0.1)"
        />
        <circle cx="60" cy="20" r="12" strokeWidth="2" />
        <path d="M 60 32 C 50 60, 70 80, 95 85" />
        <path d="M 95 85 C 75 90, 60 75, 50 55" />
        <path d="M 50 55 L 35 65" />
      </g>

      {/* Person standing */}
      <g transform="translate(80, 80)">
        <circle cx="20" cy="15" r="12" strokeWidth="2" />
        <path d="M 20 27 V 110" />
        <path d="M 0 130 L 20 110 L 40 130" />
        <path d="M 20 50 L 70 20" />
        <circle cx="80" cy="10" r="15" strokeWidth="2" />
        <path d="M 92 22 L 105 35" />
      </g>

      {/* Document stack */}
      <rect
        x="20"
        y="100"
        width="280"
        height="100"
        rx="10"
        fill="rgba(255,255,255,0.1)"
      />
      <path d="M 40 120 H 260" />
      <path d="M 40 140 H 260" />
      <path d="M 40 160 H 200" />
    </g>
  </motion.svg>
);

// =======================
// Faculty Illustration
// =======================
const FacultyIllustration = () => (
  <motion.svg
    initial={{ y: 0 }}
    animate={{ y: [0, -10, 0] }}
    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
    viewBox="0 0 200 200"
    xmlns="http://www.w3.org/2000/svg"
    className="w-full h-auto max-w-sm drop-shadow-lg"
  >
    <path
      fill="#FFFFFF"
      d="M48.1,-59.9C62.4,-52,74.2,-39,78.2,-23.7C82.2,-8.4,78.5,9.3,70.9,24.1C63.4,38.9,52.1,50.8,38.8,59.2C25.5,67.6,10.2,72.4,-5.4,74.1C-21.1,75.8,-42.1,74.3,-55.8,64.7C-69.5,55.1,-75.9,37.3,-76.3,20.1C-76.7,2.9,-71.1,-13.7,-61.8,-27.1C-52.5,-40.5,-39.5,-50.7,-26.1,-58.1C-12.7,-65.6,-0.9,-70.3,12.3,-71.9C25.5,-73.5,48.1,-59.9,48.1,-59.9"
      transform="translate(100 100)"
      opacity="0.1"
    />
    <g transform="translate(130 90) scale(0.5)">
      <circle
        cx="20"
        cy="15"
        r="10"
        fill="none"
        stroke="#FFFFFF"
        strokeWidth="3"
      />
      <path d="M 20 25 V 80" fill="none" stroke="#FFFFFF" strokeWidth="3" />
      <path d="M 5 80 H 35" fill="none" stroke="#FFFFFF" strokeWidth="3" />
      <path d="M 20 45 L -10 35" fill="none" stroke="#FFFFFF" strokeWidth="3" />
    </g>
    <rect
      x="25"
      y="60"
      width="110"
      height="80"
      rx="8"
      fill="none"
      stroke="#FFFFFF"
      strokeWidth="2.5"
    />
    <line
      x1="25"
      y1="150"
      x2="80"
      y2="170"
      stroke="#FFFFFF"
      strokeWidth="2.5"
    />
    <line
      x1="135"
      y1="150"
      x2="80"
      y2="170"
      stroke="#FFFFFF"
      strokeWidth="2.5"
    />
    <path
      d="M 40 120 L 55 100 L 70 110 L 85 90 L 100 105"
      fill="none"
      stroke="#FFFFFF"
      strokeWidth="2.5"
    />
    <path
      d="M 40 125 H 120"
      stroke="#FFFFFF"
      strokeWidth="2"
      strokeDasharray="3 3"
    />
    <path
      d="M 40 105 H 120"
      stroke="#FFFFFF"
      strokeWidth="2"
      strokeDasharray="3 3"
    />
  </motion.svg>
);

// =======================
// Right Panel Content
// =======================
const RightPanelContent = ({ isStudent }: { isStudent: boolean }) => {
  const welcomeText = isStudent
    ? "Welcome to Student Portal"
    : "Welcome to Faculty Portal";
  const Illustration = isStudent ? StudentIllustration : FacultyIllustration;

  return (
    <div className="flex flex-col items-center">
      <div className="mb-8">
        <Illustration />
      </div>
      <h2 className="text-4xl md:text-5xl font-extrabold mb-3 leading-tight">
        {welcomeText}
      </h2>
      <p className="text-indigo-100 opacity-80">Login to access your account</p>
    </div>
  );
};

// =======================
// Main LoginForm Component
// =======================
export default function LoginForm() {
  const router = useRouter();
  const [loginType, setLoginType] = useState("student");
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(false);

  const toggleLoginType = (type: string) => {
    if (loginType !== type) {
      setLoginType(type);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Basic validation
    const newErrors: { [key: string]: string } = {};
    if (!username.trim()) {
      newErrors.username = "Username is required";
    }
    if (!password.trim()) {
      newErrors.password = "Password is required";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    try {
      const role = loginType === "student" ? "student" : "faculty";

      // Mock login for demo purposes - bypass API call
      if (
        username === "student" &&
        password === "password" &&
        role === "student"
      ) {
        const mockUser = {
          id: 1,
          username: "student",
          role: "student",
          email: "student@unihub.com",
          name: "Alex Thompson",
        };
        localStorage.setItem("user", JSON.stringify(mockUser));
        router.push("/student/dashboard");
      } else if (
        username === "faculty" &&
        password === "password" &&
        role === "faculty"
      ) {
        const mockUser = {
          id: 2,
          username: "faculty",
          role: "faculty",
          email: "faculty@unihub.com",
          name: "Dr. Sarah Johnson",
        };
        localStorage.setItem("user", JSON.stringify(mockUser));
        router.push("/teacher/dashboard");
      } else {
        setErrors({
          auth: "Invalid credentials. Try student/password or faculty/password",
        });
      }
    } catch (error) {
      setErrors({ auth: "Login failed. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  const isStudent = loginType === "student";
  const primaryColor = isStudent ? "bg-indigo-600" : "bg-teal-600";
  const hoverColor = isStudent ? "hover:bg-indigo-700" : "hover:bg-teal-700";
  const welcomeBgClass = isStudent ? "bg-indigo-500" : "bg-teal-500";
  const focusRingColor = isStudent
    ? "focus:ring-indigo-500"
    : "focus:ring-teal-500";

  return (
    <main className="min-h-screen flex items-center justify-center font-sans p-4">
      <div className="w-full max-w-5xl grid md:grid-cols-2 rounded-2xl shadow-2xl overflow-hidden">
        {/* Left Panel */}
        <div className="bg-gray-800 p-8 md:p-12 text-white order-last md:order-first">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">Login</h1>
            <p className="text-gray-400">Enter your account details</p>
          </div>

          {/* Toggle */}
          <div className="flex bg-gray-700 rounded-lg p-1 mb-6">
            <button
              onClick={() => toggleLoginType("student")}
              className={`w-1/2 p-2 rounded-md text-sm font-medium transition-colors duration-300 ${
                isStudent
                  ? "bg-indigo-600"
                  : "bg-transparent text-gray-300 hover:bg-gray-600"
              }`}
            >
              Student Login
            </button>
            <button
              onClick={() => toggleLoginType("faculty")}
              className={`w-1/2 p-2 rounded-md text-sm font-medium transition-colors duration-300 ${
                !isStudent
                  ? "bg-teal-600"
                  : "bg-transparent text-gray-300 hover:bg-gray-600"
              }`}
            >
              Faculty Login
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label
                className="block text-gray-400 text-sm mb-2"
                htmlFor="username"
              >
                Username
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className={`w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 ${focusRingColor} transition-all ${
                  errors.username ? "border-red-500" : ""
                }`}
                placeholder="Enter your username"
              />
              {errors.username && (
                <p className="text-red-500 text-sm mt-1">{errors.username}</p>
              )}
            </div>

            <div className="mb-4 relative">
              <label
                className="block text-gray-400 text-sm mb-2"
                htmlFor="password"
              >
                Password
              </label>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 ${focusRingColor} transition-all ${
                  errors.password ? "border-red-500" : ""
                }`}
                placeholder="Enter your password"
              />
              <EyeIcon
                showPassword={showPassword}
                togglePasswordVisibility={togglePasswordVisibility}
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password}</p>
              )}
            </div>

            <div className="text-right mb-6">
              <a href="#" className="text-sm text-indigo-400 hover:underline">
                Forgot Password?
              </a>
            </div>

            {errors.auth && (
              <div className="mb-4 p-3 rounded bg-red-500/10 border border-red-500 text-red-500">
                {errors.auth}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 rounded-lg text-white font-semibold transition-all duration-300 ${primaryColor} ${hoverColor} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white ${
                isLoading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {isLoading ? "Logging in..." : "Login"}
            </button>
          </form>

          <div className="mt-8 text-center text-sm">
            <p className="text-gray-400">
              Don't have an account?{" "}
              <a
                href="#"
                className="font-medium text-indigo-400 hover:underline"
              >
                Sign up
              </a>
            </p>
          </div>
        </div>

        {/* Right Panel */}
        <div
          className={`relative flex flex-col items-center justify-center p-8 md:p-12 text-white text-center transition-all duration-700 overflow-hidden ${welcomeBgClass}`}
        >
          <div key={loginType}>
            <RightPanelContent isStudent={isStudent} />
          </div>
        </div>
      </div>
    </main>
  );
}
