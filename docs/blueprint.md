# ⚙️ Technical Architecture Overview

### 🖥️ **Frontend Stack**

* **Framework:** Next.js 15.5.5 (React-based)
* **Language:** TypeScript / JavaScript
* **Styling:** Tailwind CSS (with Dark Mode support)
* **Key Libraries:**

  * Face Recognition: `face-api.js`
  * Excel Export: `xlsx`
  * UI Components: Custom React Components
* **State Management:** React Hooks (`useState`, `useEffect`)
* **Storage:** `localStorage` for offline data persistence

---

### 🧩 **Backend Stack**

* **Runtime:** Node.js
* **Framework:** Express.js
* **Language:** JavaScript
* Session-less authent
* **Data Storage:** JSON-based mock data (no database)
* **CORS:** Enabled (cross-origin requests supported)
* **Server Port:** `3002` (configurable via environment variables)

---

## 🧠 **Key Features & Technical Implementation**

### 🔐 **Authentication System**

* Role-based access: **Student**, **Faculty**, **Admin**
* Email-based login (mock system)
* Session-less authentication (token-based planned for real version)

---

### 📅 **Attendance System (Recently Enhanced)**

* **Offline Capability:** Saves data locally via `localStorage`
* **Sync Mechanism:** Auto bulk-sync via `/api/attendance/bulk` endpoint
* **Network Detection:** Real-time online/offline monitoring
* **Face Recognition:** AI-based attendance using `face-api.js`

#### 🧾 **Data Structure**

```typescript
interface AttendanceRecord {
  studentId: string;
  courseId: string;
  date: string;
  status: string;
  synced: boolean;
}
```

---

### 🧠 **Face Recognition Integration**

* **Models Used:**

  * `tinyFaceDetector`
  * `faceLandmark68Net`
  * `faceRecognitionNet`
* **Storage:** Face embeddings saved in `localStorage`
* **Processing:** Client-side detection and matching
* **Accuracy:** 0.6 distance threshold for valid recognition

---

### 🗂️ **Data Management**

* **Mock Data Structure:** `backend/mockData.js`
* **Entities:** Students, Faculty, Admins, Courses, Attendance, Results, Notices
* **Relationships:** Faculty-Course assignments, Student-Attendance links

---

### 🔗 **API Endpoints**

| Endpoint                        | Method | Description                    |
| ------------------------------- | ------ | ------------------------------ |
| `/api/login`                    | POST   | User login (mock)              |
| `/api/students`                 | GET    | Get all students               |
| `/api/students/:id`             | GET    | Get student details            |
| `/api/students/:id/attendance`  | GET    | Fetch attendance for a student |
| `/api/attendance/bulk`          | POST   | Bulk attendance sync           |
| `/api/student-faces`            | GET    | Get all face data              |
| `/api/student-faces/:studentId` | POST   | Upload/update face data        |
| `/api/chat`                     | POST   | AI chat via Python subprocess  |

---

### 🎨 **UI/UX Architecture**

* **Responsive Design:** Mobile-first with Tailwind CSS
* **Dark Mode:** Automatic via system preference
* **Component Structure:** Modular React Components
* **Navigation:** Sidebar-based Dashboard
* **Real-time Updates:** Network & Sync status indicators

---

## 🌐 **Offline-First Design**

* **Data Persistence:** Critical data saved in `localStorage`
* **Sync Queue:** Unsynced records queued until network is available
* **Conflict Resolution:** Last-write-wins policy for attendance
* **Network Resilience:** Smooth fallback during offline mode

---

## 🔒 **Security Considerations**

* **Client-Side Storage:** `localStorage` (not secure for sensitive data)
* **API Security:** No auth headers (mock system only)
* **Face Data:** Stored locally (privacy implications)

---

## ⚡ **Performance Optimizations**

* Lazy Loading for AI models
* Optimized React rendering with proper `key` usage
* Minimal bundle via Next.js Tree-shaking

---

## 🧪 **Development & Deployment**

* **Package Manager:** npm
* **Scripts:**

  * `npm run dev` → Development
  * `npm start` → Production
* **Environment:** Configurable via `.env`
* **Build Process:** Next.js auto optimization

---

## 🧱 **Architecture Patterns**

* **MVC-like:** Separation of UI, logic, and routes
* **Observer Pattern:** Real-time network status listeners
* **Repository Pattern:** Mock data access abstraction
* **Component Composition:** Reusable and isolated React components

---

## ⚠️ **Limitations & Production Considerations**

* No real database (JSON mock only)
* Basic authentication (mock)
* No encryption or advanced security
* Limited scalability (single-threaded Node.js)
* No automated testing implemented
