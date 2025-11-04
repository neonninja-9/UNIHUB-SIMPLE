const pool = require('../db');

class StudentFace {
  static async ensureTableExists() {
    try {
      await pool.query(`
        CREATE TABLE IF NOT EXISTS student_faces (
          id SERIAL PRIMARY KEY,
          student_id INTEGER REFERENCES students(id) ON DELETE CASCADE,
          face_embedding JSONB NOT NULL,
          whatsapp_number VARCHAR(20),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          UNIQUE(student_id)
        )
      `);
    } catch (error) {
      console.error('Error creating student_faces table:', error);
      throw error;
    }
  }

  static async create(studentId, faceEmbedding, whatsappNumber = null) {
    // Ensure table exists before inserting
    await this.ensureTableExists();
    
    console.log(`StudentFace.create called with studentId: ${studentId}, embedding length: ${faceEmbedding?.length}, whatsapp: ${whatsappNumber}`);
    
    // Validate inputs
    if (!studentId || isNaN(studentId)) {
      throw new Error(`Invalid student ID: ${studentId}`);
    }
    
    if (!faceEmbedding || !Array.isArray(faceEmbedding) || faceEmbedding.length === 0) {
      throw new Error(`Invalid face embedding: must be a non-empty array`);
    }
    
    // PostgreSQL JSONB accepts JSON directly, but we'll stringify to be safe
    // For JSONB, we can pass the array directly or stringify it
    const query = `
      INSERT INTO student_faces (student_id, face_embedding, whatsapp_number)
      VALUES ($1, $2::jsonb, $3)
      ON CONFLICT (student_id) 
      DO UPDATE SET 
        face_embedding = $2::jsonb,
        whatsapp_number = $3,
        updated_at = CURRENT_TIMESTAMP
      RETURNING *
    `;
    
    // For JSONB, we can pass the array directly or as JSON string
    // Convert to JSON string for PostgreSQL
    const embeddingValue = JSON.stringify(faceEmbedding);
    const values = [parseInt(studentId, 10), embeddingValue, whatsappNumber];
    
    console.log(`Executing query with studentId: ${values[0]}, embedding size: ${embeddingValue.length} chars`);
    
    try {
      console.log('About to execute database query...');
      const result = await pool.query(query, values);
      console.log(`Query executed. Rows affected: ${result.rowCount}, Rows returned: ${result.rows.length}`);
      
      if (result.rows.length === 0) {
        console.error('WARNING: No rows returned after insert/update');
        throw new Error('No rows returned after insert');
      }
      
      // Parse the face_embedding if it's a string
      const row = result.rows[0];
      console.log(`Row returned with ID: ${row.id}, student_id: ${row.student_id}`);
      
      if (typeof row.face_embedding === 'string') {
        try {
          row.face_embedding = JSON.parse(row.face_embedding);
        } catch (parseError) {
          console.warn('Could not parse face_embedding as JSON, keeping as string');
        }
      }
      
      // Verify the embedding was saved correctly
      const embeddingLength = Array.isArray(row.face_embedding) 
        ? row.face_embedding.length 
        : (typeof row.face_embedding === 'string' ? JSON.parse(row.face_embedding).length : 0);
      console.log(`Face embedding saved with ${embeddingLength} values`);
      
      return row;
    } catch (error) {
      console.error('Database error in StudentFace.create:', error);
      console.error('Error name:', error.name);
      console.error('Error code:', error.code);
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
      console.error('Query:', query);
      console.error('Values:', values.map((v, i) => {
        if (i === 1) {
          return `[JSON string of length ${typeof v === 'string' ? v.length : 'N/A'}]`;
        }
        return v;
      }));
      throw error;
    }
  }

  static async findByStudentId(studentId) {
    const query = 'SELECT * FROM student_faces WHERE student_id = $1';
    const result = await pool.query(query, [studentId]);
    return result.rows[0];
  }

  static async findAll() {
    // Ensure table exists before querying
    await this.ensureTableExists();
    
    const query = `
      SELECT 
        sf.id,
        sf.student_id,
        sf.face_embedding,
        sf.whatsapp_number,
        s.name,
        s.enrollment_no,
        sf.created_at,
        sf.updated_at
      FROM student_faces sf
      JOIN students s ON sf.student_id = s.id
      ORDER BY sf.created_at DESC
    `;
    const result = await pool.query(query);
    return result.rows.map(row => ({
      ...row,
      face_embedding: typeof row.face_embedding === 'string' 
        ? JSON.parse(row.face_embedding) 
        : row.face_embedding
    }));
  }

  static async deleteByStudentId(studentId) {
    const query = 'DELETE FROM student_faces WHERE student_id = $1 RETURNING *';
    const result = await pool.query(query, [studentId]);
    return result.rows[0];
  }
}

module.exports = StudentFace;

