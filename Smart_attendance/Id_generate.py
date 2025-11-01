import cv2
import os
import uuid
import pandas as pd

# Get the directory of the script
script_dir = os.path.dirname(os.path.abspath(__file__))

Data_Dir = os.path.join(script_dir, "dataset")
os.makedirs(Data_Dir, exist_ok=True)
Student_File = os.path.join(script_dir, "student_data.xlsx")

face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + "haarcascade_frontalface_default.xml")

if os.path.exists(Student_File):
    df = pd.read_excel(Student_File)
    if df.empty or len(df.columns) == 0:
        df = pd.DataFrame(columns=["Name", "Enrollment_No", "Attendance_ID", "Face_Image_Path"])
else:
    df = pd.DataFrame(columns=["Name", "Enrollment_No", "Attendance_ID", "Face_Image_Path"])


name = input("Enter student name: ")
enroll = input("Enter enrollment no: ")


cap = cv2.VideoCapture(0)
print("📸 Capturing face... Press 's' to save")

while True:
    ret, frame = cap.read()
    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    faces = face_cascade.detectMultiScale(gray, 1.3, 5)

    for (x, y, w, h) in faces:
        cv2.rectangle(frame, (x,y), (x+w, y+h), (0,255,0), 2)

    cv2.imshow('Register Student', frame)
    key = cv2.waitKey(1)

    if key == ord('s') and len(faces) > 0:
        for (x, y, w, h) in faces:
            face_crop = gray[y:y+h, x:x+w]
            att_id = str(uuid.uuid4())[:8]
            filename = f"{name}_{att_id}.jpg"
            path = os.path.join(Data_Dir, filename)
            try:
                cv2.imwrite(path, face_crop)
                df.loc[len(df)] = [name, enroll, att_id, path]
                df.to_excel(Student_File, index=False)
                print(f"✅ {name}'s face saved → ID: {att_id}")
            except Exception as e:
                print(f"❌ Error saving data: {e}")
        break

    elif key == 27: 
        break
cap.release()
cv2.destroyAllWindows()
print("Registration complete.")