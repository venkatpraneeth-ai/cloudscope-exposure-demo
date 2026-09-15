import React, { useState } from "react";
import { 
  Star, 
  Clock, 
  ChevronRight, 
  Flame, 
  Search, 
  Sparkles, 
  CheckCircle2
} from "lucide-react";

export default function RestaurantDiscovery({ 
  restaurants, 
  onSelectRestaurant, 
  onQuickCustomize 
}) {
  const [selectedCuisine, setSelectedCuisine] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const cuisines = [
    { id: "All", label: "All Cuisines", count: restaurants.length },
    { id: "Indian", label: "Indian & Biryanis", icon: "🍲" },
    { id: "Middle Eastern", label: "Middle Eastern Grills", icon: "🥙" },
    { id: "Continental", label: "Continental Steaks & Mains", icon: "🥩" },
  ];

  const filteredRestaurants = restaurants.filter((r) => {
    const matchesCuisine = 
      selectedCuisine === "All" || 
      r.cuisine.toLowerCase().includes(selectedCuisine.toLowerCase()) ||
      (selectedCuisine === "Continental" && r.cuisine.toLowerCase().includes("continental"));

    const matchesSearch = 
      r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.cuisine.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.items.some((item) => 
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase())
      );

    return matchesCuisine && matchesSearch;
  });

  // Find the Indian restaurant and Hyderabadi Dum Biryani dish to highlight
  const indianRest = restaurants.find((r) => r.id === "rest-indian") || restaurants[0];
  const biryaniDish = indianRest?.items?.find((i) => i.name.toLowerCase().includes("biryani")) || indianRest?.items?.[0];

  return (
    <div className="space-y-10 pb-16">
      {/* Hero Showcase with Premium Black Background & Prominent Biryani Highlight */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-stone-900 via-black to-stone-950 text-white shadow-2xl border border-stone-800">
        {/* Subtle background glow */}
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-orange-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center p-6 sm:p-10 lg:p-12">
          {/* Left Hero Story */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-500/15 border border-orange-500/30 text-orange-400 text-xs font-semibold backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-orange-400" />
              <span>Signature Highlight: Royal Hyderabadi Dum Biryani</span>
            </div>

            <h1 className="font-serif-display text-4xl sm:text-5xl lg:text-5xl font-bold tracking-tight text-white leading-tight">
              A Symphony of Spices & Flame-Seared Grills.
            </h1>

            <p className="text-stone-300 text-base sm:text-lg leading-relaxed max-w-xl font-normal">
              Indulge in authentic royal Hyderabadi Dum Biryani slow-cooked on dum in sealed clay handis, savory Middle Eastern shawarma platters, and European Continental wood-fired salmon and lamb steaks.
            </p>

            <div className="flex flex-wrap items-center gap-3 text-xs text-stone-300">
              <span className="flex items-center gap-1.5 bg-stone-900/90 px-3.5 py-2 rounded-xl border border-stone-800">
                <CheckCircle2 className="w-4 h-4 text-orange-400" /> Royal Hyderabadi Dum Biryani
              </span>
              <span className="flex items-center gap-1.5 bg-stone-900/90 px-3.5 py-2 rounded-xl border border-stone-800">
                <CheckCircle2 className="w-4 h-4 text-orange-400" /> Farm-Fresh Ingredients
              </span>
              <span className="flex items-center gap-1.5 bg-stone-900/90 px-3.5 py-2 rounded-xl border border-stone-800">
                <CheckCircle2 className="w-4 h-4 text-orange-400" /> Full Continental Menu
              </span>
            </div>
          </div>

          {/* Right Highlighted Biryani Hero Feature Card */}
          <div className="lg:col-span-5 flex justify-center">
            {biryaniDish && indianRest && (
              <div 
                onClick={() => onQuickCustomize(biryaniDish, indianRest)}
                className="relative group cursor-pointer w-full max-w-md rounded-3xl overflow-hidden bg-gradient-to-b from-stone-800 to-stone-900 border-2 border-orange-500/60 shadow-2xl hover:border-orange-400 transition-all duration-300 transform hover:-translate-y-1"
              >
                {/* Visual Glow behind Biryani */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-10" />

                {/* Highlight Badge */}
                <div className="absolute top-4 left-4 z-20 flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-orange-600 text-white text-xs font-black shadow-lg uppercase tracking-wider">
                  <Flame className="w-3.5 h-3.5 fill-white" />
                  <span>Star Dish • Slow Dum Cooked</span>
                </div>

                {/* Biryani Image */}
                <div className="h-64 sm:h-72 w-full overflow-hidden bg-black relative">
                  <img
                    src={biryaniDish.image}
                    alt={biryaniDish.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 brightness-105 contrast-105"
                  />
                </div>

                {/* Dish Info overlay */}
                <div className="relative z-20 p-5 -mt-6 bg-gradient-to-b from-transparent via-stone-950/95 to-black space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[11px] font-semibold text-orange-400 uppercase tracking-wider">
                        {indianRest.name}
                      </span>
                      <h3 className="text-xl font-extrabold text-white font-serif-display group-hover:text-orange-400 transition">
                        {biryaniDish.name}
                      </h3>
                    </div>
                    <div className="text-right">
                      <span className="text-2xl font-black text-white">
                        ${biryaniDish.price.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <p className="text-stone-300 text-xs line-clamp-2 leading-relaxed">
                    {biryaniDish.description}
                  </p>

                  <div className="pt-2 flex items-center justify-between border-t border-stone-800 text-xs">
                    <span className="text-stone-400">
                      Saffron, aged basmati & mirchi ka salan
                    </span>
                    <span className="px-3.5 py-1.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold flex items-center gap-1 shadow-md group-hover:shadow-orange-600/50 transition">
                      Order Biryani +
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Filter and Search Bar */}
      <section className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        {/* Cuisine Filter Pills */}
        <div className="flex flex-wrap items-center gap-2">
          {cuisines.map((c) => (
            <button
              key={c.id}
              id={`filter-${c.id.toLowerCase().replace(/\s+/g, '-')}`}
              onClick={() => setSelectedCuisine(c.id)}
              className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition cursor-pointer flex items-center gap-2 ${
                selectedCuisine === c.id
                  ? "bg-orange-600 text-white shadow-lg shadow-orange-600/30 border border-orange-500"
                  : "bg-stone-900 text-stone-300 border border-stone-800 hover:bg-stone-800 hover:text-white"
              }`}
            >
              {c.icon && <span>{c.icon}</span>}
              <span>{c.label}</span>
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-500" />
          <input
            id="dish-search-input"
            type="text"
            placeholder="Search dishes (e.g. Biryani, Salmon, Pasta)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-stone-900 border border-stone-800 text-sm text-white placeholder:text-stone-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 shadow-inner"
          />
        </div>
      </section>

      {/* Restaurant Discovery Cards */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {filteredRestaurants.map((restaurant) => (
          <div
            key={restaurant.id}
            id={`restaurant-card-${restaurant.id}`}
            className="group bg-stone-900 rounded-3xl border border-stone-800 overflow-hidden shadow-xl hover:border-stone-700 transition-all duration-300 flex flex-col"
          >
            {/* Image Header */}
            <div className="relative h-56 w-full overflow-hidden bg-stone-950">
              <img
                src={restaurant.bannerImage}
                alt={restaurant.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/40 to-transparent" />
              
              {/* Cuisine Tag */}
              <div className="absolute top-4 left-4">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-black/80 text-orange-400 border border-orange-500/30 shadow-md backdrop-blur-xs">
                  {restaurant.cuisine}
                </span>
              </div>

              {/* Bottom Card Title over Image */}
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <h3 className="text-xl font-bold font-serif-display drop-shadow-sm leading-snug">
                  {restaurant.name}
                </h3>
              </div>
            </div>

            {/* Content & Metadata */}
            <div className="p-6 flex-1 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <p className="text-stone-400 text-sm leading-relaxed line-clamp-2">
                  {restaurant.tagline}
                </p>

                {/* Rating & Delivery Info */}
                <div className="flex items-center justify-between text-xs py-2 px-3 rounded-xl bg-stone-950 border border-stone-800/80 text-stone-300">
                  <div className="flex items-center gap-1.5 font-bold text-white">
                    <Star className="w-3.5 h-3.5 text-orange-500 fill-orange-500" />
                    <span>{restaurant.rating}</span>
                    <span className="font-normal text-stone-400">({restaurant.reviewsCount} reviews)</span>
                  </div>
                  <div className="flex items-center gap-1 text-stone-300 font-medium">
                    <Clock className="w-3.5 h-3.5 text-orange-400" />
                    <span>{restaurant.deliveryTime}</span>
                  </div>
                  <div className="font-semibold text-stone-400">
                    {restaurant.priceRange}
                  </div>
                </div>

                {/* Popular Dishes Preview */}
                <div className="space-y-2 pt-2">
                  <div className="text-xs font-bold text-stone-400 uppercase tracking-wider">
                    Featured Signatures
                  </div>
                  <div className="space-y-2">
                    {restaurant.items.slice(0, 3).map((item) => (
                      <div
                        key={item.id}
                        onClick={() => onQuickCustomize(item, restaurant)}
                        className="flex items-center justify-between p-2 rounded-xl hover:bg-stone-800/80 border border-stone-800/40 hover:border-orange-500/40 transition cursor-pointer group/item"
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-11 h-11 rounded-xl object-cover border border-stone-700"
                          />
                          <div>
                            <div className="text-sm font-semibold text-stone-100 group-hover/item:text-orange-400 transition">
                              {item.name}
                            </div>
                            <div className="text-xs text-stone-400">
                              ${item.price.toFixed(2)} • <span className="text-stone-400">{item.category}</span>
                            </div>
                          </div>
                        </div>
                        <span className="text-xs font-semibold text-orange-400 opacity-0 group-hover/item:opacity-100 transition">
                          Customize +
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* View Full Menu Button */}
              <button
                id={`view-menu-${restaurant.id}`}
                onClick={() => onSelectRestaurant(restaurant)}
                className="w-full py-3 px-4 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-semibold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-orange-600/25 active:scale-[0.99]"
              >
                <span>View Full Menu ({restaurant.items.length} dishes)</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
