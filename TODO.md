# TODO: Build Offline/Online Attendance System Integration

## Overview
Integrate a systematic attendance system that works offline (saving data locally) and automatically syncs attendance when network is available. This will enhance the existing student attendance system in the sidebar.

## Steps

### 1. Analyze Current Attendance System
- Review existing attendance components: `src/app/student/attendance/page.tsx`, `src/components/teacher/dashboard/attendance-widget.tsx`, backend attendance routes.
- Understand data flow: Mock data in `backend/mockData.js`, localStorage usage in teacher widget.
- Identify integration points: Sidebar attendance link, teacher dashboard.

### 2. Design Offline Storage Mechanism
- Use localStorage for offline attendance data (similar to existing teacher widget).
- Structure data: { date: string, courseId: number, studentId: number, status: string, synced: boolean }.
- Implement sync queue: Store unsynced records and attempt sync on network availability.

### 3. Modify Teacher Attendance Widget for Offline/Online
- Update `src/components/teacher/dashboard/attendance-widget.tsx` to:
  - Save attendance locally first.
  - Mark records as unsynced.
  - Attempt to sync to backend when online.
  - Show sync status (e.g., "Syncing..." or "Offline").
- Add network detection: Use navigator.onLine or periodic checks.

### 4. Update Backend for Attendance Syncing
- Modify `backend/server.js` to handle bulk attendance sync POST endpoint.
- Update `backend/mockData.js` to store synced attendance.
- Ensure endpoint accepts array of attendance records and marks them as synced.

### 5. Integrate into Student Sidebar
- Ensure "Attendance" in `src/components/student/dashboard/sidebar.tsx` links to the attendance page.
- Optionally, add a teacher attendance marking option in sidebar if not present.

### 6. Test Offline and Online Functionality
- Test marking attendance offline: Data saved locally, not synced.
- Test online sync: Data uploads to backend when network available.
- Verify student attendance page reflects synced data.
- Test with multiple devices/browsers.

### 7. Update UI and Error Handling
- Add indicators for offline/online status in attendance widget.
- Handle sync failures gracefully (retry mechanism).
- Update student attendance page to show real-time data if possible.

### 8. Final Testing and Deployment
- End-to-end testing: Mark offline, go online, verify sync.
- Ensure no data loss during sync.
- Deploy updates to the system.

## Progress

### Completed
- [x] Analyze Current Attendance System
- [x] Design Offline Storage Mechanism
- [x] Modify Teacher Attendance Widget for Offline/Online
- [x] Update Backend for Attendance Syncing
- [x] Integrate into Student Sidebar (attendance link already exists)
- [x] Update UI and Error Handling (added status indicators)

### Remaining
- [ ] Test Offline and Online Functionality
- [ ] Final Testing and Deployment
