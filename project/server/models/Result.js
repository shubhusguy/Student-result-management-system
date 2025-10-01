const { pool } = require('../config/database');

class Result {
  static async addResult(student_id, subject_code, marks, exam_date = null, exam_type = 'Regular') {
    try {
      const [result] = await pool.execute(
        'CALL sp_AddResult(?, ?, ?, ?, ?)',
        [student_id, subject_code, marks, exam_date, exam_type]
      );
      return result[0];
    } catch (error) {
      throw error;
    }
  }

  static async generateReportCard(student_id) {
    try {
      const [result] = await pool.execute('CALL sp_GenerateReportCard(?)', [student_id]);
      return result[0];
    } catch (error) {
      throw error;
    }
  }

  static async getClassAveragePerSubject(className = null) {
    try {
      const [result] = await pool.execute('CALL sp_GetClassAveragePerSubject(?)', [className]);
      return result[0];
    } catch (error) {
      throw error;
    }
  }

  static async getAllResults() {
    try {
      const [rows] = await pool.execute(`
        SELECT 
          r.result_id,
          s.student_name,
          s.class,
          s.section,
          sub.subject_name,
          sub.subject_code,
          r.marks,
          r.grade,
          r.exam_date,
          r.exam_type
        FROM results r
        JOIN students s ON r.student_id = s.student_id
        JOIN subjects sub ON r.subject_id = sub.subject_id
        ORDER BY s.student_name, sub.subject_name
      `);
      return rows;
    } catch (error) {
      throw error;
    }
  }

  static async getStudentResults(student_id) {
    try {
      const [rows] = await pool.execute(`
        SELECT 
          r.result_id,
          sub.subject_name,
          sub.subject_code,
          r.marks,
          r.grade,
          r.exam_date,
          r.exam_type,
          sub.max_marks
        FROM results r
        JOIN subjects sub ON r.subject_id = sub.subject_id
        WHERE r.student_id = ?
        ORDER BY sub.subject_name
      `, [student_id]);
      return rows;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Result;