const pool = require('../db');

class Faculty {
  static async create(facultyData) {
    const query = `
      INSERT INTO faculty (name, email, employee_id, department, phone, address, specialization, password, role)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *
    `;
    const values = [
      facultyData.name,
      facultyData.email,
      facultyData.employee_id,
      facultyData.department,
      facultyData.phone,
      facultyData.address,
      facultyData.specialization,
      facultyData.password,
      facultyData.role
    ];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async findAll() {
    const query = 'SELECT * FROM faculty ORDER BY id';
    const result = await pool.query(query);
    return result.rows;
  }

  static async findById(id) {
    const query = 'SELECT * FROM faculty WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  static async findByEmail(email) {
    const query = 'SELECT * FROM faculty WHERE email = $1';
    const result = await pool.query(query, [email]);
    return result.rows[0];
  }

  static async update(id, facultyData) {
    const query = `
      UPDATE faculty
      SET name = $1, email = $2, employee_id = $3, department = $4, phone = $5, address = $6,
          specialization = $7, password = $8, role = $9
      WHERE id = $10
      RETURNING *
    `;
    const values = [
      facultyData.name,
      facultyData.email,
      facultyData.employee_id,
      facultyData.department,
      facultyData.phone,
      facultyData.address,
      facultyData.specialization,
      facultyData.password,
      facultyData.role,
      id
    ];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async delete(id) {
    const query = 'DELETE FROM faculty WHERE id = $1 RETURNING *';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }
}

module.exports = Faculty;
