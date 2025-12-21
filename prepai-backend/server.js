require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./src/config/db");

const authRoutes = require("./src/routes/authRoutes");
const sessionRoutes = require("./src/routes/sessionRoutes");
const answerRoutes = require("./src/routes/answerRoutes");
const resultRoutes = require("./src/routes/resultRoutes");
const summaryRoutes = require("./src/routes/summaryRoutes");
const dashboardRoutes = require("./src/routes/dashboardRoutes");
const retakeRoutes = require("./src/routes/retakeRoutes");
const deleteRoutes = require("./src/routes/deleteRoutes");

const app = express();

/* 🔥 CORS — MUST BE BEFORE ROUTES */
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:3000",
      "https://YOUR_FRONTEND.vercel.app"
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
  })
);

/* JSON middleware */
app.use(express.json());

/* Connect DB */
connectDB();

/* Routes */
app.use("/api/auth", authRoutes);
app.use("/api/session", sessionRoutes);
app.use("/api/answer", answerRoutes);
app.use("/api/result", resultRoutes);
app.use("/api/summary", summaryRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/retake", retakeRoutes);
app.use("/api/delete", deleteRoutes);

/* Global error handler */
app.use((err, req, res, next) => {
  console.error("GLOBAL ERROR:", err.stack);
  res.status(500).json({ error: "Internal Server Error. Please try again." });
});

/* Start server */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`🚀 Server running on port ${PORT}`)
);
