const db = require("../config/db");

exports.getDrives = async (req, res) => {
  try {
    const userId = req.user.id;

    const [studentRows] = await db.query(
      "SELECT cgpa FROM students WHERE user_id = ?",
      [userId],
    );

    if (studentRows.length === 0) {
      return res.status(404).json({
        message: "Student profile not found",
      });
    }

    const studentCgpa = studentRows[0].cgpa || 0;

    const [drives] = await db.query(
      `SELECT
        drives.id,
        drives.title,
        drives.min_cgpa,
        drives.deadline,
        drives.status,
        companies.name AS company_name
       FROM drives
       JOIN companies
       ON drives.company_id = companies.id
       WHERE drives.status = 'OPEN'
       AND drives.deadline >= CURDATE()
       AND drives.min_cgpa <= ?`,
      [studentCgpa],
    );

    res.json({
      drives,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch drives",
      error: error.message,
    });
  }
};

exports.applyToDrive = async (req, res) => {
  try {
    const userId = req.user.id;
    const driveId = parseInt(req.params.driveId);

    if (isNaN(driveId)) {
      return res.status(400).json({
        message: "Invalid drive ID",
      });
    }

    const [studentRows] = await db.query(
      "SELECT id FROM students WHERE user_id=?",
      [userId],
    );

    if (studentRows.length === 0) {
      return res.status(404).json({
        message: "Student profile not found",
      });
    }

    const studentId = studentRows[0].id;

    const [driveRows] = await db.query("SELECT status FROM drives WHERE id=?", [
      driveId,
    ]);

    if (driveRows.length === 0) {
      return res.status(404).json({
        message: "Drive not found",
      });
    }

    if (driveRows[0].status !== "OPEN") {
      return res.status(400).json({
        message: "Drive is not open for applications",
      });
    }

    const [existing] = await db.query(
      "SELECT id FROM applications WHERE student_id=? AND drive_id=?",
      [studentId, driveId],
    );

    if (existing.length > 0) {
      return res.status(400).json({
        message: "Already applied to this drive",
      });
    }

    await db.query(
      `INSERT INTO applications
       (student_id, drive_id, status)
       VALUES (?, ?, 'APPLIED')`,
      [studentId, driveId],
    );

    res.json({
      message: "Application submitted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Application failed",
      error: error.message,
    });
  }
};

exports.createDrive = async (req, res) => {
  try {
    const userId = req.user.id;
    const { title, min_cgpa, deadline, status = "DRAFT" } = req.body;

    const [companyRows] = await db.query(
      "SELECT id FROM companies WHERE user_id = ?",
      [userId],
    );

    if (companyRows.length === 0) {
      return res.status(404).json({
        message: "Company profile not found",
      });
    }

    const companyId = companyRows[0].id;

    const [result] = await db.query(
      `Insert into drives (company_id, title, min_cgpa, deadline, status) values (?, ?,?,?,?)`,
      [companyId, title, min_cgpa, deadline, status],
    );

    res.json({
      message: "Drive Created successfully",
      driveId: result.insertId,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

exports.getCompanyDrives = async (req, res) => {
  try {
    const userId = req.user.id;

    const [companyRows] = await db.query(
      "SELECT id FROM companies WHERE user_id = ?",
      [userId],
    );

    if (companyRows.length === 0) {
      return res.status(404).json({
        message: "Company profile not found",
      });
    }

    const companyId = companyRows[0].id;
    const [rows] = await db.query(`Select * from drives where company_id=?`, [
      companyId,
    ]);

    res.json(rows);
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

exports.updateDrive = async (req, res) => {
  try {
    const userId = req.user.id;
    const driveId = parseInt(req.params.driveId);

    if (isNaN(driveId)) {
      return res.status(400).json({
        message: "Invalid drive ID",
      });
    }

    const [companyRows] = await db.query(
      "SELECT id FROM companies WHERE user_id =?",
      [userId],
    );

    if (companyRows.length === 0) {
      return res.status(404).json({
        message: "Company profile not found",
      });
    }

    const companyId = companyRows[0].id;

    const [driveRows] = await db.query(
      `Select id from drives where id=? and company_id=?`, [driveId, companyId],
    );

    if (driveRows.length === 0) {
      return res.status(404).json({
        message: "Drive not found or not owned by company",
      });
    }

    const { title, min_cgpa, deadline, status } = req.body;

    const fields = [];
    const values = [];

    if (title !== undefined) {
      fields.push("title=?");
      values.push(title);
    }

    if (min_cgpa !== undefined) {
      fields.push("min_cgpa=?");
      values.push(min_cgpa);
    }

    if (deadline !== undefined) {
      fields.push("deadline=?");
      values.push(deadline);
    }

    if (status !== undefined) {
      fields.push("status=?");
      values.push(status);
    }

    if (fields.length === 0) {
      return res.status(400).json({
        message: "No fields provided for update",
      });
    }

    values.push(driveId);

    await db.query(`Update drives set ${fields.join(", ")} where id=?`, values);

    res.json({
      message: "Drive updated",
    });

  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};
