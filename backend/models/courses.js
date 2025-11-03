const pool = require('../db');

class Course {
  static async create(courseData) {
    const query = `
      INSERT INTO courses (name, faculty_id)
      VALUES ($1, $2)
      RETURNING *
    `;
    const values = [courseData.name, courseData.faculty_id];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async findAll() {
    const query = `
      SELECT c.*, f.name as faculty_name
      FROM courses c
      LEFT JOIN faculty f ON c.faculty_id = f.id
      ORDER BY c.id
    `;
    const result = await pool.query(query);
    return result.rows;
  }

  static async findById(id) {
    const query = `
      SELECT c.*, f.name as faculty_name
      FROM courses c
      LEFT JOIN faculty f ON c.faculty_id = f.id
      WHERE c.id = $1
    `;
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  static async findByFacultyId(facultyId) {
    const query = 'SELECT * FROM courses WHERE faculty_id = $1 ORDER BY id';
    const result = await pool.query(query, [facultyId]);
    return result.rows;
  }

  static async update(id, courseData) {
    const query = `
      UPDATE courses
      SET name = $1, faculty_id = $2
      WHERE id = $3
      RETURNING *
    `;
    const values = [courseData.name, courseData.faculty_id, id];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async delete(id) {
    const query = 'DELETE FROM courses WHERE id = $1 RETURNING *';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }
}

module.exports = Course;
