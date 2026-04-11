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