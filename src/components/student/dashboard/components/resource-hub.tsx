import React, { useState } from "react";
import { FileText, Download, Search, BookOpen, Calendar } from "lucide-react";

interface Resource {
  id: number;
  title: string;
  subject: string;
  year: number;
  type: "question-paper" | "notes" | "syllabus";
  downloads: number;
  fileSize: string;
}

const mockResources: Resource[] = [
  {
    id: 1,
    title: "Mathematics Calculus II Final Exam 2023",
    subject: "Mathematics",
    year: 2023,
    type: "question-paper",
    downloads: 245,
    fileSize: "2.1 MB",
  },
  {
    id: 2,
    title: "Physics Modern Physics Study Notes",
    subject: "Physics",
    year: 2024,
    type: "notes",
    downloads: 189,
    fileSize: "5.7 MB",
  },
  {
    id: 3,
    title: "Chemistry Organic Chemistry Lab Manual",
    subject: "Chemistry",
    year: 2023,
    type: "notes",
    downloads: 156,
    fileSize: "8.3 MB",
  },
  {
    id: 4,
    title: "Computer Science Data Structures Midterm 2024",
    subject: "Computer Science",
    year: 2024,
    type: "question-paper",
    downloads: 312,
    fileSize: "1.8 MB",
  },
  {
    id: 5,
    title: "Literature English Literature Syllabus 2024",
    subject: "English",
    year: 2024,
    type: "syllabus",
    downloads: 98,
    fileSize: "456 KB",
  },
  {
    id: 6,
    title: "Biology Cell Biology Previous Year Paper 2023",
    subject: "Biology",
    year: 2023,
    type: "question-paper",
    downloads: 178,
    fileSize: "3.2 MB",
  },
];

export function ResourceHub() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("All");
  const [selectedType, setSelectedType] = useState("All");

  const subjects = [
    "All",
    ...Array.from(new Set(mockResources.map((r) => r.subject))),
  ];
  const types = ["All", "question-paper", "notes", "syllabus"];

  const filteredResources = mockResources.filter((resource) => {
    const matchesSearch =
      resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.subject.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSubject =
      selectedSubject === "All" || resource.subject === selectedSubject;
    const matchesType =
      selectedType === "All" || resource.type === selectedType;

    return matchesSearch && matchesSubject && matchesType;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "question-paper":
        return <FileText className="w-5 h-5 text-red-500" />;
      case "notes":
        return <BookOpen className="w-5 h-5 text-blue-500" />;
      case "syllabus":
        return <Calendar className="w-5 h-5 text-green-500" />;
      default:
        return <FileText className="w-5 h-5 text-gray-500" />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "question-paper":
        return "Question Paper";
      case "notes":
        return "Study Notes";
      case "syllabus":
        return "Syllabus";
      default:
        return type;
    }
  };

  return (
    <div className="bg-[#1A1F3A] dark:bg-white rounded-xl p-6 shadow-lg dark:shadow-[0_4px_12px_rgba(0,0,0,0.08)]">
      <h3 className="text-xl font-bold mb-4 text-white dark:text-gray-900">
        Resource Hub
      </h3>

      {/* Search and Filters */}
      <div className="mb-6 space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search resources..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-[#0F1419] dark:bg-gray-100 border border-gray-600 dark:border-gray-300 rounded-lg text-white dark:text-gray-900 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex gap-4">
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="px-3 py-2 bg-[#0F1419] dark:bg-gray-100 border border-gray-600 dark:border-gray-300 rounded-lg text-white dark:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {subjects.map((subject) => (
              <option
                key={subject}
                value={subject}
                className="bg-[#0F1419] dark:bg-gray-100 text-white dark:text-gray-900"
              >
                {subject}
              </option>
            ))}
          </select>

          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-3 py-2 bg-[#0F1419] dark:bg-gray-100 border border-gray-600 dark:border-gray-300 rounded-lg text-white dark:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {types.map((type) => (
              <option
                key={type}
                value={type}
                className="bg-[#0F1419] dark:bg-gray-100 text-white dark:text-gray-900"
              >
                {type === "All" ? "All Types" : getTypeLabel(type)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Resources List */}
      <div className="space-y-4 max-h-96 overflow-y-auto">
        {filteredResources.map((resource) => (
          <div
            key={resource.id}
            className="flex items-center justify-between p-4 bg-[#0F1419] dark:bg-gray-50 rounded-lg border border-gray-700 dark:border-gray-200 hover:border-gray-600 dark:hover:border-gray-300 transition-colors"
          >
            <div className="flex items-center gap-3 flex-1">
              {getTypeIcon(resource.type)}
              <div className="flex-1">
                <h4 className="font-semibold text-white dark:text-gray-900 text-sm">
                  {resource.title}
                </h4>
                <div className="flex items-center gap-2 text-xs text-gray-400 dark:text-gray-600 mt-1">
                  <span>{resource.subject}</span>
                  <span>•</span>
                  <span>{resource.year}</span>
                  <span>•</span>
                  <span>{getTypeLabel(resource.type)}</span>
                  <span>•</span>
                  <span>{resource.fileSize}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-xs text-gray-400 dark:text-gray-600">
                {resource.downloads} downloads
              </div>
              <button className="flex items-center gap-1 px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded-lg transition-colors">
                <Download className="w-3 h-3" />
                Download
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredResources.length === 0 && (
        <div className="text-center py-8 text-gray-400 dark:text-gray-600">
          No resources found matching your criteria.
        </div>
      )}

      <div className="mt-4 text-center">
        <button className="text-blue-400 hover:text-blue-300 dark:text-blue-600 dark:hover:text-blue-700 text-sm">
          View All Resources
        </button>
      </div>
    </div>
  );
}
