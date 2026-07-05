"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { KENYA_REGIONS } from "@/lib/utils";

export default function SignUpPage() {
  const router = useRouter();
  const supabase = createClient();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [region, setRegion] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  async function handleSubmit(e: React.FormEvent) {
  e.preventDefault();
  setError(null);
  
  const phoneRegex = /^(\+2547\d{8}|07\d{8})$/;

if (!phoneRegex.test(phone.trim())) {
  setError(
    "Enter a valid Kenyan phone number (e.g. +254712345678 or 0712345678)."
  );
  return;
}

  if (!region) {
    setError("Select your region.");
    return;
  }

  setLoading(true);

  const { data, error: signUpError } = await supabase.auth.signUp({
    email,
    password,
  });

  if (signUpError) {
    setError(signUpError.message);
    setLoading(false);
    return;
  }

  if (!data.user) {
    setError("Something went wrong creating your account. Try again.");
    setLoading(false);
    return;
  }

  const { error: profileError } = await supabase
    .from("profiles")
    .insert({
      id: data.user.id,
      full_name: fullName,
      email,
      phone,
      region,
    });

  if (profileError) {
    setError(profileError.message);
    setLoading(false);
    return;
  }

  setLoading(false);
  router.push("/");
  router.refresh();
}



  return (
    <div className="mx-auto max-w-sm">
      <h1 className="font-display text-[22px] font-bold text-ink">
        Create your account
      </h1>
      <p className="mt-1 text-[14px] text-muted">
        These details are shown to buyers when they contact you about an item.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div>
          <label className="label">Full name</label>
          <input
            required
            className="input-field"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Jane Wanjiru"
          />
        </div>
        <div>
          <label className="label">Email</label>
          <input
            required
            type="email"
            className="input-field"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@example.com"
          />
        </div>
        <div>
          <label className="label">Phone number</label>
          <input
             required
             type="tel"
             className="input-field"
             value={phone}
             onChange={(e) => setPhone(e.target.value)}
             placeholder="+254712345678 or 0712345678"
          />
        </div>
        <div>
          <label className="label">Region</label>
          <select
            required
            className="input-field"
            value={region}
            onChange={(e) => setRegion(e.target.value)}
          >
            <option value="">Select region</option>
            {KENYA_REGIONS.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="label">Password</label>
          <input
            required
            minLength={6}
            type="password"
            className="input-field"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="At least 6 characters"
          />
        </div>

        {error && <p className="text-[13px] text-brick">{error}</p>}

        <button disabled={loading} className="btn-primary w-full">
          {loading ? "Creating account..." : "Create account"}
        </button>
      </form>

      <p className="mt-4 text-center text-[13px] text-muted">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-brand">
          Log in
        </Link>
      </p>
    </div>
  );
}
