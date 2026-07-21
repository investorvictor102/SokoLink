import LoadingHeader from "@/components/loading/LoadingHeader";
import SkeletonGrid from "@/components/loading/SkeletonGrid";

export default function Loading() {
  return (
    <main className="container py-10">
      <LoadingHeader />

      <SkeletonGrid />
    </main>
  );
}
