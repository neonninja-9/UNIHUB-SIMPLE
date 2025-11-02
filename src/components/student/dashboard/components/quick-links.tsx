interface QuickLinksProps {
  onLinkClick?: (link: string) => void
}

export function QuickLinks({ onLinkClick }: QuickLinksProps) {
  return (
    <div className="bg-[#1A1F3A] dark:bg-gradient-to-r dark:from-[#e0f2fe] dark:to-[#bae6fd] rounded-xl p-6 shadow-lg dark:shadow-[0_4px_12px_rgba(0,0,0,0.08)]">
      <h3 className="text-xl font-bold mb-4 text-white dark:text-[#1f2937]">
        Quick Links
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <button
          onClick={() => onLinkClick?.('Library')}
          className="bg-blue-600 hover:bg-blue-700 dark:bg-[#3b82f6] dark:hover:bg-[#2563eb] rounded-lg py-3 px-4 text-sm font-medium transition-all duration-200 hover:scale-105 text-white dark:text-white"
        >
          Library
        </button>
        <button
          onClick={() => onLinkClick?.('Assignments')}
          className="bg-purple-600 hover:bg-purple-700 dark:bg-[#8b5cf6] dark:hover:bg-[#7c3aed] rounded-lg py-3 px-4 text-sm font-medium transition-all duration-200 hover:scale-105 text-white dark:text-white"
        >
          Assignments
        </button>
        <button
          onClick={() => onLinkClick?.('Exams')}
          className="bg-pink-600 hover:bg-pink-700 dark:bg-[#ec4899] dark:hover:bg-[#db2777] rounded-lg py-3 px-4 text-sm font-medium transition-all duration-200 hover:scale-105 text-white dark:text-white"
        >
          Exams
        </button>
        <button
          onClick={() => onLinkClick?.('Results')}
          className="bg-green-600 hover:bg-green-700 dark:bg-[#10b981] dark:hover:bg-[#059669] rounded-lg py-3 px-4 text-sm font-medium transition-all duration-200 hover:scale-105 text-white dark:text-white"
        >
          Results
        </button>
      </div>
    </div>
  );
}
