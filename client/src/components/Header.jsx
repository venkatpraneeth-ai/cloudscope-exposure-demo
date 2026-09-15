import React from "react";
import { 
  Utensils, 
  ShoppingBag, 
  MessageSquareText, 
  MapPin, 
  ShieldCheck, 
  Clock, 
  Sparkles,
  ChevronRight,
  Truck
} from "lucide-react";

export default function Header({ 
  currentView, 
  setCurrentView, 
  cartCount, 
  setIsCartOpen, 
  activeOrder, 
  isAdmin, 
  setIsAdmin 
}) {
  return (
    <header className="sticky top-0 z-30 bg-black/95 backdrop-blur-md border-b border-stone-800 shadow-md">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-orange-950/50 via-stone-900/60 to-orange-950/50 border-b border-orange-500/20 text-orange-200 text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2 font-medium">
            <span className="inline-block w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
            <span className="font-semibold text-orange-300">Quickbite Artisan Kitchens</span>
            <span className="hidden sm:inline text-stone-600">•</span>
            <span className="hidden sm:inline text-stone-300">Hyderabadi Dum Biryani, Continental Steaks & Grills</span>
          </div>
          <div className="flex items-center gap-3 text-xs font-semibold">
            <span className="bg-orange-950/80 text-orange-300 px-2.5 py-0.5 rounded-full border border-orange-500/30">
              Fresh Daily Delivery
            </span>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <div className="flex items-center gap-8">
          <button 
            id="brand-logo-btn"
            onClick={() => {
              setIsAdmin(false);
              setCurrentView("discovery");
            }} 
            className="flex items-center gap-3 group text-left cursor-pointer focus:outline-none"
          >
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-orange-600 to-amber-500 flex items-center justify-center text-white shadow-lg shadow-orange-600/30 group-hover:scale-105 transition-transform duration-200">
              <Utensils className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-2xl tracking-tight text-white font-sans">
                  Quick<span className="text-orange-500">bite</span>
                </span>
                <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded bg-orange-500/20 text-orange-400 border border-orange-500/30">
                  Prime
                </span>
              </div>
              <p className="text-xs text-stone-400 font-medium">Artisan Cuisines Delivered</p>
            </div>
          </button>

          {/* Delivery Address Pill */}
          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-stone-900 border border-stone-800 text-xs text-stone-300">
            <MapPin className="w-3.5 h-3.5 text-orange-500" />
            <span className="font-medium text-stone-400">Deliver to:</span>
            <span className="font-bold text-stone-100 truncate max-w-[160px]">742 Evergreen Terrace</span>
            <span className="text-stone-600">·</span>
            <span className="text-emerald-400 font-semibold flex items-center gap-1">
              <Clock className="w-3 h-3" /> ~25 min
            </span>
          </div>
        </div>

        {/* Center / Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 bg-stone-900/90 p-1.5 rounded-xl border border-stone-800">
          <button
            id="nav-discover-btn"
            onClick={() => {
              setIsAdmin(false);
              setCurrentView("discovery");
            }}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition cursor-pointer ${
              !isAdmin && currentView === "discovery"
                ? "bg-stone-800 text-orange-400 shadow-xs border border-stone-700"
                : "text-stone-300 hover:text-white"
            }`}
          >
            Discover Food
          </button>

          <button
            id="nav-tracking-btn"
            onClick={() => {
              setIsAdmin(false);
              setCurrentView("tracking");
            }}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition flex items-center gap-2 cursor-pointer ${
              !isAdmin && currentView === "tracking"
                ? "bg-stone-800 text-orange-400 shadow-xs border border-stone-700"
                : "text-stone-300 hover:text-white"
            }`}
          >
            <Truck className="w-4 h-4" />
            <span>Order Tracker</span>
            {activeOrder && (
              <span className="w-2 h-2 rounded-full bg-orange-500 animate-ping" />
            )}
          </button>

          <button
            id="nav-support-btn"
            onClick={() => {
              setIsAdmin(false);
              setCurrentView("support");
            }}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition flex items-center gap-1.5 cursor-pointer ${
              !isAdmin && currentView === "support"
                ? "bg-stone-800 text-orange-400 shadow-xs border border-stone-700"
                : "text-stone-300 hover:text-white"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-orange-400" />
            <span>AI Support</span>
          </button>
        </nav>

        {/* Right Action Controls: Cart & Admin */}
        <div className="flex items-center gap-3">
          {/* Cart Trigger */}
          <button
            id="header-cart-btn"
            onClick={() => setIsCartOpen(true)}
            className="relative flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-orange-950/50 hover:bg-orange-900/60 text-orange-200 border border-orange-500/40 font-semibold text-sm transition cursor-pointer active:scale-95"
            title="Open Shopping Cart"
          >
            <ShoppingBag className="w-4 h-4 text-orange-400" />
            <span className="hidden sm:inline">Cart</span>
            {cartCount > 0 && (
              <span className="ml-0.5 bg-orange-600 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-xs">
                {cartCount}
              </span>
            )}
          </button>

          {/* Admin Portal Toggle */}
          <button
            id="header-admin-btn"
            onClick={() => setIsAdmin(!isAdmin)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition cursor-pointer ${
              isAdmin
                ? "bg-orange-600 text-white border-orange-500 shadow-xs"
                : "bg-stone-900 text-stone-300 border-stone-800 hover:bg-stone-800 hover:text-white"
            }`}
          >
            <ShieldCheck className={`w-4 h-4 ${isAdmin ? "text-white" : "text-stone-400"}`} />
            <span className="hidden sm:inline">{isAdmin ? "Exit Operations" : "Operations Portal"}</span>
          </button>
        </div>
      </div>
    </header>
  );
}
