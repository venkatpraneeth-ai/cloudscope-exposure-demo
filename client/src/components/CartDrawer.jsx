import React from "react";
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  ArrowRight
} from "lucide-react";

export default function CartDrawer({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onOpenCheckout
}) {
  if (!isOpen) return null;

  const subtotal = cartItems.reduce((sum, item) => sum + item.item.price * item.quantity, 0);
  const deliveryFee = 0.0;
  const tax = subtotal * 0.08;
  const total = subtotal + deliveryFee + tax;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/80 backdrop-blur-xs transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 pl-10 max-w-full flex">
        <div className="w-screen max-w-md bg-stone-950 shadow-2xl flex flex-col border-l border-stone-800">
          {/* Cart Header */}
          <div className="p-6 bg-stone-900 border-b border-stone-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-orange-950/60 border border-orange-500/30 flex items-center justify-center text-orange-400">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-white leading-tight">
                  Your Quickbite Cart
                </h3>
                <p className="text-xs text-stone-400 font-medium">
                  {cartItems.length} {cartItems.length === 1 ? "item" : "items"} selected
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full hover:bg-stone-800 text-stone-400 hover:text-white flex items-center justify-center transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-stone-950">
            {cartItems.length === 0 ? (
              <div className="text-center py-24 space-y-3">
                <div className="w-16 h-16 rounded-full bg-stone-900 text-stone-500 mx-auto flex items-center justify-center border border-stone-800">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <p className="text-stone-300 font-bold text-base">Your cart is empty</p>
                <p className="text-xs text-stone-500 max-w-xs mx-auto">
                  Explore our authentic Hyderabadi Dum Biryanis, Middle Eastern platters, and Continental artisan grills to add items!
                </p>
              </div>
            ) : (
              cartItems.map((cartItem, idx) => (
                <div
                  key={`${cartItem.item.id}-${idx}`}
                  className="bg-stone-900 p-4 rounded-2xl border border-stone-800 shadow-sm space-y-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <img
                        src={cartItem.item.image}
                        alt={cartItem.item.name}
                        className="w-12 h-12 rounded-xl object-cover shrink-0 border border-stone-700"
                      />
                      <div>
                        <h4 className="font-bold text-sm text-white leading-snug">
                          {cartItem.item.name}
                        </h4>
                        <div className="text-xs font-semibold text-orange-400">
                          ${cartItem.item.price.toFixed(2)}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => onRemoveItem(idx)}
                      className="text-stone-500 hover:text-red-400 p-1 transition cursor-pointer"
                      title="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Selected Customizations list */}
                  {cartItem.customizations && Object.keys(cartItem.customizations).length > 0 && (
                    <div className="bg-stone-950 rounded-xl p-2.5 space-y-1 text-[11px] text-stone-300 border border-stone-800">
                      {Object.entries(cartItem.customizations).map(([key, val]) => (
                        <div key={key} className="flex justify-between">
                          <span className="text-stone-500">{key}:</span>
                          <span className="font-semibold text-stone-200">{val}</span>
                        </div>
                      ))}
                      {cartItem.specialInstructions && (
                        <div className="pt-1 border-t border-stone-800 italic text-stone-400">
                          Note: "{cartItem.specialInstructions}"
                        </div>
                      )}
                    </div>
                  )}

                  {/* Quantity and Subtotal */}
                  <div className="flex items-center justify-between pt-1">
                    <div className="flex items-center gap-2 bg-stone-950 border border-stone-800 px-2 py-1 rounded-lg">
                      <button
                        onClick={() => onUpdateQuantity(idx, cartItem.quantity - 1)}
                        className="w-5 h-5 rounded flex items-center justify-center text-stone-400 hover:bg-stone-800 cursor-pointer"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-xs font-bold w-4 text-center text-white">
                        {cartItem.quantity}
                      </span>
                      <button
                        onClick={() => onUpdateQuantity(idx, cartItem.quantity + 1)}
                        className="w-5 h-5 rounded flex items-center justify-center text-stone-400 hover:bg-stone-800 cursor-pointer"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <div className="font-extrabold text-sm text-white">
                      ${(cartItem.item.price * cartItem.quantity).toFixed(2)}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Cart Footer / Checkout */}
          {cartItems.length > 0 && (
            <div className="p-6 bg-stone-900 border-t border-stone-800 space-y-4">
              <div className="space-y-1.5 text-xs text-stone-400">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-white">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery</span>
                  <span className="font-semibold text-emerald-400">FREE Special</span>
                </div>
                <div className="flex justify-between">
                  <span>Estimated Tax (8%)</span>
                  <span className="font-semibold text-white">${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-white pt-2 border-t border-stone-800">
                  <span>Total Due</span>
                  <span className="text-orange-400 text-base font-extrabold">${total.toFixed(2)}</span>
                </div>
              </div>

              <button
                id="checkout-proceed-btn"
                onClick={() => {
                  onClose();
                  onOpenCheckout();
                }}
                className="w-full py-3.5 px-4 rounded-2xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-sm shadow-lg shadow-orange-600/30 transition flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
