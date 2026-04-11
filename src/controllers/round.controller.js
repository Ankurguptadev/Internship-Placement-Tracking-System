const db = require("../config/db");

exports.addResult = async (req, res) => {
  try {
    const roundId = Number(req.params.roundId);
    const { student_id, status } = req.body;

    const [roundRows] = await db.query(
      "Select drive_id from rounds where id=?",
      [roundId],
    );

    if (roundRows.length === 0) {
      return res.status(404).json({
        message: "Round not found",
      });
    }

    const [studentRows] = await db.query("Select id from student where id=?", [
      student_id,
    ]);

    if (studentRows.length === 0) {
      return res.status(404).json({
        message: "Student not found",
      });
    }

    const [existing] = await db.query(
      "Select * from round_results where student_id=? and round_id=?",
      [student_id, roundId],
    );

    if (existing.length > 0) {
      return res.status(400).json({
        message: "Result already exists",
      });
    }

    await db.query(
      `Insert into round_results (student_id, rounf_id, status) values (?,?,?)`,
      [student_id, roundId, status],
    );

    res.json({
      message: "Result added",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
