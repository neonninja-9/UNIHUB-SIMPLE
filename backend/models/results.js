const pool = require('../db');

class Result {
  static async create(resultData) {
    const query = `
      INSERT INTO results (student_id, course_id, grade)
      VALUES ($1, $2, $3)
      ON CONFLICT (student_id, course_id) DO UPDATE SET grade = EXCLUDED.grade
      RETURNING *
    `;
    const values = [
      resultData.student_id,
      resultData.course_id,
      resultData.grade
    ];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async findAll() {
    const query = 'SELECT * FROM results ORDER BY id';
    const result = await pool.query(query);
    return result.rows;
  }

  static async findByStudentId(studentId) {
    const query = `
      SELECT r.*, c.name as course_name
      FROM results r
      JOIN courses c ON r.course_id = c.id
      WHERE r.student_id = $1
      ORDER BY r.id
    `;
    const result = await pool.query(query, [studentId]);
    return result.rows;
  }

  static async findByCourseId(courseId) {
    const query = `
      SELECT r.*, s.name as student_name
      FROM results r
      JOIN students s ON r.student_id = s.id
      WHERE r.course_id = $1
      ORDER BY r.id
    `;
    const result = await pool.query(query, [courseId]);
    return result.rows;
  }

  static async update(studentId, courseId, grade) {
    const query = `
      UPDATE results
      SET grade = $1
      WHERE student_id = $2 AND course_id = $3
      RETURNING *
    `;
    const result = await pool.query(query, [grade, studentId, courseId]);
    return result.rows[0];
  }

  static async delete(studentId, courseId) {
    const query = 'DELETE FROM results WHERE student_id = $1 AND course_id = $2 RETURNING *';
    const result = await pool.query(query, [studentId, courseId]);
    return result.rows[0];
  }
}

module.exports = Result;
