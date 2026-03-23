"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { navLinks } from "@/lib/constants";

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  const updateCartCount = () => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const count = cart.reduce((sum: number, item: any) => sum + item.quantity, 0);
    setCartCount(count);
  };

  const updateUserState = () => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      setUser(null);
    }
  };

  useEffect(() => {
    updateUserState();
    updateCartCount();
    
    window.addEventListener("cartUpdated", updateCartCount);
    window.addEventListener("userUpdated", updateUserState);
    return () => {
      window.removeEventListener("cartUpdated", updateCartCount);
      window.removeEventListener("userUpdated", updateUserState);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    setIsDropdownOpen(false);
    router.push("/");
  };

  if (pathname?.startsWith("/auth")) return null;

  return (
    <header className="sticky top-0 z-50 border-b border-white/40 bg-cream/70 backdrop-blur-2xl">
      <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group transition-transform hover:scale-[1.02]">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-truffle text-sm font-bold text-cream shadow-soft group-hover:bg-cocoa">
              CA
            </div>
            <div className="flex flex-col">
              <p className="font-display text-base sm:text-lg tracking-tight text-truffle">Cake Away</p>
              <p className="text-[8px] sm:text-[10px] uppercase tracking-[0.2em] sm:tracking-[0.4em] text-mocha/60 -mt-0.5 sm:-mt-1">Freshly Baked Happiness</p>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-8 text-[13px] font-semibold uppercase tracking-widest text-cocoa/70">
            {navLinks.slice(0, 3).map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`transition-colors hover:text-truffle ${active ? "text-truffle" : ""}`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* User Actions */}
          <div className="flex items-center gap-4">
            <Link
              href="/cart"
              className="group relative flex h-10 w-10 items-center justify-center rounded-full bg-white/50 border border-truffle/10 transition hover:bg-white"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-cocoa/80 group-hover:text-truffle"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-truffle text-[10px] text-white animate-pulse">
                  {cartCount}
                </span>
              )}
            </Link>

            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex h-10 items-center gap-2 rounded-full border border-truffle/10 bg-white/60 px-3 py-1 transition hover:bg-white"
                >
                  <div className="h-7 w-7 rounded-full bg-mocha/20 flex items-center justify-center overflow-hidden">
                     <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-mocha"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                  </div>
                  <span className="hidden sm:block text-xs font-bold text-truffle">{user.name.split(' ')[0]}</span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`}><path d="m6 9 6 6 6-6"/></svg>
                </button>

                {isDropdownOpen && (
                  <div className="absolute right-0 mt-3 w-48 origin-top-right rounded-2xl border border-white/60 bg-white/90 p-2 shadow-glow backdrop-blur-xl animate-rise">
                    <Link
                      href="/account"
                      onClick={() => setIsDropdownOpen(false)}
                      className="block px-4 py-2 text-xs font-semibold text-cocoa hover:bg-cream hover:text-truffle rounded-xl transition"
                    >
                      My Dashboard
                    </Link>
                    {user.email === 'admin@cakeaway.com' && (
                      <Link
                        href="/admin"
                        onClick={() => setIsDropdownOpen(false)}
                        className="block px-4 py-2 text-xs font-semibold text-cocoa hover:bg-cream hover:text-truffle rounded-xl transition"
                      >
                        Admin Panel
                      </Link>
                    )}
                    <Link
                      href="/track-order"
                      onClick={() => setIsDropdownOpen(false)}
                      className="block px-4 py-2 text-xs font-semibold text-cocoa hover:bg-cream hover:text-truffle rounded-xl transition"
                    >
                      Track Order
                    </Link>
                    <hr className="my-1 border-truffle/5" />
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 rounded-xl transition"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/auth/login"
                className="hidden sm:flex h-10 items-center rounded-full bg-truffle px-6 text-[11px] font-bold uppercase tracking-widest text-cream transition hover:bg-cocoa shadow-soft"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>

        {/* Mobile Mini Nav */}
        <div className="relative mt-4 lg:hidden">
          <div className="pointer-events-none absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-cream/50 to-transparent z-10" />
          <nav className="flex gap-2 overflow-x-auto pb-2 no-scrollbar px-2">
            {navLinks.map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`whitespace-nowrap rounded-full px-5 py-2.5 text-[10px] font-bold uppercase tracking-widest transition-all ${
                    active ? "bg-truffle text-white shadow-soft" : "bg-white/50 text-cocoa/70 hover:bg-white/80"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
          <div className="pointer-events-none absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-cream/50 to-transparent z-10" />
        </div>
      </div>
    </header>
  );
}
