import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import SignOutButton from "@/components/SignOutButton";

export default async function Header() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <header className="border-b border-border bg-paper">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3.5">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-[6px] bg-brand text-[13px] font-bold text-white">
            S
          </span>
          <span className="font-display text-[17px] font-bold tracking-tight text-ink">
            SokoLink
          </span>
        </Link>

        <nav className="flex items-center gap-2">
          <Link href="/" className="btn-secondary !border-0 !px-3">
            Browse
          </Link>
          {user ? (
            <>
              <Link href="/account" className="btn-secondary !border-0 !px-3">
                My listings
              </Link>
              <Link href="/post" className="btn-primary">
                Post an item
              </Link>
              <SignOutButton />
            </>
          ) : (
            <>
              <Link href="/login" className="btn-secondary">
                Log in
              </Link>
              <Link href="/signup" className="btn-primary">
                Sign up
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
