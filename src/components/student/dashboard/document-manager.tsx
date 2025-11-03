"use client";

import React, { useState, useEffect } from "react";
import { FileText, Download, Eye, ExternalLink, RefreshCw } from "lucide-react";

interface Document {
  id: string;
  name: string;
  type: string;
  issuer: string;
  issueDate: string;
  expiryDate?: string;
  status: "active" | "expired" | "pending";
  downloadUrl?: string;
  previewUrl?: string;
}

interface DocumentManagerProps {
  studentId: number;
}

export const DocumentManager: React.FC<DocumentManagerProps> = ({
  studentId,
}) => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Mock documents data - in real implementation, this would come from DigiLocker API
  const mockDocuments: Document[] = [
    {
      id: "1",
      name: "Class 10 Marksheet",
      type: "Academic Certificate",
      issuer: "Central Board of Secondary Education",
      issueDate: "2020-05-15",
      status: "active",
      downloadUrl: "#",
      previewUrl: "#",
    },
    {
      id: "2",
      name: "Class 12 Marksheet",
      type: "Academic Certificate",
      issuer: "Central Board of Secondary Education",
      issueDate: "2022-05-20",
      status: "active",
      downloadUrl: "#",
      previewUrl: "#",
    },
    {
      id: "3",
      name: "Bachelor Degree Certificate",
      type: "Degree Certificate",
      issuer: "University of Delhi",
      issueDate: "2024-06-10",
      status: "pending",
      downloadUrl: "#",
      previewUrl: "#",
    },
    {
      id: "4",
      name: "Aadhaar Card",
      type: "Identity Document",
      issuer: "Unique Identification Authority of India",
      issueDate: "2018-03-12",
      status: "active",
      downloadUrl: "#",
      previewUrl: "#",
    },
  ];

  useEffect(() => {
    fetchDocuments();
  }, [studentId]);

  const fetchDocuments = async () => {
    setLoading(true);
    setError(null);

    try {
      // Simulate API call to DigiLocker
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // In real implementation, this would be:
      // const response = await fetch(`/api/digilocker/documents/${studentId}`);
      // const data = await response.json();

      setDocuments(mockDocuments);
      setIsAuthenticated(true);
    } catch (err) {
      setError("Failed to fetch documents from DigiLocker");
      console.error("Error fetching documents:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAuthenticate = () => {
    // In real implementation, this would redirect to DigiLocker OAuth
    window.open("https://www.digilocker.gov.in/", "_blank");
    setIsAuthenticated(true);
  };

  const handleDownload = (doc: Document) => {
    // In real implementation, this would trigger download from DigiLocker
    console.log("Downloading document:", doc.name);
    // Simulate download
    const link = document.createElement("a");
    link.href = doc.downloadUrl || "#";
    link.download = doc.name;
    link.click();
  };

  const handlePreview = (doc: Document) => {
    // In real implementation, this would open preview in new tab
    window.open(doc.previewUrl || "#", "_blank");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "text-green-400 bg-green-400/10";
      case "expired":
        return "text-red-400 bg-red-400/10";
      case "pending":
        return "text-yellow-400 bg-yellow-400/10";
      default:
        return "text-gray-400 bg-gray-400/10";
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="bg-white dark:bg-[#181e34] rounded-xl shadow-lg p-6">
        <div className="text-center">
          <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
            Connect to DigiLocker
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Authenticate with DigiLocker to access your verified documents
          </p>
          <button
            onClick={handleAuthenticate}
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            Connect DigiLocker
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-[#181e34] rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
          Document Manager
        </h2>
        <button
          onClick={fetchDocuments}
          disabled={loading}
          className="flex items-center px-3 py-2 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors disabled:opacity-50"
        >
          <RefreshCw
            className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`}
          />
          Refresh
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/20 border border-red-300 dark:border-red-700 rounded-lg">
          <p className="text-red-700 dark:text-red-400 text-sm">{error}</p>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <RefreshCw className="w-8 h-8 animate-spin text-gray-400" />
          <span className="ml-2 text-gray-600 dark:text-gray-300">
            Loading documents...
          </span>
        </div>
      ) : (
        <div className="space-y-4">
          {documents.map((doc) => (
            <div
              key={doc.id}
              className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
            >
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <FileText className="w-5 h-5 text-blue-500" />
                  <h3 className="font-medium text-gray-900 dark:text-white">
                    {doc.name}
                  </h3>
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${getStatusColor(doc.status)}`}
                  >
                    {doc.status.charAt(0).toUpperCase() + doc.status.slice(1)}
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">
                  {doc.type} • Issued by {doc.issuer}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Issued: {new Date(doc.issueDate).toLocaleDateString()}
                  {doc.expiryDate &&
                    ` • Expires: ${new Date(doc.expiryDate).toLocaleDateString()}`}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handlePreview(doc)}
                  className="flex items-center px-3 py-2 text-sm bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/40 transition-colors"
                >
                  <Eye className="w-4 h-4 mr-1" />
                  Preview
                </button>
                <button
                  onClick={() => handleDownload(doc)}
                  className="flex items-center px-3 py-2 text-sm bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded-lg hover:bg-green-200 dark:hover:bg-green-900/40 transition-colors"
                >
                  <Download className="w-4 h-4 mr-1" />
                  Download
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
          About DigiLocker Integration
        </h4>
        <p className="text-sm text-blue-800 dark:text-blue-200">
          DigiLocker is a government service that allows you to store and access
          your documents digitally. All documents displayed here are verified
          and secure. For any issues with document access, please contact
          DigiLocker support.
        </p>
      </div>
    </div>
  );
};
