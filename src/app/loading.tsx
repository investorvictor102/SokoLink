import LoadingHeader from "@/components/loading/LoadingHeader";
import SkeletonGrid from "@/components/loading/SkeletonGrid";

export default function Loading() {
  return (
    <main className="container py-10">

      <LoadingHeader />

      <div className="mb-8 text-center">
        <p className="text-sm font-medium text-brand">
          🛍️ Finding great deals across Kenya...
        </p>

        <p className="mt-1 text-xs text-muted">
          Loading the latest listings for you
        </p>
      </div>

      <SkeletonGrid />

    </main>
  );
}
