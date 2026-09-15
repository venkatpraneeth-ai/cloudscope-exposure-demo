import React, { useState, useEffect } from "react";
import { 
  ShieldCheck, 
  Lock, 
  ToggleLeft, 
  ToggleRight, 
  FileText, 
  Package, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  LogOut,
  AlertCircle
} from "lucide-react";

export default function AdminPortal({ 
  restaurants, 
  onRefreshRestaurants,
  demoOrders,
  onRefreshOrders
}) {
  const [password, setPassword] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("availability"); // "availability", "menus", "policies", "orders"

  // Policies state
  const [articles, setArticles] = useState([]);
  const [newPolicyCategory, setNewPolicyCategory] = useState("Refunds");
  const [newPolicyTitle, setNewPolicyTitle] = useState("");
  const [newPolicyContent, setNewPolicyContent] = useState("");

  // New Menu Item state
  const [selectedRestId, setSelectedRestId] = useState(restaurants[0]?.id || "rest-indian");
  const [newItemName, setNewItemName] = useState("");
  const [newItemCategory, setNewItemCategory] = useState("Specialties");
  const [newItemPrice, setNewItemPrice] = useState("18.00");
  const [newItemDesc, setNewItemDesc] = useState("");

  const handleLogin = async (e) => {
    e?.preventDefault();
    setError("");
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (data.success) {
        setLoggedIn(true);
        loadPolicies();
      } else {
        setError("Invalid admin password.");
      }
    } catch {
      setError("Failed to connect to authentication endpoint.");
    }
  };

  const loadPolicies = async () => {
    try {
      const res = await fetch("/api/articles");
      const data = await res.json();
      setArticles(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleAvailability = async (restaurantId, itemId) => {
    try {
      const res = await fetch(`/api/restaurants/${restaurantId}/items/${itemId}/toggle`, {
        method: "POST",
      });
      if (res.ok) {
        onRefreshRestaurants();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddMenuItem = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/restaurants/${selectedRestId}/items`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newItemName,
          category: newItemCategory,
          price: parseFloat(newItemPrice) || 15.0,
          description: newItemDesc,
        }),
      });
      if (res.ok) {
        onRefreshRestaurants();
        setNewItemName("");
        setNewItemDesc("");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddPolicy = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/articles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newPolicyTitle,
          category: newPolicyCategory,
          content: newPolicyContent,
        }),
      });
      if (res.ok) {
        loadPolicies();
        setNewPolicyTitle("");
        setNewPolicyContent("");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeletePolicy = async (id) => {
    try {
      const res = await fetch(`/api/articles/${id}`, { method: "DELETE" });
      if (res.ok) {
        loadPolicies();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      const res = await fetch(`/api/orders/${orderId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        onRefreshOrders();
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (!loggedIn) {
    return (
      <div className="max-w-md mx-auto py-12 px-4">
        <div className="bg-stone-900 p-8 rounded-3xl border border-stone-800 shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-black border border-stone-800 text-white flex items-center justify-center mx-auto shadow-md">
              <Lock className="w-6 h-6 text-orange-400" />
            </div>
            <h2 className="text-2xl font-bold font-serif-display text-white">
              Quickbite Operations
            </h2>
            <p className="text-xs text-stone-400">
              Manage live menus, inventory stock, AI guidelines, and orders.
            </p>
          </div>

          {error && (
            <div className="p-3 bg-red-950/80 border border-red-800 text-red-300 text-xs rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-1.5 block">
                Administrator Password
              </label>
              <input
                id="admin-password-input"
                type="password"
                placeholder="Enter administrator password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-stone-950 border border-stone-800 text-xs sm:text-sm text-white focus:outline-none focus:ring-2 focus:ring-orange-500/40 focus:border-orange-500 placeholder:text-stone-500"
                required
              />
            </div>

            <button
              id="admin-login-submit-btn"
              type="submit"
              className="w-full py-3.5 px-4 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-sm shadow-lg shadow-orange-600/30 transition cursor-pointer"
            >
              Sign In to Operations Portal
            </button>
          </form>

          <div className="pt-2 text-center text-[11px] text-stone-500">
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-16">
      {/* Admin Nav & Header */}
      <div className="bg-stone-900 p-6 rounded-3xl border border-stone-800 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold font-serif-display text-white">
              Quickbite Operations Portal
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-950 text-emerald-400 border border-emerald-800">
              Authenticated
            </span>
          </div>
          <p className="text-xs text-stone-400 mt-1">
            Real-time control over customer-facing menus, kitchen stock availability, and orders
          </p>
        </div>

        <button
          onClick={() => setLoggedIn(false)}
          className="px-3.5 py-2 rounded-xl bg-stone-950 hover:bg-red-950/80 text-stone-300 hover:text-red-300 border border-stone-800 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </button>
      </div>

      {/* Tabs Selector */}
      <div className="flex flex-wrap items-center gap-2 border-b border-stone-800 pb-2">
        <button
          onClick={() => setActiveTab("availability")}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition cursor-pointer flex items-center gap-2 ${
            activeTab === "availability"
              ? "bg-orange-600 text-white shadow-md"
              : "bg-stone-900 text-stone-300 border border-stone-800 hover:bg-stone-800 hover:text-white"
          }`}
        >
          <ToggleRight className="w-4 h-4" />
          <span>Stock & Availability</span>
        </button>

        <button
          onClick={() => setActiveTab("menus")}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition cursor-pointer flex items-center gap-2 ${
            activeTab === "menus"
              ? "bg-orange-600 text-white shadow-md"
              : "bg-stone-900 text-stone-300 border border-stone-800 hover:bg-stone-800 hover:text-white"
          }`}
        >
          <Package className="w-4 h-4" />
          <span>Menu Dishes</span>
        </button>

        <button
          onClick={() => setActiveTab("policies")}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition cursor-pointer flex items-center gap-2 ${
            activeTab === "policies"
              ? "bg-orange-600 text-white shadow-md"
              : "bg-stone-900 text-stone-300 border border-stone-800 hover:bg-stone-800 hover:text-white"
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>AI Guidelines & Policies</span>
        </button>

        <button
          onClick={() => setActiveTab("orders")}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition cursor-pointer flex items-center gap-2 ${
            activeTab === "orders"
              ? "bg-orange-600 text-white shadow-md"
              : "bg-stone-900 text-stone-300 border border-stone-800 hover:bg-stone-800 hover:text-white"
          }`}
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>Active Orders ({demoOrders.length})</span>
        </button>
      </div>

      {/* Tab 1: Live Stock Availability Toggles */}
      {activeTab === "availability" && (
        <div className="space-y-6">
          <p className="text-xs text-stone-400">
            Instantly toggle dishes between <strong>In Stock</strong> and <strong>Sold Out</strong>. Changes reflect immediately across all customer views.
          </p>

          <div className="space-y-6">
            {restaurants.map((rest) => (
              <div
                key={rest.id}
                className="bg-stone-900 rounded-3xl border border-stone-800 overflow-hidden shadow-xl"
              >
                <div className="bg-stone-950 p-4 border-b border-stone-800 flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-base text-white">{rest.name}</h3>
                    <span className="text-xs text-orange-400 font-semibold">{rest.cuisine}</span>
                  </div>
                  <span className="text-xs text-stone-400">{rest.items.length} items</span>
                </div>

                <div className="divide-y divide-stone-800">
                  {rest.items.map((item) => (
                    <div
                      key={item.id}
                      className="p-4 flex items-center justify-between gap-4 hover:bg-stone-850 transition"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-12 h-12 rounded-xl object-cover border border-stone-800"
                        />
                        <div>
                          <div className="text-sm font-bold text-white">{item.name}</div>
                          <div className="text-xs text-stone-400">
                            ${item.price.toFixed(2)} • {item.category}
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => handleToggleAvailability(rest.id, item.id)}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                          item.isAvailable
                            ? "bg-emerald-600 hover:bg-emerald-500 text-white"
                            : "bg-red-600 hover:bg-red-500 text-white"
                        }`}
                      >
                        {item.isAvailable ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>In Stock</span>
                          </>
                        ) : (
                          <>
                            <AlertCircle className="w-3.5 h-3.5" />
                            <span>Sold Out</span>
                          </>
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Menus & Add Item */}
      {activeTab === "menus" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Add New Item Form */}
          <div className="bg-stone-900 p-6 rounded-3xl border border-stone-800 shadow-xl space-y-4">
            <h3 className="text-lg font-bold text-white font-serif-display">
              Add New Menu Item
            </h3>

            <form onSubmit={handleAddMenuItem} className="space-y-3">
              <div>
                <label className="text-[11px] font-semibold text-stone-400 mb-1 block">
                  Select Restaurant
                </label>
                <select
                  value={selectedRestId}
                  onChange={(e) => setSelectedRestId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-xs text-white focus:outline-none"
                >
                  {restaurants.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name} ({r.cuisine})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-stone-400 mb-1 block">
                  Item Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Saffron Dum Biryani Special"
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-xs text-white focus:outline-none placeholder:text-stone-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] font-semibold text-stone-400 mb-1 block">
                    Category
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Biryanis"
                    value={newItemCategory}
                    onChange={(e) => setNewItemCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-xs text-white focus:outline-none placeholder:text-stone-500"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-stone-400 mb-1 block">
                    Price ($)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    required
                    value={newItemPrice}
                    onChange={(e) => setNewItemPrice(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-xs text-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-stone-400 mb-1 block">
                  Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Ingredients, preparation method..."
                  value={newItemDesc}
                  onChange={(e) => setNewItemDesc(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-xs text-white focus:outline-none placeholder:text-stone-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Save to Menu</span>
              </button>
            </form>
          </div>

          {/* Current Menus Viewer */}
          <div className="lg:col-span-2 space-y-6">
            {restaurants.map((rest) => (
              <div
                key={rest.id}
                className="bg-stone-900 rounded-3xl border border-stone-800 overflow-hidden shadow-xl"
              >
                <div className="bg-stone-950 p-4 border-b border-stone-800 flex justify-between items-center">
                  <h4 className="font-bold text-white text-base">{rest.name}</h4>
                  <span className="text-xs text-orange-400">{rest.items.length} items</span>
                </div>
                <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {rest.items.map((it) => (
                    <div
                      key={it.id}
                      className="p-3 rounded-xl bg-stone-950 border border-stone-800/80 flex gap-3 items-center"
                    >
                      <img
                        src={it.image}
                        alt={it.name}
                        className="w-10 h-10 rounded-lg object-cover border border-stone-800"
                      />
                      <div className="overflow-hidden">
                        <div className="text-xs font-bold text-white truncate">{it.name}</div>
                        <div className="text-[11px] text-orange-400">${it.price.toFixed(2)}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Knowledge Base Policies */}
      {activeTab === "policies" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Add Policy Form */}
          <div className="bg-stone-900 p-6 rounded-3xl border border-stone-800 shadow-xl space-y-4">
            <h3 className="text-lg font-bold text-white font-serif-display">
              Add AI Guidelines & Policy
            </h3>

            <form onSubmit={handleAddPolicy} className="space-y-3">
              <div>
                <label className="text-[11px] font-semibold text-stone-400 mb-1 block">
                  Policy Category
                </label>
                <select
                  value={newPolicyCategory}
                  onChange={(e) => setNewPolicyCategory(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-xs text-white focus:outline-none"
                >
                  <option value="Refunds">Refunds & Returns</option>
                  <option value="Delivery">Delivery & Logistics</option>
                  <option value="Allergens">Allergen Safety</option>
                  <option value="Ingredients">Ingredients & Sourcing</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-stone-400 mb-1 block">
                  Policy Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Late Delivery Refund"
                  value={newPolicyTitle}
                  onChange={(e) => setNewPolicyTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-xs text-white focus:outline-none placeholder:text-stone-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-stone-400 mb-1 block">
                  Content (Rules for Gemini AI)
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Full policy text explaining guidelines, conditions, and exceptions..."
                  value={newPolicyContent}
                  onChange={(e) => setNewPolicyContent(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-xs text-white focus:outline-none placeholder:text-stone-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Save to AI Context</span>
              </button>
            </form>
          </div>

          {/* Policies List */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="font-bold text-base text-white">
              Active Knowledge Base Policies ({articles.length})
            </h3>

            <div className="space-y-3">
              {articles.map((art) => (
                <div
                  key={art.id}
                  className="p-5 rounded-2xl bg-stone-900 border border-stone-800 shadow-sm space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-sm">{art.title}</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-orange-950 text-orange-400 border border-orange-500/30">
                        {art.category}
                      </span>
                    </div>

                    <button
                      onClick={() => handleDeletePolicy(art.id)}
                      className="text-stone-500 hover:text-red-400 p-1 transition cursor-pointer"
                      title="Delete policy"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <p className="text-xs text-stone-400 leading-relaxed font-normal">
                    {art.content}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Orders Management */}
      {activeTab === "orders" && (
        <div className="bg-stone-900 rounded-3xl border border-stone-800 shadow-xl p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-white font-serif-display">
                Order Management & Dispatch
              </h3>
              <p className="text-xs text-stone-400">
                Inspect customer orders and update progress status for delivery timelines.
              </p>
            </div>
          </div>

          <div className="divide-y divide-stone-800">
            {demoOrders.map((ord) => (
              <div key={ord.id} className="py-5 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-base text-white">#{ord.id}</span>
                    <span className="text-xs text-orange-400 font-semibold">{ord.restaurantName}</span>
                    <span className="text-xs text-stone-400">• {ord.customerName}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs text-stone-400">Update Status:</span>
                    <select
                      value={ord.status}
                      onChange={(e) => handleUpdateOrderStatus(ord.id, e.target.value)}
                      className="text-xs font-bold px-3 py-1.5 rounded-xl border border-stone-700 bg-stone-950 text-white focus:outline-none focus:ring-1 focus:ring-orange-500"
                    >
                      <option value="Order placed">Order placed</option>
                      <option value="Restaurant preparing">Restaurant preparing</option>
                      <option value="Courier pickup">Courier pickup</option>
                      <option value="Delivered">Delivered</option>
                    </select>
                  </div>
                </div>

                <div className="text-xs text-stone-400 flex flex-wrap gap-x-6 gap-y-1">
                  <span><strong>Items:</strong> {ord.items.map((i) => `${i.quantity}x ${i.name}`).join(", ")}</span>
                  <span><strong>Total:</strong> ${ord.total.toFixed(2)}</span>
                  <span><strong>Courier:</strong> {ord.courierName}</span>
                  <span><strong>Address:</strong> {ord.address}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
