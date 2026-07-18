"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { KENYA_REGIONS } from "@/lib/utils";

export default function FilterBar() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [minPrice, setMinPrice] = useState(
    searchParams.get("minPrice") ?? ""
  );

  const [maxPrice, setMaxPrice] = useState(
    searchParams.get("maxPrice") ?? ""
  );
  const [region, setRegion] = useState(
  searchParams.get("region") ?? ""
);
const [sort, setSort] = useState(
  searchParams.get("sort") ?? ""
);

  function applyFilters() {
  const params = new URLSearchParams(searchParams.toString());

  if (region)
    params.set("region", region);
  else
    params.delete("region");

  if (minPrice)
    params.set("minPrice", minPrice);
  else
    params.delete("minPrice");

  if (maxPrice)
    params.set("maxPrice", maxPrice);
  else
    params.delete("maxPrice");
    if (sort)
  params.set("sort", sort);
else
  params.delete("sort");

  router.push(`/?${params.toString()}`);
}

  function clearFilters() {
  const params = new URLSearchParams(searchParams.toString());

  params.delete("region");
  params.delete("minPrice");
  params.delete("maxPrice");
  params.delete("sort");

  setRegion("");
  setMinPrice("");
  setMaxPrice("");
  setSort("");

  router.push("/");
}

  return (
    <div className="mb-8 rounded-card border border-border bg-white p-5 shadow-sm">
      <h2 className="mb-5 flex items-center gap-2 font-display text-xl font-bold text-ink">
    ⚙️ Filters
</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div>
        <div>
  <label className="label">Region</label>

  <select
    className="input-field"
    value={region}
    onChange={(e) => setRegion(e.target.value)}
  >
    <option value="">All Regions</option>

    {KENYA_REGIONS.map((r) => (
      <option key={r} value={r}>
        {r}
      </option>
    ))}
  </select>
</div>
          <label className="label">Minimum Price (KES)</label>

          <input
            type="number"
            className="input-field"
            placeholder="1000"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
          />
        </div>
        <div>
  <label className="label">Sort By</label>

  <select
    className="input-field"
    value={sort}
    onChange={(e) => setSort(e.target.value)}
  >
    <option value="">Newest First</option>
    <option value="old">Oldest First</option>
    <option value="low">Lowest Price</option>
    <option value="high">Highest Price</option>
  </select>
</div>

        <div>
          <label className="label">Maximum Price (KES)</label>

          <input
            type="number"
            className="input-field"
            placeholder="50000"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
          />
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <button
          onClick={applyFilters}
          className="btn-primary w-full sm:w-auto"
        >
          Apply Filters
        </button>

        <button
          onClick={clearFilters}
          className="w-full rounded-lg border border-border px-4 py-2 hover:bg-gray-50 sm:w-auto"
        >
          Clear
        </button>
      </div>
    </div>
  );
}
