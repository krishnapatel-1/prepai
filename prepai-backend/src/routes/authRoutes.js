const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth");
const User = require("../models/user");

// Verify token and return user info
router.get("/me", authMiddleware, async (req, res) => {
  try {
    const existing = await User.findOne({ uid: req.user.uid });

    if (!existing) {
      // create user if not exist
      const newUser = await User.create({
        uid: req.user.uid,
        email: req.user.email,
        name: req.user.name || "",
      });
      return res.json(newUser);
    }

    return res.json(existing);
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
