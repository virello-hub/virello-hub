"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";

type SiteSettings = {
  phone: string;
  email: string;
  address: string;
  whatsapp: string;
  facebook: string;
  instagram: string;
};

const defaultSettings: SiteSettings = {
  phone: "",
  email: "",
  address: "",
  whatsapp: "",
  facebook: "",
  instagram: "",
};

export default function Footer() {
  const [settings, setSettings] =
    useState<SiteSettings>(defaultSettings);

  useEffect(() => {
    async function loadSettings() {
      const { data, error } = await supabase
        .from("site_settings")
        .select(
          "phone, email, address, whatsapp, facebook, instagram"
        )
        .eq("id", 1)
        .maybeSingle();

      if (error) {
        console.error(
          "Setările footerului nu au putut fi încărcate:",
          error.message
        );
        return;
      }

      if (data) {
        setSettings({
          phone: data.phone ?? "",
          email: data.email ?? "",
          address: data.address ?? "",
          whatsapp: data.whatsapp ?? "",
          facebook: data.facebook ?? "",
          instagram: data.instagram ?? "",
        });
      }
    }

    loadSettings();
  }, []);

  const whatsappNumber = settings.whatsapp.replace(/\D/g, "");
  const phoneLink = settings.phone.replace(/[^\d+]/g, "");

  return (
    <footer className="mt-auto border-t border-white/10 bg-black">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-12 md:grid-cols-4">
        <div>
          <h2 className="text-2xl font-bold text-[#D4AF37]">
            VIRELLO
          </h2>

          <p className="mt-4 text-sm leading-7 text-neutral-400">
            Calitate. Stil. Încredere.
          </p>

          <p className="mt-2 text-sm leading-7 text-neutral-500">
            Produse moderne pentru casa ta și pentru stilul tău
            de viață.
          </p>
        </div>

        <div>
          <h3 className="mb-4 font-semibold text-white">
            Magazin
          </h3>

          <ul className="space-y-2 text-neutral-400">
            <li>
              <a
                href="/"
                className="transition hover:text-[#D4AF37]"
              >
                Acasă
              </a>
            </li>

            <li>
              <a
                href="/Produse"
                className="transition hover:text-[#D4AF37]"
              >
                Produse
              </a>
            </li>

            <li>
              <a
                href="/Favorite"
                className="transition hover:text-[#D4AF37]"
              >
                Favorite
              </a>
            </li>

            <li>
              <a
                href="/Cos"
                className="transition hover:text-[#D4AF37]"
              >
                Coș
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="mb-4 font-semibold text-white">
            Informații
          </h3>

          <ul className="space-y-2 text-neutral-400">
            <li>
              <a
                href="/Despre"
                className="transition hover:text-[#D4AF37]"
              >
                Despre noi
              </a>
            </li>

            <li>
              <a
                href="/Contact"
                className="transition hover:text-[#D4AF37]"
              >
                Contact
              </a>
            </li>

            <li>
              <a
                href="/Confidentialitate"
                className="transition hover:text-[#D4AF37]"
              >
                Confidențialitate
              </a>
            </li>

            <li>
              <a
                href="/Cookies"
                className="transition hover:text-[#D4AF37]"
              >
                Cookies
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="mb-4 font-semibold text-white">
            Contact
          </h3>

          <div className="space-y-3 text-neutral-400">
            {settings.email && (
              <p>
                📧{" "}
                <a
                  href={`mailto:${settings.email}`}
                  className="transition hover:text-[#D4AF37]"
                >
                  {settings.email}
                </a>
              </p>
            )}

            {settings.phone && (
              <p>
                📞{" "}
                <a
                  href={`tel:${phoneLink}`}
                  className="transition hover:text-[#D4AF37]"
                >
                  {settings.phone}
                </a>
              </p>
            )}

            {settings.address && (
              <p>📍 {settings.address}</p>
            )}

            {whatsappNumber && (
              <p>
                💬{" "}
                <a
                  href={`https://wa.me/${whatsappNumber}`}
                  target="_blank"
                  rel="noreferrer"
                  className="transition hover:text-[#D4AF37]"
                >
                  WhatsApp
                </a>
              </p>
            )}

            {settings.facebook && (
              <p>
                <a
                  href={settings.facebook}
                  target="_blank"
                  rel="noreferrer"
                  className="transition hover:text-[#D4AF37]"
                >
                  Facebook
                </a>
              </p>
            )}

            {settings.instagram && (
              <p>
                <a
                  href={settings.instagram}
                  target="_blank"
                  rel="noreferrer"
                  className="transition hover:text-[#D4AF37]"
                >
                  Instagram
                </a>
              </p>
            )}

            {!settings.email &&
              !settings.phone &&
              !settings.address && (
                <p className="text-neutral-600">
                  Datele de contact nu sunt completate.
                </p>
              )}
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 py-6 text-center text-sm text-neutral-500">
        © {new Date().getFullYear()} VIRELLO. Toate drepturile
        rezervate.
      </div>
    </footer>
  );
}