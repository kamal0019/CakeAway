"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { API_BASE_URL } from "@/lib/constants";

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (res.ok) {
        // Store user and token in localStorage
        localStorage.setItem("user", JSON.stringify(data.user));
        localStorage.setItem("token", data.token);
        setMessage("Login successful!");
        window.dispatchEvent(new Event("userUpdated")); // Help header update
        router.push("/account");
      } else {
        setMessage(data.error || "Login failed");
      }
    } catch (error) {
      setMessage("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="flex min-h-screen">
      {/* Left Column: Branding Section */}
      <div className="relative hidden w-0 lg:block lg:w-1/2">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1535254973040-607b474cb50d?auto=format&fit=crop&w=1400&q=80"
            alt="Bakery Branding"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-truffle/40 backdrop-blur-[2px]" />
        </div>
        <div className="relative flex h-full items-center justify-center p-12 text-center text-cream">
          <div className="max-w-md animate-rise">
            <span className="text-xs font-bold uppercase tracking-[0.4em] text-gold">Premium Bakery</span>
            <h2 className="mt-4 font-display text-7xl lg:text-8xl">Cake Away</h2>
            <div className="mx-auto mt-6 h-px w-24 bg-gold" />
            <p className="mt-8 text-lg font-light leading-8 tracking-wide text-cream/90">
              Freshly baked memories, crafted with modern artistry and delivered to your doorstep.
            </p>
            <div className="mt-12 flex justify-center gap-8 text-sm font-bold uppercase tracking-[0.2em] text-gold">
              <span>Est. 2018</span>
              <span>•</span>
              <span>Jaipur</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column: Login Form */}
      <div className="flex w-full flex-col justify-center px-4 py-12 sm:px-6 lg:w-1/2 lg:px-20 xl:px-24 bg-cream/10">
        <div className="mx-auto w-full max-w-sm lg:w-[28rem] rounded-[3rem] border border-white/60 bg-white/20 p-8 sm:p-12 shadow-glow backdrop-blur-[40px] animate-rise">
          <div className="text-center lg:text-left">
            <h1 className="font-display text-4xl text-truffle">Welcome Back</h1>
            <p className="mt-3 text-cocoa/75">Sign in to your Cake Away account</p>
          </div>

          <div className="mt-10">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-[0.2em] text-mocha">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full rounded-none border-b border-cocoa/20 bg-transparent py-3 text-cocoa outline-none transition focus:border-truffle"
                  placeholder="your@email.com"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-[0.2em] text-mocha">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full rounded-none border-b border-cocoa/20 bg-transparent py-3 text-cocoa outline-none transition focus:border-truffle"
                  placeholder="Your password"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="mt-4 w-full rounded-full bg-truffle px-6 py-4 text-xs font-bold uppercase tracking-[0.3em] text-cream transition hover:bg-cocoa disabled:opacity-50"
              >
                {loading ? "Signing In..." : "Sign In"}
              </button>
            </form>

            {message && (
              <p className={`mt-6 text-center text-sm font-medium ${message.includes("successful") ? "text-green-600" : "text-red-500"}`}>
                {message}
              </p>
            )}

            <div className="mt-10 text-center text-sm">
              <span className="text-cocoa/60">Don't have an account? </span>
              <Link href="/auth/signup" className="font-semibold text-truffle hover:underline">
                Sign up
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}