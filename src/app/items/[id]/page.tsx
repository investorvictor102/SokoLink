import Image from "next/image";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { formatKes } from "@/lib/utils";
import ContactSeller from "@/components/ContactSeller";

export default async function ItemDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = createClient();

  const { data: item } = await supabase
    .from("items")
    .select(
      "id, name, price_kes, description, region, image_urls, video_url, seller_id"
    )
    .eq("id", params.id)
    .single();

  if (!item) notFound();

  const { data: seller } = await supabase
    .from("profiles")
    .select("full_name, email, phone, region")
    .eq("id", item.seller_id)
    .single();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="grid gap-8 md:grid-cols-[1.4fr_1fr]">
      <div>
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-card bg-brand-light">
          {item.image_urls?.[0] ? (
            <Image
              src={item.image_urls[0]}
              alt={item.name}
              fill
              className="object-cover"
              priority
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-muted">
              No photo
            </div>
          )}
        </div>

        {(item.image_urls?.length > 1 || item.video_url) && (
          <div className="mt-3 flex gap-2">
            {item.image_urls.slice(1).map((url: string) => (
              <div
                key={url}
                className="relative h-16 w-16 overflow-hidden rounded-[6px] border border-border"
              >
                <Image src={url} alt={item.name} fill className="object-cover" />
              </div>
            ))}
            {item.video_url && (
              <a
                href={item.video_url}
                target="_blank"
                rel="noreferrer"
                className="flex h-16 w-16 items-center justify-center rounded-[6px] border border-border bg-white text-[12px] font-medium text-brand"
              >
                Video
              </a>
            )}
          </div>
        )}
      </div>

      <div>
        <h1 className="font-display text-[22px] font-bold text-ink">
          {item.name}
        </h1>
        <p className="price mt-2 text-[26px] font-medium text-brand-dark">
          {formatKes(item.price_kes)}
        </p>
        <span className="mt-3 inline-block rounded-full bg-paper px-2.5 py-0.5 text-[12px] font-medium text-muted border border-border">
          {item.region}
        </span>
        <p className="mt-4 whitespace-pre-line text-[14px] leading-relaxed text-ink">
          {item.description}
        </p>

        <div className="mt-6">
          {seller && (
            <ContactSeller seller={seller} isSignedIn={!!user} />
          )}
        </div>
      </div>
    </div>
  );
}
