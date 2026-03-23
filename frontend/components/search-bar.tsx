"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function SearchBar() {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/cakes?search=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <form 
      onSubmit={handleSearch}
      className="mt-8 flex max-w-xl items-center gap-3 rounded-full border border-white/70 bg-white/80 px-4 py-3 shadow-soft backdrop-blur"
    >
      <input
        aria-label="Search cakes"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search for chocolate truffle, wedding cake, eggless..."
        className="w-full bg-transparent text-sm text-cocoa outline-none placeholder:text-cocoa/45"
      />
      <button 
        type="submit"
        className="rounded-full bg-cocoa px-5 py-3 text-sm font-medium text-cream transition hover:bg-truffle"
      >
        Search
      </button>
    </form>
  );
}
