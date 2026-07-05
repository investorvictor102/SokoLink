"use client";

import { useState } from "react";

type Seller = {
  full_name: string;
  email: string;
  phone: string;
  region: string;
};

export default function ContactSeller({
  seller,
  isSignedIn,
}: {
  seller: Seller;
  isSignedIn: boolean;
}) {
  const [revealed, setRevealed] = useState(false);

  if (!isSignedIn) {
    return (
      <div className="rounded-card border border-border bg-white p-4">
        <p className="text-[14px] text-muted">
          Log in to see this seller&apos;s contact details.
        </p>
        <a href="/login" className="btn-primary mt-3 w-full">
          Log in to contact seller
        </a>
      </div>
    );
  }

  if (!revealed) {
    return (
      <button onClick={() => setRevealed(true)} className="btn-primary w-full">
        Contact seller
      </button>
    );
  }

  const rows: [string, string][] = [
    ["Name", seller.full_name],
    ["Email", seller.email],
    ["Phone", seller.phone],
    ["Region", seller.region],
  ];

  return (
    <div className="rounded-card border border-border bg-white p-4">
      <p className="mb-3 text-[13px] font-medium text-muted">Seller details</p>
      <dl className="space-y-2">
        {rows.map(([label, value]) => (
          <div key={label} className="flex items-center justify-between text-[14px]">
            <dt className="text-muted">{label}</dt>
            <dd className="font-medium text-ink">{value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
