import React, { useEffect, useState } from "react";
import * as faceapi from "face-api.js";
import FaceCapture from "./components/FaceCapture";
import AttendanceUploader from "./components/AttendanceUploader";
import AttendanceTable from "./components/AttendanceTable";

interface Student {
  id: string;
  name: string;
  enrollment: string;
  descriptor: Float32Array;
}

const isNumberArray = (value: unknown): value is number[] =>
  Array.isArray(value) &&
  value.every((item) => typeof item === "number" && Number.isFinite(item));

const hasNumberIterator = (value: unknown): value is Iterable<number> => {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  return (
    typeof (value as { [Symbol.iterator]?: unknown })[Symbol.iterator] ===
    "function"
  );
};

const toFloat32Array = (value: unknown): Float32Array | null => {
  if (value instanceof Float32Array) {
    return value;
  }

  if (
    typeof ArrayBuffer !== "undefined" &&
    ArrayBuffer.isView(value) &&
    !(value instanceof DataView) &&
    hasNumberIterator(value)
  ) {
    const numbers = Array.from(value);
    return numbers.length > 0 ? Float32Array.from(numbers) : null;
  }

  if (isNumberArray(value)) {
    return value.length > 0 ? new Float32Array(value) : null;
  }

  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      return isNumberArray(parsed) && parsed.length > 0
        ? new Float32Array(parsed)
        : null;
    } catch (error) {
      return null;
    }
  }

  return null;
};

const normalizeStudent = (raw: unknown, index: number): Student | null => {
  if (!raw || typeof raw !== "object") {
    console.warn(
      `Skipping malformed student record at index ${index}: expected object but received`,
      raw,
    );
    return null;
  }

  const candidate = raw as Record<string, unknown>;
  const { id, name, enrollment, descriptor } = candidate;

  if (
    typeof id !== "string" ||
    typeof name !== "string" ||
    typeof enrollment !== "string"
  ) {
    console.warn(
      `Skipping student record at index ${index} due to missing required fields`,
      candidate,
    );
    return null;
  }

  const parsedDescriptor = toFloat32Array(descriptor);

  if (!parsedDescriptor) {
    console.warn(
      `Skipping student '${name}' (${id}) due to invalid descriptor payload`,
      descriptor,
    );
    return null;
  }

  return {
    id,
    name,
    enrollment,
    descriptor: parsedDescriptor,
  };
};

const App: React.FC = () => {
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [students, setStudents] = useState<Student[]>([]);
  const [attendance, setAttendance] = useState<{ [key: string]: boolean }>({});

  // Load face-api.js models on app start
  useEffect(() => {
    const loadModels = async () => {
      try {
        await faceapi.nets.tinyFaceDetector.loadFromUri("/models");
        await faceapi.nets.faceLandmark68Net.loadFromUri("/models");
        await faceapi.nets.faceRecognitionNet.loadFromUri("/models");
        setModelsLoaded(true);
      } catch (error) {
        console.error("Error loading face-api.js models:", error);
      }
    };
    loadModels();
  }, []);

  // Fetch students from backend on mount
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/students");
        const data: unknown = await response.json();

        if (!Array.isArray(data)) {
          console.warn(
            "Unexpected students payload received from backend. Expected an array.",
            data,
          );
          setStudents([]);
          return;
        }

        const parsedStudents = data
          .map((record, index) => normalizeStudent(record, index))
          .filter((student): student is Student => student !== null);

        const uniqueStudents = Array.from(
          parsedStudents
            .reduce((accumulator, student) => {
              if (accumulator.has(student.id)) {
                console.warn(
                  `Duplicate student id '${student.id}' detected. Keeping the latest occurrence.`,
                );
              }
              accumulator.set(student.id, student);
              return accumulator;
            }, new Map<string, Student>())
            .values(),
        );

        setStudents(uniqueStudents);
      } catch (error) {
        console.error("Error fetching students:", error);
      }
    };
    if (modelsLoaded) {
      fetchStudents();
    }
  }, [modelsLoaded]);

  const addStudent = (student: Student) => {
    setStudents((prev) => [...prev, student]);
  };

  const markAttendance = (presentIds: string[]) => {
    const newAttendance: { [key: string]: boolean } = {};
    students.forEach((student) => {
      newAttendance[student.id] = presentIds.includes(student.id);
    });
    setAttendance(newAttendance);
  };

  if (!modelsLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">Loading face recognition models...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">
          Smart Attendance System
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <FaceCapture onAddStudent={addStudent} />
          <AttendanceUploader
            students={students}
            onMarkAttendance={markAttendance}
          />
          <AttendanceTable students={students} attendance={attendance} />
        </div>
      </div>
    </div>
  );
};

export default App;
