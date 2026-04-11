const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");
const studentRoutes = require("./routes/student.routes");
const driveRoutes = require("./routes/drive.routes");
const companyRoutes = require("./routes/company.routes");
const roundRoutes = require("./routes/round.routes");

const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/students", studentRoutes);
app.use("/api/v1/drives", driveRoutes);
app.use("/api/v1/company", companyRoutes);
app.use("/api/v1/rounds", roundRoutes);

module.exports = app;
