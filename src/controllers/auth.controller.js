const db = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  const connection = await db.getConnection();

  try {
    const { email, password, role } = req.body;

    await connection.beginTransaction();

    const hashedPassword = await bcrypt.hash(password, 10);

    const [userResult] = await connection.query(
      "INSERT INTO users (email, password, role) VALUES (?, ?, ?)",
      [email, hashedPassword, role],
    );

    const userId = userResult.insertId;

    if (role === "STUDENT") {
      await connection.query("INSERT INTO students (user_id) VALUES (?)", [
        userId,
      ]);
    }

    if (role === "COMPANY") {
      await connection.query("INSERT INTO companies (user_id) VALUES (?)", [
        userId,
      ]);
    }

    await connection.commit();

    res.json({
      message: "User registered successfully",
      userId,
    });
  } catch (error) {
    await connection.rollback();

    res.status(500).json({
      error: error.message,
    });
  } finally {
    connection.release();
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);

    if (rows.length === 0) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const user = rows[0];

    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "10d" },
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
