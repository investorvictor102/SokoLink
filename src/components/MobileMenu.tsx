"use client";

import { useState } from "react";
import Link from "next/link";
import SignOutButton from "./SignOutButton";

type Props = {
  loggedIn: boolean;
};

export default function MobileMenu({ loggedIn }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Hamburger Button */}
      <button
        onClick={() => setOpen(true)}
        className="rounded-lg p-2 hover:bg-gray-100 md:hidden"
      >
        <span className="text-2xl">☰</span>
      </button>

      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/40"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Drawer */}
      <aside
        className={`fixed left-0 top-0 z-50 h-full w-72 bg-white shadow-xl transition-transform duration-300 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b p-4">
          <h2 className="text-xl font-bold">SokoLink</h2>

          <button
            onClick={() => setOpen(false)}
            className="text-2xl"
          >
            ✕
          </button>
        </div>

        <nav className="flex flex-col p-4 space-y-2">

          <Link href="/" onClick={() => setOpen(false)}>
            🏠 Browse
          </Link>

          {loggedIn ? (
            <>
              <Link href="/account" onClick={() => setOpen(false)}>
                📦 My Listings
              </Link>

              <Link href="/messages" onClick={() => setOpen(false)}>
                💬 Inbox
              </Link>

              <Link href="/post" onClick={() => setOpen(false)}>
                ➕ Post an Item
              </Link>

              <div className="pt-4">
                <SignOutButton />
              </div>
            </>
          ) : (
            <>
              <Link href="/login" onClick={() => setOpen(false)}>
                Log In
              </Link>

              <Link href="/signup" onClick={() => setOpen(false)}>
                Sign Up
              </Link>
            </>
          )}
        </nav>
      </aside>
    </>
  );
}
