const pool = require('../db');

class Attendance {
  static async create(attendanceData) {
    const query = `
      INSERT INTO attendance (student_id, course_id, date, status)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;
    const values = [
      attendanceData.studentId,
      attendanceData.courseId,
      attendanceData.date,
      attendanceData.status
    ];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async findByStudentAndCourse(studentId, courseId = null) {
    let query = 'SELECT * FROM attendance WHERE student_id = $1';
    let values = [studentId];

    if (courseId) {
      query += ' AND course_id = $2';
      values.push(courseId);
    }

    query += ' ORDER BY date DESC';
    const result = await pool.query(query, values);
    return result.rows;
  }

  static async bulkCreate(attendanceRecords) {
    const values = [];
    const placeholders = [];

    attendanceRecords.forEach((record, index) => {
      const offset = index * 4;
      placeholders.push(`($${offset + 1}, $${offset + 2}, $${offset + 3}, $${offset + 4})`);
      values.push(record.studentId, record.courseId, record.date, record.status);
    });

    const query = `
      INSERT INTO attendance (student_id, course_id, date, status)
      VALUES ${placeholders.join(', ')}
      ON CONFLICT (student_id, course_id, date)
      DO UPDATE SET status = EXCLUDED.status
      RETURNING *
    `;

    const result = await pool.query(query, values);
    return result.rows;
  }
}

module.exports = Attendance;
