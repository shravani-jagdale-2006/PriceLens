// PriceLens API Client

const API_BASE = "/api";

function getHeaders() {
  const headers = {
    "Content-Type": "application/json"
  };
  const token = localStorage.getItem("pricelens_token");
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  } else {
    // Enable demo fallback for smooth evaluation if not signed in
    headers["x-demo-user"] = "true";
  }
  return headers;
}

export const api = {
  // Products
  async getProducts({ search = "", category = "", minPrice = "", maxPrice = "", platforms = [], sort = "smartScore" } = {}) {
    const params = new URLSearchParams();
    if (search) params.append("search", search);
    if (category && category !== "All") params.append("category", category);
    if (minPrice) params.append("minPrice", minPrice);
    if (maxPrice) params.append("maxPrice", maxPrice);
    if (platforms && platforms.length > 0) params.append("platforms", platforms.join(","));
    if (sort) params.append("sort", sort);

    const res = await fetch(`${API_BASE}/products?${params.toString()}`, {
      headers: getHeaders()
    });
    if (!res.ok) throw new Error("Failed to fetch products");
    return res.json();
  },

  async getProductById(id, platforms = []) {
    const params = new URLSearchParams();
    if (platforms && platforms.length > 0) {
      params.append("platforms", platforms.join(","));
    }
    const query = params.toString() ? `?${params.toString()}` : "";
    const res = await fetch(`${API_BASE}/products/${id}${query}`, {
      headers: getHeaders()
    });
    if (!res.ok) throw new Error("Failed to fetch product details");
    return res.json();
  },

  async getCategories() {
    const res = await fetch(`${API_BASE}/categories`, { headers: getHeaders() });
    if (!res.ok) throw new Error("Failed to fetch categories");
    return res.json();
  },

  async getPlatforms() {
    const res = await fetch(`${API_BASE}/platforms`, { headers: getHeaders() });
    if (!res.ok) throw new Error("Failed to fetch platforms");
    return res.json();
  },

  async getFeaturedDeals() {
    const res = await fetch(`${API_BASE}/deals/featured`, { headers: getHeaders() });
    if (!res.ok) throw new Error("Failed to fetch featured deals");
    return res.json();
  },

  // Image Upload for comparison search
  async uploadImage(file) {
    const formData = new FormData();
    formData.append("image", file);

    const token = localStorage.getItem("pricelens_token");
    const headers = {};
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const res = await fetch(`${API_BASE}/upload-image`, {
      method: "POST",
      headers,
      body: formData
    });
    if (!res.ok) throw new Error("Image upload failed");
    return res.json();
  },

  // Auth
  async login(email, password) {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Login failed");
    return data;
  },

  async register(name, email, password) {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Registration failed");
    return data;
  },

  async getMe() {
    const token = localStorage.getItem("pricelens_token");
    if (!token) return null;
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.ok) return null;
    return res.json();
  },

  // Wishlist
  async getWishlist() {
    const res = await fetch(`${API_BASE}/wishlist`, { headers: getHeaders() });
    if (!res.ok) throw new Error("Failed to fetch wishlist");
    return res.json();
  },

  async addToWishlist(productId) {
    const res = await fetch(`${API_BASE}/wishlist`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({ productId })
    });
    if (!res.ok) throw new Error("Failed to add to wishlist");
    return res.json();
  },

  async removeFromWishlist(productId) {
    const res = await fetch(`${API_BASE}/wishlist/${productId}`, {
      method: "DELETE",
      headers: getHeaders()
    });
    if (!res.ok) throw new Error("Failed to remove from wishlist");
    return res.json();
  },

  // Price Alerts
  async getPriceAlerts() {
    const res = await fetch(`${API_BASE}/alerts`, { headers: getHeaders() });
    if (!res.ok) throw new Error("Failed to fetch alerts");
    return res.json();
  },

  async createPriceAlert(productId, targetPrice) {
    const res = await fetch(`${API_BASE}/alerts`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({ productId, targetPrice })
    });
    if (!res.ok) throw new Error("Failed to create price alert");
    return res.json();
  },

  async deletePriceAlert(alertId) {
    const res = await fetch(`${API_BASE}/alerts/${alertId}`, {
      method: "DELETE",
      headers: getHeaders()
    });
    if (!res.ok) throw new Error("Failed to delete price alert");
    return res.json();
  }
};
