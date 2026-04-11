const db = require("../config/db");

exports.addResult = async (req, res) => {

  try {

    const roundId = Number(req.params.roundId);
    const { student_id, status } = req.body;

    const [roundRows] = await db.query(
      "Select drive_id from rounds where id=?",
      [roundId]
    );

    if (roundRows.length === 0) {
      return res.status(404).json({
        message: "Round not found"
      });
    }

    const driveId = roundRows[0].drive_id;

    const [existing] = await db.query(
      "Select * from round_results where student_id=? and round_id=?",
      [student_id, roundId]
    );

    if (existing.length > 0) {
      return res.status(400).json({
        message: "Result already exists"
      });
    }

    await db.query(
      `Inset into round_results (student_id, round_id, status)
       values (?, ?, ?)`,
      [student_id, roundId, status]
    );


    if (status === "FAIL") {

      await db.query(
        `Update applications
         set status='REJECTED'
         where student_id=? and drive_id=?`,
        [student_id, driveId]
      );

    } else {

      const [rounds] = await db.query(
        "Select max(seq_no) as maxSeq from rounds where drive_id=?",
        [driveId]
      );

      const [current] = await db.query(
        "Select seq_no from rounds where id=?",
        [roundId]
      );

      if (current[0].seq_no === rounds[0].maxSeq) {

        await db.query(
          `Update applications
           set status='SELECTED'
           where student_id=? and drive_id=?`,
          [student_id, driveId]
        );

      }
    }

    res.json({
      message: "Result added and application updated"
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }

};