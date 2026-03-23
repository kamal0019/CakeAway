"use client";

import { useState } from "react";
import { API_BASE_URL } from "@/lib/constants";

interface OrderFormProps {
  cake: any;
}

export function OrderForm({ cake }: OrderFormProps) {
  const [formData, setFormData] = useState({
    customerName: "",
    customerEmail: "",
    customMessage: "Happy Birthday Rahul",
    deliveryDate: "",
    deliveryTime: "",
    address: ""
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const orderData = {
        id: Date.now(),
        customerName: formData.customerName,
        customerEmail: formData.customerEmail,
        items: [{ name: cake.name, price: cake.price, quantity: 1, slug: cake.slug }],
        total: cake.price,
        deliveryDate: formData.deliveryDate,
        deliveryTime: formData.deliveryTime,
        customMessage: formData.customMessage,
        address: formData.address,
        status: "pending",
        createdAt: new Date().toISOString()
      };

      // Save to localStorage
      const orders = JSON.parse(localStorage.getItem("orders") || "[]");
      orders.push(orderData);
      localStorage.setItem("orders", JSON.stringify(orders));

      // Clear cart if this was intended to be the only item, or just place the order
      // For simplicity, we'll just treat this as a standalone order.

      try {
        await fetch(`${API_BASE_URL}/api/orders`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(orderData)
        });
      } catch (e) {
        console.log("Backend not available, order saved locally.");
      }

      setMessage("Order placed successfully!");
      setFormData({
        customerName: "",
        customerEmail: "",
        customMessage: "Happy Birthday Rahul",
        deliveryDate: "",
        deliveryTime: "",
        address: ""
      });
    } catch (error) {
      setMessage("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="grid gap-3">
          <span className="text-sm font-semibold uppercase tracking-[0.3em] text-mocha">Name</span>
          <input
            type="text"
            name="customerName"
            value={formData.customerName}
            onChange={handleChange}
            required
            className="rounded-[1.25rem] border border-cocoa/10 bg-cream px-4 py-3 outline-none"
          />
        </label>
        <label className="grid gap-3">
          <span className="text-sm font-semibold uppercase tracking-[0.3em] text-mocha">Email</span>
          <input
            type="email"
            name="customerEmail"
            value={formData.customerEmail}
            onChange={handleChange}
            required
            className="rounded-[1.25rem] border border-cocoa/10 bg-cream px-4 py-3 outline-none"
          />
        </label>
      </div>

      <label className="grid gap-3">
        <span className="text-sm font-semibold uppercase tracking-[0.3em] text-mocha">Custom Message</span>
        <textarea
          name="customMessage"
          value={formData.customMessage}
          onChange={handleChange}
          className="rounded-[1.25rem] border border-cocoa/10 bg-cream px-4 py-3 outline-none"
          rows={3}
        />
      </label>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="grid gap-3">
          <span className="text-sm font-semibold uppercase tracking-[0.3em] text-mocha">Delivery Date</span>
          <input
            type="date"
            name="deliveryDate"
            value={formData.deliveryDate}
            onChange={handleChange}
            required
            className="rounded-[1.25rem] border border-cocoa/10 bg-cream px-4 py-3 outline-none"
          />
        </label>
        <label className="grid gap-3">
          <span className="text-sm font-semibold uppercase tracking-[0.3em] text-mocha">Delivery Time</span>
          <input
            type="time"
            name="deliveryTime"
            value={formData.deliveryTime}
            onChange={handleChange}
            required
            className="rounded-[1.25rem] border border-cocoa/10 bg-cream px-4 py-3 outline-none"
          />
        </label>
      </div>

      <label className="grid gap-3">
        <span className="text-sm font-semibold uppercase tracking-[0.3em] text-mocha">Delivery Address</span>
        <textarea
          name="address"
          value={formData.address}
          onChange={handleChange}
          required
          className="rounded-[1.25rem] border border-cocoa/10 bg-cream px-4 py-3 outline-none"
          rows={3}
          placeholder="Enter your delivery address"
        />
      </label>

      <div className="rounded-[1.5rem] bg-[#fff4eb] p-5 text-sm leading-7 text-cocoa/75">
        Push notification preview: Your cake is ready [{cake.name}]
        <br />
        WhatsApp confirmation: Order confirmed for {cake.name}, arriving at {formData.deliveryTime || "6:30 PM"}.
      </div>

      <div className="flex items-center justify-between">
        <p className="font-display text-4xl text-truffle">Rs.{cake.price}</p>
        <button
          type="submit"
          disabled={loading}
          className="rounded-full bg-cocoa px-6 py-3 text-sm font-semibold uppercase tracking-[0.25em] text-cream transition hover:bg-truffle disabled:opacity-50"
        >
          {loading ? "Placing Order..." : "Place Order"}
        </button>
      </div>

      {message && (
        <p className={`text-sm ${message.includes("success") ? "text-green-600" : "text-red-600"}`}>
          {message}
        </p>
      )}
    </form>
  );
}