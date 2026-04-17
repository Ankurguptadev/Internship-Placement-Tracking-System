const db = require("../config/db");

exports.createOffer = async (req, res) => {
  try {
    const userId = req.user.id;
    const { student_id, drive_id, package } = req.body;

    const [companyRows] = await db.query(
      "Select id from companies where user_id=?",
      [userId],
    );
    const companyId = companyRows[0].id;

    const [driveRows] = await db.query(
      "Select id from drives where id=? and company_id=?",
      [drive_id, companyId],
    );

    if (driveRows.length === 0) {
      return res.status(404).json({
        message: "Drive not found or not owned",
      });
    }

    const [studentRows] = await db.query("Select id from students where id=?", [
      student_id,
    ]);

    if (studentRows.length === 0) {
      return res.status(404).json({
        message: "Student not found",
      });
    }

    const [existing] = await db.query(
      "Select id from offers where student_id=? and drive_id=?",
      [student_id, drive_id],
    );

    if (existing.length > 0) {
      return res.status(400).json({
        message: "Offer already exists",
      });
    }

    const [result] = await db.query(
      `Insert into offers (student_id, drive_id, package, status)
       values (?, ?, ?, 'PENDING')`,
      [student_id, drive_id, package],
    );

    res.json({
      message: "Offer created",
      offerId: result.insertId,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getStudentOffers = async (req, res) => {
  try {
    const userId = req.user.id;

    const [studentRows] = await db.query(
      "Select id from students where user_id=?",
      [userId],
    );

    const studentId = studentRows[0].id;

    const [rows] = await db.query(
      `Select offers.*, drives.title
       from offers
       join drives on offers.drive_id = drives.id
       where offers.student_id=?`,
      [studentId],
    );

    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateOfferStatus = async (req, res) => {
  try {
    const userId = req.user.id;
    const offerId = Number(req.params.offerId);
    const { status } = req.body;

    const [studentRows] = await db.query(
      "Select id from students where user_id=?",
      [userId],
    );

    const studentId = studentRows[0].id;

    const [offerRows] = await db.query(
      "Select id from offers where id=? and student_id=?",
      [offerId, studentId],
    );

    if (offerRows.length === 0) {
      return res.status(404).json({
        message: "Offer not found",
      });
    }

    await db.query("Update offers set status=? where id=?", [status, offerId]);

    res.json({
      message: `Offer ${status}`,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
