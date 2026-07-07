import Image from "next/image";
import Link from "next/link";
import { formatKes } from "@/lib/utils";

type Item = {
  id: string;
  name: string;
  category: string;
  price_kes: number;
  region: string;
  featured: boolean;
  image_urls: string[];
};

export default function ItemCard({ item }: { item: Item }) {
  const cover = item.image_urls?.[0];

  return (
    <Link
      href={`/items/${item.id}`}
      className="group block overflow-hidden rounded-card border border-border bg-white transition hover:border-brand/50"
    >
        <div className="relative aspect-[4/3] w-full bg-brand-light">

  {item.featured && (
    <div className="absolute left-2 top-2 z-10 rounded-full bg-amber-400 px-3 py-1 text-xs font-semibold text-amber-900 shadow">
      ⭐ Featured
    </div>
  )}

  {cover ? (
    <Image
      src={cover}
      alt={item.name}
      fill
      className="object-cover"
      sizes="(max-width: 640px) 50vw, 25vw"
    />
  ) : (
    <div className="flex h-full w-full items-center justify-center text-muted text-[13px]">
      No photo
    </div>
  )}
</div>
      <div className="p-3">

  <span className="inline-block rounded-full bg-brand-light px-2 py-1 text-[11px] font-medium text-brand-dark">
    {item.category}
  </span>

  <p className="mt-2 truncate text-[14px] font-medium text-ink">
    {item.name}
  </p>

  <p className="price mt-1 text-[15px] font-medium text-brand-dark">
    {formatKes(item.price_kes)}
  </p>
        <span className="mt-2 inline-block rounded-full bg-paper px-2.5 py-0.5 text-[11px] font-medium text-muted border border-border">
          {item.region}
        </span>
      </div>
    </Link>
  );
}
