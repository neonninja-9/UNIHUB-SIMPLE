const pool = require('../db');

class Result {
  static async findByStudentId(studentId) {
    const query = 'SELECT * FROM results WHERE student_id = $1 ORDER BY course_id';
    const result = await pool.query(query, [studentId]);
    return result.rows;
  }
}

module.exports = Result;
