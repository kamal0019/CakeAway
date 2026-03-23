"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";

export function FilterSidebar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");

  useEffect(() => {
    setQueryFromURL();
  }, [searchParams]);

  const setQueryFromURL = () => {
    const s = searchParams.get("search");
    if (s !== searchQuery) setSearchQuery(s || "");
  };

  const handleSearch = (val: string) => {
    setSearchQuery(val);
    const params = new URLSearchParams(searchParams.toString());
    if (val) {
      params.set("search", val);
    } else {
      params.delete("search");
    }
    router.push(`/cakes?${params.toString()}`);
  };

  const sections = [
    { title: "Price Range", items: ["Under Rs.1000", "Rs.1000 - Rs.2000", "Rs.2000+"] },
    { title: "Flavour", items: ["Chocolate", "Vanilla", "Red Velvet", "Fruit", "Pistachio"] },
    { title: "Weight", items: ["500g", "1kg", "2kg"] },
    { title: "Type", items: ["Egg", "Eggless"] }
  ];

  return (
    <aside className="rounded-[2rem] border border-white/60 bg-white/80 p-6 shadow-soft backdrop-blur-sm">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="font-display text-2xl text-truffle">Filters</h3>
        <button 
          onClick={() => handleSearch("")}
          className="text-sm text-cocoa/60"
        >
          Reset
        </button>
      </div>

      <div className="mb-8">
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-mocha">
          Search
        </p>
        <div className="relative">
          <input
            type="text"
            placeholder="Search cakes..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full rounded-xl border border-cocoa/10 bg-white/50 p-3 text-sm focus:border-cocoa/30 focus:outline-none"
          />
        </div>
      </div>

      <div className="space-y-6">
        {sections.map((section) => (
          <div key={section.title}>
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-mocha">
              {section.title}
            </p>
            <div className="space-y-3 text-sm text-cocoa/80">
              {section.items.map((item) => (
                <label key={item} className="flex items-center gap-3">
                  <input type="checkbox" className="h-4 w-4 rounded border-cocoa/30 text-cocoa" />
                  <span>{item}</span>
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
}
