import { FilterSidebar } from "@/components/filter-sidebar";
import { ProductCard } from "@/components/product-card";
import { SectionHeading } from "@/components/section-heading";
import { API_BASE_URL } from "@/lib/constants";

export const dynamic = 'force-dynamic';
export const revalidate = 0;
async function getCakes(search?: string) {
  try {
    const url = search 
      ? `${API_BASE_URL}/api/cakes/search?q=${encodeURIComponent(search)}`
      : `${API_BASE_URL}/api/cakes`;
    const res = await fetch(url, { next: { revalidate: 0 } });
    if (!res.ok) return [];
    const data = await res.json();
    console.log("Cakes: Fetched count:", (data.cakes || []).length, "Search:", search);
    return data.cakes || [];
  } catch (error) {
    console.error("Cakes: Failed to fetch:", error);
    return [];
  }
}

export default async function CakesPage({ searchParams }: { searchParams: { search?: string } }) {
  const cakes = await getCakes(searchParams.search);

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <SectionHeading
        eyebrow="Cake Menu"
        title="Browse our premium cake catalog"
        description="A modern product listing page with curated filters, responsive product cards and clean commerce interactions."
      />

      <div className="grid gap-8 lg:grid-cols-[290px_1fr]">
        <FilterSidebar />
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {cakes.map((cake: any) => (
            <ProductCard key={cake.slug} cake={cake} />
          ))}
        </div>
      </div>
    </div>
  );
}
