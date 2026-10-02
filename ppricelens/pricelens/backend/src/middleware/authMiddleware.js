import jwt from "jsonwebtoken";
import { findUserById, findUserByEmail } from "../services/dbService.js";

const JWT_SECRET = process.env.JWT_SECRET || "pricelens_super_secure_jwt_secret_2026";

export function generateToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email, name: user.name },
    JWT_SECRET,
    { expiresIn: "7d" }
  );
}

export async function requireAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      // Check if guest demo fallback requested
      if (req.headers["x-demo-user"] === "true") {
        const demo = await findUserByEmail("demo@pricelens.com");
        req.user = demo;
        return next();
      }
      return res.status(401).json({ message: "Authentication required" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await findUserById(decoded.id);

    if (!user) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Unauthorized: " + err.message });
  }
}

export async function optionalAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.split(" ")[1];
      const decoded = jwt.verify(token, JWT_SECRET);
      const user = await findUserById(decoded.id);
      if (user) {
        req.user = user;
      }
    } else if (req.headers["x-demo-user"] === "true") {
      const demo = await findUserByEmail("demo@pricelens.com");
      req.user = demo;
    }
  } catch (err) {
    // Ignore error for optional auth
  }
  next();
}
