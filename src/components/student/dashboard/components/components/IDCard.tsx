import React, { useState } from "react";
import { Student } from "../types";
import { UniversityLogoIcon } from "./icons";

interface IDCardProps {
  student: Student;
}

export const IDCard: React.FC<IDCardProps> = ({ student }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <div
      className="group w-[320px] h-[512px] sm:w-[337px] sm:h-[539px] [perspective:1000px] cursor-pointer"
      onClick={handleFlip}
      aria-label="Student ID Card, click to flip"
    >
      <div
        className={`card-flipper relative w-full h-full text-center transition-transform duration-700 ease-in-out [transform-style:preserve-3d] ${isFlipped ? "[transform:rotateY(180deg)]" : ""}`}
      >
        {/* Front Side */}
        <div className="card-front absolute w-full h-full [backface-visibility:hidden] rounded-2xl overflow-hidden shadow-2xl bg-white flex flex-col">
          <div className="bg-[#0f2e5f] text-white p-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 flex items-center justify-center">
                <UniversityLogoIcon />
              </div>
              <div>
                <h1 className="font-bold text-xl tracking-wide">
                  {student.universityName}
                </h1>
                <p className="text-xs font-light tracking-widest border-t border-yellow-400 pt-1 mt-1">
                  {student.universityCampus}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-[#e88f4b] flex-grow flex flex-col items-center justify-center p-4 relative">
            <div className="absolute top-0 left-0 w-full h-full bg-black opacity-5"></div>
            <div className="w-36 h-44 border-4 border-white rounded-lg overflow-hidden shadow-lg mb-3">
              <img
                src={student.studentPhotoUrl}
                alt="Student photo"
                className="w-full h-full object-cover"
              />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">
              {student.studentName}
            </h2>
            <p className="text-lg font-medium text-gray-700">
              {student.degree} ({student.branch})
            </p>
            <p className="text-md font-normal text-gray-600 mt-1">
              {student.session}
            </p>

            <div className="absolute bottom-4 w-full px-6 flex justify-between items-end">
              <div className="text-center">
                <img
                  src={student.issuingAuthoritySignatureUrl}
                  alt="Issuing Authority Signature"
                  className="h-8 w-24 mx-auto"
                />
                <p className="text-xs font-semibold text-gray-800 border-t border-gray-600 pt-1 mt-1">
                  Issuing Authority
                </p>
              </div>
              <div className="text-center">
                <img
                  src={student.holderSignatureUrl}
                  alt="Holder's Signature"
                  className="h-8 w-24 mx-auto"
                />
                <p className="text-xs font-semibold text-gray-800 border-t border-gray-600 pt-1 mt-1">
                  Holder's Signature
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Back Side */}
        <div className="card-back absolute w-full h-full [backface-visibility:hidden] [transform:rotateY(180deg)] rounded-2xl overflow-hidden shadow-2xl bg-white p-6 text-gray-800 flex flex-col justify-between font-mono">
          <div>
            <InfoRow label="Enrollment No" value={student.enrollmentNo} />
            <InfoRow label="Date Of Birth" value={student.dob} />
            <InfoRow label="Blood Group" value={student.bloodGroup} />
          </div>

          <div className="my-4">
            <p className="font-semibold">In case of emergency, Please call :</p>
            <ul className="list-none pl-2 mt-1 space-y-1">
              <li>
                <span className="font-semibold">■ Family :</span>{" "}
                {student.emergencyContact.family}
              </li>
              <li>
                <span className="font-semibold">■ Institution :</span>{" "}
                {student.emergencyContact.institution}
              </li>
            </ul>
          </div>

          <div className="space-y-2">
            <InfoRow label="Validity" value={student.validity} />
            <InfoRow label="ID Card No" value={student.idCardNo} />
          </div>

          <div className="border-t border-gray-200 mt-auto pt-3 text-center text-xs">
            <p>If this card is found, please report to</p>
            <p>
              the office number -{" "}
              <span className="font-semibold">
                {student.lostAndFoundContact}
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper component for uniform rows on the back of the card
const InfoRow: React.FC<{ label: string; value: string }> = ({
  label,
  value,
}) => (
  <div className="flex justify-between items-baseline mb-2 text-sm">
    <span className="font-semibold text-gray-600">{label} :</span>
    <span className="font-bold text-right">{value}</span>
  </div>
);
