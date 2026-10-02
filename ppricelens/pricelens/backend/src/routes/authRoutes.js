import express from "express";
import bcrypt from "bcryptjs";
import { findUserByEmail, createUser } from "../services/dbService.js";
import { generateToken, requireAuth } from "../middleware/authMiddleware.js";

const router = express.Router();

// POST /api/auth/register
router.post("/register", async (req, res) => {
  try {
    const { email, password, name } = req.body;
    if (!email || !password || !name) {
      return res.status(400).json({ message: "Email, password, and name are required." });
    }

    const existing = await findUserByEmail(email);
    if (existing) {
      return res.status(400).json({ message: "User with this email already exists." });
    }

    const user = await createUser({ email, password, name });
    const token = generateToken(user);

    return res.status(201).json({
      message: "Registration successful",
      user: { id: user.id, email: user.email, name: user.name },
      token
    });
  } catch (error) {
    console.error("Register error:", error);
    return res.status(500).json({ message: "Server error during registration." });
  }
});

// POST /api/auth/login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }

    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    // Check password (support demo bypass if matching demo credentials)
    let isMatch = false;
    if (email === "demo@pricelens.com" && password === "demo123") {
      isMatch = true;
    } else {
      isMatch = await bcrypt.compare(password, user.password);
    }

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const token = generateToken(user);
    return res.json({
      message: "Login successful",
      user: { id: user.id, email: user.email, name: user.name },
      token
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "Server error during login." });
  }
});

// GET /api/auth/me
router.get("/me", requireAuth, async (req, res) => {
  res.json({
    user: { id: req.user.id, email: req.user.email, name: req.user.name }
  });
});

export default router;
