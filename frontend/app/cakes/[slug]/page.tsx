import Image from "next/image";
import { notFound } from "next/navigation";
import { ProductCard } from "@/components/product-card";
import { ReviewCard } from "@/components/review-card";
import { OrderForm } from "@/components/order-form";
import { ReviewForm } from "@/components/review-form";
import { API_BASE_URL } from "@/lib/constants";

export const dynamic = 'force-dynamic';
export const revalidate = 0;
async function getCake(slug: string) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/cakes/${slug}`);
    if (!res.ok) return null;
    const data = await res.json();
    return data.cake || null;
  } catch (error) {
    return null;
  }
}

async function getCakes() {
  try {
    const res = await fetch(`${API_BASE_URL}/api/cakes`);
    if (!res.ok) return [];
    const data = await res.json();
    return data.cakes || [];
  } catch (error) {
    return [];
  }
}

async function getReviews(cakeSlug: string) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/reviews?cakeSlug=${cakeSlug}`, { next: { revalidate: 0 } });
    if (!res.ok) return [];
    const data = await res.json();
    return data.reviews || [];
  } catch (error) {
    return [];
  }
}

export async function generateStaticParams() {
  const cakes = await getCakes();
  return cakes.map((cake: any) => ({ slug: cake.slug }));
}

const getImageUrl = (image: string) => {
  if (!image) return "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=600&q=80";
  if (image.startsWith('http')) return image;
  return `https://images.unsplash.com/${image}?auto=format&fit=crop&w=1200&q=80`;
};

export default async function ProductDetailsPage({ params }: { params: { slug: string } }) {
  const [cake, cakes, reviews] = await Promise.all([
    getCake(params.slug),
    getCakes(),
    getReviews(params.slug)
  ]);

  if (!cake) {
    notFound();
  }

  const relatedCakes = cakes.filter((item: any) => item.slug !== cake.slug).slice(0, 3);

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="space-y-4">
          <div className="relative h-[460px] overflow-hidden rounded-[2.5rem] border border-white/60 bg-white/80 shadow-soft">
            <Image 
                src={getImageUrl(cake.image)} 
                alt={cake.name} 
                fill 
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover" 
            />
          </div>
          <div className="grid grid-cols-3 gap-4">
            {cake.gallery.slice(1).map((image: string) => (
              <div key={image} className="relative h-36 overflow-hidden rounded-[1.5rem] border border-white/60 bg-white/80 shadow-soft">
                <Image 
                    src={getImageUrl(image)} 
                    alt={cake.name} 
                    fill 
                    sizes="(max-width: 1024px) 33vw, 15vw"
                    className="object-cover" 
                />
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[2.5rem] border border-white/60 bg-white/80 p-8 shadow-soft backdrop-blur-sm">
          <p className="text-sm uppercase tracking-[0.35em] text-mocha">{cake.flavour}</p>
          <h1 className="mt-4 font-display text-5xl text-truffle">{cake.name}</h1>
          <p className="mt-4 text-base leading-8 text-cocoa/75">{cake.description}</p>
          <div className="mt-6 flex flex-wrap gap-4 text-sm text-cocoa/70">
            <span className="rounded-full bg-blush/55 px-4 py-2">{cake.rating}/5 rating</span>
            <span className="rounded-full bg-cream px-4 py-2">AI recommendation: Pairs with Hazelnut Praline Crown</span>
          </div>

          <div className="mt-8 grid gap-6">
            <div>
              <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-mocha">Flavour Options</p>
              <div className="flex flex-wrap gap-3">
                {["Red Velvet", "Dark Chocolate", "Vanilla Bean", "Raspberry"].map((option) => (
                  <button
                    key={option}
                    className={`rounded-full px-4 py-2 text-sm ${option === cake.flavour ? "bg-cocoa text-cream" : "bg-cream text-cocoa"}`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-mocha">Weight Selection</p>
              <div className="flex gap-3">
                {["500g", "1kg", "2kg"].map((weight, index) => (
                  <button
                    key={weight}
                    className={`rounded-full px-4 py-2 text-sm ${index === 1 ? "bg-cocoa text-cream" : "bg-cream text-cocoa"}`}
                  >
                    {weight}
                  </button>
                ))}
              </div>
            </div>

            <OrderForm cake={cake} />
          </div>
        </div>
      </div>

      <section className="mt-20">
        <div className="mb-8 flex items-end justify-between gap-6">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-mocha">Related Cakes</p>
            <h2 className="mt-2 font-display text-4xl text-truffle">People also ordered</h2>
          </div>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {relatedCakes.map((relatedCake: any) => (
            <ProductCard key={relatedCake.slug} cake={relatedCake} />
          ))}
        </div>
      </section>

      <section className="mt-20 grid gap-10 lg:grid-cols-2">
        <div>
          <div className="mb-8">
            <p className="text-sm uppercase tracking-[0.35em] text-mocha">Reviews</p>
            <h2 className="mt-2 font-display text-4xl text-truffle">Customer experiences</h2>
          </div>
          <div className="space-y-6">
            {reviews.length === 0 ? (
              <p className="text-cocoa/70 italic">No reviews yet for this cake. Be the first to share!</p>
            ) : (
              reviews.map((review: any) => (
                <ReviewCard key={review.id || review.name} {...review} />
              ))
            )}
          </div>
        </div>
        <div>
           <ReviewForm cakeSlug={cake.slug} onSuccess={() => {}} />
        </div>
      </section>
    </div>
  );
}
