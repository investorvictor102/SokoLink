import Image from "next/image";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { formatKes } from "@/lib/utils";
import ContactSeller from "@/components/ContactSeller";
import ViewTracker from "@/components/ViewTracker";
import MessageSellerButton from "@/components/MessageSellerButton";
import ImageGallery from "@/components/ImageGallery";
import ItemCard from "@/components/ItemCard";
import Link from "next/link";
import CompactItemCard from "@/components/CompactItemCard";

export default async function ItemDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = createClient();


  const { data: item } = await supabase
    .from("items")
    .select(
     "id, name,category, price_kes, description, region, image_urls, video_url, seller_id, views"
  )
    .eq("id", params.id)
    .single();

  if (!item) notFound();

  const { data: seller } = await supabase
  .from("profiles")
  .select("full_name, email, phone, region, created_at")
  .eq("id", item.seller_id)
  .single();
  
  const { count: sellerListings } = await supabase
  .from("items")
  .select("*", {
    count: "exact",
    head: true,
  })
  .eq("seller_id", item.seller_id);
  
  const { data: sellerItems } = await supabase
  .from("items")
  .select(
    "id, name, category, price_kes, region, image_urls, featured, created_at, views"
  )
  .eq("seller_id", item.seller_id)
  .neq("id", item.id)
  .limit(4);
  const { data: similarItems } = await supabase
  .from("items")
  .select(
    "id, name, category, price_kes, region, image_urls, featured, created_at, views"
  )
  .eq("category", item.category)
  .neq("id", item.id)
  .limit(8);

  const {
    data: { user },
  } = await supabase.auth.getUser();


  return (
    <div className="grid gap-8 md:grid-cols-[1.4fr_1fr]">
      <div>
        <ImageGallery
      images={item.image_urls}
       videoUrl={item.video_url}
     />
      </div>

      <div>
        <h1 className="font-display text-2xl md:text-3xl font-bold text-ink">
          {item.name}
        </h1>
        <p className="price mt-2 text-[26px] font-medium text-brand-dark">
          {formatKes(item.price_kes)}
        </p>
        <div className="mt-4 flex flex-wrap gap-2">

  <span className="rounded-full border border-border bg-paper px-3 py-1 text-sm text-muted">
    📍 {item.region}
  </span>

  <span className="rounded-full border border-border bg-paper px-3 py-1 text-sm text-muted">
    👁 {item.views ?? 0} views
  </span>

</div>
          
        <h2 className="mt-6 text-lg font-semibold text-ink">
  Description
</h2>

        <p className="mt-3 whitespace-pre-line text-[15px] leading-7 text-ink">
  {item.description}
</p>

        <div className="mt-8 rounded-card border border-border bg-white p-5 shadow-sm">

  {!user ? (

    <div className="py-4 text-center">

      <div className="mb-4 text-5xl">🔒</div>

      <h3 className="text-xl font-semibold text-ink">
        Seller Information
      </h3>

      <p className="mt-3 text-muted">
        Sign in to unlock:
      </p>

      <div className="mt-5 space-y-2">
        <p>✓ Seller details</p>
        <p>✓ Contact information</p>
        <p>✓ More listings from this seller</p>
      </div>

      <Link
        href="/login"
        className="btn-primary mt-6 inline-block"
      >
        Sign in for free
      </Link>

    </div>

  ) : seller && (

    <>
      <h3 className="text-lg font-semibold text-ink">
        Seller Information
      </h3>

      <div className="mt-4 space-y-2 text-sm">

        <div className="flex items-center gap-2">
          <span>👤</span>
          <span className="font-medium">{seller.full_name}</span>
        </div>

        <div className="flex items-center gap-2">
          <span>✅</span>
          <span>Verified Seller</span>
        </div>

        <div className="flex items-center gap-2">
          <span>📍</span>
          <span>{seller.region}</span>
        </div>

        <div className="flex items-center gap-2">
          <span>🛍</span>
          <span>{sellerListings ?? 0} Active Listings</span>
        </div>

        <div className="flex items-center gap-2">
          <span>📅</span>
          <span>
            Member since{" "}
            {new Date(seller.created_at).toLocaleDateString("en-US", {
              month: "short",
              year: "numeric",
            })}
          </span>
        </div>

      </div>

      <div className="mt-6 space-y-3">
        <MessageSellerButton
          itemId={item.id}
          sellerId={item.seller_id}
        />

        <ContactSeller
          seller={seller}
          isSignedIn={!!user}
        />
      </div>
    </>
  )}

</div>
      </div>
      {sellerItems && sellerItems.length > 0 && (
  <section className="mt-12">
    <div className="mb-5 flex items-center justify-between">
      <div>
        <h2 className="font-display text-2xl font-bold text-ink">
          More from {seller?.full_name}
        </h2>

        <p className="text-muted">
          Browse more items from this seller.
        </p>
      </div>
    </div>

    <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
      {sellerItems.map((sellerItem) => (
  <CompactItemCard
    key={sellerItem.id}
    item={sellerItem}
  />
))}
    </div>
  </section>
)}
{/*{similarItems && similarItems.length > 0 && (
  <section className="mt-12">
    <div className="mb-5">
      <h2 className="font-display text-2xl font-bold text-ink">
        Similar Products
      </h2>

      <p className="text-muted">
        You might also like these items.
      </p>
    </div>

    <div className="overflow-x-auto scrollbar-hide">
      <div className="flex gap-4 pb-2">
        {similarItems.map((similarItem) => (
          <div
            key={similarItem.id}
            className="w-[170px] flex-shrink-0"
          >
            <ItemCard item={similarItem} />
          </div>
        ))}
      </div>
    </div>
  </section>
)}*/}
      <ViewTracker itemId={item.id} />
    </div>
  );
}
