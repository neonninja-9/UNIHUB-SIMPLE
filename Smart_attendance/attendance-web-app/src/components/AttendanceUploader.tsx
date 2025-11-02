import React, { useRef, useState } from "react";
import * as faceapi from "face-api.js";

interface Student {
  id: string;
  name: string;
  enrollment: string;
  descriptor: Float32Array;
}

interface AttendanceUploaderProps {
  students: Student[];
  onMarkAttendance: (presentIds: string[]) => void;
}

const AttendanceUploader: React.FC<AttendanceUploaderProps> = ({
  students,
  onMarkAttendance,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  // Handle file upload and process attendance
  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const inputElement = event.target;
    const file = inputElement.files?.[0];
    if (!file) {
      return;
    }

    if (students.length === 0) {
      setModalMessage(
        "No registered students found. Please capture student faces before marking attendance.",
      );
      setShowModal(true);
      inputElement.value = "";
      return;
    }

    setIsProcessing(true);
    const objectUrl = URL.createObjectURL(file);
    try {
      const img = await faceapi.fetchImage(objectUrl);
      const detections = await faceapi
        .detectAllFaces(img, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceDescriptors();

      if (detections.length === 0) {
        setModalMessage("No faces detected in the uploaded image.");
        setShowModal(true);
        return;
      }

      const presentIds = new Set<string>();
      detections.forEach((detection) => {
        const descriptor = detection.descriptor;
        let bestMatch = { distance: Infinity, student: null as Student | null };

        students.forEach((student) => {
          const distance = faceapi.euclideanDistance(
            descriptor,
            student.descriptor,
          );
          if (distance < bestMatch.distance) {
            bestMatch = { distance, student };
          }
        });

        // Threshold for match (adjust as needed)
        if (bestMatch.distance < 0.6 && bestMatch.student) {
          presentIds.add(bestMatch.student.id);
        }
      });

      const presentIdsArray = Array.from(presentIds);

      // POST attendance to backend
      const attendanceRecords = presentIdsArray.map((id) => ({
        studentId: id,
        date: new Date().toISOString().split("T")[0], // YYYY-MM-DD
        status: "present",
      }));

      try {
        if (attendanceRecords.length > 0) {
          await Promise.all(
            attendanceRecords.map(async (record) => {
              const response = await fetch(
                "http://localhost:5000/api/attendance",
                {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify(record),
                },
              );

              if (!response.ok) {
                throw new Error(
                  `Failed to record attendance for student ${record.studentId}`,
                );
              }
            }),
          );
        }

        onMarkAttendance(presentIdsArray);

        const successMessage =
          attendanceRecords.length > 0
            ? `Attendance marked! ${presentIdsArray.length} student${presentIdsArray.length === 1 ? "" : "s"} present out of ${detections.length} face${detections.length === 1 ? "" : "s"} detected.`
            : `Faces detected (${detections.length}), but none matched registered students.`;

        setModalMessage(successMessage);
        setShowModal(true);
      } catch (error) {
        console.error("Error posting attendance:", error);
        setModalMessage("Error saving attendance to backend.");
        setShowModal(true);
      }

      // Draw detections on canvas
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext("2d");
        if (ctx) {
          canvas.width = img.width;
          canvas.height = img.height;
          ctx.drawImage(img, 0, 0);
          detections.forEach((detection) => {
            const { x, y, width, height } = detection.detection.box;
            ctx.strokeStyle = "green";
            ctx.lineWidth = 2;
            ctx.strokeRect(x, y, width, height);
          });
        }
      }
    } catch (error) {
      console.error("Error processing image:", error);
      setModalMessage("Error processing the image. Please try again.");
      setShowModal(true);
    } finally {
      setIsProcessing(false);
      URL.revokeObjectURL(objectUrl);
      inputElement.value = "";
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Upload Class Photo</h2>
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleFileUpload}
        className="mb-4"
      />
      <button
        onClick={() => fileInputRef.current?.click()}
        disabled={isProcessing}
        className="w-full bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 disabled:bg-gray-400 mb-4"
      >
        {isProcessing ? "Processing..." : "Upload and Mark Attendance"}
      </button>
      <canvas
        ref={canvasRef}
        className="w-full border border-gray-300 rounded"
      />
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <p className="mb-4">{modalMessage}</p>
            <button
              onClick={() => setShowModal(false)}
              className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AttendanceUploader;
