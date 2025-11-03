const pool = require('../db');

class TeachingAssignment {
  static async create(assignmentData) {
    const query = `
      INSERT INTO teaching_assignments (faculty_id, course_id)
      VALUES ($1, $2)
      ON CONFLICT (faculty_id, course_id) DO NOTHING
      RETURNING *
    `;
    const values = [
      assignmentData.faculty_id,
      assignmentData.course_id
    ];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async findAll() {
    const query = `
      SELECT ta.*, f.name as faculty_name, c.name as course_name
      FROM teaching_assignments ta
      JOIN faculty f ON ta.faculty_id = f.id
      JOIN courses c ON ta.course_id = c.id
      ORDER BY ta.id
    `;
    const result = await pool.query(query);
    return result.rows;
  }

  static async findByFacultyId(facultyId) {
    const query = `
      SELECT ta.*, c.name as course_name
      FROM teaching_assignments ta
      JOIN courses c ON ta.course_id = c.id
      WHERE ta.faculty_id = $1
      ORDER BY ta.id
    `;
    const result = await pool.query(query, [facultyId]);
    return result.rows;
  }

  static async findByCourseId(courseId) {
    const query = `
      SELECT ta.*, f.name as faculty_name
      FROM teaching_assignments ta
      JOIN faculty f ON ta.faculty_id = f.id
      WHERE ta.course_id = $1
      ORDER BY ta.id
    `;
    const result = await pool.query(query, [courseId]);
    return result.rows;
  }

  static async delete(facultyId, courseId) {
    const query = 'DELETE FROM teaching_assignments WHERE faculty_id = $1 AND course_id = $2 RETURNING *';
    const result = await pool.query(query, [facultyId, courseId]);
    return result.rows[0];
  }
}

module.exports = TeachingAssignment;
