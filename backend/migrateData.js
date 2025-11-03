const pool = require('./db');
const mockData = require('./mockData');

async function migrateData() {
  try {
    console.log('Starting data migration...');

    // Insert students
    console.log('Migrating students...');
    for (const student of mockData.students) {
      await pool.query(`
        INSERT INTO students (name, email, roll_number, class_section, phone, address, parent_name, parent_phone, enrollment_no, password, role)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
        ON CONFLICT (email) DO NOTHING
      `, [
        student.name,
        student.email,
        student.roll_number,
        student.class_section,
        student.phone,
        student.address,
        student.parent_name,
        student.parent_phone,
        student.enrollment_no,
        student.password,
        student.role
      ]);
    }

    // Insert faculty
    console.log('Migrating faculty...');
    for (const faculty of mockData.faculty) {
      await pool.query(`
        INSERT INTO faculty (name, email, employee_id, department, phone, address, specialization, password, role)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        ON CONFLICT (email) DO NOTHING
      `, [
        faculty.name,
        faculty.email,
        faculty.employee_id,
        faculty.department,
        faculty.phone,
        faculty.address,
        faculty.specialization,
        faculty.password,
        faculty.role
      ]);
    }

    // Insert admins
    console.log('Migrating admins...');
    for (const admin of mockData.admins) {
      await pool.query(`
        INSERT INTO admins (name, email, password, role)
        VALUES ($1, $2, $3, $4)
        ON CONFLICT (email) DO NOTHING
      `, [
        admin.name,
        admin.email,
        admin.password,
        admin.role
      ]);
    }

    // Insert courses
    console.log('Migrating courses...');
    for (const course of mockData.courses) {
      await pool.query(`
        INSERT INTO courses (id, name, faculty_id)
        VALUES ($1, $2, $3)
        ON CONFLICT (id) DO NOTHING
      `, [
        course.id,
        course.name,
        course.facultyId
      ]);
    }

    // Insert attendance
    console.log('Migrating attendance...');
    for (const record of mockData.attendance) {
      await pool.query(`
        INSERT INTO attendance (student_id, course_id, date, status)
        VALUES ($1, $2, $3, $4)
        ON CONFLICT (student_id, course_id, date) DO NOTHING
      `, [
        record.studentId,
        record.courseId,
        record.date,
        record.status
      ]);
    }

    // Insert results
    console.log('Migrating results...');
    for (const result of mockData.results) {
      await pool.query(`
        INSERT INTO results (student_id, course_id, grade)
        VALUES ($1, $2, $3)
        ON CONFLICT (student_id, course_id) DO NOTHING
      `, [
        result.studentId,
        result.courseId,
        result.grade
      ]);
    }

    // Insert schedules
    console.log('Migrating schedules...');
    for (const [studentId, scheduleList] of Object.entries(mockData.schedules)) {
      for (const schedule of scheduleList) {
        await pool.query(`
          INSERT INTO schedules (student_id, course_id, time)
          VALUES ($1, $2, $3)
        `, [
          parseInt(studentId),
          schedule.courseId,
          schedule.time
        ]);
      }
    }

    // Insert teaching assignments
    console.log('Migrating teaching assignments...');
    for (const assignment of mockData.teachingAssignments) {
      await pool.query(`
        INSERT INTO teaching_assignments (faculty_id, course_id)
        VALUES ($1, $2)
        ON CONFLICT (faculty_id, course_id) DO NOTHING
      `, [
        assignment.facultyId,
        assignment.courseId
      ]);
    }

    console.log('Data migration completed successfully!');
  } catch (error) {
    console.error('Error during data migration:', error);
    throw error;
  }
}

module.exports = migrateData;
