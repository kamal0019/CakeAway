"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { navLinks, BAKERY_ADDRESS } from "@/lib/constants";

export function Footer() {
  const pathname = usePathname();
  if (pathname?.startsWith("/auth")) return null;

  return (
    <footer className="mt-24 border-t border-cocoa/10 bg-[#f8ede6]">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1.2fr_0.8fr_1fr] lg:px-8">
        <div>
          <p className="font-display text-3xl text-truffle">Cake Away</p>
          <p className="mt-3 max-w-md text-sm leading-7 text-cocoa/75">
            Luxury cakes for birthdays, weddings and everyday celebrations, crafted with warm flavours and modern artistry.
          </p>
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-mocha">Pages</p>
          <div className="mt-4 flex flex-col gap-3 text-sm text-cocoa/80">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} className="hover:text-truffle">
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-mocha">Visit</p>
          <div className="mt-4 space-y-3 text-sm text-cocoa/80">
            <p>{BAKERY_ADDRESS}</p>
            <p>+91 98765 43210</p>
            <p>hello@cakeaway.com</p>
          </div>
        </div>
      </div>
      <div className="mx-auto max-w-7xl px-4 pb-8 sm:px-6 lg:px-8">
        <div className="border-t border-truffle/5 pt-8 text-center">
          <p className="text-[10px] uppercase tracking-[0.2em] text-mocha/50">
            @2026 all rigth reserve to YugSoft-Tech
          </p>
        </div>
      </div>
    </footer>
  );
}
