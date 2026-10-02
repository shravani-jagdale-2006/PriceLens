import React, { useState } from "react";
import { Search, Heart, Bell, User, LogOut, Menu, X, ArrowUpRight, Sparkles } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useWishlist } from "../../context/WishlistContext";
import { useAlert } from "../../context/AlertContext";

export default function GlassNavbar({ activeTab, setActiveTab }) {
  const { user, logout, openAuthModal } = useAuth();
  const { wishlist, openWishlist } = useWishlist();
  const { alerts } = useAlert();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const navLinks = [
    { id: "home", label: "Home" },
    { id: "find", label: "Find & Compare" },
    { id: "about", label: "About" },
  ];

  return (
    <header className="sticky top-4 z-40 px-4 sm:px-8 max-w-7xl mx-auto w-full transition-all">
      <nav className="glass-panel rounded-full px-5 py-3 sm:py-3.5 flex items-center justify-between shadow-glass border border-white/80">
        
        {/* Brand Logo */}
        <div 
          onClick={() => { setActiveTab("home"); setMobileMenuOpen(false); }}
          className="flex items-center gap-2.5 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-brand-500 to-indigo-400 flex items-center justify-center text-white shadow-md shadow-brand-500/30 group-hover:scale-105 transition-transform">
            <Search className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-bold tracking-tight text-slate-800 flex items-center gap-1">
              Price<span className="text-brand-500">Lens</span>
              <span className="w-2 h-2 rounded-full bg-deal-500"></span>
            </span>
          </div>
        </div>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center gap-1 bg-white/40 p-1 rounded-full border border-white/60 backdrop-blur-md">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => setActiveTab(link.id)}
              className={`px-5 py-2 text-sm font-medium rounded-full transition-all duration-200 cursor-pointer ${
                activeTab === link.id
                  ? "bg-white text-brand-600 shadow-sm shadow-brand-500/10 font-semibold"
                  : "text-slate-600 hover:text-slate-900 hover:bg-white/60"
              }`}
            >
              {link.label}
            </button>
          ))}
        </div>

        {/* Right Action Icons & Auth */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Wishlist Button */}
          <button
            onClick={openWishlist}
            className="relative p-2.5 rounded-full text-slate-600 hover:text-brand-500 hover:bg-white/80 transition-all cursor-pointer border border-transparent hover:border-white/80"
            title="View Wishlist"
            aria-label="Wishlist"
          >
            <Heart className="w-5 h-5" />
            {wishlist.length > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-brand-500 text-white text-[11px] font-bold rounded-full flex items-center justify-center shadow-sm">
                {wishlist.length}
              </span>
            )}
          </button>

          {/* User Account / Auth */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 pl-2 pr-3.5 py-1.5 rounded-full bg-white/70 hover:bg-white border border-white shadow-sm transition-all cursor-pointer"
              >
                <div className="w-7 h-7 rounded-full bg-brand-100 text-brand-600 font-semibold flex items-center justify-center text-xs">
                  {user.name ? user.name[0].toUpperCase() : "U"}
                </div>
                <span className="text-xs font-semibold text-slate-700 hidden sm:inline max-w-[100px] truncate">
                  {user.name.split(" ")[0]}
                </span>
              </button>

              {userDropdownOpen && (
                <div 
                  className="absolute right-0 mt-2 w-56 rounded-2xl glass-panel p-2 shadow-xl border border-white/90 animate-in fade-in slide-in-from-top-2 duration-150 z-50"
                  onClick={() => setUserDropdownOpen(false)}
                >
                  <div className="px-3 py-2 border-b border-slate-100/80 mb-1">
                    <p className="text-xs font-semibold text-slate-800">{user.name}</p>
                    <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
                  </div>
                  <button
                    onClick={() => { setActiveTab("find"); }}
                    className="w-full text-left px-3 py-2 text-xs font-medium text-slate-700 hover:bg-white/90 rounded-xl transition flex items-center gap-2"
                  >
                    <Search className="w-3.5 h-3.5 text-brand-500" /> Compare Products
                  </button>
                  <button
                    onClick={openWishlist}
                    className="w-full text-left px-3 py-2 text-xs font-medium text-slate-700 hover:bg-white/90 rounded-xl transition flex items-center gap-2"
                  >
                    <Heart className="w-3.5 h-3.5 text-rose-500" /> Saved Wishlist ({wishlist.length})
                  </button>
                  <button
                    onClick={logout}
                    className="w-full text-left px-3 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50/80 rounded-xl transition flex items-center gap-2 mt-1 border-t border-slate-100"
                  >
                    <LogOut className="w-3.5 h-3.5" /> Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => openAuthModal("login")}
              className="btn-primary text-xs sm:text-sm py-2 px-4 sm:px-5"
            >
              Sign In
            </button>
          )}

          {/* Mobile Menu Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-full text-slate-700 hover:bg-white/70"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-2 glass-panel rounded-3xl p-4 shadow-glass border border-white/80 flex flex-col gap-2">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => {
                setActiveTab(link.id);
                setMobileMenuOpen(false);
              }}
              className={`w-full text-left px-4 py-2.5 rounded-2xl text-sm font-medium transition ${
                activeTab === link.id
                  ? "bg-brand-500 text-white shadow-sm"
                  : "text-slate-700 hover:bg-white/70"
              }`}
            >
              {link.label}
            </button>
          ))}
        </div>
      )}
    </header>
  );
}
