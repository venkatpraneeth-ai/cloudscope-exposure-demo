import React, { useState } from "react";
import { 
  X, 
  Star, 
  Clock, 
  Plus, 
  ChevronLeft
} from "lucide-react";

export default function RestaurantMenuModal({ 
  restaurant, 
  onClose, 
  onCustomizeItem 
}) {
  if (!restaurant) return null;

  // Extract unique categories
  const categories = ["All", ...Array.from(new Set(restaurant.items.map((i) => i.category)))];
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredItems = restaurant.items.filter(
    (item) => selectedCategory === "All" || item.category === selectedCategory
  );

  return (
    <div className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      <div className="bg-stone-950 w-full max-w-4xl rounded-3xl overflow-hidden shadow-2xl border border-stone-800 flex flex-col max-h-[92vh]">
        {/* Modal Header with Restaurant Imagery */}
        <div className="relative h-64 sm:h-72 w-full bg-stone-900 overflow-hidden shrink-0">
          <img
            src={restaurant.bannerImage}
            alt={restaurant.name}
            className="w-full h-full object-cover opacity-85"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/60 to-black/30" />

          {/* Close Button */}
          <button
            id="close-restaurant-modal-btn"
            onClick={onClose}
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-stone-900/80 hover:bg-orange-600 text-white flex items-center justify-center backdrop-blur-xs transition cursor-pointer border border-stone-700/60"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Back button */}
          <button
            onClick={onClose}
            className="absolute top-4 left-4 px-3.5 py-1.5 rounded-full bg-stone-900/80 hover:bg-orange-600 text-white text-xs font-semibold flex items-center gap-1 backdrop-blur-xs transition cursor-pointer border border-stone-700/60"
          >
            <ChevronLeft className="w-4 h-4" /> Back to Restaurants
          </button>

          {/* Restaurant Banner Details */}
          <div className="absolute bottom-6 left-6 right-6 text-white space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-orange-600 text-white">
                {restaurant.cuisine}
              </span>
              <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-stone-800 text-stone-200 border border-stone-700">
                Artisan Kitchen & Grill
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-bold font-serif-display text-white">
              {restaurant.name}
            </h2>
            <p className="text-stone-300 text-xs sm:text-sm max-w-2xl font-normal">
              {restaurant.tagline}
            </p>

            <div className="flex items-center gap-4 text-xs text-stone-400 pt-1">
              <span className="flex items-center gap-1 font-bold text-orange-400">
                <Star className="w-3.5 h-3.5 fill-orange-400 text-orange-400" />
                {restaurant.rating} ({restaurant.reviewsCount} reviews)
              </span>
              <span>•</span>
              <span className="flex items-center gap-1 text-stone-300">
                <Clock className="w-3.5 h-3.5 text-orange-400" />
                {restaurant.deliveryTime}
              </span>
            </div>
          </div>
        </div>

        {/* Menu Navigation Categories */}
        <div className="bg-stone-900 px-6 py-3 border-b border-stone-800 flex items-center gap-2 overflow-x-auto shrink-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-1.5 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition cursor-pointer ${
                selectedCategory === cat
                  ? "bg-orange-600 text-white shadow-md shadow-orange-600/30"
                  : "bg-stone-800 text-stone-300 hover:bg-stone-700 hover:text-white"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Menu Items List */}
        <div className="p-6 overflow-y-auto space-y-4 bg-stone-950">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                id={`menu-item-${item.id}`}
                className={`p-4 rounded-2xl border transition flex flex-col justify-between ${
                  item.isAvailable
                    ? "bg-stone-900 border-stone-800 hover:border-orange-500/50 hover:shadow-lg"
                    : "bg-stone-900/40 border-stone-800/60 opacity-60"
                }`}
              >
                <div className="flex gap-4 items-start">
                  <div className="flex-1 space-y-1.5">
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-base text-white leading-snug">
                        {item.name}
                      </h4>
                      {!item.isAvailable && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-red-950 text-red-400 border border-red-800">
                          Sold Out
                        </span>
                      )}
                    </div>

                    <div className="font-bold text-orange-400 text-sm">
                      ${item.price.toFixed(2)}
                    </div>

                    <p className="text-xs text-stone-400 line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>

                    {item.tags && item.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 pt-1">
                        {item.tags.map((tag, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-stone-800 text-stone-300 border border-stone-700"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Item Image */}
                  <div className="relative w-24 h-24 rounded-xl overflow-hidden shrink-0 bg-stone-800 border border-stone-700">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                {/* Bottom Action */}
                <div className="pt-3 mt-3 border-t border-stone-800/80 flex items-center justify-between">
                  <span className="text-[11px] text-stone-500">
                    {item.customizationOptions?.length ? `${item.customizationOptions.length} Options` : "Chef preparation"}
                  </span>

                  <button
                    id={`customize-item-${item.id}`}
                    disabled={!item.isAvailable}
                    onClick={() => onCustomizeItem(item, restaurant)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                      item.isAvailable
                        ? "bg-orange-600 hover:bg-orange-500 text-white shadow-md active:scale-95"
                        : "bg-stone-800 text-stone-500 cursor-not-allowed"
                    }`}
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>{item.isAvailable ? "Customize & Add" : "Unavailable"}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
