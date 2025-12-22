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

/* 🔥🔥🔥 CORS MUST BE FIRST — NO EXCEPTIONS */
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:3000",
      "https://prepai-red.vercel.app",
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

/* 🔥 HANDLE PREFLIGHT EXPLICITLY */
app.options("/*", cors());

/* JSON */
app.use(express.json());

/* DB */
connectDB();

/* ROUTES */
app.use("/api/auth", authRoutes);
app.use("/api/session", sessionRoutes);
app.use("/api/answer", answerRoutes);
app.use("/api/result", resultRoutes);
app.use("/api/summary", summaryRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/retake", retakeRoutes);
app.use("/api/delete", deleteRoutes);

/* ERROR HANDLER */
app.use((err, req, res, next) => {
  console.error("GLOBAL ERROR:", err.stack);
  res.status(500).json({ error: "Internal Server Error" });
});

/* START */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`🚀 Server running on port ${PORT}`)
);
