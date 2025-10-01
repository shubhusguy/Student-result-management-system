const { pool } = require('../config/database');

class Subject {
  static async getAll() {
    try {
      const [rows] = await pool.execute('SELECT * FROM subjects ORDER BY subject_name');
      return rows;
    } catch (error) {
      throw error;
    }
  }

  static async getById(id) {
    try {
      const [rows] = await pool.execute('SELECT * FROM subjects WHERE subject_id = ?', [id]);
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async create(subjectData) {
    try {
      const { subject_name, subject_code, max_marks } = subjectData;
      const [result] = await pool.execute(
        'INSERT INTO subjects (subject_name, subject_code, max_marks) VALUES (?, ?, ?)',
        [subject_name, subject_code, max_marks || 100]
      );
      return result.insertId;
    } catch (error) {
      throw error;
    }
  }

  static async update(id, subjectData) {
    try {
      const { subject_name, subject_code, max_marks } = subjectData;
      const [result] = await pool.execute(
        'UPDATE subjects SET subject_name = ?, subject_code = ?, max_marks = ? WHERE subject_id = ?',
        [subject_name, subject_code, max_marks, id]
      );
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  static async delete(id) {
    try {
      const [result] = await pool.execute('DELETE FROM subjects WHERE subject_id = ?', [id]);
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Subject;