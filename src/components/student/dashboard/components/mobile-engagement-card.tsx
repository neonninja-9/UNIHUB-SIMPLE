"use client";

import React, { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Attendance, Course, PendingTask } from "@/lib/types";
import {
  BarChart2,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  ClipboardList,
} from "lucide-react";

interface MobileEngagementCardProps {
  attendance: Attendance[];
  courses: Course[];
  pendingTasks: PendingTask[];
}

const tabMotion = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -12 },
};

const taskIndicatorColors: Record<
  NonNullable<PendingTask["priority"]>,
  string
> = {
  low: "bg-emerald-100 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-300",
  medium:
    "bg-amber-100 text-amber-600 dark:bg-amber-500/15 dark:text-amber-300",
  high: "bg-rose-100 text-rose-600 dark:bg-rose-500/15 dark:text-rose-300",
};

const tooltipStyles = {
  backgroundColor: "rgba(17, 24, 39, 0.9)",
  borderRadius: 12,
  border: "1px solid rgba(255, 255, 255, 0.08)",
  color: "#F9FAFB",
  padding: "0.75rem 1rem",
};

export function MobileEngagementCard({
  attendance,
  courses,
  pendingTasks,
}: MobileEngagementCardProps) {
  const [activeSection, setActiveSection] = useState<
    "attendance" | "tasks" | "courses"
  >("attendance");

  const courseSummaries = useMemo(() => {
    return courses.map((course, index) => {
      const courseId =
        (course as any).id ?? (course as any).course_id ?? index + 1;
      const courseAttendance = attendance.filter(
        (record) => record.course_id === courseId,
      );
      const total = courseAttendance.length;
      const present = courseAttendance.filter(
        (record) => record.status === "present",
      ).length;
      const attendancePercentage = total
        ? Math.round((present / total) * 100)
        : 0;

      return {
        id: courseId,
        name: course.name,
        code: course.code,
        schedule: course.schedule,
        attendancePercentage,
      };
    });
  }, [attendance, courses]);

  const chartData = useMemo(
    () =>
      courseSummaries
        .map((item) => ({
          name: item.code || item.name,
          percentage: item.attendancePercentage,
        }))
        .slice(0, 6),
    [courseSummaries],
  );

  const hasPendingTasks = pendingTasks.length > 0;

  return (
    <section className="w-full max-w-4xl mx-auto rounded-3xl bg-white dark:bg-[#1F2937] backdrop-blur shadow-lg border-2 border-gray-200 dark:border-gray-600 dark:shadow-xl z-10 relative block transition-colors duration-300">
      <div className="p-6 space-y-6">
        <header className="space-y-1 text-center">
          <p className="text-xs uppercase tracking-[0.25em] text-blue-600 dark:text-blue-400/80">
            Student Portal
          </p>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
            Stay on top of your day
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Switch sections to see attendance, tasks, or your courses.
          </p>
        </header>

        <div className="flex items-center gap-2 rounded-full bg-gray-100 dark:bg-gray-800/80 p-1.5 transition-colors duration-300">
          {(
            [
              { key: "attendance", label: "Attendance", icon: BarChart2 },
              { key: "tasks", label: "Pending Tasks", icon: ClipboardList },
              { key: "courses", label: "Courses", icon: BookOpen },
            ] as const
          ).map(({ key, label, icon: Icon }) => {
            const isActive = activeSection === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => setActiveSection(key)}
                className={`flex-1 rounded-full px-3 py-2 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500 dark:focus-visible:ring-offset-gray-900 ${
                  isActive
                    ? "bg-blue-600 shadow-sm text-white dark:bg-blue-600 dark:text-white"
                    : "text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                }`}
              >
                <span className="flex flex-col items-center gap-1">
                  <Icon className="h-4 w-4" />
                  <span>{label}</span>
                </span>
              </button>
            );
          })}
        </div>

        <div className="relative min-h-[240px]">
          <AnimatePresence mode="wait">
            {activeSection === "attendance" && (
              <motion.section
                key="attendance"
                className="h-full"
                {...tabMotion}
                transition={{ duration: 0.3, ease: "easeOut" }}
              >
                <AttendanceSection chartData={chartData} />
              </motion.section>
            )}

            {activeSection === "tasks" && (
              <motion.section
                key="tasks"
                className="space-y-4"
                {...tabMotion}
                transition={{ duration: 0.3, ease: "easeOut" }}
              >
                <PendingTasksSection
                  hasPendingTasks={hasPendingTasks}
                  pendingTasks={pendingTasks}
                />
              </motion.section>
            )}

            {activeSection === "courses" && (
              <motion.section
                key="courses"
                className="space-y-3"
                {...tabMotion}
                transition={{ duration: 0.3, ease: "easeOut" }}
              >
                <CoursesSection courseSummaries={courseSummaries} />
              </motion.section>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

function formatDueDate(date: string) {
  const value = new Date(date);
  if (Number.isNaN(value.getTime())) {
    return date;
  }

  return value.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
}

function TrendingBadge({ percentage }: { percentage: number }) {
  const status =
    percentage >= 85
      ? "on track"
      : percentage >= 70
        ? "keep pushing"
        : "needs focus";
  const colorClasses =
    percentage >= 85
      ? "bg-emerald-500/15 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-200"
      : percentage >= 70
        ? "bg-amber-500/15 text-amber-600 dark:bg-amber-500/20 dark:text-amber-200"
        : "bg-rose-500/15 text-rose-600 dark:bg-rose-500/20 dark:text-rose-200";

  return (
    <span
      className={`inline-flex flex-col items-end rounded-2xl px-3 py-2 text-xs font-semibold uppercase tracking-wide ${colorClasses}`}
    >
      <span>{percentage}%</span>
      <span className="text-[10px] font-medium tracking-[0.2em]">{status}</span>
    </span>
  );
}

function AttendanceSection({
  chartData,
}: {
  chartData: { name: string; percentage: number }[];
}) {
  return (
    <div className="attendance-section h-full rounded-2xl bg-gradient-to-br from-blue-500/10 via-blue-500/5 to-purple-500/10 p-4">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-blue-600 dark:text-blue-300">
            Attendance Overview
          </p>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Recent performance
          </h3>
        </div>
        <TrendingBadge percentage={chartData[0]?.percentage ?? 0} />
      </div>

      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(148, 163, 184, 0.25)"
            />
            <XAxis
              dataKey="name"
              tick={{ fill: "#64748b", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: "#64748b", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
              width={28}
              domain={[0, 100]}
            />
            <Tooltip
              cursor={{ fill: "rgba(59, 130, 246, 0.08)" }}
              contentStyle={tooltipStyles}
            />
            <Bar
              dataKey="percentage"
              radius={[12, 12, 12, 12]}
              fill="url(#attendanceGradient)"
            />
            <defs>
              <linearGradient
                id="attendanceGradient"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.95} />
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0.85} />
              </linearGradient>
            </defs>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function PendingTasksSection({
  hasPendingTasks,
  pendingTasks,
}: {
  hasPendingTasks: boolean;
  pendingTasks: PendingTask[];
}) {
  if (!hasPendingTasks) {
    return (
      <motion.div
        key="empty"
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className="pending-tasks-section flex h-full flex-col items-center justify-center rounded-2xl border border-dashed border-blue-300 bg-blue-50/50 p-8 text-center dark:border-blue-500/40 dark:bg-blue-500/10"
      >
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-500/20 dark:text-blue-200">
          <CheckCircle2 className="h-5 w-5" />
        </div>
        <p className="text-base font-semibold text-blue-800 dark:text-blue-100">
          No pending tasks 🎉
        </p>
        <p className="mt-1 text-sm text-blue-500/80 dark:text-blue-200/80">
          Enjoy your free time or get ahead on upcoming work.
        </p>
      </motion.div>
    );
  }

  return (
    <ul className="pending-tasks-section space-y-3">
      {pendingTasks.map((task) => {
        const priorityClass = task.priority
          ? taskIndicatorColors[task.priority]
          : "bg-blue-100 text-blue-600 dark:bg-blue-500/15 dark:text-blue-300";

        return (
          <motion.li
            key={task.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="flex items-start gap-4 rounded-2xl border border-gray-100 bg-white px-4 py-3 shadow-sm dark:border-white/10 dark:bg-gray-900/60"
          >
            <div
              className={`mt-1 flex h-9 w-9 items-center justify-center rounded-full ${priorityClass}`}
            >
              <ClipboardList className="h-4 w-4" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-gray-900 dark:text-white">
                {task.title}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {task.course}
              </p>
              <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2 py-0.5 text-[11px] font-medium text-blue-600 dark:bg-blue-500/15 dark:text-blue-300">
                  <CalendarDays className="h-3 w-3" />
                  Due {formatDueDate(task.dueDate)}
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-300">
                  <CheckCircle2 className="h-3 w-3" />
                  Pending
                </span>
              </div>
            </div>
          </motion.li>
        );
      })}
    </ul>
  );
}

function CoursesSection({
  courseSummaries,
}: {
  courseSummaries: {
    id: number;
    name: string;
    code: string;
    schedule: string;
    attendancePercentage: number;
  }[];
}) {
  return (
    <div className="courses-section space-y-3">
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-100 text-blue-600 shadow-sm dark:bg-blue-500/20 dark:text-blue-200">
          <BookOpen className="h-5 w-5" />
        </span>
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
            Courses
          </p>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            My subjects this term
          </h3>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {courseSummaries.map((course) => (
          <div
            key={course.id}
            className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm transition hover:shadow-md dark:border-white/10 dark:bg-gray-900/60"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                  {course.name}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {course.code}
                </p>
              </div>
              <span className="text-xs font-semibold text-blue-500 dark:text-blue-300">
                {course.attendancePercentage}%
              </span>
            </div>
            <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">
              {course.schedule}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
