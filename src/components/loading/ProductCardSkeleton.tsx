import Shimmer from "./Shimmer";

export default function ProductCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-card border border-border bg-white shadow-sm">
      <Shimmer className="aspect-[4/3]" />

      <div className="space-y-3 p-4">
        <Shimmer className="h-4 w-4/5" />

        <Shimmer className="h-4 w-2/3" />

        <Shimmer className="h-5 w-1/3" />
      </div>
    </div>
  );
}
