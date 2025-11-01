# TODO: Integrate AI-Powered Face Recognition Attendance System into Teacher Portal

- [x] Install xlsx library for Excel export
- [x] Edit src/components/teacher/dashboard/attendance-widget.tsx:
  - [x] Add student registration section: Webcam capture, detect single face, compute descriptor, store in localStorage with name, enrollment, id
  - [x] Enhance attendance marking: File upload for class photo, detect faces, match descriptors with stored students (threshold 0.6), mark present/absent
  - [x] Store attendance records in localStorage (per date)
  - [x] Add Excel download: Use xlsx library to export attendance table to Excel
  - [x] Fix existing code: Remove undefined 'api' calls, use localStorage for data
  - [x] Add real-time preview for registration and marking
  - [x] Handle multiple courses if needed, but focus on one for simplicity
- [x] Test face capture, storage, matching, and Excel export
- [x] Ensure camera permissions and model loading
