const express = require("express");
const router = express.Router();
const db = require("../config/database");

// GET all results
router.get("/", async (req, res) => {
  try {
    const [results] = await db.query(`
      SELECT 
        r.id, s.name AS student_name, s.email, sub.name AS subject_name, r.marks
      FROM 
        results r
      JOIN students s ON r.student_id = s.id
      JOIN subjects sub ON r.subject_id = sub.id
    `);
    res.json({ success: true, data: results });
  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        message: "Failed to fetch results",
        error: error.message,
      });
  }
});

// POST a new result
router.post("/", async (req, res) => {
  const { student_id, subject_id, marks } = req.body;
  if (!student_id || !subject_id || marks == null) {
    return res
      .status(400)
      .json({
        success: false,
        message: "Student ID, Subject ID, and Marks are required",
      });
  }

  try {
    const [result] = await db.query(
      "INSERT INTO results (student_id, subject_id, marks) VALUES (?, ?, ?)",
      [student_id, subject_id, marks]
    );
    res
      .status(201)
      .json({
        success: true,
        message: "Result added successfully",
        id: result.insertId,
      });
  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        message: "Failed to add result",
        error: error.message,
      });
  }
});

module.exports = router;
