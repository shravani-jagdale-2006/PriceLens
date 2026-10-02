/**
 * Smart Deal Score calculation
 * Weights:
 * - Price: 40% (cheapest vs highest price among compared platforms)
 * - Rating: 20% (seller / platform rating 0-5)
 * - Discount: 15% (discount percent vs MRP)
 * - Cashback: 15% (effective cashback ratio)
 * - Delivery: 10% (speed in days and free delivery)
 */
export function calculateSmartDealScore(priceOption, allPricesForProduct = []) {
  if (!priceOption) return { score: 0, breakdown: {} };

  const validPrices = allPricesForProduct.length > 0 ? allPricesForProduct : [priceOption];
  const prices = validPrices.map(p => p.currentPrice);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);

  // 1. Price Score (0 - 40 points)
  let priceScore = 40;
  if (maxPrice > minPrice) {
    // Relative position between min and max
    const ratio = (maxPrice - priceOption.currentPrice) / (maxPrice - minPrice);
    priceScore = 20 + ratio * 20; // range 20 to 40
  }

  // 2. Rating Score (0 - 20 points)
  const rating = priceOption.rating || 4.0;
  const ratingScore = Math.min(20, Math.max(0, (rating / 5) * 20));

  // 3. Discount Score (0 - 15 points)
  const discount = priceOption.discountPercent || 0;
  // up to 40% discount gives full 15 points
  const discountScore = Math.min(15, Math.max(0, (discount / 40) * 15));

  // 4. Cashback Score (0 - 15 points)
  const cashback = priceOption.cashbackAmount || 0;
  const cashbackPercent = priceOption.currentPrice > 0 ? (cashback / priceOption.currentPrice) * 100 : 0;
  // up to 6% cashback gives 15 points
  const cashbackScore = Math.min(15, Math.max(0, (cashbackPercent / 6) * 15));

  // 5. Delivery Score (0 - 10 points)
  const days = priceOption.deliveryDays || 3;
  let deliverySpeedScore = days <= 1 ? 7 : days === 2 ? 5 : 3;
  const deliveryFreeBonus = (priceOption.deliveryCost === 0 || !priceOption.deliveryCost) ? 3 : 0;
  const deliveryScore = deliverySpeedScore + deliveryFreeBonus;

  const totalScore = Math.round(priceScore + ratingScore + discountScore + cashbackScore + deliveryScore);
  const clampedScore = Math.min(99, Math.max(45, totalScore));

  return {
    score: clampedScore,
    breakdown: {
      priceScore: Math.round(priceScore),
      ratingScore: Math.round(ratingScore),
      discountScore: Math.round(discountScore),
      cashbackScore: Math.round(cashbackScore),
      deliveryScore: Math.round(deliveryScore)
    }
  };
}

export function enrichProductWithDeals(product, selectedPlatformIds = null) {
  if (!product || !product.prices || product.prices.length === 0) {
    return {
      ...product,
      bestDeal: null,
      lowestPrice: product?.mrp || 0,
      highestPrice: product?.mrp || 0,
      prices: []
    };
  }

  let filteredPrices = product.prices;
  if (selectedPlatformIds && selectedPlatformIds.length > 0) {
    filteredPrices = product.prices.filter(p => selectedPlatformIds.includes(p.platformId));
    if (filteredPrices.length === 0) {
      filteredPrices = product.prices; // fallback to all if none match
    }
  }

  // Calculate scores for all prices
  const scoredPrices = filteredPrices.map(p => {
    const { score, breakdown } = calculateSmartDealScore(p, filteredPrices);
    const effectivePrice = Math.max(0, p.currentPrice - (p.cashbackAmount || 0));
    return {
      ...p,
      smartScore: score,
      scoreBreakdown: breakdown,
      effectivePrice
    };
  });

  // Sort by smartScore descending, then by lowest effective price
  scoredPrices.sort((a, b) => {
    if (b.smartScore !== a.smartScore) {
      return b.smartScore - a.smartScore;
    }
    return a.effectivePrice - b.effectivePrice;
  });

  const bestDeal = scoredPrices[0] || null;
  const allCurrentPrices = scoredPrices.map(p => p.currentPrice);
  const lowestPrice = Math.min(...allCurrentPrices);
  const highestPrice = Math.max(...allCurrentPrices);
  const maxSavings = (product.mrp || highestPrice) - lowestPrice;

  return {
    ...product,
    prices: scoredPrices,
    bestDeal,
    lowestPrice,
    highestPrice,
    maxSavings
  };
}
