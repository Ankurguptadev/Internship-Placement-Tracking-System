const db = require("../config/db");

exports.updateStatus = async (req, res) => {

  try {

    const userId = req.user.id;
    const applicationId = Number(req.params.id);
    const { status } = req.body;

    if (!["SHORTLISTED", "REJECTED"].includes(status)) {
      return res.status(400).json({
        message: "Invalid status"
      });
    }

    // get company
    const [companyRows] = await db.query(
      "Select id from companies where user_id=?",
      [userId]
    );

    const companyId = companyRows[0].id;

    const [rows] = await db.query(
      `Select a.id
       from applications a
       join drives d on a.drive_id = d.id
       where a.id=? and d.company_id=?`,
      [applicationId, companyId]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        message: "Application not found or not owned"
      });
    }

    await db.query(
      "Update applications set status=? where id=?",
      [status, applicationId]
    );

    res.json({
      message: `Application ${status}`
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }

};

exports.getMyApplications = async (req, res) => {
  try {
    const userId = req.user.id;

    // get student
    const [studentRows] = await db.query(
      "SELECT id FROM students WHERE user_id=?",
      [userId]
    );

    if (studentRows.length === 0) {
      return res.status(404).json({
        message: "Student profile not found",
      });
    }

    const studentId = studentRows[0].id;

    // fetch applications
    const [rows] = await db.query(
      `SELECT 
        a.id AS application_id,
        a.status,
        a.applied_at,
        d.id AS drive_id,
        d.title,
        c.name AS company_name
       FROM applications a
       JOIN drives d ON a.drive_id = d.id
       JOIN companies c ON d.company_id = c.id
       WHERE a.student_id=?
       ORDER BY a.applied_at DESC`,
      [studentId]
    );

    res.json(rows);

  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};
