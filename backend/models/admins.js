const pool = require('../db');

class Admin {
  static async create(adminData) {
    const query = `
      INSERT INTO admins (name, email, password, role)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;
    const values = [
      adminData.name,
      adminData.email,
      adminData.password,
      adminData.role
    ];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async findAll() {
    const query = 'SELECT * FROM admins ORDER BY id';
    const result = await pool.query(query);
    return result.rows;
  }

  static async findById(id) {
    const query = 'SELECT * FROM admins WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  static async findByEmail(email) {
    const query = 'SELECT * FROM admins WHERE email = $1';
    const result = await pool.query(query, [email]);
    return result.rows[0];
  }

  static async update(id, adminData) {
    const query = `
      UPDATE admins
      SET name = $1, email = $2, password = $3, role = $4
      WHERE id = $5
      RETURNING *
    `;
    const values = [
      adminData.name,
      adminData.email,
      adminData.password,
      adminData.role,
      id
    ];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async delete(id) {
    const query = 'DELETE FROM admins WHERE id = $1 RETURNING *';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }
}

module.exports = Admin;
