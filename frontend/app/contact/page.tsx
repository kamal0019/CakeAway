"use client";

import { useState } from "react";
import { BAKERY_ADDRESS } from "@/lib/constants";

export default function ContactPage() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setTimeout(() => {
      setMessage("Message sent! We will get back to you soon.");
      setLoading(false);
      (e.target as HTMLFormElement).reset();
    }, 1000);
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="grid gap-8 lg:grid-cols-2">
        <div className="rounded-[2.5rem] border border-white/60 bg-white/80 p-8 shadow-soft backdrop-blur-sm">
          <p className="text-sm uppercase tracking-[0.35em] text-mocha">Contact Us</p>
          <h1 className="mt-4 font-display text-5xl text-truffle">We would love to bake for you</h1>
          <div className="mt-8 space-y-5 text-base leading-8 text-cocoa/75">
            <p>Bakery address: {BAKERY_ADDRESS}</p>
            <p>Phone: +91 98765 43210</p>
            <p>Email: hello@cakeaway.com</p>
            <p>WhatsApp: +91 98765 43210</p>
          </div>

          <form onSubmit={handleSubmit} className="mt-10 space-y-4">
            <input 
              name="name" 
              placeholder="Your Name" 
              required 
              className="w-full rounded-[1.25rem] border border-cocoa/10 bg-cream px-4 py-3 outline-none" 
            />
            <input 
              name="email" 
              type="email" 
              placeholder="Email" 
              required 
              className="w-full rounded-[1.25rem] border border-cocoa/10 bg-cream px-4 py-3 outline-none" 
            />
            <textarea 
              name="message" 
              placeholder="Your Message" 
              required 
              rows={4} 
              className="w-full rounded-[1.25rem] border border-cocoa/10 bg-cream px-4 py-3 outline-none" 
            />
            <button 
              type="submit" 
              disabled={loading}
              className="w-full rounded-full bg-cocoa px-6 py-4 text-sm font-semibold uppercase tracking-[0.25em] text-cream transition hover:bg-truffle disabled:opacity-50"
            >
              {loading ? "Sending..." : "Send Message"}
            </button>
            {message && <p className="mt-4 text-center text-sm font-semibold text-green-600 animate-rise">{message}</p>}
          </form>
        </div>

        <div className="overflow-hidden rounded-[2.5rem] border border-white/60 bg-white/80 p-4 shadow-soft backdrop-blur-sm">
          <iframe
            title="Bakery map"
            src={`https://www.google.com/maps?q=${encodeURIComponent(BAKERY_ADDRESS)}&output=embed`}
            className="h-full min-h-[420px] w-full rounded-[2rem] border-0"
            loading="lazy"
          />
        </div>
      </div>
    </div>
  );
}
