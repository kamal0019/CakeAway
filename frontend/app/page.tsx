import Link from "next/link";
import Image from "next/image";
import { SearchBar } from "@/components/search-bar";

export const dynamic = 'force-dynamic';
export const revalidate = 0;
import { SectionHeading } from "@/components/section-heading";
import { CategoryCard } from "@/components/category-card";
import { ProductCard } from "@/components/product-card";
import { ReviewCard } from "@/components/review-card";
import { testimonials as fallbackReviews, API_BASE_URL, BAKERY_ADDRESS } from "@/lib/constants";

async function getReviews() {
  try {
    const res = await fetch(`${API_BASE_URL}/api/reviews`, { next: { revalidate: 0 } });
    if (!res.ok) return fallbackReviews;
    const data = await res.json();
    const reviews = Array.isArray(data) ? data : (data.reviews || []);
    return reviews.length > 0 ? reviews : fallbackReviews;
  } catch (error) {
    console.error("Home: Failed to fetch reviews:", error);
    return fallbackReviews;
  }
}

async function getCakes() {
  try {
    const res = await fetch(`${API_BASE_URL}/api/cakes`, { next: { revalidate: 0 } });
    if (!res.ok) return [];
    const data = await res.json();
    console.log("Home: Fetched cakes count:", (data.cakes || []).length);
    return data.cakes || [];
  } catch (error) {
    console.error("Home: Failed to fetch cakes:", error);
    return [];
  }
}

async function getCategories() {
  try {
    const res = await fetch(`${API_BASE_URL}/api/categories`, { next: { revalidate: 0 } });
    if (!res.ok) return [];
    const data = await res.json();
    console.log("Home: Fetched categories count:", (data.categories || []).length);
    return data.categories || [];
  } catch (error) {
    console.error("Home: Failed to fetch categories:", error);
    return [];
  }
}

export default async function HomePage() {
  const reviews = await getReviews();
  const dynamicCategories = await getCategories();
  const allCakes = await getCakes();
  
  const featuredCakes = allCakes.slice(0, 4);
  const bestSellingCakes = allCakes.slice(0, 6);

  return (
    <div className="overflow-hidden">
      <section className="relative isolate">
        <div className="absolute inset-0 -z-10 bg-hero-fade" />
        <div className="mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:py-24">
          <div className="animate-rise self-center">
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-mocha">Luxury Bakery Boutique</p>
            <h1 className="mt-6 font-display text-6xl leading-none text-truffle sm:text-7xl">
              Freshly Baked Happiness
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-cocoa/75">
              Celebrate with couture cakes, rich flavours, dreamy textures and delivery timed to the moment you want the room to light up.
            </p>

            <SearchBar />

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/cakes"
                className="rounded-full bg-cocoa px-7 py-4 text-sm font-semibold uppercase tracking-[0.25em] text-cream shadow-soft transition hover:bg-truffle"
              >
                Order Now
              </Link>
              <Link
                href="/cakes"
                className="rounded-full border border-cocoa/15 bg-white/70 px-7 py-4 text-sm font-semibold uppercase tracking-[0.25em] text-cocoa transition hover:border-cocoa/30 hover:bg-white"
              >
                Explore Cakes
              </Link>
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              {[
                ["2 hr", "Express local delivery"],
                ["200+", "Artisan cake designs"],
                ["4.9/5", "Loved by customers"]
              ].map(([value, label]) => (
                <div key={label} className="rounded-[1.5rem] border border-white/60 bg-white/65 p-4 shadow-soft backdrop-blur-sm">
                  <p className="font-display text-3xl text-truffle">{value}</p>
                  <p className="mt-1 text-sm text-cocoa/70">{label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative animate-float">
            <div className="absolute -left-10 top-10 h-28 w-28 rounded-full bg-gold/20 blur-3xl" />
            <div className="absolute -right-10 bottom-10 h-36 w-36 rounded-full bg-rose/25 blur-3xl" />
            <div className="glass-panel relative overflow-hidden rounded-[2.5rem] p-4 shadow-glow">
              <div className="relative h-[560px] overflow-hidden rounded-[2rem]">
                <Image
                  src="https://images.unsplash.com/photo-1535254973040-607b474cb50d?auto=format&fit=crop&w=1400&q=80"
                  alt="Premium decorated cake"
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-truffle/50 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 rounded-[1.75rem] bg-white/20 p-5 text-white backdrop-blur-md">
                  <p className="text-sm uppercase tracking-[0.35em] text-white/80">Signature launch</p>
                  <p className="mt-2 font-display text-4xl">Rose Velvet Dream</p>
                  <p className="mt-2 max-w-sm text-sm leading-7 text-white/85">
                    Hand-finished petals, red velvet sponge and whipped mascarpone for modern celebrations.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Cake Categories"
          title="Choose the mood of your celebration"
          description="Every category is styled with premium photography, refined colour palettes and delightful hover interactions."
        />
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {dynamicCategories.map((category: any) => (
            <CategoryCard key={category.title} {...category} />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Featured Cakes"
          title="Curated favourites from our pastry studio"
          description="Modern product cards with flavour details, ratings and an effortless add-to-cart flow."
        />
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {featuredCakes.map((cake: any) => (
            <ProductCard key={cake.slug} cake={cake} />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Best Selling Cakes"
          title="The most-loved cakes on the menu"
          description="A polished product grid tailored for mobile, tablet and desktop browsing."
        />
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {bestSellingCakes.map((cake: any) => (
            <ProductCard key={cake.slug} cake={cake} />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-[2.5rem] border border-white/60 bg-gradient-to-r from-cocoa to-truffle p-8 text-cream shadow-glow lg:p-12">
          <div className="grid gap-8 lg:grid-cols-[1fr_0.9fr]">
            <div>
              <p className="text-sm uppercase tracking-[0.35em] text-gold">Offers & Discounts</p>
              <h2 className="mt-4 font-display text-5xl">Sweet deals for your next celebration</h2>
              <p className="mt-4 max-w-xl text-base leading-8 text-cream/80">
                Designed like a premium campaign banner with warm gradients, festive messaging and high conversion calls to action.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
              {[
                  "10% off on your first order",
                  "Festival cake offers with complimentary toppers",
                  "Free delivery on orders above Rs.999"
              ].map((offer) => (
                <div key={offer} className="rounded-[1.75rem] border border-white/10 bg-white/10 p-5 backdrop-blur">
                  <p className="text-sm leading-7">{offer}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Customer Reviews"
          title="Loved for taste, finish and delivery"
          description="Trust-building testimonials with star ratings and elegant review cards."
        />
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {reviews.slice(0, 3).map((review: any) => (
            <ReviewCard key={review.name} {...review} />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-[2.5rem] border border-white/60 bg-white/80 p-8 shadow-soft backdrop-blur-sm">
            <p className="text-sm uppercase tracking-[0.35em] text-mocha">Contact</p>
            <h2 className="mt-4 font-display text-5xl text-truffle">Visit our bakery atelier</h2>
            <div className="mt-8 space-y-5 text-base leading-8 text-cocoa/75">
              <p>{BAKERY_ADDRESS}</p>
              <p>+91 98765 43210</p>
              <p>hello@cakeaway.com</p>
              <p>Open daily from 9:00 AM to 10:00 PM</p>
            </div>
          </div>

          <div className="overflow-hidden rounded-[2.5rem] border border-white/60 bg-white/80 p-4 shadow-soft backdrop-blur-sm">
            <iframe
              title="Google map location"
              src={`https://www.google.com/maps?q=${encodeURIComponent(BAKERY_ADDRESS)}&output=embed`}
              className="h-[360px] w-full rounded-[2rem] border-0"
              loading="lazy"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
