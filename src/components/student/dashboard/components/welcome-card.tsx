import { Student } from "@/lib/types";

interface WelcomeCardProps {
  student?: Student;
}

export function WelcomeCard({ student }: WelcomeCardProps) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition-shadow duration-300">
      <h2 className="text-2xl font-bold text-gray-700 mb-2">
        Welcome back, {student?.name || "Student"}! 👋
      </h2>
      <p className="text-gray-600">
        Here's your dashboard overview for today.
      </p>
    </div>
  );
}
