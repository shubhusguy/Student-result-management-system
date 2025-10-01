const express = require("express");
const router = express.Router();
const db = require("../config/database");

// GET all students
router.get("/", async (req, res) => {
  try {
    const [students] = await db.query("SELECT * FROM students");
    res.json({ success: true, data: students });
  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        message: "Failed to fetch students",
        error: error.message,
      });
  }
});

// POST a new student
router.post("/", async (req, res) => {
  const { name, email } = req.body;
  if (!name || !email) {
    return res
      .status(400)
      .json({ success: false, message: "Name and email are required" });
  }

  try {
    const [result] = await db.query(
      "INSERT INTO students (name, email) VALUES (?, ?)",
      [name, email]
    );
    res
      .status(201)
      .json({
        success: true,
        message: "Student added successfully",
        id: result.insertId,
      });
  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        message: "Failed to add student",
        error: error.message,
      });
  }
});

module.exports = router;
