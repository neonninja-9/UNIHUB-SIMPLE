import React, { useState, useRef, useEffect } from "react";
import * as faceapi from "face-api.js";
import * as XLSX from "xlsx";

interface Student {
  id: string;
  name: string;
  enrollment: string;
  descriptor: Float32Array;
}

interface AttendanceRecord {
  studentId: string;
  courseId: string;
  date: string;
  status: string;
  synced: boolean;
}

const attendanceStatuses = ["present", "absent", "late"];

export function AttendanceWidget() {
  const today = new Date().toISOString().split("T")[0];
  const [students, setStudents] = useState<Student[]>([]);
  const [attendance, setAttendance] = useState<{ [studentId: string]: string }>(
    {},
  );
  const [courseId, setCourseId] = useState<string>("");
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [syncing, setSyncing] = useState(false);
  const [unsyncedCount, setUnsyncedCount] = useState(0);

  // Network status detection
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Load data from localStorage after component mounts
  useEffect(() => {
    const storedStudents = localStorage.getItem("attendance_students");
    if (storedStudents) {
      try {
        const parsed = JSON.parse(storedStudents);
        setStudents(
          parsed.map((s: any) => ({
            ...s,
            descriptor: new Float32Array(s.descriptor),
          })),
        );
      } catch (e) {
        console.error("Error parsing stored students:", e);
      }
    }

    const storedAttendance = localStorage.getItem(`attendance_${today}`);
    if (storedAttendance) {
      setAttendance(JSON.parse(storedAttendance));
    }

    // Load course ID from localStorage or set default
    const storedCourseId = localStorage.getItem("selected_course_id");
    if (storedCourseId) {
      setCourseId(storedCourseId);
    } else {
      setCourseId("101"); // Default course ID
    }

    // Count unsynced records
    updateUnsyncedCount();
  }, [today]);

  // Update unsynced count
  const updateUnsyncedCount = () => {
    const unsyncedRecords = JSON.parse(localStorage.getItem("unsynced_attendance") || "[]");
    setUnsyncedCount(unsyncedRecords.length);
  };

  // Auto-sync when coming online
  useEffect(() => {
    if (isOnline && !syncing) {
      syncUnsyncedAttendance();
    }
  }, [isOnline, syncing]);

  const [saved, setSaved] = useState(false);
  const [isFaceRecognitionActive, setIsFaceRecognitionActive] = useState(false);
  const [recognizedStudents, setRecognizedStudents] = useState(
    new Set<string>(),
  );
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [registerName, setRegisterName] = useState("");
  const [registerEnrollment, setRegisterEnrollment] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [isMarking, setIsMarking] = useState(false);
  const [classPhoto, setClassPhoto] = useState<File | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load face-api.js models
  useEffect(() => {
    const loadModels = async () => {
      try {
        await faceapi.nets.tinyFaceDetector.loadFromUri("/models");
        await faceapi.nets.faceLandmark68Net.loadFromUri("/models");
        await faceapi.nets.faceRecognitionNet.loadFromUri("/models");
        setModelsLoaded(true);
      } catch (error) {
        console.error("Error loading face-api models:", error);
      }
    };
    loadModels();
  }, []);

  // Save students to localStorage
  useEffect(() => {
    localStorage.setItem(
      "attendance_students",
      JSON.stringify(
        students.map((s) => ({
          ...s,
          descriptor: Array.from(s.descriptor),
        })),
      ),
    );
  }, [students]);

  // Save attendance to localStorage
  useEffect(() => {
    localStorage.setItem(`attendance_${today}`, JSON.stringify(attendance));
  }, [attendance, today]);

  const registerStudent = async () => {
    if (!modelsLoaded || !registerName.trim() || !registerEnrollment.trim())
      return;

    setIsRegistering(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }

      // Wait for video to load
      await new Promise((resolve) => {
        if (videoRef.current) {
          videoRef.current.onloadedmetadata = resolve;
        }
      });

      if (!videoRef.current) return;

      const detections = await faceapi
        .detectAllFaces(videoRef.current, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceDescriptors();

      if (detections.length === 0) {
        alert(
          "No face detected. Please position yourself in front of the camera.",
        );
      } else if (detections.length > 1) {
        alert(
          "Multiple faces detected. Please ensure only one face is visible.",
        );
      } else {
        const descriptor = detections[0].descriptor;
        const newStudent: Student = {
          id: Date.now().toString(),
          name: registerName.trim(),
          enrollment: registerEnrollment.trim(),
          descriptor,
        };
        setStudents((prev) => [...prev, newStudent]);
        setRegisterName("");
        setRegisterEnrollment("");
        alert("Student registered successfully!");
      }

      // Stop stream
      stream.getTracks().forEach((track) => track.stop());
      if (videoRef.current) videoRef.current.srcObject = null;
    } catch (error) {
      console.error("Error registering student:", error);
      alert("Error accessing camera. Please check permissions.");
    } finally {
      setIsRegistering(false);
    }
  };

  const markAttendanceFromPhoto = async () => {
    if (!classPhoto || students.length === 0) return;

    setIsMarking(true);
    try {
      const img = await faceapi.fetchImage(URL.createObjectURL(classPhoto));
      const detections = await faceapi
        .detectAllFaces(img, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceDescriptors();

      const presentIds = new Set<string>();
      detections.forEach((detection) => {
        let bestMatch = { distance: Infinity, student: null as Student | null };
        students.forEach((student) => {
          const distance = faceapi.euclideanDistance(
            detection.descriptor,
            student.descriptor,
          );
          if (distance < bestMatch.distance) {
            bestMatch = { distance, student };
          }
        });
        if (bestMatch.distance < 0.6 && bestMatch.student) {
          presentIds.add(bestMatch.student.id);
        }
      });

      const newAttendance = { ...attendance };
      students.forEach((student) => {
        newAttendance[student.id] = presentIds.has(student.id)
          ? "present"
          : "absent";
      });
      setAttendance(newAttendance);
      setClassPhoto(null);
      alert(
        `Attendance marked! ${presentIds.size} students present out of ${detections.length} faces detected.`,
      );
    } catch (error) {
      console.error("Error marking attendance:", error);
      alert("Error processing the image.");
    } finally {
      setIsMarking(false);
    }
  };

  const downloadExcel = () => {
    const data = students.map((student) => ({
      Name: student.name,
      Enrollment_No: student.enrollment,
      Attendance_ID: student.id,
      Status: attendance[student.id] || "absent",
      Date: today,
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Attendance");
    XLSX.writeFile(wb, `attendance_${today}.xlsx`);
  };

  const handleMark = (studentId: string, status: string) => {
    setAttendance((prev) => ({ ...prev, [studentId]: status }));
    setSaved(false);
  };

  // Sync unsynced attendance records to backend
  const syncUnsyncedAttendance = async () => {
    const unsyncedRecords: AttendanceRecord[] = JSON.parse(localStorage.getItem("unsynced_attendance") || "[]");
    if (unsyncedRecords.length === 0) return;

    setSyncing(true);
    try {
      const response = await fetch("http://localhost:3002/api/attendance/bulk", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(unsyncedRecords),
      });

      if (response.ok) {
        // Mark records as synced and remove from localStorage
        localStorage.setItem("unsynced_attendance", "[]");
        setUnsyncedCount(0);
        console.log("Attendance synced successfully");
      } else {
        console.error("Failed to sync attendance");
      }
    } catch (error) {
      console.error("Error syncing attendance:", error);
    } finally {
      setSyncing(false);
    }
  };

  const handleSave = () => {
    // Save attendance locally
    localStorage.setItem(`attendance_${today}`, JSON.stringify(attendance));

    // Create attendance records for syncing
    const attendanceRecords: AttendanceRecord[] = students
      .filter(student => attendance[student.id])
      .map(student => ({
        studentId: student.id,
        courseId: courseId,
        date: today,
        status: attendance[student.id],
        synced: false,
      }));

    // Add to unsynced queue
    const existingUnsynced = JSON.parse(localStorage.getItem("unsynced_attendance") || "[]");
    const updatedUnsynced = [...existingUnsynced, ...attendanceRecords];
    localStorage.setItem("unsynced_attendance", JSON.stringify(updatedUnsynced));

    setSaved(true);
    updateUnsyncedCount();

    // Try to sync immediately if online
    if (isOnline) {
      syncUnsyncedAttendance();
    }
  };

  const handleReset = () => {
    setAttendance({});
    setSaved(false);
  };

  return (
    <div className="bg-white dark:bg-[#181e34] rounded-xl shadow-lg p-6 mb-8 w-full max-w-4xl mx-auto animate-fade-in">
      <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
        AI-Powered Face Recognition Attendance
      </h2>
      <p className="mb-4 text-xs text-gray-400 dark:text-gray-400">
        Today's Date:{" "}
        <span className="font-semibold text-gray-800 dark:text-gray-200">
          {today}
        </span>
        <span className={`ml-2 px-2 py-1 rounded text-xs font-medium ${isOnline ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'}`}>
          {isOnline ? 'Online' : 'Offline'}
        </span>
        {unsyncedCount > 0 && (
          <span className="ml-2 px-2 py-1 rounded text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
            {unsyncedCount} unsynced
          </span>
        )}
        {syncing && (
          <span className="ml-2 px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
            Syncing...
          </span>
        )}
      </p>

      {/* Student Registration Section */}
      <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <h3 className="text-lg font-semibold mb-3 text-gray-800 dark:text-white">
          Register Student
        </h3>
        <div className="mb-3 flex gap-2">
          <input
            type="text"
            placeholder="Student Name"
            value={registerName}
            onChange={(e) => setRegisterName(e.target.value)}
            className="flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
          <input
            type="text"
            placeholder="Enrollment Number"
            value={registerEnrollment}
            onChange={(e) => setRegisterEnrollment(e.target.value)}
            className="flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        </div>
        <button
          onClick={registerStudent}
          disabled={
            isRegistering ||
            !modelsLoaded ||
            !registerName.trim() ||
            !registerEnrollment.trim()
          }
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400"
        >
          {isRegistering
            ? "Registering..."
            : modelsLoaded
              ? "Capture Face & Register"
              : "Loading Models..."}
        </button>
        {isRegistering && (
          <div className="relative mt-3">
            <video
              ref={videoRef}
              width="320"
              height="240"
              className="border border-gray-300 dark:border-gray-600 rounded-md"
            />
            <canvas
              ref={canvasRef}
              className="absolute top-0 left-0"
              width="320"
              height="240"
            />
          </div>
        )}
      </div>

      {/* Attendance Marking Section */}
      <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <h3 className="text-lg font-semibold mb-3 text-gray-800 dark:text-white">
          Mark Attendance from Class Photo
        </h3>
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={(e) => setClassPhoto(e.target.files?.[0] || null)}
          className="mb-3"
        />
        <button
          onClick={markAttendanceFromPhoto}
          disabled={isMarking || !classPhoto || students.length === 0}
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-400"
        >
          {isMarking ? "Processing..." : "Upload & Mark Attendance"}
        </button>
        {students.length === 0 && (
          <p className="text-sm text-red-600 dark:text-red-400 mt-2">
            No registered students. Please register students first.
          </p>
        )}
      </div>

      {/* Attendance Table */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3 text-gray-800 dark:text-white">
          Attendance Table
        </h3>
        <table className="w-full text-left mb-3">
          <thead>
            <tr className="text-xs text-gray-500 dark:text-gray-400">
              <th className="py-1 px-2">Name</th>
              <th className="py-1 px-2">Enrollment No.</th>
              <th className="py-1 px-2">Status</th>
              <th className="py-1 px-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr
                key={student.id}
                className="border-t border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-[#1a2238] transition"
              >
                <td className="py-1 px-2 text-sm font-medium text-gray-900 dark:text-gray-100">
                  {student.name}
                </td>
                <td className="py-1 px-2 text-xs text-gray-600 dark:text-gray-300">
                  {student.enrollment}
                </td>
                <td className="py-1 px-2 text-sm font-semibold">
                  <span
                    className={`px-2 py-1 rounded ${
                      attendance[student.id] === "present"
                        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                        : attendance[student.id] === "absent"
                          ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                          : attendance[student.id] === "late"
                            ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                            : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
                    }`}
                  >
                    {(attendance[student.id] || "absent")
                      .charAt(0)
                      .toUpperCase() +
                      (attendance[student.id] || "absent").slice(1)}
                  </span>
                </td>
                <td className="py-1 px-2">
                  <div className="flex gap-1">
                    {attendanceStatuses.map((status) => (
                      <button
                        key={status}
                        onClick={() => handleMark(student.id, status)}
                        className={`text-xs px-2 py-1 rounded border border-gray-200 dark:border-gray-600 font-medium transition ${
                          attendance[student.id] === status
                            ? "bg-blue-600 text-white dark:bg-blue-500"
                            : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300 hover:bg-blue-100 dark:hover:bg-blue-900"
                        }`}
                      >
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </button>
                    ))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {students.length === 0 && (
          <p className="text-gray-500 dark:text-gray-400 mt-4">
            No students registered yet. Register students first.
          </p>
        )}
      </div>

      <div className="flex gap-3 justify-between mt-4">
        <button
          onClick={downloadExcel}
          disabled={students.length === 0}
          className="px-4 py-2 text-xs font-semibold rounded-lg bg-purple-600 text-white hover:bg-purple-700 disabled:bg-gray-400"
        >
          Download Excel Report
        </button>
        <div className="flex gap-3">
          <button
            onClick={handleReset}
            className="px-4 py-2 text-xs font-semibold rounded-lg bg-gray-300 dark:bg-gray-800 text-gray-800 dark:text-gray-200 hover:bg-gray-400 dark:hover:bg-gray-700 transition"
          >
            Reset
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 text-xs font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
          >
            Save Attendance
          </button>
        </div>
      </div>
      {saved && (
        <div className="mt-4 text-green-600 dark:text-green-400 text-sm font-semibold">
          Attendance saved!
        </div>
      )}
    </div>
  );
}
