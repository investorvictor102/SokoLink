import Image from "next/image";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { formatKes } from "@/lib/utils";
import ContactSeller from "@/components/ContactSeller";
import ViewTracker from "@/components/ViewTracker";
import MessageSellerButton from "@/components/MessageSellerButton";
import ImageGallery from "@/components/ImageGallery";

export default async function ItemDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = createClient();


  const { data: item } = await supabase
    .from("items")
    .select(
     "id, name, price_kes, description, region, image_urls, video_url, seller_id, views"
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

  {seller && (
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
      <ViewTracker itemId={item.id} />
    </div>
  );
}
