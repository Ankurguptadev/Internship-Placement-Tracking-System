const db = require("../config/db");

exports.getProfile = async (req, res) => {
  try {
    const userID = req.user.id;
    const [rows] = await db.query(
      `SELECT students.*, users.email FROM students JOIN users on students.user_id = users.id WHERE users.id =?`,
      [userID],
    );
    
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const userID = req.user.id;
    const { batch, branch, cgpa } = req.body;

    await db.query(
      `Update students set batch=?, branch=?, cgpa=? where user_id=?`,
      [batch, branch, cgpa, userID],
    );

    res.json({ message: "Profile updated successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
