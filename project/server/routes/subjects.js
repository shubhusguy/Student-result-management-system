const express = require("express");
const router = express.Router();
const db = require("../config/database");

// GET all subjects
router.get("/", async (req, res) => {
  try {
    const [subjects] = await db.query("SELECT * FROM subjects");
    res.json({ success: true, data: subjects });
  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        message: "Failed to fetch subjects",
        error: error.message,
      });
  }
});

// POST a new subject
router.post("/", async (req, res) => {
  const { name } = req.body;
  if (!name) {
    return res
      .status(400)
      .json({ success: false, message: "Subject name is required" });
  }

  try {
    const [result] = await db.query("INSERT INTO subjects (name) VALUES (?)", [
      name,
    ]);
    res
      .status(201)
      .json({
        success: true,
        message: "Subject added successfully",
        id: result.insertId,
      });
  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        message: "Failed to add subject",
        error: error.message,
      });
  }
});

module.exports = router;
