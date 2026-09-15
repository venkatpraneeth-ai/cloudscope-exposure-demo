import React, { useState } from "react";
import { X, Minus, Plus, Check, ChefHat } from "lucide-react";

export default function ItemCustomizeModal({ 
  item, 
  restaurant, 
  onClose, 
  onAddToCart 
}) {
  if (!item) return null;

  // Initialize selected options with defaults
  const [selectedOptions, setSelectedOptions] = useState(() => {
    const initial = {};
    if (item.customizationOptions) {
      item.customizationOptions.forEach((opt) => {
        initial[opt.name] = opt.choices[0]; // pick first choice by default
      });
    }
    return initial;
  });

  const [quantity, setQuantity] = useState(1);
  const [specialInstructions, setSpecialInstructions] = useState("");

  const handleOptionChange = (groupName, choice) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [groupName]: choice,
    }));
  };

  const handleAdd = () => {
    onAddToCart({
      item,
      restaurant,
      quantity,
      customizations: selectedOptions,
      specialInstructions: specialInstructions.trim(),
      totalPrice: item.price * quantity,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-stone-950 w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl border border-stone-800 flex flex-col max-h-[90vh]">
        {/* Header with Food Picture */}
        <div className="relative h-48 w-full bg-stone-900 shrink-0">
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover opacity-90"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/50 to-transparent" />

          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-stone-900/80 hover:bg-orange-600 text-white flex items-center justify-center transition cursor-pointer border border-stone-700/60"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="absolute bottom-4 left-4 right-4 text-white">
            <span className="text-[11px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-orange-600 text-white inline-block mb-1">
              {restaurant.name}
            </span>
            <h3 className="text-xl font-bold font-serif-display leading-tight text-white">
              {item.name}
            </h3>
            <p className="text-sm font-bold text-orange-400">
              ${item.price.toFixed(2)} each
            </p>
          </div>
        </div>

        {/* Customization Options Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 bg-stone-950">
          <p className="text-xs text-stone-400 leading-relaxed">
            {item.description}
          </p>

          {/* Option Groups */}
          {item.customizationOptions?.map((group) => (
            <div key={group.name} className="space-y-2.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-stone-300 flex items-center gap-1.5">
                  <ChefHat className="w-3.5 h-3.5 text-orange-500" />
                  <span>{group.name}</span>
                </label>
                <span className="text-[10px] text-stone-400 bg-stone-900 border border-stone-800 px-2 py-0.5 rounded">
                  Required
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {group.choices.map((choice) => {
                  const isSelected = selectedOptions[group.name] === choice;
                  return (
                    <button
                      key={choice}
                      type="button"
                      onClick={() => handleOptionChange(group.name, choice)}
                      className={`px-3 py-2.5 rounded-xl text-xs font-semibold text-left transition flex items-center justify-between border cursor-pointer ${
                        isSelected
                          ? "bg-orange-950/60 border-orange-500 text-orange-200 font-bold shadow-xs"
                          : "bg-stone-900 border-stone-800 text-stone-300 hover:bg-stone-850 hover:text-white"
                      }`}
                    >
                      <span className="truncate pr-1">{choice}</span>
                      {isSelected && (
                        <Check className="w-4 h-4 text-orange-500 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Special Instructions Note */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-stone-300">
              Special Instructions (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. Extra spicy, sauce on the side, etc."
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-stone-900 border border-stone-800 text-xs text-stone-200 placeholder:text-stone-500 focus:outline-none focus:ring-2 focus:ring-orange-500/40 focus:border-orange-500"
            />
          </div>
        </div>

        {/* Bottom Actions Bar */}
        <div className="p-4 sm:p-6 bg-stone-900 border-t border-stone-800 shrink-0 flex items-center justify-between gap-4">
          {/* Quantity Controls */}
          <div className="flex items-center gap-3 bg-stone-950 px-3 py-1.5 rounded-2xl border border-stone-800">
            <button
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              disabled={quantity <= 1}
              className="w-7 h-7 rounded-lg flex items-center justify-center text-stone-400 hover:bg-stone-800 hover:text-white disabled:opacity-30 cursor-pointer"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="font-extrabold text-sm text-white w-4 text-center">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity((q) => q + 1)}
              className="w-7 h-7 rounded-lg flex items-center justify-center text-stone-400 hover:bg-stone-800 hover:text-white cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Add to Cart Submit */}
          <button
            id="confirm-add-to-cart-btn"
            onClick={handleAdd}
            className="flex-1 py-3 px-5 rounded-2xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-sm shadow-md shadow-orange-600/20 transition flex items-center justify-between cursor-pointer active:scale-[0.98]"
          >
            <span>Add to Cart</span>
            <span>${(item.price * quantity).toFixed(2)}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
