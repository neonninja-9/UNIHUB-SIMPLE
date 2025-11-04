const pool = require('../db');

class Attendance {
  static async create(attendanceData) {
    const query = `
      INSERT INTO attendance (student_id, course_id, date, status)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (student_id, course_id, date) DO UPDATE SET status = EXCLUDED.status
      RETURNING *
    `;
    const values = [
      attendanceData.student_id,
      attendanceData.course_id,
      attendanceData.date,
      attendanceData.status
    ];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async findAll() {
    const query = 'SELECT * FROM attendance ORDER BY date DESC';
    const result = await pool.query(query);
    return result.rows;
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
      values.push(record.student_id, record.course_id, record.date, record.status);
    });

    const query = `
      INSERT INTO attendance (student_id, course_id, date, status)
      VALUES ${placeholders.join(', ')}
      ON CONFLICT (student_id, course_id, date) DO UPDATE SET status = EXCLUDED.status
      RETURNING *
    `;

    const result = await pool.query(query, values);
    return result.rows;
  }

  static async findByDateRange(startDate, endDate) {
    const query = 'SELECT * FROM attendance WHERE date BETWEEN $1 AND $2 ORDER BY date DESC';
    const result = await pool.query(query, [startDate, endDate]);
    return result.rows;
  }

  static async findByDateAndCourse(date, courseId) {
    const query = 'SELECT * FROM attendance WHERE date = $1 AND course_id = $2 ORDER BY student_id';
    const result = await pool.query(query, [date, courseId]);
    return result.rows;
  }

  static async update(studentId, courseId, date, status) {
    const query = `
      UPDATE attendance
      SET status = $1
      WHERE student_id = $2 AND course_id = $3 AND date = $4
      RETURNING *
    `;
    const result = await pool.query(query, [status, studentId, courseId, date]);
    return result.rows[0];
  }

  static async delete(studentId, courseId, date) {
    const query = 'DELETE FROM attendance WHERE student_id = $1 AND course_id = $2 AND date = $3 RETURNING *';
    const result = await pool.query(query, [studentId, courseId, date]);
    return result.rows[0];
  }
}

module.exports = Attendance;
