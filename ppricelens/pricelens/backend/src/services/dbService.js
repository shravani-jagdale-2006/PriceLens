import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { platformsData, productsData, demoUser } from "../data/seedData.js";
import { enrichProductWithDeals } from "../utils/dealCalculator.js";

// Initialize Prisma
let prisma = null;
let isPrismaConnected = false;

// In-Memory store for fast zero-config fallback
let memoryUsers = [demoUser];
let memoryPlatforms = JSON.parse(JSON.stringify(platformsData));
let memoryProducts = JSON.parse(JSON.stringify(productsData));
let memoryWishlist = [
  {
    id: "wish-001",
    userId: demoUser.id,
    productId: "prod-iphone-15-pro",
    createdAt: new Date()
  },
  {
    id: "wish-002",
    userId: demoUser.id,
    productId: "prod-sony-wh1000xm5",
    createdAt: new Date()
  }
];
let memoryPriceAlerts = [
  {
    id: "alert-001",
    userId: demoUser.id,
    productId: "prod-iphone-15-pro",
    targetPrice: 120000,
    isTriggered: false,
    createdAt: new Date()
  }
];

export async function initDatabase() {
  if (process.env.DATABASE_URL) {
    try {
      prisma = new PrismaClient();
      await prisma.$connect();
      isPrismaConnected = true;
      console.log(" [PriceLens DB] Connected to PostgreSQL via Prisma ORM.");
      await seedPrismaIfEmpty();
      return;
    } catch (err) {
      console.warn(" [PriceLens DB] PostgreSQL connection skipped or unavailable (" + err.message + ").");
      console.log(" [PriceLens DB] Operating in resilient memory mode with full seed data active.");
      isPrismaConnected = false;
    }
  } else {
    console.log(" [PriceLens DB] No DATABASE_URL specified. Running with resilient seeded data store.");
  }
}

async function seedPrismaIfEmpty() {
  if (!isPrismaConnected || !prisma) return;
  try {
    const platformCount = await prisma.shoppingPlatform.count();
    if (platformCount === 0) {
      console.log(" [PriceLens DB] Seeding initial platforms & products into PostgreSQL...");
      for (const p of platformsData) {
        await prisma.shoppingPlatform.upsert({
          where: { slug: p.slug },
          update: {},
          create: {
            id: p.id,
            name: p.name,
            slug: p.slug,
            logoUrl: p.logoUrl,
            websiteUrl: p.websiteUrl,
            isActive: p.isActive
          }
        });
      }

      for (const prod of productsData) {
        await prisma.product.create({
          data: {
            id: prod.id,
            name: prod.name,
            slug: prod.slug,
            brand: prod.brand,
            category: prod.category,
            description: prod.description,
            imageUrl: prod.imageUrl,
            mrp: prod.mrp,
            specs: prod.specs,
            prices: {
              create: prod.prices.map(price => ({
                platformId: price.platformId,
                currentPrice: price.currentPrice,
                originalPrice: price.originalPrice,
                discountPercent: price.discountPercent,
                cashbackAmount: price.cashbackAmount,
                cashbackDescription: price.cashbackDescription,
                rating: price.rating,
                reviewsCount: price.reviewsCount,
                deliveryDays: price.deliveryDays,
                deliveryCost: price.deliveryCost,
                deliveryText: price.deliveryText,
                stockStatus: price.stockStatus,
                affiliateUrl: price.affiliateUrl
              }))
            }
          }
        });
      }
      console.log(" [PriceLens DB] PostgreSQL seeding complete.");
    }
  } catch (error) {
    console.warn(" [PriceLens DB] Error during Prisma seeding:", error.message);
  }
}

// Service Methods:

export async function getPlatforms() {
  if (isPrismaConnected) {
    try {
      return await prisma.shoppingPlatform.findMany({ where: { isActive: true } });
    } catch (e) {
      console.error("Prisma error in getPlatforms:", e.message);
    }
  }
  return memoryPlatforms.filter(p => p.isActive);
}

export async function getCategories() {
  const categories = [
    { name: "Mobiles", icon: "Smartphone", count: 3, description: "Flagships, 5G smartphones & accessories" },
    { name: "Laptops", icon: "Laptop", count: 2, description: "Ultrabooks, MacBooks & gaming laptops" },
    { name: "Headphones", icon: "Headphones", count: 2, description: "Noise-cancelling, TWS earbuds & audiophile gear" },
    { name: "TVs", icon: "Tv", count: 2, description: "4K OLED, QLED & smart screens" },
    { name: "Smart Watches", icon: "Watch", count: 2, description: "Fitness trackers, GPS wearables & cellular watches" },
    { name: "Home Appliances", icon: "Home", count: 2, description: "Air purifiers, cordless vacuums & smart living" }
  ];
  return categories;
}

export async function getProducts({ search = "", category = "", minPrice, maxPrice, platformIds = [], sort = "smartScore" } = {}) {
  let list = [];

  if (isPrismaConnected) {
    try {
      const where = {};
      if (category && category !== "All") {
        where.category = category;
      }
      if (search) {
        where.OR = [
          { name: { contains: search, mode: "insensitive" } },
          { brand: { contains: search, mode: "insensitive" } },
          { description: { contains: search, mode: "insensitive" } }
        ];
      }
      list = await prisma.product.findMany({
        where,
        include: {
          prices: {
            include: { platform: true }
          }
        }
      });
    } catch (e) {
      console.warn("Prisma failed in getProducts, falling back to memory store:", e.message);
      list = memoryProducts;
    }
  } else {
    list = memoryProducts;
  }

  // Filter in memory for rich search and platforms
  let filtered = list.filter(prod => {
    if (category && category !== "All" && prod.category.toLowerCase() !== category.toLowerCase()) {
      return false;
    }
    if (search) {
      const q = search.toLowerCase();
      const matchName = prod.name.toLowerCase().includes(q);
      const matchBrand = prod.brand.toLowerCase().includes(q);
      const matchCat = prod.category.toLowerCase().includes(q);
      const matchDesc = prod.description.toLowerCase().includes(q);
      if (!matchName && !matchBrand && !matchCat && !matchDesc) return false;
    }
    return true;
  });

  // Attach platform info and enrich with smart deal score
  const enriched = filtered.map(prod => {
    // Map platform data onto prices if needed
    const pricesWithPlatform = (prod.prices || []).map(pr => {
      const plat = memoryPlatforms.find(p => p.id === pr.platformId) || pr.platform;
      return { ...pr, platform: plat };
    });
    return enrichProductWithDeals({ ...prod, prices: pricesWithPlatform }, platformIds);
  });

  // Filter by price range if provided
  let results = enriched;
  if (minPrice !== undefined && minPrice !== null && !isNaN(minPrice)) {
    results = results.filter(p => p.lowestPrice >= Number(minPrice));
  }
  if (maxPrice !== undefined && maxPrice !== null && !isNaN(maxPrice)) {
    results = results.filter(p => p.lowestPrice <= Number(maxPrice));
  }

  // Sorting
  if (sort === "priceAsc") {
    results.sort((a, b) => a.lowestPrice - b.lowestPrice);
  } else if (sort === "priceDesc") {
    results.sort((a, b) => b.lowestPrice - a.lowestPrice);
  } else if (sort === "discount") {
    results.sort((a, b) => ((b.bestDeal?.discountPercent || 0) - (a.bestDeal?.discountPercent || 0)));
  } else if (sort === "rating") {
    results.sort((a, b) => ((b.bestDeal?.rating || 0) - (a.bestDeal?.rating || 0)));
  } else {
    // default smartScore
    results.sort((a, b) => ((b.bestDeal?.smartScore || 0) - (a.bestDeal?.smartScore || 0)));
  }

  return results;
}

export async function getProductById(idOrSlug, platformIds = []) {
  let prod = null;
  if (isPrismaConnected) {
    try {
      prod = await prisma.product.findFirst({
        where: {
          OR: [{ id: idOrSlug }, { slug: idOrSlug }]
        },
        include: {
          prices: {
            include: { platform: true }
          }
        }
      });
    } catch (e) {
      console.warn("Prisma error in getProductById:", e.message);
    }
  }

  if (!prod) {
    prod = memoryProducts.find(p => p.id === idOrSlug || p.slug === idOrSlug);
  }

  if (!prod) return null;

  const pricesWithPlatform = (prod.prices || []).map(pr => {
    const plat = memoryPlatforms.find(p => p.id === pr.platformId) || pr.platform;
    return { ...pr, platform: plat };
  });

  return enrichProductWithDeals({ ...prod, prices: pricesWithPlatform }, platformIds);
}

// User Authentication
export async function findUserByEmail(email) {
  if (isPrismaConnected) {
    try {
      return await prisma.user.findUnique({ where: { email } });
    } catch (e) {
      console.warn("Prisma error in findUserByEmail:", e.message);
    }
  }
  return memoryUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
}

export async function findUserById(id) {
  if (isPrismaConnected) {
    try {
      return await prisma.user.findUnique({ where: { id } });
    } catch (e) {
      console.warn("Prisma error in findUserById:", e.message);
    }
  }
  return memoryUsers.find(u => u.id === id);
}

export async function createUser({ email, password, name }) {
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = {
    id: "usr-" + Date.now(),
    email,
    password: hashedPassword,
    name,
    createdAt: new Date(),
    updatedAt: new Date()
  };

  if (isPrismaConnected) {
    try {
      return await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          name
        }
      });
    } catch (e) {
      console.warn("Prisma error in createUser, saving to memory:", e.message);
    }
  }

  memoryUsers.push(newUser);
  return newUser;
}

// Wishlist
export async function getWishlist(userId) {
  let items = [];
  if (isPrismaConnected) {
    try {
      items = await prisma.wishlist.findMany({
        where: { userId },
        include: {
          product: {
            include: { prices: true }
          }
        }
      });
      return items.map(w => enrichProductWithDeals(w.product));
    } catch (e) {
      console.warn("Prisma error in getWishlist:", e.message);
    }
  }

  const userItems = memoryWishlist.filter(w => w.userId === userId);
  return userItems.map(w => {
    const prod = memoryProducts.find(p => p.id === w.productId);
    if (!prod) return null;
    const pricesWithPlatform = (prod.prices || []).map(pr => {
      const plat = memoryPlatforms.find(p => p.id === pr.platformId);
      return { ...pr, platform: plat };
    });
    return {
      wishlistId: w.id,
      ...enrichProductWithDeals({ ...prod, prices: pricesWithPlatform })
    };
  }).filter(Boolean);
}

export async function addToWishlist(userId, productId) {
  if (isPrismaConnected) {
    try {
      return await prisma.wishlist.upsert({
        where: {
          userId_productId: { userId, productId }
        },
        update: {},
        create: { userId, productId }
      });
    } catch (e) {
      console.warn("Prisma error in addToWishlist:", e.message);
    }
  }

  const existing = memoryWishlist.find(w => w.userId === userId && w.productId === productId);
  if (existing) return existing;

  const item = {
    id: "wish-" + Date.now(),
    userId,
    productId,
    createdAt: new Date()
  };
  memoryWishlist.push(item);
  return item;
}

export async function removeFromWishlist(userId, productId) {
  if (isPrismaConnected) {
    try {
      await prisma.wishlist.deleteMany({
        where: { userId, productId }
      });
      return true;
    } catch (e) {
      console.warn("Prisma error in removeFromWishlist:", e.message);
    }
  }

  const prevLen = memoryWishlist.length;
  memoryWishlist = memoryWishlist.filter(w => !(w.userId === userId && (w.productId === productId || w.id === productId)));
  return memoryWishlist.length < prevLen;
}

// Price Alerts
export async function getPriceAlerts(userId) {
  if (isPrismaConnected) {
    try {
      const alerts = await prisma.priceAlert.findMany({
        where: { userId },
        include: { product: true }
      });
      return alerts;
    } catch (e) {
      console.warn("Prisma error in getPriceAlerts:", e.message);
    }
  }

  return memoryPriceAlerts.filter(a => a.userId === userId).map(a => {
    const prod = memoryProducts.find(p => p.id === a.productId);
    const enriched = prod ? enrichProductWithDeals(prod) : null;
    return {
      ...a,
      product: enriched,
      isTriggered: enriched ? enriched.lowestPrice <= a.targetPrice : false
    };
  });
}

export async function createPriceAlert(userId, productId, targetPrice) {
  const numericPrice = Number(targetPrice);
  if (isPrismaConnected) {
    try {
      return await prisma.priceAlert.create({
        data: {
          userId,
          productId,
          targetPrice: numericPrice
        }
      });
    } catch (e) {
      console.warn("Prisma error in createPriceAlert:", e.message);
    }
  }

  const alert = {
    id: "alert-" + Date.now(),
    userId,
    productId,
    targetPrice: numericPrice,
    isTriggered: false,
    createdAt: new Date()
  };
  memoryPriceAlerts.push(alert);
  return alert;
}

export async function deletePriceAlert(userId, alertId) {
  if (isPrismaConnected) {
    try {
      await prisma.priceAlert.deleteMany({
        where: { id: alertId, userId }
      });
      return true;
    } catch (e) {
      console.warn("Prisma error in deletePriceAlert:", e.message);
    }
  }

  const prevLen = memoryPriceAlerts.length;
  memoryPriceAlerts = memoryPriceAlerts.filter(a => !(a.id === alertId && a.userId === userId));
  return memoryPriceAlerts.length < prevLen;
}
