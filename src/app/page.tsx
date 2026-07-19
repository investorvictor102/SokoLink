import { createClient } from "@/lib/supabase/server";
import ItemCard from "@/components/ItemCard";
import { CATEGORIES } from "@/lib/categories";
import Link from "next/link";
import FilterBar from "@/components/FilterBar";

export default async function BrowsePage({
  searchParams,
}: {
   searchParams: {
  region?: string;
  category?: string;
  minPrice?: string;
  maxPrice?: string;
  search?:string;
  sort?:string;
};
}) {
  const supabase = createClient();

  let query = supabase
  .from("items")
  .select("id, name, category, price_kes, region, image_urls, featured, created_at,views")
  .eq("featured", false)
    if (searchParams.search) {
  query = query.ilike("name", `%${searchParams.search}%`);
}

  if (searchParams.region) {
    query = query.eq("region", searchParams.region);
  }
  if (searchParams.category) {
  query = query.eq("category", searchParams.category);
}
if (searchParams.minPrice) {
  query = query.gte(
    "price_kes",
    Number(searchParams.minPrice)
  );
}

if (searchParams.maxPrice) {
  query = query.lte(
    "price_kes",
    Number(searchParams.maxPrice)
  );
}
if (searchParams.sort === "low") {
  query = query.order("price_kes", { ascending: true });
} else if (searchParams.sort === "high") {
  query = query.order("price_kes", { ascending: false });
} else if (searchParams.sort === "old") {
  query = query.order("created_at", { ascending: true });
} else {
  // Default: newest first
  query = query.order("created_at", { ascending: false });
}
   const { data: featuredItems } = await supabase
  .from("items")
  .select("id, name, category, price_kes, region, image_urls, featured, created_at,views")
  .eq("featured", true)
  .limit(4);

  const { data: items, error } = await query;

  return (
    <div>
      {/* Hero Section */}
      <div className="mb-12 rounded-card border border-border bg-white p-10 shadow-sm">
        <div className="max-w-3xl">
          <h1 className="font-display text-4xl font-bold text-ink">
            Buy & Sell Across Kenya
          </h1>

          <p className="mt-4 text-lg leading-8 text-muted">
            Discover amazing deals on phones, laptops, vehicles,
            furniture and thousands of other products from trusted
            sellers across Kenya.
          </p>
          <form className="mt-8" action="/">
        <div className="flex flex-col gap-3 sm:flex-row">
    <input
  type="text"
  name="search"
  defaultValue={searchParams.search ?? ""}
  placeholder="🔍 Search products..."
  className="w-full flex-1 rounded-xl border border-border px-5 py-4 text-base outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-200"
/>

    <button
  type="submit"
  className="btn-primary w-full sm:w-auto"
>
  Search
</button>
  </div>
</form>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a href="#latest" className="btn-primary">
              Browse Listings
            </a>

            <a
              href="/post"
              className="rounded-lg border border-border px-6 py-3 font-medium transition hover:bg-gray-50"
            >
              Sell an Item
            </a>
          </div>
        </div>
      </div>

      {error && (
        <p className="text-[14px] text-brick">
          Couldn't load listings right now. Try refreshing.
        </p>
      )}

      {!error && items?.length === 0 && (
        <div className="rounded-card border border-dashed border-border py-16 text-center">
          <p className="font-display text-[16px] font-medium text-ink">
            No listings yet
          </p>
          <p className="mt-1 text-[14px] text-muted">
            Be the first to post an item for sale.
          </p>
        </div>
      )}
      <div className="mb-10">
  <h2 className="mb-4 font-display text-2xl font-bold text-ink">
    Browse by Category
  </h2>

  <div className="overflow-x-auto pb-2 scrollbar-hide">
  <div className="flex w-max gap-3">
    {CATEGORIES.map((cat) => (
  <Link
    key={cat.name}
    href={
      cat.name === "All"
        ? "/"
        : `/?category=${encodeURIComponent(cat.name)}`
    }
    className={`flex flex-col items-center rounded-xl border px-4 py-3 transition whitespace-nowrap min-w-[88px] ${
      ((cat.name === "All" && !searchParams.category) ||
        searchParams.category === cat.name)
        ? "border-brand bg-brand text-white shadow-md"
        : "border-border bg-white hover:border-brand hover:shadow-sm"
    }`}
  >
    <span className="text-2xl">{cat.icon}</span>

    <span
      className={`mt-1 text-xs font-medium ${
        ((cat.name === "All" && !searchParams.category) ||
          searchParams.category === cat.name)
          ? "text-white"
          : "text-ink"
      }`}
    >
      {cat.name}
    </span>
  </Link>
))}
    </div>
  </div>
</div>
   {featuredItems && featuredItems.length > 0 && (
  <div className="mb-12 rounded-card border border-amber-200 bg-gradient-to-r from-amber-50 to-yellow-50 p-6 shadow-sm">
    <div className="flex items-center gap-3">
  <span className="text-3xl">⭐</span>

  <div>
    <h2 className="font-display text-2xl font-bold text-ink">
      Featured Listings
    </h2>

    <p className="text-sm text-muted">
      Hand-picked listings worth checking out.
    </p>
  </div>
</div>
      <div className="h-6" />


    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
      {featuredItems.map((item) => (
        <ItemCard key={item.id} item={item} />
      ))}
    </div>
  </div>
)}
     <FilterBar />

      <div id="latest" className="mb-6">
        <h2 className="font-display text-2xl font-bold text-ink">
          Latest Listings
        </h2>

        <p className="mt-1 text-muted">
          Fresh items posted by sellers across Kenya.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
        {items?.map((item) => (
          <ItemCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}
