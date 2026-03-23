"use client";

import Image from "next/image";
import Link from "next/link";
import { Cake } from "@/lib/data";

type ProductCardProps = {
  cake: Cake;
};

const getImageUrl = (image: string) => {
  if (!image) return "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=600&q=80";
  if (image.startsWith('http')) return image;
  return `https://images.unsplash.com/${image}?auto=format&fit=crop&w=1200&q=80`;
};

export function ProductCard({ cake }: ProductCardProps) {
  const addToCart = () => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const existing = cart.find((item: any) => item.slug === cake.slug);
    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({ ...cake, quantity: 1 });
    }
    localStorage.setItem("cart", JSON.stringify(cart));
    window.dispatchEvent(new Event("cartUpdated"));
    alert(`${cake.name} added to cart!`);
  };

  return (
    <div className="group rounded-[1.5rem] border border-white/60 bg-white/80 p-3 shadow-soft backdrop-blur-sm transition duration-500 hover:-translate-y-2 hover:shadow-glow">
      <Link href={`/cakes/${cake.slug}`} className="block">
        <div className="relative h-40 overflow-hidden rounded-[1rem]">
          <Image
            src={getImageUrl(cake.image)}
            alt={cake.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition duration-700 group-hover:scale-105"
          />
          {cake.badge ? (
            <span className="absolute left-4 top-4 rounded-full bg-white/85 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-cocoa">
              {cake.badge}
            </span>
          ) : null}
        </div>
      </Link>

      <div className="space-y-4 px-2 pb-2 pt-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-mocha">{cake.flavour}</p>
            <Link href={`/cakes/${cake.slug}`} className="mt-1 block font-display text-xl text-truffle">
              {cake.name}
            </Link>
          </div>
          <p className="text-base font-semibold text-cocoa">Rs.{cake.price}</p>
        </div>

        <div className="flex items-center justify-between text-sm text-cocoa/75">
          <p>{cake.rating}/5 rating</p>
          <p>500g / 1kg / 2kg</p>
        </div>

        <div className="flex items-center justify-between gap-3">
          <p className="rounded-full bg-blush/60 px-3 py-2 text-xs font-medium text-cocoa">
            {cake.type} cake
          </p>
          <button 
            onClick={addToCart}
            className="rounded-full bg-cocoa px-4 py-2 text-sm font-medium text-cream transition hover:bg-truffle"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
