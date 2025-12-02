require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./src/config/db");
const authRoutes = require("./src/routes/authRoutes");
const sessionRoutes = require("./src/routes/sessionRoutes");
const answerRoutes = require("./src/routes/answerRoutes");

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Connect DB
connectDB();

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/session", sessionRoutes);
app.use("/api/answer", answerRoutes);
app.use("/api/session", require("./src/routes/sessionRoutes"));
app.use("/api/answer", require("./src/routes/answerRoutes"));
app.use("/api/result", require("./src/routes/resultRoutes"));
app.use("/api/summary", require("./src/routes/summaryRoutes"));
app.use("/api/session", require("./src/routes/dashboardRoutes"));
app.use("/api/retake", require("./src/routes/retakeRoutes"));
app.use("/api/delete", require("./src/routes/deleteRoutes"));

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on PORT ${PORT}`));

app.use((err, req, res, next) => {
  console.error("GLOBAL ERROR:", err.stack);
  res.status(500).json({ error: "Internal Server Error. Please try again." });
});
