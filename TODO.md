# TODO: Fix Student and Faculty Database with PostgreSQL

## Current Status
- Backend currently uses mock data from `backend/mockData.js`
- Need to migrate to PostgreSQL database with password 'himanshu'

## Tasks
- [x] Install PostgreSQL driver (pg) for Node.js
- [x] Create database connection module (`backend/db.js`)
- [x] Create database schema and tables for students, faculty, and related data
- [x] Create database models (`backend/models/`) for queries
- [x] Update `backend/server.js` to use database instead of mock data
- [x] Create migration script to populate database with existing mock data
- [x] Test database connection and API endpoints
- [x] Update environment variables for database configuration

## Database Schema
- students table: id, name, email, roll_number, class_section, phone, address, parent_name, parent_phone, enrollment_no, password, role
- faculty table: id, name, email, employee_id, department, phone, address, specialization, password, role
- Additional tables: attendance, courses, schedules, results, etc.

## Notes
- Database password: himanshu
- Assume database name: unihub_db (or user can specify)
- Use environment variables for database configuration

## Completed
- [x] Database setup completed successfully
- [x] Tables created and data migrated
- [x] API endpoints now return data from PostgreSQL
- [x] Students API: Returns 2 students from database
- [x] Faculty API: Returns 1 faculty member from database
