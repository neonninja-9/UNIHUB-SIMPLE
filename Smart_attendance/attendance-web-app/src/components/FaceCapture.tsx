import React, { useRef, useEffect, useState } from "react";
import * as faceapi from "face-api.js";
import { v4 as uuidv4 } from "uuid";

interface Student {
  id: string;
  name: string;
  enrollment: string;
  descriptor: Float32Array;
}

interface FaceCaptureProps {
  onAddStudent: (student: Student) => void;
}

const FaceCapture: React.FC<FaceCaptureProps> = ({ onAddStudent }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [name, setName] = useState("");
  const [enrollment, setEnrollment] = useState("");
  const [isCapturing, setIsCapturing] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  // Start webcam
  useEffect(() => {
    const startVideo = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error("Error accessing webcam:", error);
      }
    };
    startVideo();
  }, []);

  // Draw detections on canvas
  const drawDetections = (detections: faceapi.FaceDetection[]) => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (!canvas || !video) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    detections.forEach((detection) => {
      const { x, y, width, height } = detection.box;
      ctx.strokeStyle = "green";
      ctx.lineWidth = 2;
      ctx.strokeRect(x, y, width, height);
    });
  };

  // Capture face and compute descriptor
  const captureFace = async () => {
    if (!videoRef.current || !name.trim() || !enrollment.trim()) return;

    setIsCapturing(true);
    try {
      const detections = await faceapi
        .detectAllFaces(videoRef.current, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceDescriptors();
      if (detections.length === 0) {
        setModalMessage(
          "No face detected. Please position yourself in front of the camera.",
        );
        setShowModal(true);
        return;
      }
      if (detections.length > 1) {
        setModalMessage(
          "Multiple faces detected. Please ensure only one face is visible.",
        );
        setShowModal(true);
        return;
      }

      const descriptor = detections[0].descriptor;
      const student: Student = {
        id: uuidv4(),
        name: name.trim(),
        enrollment: enrollment.trim(),
        descriptor,
      };

      // POST to backend
      try {
        const response = await fetch("http://localhost:5000/api/students", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...student,
            descriptor: Array.from(descriptor), // Convert to array for JSON
          }),
        });
        if (response.ok) {
          onAddStudent(student);
          setModalMessage("Student face captured and stored successfully!");
          setShowModal(true);
          setName("");
          setEnrollment("");
        } else {
          setModalMessage("Error saving student to backend.");
          setShowModal(true);
        }
      } catch (error) {
        console.error("Error posting student:", error);
        setModalMessage("Error saving student to backend.");
        setShowModal(true);
      }
    } catch (error) {
      console.error("Error capturing face:", error);
      setModalMessage("Error capturing face. Please try again.");
      setShowModal(true);
    } finally {
      setIsCapturing(false);
    }
  };

  // Real-time face detection
  useEffect(() => {
    const interval = setInterval(async () => {
      if (videoRef.current && videoRef.current.readyState === 4) {
        const detections = await faceapi.detectAllFaces(
          videoRef.current,
          new faceapi.TinyFaceDetectorOptions(),
        );
        drawDetections(detections);
      }
    }, 100);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Capture Student Face</h2>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Student Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded mb-2"
        />
        <input
          type="text"
          placeholder="Enrollment Number"
          value={enrollment}
          onChange={(e) => setEnrollment(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
        />
      </div>
      <div className="relative mb-4">
        <video ref={videoRef} autoPlay muted className="w-full rounded" />
        <canvas
          ref={canvasRef}
          className="absolute top-0 left-0 w-full h-full"
        />
      </div>
      <button
        onClick={captureFace}
        disabled={isCapturing || !name.trim() || !enrollment.trim()}
        className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 disabled:bg-gray-400"
      >
        {isCapturing ? "Capturing..." : "Capture Face"}
      </button>
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <p className="mb-4">{modalMessage}</p>
            <button
              onClick={() => setShowModal(false)}
              className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FaceCapture;
