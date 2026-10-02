# PriceLens – Smart E-Commerce Price Comparison Website

> **"Search Once. Compare Everywhere. Buy Smarter."**

PriceLens is a smart shopping comparison website that allows online shoppers to search for a product once and compare its real-time price, customer ratings, genuine discounts, bank cashbacks, and delivery information across multiple shopping platforms (**Amazon, Flipkart, Croma, and Reliance Digital**) in one place.

---

##  Key Features

- **Liquid Glass Theme**: Apple-style glassmorphism with light background, soft drifting blurred color blobs, frosted glass cards, pill-shaped buttons, and glowing accents.
- **Multi-Platform Search**: Search once across Amazon, Flipkart, Croma, and Reliance Digital simultaneously.
- **Visual Image Upload**: Drag-and-drop or select any product photo to preview it before comparison and auto-match categories and gadget models.
- **Smart Deal Score Algorithm**:
  - **Price Competitiveness (40%)**: Lowest price vs competitors and MRP.
  - **Seller / Store Rating (20%)**: Feedback rating and merchant trust score.
  - **Discounts (15%)**: Real discount percentage versus MRP.
  - **Bank & Cashback Offers (15%)**: Instant bank discounts (HDFC, ICICI, Axis) and wallet cashbacks.
  - **Delivery Speed & Cost (10%)**: Express next-day vs standard delivery, with free shipping bonus.
- **Side-by-Side Comparison Matrix**: Transparent comparison of prices, seller ratings, bank offers, delivery speeds, and direct "Buy on [Platform]" links.
- **Product Details & Technical Specifications**: Comprehensive spec tables (Processor, RAM, Display, Battery, Camera, Build, Warranty) and similar product recommendations.
- **Personalized Wishlist Drawer**: Save favorite items and monitor price changes in real-time.
- **Smart Price Drop Alerts**: Set target budgets (e.g. -5%, -10%, -15% drop) and manage active alerts.
- **User Authentication**: Secure JWT-based Sign In and Registration, plus 1-click test login with demo credentials (`demo@pricelens.com` / `demo123`).

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 18, Vite, Tailwind CSS, Lucide Icons, Canvas Confetti |
| **Backend** | Node.js, Express.js (REST API), Multer, JWT, Bcrypt |
| **Database & ORM** | PostgreSQL accessed via **Prisma ORM** (with resilient auto-fallback) |
| **Design** | Liquid Glass (Apple Glassmorphism), Inter Typography |

---

## 📂 Project Structure

```
pricelens/
├── package.json                 # Root scripts to start backend & frontend
├── test_endpoints.js            # Automated system verification test suite
├── backend/
│   ├── package.json
│   ├── .env                     # Database URL and server config
│   ├── prisma/
│   │   └── schema.prisma        # Prisma schema (User, Product, Platform, Price, Wishlist, Alert)
│   ├── uploads/                 # Storage for uploaded product images
│   └── src/
│       ├── data/
│       │   └── seedData.js      # Rich seeded catalog across 6 categories & 4 platforms
│       ├── middleware/
│       │   └── authMiddleware.js# JWT & Demo user authentication middleware
│       ├── routes/
│       │   ├── authRoutes.js    # Register, login, profile
│       │   ├── productRoutes.js # Products, categories, platforms, featured deals
│       │   ├── wishlistRoutes.js# Wishlist CRUD
│       │   ├── alertRoutes.js   # Price alerts CRUD
│       │   └── uploadRoutes.js  # Multer image upload & auto-matching
│       ├── services/
│       │   └── dbService.js     # Prisma database layer with resilient fallback
│       ├── utils/
│       │   └── dealCalculator.js# Smart Deal Score formula calculation
│       └── server.js            # Express server entry point (Port 5000)
└── frontend/
    ├── package.json
    ├── vite.config.js           # Vite dev server with proxy to backend
    ├── tailwind.config.js       # Liquid glass color palette, blurs, and animations
    ├── index.html               # Inter typography and meta SEO tags
    └── src/
        ├── index.css            # Frosted glass styling classes
        ├── main.jsx
        ├── App.jsx              # Navigation controller & Liquid Glass shell
        ├── context/
        │   ├── AuthContext.jsx
        │   ├── WishlistContext.jsx
        │   └── AlertContext.jsx
        ├── components/
        │   ├── common/
        │   │   ├── LiquidBackground.jsx  # 4 soft drifting blurred color blobs
        │   │   ├── GlassNavbar.jsx       # Floating frosted glass navbar
        │   │   └── GlassFooter.jsx       # Modern glass footer
        │   ├── product/
        │   │   ├── ProductCard.jsx       # Glass product card with lift hover
        │   │   ├── ImageUploadPreview.jsx# Image dropzone & live preview
        │   │   ├── WishlistDrawer.jsx    # Slide-over saved items panel
        │   │   └── PriceAlertModal.jsx   # Target price setting modal
        │   ├── comparison/
        │   │   ├── ComparisonTable.jsx   # Cross-platform comparison matrix
        │   │   └── SmartDealBadge.jsx    # Score badge and breakdown tooltip
        │   └── auth/
        │       └── AuthModal.jsx         # Sign in & registration modal
        ├── pages/
        │   ├── Home.jsx              # Hero, How It Works, Features, Categories
        │   ├── About.jsx             # Mission, Deal Score Algorithm deep dive, FAQ
        │   ├── FindCompare.jsx       # Search bar, image upload, filters, platforms
        │   ├── ComparisonResults.jsx # Side-by-side platform comparison matrix
        │   └── ProductDetails.jsx    # Specs table, embedded comparison, similar items
        ├── services/
        │   └── api.js                # API client with token management
        └── utils/
            └── formatters.js         # Currency (INR) and animation helpers
```

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js** (v18 or v20+)
- **npm** (v9+)

### 2. Running the Project

From the project root (`d:\pricelens`):

#### Terminal 1: Start Backend (Port 5000)
```bash
npm run dev:backend
```
*Backend runs on `http://localhost:5000`.*

#### Terminal 2: Start Frontend (Port 3000)
```bash
npm run dev:frontend
```
*Frontend runs on `http://localhost:3000`.*

---

## 🗄️ Database & Prisma ORM

The project uses **Prisma ORM** with the PostgreSQL provider defined in `backend/prisma/schema.prisma`.

### Connecting to a Hosted PostgreSQL Database (e.g. Neon / Supabase / Local Docker)
1. Open `backend/.env`.
2. Set your `DATABASE_URL`:
   ```env
   DATABASE_URL="postgresql://username:password@ep-your-instance.neon.tech/neondb?sslmode=require"
   ```
3. Push the schema to your database:
   ```bash
   npm run prisma:push
   ```

*Note: If no PostgreSQL instance is configured, PriceLens automatically operates in its resilient embedded data store mode, allowing full evaluation without database crashes.*

---

## 🧪 System Verification

Run the automated test suite to verify all API endpoints and the frontend server:
```bash
node test_endpoints.js
```
Expected output:
```
✔ Backend Health: PASS
✔ Products API: PASS (13 products retrieved)
✔ Categories API: PASS (6 categories)
✔ Platforms API: PASS (4 platforms)
✔ Product Comparison Details: PASS
✔ Demo Authentication: PASS
✔ Wishlist API: PASS
✔ Price Alerts API: PASS
✔ Frontend Vite Web Server: PASS (HTTP 200)
```

---

## 👥 Demo Credentials
- **Email**: `demo@pricelens.com`
- **Password**: `demo123`
- *Or click the "1-Click Sign In" button inside the Sign In modal.*
