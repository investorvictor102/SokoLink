import Shimmer from "@/components/loading/Shimmer";

export default function Loading() {
  return (
    <main className="container py-10">

      <div className="grid grid-cols-1 gap-8 md:grid-cols-[1.4fr_1fr]">

        {/* Image */}
        <div>
          <Shimmer className="aspect-[4/3] w-full rounded-card" />

          <div className="mt-3 flex gap-2">
            <Shimmer className="h-16 w-16 rounded-lg" />
            <Shimmer className="h-16 w-16 rounded-lg" />
            <Shimmer className="h-16 w-16 rounded-lg" />
          </div>
        </div>

        {/* Details */}
        <div>

          <Shimmer className="h-9 w-3/4" />

          <Shimmer className="mt-4 h-8 w-40" />

          <div className="mt-6 flex gap-2">
            <Shimmer className="h-8 w-28 rounded-full" />
            <Shimmer className="h-8 w-24 rounded-full" />
          </div>

          <Shimmer className="mt-8 h-6 w-32" />

          <div className="mt-3 space-y-2">
            <Shimmer className="h-4 w-full" />
            <Shimmer className="h-4 w-full" />
            <Shimmer className="h-4 w-5/6" />
            <Shimmer className="h-4 w-4/6" />
          </div>

          <div className="mt-8 rounded-card border border-border p-5">

            <Shimmer className="h-6 w-40" />

            <div className="mt-5 space-y-3">
              <Shimmer className="h-5 w-52" />
              <Shimmer className="h-5 w-40" />
              <Shimmer className="h-5 w-44" />
              <Shimmer className="h-5 w-36" />
            </div>

            <Shimmer className="mt-6 h-11 w-full rounded-lg" />
            <Shimmer className="mt-3 h-11 w-full rounded-lg" />

          </div>

        </div>

      </div>

    </main>
  );
}
