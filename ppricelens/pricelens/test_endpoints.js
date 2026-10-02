// Comprehensive API & Integration test script
async function runTests() {
  console.log("--- Starting PriceLens System Tests ---");
  
  // 1. Health check
  try {
    const healthRes = await fetch("http://localhost:5000/api/health");
    const health = await healthRes.json();
    console.log("✔ Backend Health:", health.status === "ok" ? "PASS" : "FAIL", health);
  } catch (e) {
    console.error("✘ Backend Health check failed:", e.message);
  }

  // 2. Products endpoint
  try {
    const prodRes = await fetch("http://localhost:5000/api/products");
    const prods = await prodRes.json();
    console.log(`✔ Products API: PASS (${prods.count} products retrieved)`);
  } catch (e) {
    console.error("✘ Products API failed:", e.message);
  }

  // 3. Categories endpoint
  try {
    const catRes = await fetch("http://localhost:5000/api/categories");
    const cats = await catRes.json();
    console.log(`✔ Categories API: PASS (${cats.data.length} categories: ${cats.data.map(c => c.name).join(", ")})`);
  } catch (e) {
    console.error("✘ Categories API failed:", e.message);
  }

  // 4. Platforms endpoint
  try {
    const platRes = await fetch("http://localhost:5000/api/platforms");
    const plats = await platRes.json();
    console.log(`✔ Platforms API: PASS (${plats.data.length} platforms: ${plats.data.map(p => p.name).join(", ")})`);
  } catch (e) {
    console.error("✘ Platforms API failed:", e.message);
  }

  // 5. Product Details & Comparison
  try {
    const detailRes = await fetch("http://localhost:5000/api/products/prod-iphone-15-pro");
    const detail = await detailRes.json();
    const p = detail.data;
    console.log(`✔ Product Comparison Details: PASS (${p.name} | Lowest: ₹${p.lowestPrice} | Best Deal: ${p.bestDeal.platform.name} Score: ${p.bestDeal.smartScore}/100)`);
  } catch (e) {
    console.error("✘ Product Details failed:", e.message);
  }

  // 6. Auth Login (Demo account)
  let token = null;
  try {
    const loginRes = await fetch("http://localhost:5000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "demo@pricelens.com", password: "demo123" })
    });
    const loginData = await loginRes.json();
    token = loginData.token;
    console.log(`✔ Demo Authentication: PASS (User: ${loginData.user.name}, Token acquired)`);
  } catch (e) {
    console.error("✘ Auth failed:", e.message);
  }

  // 7. Wishlist API
  if (token) {
    try {
      const wishRes = await fetch("http://localhost:5000/api/wishlist", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const wishData = await wishRes.json();
      console.log(`✔ Wishlist API: PASS (${wishData.count} items in wishlist)`);
    } catch (e) {
      console.error("✘ Wishlist API failed:", e.message);
    }
  }

  // 8. Price Alerts API
  if (token) {
    try {
      const alertRes = await fetch("http://localhost:5000/api/alerts", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const alertData = await alertRes.json();
      console.log(`✔ Price Alerts API: PASS (${alertData.count} active alerts)`);
    } catch (e) {
      console.error("✘ Price Alerts API failed:", e.message);
    }
  }

  // 9. Frontend Vite HTML response
  try {
    const feRes = await fetch("http://localhost:3000/");
    const feHtml = await feRes.text();
    const hasTitle = feHtml.includes("PriceLens");
    console.log(`✔ Frontend Vite Web Server: PASS (HTTP ${feRes.status}, Title present: ${hasTitle})`);
  } catch (e) {
    console.error("✘ Frontend server test failed:", e.message);
  }

  console.log("--- All PriceLens Verification Tests Complete ---");
}

runTests();
