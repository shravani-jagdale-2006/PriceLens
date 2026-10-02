import express from "express";
import { getWishlist, addToWishlist, removeFromWishlist } from "../services/dbService.js";
import { requireAuth } from "../middleware/authMiddleware.js";

const router = express.Router();

// Apply requireAuth to all wishlist routes
router.use(requireAuth);

// GET /api/wishlist
router.get("/", async (req, res) => {
  try {
    const list = await getWishlist(req.user.id);
    return res.json({ success: true, count: list.length, data: list });
  } catch (error) {
    console.error("Wishlist fetch error:", error);
    return res.status(500).json({ success: false, message: "Error fetching wishlist" });
  }
});

// POST /api/wishlist
router.post("/", async (req, res) => {
  try {
    const { productId } = req.body;
    if (!productId) {
      return res.status(400).json({ success: false, message: "productId is required" });
    }

    const item = await addToWishlist(req.user.id, productId);
    return res.status(201).json({ success: true, message: "Added to wishlist", data: item });
  } catch (error) {
    console.error("Wishlist add error:", error);
    return res.status(500).json({ success: false, message: "Error adding to wishlist" });
  }
});

// DELETE /api/wishlist/:id
router.delete("/:productId", async (req, res) => {
  try {
    const { productId } = req.params;
    await removeFromWishlist(req.user.id, productId);
    return res.json({ success: true, message: "Removed from wishlist" });
  } catch (error) {
    console.error("Wishlist remove error:", error);
    return res.status(500).json({ success: false, message: "Error removing from wishlist" });
  }
});

export default router;
