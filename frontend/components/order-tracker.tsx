"use client";

import { useState } from "react";
import { ProgressTracker } from "@/components/progress-tracker";
import { orderTimeline, API_BASE_URL } from "@/lib/constants";

export function OrderTracker() {
  const [orderId, setOrderId] = useState("");
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderId.trim()) return;
    
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE_URL}/api/orders/${orderId}`, {
        headers: token ? { "Authorization": `Bearer ${token}` } : {}
      });
      if (res.ok) {
        const data = await res.json();
        setOrder(data);
      } else {
        // Fallback to localStorage
        const orders = JSON.parse(localStorage.getItem("orders") || "[]");
        const found = orders.find((o: any) => String(o.id) === orderId);
        if (found) {
          setOrder(found);
        } else {
          setError("Order not found. Please check your ID.");
          setOrder(null);
        }
      }
    } catch (err) {
      // Fallback to localStorage on network error
      const orders = JSON.parse(localStorage.getItem("orders") || "[]");
      const found = orders.find((o: any) => String(o.id) === orderId);
      if (found) {
        setOrder(found);
      } else {
        setError("Network error. Could not find order locally either.");
      }
    } finally {
      setLoading(false);
    }
  };

  const getStepIndex = (status: string) => {
    const steps = ["pending", "confirmed", "preparing", "ready", "delivered"];
    const idx = steps.indexOf(status.toLowerCase());
    return idx === -1 ? 0 : idx;
  };

  return (
    <div className="space-y-8">
      <form onSubmit={handleTrack} className="label grid gap-3">
        <span className="text-sm font-semibold uppercase tracking-[0.3em] text-mocha">Enter Order ID</span>
        <div className="flex gap-2">
          <input 
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
            placeholder="e.g. 1" 
            className="w-full rounded-[1.25rem] border border-cocoa/10 bg-cream px-4 py-3 outline-none" 
          />
          <button 
            type="submit"
            className="rounded-full bg-cocoa px-6 py-2 text-sm font-semibold text-cream"
            disabled={loading}
          >
            Track
          </button>
        </div>
      </form>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      {order && (
        <div className="animate-rise space-y-8">
          <div className="rounded-[2rem] bg-cream/50 p-6 border border-cocoa/5">
            <h3 className="font-semibold text-truffle">Order Summary</h3>
            <p className="text-sm text-cocoa/75 mt-1">Status: <span className="uppercase font-bold text-mocha">{order.status}</span></p>
            <p className="text-sm text-cocoa/75">Customer: {order.customerName}</p>
            <p className="text-sm text-cocoa/75">Items: {order.items.map((i: any) => i.name).join(", ")}</p>
          </div>

          <ProgressTracker steps={orderTimeline} activeStep={getStepIndex(order.status)} />

          <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="rounded-[2rem] bg-[#fff4eb] p-6 text-sm leading-7 text-cocoa/75">
              <p className="font-semibold text-truffle">Bakery Progress</p>
              <p className="mt-3">
                {order.status === "pending" && "We have received your order and will confirm it shortly."}
                {order.status === "confirmed" && "Order confirmed! Our bakers are getting ready."}
                {order.status === "preparing" && "Your cake is in the oven! Smells delicious."}
                {order.status === "ready" && "Everything is ready! Your cake is being packed for delivery."}
                {order.status === "delivered" && "Order delivered! Enjoy your sweet treats."}
              </p>
            </div>
            <div className="overflow-hidden rounded-[2rem] border border-white/60 bg-white p-4 shadow-soft">
              <iframe
                title="Delivery map"
                src="https://www.google.com/maps?q=Jaipur&output=embed"
                className="h-[260px] w-full rounded-[1.5rem] border-0"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
