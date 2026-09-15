import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import RestaurantDiscovery from "./components/RestaurantDiscovery";
import RestaurantMenuModal from "./components/RestaurantMenuModal";
import ItemCustomizeModal from "./components/ItemCustomizeModal";
import CartDrawer from "./components/CartDrawer";
import CheckoutModal from "./components/CheckoutModal";
import OrderTracking from "./components/OrderTracking";
import SupportAssistant from "./components/SupportAssistant";
import AdminPortal from "./components/AdminPortal";
import { Sparkles, Utensils, CheckCircle2, ShieldCheck, Heart } from "lucide-react";

function App() {
  const [currentView, setCurrentView] = useState("discovery"); // "discovery" | "tracking" | "support"
  const [isAdmin, setIsAdmin] = useState(false);

  // Data states
  const [restaurants, setRestaurants] = useState([]);
  const [demoOrders, setDemoOrders] = useState([]);
  const [activeOrder, setActiveOrder] = useState(null);
  const [cartItems, setCartItems] = useState([]);

  // Modals & Drawers
  const [selectedRestaurantForMenu, setSelectedRestaurantForMenu] = useState(null);
  const [itemToCustomize, setItemToCustomize] = useState(null);
  const [customizingRestaurant, setCustomizingRestaurant] = useState(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  // Load initial data
  const loadRestaurants = async () => {
    try {
      const res = await fetch("/api/restaurants");
      const data = await res.json();
      setRestaurants(data);
      // If a restaurant modal is currently open, keep its state synced
      if (selectedRestaurantForMenu) {
        const updated = data.find((r) => r.id === selectedRestaurantForMenu.id);
        if (updated) setSelectedRestaurantForMenu(updated);
      }
    } catch (err) {
      console.error("Failed to load restaurants", err);
    }
  };

  const loadOrders = async () => {
    try {
      const res = await fetch("/api/orders");
      const data = await res.json();
      setDemoOrders(data);
      if (data.length > 0 && !activeOrder) {
        setActiveOrder(data[0]);
      }
    } catch (err) {
      console.error("Failed to load orders", err);
    }
  };

  useEffect(() => {
    loadRestaurants();
    loadOrders();
  }, []);

  // Cart operations
  const handleAddToCart = (newItemConfig) => {
    setCartItems((prev) => [...prev, newItemConfig]);
    setIsCartOpen(true);
  };

  const handleUpdateQuantity = (index, newQty) => {
    if (newQty <= 0) {
      handleRemoveItem(index);
      return;
    }
    setCartItems((prev) =>
      prev.map((item, idx) =>
        idx === index ? { ...item, quantity: newQty } : item
      )
    );
  };

  const handleRemoveItem = (index) => {
    setCartItems((prev) => prev.filter((_, idx) => idx !== index));
  };

  // Order status update
  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      const res = await fetch(`/api/orders/${orderId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        const updated = await res.json();
        setActiveOrder(updated);
        setDemoOrders((prev) =>
          prev.map((o) => (o.id === orderId ? updated : o))
        );
      }
    } catch (err) {
      console.error("Failed to update status", err);
    }
  };

  const handleOrderPlaced = (newOrder) => {
    setDemoOrders((prev) => [newOrder, ...prev]);
    setActiveOrder(newOrder);
    setCartItems([]);
    setCurrentView("tracking");
  };

  const handleOpenSupportWithOrder = (order) => {
    setActiveOrder(order);
    setCurrentView("support");
  };

  const totalCartCount = cartItems.reduce((acc, i) => acc + i.quantity, 0);

  return (
    <div className="min-h-screen bg-black text-stone-100 font-sans flex flex-col selection:bg-orange-600 selection:text-white">
      {/* Top Header Navigation */}
      <Header
        currentView={currentView}
        setCurrentView={setCurrentView}
        cartCount={totalCartCount}
        setIsCartOpen={setIsCartOpen}
        activeOrder={activeOrder}
        isAdmin={isAdmin}
        setIsAdmin={setIsAdmin}
      />

      {/* Main Body Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {isAdmin ? (
          <AdminPortal
            restaurants={restaurants}
            onRefreshRestaurants={loadRestaurants}
            demoOrders={demoOrders}
            onRefreshOrders={loadOrders}
          />
        ) : (
          <>
            {currentView === "discovery" && (
              <RestaurantDiscovery
                restaurants={restaurants}
                onSelectRestaurant={(rest) => setSelectedRestaurantForMenu(rest)}
                onQuickCustomize={(item, rest) => {
                  setItemToCustomize(item);
                  setCustomizingRestaurant(rest);
                }}
              />
            )}

            {currentView === "tracking" && (
              <OrderTracking
                order={activeOrder}
                onUpdateOrderStatus={handleUpdateOrderStatus}
                onOpenSupportWithOrder={handleOpenSupportWithOrder}
                onExploreMore={() => setCurrentView("discovery")}
              />
            )}

            {currentView === "support" && (
              <SupportAssistant
                activeOrder={activeOrder}
                allOrders={demoOrders}
              />
            )}
          </>
        )}
      </main>

      {/* Modals & Slide-overs */}
      {selectedRestaurantForMenu && (
        <RestaurantMenuModal
          restaurant={selectedRestaurantForMenu}
          onClose={() => setSelectedRestaurantForMenu(null)}
          onCustomizeItem={(item, rest) => {
            setItemToCustomize(item);
            setCustomizingRestaurant(rest);
          }}
        />
      )}

      {itemToCustomize && customizingRestaurant && (
        <ItemCustomizeModal
          item={itemToCustomize}
          restaurant={customizingRestaurant}
          onClose={() => {
            setItemToCustomize(null);
            setCustomizingRestaurant(null);
          }}
          onAddToCart={handleAddToCart}
        />
      )}

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onOpenCheckout={() => setIsCheckoutOpen(true)}
      />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cartItems={cartItems}
        onOrderPlaced={handleOrderPlaced}
      />

      {/* Footer */}
      <footer className="border-t border-stone-800 bg-stone-950 py-8 mt-16 text-xs text-stone-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-white tracking-tight text-sm">
              Quick<span className="text-orange-500">bite</span>
            </span>
            <span className="text-stone-400">• Authentic Indian Dum Biryanis, Middle Eastern & Continental Grills</span>
          </div>

          <div className="flex items-center gap-4 text-stone-500">
            <span>Fresh Kitchens Online</span>
            <span>•</span>
            <span>Powered by Gemini 3.6 Flash</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;

