import { Suspense } from "react";
import type { Metadata } from "next";
import { VerifyEmailView } from "@/components/auth/VerifyEmailView";

export const metadata: Metadata = {
  title: "Verify Email",
  robots: { index: false, follow: false },
};

type Props = { searchParams: Promise<{ token?: string }> };

async function VerifyEmailLoader({ searchParams }: Props) {
  const { token } = await searchParams;
  return <VerifyEmailView token={token ?? ""} />;
}

export default function VerifyEmailPage({ searchParams }: Props) {
  return (
    <div className="w-full max-w-md text-center">
      <Suspense fallback={null}>
        <VerifyEmailLoader searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
