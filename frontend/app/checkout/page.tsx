"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { API_BASE_URL } from "@/lib/constants";

export default function CheckoutPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    customerName: "",
    customerEmail: "",
    address: "",
    phone: "",
    deliveryDate: "",
    deliveryTime: "18:00 - 19:00",
    paymentMethod: "UPI"
  });

  useState(() => {
    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const user = JSON.parse(storedUser);
        setFormData(prev => ({
          ...prev,
          customerName: user.name || "",
          customerEmail: user.email || ""
        }));
      }
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const cart = JSON.parse(localStorage.getItem("cart") || "[]");
      const subtotal = cart.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0);
      
      const newOrder = {
        id: Date.now(),
        ...formData,
        items: cart,
        total: subtotal,
        status: "pending",
        createdAt: new Date().toISOString()
      };

      // Save to localStorage
      const orders = JSON.parse(localStorage.getItem("orders") || "[]");
      orders.push(newOrder);
      localStorage.setItem("orders", JSON.stringify(orders));

      // Clear cart
      localStorage.removeItem("cart");
      window.dispatchEvent(new Event("cartUpdated"));

      // API call (with token if available)
      try {
        const token = localStorage.getItem("token");
        await fetch(`${API_BASE_URL}/api/orders`, {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
            ...(token ? { "Authorization": `Bearer ${token}` } : {})
          },
          body: JSON.stringify(newOrder)
        });
      } catch (e) {
        console.log("Backend not available, order saved locally.");
      }

      alert("Order placed successfully!");
      router.push("/track-order");
    } catch (error) {
      console.error("Checkout error:", error);
      alert("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="grid gap-8 lg:grid-cols-2">
        <form onSubmit={handleSubmit} className="space-y-6 rounded-[2.5rem] border border-white/60 bg-white/80 p-8 shadow-soft backdrop-blur-sm">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-mocha">Checkout</p>
            <h1 className="mt-4 font-display text-5xl text-truffle">Delivery information</h1>
          </div>

          <label className="grid gap-3">
            <span className="text-sm font-semibold uppercase tracking-[0.3em] text-mocha">Customer Name</span>
            <input 
              value={formData.customerName}
              onChange={(e) => setFormData({...formData, customerName: e.target.value})}
              className="rounded-[1.25rem] border border-cocoa/10 bg-cream px-4 py-3 outline-none" 
              required
            />
          </label>

          <label className="grid gap-3">
            <span className="text-sm font-semibold uppercase tracking-[0.3em] text-mocha">Email Address</span>
            <input 
              type="email"
              value={formData.customerEmail}
              onChange={(e) => setFormData({...formData, customerEmail: e.target.value})}
              className="rounded-[1.25rem] border border-cocoa/10 bg-cream px-4 py-3 outline-none" 
              required
            />
          </label>

          <label className="grid gap-3">
            <span className="text-sm font-semibold uppercase tracking-[0.3em] text-mocha">Delivery Address</span>
            <input 
              value={formData.address}
              onChange={(e) => setFormData({...formData, address: e.target.value})}
              className="rounded-[1.25rem] border border-cocoa/10 bg-cream px-4 py-3 outline-none" 
              required
            />
          </label>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="grid gap-3">
              <span className="text-sm font-semibold uppercase tracking-[0.3em] text-mocha">Phone</span>
              <input 
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                className="rounded-[1.25rem] border border-cocoa/10 bg-cream px-4 py-3 outline-none" 
                required
              />
            </label>
            <label className="grid gap-3">
              <span className="text-sm font-semibold uppercase tracking-[0.3em] text-mocha">Delivery Date</span>
              <input 
                type="date"
                value={formData.deliveryDate}
                onChange={(e) => setFormData({...formData, deliveryDate: e.target.value})}
                className="rounded-[1.25rem] border border-cocoa/10 bg-cream px-4 py-3 outline-none" 
                required
              />
            </label>
          </div>
        </form>

        <div className="space-y-6 rounded-[2.5rem] border border-white/60 bg-white/80 p-8 shadow-soft backdrop-blur-sm">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-mocha">Payment Methods</p>
            <h2 className="mt-4 font-display text-5xl text-truffle">Choose how to pay</h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {["UPI", "Card", "Net Banking", "Cash on delivery"].map((method) => (
              <button
                key={method}
                type="button"
                onClick={() => setFormData({...formData, paymentMethod: method})}
                className={`rounded-[1.75rem] p-5 text-left text-sm font-semibold transition ${
                  formData.paymentMethod === method ? "bg-cocoa text-cream shadow-glow" : "bg-cream text-cocoa hover:bg-cocoa/5"
                }`}
              >
                {method}
              </button>
            ))}
          </div>

          <div className="rounded-[1.75rem] bg-[#fff4eb] p-5 text-sm leading-7 text-cocoa/75">
            Order confirmation is sent via WhatsApp after payment, and delivery updates are available in Track Order.
          </div>

          <button 
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className="w-full rounded-full bg-cocoa px-6 py-4 text-sm font-semibold uppercase tracking-[0.25em] text-cream transition hover:bg-truffle disabled:opacity-50"
          >
            {loading ? "Placing Order..." : "Place Order"}
          </button>
        </div>
      </div>
    </div>
  );
}
