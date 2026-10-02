import React, { useState, useEffect } from "react";
import { AuthProvider } from "./context/AuthContext";
import { WishlistProvider } from "./context/WishlistContext";
import { AlertProvider } from "./context/AlertContext";
import LiquidBackground from "./components/common/LiquidBackground";
import GlassNavbar from "./components/common/GlassNavbar";
import GlassFooter from "./components/common/GlassFooter";
import WishlistDrawer from "./components/product/WishlistDrawer";
import PriceAlertModal from "./components/product/PriceAlertModal";
import AuthModal from "./components/auth/AuthModal";

// Pages
import Home from "./pages/Home";
import About from "./pages/About";
import FindCompare from "./pages/FindCompare";
import ComparisonResults from "./pages/ComparisonResults";
import ProductDetails from "./pages/ProductDetails";

export default function App() {
  // Navigation states: 'home' | 'find' | 'about' | 'results' | 'details'
  const [activeTab, setActiveTab] = useState("home");
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [searchParams, setSearchParams] = useState({ search: "", category: "All" });

  // Scroll to top upon page navigation
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [activeTab, selectedProductId]);

  const handleNavigate = (tab, params = {}) => {
    if (params.search !== undefined || params.category !== undefined) {
      setSearchParams({
        search: params.search || "",
        category: params.category || "All"
      });
    }
    setActiveTab(tab);
  };

  const handleSelectProduct = (product) => {
    setSelectedProductId(product.id || product.slug);
    setActiveTab("details");
  };

  const handleCompareDeals = (product) => {
    setSelectedProductId(product.id || product.slug);
    setActiveTab("results");
  };

  return (
    <AuthProvider>
      <WishlistProvider>
        <AlertProvider>
          <div className="relative min-h-screen flex flex-col justify-between selection:bg-brand-500 selection:text-white">
            
            {/* Liquid Apple Glass Background with 3-4 soft blurred drifting color blobs */}
            <LiquidBackground />

            {/* Application Shell */}
            <div className="relative z-10 flex flex-col min-h-screen">
              
              {/* Floating Frosted Glass Navbar */}
              <GlassNavbar activeTab={activeTab} setActiveTab={setActiveTab} />

              {/* Main Content Area */}
              <main className="flex-1 w-full pb-16">
                {activeTab === "home" && (
                  <Home
                    onNavigate={handleNavigate}
                    onSelectCategory={(cat) => handleNavigate("find", { category: cat })}
                    onSelectProduct={handleSelectProduct}
                    onCompareDeals={handleCompareDeals}
                  />
                )}

                {activeTab === "find" && (
                  <FindCompare
                    initialSearch={searchParams.search}
                    initialCategory={searchParams.category}
                    onSelectProduct={handleSelectProduct}
                    onCompareDeals={handleCompareDeals}
                  />
                )}

                {activeTab === "about" && (
                  <About onNavigate={handleNavigate} />
                )}

                {activeTab === "results" && (
                  <ComparisonResults
                    productId={selectedProductId}
                    onBack={() => setActiveTab("find")}
                    onOpenDetails={handleSelectProduct}
                  />
                )}

                {activeTab === "details" && (
                  <ProductDetails
                    productId={selectedProductId}
                    onBack={() => setActiveTab("find")}
                    onSelectProduct={handleSelectProduct}
                    onCompareDeals={handleCompareDeals}
                  />
                )}
              </main>

              {/* Glass Footer */}
              <GlassFooter setActiveTab={setActiveTab} />

            </div>

            {/* Overlays and Modals */}
            <WishlistDrawer
              onSelectProduct={handleSelectProduct}
              onCompareDeals={handleCompareDeals}
            />
            <PriceAlertModal />
            <AuthModal />

          </div>
        </AlertProvider>
      </WishlistProvider>
    </AuthProvider>
  );
}
