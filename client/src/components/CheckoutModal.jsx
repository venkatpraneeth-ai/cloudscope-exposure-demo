import React, { useState } from "react";
import { 
  X, 
  CreditCard, 
  MapPin, 
  User, 
  CheckCircle2,
  AlertTriangle,
  ShieldCheck
} from "lucide-react";

export default function CheckoutModal({
  isOpen,
  onClose,
  cartItems,
  onOrderPlaced
}) {
  if (!isOpen) return null;

  const [customerName, setCustomerName] = useState("Sarah Jenkins");
  const [phone, setPhone] = useState("(555) 234-5678");
  const [address, setAddress] = useState("Apt 4B, 742 Evergreen Terrace");
  const [deliveryNotes, setDeliveryNotes] = useState("Leave at front doorstep, gate code #4491");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const subtotal = cartItems.reduce((sum, item) => sum + item.item.price * item.quantity, 0);
  const deliveryFee = 0.0;
  const tax = subtotal * 0.08;
  const total = subtotal + deliveryFee + tax;

  const primaryRestaurant = cartItems[0]?.restaurant || {
    id: "rest-indian",
    name: "Zaika Royal Curry & Tandoor"
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const orderPayload = {
        customerName,
        phone,
        address,
        deliveryNotes,
        restaurantId: primaryRestaurant.id,
        restaurantName: primaryRestaurant.name,
        items: cartItems.map((ci) => ({
          id: ci.item.id,
          name: ci.item.name,
          price: ci.item.price,
          quantity: ci.quantity,
          customizations: ci.customizations,
        })),
        subtotal,
        deliveryFee,
        tax,
        total,
      };

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderPayload),
      });

      if (!res.ok) {
        throw new Error("Failed to create order");
      }

      const createdOrder = await res.json();
      setIsSubmitting(false);
      onOrderPlaced(createdOrder);
      onClose();
    } catch (err) {
      console.error(err);
      setError("Failed to create order. Please retry.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-stone-950 w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl border border-stone-800 flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-6 bg-stone-900 border-b border-stone-800 flex items-center justify-between shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-bold text-white font-serif-display">
                Checkout & Confirmation
              </h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-orange-950 text-orange-400 border border-orange-500/30">
                Fresh & Hot Delivery
              </span>
            </div>
            <p className="text-xs text-stone-400 mt-0.5">
              Ordering from: <strong className="text-stone-200">{primaryRestaurant.name}</strong>
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-stone-800 text-stone-400 hover:text-white flex items-center justify-center transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handlePlaceOrder} className="p-6 overflow-y-auto space-y-6 flex-1 bg-stone-950">
          {error && (
            <div className="p-3 bg-red-950/80 text-red-300 text-xs rounded-xl border border-red-800 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Customer Details */}
          <div className="bg-stone-900 p-5 rounded-2xl border border-stone-800 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-orange-500" />
              <span>Customer Information</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-semibold text-stone-400 mb-1 block">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-xs text-white focus:outline-none focus:ring-2 focus:ring-orange-500/40 focus:border-orange-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-stone-400 mb-1 block">
                  Contact Phone
                </label>
                <input
                  type="text"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-xs text-white focus:outline-none focus:ring-2 focus:ring-orange-500/40 focus:border-orange-500"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-stone-400 mb-1 block">
                Delivery Address
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-2.5 w-3.5 h-3.5 text-stone-500" />
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-xs text-white focus:outline-none focus:ring-2 focus:ring-orange-500/40 focus:border-orange-500"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-stone-400 mb-1 block">
                Delivery Instructions
              </label>
              <input
                type="text"
                value={deliveryNotes}
                onChange={(e) => setDeliveryNotes(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-xs text-white focus:outline-none focus:ring-2 focus:ring-orange-500/40 focus:border-orange-500"
              />
            </div>
          </div>

          {/* Payment Method */}
          <div className="bg-stone-900 p-5 rounded-2xl border border-stone-800 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400 flex items-center gap-1.5">
              <CreditCard className="w-3.5 h-3.5 text-orange-500" />
              <span>Payment Method</span>
            </h4>

            <div className="p-3 rounded-xl bg-stone-950 border border-stone-800 flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                <div className="w-9 h-6 rounded bg-orange-600 text-white flex items-center justify-center font-bold text-[9px] tracking-wider">
                  CARD
                </div>
                <div>
                  <div className="font-bold text-white">Payment Method •••• 4242</div>
                  <div className="text-[10px] text-stone-400">Exp 12/28 • Instant Order Processing</div>
                </div>
              </div>
              <span className="text-emerald-400 font-semibold text-[11px] bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/60">
                Verified
              </span>
            </div>
          </div>

          {/* Order Summary Recap */}
          <div className="bg-stone-900 p-5 rounded-2xl border border-stone-800 space-y-3 text-xs">
            <h4 className="font-bold text-white text-sm">Order Recap ({cartItems.length} items)</h4>
            <div className="divide-y divide-stone-800 max-h-36 overflow-y-auto">
              {cartItems.map((item, idx) => (
                <div key={idx} className="py-2 flex justify-between">
                  <span className="text-stone-300">{item.quantity}x {item.item.name}</span>
                  <span className="font-semibold text-white">
                    ${(item.item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-stone-800 flex justify-between text-sm font-extrabold text-white">
              <span>Total Amount</span>
              <span className="text-orange-400 font-black text-base">${total.toFixed(2)}</span>
            </div>
          </div>

          {/* Submit Button */}
          <button
            id="place-order-submit-btn"
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 px-6 rounded-2xl bg-orange-600 hover:bg-orange-500 disabled:opacity-50 text-white font-bold text-base shadow-lg shadow-orange-600/30 transition flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
          >
            <CheckCircle2 className="w-5 h-5" />
            <span>{isSubmitting ? "Placing Order..." : `Place Order ($${total.toFixed(2)})`}</span>
          </button>
        </form>
      </div>
    </div>
  );
}
