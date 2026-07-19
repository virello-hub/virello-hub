"use client";

import { FormEvent, useEffect, useState } from "react";
import type { CSSProperties } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";

type SiteSettings = {
  id: number;
  phone: string;
  email: string;
  address: string;
  whatsapp: string;
  facebook: string;
  instagram: string;
  hero_title: string;
  hero_description: string;
};

const defaultSettings: SiteSettings = {
  id: 1,
  phone: "",
  email: "",
  address: "",
  whatsapp: "",
  facebook: "",
  instagram: "",
  hero_title: "",
  hero_description: "",
};

export default function AdminSettingsPage() {
  const router = useRouter();

  const [settings, setSettings] =
    useState<SiteSettings>(defaultSettings);

  const [userEmail, setUserEmail] = useState("");
  const [checkingUser, setCheckingUser] = useState(true);
  const [loadingSettings, setLoadingSettings] = useState(true);
  const [saving, setSaving] = useState(false);

  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function initializePage() {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error || !user) {
        router.replace("/admin/login");
        return;
      }

      setUserEmail(user.email ?? "");
      setCheckingUser(false);

      await loadSettings();
    }

    initializePage();
  }, [router]);

  async function loadSettings() {
    setLoadingSettings(true);
    setMessage("");
    setErrorMessage("");

    const { data, error } = await supabase
      .from("site_settings")
      .select(
        "id, phone, email, address, whatsapp, facebook, instagram, hero_title, hero_description"
      )
      .eq("id", 1)
      .maybeSingle();

    if (error) {
      setErrorMessage(
        `Setările nu au putut fi încărcate: ${error.message}`
      );
      setLoadingSettings(false);
      return;
    }

    if (data) {
      setSettings({
        id: Number(data.id),
        phone: data.phone ?? "",
        email: data.email ?? "",
        address: data.address ?? "",
        whatsapp: data.whatsapp ?? "",
        facebook: data.facebook ?? "",
        instagram: data.instagram ?? "",
        hero_title: data.hero_title ?? "",
        hero_description: data.hero_description ?? "",
      });
    } else {
      setSettings(defaultSettings);
    }

    setLoadingSettings(false);
  }

  function updateField(
    field: keyof SiteSettings,
    value: string
  ) {
    setSettings((current) => ({
      ...current,
      [field]: value,
    }));
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setSaving(true);
    setMessage("");
    setErrorMessage("");

    const settingsData = {
      id: 1,
      phone: settings.phone.trim(),
      email: settings.email.trim(),
      address: settings.address.trim(),
      whatsapp: settings.whatsapp.trim(),
      facebook: settings.facebook.trim(),
      instagram: settings.instagram.trim(),
      hero_title: settings.hero_title.trim(),
      hero_description: settings.hero_description.trim(),
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase
      .from("site_settings")
      .upsert(settingsData, {
        onConflict: "id",
      });

    if (error) {
      setErrorMessage(
        `Setările nu au putut fi salvate: ${error.message}`
      );
      setSaving(false);
      return;
    }

    setMessage("Setările site-ului au fost salvate.");
    setSaving(false);
    await loadSettings();
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    router.replace("/admin/login");
    router.refresh();
  }

  if (checkingUser) {
    return (
      <main style={styles.loadingPage}>
        <p>Se verifică autentificarea...</p>
      </main>
    );
  }

  return (
    <main style={styles.page}>
      <header style={styles.header}>
        <div>
          <p style={styles.eyebrow}>
            PANOU DE ADMINISTRARE
          </p>

          <h1 style={styles.logo}>VIRELLO</h1>

          <p style={styles.subtitle}>
            Modifică informațiile afișate pe site
          </p>
        </div>

        <div style={styles.accountArea}>
          <div style={styles.accountBox}>
            <span style={styles.accountLabel}>
              Autentificat ca
            </span>

            <strong style={styles.accountEmail}>
              {userEmail}
            </strong>
          </div>

          <button
            type="button"
            onClick={() => router.push("/admin")}
            style={styles.secondaryButton}
          >
            Produse
          </button>

          <button
            type="button"
            onClick={handleLogout}
            style={styles.logoutButton}
          >
            Deconectare
          </button>
        </div>
      </header>

      <section style={styles.container}>
        <div style={styles.sectionHeader}>
          <div>
            <p style={styles.sectionEyebrow}>
              SETĂRI SITE
            </p>

            <h2 style={styles.sectionTitle}>
              Informații generale
            </h2>

            <p style={styles.sectionDescription}>
              Modificările salvate aici vor fi afișate pe
              partea publică a site-ului.
            </p>
          </div>

          <button
            type="button"
            onClick={loadSettings}
            disabled={loadingSettings}
            style={styles.refreshButton}
          >
            {loadingSettings
              ? "Se încarcă..."
              : "Reîncarcă"}
          </button>
        </div>

        {loadingSettings ? (
          <div style={styles.loadingBox}>
            Se încarcă setările...
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            style={styles.form}
          >
            <div style={styles.twoColumns}>
              <label style={styles.label}>
                Număr de telefon
                <input
                  type="text"
                  value={settings.phone}
                  onChange={(event) =>
                    updateField(
                      "phone",
                      event.target.value
                    )
                  }
                  placeholder="0722 123 456"
                  style={styles.input}
                />
              </label>

              <label style={styles.label}>
                Email
                <input
                  type="email"
                  value={settings.email}
                  onChange={(event) =>
                    updateField(
                      "email",
                      event.target.value
                    )
                  }
                  placeholder="contact@virello.ro"
                  style={styles.input}
                />
              </label>
            </div>

            <label style={styles.label}>
              Adresă
              <input
                type="text"
                value={settings.address}
                onChange={(event) =>
                  updateField(
                    "address",
                    event.target.value
                  )
                }
                placeholder="Strada, numărul, orașul"
                style={styles.input}
              />
            </label>

            <div style={styles.twoColumns}>
              <label style={styles.label}>
                Număr WhatsApp
                <input
                  type="text"
                  value={settings.whatsapp}
                  onChange={(event) =>
                    updateField(
                      "whatsapp",
                      event.target.value
                    )
                  }
                  placeholder="40722123456"
                  style={styles.input}
                />

                <span style={styles.helpText}>
                  Scrie numărul cu prefixul țării și fără
                  spații.
                </span>
              </label>

              <label style={styles.label}>
                Facebook
                <input
                  type="url"
                  value={settings.facebook}
                  onChange={(event) =>
                    updateField(
                      "facebook",
                      event.target.value
                    )
                  }
                  placeholder="https://facebook.com/..."
                  style={styles.input}
                />
              </label>
            </div>

            <label style={styles.label}>
              Instagram
              <input
                type="url"
                value={settings.instagram}
                onChange={(event) =>
                  updateField(
                    "instagram",
                    event.target.value
                  )
                }
                placeholder="https://instagram.com/..."
                style={styles.input}
              />
            </label>

            <div style={styles.divider} />

            <label style={styles.label}>
              Titlul principal al site-ului
              <input
                type="text"
                value={settings.hero_title}
                onChange={(event) =>
                  updateField(
                    "hero_title",
                    event.target.value
                  )
                }
                placeholder="VIRELLO"
                style={styles.input}
              />
            </label>

            <label style={styles.label}>
              Descrierea principală
              <textarea
                value={settings.hero_description}
                onChange={(event) =>
                  updateField(
                    "hero_description",
                    event.target.value
                  )
                }
                placeholder="Textul principal afișat pe prima pagină..."
                rows={6}
                style={styles.textarea}
              />
            </label>

            {errorMessage && (
              <div style={styles.errorBox}>
                {errorMessage}
              </div>
            )}

            {message && (
              <div style={styles.successBox}>
                {message}
              </div>
            )}

            <button
              type="submit"
              disabled={saving}
              style={{
                ...styles.primaryButton,
                opacity: saving ? 0.6 : 1,
              }}
            >
              {saving
                ? "Se salvează..."
                : "Salvează modificările"}
            </button>
          </form>
        )}
      </section>
    </main>
  );
}

const styles: Record<string, CSSProperties> = {
  loadingPage: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#080808",
    color: "#d9b632",
    fontFamily: "Arial, sans-serif",
  },

  page: {
    minHeight: "100vh",
    padding: "32px",
    background:
      "radial-gradient(circle at top, #211d10 0%, #101010 35%, #070707 100%)",
    color: "#ffffff",
    fontFamily: "Arial, sans-serif",
  },

  header: {
    maxWidth: "1100px",
    margin: "0 auto 28px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "24px",
    padding: "24px 28px",
    border: "1px solid rgba(217, 182, 50, 0.35)",
    borderRadius: "16px",
    background: "rgba(15, 15, 15, 0.95)",
    flexWrap: "wrap",
  },

  eyebrow: {
    margin: "0 0 7px",
    color: "#d9b632",
    fontSize: "11px",
    fontWeight: 800,
    letterSpacing: "2px",
  },

  logo: {
    margin: 0,
    color: "#d9b632",
    fontSize: "32px",
    letterSpacing: "6px",
  },

  subtitle: {
    margin: "8px 0 0",
    color: "#989898",
  },

  accountArea: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    flexWrap: "wrap",
  },

  accountBox: {
    display: "flex",
    flexDirection: "column",
    gap: "5px",
    padding: "11px 14px",
    border: "1px solid #303030",
    borderRadius: "9px",
    background: "#151515",
  },

  accountLabel: {
    color: "#888888",
    fontSize: "10px",
    textTransform: "uppercase",
    letterSpacing: "1px",
  },

  accountEmail: {
    color: "#d9b632",
    fontSize: "13px",
  },

  secondaryButton: {
    padding: "13px 17px",
    border: "1px solid rgba(217, 182, 50, 0.45)",
    borderRadius: "9px",
    background: "rgba(217, 182, 50, 0.08)",
    color: "#d9b632",
    cursor: "pointer",
    fontWeight: 700,
  },

  logoutButton: {
    padding: "13px 17px",
    border: "1px solid #414141",
    borderRadius: "9px",
    background: "#1b1b1b",
    color: "#ffffff",
    cursor: "pointer",
    fontWeight: 700,
  },

  container: {
    maxWidth: "1100px",
    margin: "0 auto",
    padding: "28px",
    border: "1px solid rgba(217, 182, 50, 0.35)",
    borderRadius: "16px",
    background: "#101010",
  },

  sectionHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "20px",
    marginBottom: "28px",
    flexWrap: "wrap",
  },

  sectionEyebrow: {
    margin: "0 0 7px",
    color: "#d9b632",
    fontSize: "10px",
    fontWeight: 800,
    letterSpacing: "2px",
  },

  sectionTitle: {
    margin: 0,
    fontSize: "25px",
  },

  sectionDescription: {
    margin: "9px 0 0",
    color: "#929292",
    lineHeight: 1.6,
  },

  refreshButton: {
    padding: "10px 14px",
    border: "1px solid rgba(217, 182, 50, 0.45)",
    borderRadius: "8px",
    background: "rgba(217, 182, 50, 0.08)",
    color: "#d9b632",
    cursor: "pointer",
    fontWeight: 700,
  },

  loadingBox: {
    padding: "40px",
    border: "1px dashed #383838",
    borderRadius: "12px",
    color: "#999999",
    textAlign: "center",
  },

  form: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },

  twoColumns: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(260px, 1fr))",
    gap: "18px",
  },

  label: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    color: "#e4e4e4",
    fontSize: "13px",
    fontWeight: 700,
  },

  input: {
    width: "100%",
    boxSizing: "border-box",
    padding: "14px",
    border: "1px solid #363636",
    borderRadius: "9px",
    outline: "none",
    background: "#191919",
    color: "#ffffff",
    fontSize: "14px",
  },

  textarea: {
    width: "100%",
    boxSizing: "border-box",
    resize: "vertical",
    padding: "14px",
    border: "1px solid #363636",
    borderRadius: "9px",
    outline: "none",
    background: "#191919",
    color: "#ffffff",
    fontFamily: "Arial, sans-serif",
    fontSize: "14px",
    lineHeight: 1.6,
  },

  helpText: {
    color: "#858585",
    fontSize: "11px",
    fontWeight: 400,
  },

  divider: {
    height: "1px",
    margin: "7px 0",
    background: "#292929",
  },

  errorBox: {
    padding: "13px",
    border: "1px solid rgba(255, 85, 85, 0.45)",
    borderRadius: "9px",
    background: "rgba(255, 50, 50, 0.08)",
    color: "#ff9999",
    fontSize: "13px",
    lineHeight: 1.5,
  },

  successBox: {
    padding: "13px",
    border: "1px solid rgba(70, 200, 110, 0.4)",
    borderRadius: "9px",
    background: "rgba(70, 200, 110, 0.08)",
    color: "#82dfa1",
    fontSize: "13px",
  },

  primaryButton: {
    width: "100%",
    padding: "16px",
    border: "none",
    borderRadius: "9px",
    background: "#d9b632",
    color: "#080808",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: 800,
  },
};