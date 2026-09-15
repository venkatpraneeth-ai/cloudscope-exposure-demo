import React from "react";
import { 
  CheckCircle2, 
  Clock, 
  ChefHat, 
  Bike, 
  Home, 
  MapPin, 
  Sparkles, 
  RefreshCw
} from "lucide-react";

export default function OrderTracking({
  order,
  onUpdateOrderStatus,
  onOpenSupportWithOrder,
  onExploreMore
}) {
  if (!order) {
    return (
      <div className="max-w-2xl mx-auto text-center py-20 bg-stone-900 rounded-3xl p-8 border border-stone-800 space-y-4">
        <div className="w-16 h-16 rounded-full bg-orange-950/60 border border-orange-500/30 text-orange-400 mx-auto flex items-center justify-center">
          <Clock className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-bold text-white font-serif-display">No Active Order</h3>
        <p className="text-stone-400 text-xs sm:text-sm max-w-md mx-auto">
          You haven't placed an order yet in this session. Explore restaurants to order authentic Hyderabadi Dum Biryani or Continental Grills!
        </p>
        <button
          onClick={onExploreMore}
          className="px-6 py-3 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-sm shadow-md transition cursor-pointer"
        >
          Explore Cuisines
        </button>
      </div>
    );
  }

  // Four explicit stages
  const stages = [
    {
      id: "Order placed",
      label: "Order confirmed",
      subtitle: "Received by kitchen",
      icon: CheckCircle2,
    },
    {
      id: "Restaurant preparing",
      label: "Kitchen preparing",
      subtitle: "Chef is crafting dishes on dum & grill",
      icon: ChefHat,
    },
    {
      id: "Courier pickup",
      label: "Out for delivery",
      subtitle: "Courier picked up hot meal and is en route",
      icon: Bike,
    },
    {
      id: "Delivered",
      label: "Delivered",
      subtitle: "Enjoy your meal hot & fresh",
      icon: Home,
    },
  ];

  const currentStageIndex = stages.findIndex((s) => s.id === order.status);
  const activeIndex = currentStageIndex === -1 ? 0 : currentStageIndex;

  const handleAdvanceStage = () => {
    const nextIndex = (activeIndex + 1) % stages.length;
    onUpdateOrderStatus(order.id, stages[nextIndex].id);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      {/* Top Controls Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl bg-stone-900 border border-stone-800 text-stone-300 text-xs">
        <div className="flex items-center gap-2.5 font-medium">
          <span className="w-2.5 h-2.5 rounded-full bg-orange-500 animate-ping" />
          <span><strong>Order Progress:</strong> Live tracking status for Order #{order.id}</span>
        </div>
        <button
          id="simulate-advance-stage-btn"
          onClick={handleAdvanceStage}
          className="px-3.5 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-orange-400 border border-stone-700 font-bold text-xs shadow-xs transition flex items-center gap-1.5 cursor-pointer active:scale-95"
          title="Click to advance status"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Advance Status ({stages[(activeIndex + 1) % stages.length].label})</span>
        </button>
      </div>

      {/* Main Tracking Status Card */}
      <div className="bg-stone-900 rounded-3xl border border-stone-800 overflow-hidden shadow-xl">
        {/* Card Header */}
        <div className="p-6 sm:p-8 bg-gradient-to-r from-stone-900 via-stone-950 to-black text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-stone-800">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold uppercase tracking-wider text-orange-400">
                Live Order Tracking
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-stone-800 text-stone-300 border border-stone-700">
                #{order.id}
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold font-serif-display text-white">
              {order.restaurantName}
            </h2>
            <p className="text-xs text-stone-400 mt-1">
              Placed {new Date(order.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} • {order.items.length} items
            </p>
          </div>

          <div className="text-left sm:text-right bg-stone-950 p-3.5 rounded-2xl border border-stone-800">
            <div className="text-[11px] uppercase font-bold text-stone-400 tracking-wider">
              Estimated Delivery
            </div>
            <div className="text-xl sm:text-2xl font-black text-orange-400 font-sans flex items-center sm:justify-end gap-1.5">
              <Clock className="w-5 h-5" />
              <span>{order.status === "Delivered" ? "Completed!" : `~${order.etaMinutes || 18} Mins`}</span>
            </div>
          </div>
        </div>

        {/* 4-Stage Progress Stepper */}
        <div className="p-6 sm:p-8 border-b border-stone-800 bg-black">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 relative">
            {stages.map((stage, idx) => {
              const Icon = stage.icon;
              const isCompleted = idx < activeIndex;
              const isCurrent = idx === activeIndex;

              return (
                <div
                  key={stage.id}
                  className={`p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                    isCurrent
                      ? "bg-stone-900 border-orange-500 shadow-lg ring-1 ring-orange-500/30"
                      : isCompleted
                      ? "bg-stone-900/90 border-emerald-500/50"
                      : "bg-stone-950 border-stone-800 opacity-60"
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm ${
                        isCurrent
                          ? "bg-orange-600 text-white shadow-md animate-bounce"
                          : isCompleted
                          ? "bg-emerald-600 text-white"
                          : "bg-stone-800 text-stone-400"
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] font-bold text-stone-500">
                      0{idx + 1}
                    </span>
                  </div>

                  <div>
                    <h4 className={`text-sm font-bold leading-tight ${isCurrent ? "text-orange-400 font-extrabold" : "text-white"}`}>
                      {stage.label}
                    </h4>
                    <p className="text-[11px] text-stone-400 leading-snug mt-1">
                      {stage.subtitle}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Delivery Details & Courier Card */}
        <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-2 gap-6 bg-stone-900">
          {/* Courier Card */}
          <div className="p-5 rounded-2xl bg-stone-950 border border-stone-800 space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-stone-400">
              Assigned Courier
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-orange-950/60 border border-orange-500/30 text-orange-400 flex items-center justify-center font-bold text-lg">
                  <Bike className="w-6 h-6" />
                </div>
                <div>
                  <h5 className="font-bold text-white text-sm">
                    {order.courierName || "Alex Rivera (E-Bike #14)"}
                  </h5>
                  <p className="text-xs text-stone-400">
                    4.9 ★ Rating • 1,280+ deliveries
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-2 flex items-center gap-2">
              <button
                onClick={() => onOpenSupportWithOrder(order)}
                className="flex-1 py-2.5 px-3 rounded-xl bg-stone-900 border border-stone-800 hover:border-orange-500/50 text-xs font-semibold text-stone-300 hover:text-white transition flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Sparkles className="w-3.5 h-3.5 text-orange-400" />
                <span>Ask AI Support About Order</span>
              </button>
            </div>
          </div>

          {/* Delivery Address */}
          <div className="p-5 rounded-2xl bg-stone-950 border border-stone-800 space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-stone-400">
              Delivery Destination
            </div>
            <div className="flex items-start gap-3">
              <MapPin className="w-4 h-4 text-orange-400 mt-0.5 shrink-0" />
              <div>
                <div className="text-xs font-bold text-white">
                  {order.customerName}
                </div>
                <div className="text-xs text-stone-300 mt-0.5">
                  {order.address}
                </div>
                {order.deliveryNotes && (
                  <div className="text-[11px] text-stone-400 italic mt-2 bg-stone-900 p-2.5 rounded-lg border border-stone-800">
                    "{order.deliveryNotes}"
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Order Items Table */}
        <div className="p-6 sm:p-8 bg-stone-950 border-t border-stone-800 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-white text-sm">
              Ordered Items Summary
            </h4>
            <span className="text-xs font-bold text-orange-400">
              Total: ${order.total.toFixed(2)}
            </span>
          </div>

          <div className="divide-y divide-stone-800 bg-stone-900 rounded-2xl border border-stone-800 overflow-hidden">
            {order.items.map((item, idx) => (
              <div key={idx} className="p-4 flex items-center justify-between text-xs">
                <div>
                  <div className="font-bold text-white text-sm">
                    {item.quantity}x {item.name}
                  </div>
                  {item.customizations && (
                    <div className="text-[11px] text-stone-400 mt-0.5">
                      {Object.entries(item.customizations).map(([k, v]) => `${k}: ${v}`).join(" • ")}
                    </div>
                  )}
                </div>
                <div className="font-semibold text-orange-400 text-sm">
                  ${(item.price * item.quantity).toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
