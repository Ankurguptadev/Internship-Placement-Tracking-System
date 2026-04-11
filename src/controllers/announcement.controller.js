const db = require("../config/db");

exports.createAnnouncement = async (req, res) => {

  try {

    const userId = req.user.id;
    const { title, message, drive_id } = req.body;

    await db.query(
      `Inset into announcements
       (title, message, drive_id, created_by)
       values (?, ?, ?, ?)`,
      [title, message, drive_id || null, userId]
    );

    res.json({
      message: "Announcement created"
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }

};

exports.getAnnouncements = async (req, res) => {

  try {

    const userId = req.user.id;

    const [studentRows] = await db.query(
      "Select id from students where user_id=?",
      [userId]
    );

    const studentId = studentRows[0].id;

    const [rows] = await db.query(
      `Select
        a.id,
        a.title,
        a.message,
        a.created_at,
        if(sa.is_read IS NULL, false, sa.is_read) AS is_read
       from announcements a
       left join student_announcements sa
       on a.id = sa.announcement_id and sa.student_id = ?
       order by a.created_at desc`,
      [studentId]
    );

    res.json(rows);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }

};

exports.markAsRead = async (req, res) => {

  try {

    const userId = req.user.id;
    const announcementId = Number(req.params.id);

    const [studentRows] = await db.query(
      "Select id from students where user_id=?",
      [userId]
    );

    const studentId = studentRows[0].id;

    const [ann] = await db.query(
      "Select id from announcements where id=?",
      [announcementId]
    );

    if (ann.length === 0) {
      return res.status(404).json({
        message: "Announcement not found"
      });
    }

    await db.query(
      `Insert into student_announcements
       (student_id, announcement_id, is_read, read_at)
       values (?, ?, true, NOW())
       ON DUPLICATE KEY UPDATE
       is_read = true,
       read_at = NOW()`,
      [studentId, announcementId]
    );

    res.json({
      message: "Marked as read"
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }

};