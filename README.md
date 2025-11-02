# UNIHUB - Simplified Version

A beginner-friendly educational platform built with React, Next.js, and Express.js with PostgreSQL backend.

## Features

- **Student Dashboard**: View attendance, marks, schedule, and notices
- **Teacher Dashboard**: Manage attendance, upload resources, post announcements
- **Authentication**: Simple login system for students and teachers
- **Database Integration**: PostgreSQL for data persistence

## Tech Stack

- **Frontend**: Next.js 15, React, TypeScript, Tailwind CSS
- **Backend**: Express.js, Node.js
- **Database**: PostgreSQL
- **Styling**: Tailwind CSS

## Getting Started

### Prerequisites

- Node.js (version 18 or higher)
- PostgreSQL database
- npm or yarn

### Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd unihub-simple
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up PostgreSQL database:
   - Create a PostgreSQL database
   - Run the SQL script in `backend/database.sql` to create tables and insert sample data

4. Configure environment variables:
   - Copy `backend/.env.example` to `backend/.env`
   - Update the `DATABASE_URL` with your PostgreSQL connection string

5. Start the backend server:

   ```bash
   npm run backend
   ```

   This will start the Express server on port 5000.

6. In a new terminal, start the frontend:

   ```bash
   npm run dev
   ```

   This will start the Next.js development server on port 3000.

7. Open your browser and navigate to `http://localhost:3000`

## Sample Login Credentials

### Students

- Email: alex.doe@unihub.com
- Password: password123

- Email: jane.smith@unihub.com
- Password: password123

### Teachers

- Email: e.reed@unihub.com
- Password: password123

## Project Structure

```
unihub-simple/
├── backend/
│   ├── server.js          # Express server
│   ├── database.sql       # Database schema and sample data
│   └── .env.example       # Environment variables template
├── src/
│   ├── app/               # Next.js app directory
│   │   ├── page.tsx       # Login page
│   │   ├── student/dashboard/page.tsx
│   │   └── teacher/dashboard/page.tsx
│   └── components/        # Reusable components
│       ├── Button.tsx
│       ├── Input.tsx
│       ├── Card.tsx
│       ├── Layout.tsx
│       └── auth/login-form.tsx
├── package.json
└── README.md
```

## API Endpoints

- `GET /api/health` - Health check
- `POST /api/login` - User authentication
- `GET /api/students` - Get all students
- `GET /api/students/:id` - Get student by ID
- `GET /api/teachers` - Get all teachers
- `GET /api/teachers/:id` - Get teacher by ID
- `GET /api/students/:id/schedule` - Get student schedule
- `GET /api/notices` - Get all notices

## Development

- Frontend runs on `http://localhost:3000`
- Backend runs on `http://localhost:5000`
- Make sure both servers are running for full functionality

## Developer tools and scripts

This project includes configs for ESLint, Prettier, Husky (pre-commit) and a basic CI workflow.

- Install dev dependencies:
  ```bash
  npm install
  npm run prepare # sets up husky hooks
  ```
- Useful npm scripts:
  - `npm run dev` - start Next.js dev server
  - `npm run backend` - start Express backend
  - `npm run lint` - run ESLint
  - `npm run lint:fix` - try to auto-fix lint issues
  - `npm run format` - run Prettier across the codebase
  - `npm run typecheck` - run TypeScript typecheck
  - `npm run test` - run unit tests (Vitest)

## Future Enhancements

- JWT authentication
- File upload functionality
- Real-time notifications
- Advanced analytics
- Mobile responsive design improvements
