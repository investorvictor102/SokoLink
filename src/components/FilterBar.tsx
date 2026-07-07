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

  router.push(`/?${params.toString()}`);
}

  function clearFilters() {
  const params = new URLSearchParams(searchParams.toString());

  params.delete("region");
  params.delete("minPrice");
  params.delete("maxPrice");

  setRegion("");
  setMinPrice("");
  setMaxPrice("");

  router.push("/");
}

  return (
    <div className="mb-8 rounded-card border border-border bg-white p-5 shadow-sm">
      <h2 className="mb-4 font-display text-xl font-bold text-ink">
        Filter Listings
      </h2>

      <div className="grid gap-4 md:grid-cols-3">
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

      <div className="mt-5 flex gap-3">
        <button
          onClick={applyFilters}
          className="btn-primary"
        >
          Apply Filters
        </button>

        <button
          onClick={clearFilters}
          className="rounded-lg border border-border px-4 py-2 hover:bg-gray-50"
        >
          Clear
        </button>
      </div>
    </div>
  );
}
