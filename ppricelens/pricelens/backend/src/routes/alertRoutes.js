import express from "express";
import { getPriceAlerts, createPriceAlert, deletePriceAlert } from "../services/dbService.js";
import { requireAuth } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(requireAuth);

// GET /api/alerts
router.get("/", async (req, res) => {
  try {
    const alerts = await getPriceAlerts(req.user.id);
    return res.json({ success: true, count: alerts.length, data: alerts });
  } catch (error) {
    console.error("Alerts fetch error:", error);
    return res.status(500).json({ success: false, message: "Error fetching price alerts" });
  }
});

// POST /api/alerts
router.post("/", async (req, res) => {
  try {
    const { productId, targetPrice } = req.body;
    if (!productId || !targetPrice) {
      return res.status(400).json({ success: false, message: "productId and targetPrice are required" });
    }

    const alert = await createPriceAlert(req.user.id, productId, targetPrice);
    return res.status(201).json({ success: true, message: "Price alert created successfully", data: alert });
  } catch (error) {
    console.error("Alert create error:", error);
    return res.status(500).json({ success: false, message: "Error creating price alert" });
  }
});

// DELETE /api/alerts/:id
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await deletePriceAlert(req.user.id, id);
    return res.json({ success: true, message: "Price alert deleted successfully" });
  } catch (error) {
    console.error("Alert delete error:", error);
    return res.status(500).json({ success: false, message: "Error deleting price alert" });
  }
});

export default router;
