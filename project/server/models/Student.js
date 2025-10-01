const { pool } = require('../config/database');

class Student {
  static async getAll() {
    try {
      const [rows] = await pool.execute('SELECT * FROM students ORDER BY student_name');
      return rows;
    } catch (error) {
      throw error;
    }
  }

  static async getById(id) {
    try {
      const [rows] = await pool.execute('SELECT * FROM students WHERE student_id = ?', [id]);
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async create(studentData) {
    try {
      const { student_name, class: studentClass, section, email, phone, date_of_birth } = studentData;
      const [result] = await pool.execute(
        'INSERT INTO students (student_name, class, section, email, phone, date_of_birth) VALUES (?, ?, ?, ?, ?, ?)',
        [student_name, studentClass, section, email, phone, date_of_birth]
      );
      return result.insertId;
    } catch (error) {
      throw error;
    }
  }

  static async update(id, studentData) {
    try {
      const { student_name, class: studentClass, section, email, phone, date_of_birth } = studentData;
      const [result] = await pool.execute(
        'UPDATE students SET student_name = ?, class = ?, section = ?, email = ?, phone = ?, date_of_birth = ? WHERE student_id = ?',
        [student_name, studentClass, section, email, phone, date_of_birth, id]
      );
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  static async delete(id) {
    try {
      const [result] = await pool.execute('DELETE FROM students WHERE student_id = ?', [id]);
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  static async getRankings() {
    try {
      const [rows] = await pool.execute('SELECT * FROM v_student_rankings ORDER BY overall_rank');
      return rows;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Student;