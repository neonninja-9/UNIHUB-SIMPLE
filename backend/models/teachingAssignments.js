const pool = require('../db');

class TeachingAssignment {
  static async findByFacultyId(facultyId) {
    const query = 'SELECT * FROM teaching_assignments WHERE faculty_id = $1';
    const result = await pool.query(query, [facultyId]);
    return result.rows;
  }
}

module.exports = TeachingAssignment;
