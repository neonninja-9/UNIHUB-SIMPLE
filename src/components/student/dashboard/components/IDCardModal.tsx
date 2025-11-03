import React from "react";
import { X } from "lucide-react";
import { IDCard } from "./IDCard";
import { UniversityLogoIcon } from "./icons";

interface IDCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: {
    name: string;
    enrollment_no?: string;
    date_of_birth?: string;
    blood_group?: string;
    phone?: string;
    parent_phone?: string;
    institution_name?: string;
    id_card_no?: string;
    profile_photo?: string;
  };
}

export function IDCardModal({ isOpen, onClose, student }: IDCardModalProps) {
  if (!isOpen) return null;

  // Map the student data to the IDCard component's expected format
  const idCardStudent = {
    universityName: student.institution_name || "University of Technology",
    universityCampus: "Main Campus",
    studentPhotoUrl:
      student.profile_photo ||
      `data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjI1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiByb2xlPSJpbWciIGFyaWEtbGFiZWw9IlBsYWNlaG9sZGVyOiBTdHVkZW50IFBob3RvIiBwcmVzZXJ2ZUFzcGVjdFJhdGlvPSJ4TWlkWU1pZCBzbGljZSIgZm9jdXNhYmxlPSJmYWxzZSI+PHRpdGxlPlBsYWNlaG9sZGVyPC90aXRsZT48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjODY4ZTk2Ij48L3JlY3Q+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZpbGw9IiNkZWUyZTYiIGR5PSIuM2VtIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5TdHVkZW50IFBob3RvPC90ZXh0Pjwvc3ZnPg==`,
    studentName: student.name,
    degree: "Bachelor of Technology",
    branch: "Computer Science",
    session: "2024-2028",
    issuingAuthoritySignatureUrl:
      "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMzUiPjxwYXRoIGQ9Ik0xIDMzYzQgLTQgOCAtMiAxMyAtNGM1IC0yIDEwIC01IDE1IC02YzUgLTEgMTEgLTIgMTYgMGM1IDIgOSAzIDE0IDVjNSAyIDEwIDMgMTUgM2M1IDAgOSAtMyAxNCAtNWMzIC0xIDQgLTIgNiAtMiIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjMDAwIiBzdHJva2Utd2lkdGg9IjEuNSIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIi8+PC9zdmc+",
    holderSignatureUrl:
      "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMzUiPjxwYXRoIGQ9Ik0xIDMxYzIgLTYgNSAtMTEgMTIgLTEzYzcgLTIgMTQgMiAxOSA1YzUgMyAxMSA1IDE3IDRjNiAtMSA5IC02IDE1IC03czEyIDIgMTcgN2M1IDUgMTAgNyAxNSA2YzUgLTEgOCAtNSAxMCAtMTIiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzAwMCIgc3Ryb2tlLXdpZHRoPSIxLjUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIvPjwvc3ZnPg==",
    enrollmentNo: student.enrollment_no || "EN2024001",
    dob: student.date_of_birth || "15.05.2000",
    bloodGroup: student.blood_group || "O+",
    emergencyContact: {
      family: student.parent_phone || "9876543210",
      institution: student.phone || "1234567890",
    },
    validity: "15.05.2028",
    idCardNo: student.id_card_no || "IDC2024001",
    lostAndFoundContact: "1800-XXX-XXXX",
  };

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
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)] flex justify-center">
          <IDCard student={idCardStudent} />
        </div>

        {/* Footer with instructions */}
        <div className="p-4 border-t bg-gray-50 text-center">
          <p className="text-sm text-gray-600">
            Click the card to flip and view details
          </p>
        </div>
      </div>
    </div>
  );
}
