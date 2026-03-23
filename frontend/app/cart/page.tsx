"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function CartPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [coupon, setCoupon] = useState("");
  const [discount, setDiscount] = useState(0);
  const [couponError, setCouponError] = useState("");

  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    setItems(cart);
    setLoading(false);
  }, []);

  const updateQuantity = (slug: string, delta: number) => {
    const newItems = items.map(item => {
      if (item.slug === slug) {
        return { ...item, quantity: Math.max(1, item.quantity + delta) };
      }
      return item;
    });
    setItems(newItems);
    localStorage.setItem("cart", JSON.stringify(newItems));
    window.dispatchEvent(new Event("cartUpdated"));
  };

  const removeItem = (slug: string) => {
    const newItems = items.filter(item => item.slug !== slug);
    setItems(newItems);
    localStorage.setItem("cart", JSON.stringify(newItems));
    window.dispatchEvent(new Event("cartUpdated"));
  };

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const applyCoupon = () => {
    setCouponError("");
    if (coupon.toUpperCase() === "CAKE10") {
      setDiscount(subtotal * 0.1);
    } else if (coupon.toUpperCase() === "BIRTHDAY20") {
      setDiscount(subtotal * 0.2);
    } else {
      setDiscount(0);
      setCouponError("Invalid coupon code");
    }
  };

  const total = subtotal - discount;

  if (loading) return <div className="p-20 text-center">Loading cart...</div>;
  
  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-24 text-center">
        <h1 className="font-display text-5xl text-truffle">Your cart is empty</h1>
        <p className="mt-4 text-cocoa/70">Looks like you haven't added any cakes yet.</p>
        <Link href="/cakes" className="mt-8 inline-block rounded-full bg-cocoa px-8 py-3 text-cream">
          Browse Cakes
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-[2.5rem] border border-white/60 bg-white/80 p-8 shadow-soft backdrop-blur-sm">
          <p className="text-sm uppercase tracking-[0.35em] text-mocha">Cart</p>
          <h1 className="mt-4 font-display text-5xl text-truffle">Your selected cakes</h1>
          <div className="mt-8 space-y-5">
            {items.map((item) => (
              <div key={item.slug} className="flex flex-wrap items-center justify-between gap-4 rounded-[1.75rem] bg-cream p-5">
                <div>
                  <p className="font-display text-3xl text-truffle">{item.name}</p>
                  <p className="text-sm text-cocoa/70">Qty: {item.quantity}</p>
                </div>
                <div className="flex items-center gap-3">
                  <button onClick={() => updateQuantity(item.slug, -1)} className="rounded-full bg-white px-3 py-2 text-cocoa">-</button>
                  <button onClick={() => updateQuantity(item.slug, 1)} className="rounded-full bg-white px-3 py-2 text-cocoa">+</button>
                  <button onClick={() => removeItem(item.slug)} className="rounded-full border border-cocoa/10 px-4 py-2 text-sm text-cocoa/70">Remove</button>
                  <p className="font-semibold text-cocoa">Rs.{item.price * item.quantity}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6 rounded-[2.5rem] border border-white/60 bg-white/80 p-8 shadow-soft backdrop-blur-sm">
          <h2 className="font-display text-4xl text-truffle">Order Summary</h2>
          <label className="grid gap-3">
            <span className="text-sm font-semibold uppercase tracking-[0.3em] text-mocha">Apply Coupon</span>
            <div className="flex gap-2">
              <input
                placeholder="CAKE10 or BIRTHDAY20"
                value={coupon}
                onChange={(e) => setCoupon(e.target.value)}
                className="w-full rounded-[1.25rem] border border-cocoa/10 bg-cream px-4 py-3 outline-none"
              />
              <button 
                onClick={applyCoupon}
                className="rounded-full bg-truffle px-6 py-2 text-sm text-white"
              >
                Apply
              </button>
            </div>
            {couponError && <p className="text-xs text-red-500">{couponError}</p>}
          </label>
          <div className="rounded-[1.75rem] bg-[#fff4eb] p-5 text-sm leading-7 text-cocoa/75">
            Available coupons: CAKE10, BIRTHDAY20
          </div>
          <div className="space-y-2 divider-y border-cocoa/5">
            <div className="flex items-center justify-between text-sm text-cocoa/70">
              <span>Subtotal</span>
              <span>Rs.{subtotal}</span>
            </div>
            {discount > 0 && (
              <div className="flex items-center justify-between text-sm text-green-600 font-semibold">
                <span>Discount</span>
                <span>-Rs.{Math.round(discount)}</span>
              </div>
            )}
            <div className="flex items-center justify-between text-lg text-cocoa pt-2 border-t border-cocoa/5">
              <span>Total</span>
              <span className="font-semibold">Rs.{Math.round(total)}</span>
            </div>
          </div>
          <Link
            href="/checkout"
            className="inline-flex w-full justify-center rounded-full bg-cocoa px-6 py-3 text-sm font-semibold uppercase tracking-[0.25em] text-cream transition hover:bg-truffle"
          >
            Proceed to Checkout
          </Link>
        </div>
      </div>
    </div>
  );
}
