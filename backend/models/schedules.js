const pool = require('../db');

class Schedule {
  static async create(scheduleData) {
    const query = `
      INSERT INTO schedules (student_id, course_id, time)
      VALUES ($1, $2, $3)
      RETURNING *
    `;
    const values = [
      scheduleData.student_id,
      scheduleData.course_id,
      scheduleData.time
    ];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async findAll() {
    const query = 'SELECT * FROM schedules ORDER BY id';
    const result = await pool.query(query);
    return result.rows;
  }

  static async findByStudentId(studentId) {
    const query = `
      SELECT s.*, c.name as course_name
      FROM schedules s
      JOIN courses c ON s.course_id = c.id
      WHERE s.student_id = $1
      ORDER BY s.id
    `;
    const result = await pool.query(query, [studentId]);
    return result.rows;
  }

  static async update(id, scheduleData) {
    const query = `
      UPDATE schedules
      SET student_id = $1, course_id = $2, time = $3
      WHERE id = $4
      RETURNING *
    `;
    const values = [
      scheduleData.student_id,
      scheduleData.course_id,
      scheduleData.time,
      id
    ];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async delete(id) {
    const query = 'DELETE FROM schedules WHERE id = $1 RETURNING *';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }
}

module.exports = Schedule;
