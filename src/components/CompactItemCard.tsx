import Link from "next/link";
import Image from "next/image";

type CompactItem = {
  id: string;
  name: string;
  price_kes: number;
  image_urls: string[];
};

export default function CompactItemCard({
  item,
}: {
  item: CompactItem;
}) {
  return (
    <Link
      href={`/items/${item.id}`}
      className="block w-40 overflow-hidden rounded-xl border border-border bg-white shadow-sm transition hover:shadow-md"
    >
      <div className="relative aspect-square">
        <Image
          src={item.image_urls[0]}
          alt={item.name}
          fill
          className="object-cover"
        />
      </div>

      <div className="p-3">
        <h3 className="line-clamp-2 text-sm font-medium text-ink">
          {item.name}
        </h3>

        <p className="mt-2 font-bold text-brand">
          KES {item.price_kes.toLocaleString()}
        </p>
      </div>
    </Link>
  );
}
