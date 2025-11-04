const pool = require('../db');

class Student {
  static async create(studentData) {
    // Handle optional fields - use null for undefined values
    const query = `
      INSERT INTO students (name, email, roll_number, class_section, phone, address, parent_name, parent_phone, enrollment_no, password, role)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING *
    `;
    const values = [
      studentData.name || null,
      studentData.email || null,
      studentData.roll_number || null,
      studentData.class_section || null,
      studentData.phone || null,
      studentData.address || null,
      studentData.parent_name || null,
      studentData.parent_phone || null,
      studentData.enrollment_no || null,
      studentData.password || null,
      studentData.role || 'student'
    ];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async findAll() {
    const query = 'SELECT * FROM students ORDER BY id';
    const result = await pool.query(query);
    return result.rows;
  }

  static async findById(id) {
    const query = 'SELECT * FROM students WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  static async findByEmail(email) {
    const query = 'SELECT * FROM students WHERE email = $1';
    const result = await pool.query(query, [email]);
    return result.rows[0];
  }

  static async update(id, studentData) {
    const query = `
      UPDATE students
      SET name = $1, email = $2, roll_number = $3, class_section = $4, phone = $5, address = $6,
          parent_name = $7, parent_phone = $8, enrollment_no = $9, password = $10, role = $11
      WHERE id = $12
      RETURNING *
    `;
    const values = [
      studentData.name,
      studentData.email,
      studentData.roll_number,
      studentData.class_section,
      studentData.phone,
      studentData.address,
      studentData.parent_name,
      studentData.parent_phone,
      studentData.enrollment_no,
      studentData.password,
      studentData.role,
      id
    ];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async delete(id) {
    const query = 'DELETE FROM students WHERE id = $1 RETURNING *';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }
}

module.exports = Student;
