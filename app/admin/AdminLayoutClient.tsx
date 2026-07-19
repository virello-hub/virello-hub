"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import AdminGuard from "./AdminGuard";
import LogoutButton from "./LogoutButton";

type AdminLayoutClientProps = {
  children: ReactNode;
};

export default function AdminLayoutClient({
  children,
}: AdminLayoutClientProps) {
  const pathname = usePathname();

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  return (
    <AdminGuard>
      <div className="min-h-screen bg-[#F7F5EF]">
        <nav className="border-b border-[#D4AF37]/30 bg-black shadow-lg">
          <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-4 px-4 py-4 sm:px-6">
            <Link
              href="/admin"
              className="text-xl font-bold tracking-wide text-[#D4AF37]"
            >
              VIRELLO ADMIN
            </Link>

            <Link
              href="/admin/produse"
              className="text-sm font-medium text-white transition hover:text-[#D4AF37]"
            >
              Produse
            </Link>

            <Link
              href="/admin/comenzi"
              className="text-sm font-medium text-white transition hover:text-[#D4AF37]"
            >
              Comenzi
            </Link>

            <Link
              href="/admin/utilizatori"
              className="text-sm font-medium text-white transition hover:text-[#D4AF37]"
            >
              Utilizatori
            </Link>

            <Link
              href="/admin/setari"
              className="text-sm font-medium text-white transition hover:text-[#D4AF37]"
            >
              Setări
            </Link>

            <Link
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="ml-auto rounded-lg border border-[#D4AF37] px-4 py-2 text-sm font-semibold text-[#D4AF37] transition hover:bg-[#D4AF37] hover:text-black"
            >
              Vezi magazinul
            </Link>

            <LogoutButton />
          </div>
        </nav>

        {children}
      </div>
    </AdminGuard>
  );
}