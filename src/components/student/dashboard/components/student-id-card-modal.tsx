"use client";

import React, { useRef } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import {
  X,
  Download,
  Phone,
  Calendar,
  Droplet,
  User,
  MapPin,
} from "lucide-react";

interface StudentIDCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: {
    name: string;
    enrollment_no: string;
    date_of_birth: string;
    blood_group: string;
    phone: string;
    parent_phone?: string;
    institution_name: string;
    id_card_no: string;
    profile_photo?: string;
  };
}

export function StudentIDCardModal({
  isOpen,
  onClose,
  student,
}: StudentIDCardModalProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  const downloadPDF = async () => {
    if (!cardRef.current) return;

    try {
      const canvas = await html2canvas(cardRef.current, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#ffffff",
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const imgWidth = 210;
      const pageHeight = 297;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;

      let position = 0;

      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`Student_ID_Card_${student.name.replace(/\s+/g, "_")}.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b bg-gray-50">
          <h2 className="text-xl font-bold text-gray-800">Student ID Card</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* ID Card Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          <div
            ref={cardRef}
            className="bg-gradient-to-br from-blue-600 to-purple-700 rounded-xl p-6 text-white shadow-lg"
            style={{ minHeight: "400px" }}
          >
            {/* Header with Logo and Institution */}
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center space-x-3">
                {/* Profile Photo */}
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center overflow-hidden">
                  {student.profile_photo ? (
                    <img
                      src={student.profile_photo}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User size={32} className="text-gray-600" />
                  )}
                </div>
                <div>
                  <h3 className="text-lg font-bold">
                    {student.institution_name}
                  </h3>
                  <p className="text-sm opacity-90">Student ID Card</p>
                </div>
              </div>
              {/* Institution Logo Placeholder */}
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                <MapPin size={24} />
              </div>
            </div>

            {/* Student Details */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <User size={18} className="opacity-80" />
                <div>
                  <p className="text-xs opacity-80">Name</p>
                  <p className="font-semibold">{student.name}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <MapPin size={18} className="opacity-80" />
                <div>
                  <p className="text-xs opacity-80">Enrollment No.</p>
                  <p className="font-semibold">{student.enrollment_no}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Calendar size={18} className="opacity-80" />
                <div>
                  <p className="text-xs opacity-80">Date of Birth</p>
                  <p className="font-semibold">{student.date_of_birth}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Droplet size={18} className="opacity-80" />
                <div>
                  <p className="text-xs opacity-80">Blood Group</p>
                  <p className="font-semibold">{student.blood_group}</p>
                </div>
              </div>

              <div className="border-t border-white border-opacity-30 pt-4">
                <div className="flex items-center space-x-3 mb-2">
                  <Phone size={18} className="opacity-80" />
                  <div>
                    <p className="text-xs opacity-80">
                      In Case of Emergency, Please Call:
                    </p>
                    <p className="font-semibold">{student.phone}</p>
                  </div>
                </div>
                {student.parent_phone && (
                  <div className="flex items-center space-x-3">
                    <Phone size={18} className="opacity-80" />
                    <div>
                      <p className="text-xs opacity-80">Family Contact</p>
                      <p className="font-semibold">{student.parent_phone}</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="border-t border-white border-opacity-30 pt-4 text-center">
                <p className="text-xs opacity-80">ID Card No.</p>
                <p className="text-lg font-bold">{student.id_card_no}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Download Button */}
        <div className="p-4 border-t bg-gray-50">
          <button
            onClick={downloadPDF}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
          >
            <Download size={20} />
            <span>Download ID Card</span>
          </button>
        </div>
      </div>
    </div>
  );
}
