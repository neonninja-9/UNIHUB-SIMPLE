import cv2
import os
import pandas as pd
import numpy as np
from datetime import datetime
import argparse

parser = argparse.ArgumentParser(description="Face Recognition Attendance Marker")
parser.add_argument("--student_file", default="student_data.xlsx", help="Path to student data Excel file")
parser.add_argument("--class_photo", default="class_photo.jpg", help="Path to class photo image")
parser.add_argument("--output_file", default="attendance_marked.xlsx", help="Path to output Excel file")
parser.add_argument("--confidence_threshold", type=int, default=100, help="Confidence threshold for face recognition (lower is stricter)")
parser.add_argument("--min_neighbors", type=int, default=7, help="Minimum neighbors for Haar cascade")
parser.add_argument("--min_size", type=int, default=50, help="Minimum face size for detection")
parser.add_argument("--scale_factor", type=float, default=1.1, help="Scale factor for Haar cascade")

args = parser.parse_args()

script_dir = os.path.dirname(os.path.abspath(__file__))
STUDENT_FILE = os.path.join(script_dir, args.student_file)
CLASS_PHOTO = os.path.join(script_dir, args.class_photo)
OUTPUT_FILE = os.path.join(script_dir, args.output_file)
CONFIDENCE_THRESHOLD = args.confidence_threshold
MIN_NEIGHBORS = args.min_neighbors
MIN_SIZE = args.min_size
SCALE_FACTOR = args.scale_factor

df = pd.read_excel(STUDENT_FILE)


faces, ids = [], []
label_map = {}
reverse_map = {}
for i, row in df.iterrows():
    img_path_raw = row["Face_Image_Path"]
    if pd.isna(img_path_raw) or not isinstance(img_path_raw, str):
        continue
    img_path = os.path.join(script_dir, img_path_raw)
    if not os.path.exists(img_path):
        continue
    img = cv2.imread(img_path, cv2.IMREAD_GRAYSCALE)
    if img is None:
        continue
    img = cv2.equalizeHist(img)
    label = i  
    faces.append(img)
    ids.append(label)
    label_map[label] = row["Attendance_ID"]
    reverse_map[label] = row["Name"]


recognizer = cv2.face.LBPHFaceRecognizer_create()
if len(faces) == 0:
    print("❌ Error: No faces found for training. Check student image paths.")
    exit(1)
recognizer.train(faces, np.array(ids))
print(f"Trained on {len(faces)} faces.")

# Load Haar cascade
face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + "haarcascade_frontalface_default.xml")




frame = cv2.imread(CLASS_PHOTO)
if frame is None:
    print(f"❌ Error: Unable to load class photo '{CLASS_PHOTO}'. Please check if the file exists and is a valid image.")
    exit(1)
gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
gray = cv2.equalizeHist(gray)
faces = face_cascade.detectMultiScale(gray, scaleFactor=SCALE_FACTOR, minNeighbors=MIN_NEIGHBORS, minSize=(MIN_SIZE, MIN_SIZE))
print(f"Detected {len(faces)} faces in class photo.")

present_ids = set()

for (x, y, w, h) in faces:
    face_crop = gray[y:y+h, x:x+w]
    label, confidence = recognizer.predict(face_crop)
    print(f"Face at ({x},{y}): label={label}, confidence={confidence}")
    if confidence < CONFIDENCE_THRESHOLD:
        att_id = label_map[label]
        name = reverse_map[label]
        present_ids.add(att_id)
        cv2.rectangle(frame, (x, y), (x+w, y+h), (0,255,0), 2)
        cv2.putText(frame, name, (x, y-5), cv2.FONT_HERSHEY_SIMPLEX, 0.8, (255,255,255), 2)
    else:
        cv2.rectangle(frame, (x, y), (x+w, y+h), (0,0,255), 2)
        cv2.putText(frame, "Unknown", (x, y-5), cv2.FONT_HERSHEY_SIMPLEX, 0.8, (255,255,255), 2)

# Mark attendance
df["Status"] = df["Attendance_ID"].apply(lambda x: "Present" if x in present_ids else "Absent")
df["Date"] = datetime.now().strftime("%Y-%m-%d")
df.to_excel(OUTPUT_FILE, index=False)

# Resize for better desktop viewing
height, width = frame.shape[:2]
max_width = 800
max_height = 600
if width > max_width or height > max_height:
    scale = min(max_width / width, max_height / height)
    new_width = int(width * scale)
    new_height = int(height * scale)
    resized_frame = cv2.resize(frame, (new_width, new_height))
else:
    resized_frame = frame

cv2.imshow("Detected Attendance", resized_frame)
cv2.waitKey(0)
cv2.destroyAllWindows()

print("\n✅ Attendance marked and saved to", OUTPUT_FILE)
