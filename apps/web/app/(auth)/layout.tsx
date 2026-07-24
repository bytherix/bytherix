import Link from "next/link";
import Image from "next/image";
import { CopyrightYear } from "@/components/common/CopyrightYear";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-bx-navy flex flex-col">
      <header className="px-6 py-4 border-b border-bx-border">
        <Link href="/" className="inline-flex items-center gap-2.5">
          <div className="relative w-8 h-8 rounded-xl overflow-hidden">
            <Image
              src="/logo.jpg"
              alt="Bytherix"
              fill
              sizes="32px"
              className="object-cover"
            />
          </div>
          <span className="font-bold text-lg">
            <span className="text-bx-white">By</span>
            <span className="text-bx-blue">the</span>
            <span className="text-bx-green-light">rix</span>
          </span>
        </Link>
      </header>
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        {children}
      </main>
      <footer className="text-center py-4 text-bx-muted text-xs">
        © <CopyrightYear /> Bytherix.
      </footer>
    </div>
  );
}
