const pool = require('../db');

class Schedule {
  static async findByStudentId(studentId) {
    const query = 'SELECT * FROM schedules WHERE student_id = $1';
    const result = await pool.query(query, [studentId]);
    return result.rows;
  }
}

module.exports = Schedule;
