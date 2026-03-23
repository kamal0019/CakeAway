"use client";

import { useState } from "react";
import { API_BASE_URL } from "@/lib/constants";

interface ReviewFormProps {
  cakeSlug: string;
  onSuccess: () => void;
}

export function ReviewForm({ cakeSlug, onSuccess }: ReviewFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    rating: 5,
    text: ""
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch(`${API_BASE_URL}/api/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          cakeSlug,
          date: new Date().toISOString()
        })
      });

      if (res.ok) {
        setMessage("Thank you for your review!");
        setFormData({ name: "", rating: 5, text: "" });
        onSuccess();
      } else {
        const data = await res.json();
        setMessage(data.error || "Failed to submit review");
      }
    } catch (error) {
      setMessage("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-[2rem] border border-white/60 bg-white/80 p-8 shadow-soft backdrop-blur-sm">
      <h3 className="font-display text-3xl text-truffle">Share your experience</h3>
      <p className="mt-2 text-sm text-cocoa/75">Your feedback helps us bake better!</p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-[0.2em] text-mocha mb-2">Your Name</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
            className="w-full rounded-xl border border-cocoa/10 bg-cream/50 px-4 py-3 text-sm outline-none focus:border-mocha"
            placeholder="Alex Johnson"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-[0.2em] text-mocha mb-2">Rating</label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setFormData({ ...formData, rating: star })}
                className={`flex h-10 w-10 items-center justify-center rounded-full text-lg transition ${
                  formData.rating >= star ? "bg-gold text-white" : "bg-cream text-cocoa/40"
                }`}
              >
                ★
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-[0.2em] text-mocha mb-2">Your Review</label>
          <textarea
            value={formData.text}
            onChange={(e) => setFormData({ ...formData, text: e.target.value })}
            required
            rows={4}
            className="w-full rounded-xl border border-cocoa/10 bg-cream/50 px-4 py-3 text-sm outline-none focus:border-mocha"
            placeholder="Tell us about the taste, texture and delivery..."
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-full bg-truffle py-4 text-sm font-semibold uppercase tracking-[0.2em] text-cream transition hover:bg-cocoa disabled:opacity-50"
        >
          {loading ? "Submitting..." : "Submit Review"}
        </button>

        {message && (
          <p className={`text-center text-sm ${message.includes("Thank") ? "text-green-600" : "text-red-600"}`}>
            {message}
          </p>
        )}
      </form>
    </div>
  );
}
