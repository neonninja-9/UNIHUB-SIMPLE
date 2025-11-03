const pool = require('../db');

class Course {
  static async findAll() {
    const query = 'SELECT * FROM courses ORDER BY id';
    const result = await pool.query(query);
    return result.rows;
  }

  static async findByFacultyId(facultyId) {
    const query = 'SELECT * FROM courses WHERE faculty_id = $1';
    const result = await pool.query(query, [facultyId]);
    return result.rows;
  }
}

module.exports = Course;
