export function AssignmentsWidget({ assignments }: { assignments: any[] }) {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm col-span-1 lg:col-span-2">
      <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">
        Assignments to Grade
      </h2>
      <div className="space-y-4">
        {assignments.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400">
            No assignments need grading right now.
          </p>
        ) : (
          assignments.map((item: any) => (
            <div
              key={item.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-lg bg-gray-50 dark:bg-gray-900/50"
            >
              <div>
                <h3 className="font-semibold text-gray-800 dark:text-gray-200">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {item.course}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <span className="font-semibold text-gray-700 dark:text-gray-300">
                    {item.submitted}/{item.total}
                  </span>
                  <p className="text-xs text-gray-500">Submitted</p>
                </div>
                <button className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors">
                  Grade
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
