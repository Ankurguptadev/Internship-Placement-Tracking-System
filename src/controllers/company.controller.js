const db = require("../config/db");

exports.getProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const [rows] = await db.query(
      `Select companies.*, users.email from companies JOIN users on companies.user_id = users.id where users.id =?`,
      [userId],
    );
    if (rows.length === 0) {
      return res.status(404).json({
        message: "Company profile not found",
      });
    }
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, domain } = req.body;

    const [companyRows] = await db.query("Select id from companies where user_id=?", [userId]);

    if (companyRows.length === 0) {
      return res.status(404).json({
        message: "Company profile not found",
      });
    }

    await db.query(
      `Update companies set name=?, domain=? where user_id=?`,
      [name, domain, userId],
    );

    res.json({ message: "Company Profile updated successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
