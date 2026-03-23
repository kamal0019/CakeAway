"use client";

import { useState } from "react";

export default function CustomCakePage() {
  const [shape, setShape] = useState("Round");
  const [flavour, setFlavour] = useState("Chocolate");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setTimeout(() => {
      setMessage(`Quote requested for a ${shape} ${flavour} cake! We will contact you soon.`);
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">
        <div className="rounded-[2.5rem] border border-white/60 bg-white/80 p-8 shadow-soft backdrop-blur-sm">
          <p className="text-sm uppercase tracking-[0.35em] text-mocha">Custom Cake Builder</p>
          <h1 className="mt-4 font-display text-5xl text-truffle">Design your dream cake</h1>
          <p className="mt-4 text-base leading-8 text-cocoa/75">
            Configure cake shape, flavour, colour, custom text and photo cake options with a polished luxury UI.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 rounded-[2.5rem] border border-white/60 bg-white/80 p-8 shadow-soft backdrop-blur-sm">
          <div className="grid gap-6">
            <div>
              <p className="mb-4 text-sm font-semibold uppercase tracking-[0.3em] text-mocha">Cake Shape</p>
              <div className="flex flex-wrap gap-2">
                {["Round", "Heart", "Tiered", "Bento"].map((s) => (
                  <button 
                    key={s} 
                    type="button"
                    onClick={() => setShape(s)}
                    className={`rounded-xl border border-cocoa/10 px-4 py-2 text-sm transition ${shape === s ? 'bg-cocoa text-white' : 'bg-cream text-cocoa hover:bg-cocoa/10'}`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="mb-4 text-sm font-semibold uppercase tracking-[0.3em] text-mocha">Flavour</p>
              <div className="flex flex-wrap gap-2">
                {["Chocolate", "Vanilla", "Red Velvet", "Fruit Blend"].map((f) => (
                  <button 
                    key={f} 
                    type="button"
                    onClick={() => setFlavour(f)}
                    className={`rounded-xl border border-cocoa/10 px-4 py-2 text-sm transition ${flavour === f ? 'bg-cocoa text-white' : 'bg-cream text-cocoa hover:bg-cocoa/10'}`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            <label className="grid gap-3">
              <span className="text-sm font-semibold uppercase tracking-[0.3em] text-mocha">Custom Text</span>
              <input
                placeholder="Happy Anniversary Aditi & Arjun"
                className="rounded-[1.25rem] border border-cocoa/10 bg-cream px-4 py-4 outline-none placeholder:text-cocoa/30"
              />
            </label>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="grid gap-3">
                <span className="text-sm font-semibold uppercase tracking-[0.3em] text-mocha">Theme Color</span>
                <input
                  placeholder="e.g. Lavender & Gold"
                  className="rounded-[1.25rem] border border-cocoa/10 bg-cream px-4 py-3 outline-none"
                />
              </label>
              <label className="grid gap-3">
                <span className="text-sm font-semibold uppercase tracking-[0.3em] text-mocha">Approx. Weight</span>
                <input
                  placeholder="e.g. 1.5kg"
                  className="rounded-[1.25rem] border border-cocoa/10 bg-cream px-4 py-3 outline-none"
                />
              </label>
            </div>
          </div>
          
          <button 
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-cocoa px-6 py-4 text-sm font-semibold uppercase tracking-[0.25em] text-cream transition hover:bg-truffle shadow-soft disabled:opacity-50"
          >
            {loading ? "Sending Request..." : "Request Custom Quote"}
          </button>
          {message && <p className="mt-4 text-center text-sm font-semibold text-green-600 animate-rise">{message}</p>}
        </form>
      </div>
    </div>
  );
}
