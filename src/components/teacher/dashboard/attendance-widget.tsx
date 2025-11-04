import React, { useState, useRef, useEffect } from "react";
import * as faceapi from "face-api.js";
import * as XLSX from "xlsx";

interface Student {
  id: string;
  name: string;
  enrollment: string;
  whatsappNumber: string;
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
  // Initialize as true to avoid hydration mismatch (will be set correctly in useEffect)
  const [isOnline, setIsOnline] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [unsyncedCount, setUnsyncedCount] = useState(0);

  // Network status detection - set after mount to avoid hydration mismatch
  useEffect(() => {
    // Set initial online status after component mounts (client-side only)
    if (typeof window !== 'undefined') {
      setIsOnline(navigator.onLine);
    }

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    if (typeof window !== 'undefined') {
      window.addEventListener('online', handleOnline);
      window.addEventListener('offline', handleOffline);
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
      }
    };
  }, []);

  // Load students from permanent database storage on component mount
  useEffect(() => {
    const loadStudentsFromDatabase = async () => {
      console.log("Loading students from permanent database...");
      try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3002";
        
        // Fetch both student faces and student data
        const [facesResponse, studentsResponse] = await Promise.all([
          fetch(`${API_URL}/api/student-faces`).catch((err) => {
            console.error("Error fetching student faces:", err);
            return null;
          }),
          fetch(`${API_URL}/api/students`).catch((err) => {
            console.error("Error fetching students:", err);
            return null;
          }),
        ]);

        if (facesResponse?.ok && studentsResponse?.ok) {
          const facesData = await facesResponse.json();
          const studentsData = await studentsResponse.json();
          
          console.log(`Loaded ${Array.isArray(studentsData) ? studentsData.length : studentsData.data?.length || 0} students from database`);
          console.log(`Loaded ${Array.isArray(facesData.data || facesData) ? (facesData.data || facesData).length : 0} face embeddings from database`);
          
          // Handle different response formats
          const faces = facesData.data || facesData;
          const students = studentsData.data || studentsData;
          
          // Combine student data with face embeddings
          const studentsWithFaces: Student[] = (Array.isArray(faces) ? faces : [])
            .map((face: any): Student | null => {
              const student = (Array.isArray(students) ? students : []).find((s: any) => s.id === face.student_id);
              if (student && face.face_embedding) {
                try {
                  // Handle both string (JSON) and array formats for face_embedding
                  let embedding: number[];
                  if (typeof face.face_embedding === 'string') {
                    embedding = JSON.parse(face.face_embedding);
                  } else if (Array.isArray(face.face_embedding)) {
                    embedding = face.face_embedding;
                  } else {
                    console.warn(`Invalid face embedding format for student ${face.student_id}`);
                    return null;
                  }
                  
                  const studentObj: Student = {
                    id: student.id.toString(),
                    name: student.name,
                    enrollment: student.enrollment_no || student.roll_number || "",
                    whatsappNumber: face.whatsapp_number || "",
                    descriptor: new Float32Array(embedding),
                  };
                  return studentObj;
                } catch (parseError) {
                  console.error(`Error parsing face embedding for student ${face.student_id}:`, parseError);
                  return null;
                }
              }
              return null;
            })
            .filter((s): s is Student => s !== null);

          if (studentsWithFaces.length > 0) {
            console.log(`Successfully loaded ${studentsWithFaces.length} students with face data from database`);
            setStudents(studentsWithFaces);
            
            // Also save to localStorage as backup (for offline support)
            localStorage.setItem(
              "attendance_students",
              JSON.stringify(
                studentsWithFaces.map((s: Student) => ({
                  ...s,
                  descriptor: Array.from(s.descriptor),
                })),
              ),
            );
            console.log("Students saved to localStorage as backup");
          } else {
            console.log("No students with face data found in database");
            // Still try localStorage as fallback
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
                console.log(`Loaded ${parsed.length} students from localStorage fallback`);
              } catch (e) {
                console.error("Error parsing stored students:", e);
              }
            }
          }
        } else {
          console.warn("Database not available, falling back to localStorage");
          // Fallback to localStorage if database is not available
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
              console.log(`Loaded ${parsed.length} students from localStorage`);
            } catch (e) {
              console.error("Error parsing stored students:", e);
            }
          }
        }
      } catch (error) {
        console.error("Error loading students from database:", error);
        // Fallback to localStorage
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
            console.log(`Loaded ${parsed.length} students from localStorage fallback`);
          } catch (e) {
            console.error("Error parsing stored students:", e);
          }
        }
      }
    };

    loadStudentsFromDatabase();

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
  const [registerWhatsapp, setRegisterWhatsapp] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [isMarking, setIsMarking] = useState(false);
  const [classPhoto, setClassPhoto] = useState<File | null>(null);
  const [captureCountdown, setCaptureCountdown] = useState<number | null>(null);
  const [faceDetected, setFaceDetected] = useState(false);
  const [captureStatus, setCaptureStatus] = useState<string>("");

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const detectionIntervalRef = useRef<NodeJS.Timeout | null>(null);

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

  // Save students to localStorage as backup (database is the permanent storage)
  useEffect(() => {
    // Only save to localStorage if we have students (don't overwrite with empty array on initial load)
    if (students.length > 0) {
      try {
        localStorage.setItem(
          "attendance_students",
          JSON.stringify(
            students.map((s) => ({
              ...s,
              descriptor: Array.from(s.descriptor),
            })),
          ),
        );
        console.log(`Synced ${students.length} students to localStorage as backup`);
      } catch (error) {
        console.error("Error saving to localStorage:", error);
      }
    }
  }, [students]);

  // Save attendance to localStorage
  useEffect(() => {
    localStorage.setItem(`attendance_${today}`, JSON.stringify(attendance));
  }, [attendance, today]);

  // Real-time face detection and drawing
  useEffect(() => {
    if (!isRegistering || !videoRef.current || !canvasRef.current || !modelsLoaded) {
      return;
    }

    const detectFaces = async () => {
      if (!videoRef.current || !canvasRef.current) return;

      try {
        const detections = await faceapi
          .detectAllFaces(videoRef.current, new faceapi.TinyFaceDetectorOptions())
          .withFaceLandmarks();

        const canvas = canvasRef.current;
        const video = videoRef.current;
        const ctx = canvas.getContext("2d");
        
        if (!ctx) return;

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (detections.length === 0) {
          setFaceDetected(false);
          setCaptureStatus("No face detected. Please position yourself in front of the camera.");
          ctx.fillStyle = "rgba(255, 0, 0, 0.3)";
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          return;
        }

        if (detections.length > 1) {
          setFaceDetected(false);
          setCaptureStatus("Multiple faces detected. Only one face should be visible.");
          ctx.fillStyle = "rgba(255, 165, 0, 0.3)";
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          detections.forEach((detection) => {
            const box = (detection as any).detection?.box || (detection as any).box;
            const { x, y, width, height } = box;
            ctx.strokeStyle = "orange";
            ctx.lineWidth = 3;
            ctx.strokeRect(x, y, width, height);
          });
          return;
        }

        // Single face detected - check quality
        const detection = detections[0];
        const box = (detection as any).detection?.box || (detection as any).box;
        const { x, y, width, height } = box;
        
        // Check face size (should be at least 10% of frame)
        const faceSizePercent = (width * height) / (canvas.width * canvas.height);
        if (faceSizePercent < 0.05) {
          setFaceDetected(false);
          setCaptureStatus("Face too small. Please move closer to the camera.");
          ctx.strokeStyle = "orange";
          ctx.lineWidth = 3;
          ctx.strokeRect(x, y, width, height);
          return;
        }

        if (faceSizePercent > 0.5) {
          setFaceDetected(false);
          setCaptureStatus("Face too large. Please move further from the camera.");
          ctx.strokeStyle = "orange";
          ctx.lineWidth = 3;
          ctx.strokeRect(x, y, width, height);
          return;
        }

        // Check if face is centered (within 40% of center)
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const faceCenterX = x + width / 2;
        const faceCenterY = y + height / 2;
        const offsetX = Math.abs(faceCenterX - centerX) / canvas.width;
        const offsetY = Math.abs(faceCenterY - centerY) / canvas.height;

        if (offsetX > 0.2 || offsetY > 0.2) {
          setFaceDetected(false);
          setCaptureStatus("Please center your face in the frame.");
          ctx.strokeStyle = "orange";
          ctx.lineWidth = 3;
          ctx.strokeRect(x, y, width, height);
          return;
        }

        // Face is good - draw green box
        setFaceDetected(true);
        setCaptureStatus("Face detected! Ready to capture...");
        ctx.strokeStyle = "green";
        ctx.lineWidth = 4;
        ctx.strokeRect(x, y, width, height);
        
        // Draw center guide
        ctx.strokeStyle = "rgba(0, 255, 0, 0.5)";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(centerX - 50, centerY);
        ctx.lineTo(centerX + 50, centerY);
        ctx.moveTo(centerX, centerY - 50);
        ctx.lineTo(centerX, centerY + 50);
        ctx.stroke();

      } catch (error) {
        console.error("Error detecting faces:", error);
      }
    };

    detectionIntervalRef.current = setInterval(detectFaces, 100); // Check every 100ms

    return () => {
      if (detectionIntervalRef.current) {
        clearInterval(detectionIntervalRef.current);
        detectionIntervalRef.current = null;
      }
    };
  }, [isRegistering, modelsLoaded]);

  const registerStudent = async () => {
    if (!modelsLoaded || !registerName.trim() || !registerEnrollment.trim())
      return;

    setIsRegistering(true);
    setFaceDetected(false);
    setCaptureStatus("Initializing camera...");
    
    let stream: MediaStream | null = null;
    
    try {
      // Request high quality video
      stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: "user"
        } 
      });
      
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

      if (!videoRef.current) {
        if (stream) {
          stream.getTracks().forEach((track) => track.stop());
        }
        setIsRegistering(false);
        setCaptureStatus("");
        setFaceDetected(false);
        return;
      }

      setCaptureStatus("Position your face in the center. We will capture in 3 seconds...");

      // Countdown before capture
      for (let i = 3; i > 0; i--) {
        setCaptureCountdown(i);
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      setCaptureCountdown(null);

      // Wait for good face detection
      let attempts = 0;
      const maxAttempts = 10;
      let bestDetection: any = null;
      let bestScore = 0;

      while (attempts < maxAttempts) {
        if (!videoRef.current) break;

        const detections = await faceapi
          .detectAllFaces(videoRef.current, new faceapi.TinyFaceDetectorOptions())
          .withFaceLandmarks()
          .withFaceDescriptors();

        if (detections.length === 0) {
          setCaptureStatus(`No face detected. Attempt ${attempts + 1}/${maxAttempts}...`);
          attempts++;
          await new Promise(resolve => setTimeout(resolve, 500));
          continue;
        }

        if (detections.length > 1) {
          setCaptureStatus(`Multiple faces detected. Attempt ${attempts + 1}/${maxAttempts}...`);
          attempts++;
          await new Promise(resolve => setTimeout(resolve, 500));
          continue;
        }

        // Single face - check quality
        const detection = detections[0];
        const box = detection.detection?.box || (detection as any).box;
        const { width, height } = box;
        const faceSize = width * height;
        const videoSize = videoRef.current.videoWidth * videoRef.current.videoHeight;
        const sizeScore = faceSize / videoSize;

        // Prefer faces that are 10-30% of frame size
        if (sizeScore >= 0.05 && sizeScore <= 0.3) {
          const detectionScore = detection.detection?.score || (detection as any).detection?.score || 0.8;
          const qualityScore = sizeScore * 100 + detectionScore * 100;
          
          if (qualityScore > bestScore) {
            bestScore = qualityScore;
            bestDetection = detection;
            
            if (qualityScore > 15) {
              // Good enough quality, capture now
              break;
            }
          }
        }

        attempts++;
        setCaptureStatus(`Capturing... Attempt ${attempts}/${maxAttempts} (Quality: ${Math.round(bestScore)})`);
        await new Promise(resolve => setTimeout(resolve, 300));
      }

      // Stop face detection interval
      if (detectionIntervalRef.current) {
        clearInterval(detectionIntervalRef.current);
        detectionIntervalRef.current = null;
      }

      // Use best detection or latest detection
      let finalDetection = bestDetection;
      if (!finalDetection && videoRef.current) {
        const lastDetections = await faceapi
          .detectAllFaces(videoRef.current, new faceapi.TinyFaceDetectorOptions())
          .withFaceLandmarks()
          .withFaceDescriptors();
        finalDetection = lastDetections[0] || null;
      }

      if (!finalDetection || !finalDetection.descriptor) {
        alert("Could not capture face properly. Please ensure:\n- Good lighting\n- Face is centered\n- Only one person is visible\n- Camera has proper permissions");
        stream.getTracks().forEach((track) => track.stop());
        if (videoRef.current) videoRef.current.srcObject = null;
        setIsRegistering(false);
        setFaceDetected(false);
        setCaptureStatus("");
        return;
      }

      const descriptor = finalDetection.descriptor;
      const descriptorArray = Array.from(descriptor);
      setCaptureStatus("Face captured! Saving to database...");

      // Save student to database
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3002";
      
      try {
        // Check if student already exists by enrollment number
        const enrollmentNo = registerEnrollment.trim();
        const email = `${enrollmentNo.toLowerCase().replace(/\s+/g, '')}@university.edu`;
        
        let studentId: number | null = null;
        
        // Try to find existing student by enrollment number
        try {
          const checkResponse = await fetch(`${API_URL}/api/students`);
          if (checkResponse.ok) {
            const allStudents = await checkResponse.json();
            const existingStudent = (Array.isArray(allStudents) ? allStudents : allStudents.data || []).find(
              (s: any) => s.enrollment_no === enrollmentNo || s.roll_number === enrollmentNo
            );
            if (existingStudent) {
              studentId = existingStudent.id;
              console.log(`Student with enrollment ${enrollmentNo} already exists, using existing ID: ${studentId}`);
            }
          }
        } catch (checkError) {
          console.log("Could not check for existing student, will create new one");
        }

        // If student doesn't exist, create a new one
        if (!studentId) {
          const studentData = {
            name: registerName.trim(),
            enrollment_no: enrollmentNo,
            email: email,
            roll_number: enrollmentNo,
            password: "default123", // Default password, should be changed
            role: "student",
          };

          const studentResponse = await fetch(`${API_URL}/api/students`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(studentData),
          });

          if (!studentResponse.ok) {
            let errorMessage = "Failed to create student";
            try {
              const errorData = await studentResponse.json();
              errorMessage = errorData.error || errorMessage;
              console.error("Student creation error details:", errorData);
              
              // If it's a duplicate error, try to find the existing student
              if (errorData.error?.includes("already exists") || studentResponse.status === 409) {
                const checkResponse = await fetch(`${API_URL}/api/students`);
                if (checkResponse.ok) {
                  const allStudents = await checkResponse.json();
                  const existingStudent = (Array.isArray(allStudents) ? allStudents : allStudents.data || []).find(
                    (s: any) => s.enrollment_no === enrollmentNo || s.roll_number === enrollmentNo || s.email === email
                  );
                  if (existingStudent) {
                    studentId = existingStudent.id;
                    console.log(`Found existing student after duplicate error, using ID: ${studentId}`);
                  }
                }
              }
              
              if (!studentId) {
                throw new Error(`${errorMessage} (Status: ${studentResponse.status})`);
              }
            } catch (e: any) {
              if (!studentId) {
                const errorText = await studentResponse.text().catch(() => "");
                console.error("Student creation error response:", errorText);
                throw new Error(errorText || e.message || "Failed to create student");
              }
            }
          } else {
            const studentResult = await studentResponse.json();
            studentId = studentResult.data?.id || studentResult.id;
          }
        }
        
        if (!studentId) {
          throw new Error("Student ID not found in response");
        }

        // Then, save the face embedding
        console.log(`Saving face embedding for student ID: ${studentId}, embedding size: ${descriptorArray.length}`);
        console.log(`First 5 values of embedding:`, descriptorArray.slice(0, 5));
        
        const faceResponse = await fetch(`${API_URL}/api/student-faces/${studentId}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            faceEmbedding: descriptorArray,
            whatsappNumber: registerWhatsapp.trim() || null,
          }),
        });

        console.log(`Face response status: ${faceResponse.status}, ok: ${faceResponse.ok}`);
        
        // Read the response body once
        const responseText = await faceResponse.text();
        console.log("Raw face response:", responseText);
        
        if (!faceResponse.ok) {
          let errorMessage = "Failed to save face data";
          let errorData: any = {};
          
          try {
            if (responseText) {
              errorData = JSON.parse(responseText);
              console.error("Face embedding error details (JSON):", errorData);
              errorMessage = errorData.error || errorData.message || errorMessage;
              
              // Log additional details if available
              if (errorData.details) {
                console.error("Error details:", errorData.details);
              }
              if (errorData.code) {
                console.error("Error code:", errorData.code);
              }
            } else {
              errorMessage = `Server returned empty response (Status: ${faceResponse.status})`;
            }
          } catch (e: any) {
            console.error("Error parsing error response:", e);
            errorMessage = responseText || errorMessage;
          }
          
          throw new Error(`${errorMessage} (Status: ${faceResponse.status})`);
        }

        // Parse successful response
        let faceResult;
        try {
          if (responseText) {
            faceResult = JSON.parse(responseText);
            console.log("Face embedding saved successfully:", faceResult);
          } else {
            console.warn("Empty response from face embedding save, but status was OK");
            faceResult = { success: true };
          }
        } catch (parseError) {
          console.error("Error parsing face response:", parseError);
          console.error("Response text was:", responseText);
          throw new Error("Invalid JSON response from server when saving face embedding");
        }
        
        // Verify the save by fetching the face data back
        try {
          const verifyResponse = await fetch(`${API_URL}/api/student-faces`);
          if (verifyResponse.ok) {
            const allFaces = await verifyResponse.json();
            const savedFace = (allFaces.data || []).find((f: any) => f.student_id === studentId);
            if (savedFace) {
              console.log("Verified: Face embedding exists in database for student", studentId);
            } else {
              console.warn("Warning: Face embedding not found in database after save");
            }
          }
        } catch (verifyError) {
          console.warn("Could not verify face embedding save:", verifyError);
        }

        // Stop video stream
        stream.getTracks().forEach((track) => track.stop());
        if (videoRef.current) {
          videoRef.current.srcObject = null;
        }
        
        // Clear canvas
        if (canvasRef.current) {
          const ctx = canvasRef.current.getContext("2d");
          if (ctx) {
            ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
          }
        }

        setCaptureStatus("");
        setFaceDetected(false);
        setCaptureCountdown(null);

        const savedName = registerName.trim();
        const savedEnrollment = registerEnrollment.trim();
        
        setRegisterName("");
        setRegisterEnrollment("");
        setRegisterWhatsapp("");

        // Show success message
        alert(`✅ Student "${savedName}" registered successfully!\n\n📋 Student ID: ${studentId}\n📝 Enrollment: ${savedEnrollment}\n💾 Face data saved permanently to database\n\nThis student will persist across sessions and page refreshes.`);
        
        // Reload students from database to ensure UI is in sync
        console.log("Reloading students from database after registration...");
        const reloadResponse = await fetch(`${API_URL}/api/student-faces`);
        if (reloadResponse.ok) {
          const reloadFaces = await reloadResponse.json();
          const faces = reloadFaces.data || reloadFaces;
          const studentsResp = await fetch(`${API_URL}/api/students`);
          if (studentsResp.ok) {
            const studentsData = await studentsResp.json();
            const students = studentsData.data || studentsData;
            
            const updatedStudents: Student[] = (Array.isArray(faces) ? faces : [])
              .map((face: any) => {
                const student = (Array.isArray(students) ? students : []).find((s: any) => s.id === face.student_id);
                if (student && face.face_embedding) {
                  const embedding = typeof face.face_embedding === 'string' 
                    ? JSON.parse(face.face_embedding) 
                    : face.face_embedding;
                  return {
                    id: student.id.toString(),
                    name: student.name,
                    enrollment: student.enrollment_no || student.roll_number || "",
                    whatsappNumber: face.whatsapp_number || "",
                    descriptor: new Float32Array(embedding),
                  };
                }
                return null;
              })
              .filter((s): s is Student => s !== null);
            
            setStudents(updatedStudents);
            console.log(`Reloaded ${updatedStudents.length} students from database`);
          }
        }
      } catch (dbError: any) {
        console.error("Error saving to database:", dbError);
        
        // Stop stream on error
        if (stream) {
          stream.getTracks().forEach((track) => track.stop());
        }
        if (videoRef.current) {
          videoRef.current.srcObject = null;
        }
        setCaptureStatus("");
        setFaceDetected(false);
        setCaptureCountdown(null);
        
        // Fallback: save to localStorage only
        const newStudent: Student = {
          id: Date.now().toString(),
          name: registerName.trim(),
          enrollment: registerEnrollment.trim(),
          whatsappNumber: registerWhatsapp.trim(),
          descriptor,
        };
        setStudents((prev) => [...prev, newStudent]);
        alert(`⚠️ Student registered locally. Database error: ${dbError.message}\n\nPlease try again later to save to permanent database.`);
      }
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

  const sendWhatsAppMessage = async (phoneNumber: string, message: string) => {
    const token = "JuyXkWpiXJ3vNbmYlUT3sN9HxtWL6Wrl";

    // Parse phone number for Whapi.Cloud format (e.g., 919876543210 - no + sign, just digits)
    let mobile = phoneNumber.trim();
    
    // Remove any non-digit characters except leading +
    if (mobile.startsWith('+')) {
      mobile = mobile.substring(1).trim();
    }
    
    // Remove any spaces, dashes, or other characters
    mobile = mobile.replace(/\D/g, '');
    
    // Ensure it starts with country code (default to 91 for India if not present)
    if (!mobile.startsWith('91') && mobile.length === 10) {
      mobile = `91${mobile}`;
    }

    // Whapi.Cloud expects format: 919876543210 (no + sign)
    const to = mobile;

    try {
      const response = await fetch("https://gate.whapi.cloud/messages/text", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          to: to,
          body: message,
        }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        console.log(`WhatsApp message sent to ${phoneNumber} (${to})`);
        return { success: true, messageId: data.id };
      } else {
        console.error(`Failed to send WhatsApp message to ${phoneNumber}: ${response.status}`, data);
        return { success: false, error: data };
      }
    } catch (error) {
      console.error("Error sending WhatsApp message:", error);
      return { success: false, error: error };
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

    // Send WhatsApp notifications to students
    students.forEach(student => {
      if (student.whatsappNumber) {
        const status = attendance[student.id] || "absent";
        const message = `Dear ${student.name}, your attendance for ${today} has been marked as ${status.toUpperCase()}.`;
        sendWhatsAppMessage(student.whatsappNumber, message);
      }
    });

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
        <div className="mb-3 flex flex-col gap-2">
          <input
            type="text"
            placeholder="Student Name"
            value={registerName}
            onChange={(e) => setRegisterName(e.target.value)}
            className="p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
          <input
            type="text"
            placeholder="Enrollment Number"
            value={registerEnrollment}
            onChange={(e) => setRegisterEnrollment(e.target.value)}
            className="p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
          <input
            type="text"
            placeholder="WhatsApp Number (e.g., +1234567890)"
            value={registerWhatsapp}
            onChange={(e) => setRegisterWhatsapp(e.target.value)}
            className="p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
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
          <div className="mt-3 space-y-2">
            {/* Status message */}
            {captureStatus && (
              <div className={`p-2 rounded-md text-sm font-medium ${
                faceDetected 
                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                  : captureStatus.includes('saved') || captureStatus.includes('captured')
                    ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                    : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
              }`}>
                {captureStatus}
              </div>
            )}
            
            {/* Countdown timer */}
            {captureCountdown !== null && (
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-blue-600 text-white text-3xl font-bold animate-pulse">
                  {captureCountdown}
                </div>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                  Get ready! Capturing in {captureCountdown} second{captureCountdown !== 1 ? 's' : ''}...
                </p>
              </div>
            )}
            
            {/* Video feed with overlay */}
            <div className="relative inline-block">
              <video
                ref={videoRef}
                width="640"
                height="480"
                className="border-2 rounded-md"
                style={{
                  borderColor: faceDetected ? '#10b981' : '#f59e0b',
                  borderWidth: '3px'
                }}
                autoPlay
                playsInline
                muted
              />
              <canvas
                ref={canvasRef}
                className="absolute top-0 left-0 pointer-events-none"
                width="640"
                height="480"
                style={{ borderRadius: '0.375rem' }}
              />
              
              {/* Face detection indicator */}
              {faceDetected && (
                <div className="absolute top-2 right-2 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                  <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                  Face Detected
                </div>
              )}
            </div>
            
            {/* Instructions */}
            <div className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
              <p>📋 Instructions:</p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Position your face in the center of the frame</li>
                <li>Ensure good lighting</li>
                <li>Keep a neutral expression</li>
                <li>Only one person should be visible</li>
                <li>Wait for the green box to appear</li>
              </ul>
            </div>
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
