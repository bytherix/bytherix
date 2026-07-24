"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import { apiClient } from "@/lib/api-client";

export function VerifyEmailView({ token }: { token: string }) {
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    token ? "loading" : "error",
  );

  useEffect(() => {
    if (!token) return;
    apiClient
      .get(`/auth/verify-email?token=${encodeURIComponent(token)}`)
      .then(() => setStatus("success"))
      .catch(() => setStatus("error"));
  }, [token]);

  if (status === "loading")
    return (
      <div className="py-12">
        <Loader2 className="w-12 h-12 text-bx-blue animate-spin mx-auto mb-4" />
        <p className="text-bx-slate">Verifying your email...</p>
      </div>
    );

  if (status === "success")
    return (
      <div className="py-8">
        <CheckCircle className="w-14 h-14 text-bx-green mx-auto mb-4" />
        <h2 className="text-xl font-bold text-bx-white mb-2">
          Email verified!
        </h2>
        <p className="text-bx-slate text-sm mb-6">
          Your account is now active.
        </p>
        <Link
          href="/login"
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-bx-blue hover:bg-bx-blue-light text-white font-semibold text-sm transition-colors"
        >
          Sign in
        </Link>
      </div>
    );

  return (
    <div className="py-8">
      <XCircle className="w-14 h-14 text-bx-red mx-auto mb-4" />
      <h2 className="text-xl font-bold text-bx-white mb-2">
        Verification failed
      </h2>
      <p className="text-bx-slate text-sm mb-6">
        This link is invalid or has expired.
      </p>
      <Link
        href="/login"
        className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl border border-bx-border text-bx-slate font-semibold text-sm transition-colors hover:text-bx-white"
      >
        Back to sign in
      </Link>
    </div>
  );
}
