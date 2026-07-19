"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import { ADMIN_EMAIL } from "@/lib/admin";

export default function AdminGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  const [verificare, setVerificare] = useState(
    pathname !== "/admin/login"
  );

  useEffect(() => {
    if (pathname === "/admin/login") {
      setVerificare(false);
      return;
    }

    let componentaEsteActiva = true;

    async function verificaUtilizatorul() {
      setVerificare(true);

      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (!componentaEsteActiva) {
        return;
      }

      const esteAdministrator =
        !error &&
        user?.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase();

      if (!esteAdministrator) {
        await supabase.auth.signOut();

        router.replace("/admin/login");
        router.refresh();

        return;
      }

      setVerificare(false);
    }

    verificaUtilizatorul();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      const esteAdministrator =
        session?.user.email?.toLowerCase() ===
        ADMIN_EMAIL.toLowerCase();

      if (!esteAdministrator) {
        router.replace("/admin/login");
        router.refresh();
      }
    });

    return () => {
      componentaEsteActiva = false;
      subscription.unsubscribe();
    };
  }, [pathname, router]);

  if (verificare) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F7F5EF]">
        <div className="rounded-2xl border border-[#D4AF37]/30 bg-white px-8 py-6 shadow-lg">
          <p className="font-semibold text-black">
            Se verifică autentificarea...
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}