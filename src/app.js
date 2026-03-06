const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser"); 

const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");
const studentRoutes = require("./routes/student.routes");

const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/students", studentRoutes);

app.get("/", (_, res) => {
  res.send("Placement System API Running");
});

app.get("/api/v1/health", (req, res) => {
  res.json({ status: "API running" });
});

module.exports = app;