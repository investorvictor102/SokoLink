# SokoLink

A marketplace site where users create an account, post items for sale
(name, price in KES, description, up to 3 photos, optional 5MB video),
and buyers can tap "Contact seller" to reveal the seller's name, email,
phone, and region.

Stack: Next.js 14 (App Router) + Supabase (Postgres database, auth, and
file storage).

## 1. Create your Supabase project

1. Go to [supabase.com](https://supabase.com) and create a free project.
2. In the project dashboard, open **SQL Editor** → **New query**, paste
   the entire contents of `supabase/schema.sql`, and click **Run**.
   This creates the `profiles` and `items` tables, row-level security
   policies, and the `item-images` / `item-videos` storage buckets
   (each capped at 5MB per file at the storage level, matching the
   in-app checks).
3. In **Authentication → Settings**, for the fastest setup during
   development, turn **off** "Confirm email" so accounts are active
   immediately after signup. Turn it back on before you launch
   publicly, and see the note below on handling confirmed signups.
4. In **Project Settings → API**, copy your **Project URL** and
   **anon public key**.

## 2. Configure     the app

```bash
cp .env.local.example .env.local
```

Paste your Project URL and anon key into `.env.local`.

## 3. Install and run

```bash
npm install
npm run dev
```

Visit `http://localhost:3000`.

## 4. Deploy

Push this project to GitHub and import it into
[Vercel](https://vercel.com/new) — it's built by the same team as
Next.js and deploys it with zero config. Add the two environment
variables from `.env.local` in the Vercel project settings.

## How the pieces fit together

- **`supabase/schema.sql`** — the database: `profiles` (one row per
  user: name, phone, region, email) and `items` (listings, each
  linked to a `seller_id`). Row-level security means listings are
  public to browse, but only the signed-in owner can edit or delete
  their own items or profile.
- **`src/app/signup`, `src/app/login`** — Supabase Auth handles
  passwords and sessions; on signup we also insert a row into
  `profiles` with the contact details buyers will see.
- **`src/app/post`** — the listing form. Photos and video upload
  straight to Supabase Storage from the browser; size is checked
  client-side (3 photos max, 5MB video cap) before upload, and the
  storage buckets also enforce a 5MB-per-file limit as a backstop.
- **`src/app/items/[id]`** — item detail page. `ContactSeller.tsx` is
  the reveal button: contact info only renders after the click, and
  only for signed-in users.
- **`src/app/account`** — "My listings": a signed-in user's own items,
  with links to edit or delete each one. Editing lets you swap out
  individual photos or the video without having to re-upload
  everything.
- **`src/app/page.tsx`** — the browse grid, newest listings first.

## If you keep "Confirm email" on for production

Supabase won't return a session until the user clicks the email link,
so the profile row can't be created at signup time. The straightforward
fix: after email confirmation, redirect first-time users to a short
"complete your profile" step that inserts the `profiles` row using
their already-confirmed session. Ask me if you'd like that page built
out.

## Extending this

Natural next additions: search/keyword filtering on top of the region
filter, and image compression before upload to keep storage costs low
as the catalog grows.
