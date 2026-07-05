import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { formatKes } from "@/lib/utils";
import DeleteItemButton from "@/components/DeleteItemButton";

export default async function AccountPage() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: items, error } = await supabase
    .from("items")
    .select("id, name, price_kes, region, image_urls, created_at")
    .eq("seller_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display text-[22px] font-bold text-ink">
          My listings
        </h1>
        <p className="mt-1 text-[14px] text-muted">
          Items you&apos;ve posted for sale.
        </p>
      </div>

      {error && (
        <p className="text-[14px] text-brick">
          Couldn&apos;t load your listings right now. Try refreshing.
        </p>
      )}

      {!error && items?.length === 0 && (
        <div className="rounded-card border border-dashed border-border py-16 text-center">
          <p className="font-display text-[16px] font-medium text-ink">
            You haven&apos;t posted anything yet
          </p>
          <Link href="/post" className="btn-primary mt-4 inline-flex">
            Post an item
          </Link>
        </div>
      )}

      <div className="space-y-3">
        {items?.map((item) => (
          <div
            key={item.id}
            className="flex items-center gap-4 rounded-card border border-border bg-white p-3"
          >
            <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-[6px] bg-brand-light">
              {item.image_urls?.[0] ? (
                <Image
                  src={item.image_urls[0]}
                  alt={item.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-[11px] text-muted">
                  No photo
                </div>
              )}
            </div>

            <div className="min-w-0 flex-1">
              <Link
                href={`/items/${item.id}`}
                className="truncate text-[14px] font-medium text-ink hover:underline"
              >
                {item.name}
              </Link>
              <p className="price mt-0.5 text-[14px] font-medium text-brand-dark">
                {formatKes(item.price_kes)}
              </p>
              <span className="mt-1 inline-block rounded-full border border-border bg-paper px-2 py-0.5 text-[11px] text-muted">
                {item.region}
              </span>
            </div>

            <div className="flex shrink-0 items-center gap-4">
              <Link
                href={`/account/items/${item.id}/edit`}
                className="text-[13px] font-medium text-brand hover:underline"
              >
                Edit
              </Link>
              <DeleteItemButton itemId={item.id} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
