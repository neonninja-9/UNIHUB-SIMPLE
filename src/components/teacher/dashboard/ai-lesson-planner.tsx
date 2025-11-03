import { Sparkles, Wand2, Loader2 } from "lucide-react";
import React, { useState } from "react";

export function AILessonPlanner() {
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [plan, setPlan] = useState<string | null>(null);

  const generatePlan = () => {
    if (!prompt) return;
    setIsLoading(true);
    setPlan(null);
    // Simulate API call
    setTimeout(() => {
      setPlan(
        `**Topic:** ${prompt}\n\n` +
          "**Objective:** Students will be able to...\n" +
          "1.  Define key terms related to the topic.\n" +
          "2.  Explain the core concepts.\n\n" +
          "**Activities:**\n" +
          "* **Warm-up (10 min):** Quick discussion prompt.\n" +
          "* **Lecture (20 min):** Core concepts presentation.\n" +
          "* **Group Work (15 min):** Apply concepts to a problem.\n" +
          "* **Wrap-up (5 min):** Exit ticket.",
      );
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-900 p-6 rounded-lg shadow-sm col-span-1">
      <div className="flex items-center gap-3 mb-4">
        <Sparkles className="w-6 h-6 text-purple-600" />
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
          AI Lesson Planner
        </h2>
      </div>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
        Describe a topic, and let AI generate a lesson plan for you.
      </p>
      <div className="space-y-3">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="e.g., 'Introduction to Photosynthesis for 9th Graders'"
          className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg h-24 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700"
        />
        <button
          onClick={generatePlan}
          disabled={isLoading || !prompt}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
        >
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Wand2 className="w-5 h-5" />
          )}
          <span>{isLoading ? "Generating..." : "Generate Plan"}</span>
        </button>
      </div>

      {plan && (
        <div className="mt-4 p-4 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
          <h3 className="font-semibold mb-2 text-gray-800 dark:text-gray-200">
            Generated Plan:
          </h3>
          {/* Using a simple formatter for the mock markdown */}
          <div className="prose prose-sm dark:prose-invert max-w-none">
            {plan.split("\n\n").map((paragraph: string, i: number) => (
              <p key={i}>
                {paragraph.split("\n").map((line: string, j: number) => (
                  <React.Fragment key={j}>
                    {line.startsWith("**") ? (
                      <strong>{line.replace(/\*\*/g, "")}</strong>
                    ) : (
                      line
                    )}
                    <br />
                  </React.Fragment>
                ))}
              </p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
