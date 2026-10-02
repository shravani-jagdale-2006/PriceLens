import express from "express";
import { getProducts, getProductById, getCategories, getPlatforms } from "../services/dbService.js";

const router = express.Router();

// GET /api/products
router.get("/products", async (req, res) => {
  try {
    const { search, category, minPrice, maxPrice, platforms, sort } = req.query;

    let platformIds = [];
    if (platforms) {
      platformIds = Array.isArray(platforms) ? platforms : platforms.split(",").map(p => p.trim());
    }

    const products = await getProducts({
      search,
      category,
      minPrice,
      maxPrice,
      platformIds,
      sort
    });

    return res.json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    return res.status(500).json({ success: false, message: "Error fetching products" });
  }
});

// GET /api/products/:id
router.get("/products/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { platforms } = req.query;

    let platformIds = [];
    if (platforms) {
      platformIds = Array.isArray(platforms) ? platforms : platforms.split(",").map(p => p.trim());
    }

    const product = await getProductById(id, platformIds);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    return res.json({
      success: true,
      data: product
    });
  } catch (error) {
    console.error("Error fetching product by ID:", error);
    return res.status(500).json({ success: false, message: "Error fetching product details" });
  }
});

// GET /api/categories
router.get("/categories", async (req, res) => {
  try {
    const categories = await getCategories();
    return res.json({ success: true, data: categories });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Error fetching categories" });
  }
});

// GET /api/platforms
router.get("/platforms", async (req, res) => {
  try {
    const platforms = await getPlatforms();
    return res.json({ success: true, data: platforms });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Error fetching platforms" });
  }
});

// GET /api/deals/featured
router.get("/deals/featured", async (req, res) => {
  try {
    const allProducts = await getProducts({ sort: "smartScore" });
    // Top 4 best deals with highest smart scores and biggest discounts
    const featured = allProducts.slice(0, 4);
    return res.json({ success: true, data: featured });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Error fetching featured deals" });
  }
});

export default router;
