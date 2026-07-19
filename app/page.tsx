"use client";

import {
  ChangeEvent,
  FormEvent,
  useEffect,
  useState,
} from "react";
import type { CSSProperties } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";

type Tab = "dashboard" | "products" | "homepage" | "settings";

type Product = {
  id: number;
  product_code: string | null;
  name: string;
  slug: string;
  category: string;
  price: number;
  old_price: number | null;
  description: string | null;
  badge: string | null;
  stock: number;
  image_url: string | null;
  active: boolean;
};

type ProductForm = {
  name: string;
  category: string;
  price: string;
  oldPrice: string;
  description: string;
  badge: string;
  stock: string;
  imageUrl: string;
  active: boolean;
};

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
  hero_image_url: string;
  hero_button_text: string;
  hero_button_link: string;
  featured_title: string;
  featured_description: string;
};

const emptyProductForm: ProductForm = {
  name: "",
  category: "",
  price: "",
  oldPrice: "",
  description: "",
  badge: "",
  stock: "0",
  imageUrl: "",
  active: true,
};

const defaultSettings: SiteSettings = {
  id: 1,
  phone: "",
  email: "",
  address: "",
  whatsapp: "",
  facebook: "",
  instagram: "",
  hero_title: "VIRELLO",
  hero_description: "Descoperă produsele noastre.",
  hero_image_url: "",
  hero_button_text: "Vezi produsele",
  hero_button_link: "#produse",
  featured_title: "Produse recomandate",
  featured_description: "Descoperă selecția noastră de produse.",
};

export default function AdminPage() {
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<Tab>("dashboard");
  const [userEmail, setUserEmail] = useState("");
  const [checkingUser, setCheckingUser] = useState(true);

  const [products, setProducts] = useState<Product[]>([]);
  const [productForm, setProductForm] =
    useState<ProductForm>(emptyProductForm);
  const [editingProductId, setEditingProductId] =
    useState<number | null>(null);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [savingProduct, setSavingProduct] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  const [settings, setSettings] =
    useState<SiteSettings>(defaultSettings);
  const [loadingSettings, setLoadingSettings] = useState(true);
  const [savingSettings, setSavingSettings] = useState(false);
  const [uploadingHero, setUploadingHero] = useState(false);

  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function initializeAdmin() {
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

      await Promise.all([loadProducts(), loadSettings()]);
    }

    initializeAdmin();
  }, [router]);

  function clearMessages() {
    setMessage("");
    setErrorMessage("");
  }

  function selectTab(tab: Tab) {
    clearMessages();
    setActiveTab(tab);
  }

  async function loadProducts() {
    setLoadingProducts(true);

    const { data, error } = await supabase
      .from("products")
      .select(
        "id, product_code, name, slug, category, price, old_price, description, badge, stock, image_url, active"
      )
      .order("id", { ascending: false });

    if (error) {
      setErrorMessage(
        `Produsele nu au putut fi încărcate: ${error.message}`
      );
      setLoadingProducts(false);
      return;
    }

    setProducts((data ?? []) as Product[]);
    setLoadingProducts(false);
  }

  async function loadSettings() {
    setLoadingSettings(true);

    const { data, error } = await supabase
      .from("site_settings")
      .select(
        "id, phone, email, address, whatsapp, facebook, instagram, hero_title, hero_description, hero_image_url, hero_button_text, hero_button_link, featured_title, featured_description"
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
        hero_image_url: data.hero_image_url ?? "",
        hero_button_text: data.hero_button_text ?? "",
        hero_button_link: data.hero_button_link ?? "",
        featured_title: data.featured_title ?? "",
        featured_description: data.featured_description ?? "",
      });
    }

    setLoadingSettings(false);
  }

  function createSlug(value: string) {
    return value
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }

  async function generateNextProductCode() {
    const { data, error } = await supabase
      .from("products")
      .select("product_code")
      .not("product_code", "is", null)
      .order("product_code", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      throw new Error(
        `Codul produsului nu a putut fi generat: ${error.message}`
      );
    }

    const lastCode = data?.product_code ?? "VR0000";
    const lastNumber = Number(lastCode.replace(/\D/g, "")) || 0;
    const nextNumber = lastNumber + 1;

    if (nextNumber > 9999) {
      throw new Error(
        "Ai ajuns la limita de 9999 de coduri de produs."
      );
    }

    return `VR${String(nextNumber).padStart(4, "0")}`;
  }

  function updateProductForm<K extends keyof ProductForm>(
    field: K,
    value: ProductForm[K]
  ) {
    setProductForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function resetProductForm() {
    setProductForm(emptyProductForm);
    setEditingProductId(null);
    clearMessages();
  }

  async function handleImageUpload(
    event: ChangeEvent<HTMLInputElement>
  ) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    clearMessages();

    if (!file.type.startsWith("image/")) {
      setErrorMessage("Alege un fișier imagine.");
      event.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrorMessage("Imaginea trebuie să fie mai mică de 5 MB.");
      event.target.value = "";
      return;
    }

    setUploadingImage(true);

    const extension =
      file.name.split(".").pop()?.toLowerCase() || "jpg";
    const originalName = file.name.replace(/\.[^/.]+$/, "");
    const safeName = createSlug(originalName) || "produs";
    const filePath = `imagini/${Date.now()}-${safeName}.${extension}`;

    const { error: uploadError } = await supabase.storage
      .from("products")
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
        contentType: file.type,
      });

    if (uploadError) {
      setErrorMessage(
        `Imaginea nu a putut fi încărcată: ${uploadError.message}`
      );
      setUploadingImage(false);
      event.target.value = "";
      return;
    }

    const { data } = supabase.storage
      .from("products")
      .getPublicUrl(filePath);

    updateProductForm("imageUrl", data.publicUrl);
    setMessage("Imaginea a fost încărcată.");
    setUploadingImage(false);
    event.target.value = "";
  }

  async function handleProductSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();
    clearMessages();

    const price = Number(productForm.price);
    const stock = Number(productForm.stock);
    const oldPrice =
      productForm.oldPrice.trim() === ""
        ? null
        : Number(productForm.oldPrice);

    if (!productForm.name.trim()) {
      setErrorMessage("Introdu numele produsului.");
      return;
    }

    if (!productForm.category.trim()) {
      setErrorMessage("Introdu categoria produsului.");
      return;
    }

    if (!Number.isFinite(price) || price < 0) {
      setErrorMessage("Introdu un preț valid.");
      return;
    }

    if (!Number.isInteger(stock) || stock < 0) {
      setErrorMessage("Introdu un stoc valid.");
      return;
    }

    if (
      oldPrice !== null &&
      (!Number.isFinite(oldPrice) || oldPrice < 0)
    ) {
      setErrorMessage("Introdu un preț vechi valid.");
      return;
    }

    if (!productForm.imageUrl) {
      setErrorMessage("Încarcă o imagine pentru produs.");
      return;
    }

    setSavingProduct(true);

    const productData = {
      name: productForm.name.trim(),
      slug: createSlug(productForm.name),
      category: productForm.category.trim(),
      price,
      old_price: oldPrice,
      description: productForm.description.trim() || null,
      badge: productForm.badge.trim() || null,
      stock,
      image_url: productForm.imageUrl,
      active: productForm.active,
    };

    if (editingProductId !== null) {
      const { error } = await supabase
        .from("products")
        .update(productData)
        .eq("id", editingProductId);

      if (error) {
        setErrorMessage(
          `Produsul nu a putut fi modificat: ${error.message}`
        );
        setSavingProduct(false);
        return;
      }

      setMessage("Produsul a fost modificat.");
    } else {
      let productCode = "";

      try {
        productCode = await generateNextProductCode();
      } catch (error) {
        setErrorMessage(
          error instanceof Error
            ? error.message
            : "Codul produsului nu a putut fi generat."
        );
        setSavingProduct(false);
        return;
      }

      const { error } = await supabase
        .from("products")
        .insert({
          ...productData,
          product_code: productCode,
        });

      if (error) {
        setErrorMessage(
          `Produsul nu a putut fi adăugat: ${error.message}`
        );
        setSavingProduct(false);
        return;
      }

      setMessage(`Produsul a fost adăugat cu codul ${productCode}.`);
    }

    setProductForm(emptyProductForm);
    setEditingProductId(null);
    setSavingProduct(false);
    await loadProducts();
  }

  function handleEditProduct(product: Product) {
    selectTab("products");
    setEditingProductId(product.id);
    setProductForm({
      name: product.name,
      category: product.category,
      price: String(product.price),
      oldPrice:
        product.old_price === null
          ? ""
          : String(product.old_price),
      description: product.description ?? "",
      badge: product.badge ?? "",
      stock: String(product.stock),
      imageUrl: product.image_url ?? "",
      active: product.active,
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleDeleteProduct(product: Product) {
    const confirmed = window.confirm(
      `Sigur vrei să ștergi produsul „${product.name}”?`
    );

    if (!confirmed) {
      return;
    }

    clearMessages();

    const { error } = await supabase
      .from("products")
      .delete()
      .eq("id", product.id);

    if (error) {
      setErrorMessage(
        `Produsul nu a putut fi șters: ${error.message}`
      );
      return;
    }

    if (editingProductId === product.id) {
      resetProductForm();
    }

    setMessage("Produsul a fost șters.");
    await loadProducts();
  }

  function updateSetting(
    field: keyof SiteSettings,
    value: string
  ) {
    setSettings((current) => ({
      ...current,
      [field]: value,
    }));
  }

  async function handleHeroImageUpload(
    event: ChangeEvent<HTMLInputElement>
  ) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    clearMessages();

    if (!file.type.startsWith("image/")) {
      setErrorMessage("Alege un fișier imagine.");
      event.target.value = "";
      return;
    }

    if (file.size > 8 * 1024 * 1024) {
      setErrorMessage("Imaginea trebuie să fie mai mică de 8 MB.");
      event.target.value = "";
      return;
    }

    setUploadingHero(true);

    const extension =
      file.name.split(".").pop()?.toLowerCase() || "jpg";
    const originalName = file.name.replace(/\.[^/.]+$/, "");
    const safeName = createSlug(originalName) || "banner";
    const filePath = `site/${Date.now()}-${safeName}.${extension}`;

    const { error: uploadError } = await supabase.storage
      .from("products")
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
        contentType: file.type,
      });

    if (uploadError) {
      setErrorMessage(
        `Imaginea principală nu a putut fi încărcată: ${uploadError.message}`
      );
      setUploadingHero(false);
      event.target.value = "";
      return;
    }

    const { data } = supabase.storage
      .from("products")
      .getPublicUrl(filePath);

    updateSetting("hero_image_url", data.publicUrl);
    setMessage("Imaginea principală a fost încărcată.");
    setUploadingHero(false);
    event.target.value = "";
  }

  async function handleSettingsSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();
    clearMessages();
    setSavingSettings(true);

    const payload = {
      id: 1,
      phone: settings.phone.trim(),
      email: settings.email.trim(),
      address: settings.address.trim(),
      whatsapp: settings.whatsapp.trim(),
      facebook: settings.facebook.trim(),
      instagram: settings.instagram.trim(),
      hero_title: settings.hero_title.trim(),
      hero_description: settings.hero_description.trim(),
      hero_image_url: settings.hero_image_url.trim(),
      hero_button_text: settings.hero_button_text.trim(),
      hero_button_link: settings.hero_button_link.trim(),
      featured_title: settings.featured_title.trim(),
      featured_description: settings.featured_description.trim(),
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase
      .from("site_settings")
      .upsert(payload, { onConflict: "id" });

    if (error) {
      setErrorMessage(
        `Setările nu au putut fi salvate: ${error.message}`
      );
      setSavingSettings(false);
      return;
    }

    setMessage("Setările site-ului au fost salvate.");
    setSavingSettings(false);
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
        Se verifică autentificarea...
      </main>
    );
  }

  return (
    <main style={styles.page}>
      <aside style={styles.sidebar}>
        <div>
          <p style={styles.eyebrow}>ADMINISTRARE</p>
          <h1 style={styles.logo}>VIRELLO</h1>
          <p style={styles.sidebarText}>
            Controlează site-ul dintr-un singur loc.
          </p>
        </div>

        <nav style={styles.navigation}>
          <NavButton
            active={activeTab === "dashboard"}
            onClick={() => selectTab("dashboard")}
          >
            Dashboard
          </NavButton>

          <NavButton
            active={activeTab === "products"}
            onClick={() => selectTab("products")}
          >
            Produse
          </NavButton>

          <NavButton
            active={activeTab === "homepage"}
            onClick={() => selectTab("homepage")}
          >
            Pagina principală
          </NavButton>

          <NavButton
            active={activeTab === "settings"}
            onClick={() => selectTab("settings")}
          >
            Setări site
          </NavButton>
        </nav>

        <div style={styles.sidebarBottom}>
          <span style={styles.accountLabel}>Autentificat ca</span>
          <strong style={styles.accountEmail}>{userEmail}</strong>

          <button
            type="button"
            onClick={() => router.push("/")}
            style={styles.viewSiteButton}
          >
            Vezi site-ul
          </button>

          <button
            type="button"
            onClick={handleLogout}
            style={styles.logoutButton}
          >
            Deconectare
          </button>
        </div>
      </aside>

      <section style={styles.content}>
        <header style={styles.topbar}>
          <div>
            <p style={styles.sectionEyebrow}>
              PANOU DE CONTROL
            </p>
            <h2 style={styles.pageTitle}>
              {activeTab === "dashboard" && "Dashboard"}
              {activeTab === "products" && "Produse"}
              {activeTab === "homepage" && "Pagina principală"}
              {activeTab === "settings" && "Setări site"}
            </h2>
          </div>

          <span style={styles.statusBadge}>ONLINE</span>
        </header>

        {errorMessage && (
          <div style={styles.errorBox}>{errorMessage}</div>
        )}

        {message && (
          <div style={styles.successBox}>{message}</div>
        )}

        {activeTab === "dashboard" && (
          <Dashboard
            products={products}
            settings={settings}
            onProducts={() => selectTab("products")}
            onSettings={() => selectTab("settings")}
          />
        )}

        {activeTab === "products" && (
          <ProductsPanel
            products={products}
            form={productForm}
            editingId={editingProductId}
            loading={loadingProducts}
            saving={savingProduct}
            uploading={uploadingImage}
            onSubmit={handleProductSubmit}
            onUpdate={updateProductForm}
            onUpload={handleImageUpload}
            onReset={resetProductForm}
            onReload={loadProducts}
            onEdit={handleEditProduct}
            onDelete={handleDeleteProduct}
          />
        )}

        {activeTab === "homepage" && (
          <HomepagePanel
            settings={settings}
            loading={loadingSettings}
            saving={savingSettings}
            uploading={uploadingHero}
            onSubmit={handleSettingsSubmit}
            onUpdate={updateSetting}
            onUpload={handleHeroImageUpload}
            onReload={loadSettings}
          />
        )}

        {activeTab === "settings" && (
          <SettingsPanel
            settings={settings}
            loading={loadingSettings}
            saving={savingSettings}
            onSubmit={handleSettingsSubmit}
            onUpdate={updateSetting}
            onReload={loadSettings}
          />
        )}
      </section>
    </main>
  );
}

function NavButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        ...styles.navButton,
        ...(active ? styles.navButtonActive : {}),
      }}
    >
      {children}
    </button>
  );
}

function Dashboard({
  products,
  settings,
  onProducts,
  onSettings,
}: {
  products: Product[];
  settings: SiteSettings;
  onProducts: () => void;
  onSettings: () => void;
}) {
  const activeProducts = products.filter(
    (product) => product.active
  ).length;

  return (
    <>
      <div style={styles.statGrid}>
        <StatCard
          label="Produse totale"
          value={String(products.length)}
        />
        <StatCard
          label="Produse active"
          value={String(activeProducts)}
        />
        <StatCard
          label="Telefon site"
          value={settings.phone || "Nesetat"}
        />
      </div>

      <div style={styles.dashboardGrid}>
        <section style={styles.card}>
          <p style={styles.sectionEyebrow}>ACȚIUNI RAPIDE</p>
          <h3 style={styles.cardTitle}>Administrare magazin</h3>

          <div style={styles.quickActions}>
            <button
              type="button"
              onClick={onProducts}
              style={styles.primaryButton}
            >
              Adaugă sau modifică produse
            </button>

            <button
              type="button"
              onClick={onSettings}
              style={styles.secondaryButton}
            >
              Modifică telefonul și textele
            </button>
          </div>
        </section>

        <section style={styles.card}>
          <p style={styles.sectionEyebrow}>SITE</p>
          <h3 style={styles.cardTitle}>
            {settings.hero_title || "VIRELLO"}
          </h3>
          <p style={styles.mutedText}>
            {settings.hero_description ||
              "Descrierea principală nu este setată."}
          </p>
        </section>
      </div>
    </>
  );
}

function StatCard({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <article style={styles.statCard}>
      <span style={styles.statLabel}>{label}</span>
      <strong style={styles.statValue}>{value}</strong>
    </article>
  );
}

function ProductsPanel({
  products,
  form,
  editingId,
  loading,
  saving,
  uploading,
  onSubmit,
  onUpdate,
  onUpload,
  onReset,
  onReload,
  onEdit,
  onDelete,
}: {
  products: Product[];
  form: ProductForm;
  editingId: number | null;
  loading: boolean;
  saving: boolean;
  uploading: boolean;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onUpdate: <K extends keyof ProductForm>(
    field: K,
    value: ProductForm[K]
  ) => void;
  onUpload: (event: ChangeEvent<HTMLInputElement>) => void;
  onReset: () => void;
  onReload: () => void;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
}) {
  return (
    <div style={styles.twoPanelLayout}>
      <form onSubmit={onSubmit} style={styles.card}>
        <div style={styles.cardHeader}>
          <div>
            <p style={styles.sectionEyebrow}>
              {editingId === null ? "PRODUS NOU" : "EDITARE"}
            </p>
            <h3 style={styles.cardTitle}>
              {editingId === null
                ? "Adaugă produs"
                : "Modifică produsul"}
            </h3>
          </div>

          {editingId !== null && (
            <button
              type="button"
              onClick={onReset}
              style={styles.smallButton}
            >
              Anulează
            </button>
          )}
        </div>

        <Field
          label="Numele produsului"
          value={form.name}
          onChange={(value) => onUpdate("name", value)}
          placeholder="Exemplu: Ceas Virello"
        />

        <div style={styles.formGrid}>
          <Field
            label="Categorie"
            value={form.category}
            onChange={(value) => onUpdate("category", value)}
            placeholder="Ceasuri"
          />
          <Field
            label="Badge"
            value={form.badge}
            onChange={(value) => onUpdate("badge", value)}
            placeholder="Nou, Reducere"
          />
        </div>

        <div style={styles.formGrid}>
          <Field
            label="Preț"
            value={form.price}
            onChange={(value) => onUpdate("price", value)}
            placeholder="299.99"
            type="number"
          />
          <Field
            label="Preț vechi"
            value={form.oldPrice}
            onChange={(value) => onUpdate("oldPrice", value)}
            placeholder="399.99"
            type="number"
          />
          <Field
            label="Stoc"
            value={form.stock}
            onChange={(value) => onUpdate("stock", value)}
            type="number"
          />
        </div>

        <label style={styles.label}>
          Imagine
          <input
            type="file"
            accept="image/png,image/jpeg,image/webp"
            onChange={onUpload}
            disabled={uploading}
            style={styles.fileInput}
          />
        </label>

        {uploading && (
          <p style={styles.mutedText}>
            Se încarcă imaginea...
          </p>
        )}

        {form.imageUrl && (
          <div style={styles.previewBox}>
            <img
              src={form.imageUrl}
              alt="Previzualizare"
              style={styles.previewImage}
            />
            <button
              type="button"
              onClick={() => onUpdate("imageUrl", "")}
              style={styles.dangerSmallButton}
            >
              Elimină
            </button>
          </div>
        )}

        <label style={styles.label}>
          Descriere
          <textarea
            value={form.description}
            onChange={(event) =>
              onUpdate("description", event.target.value)
            }
            rows={5}
            style={styles.textarea}
          />
        </label>

        <label style={styles.checkboxLabel}>
          <input
            type="checkbox"
            checked={form.active}
            onChange={(event) =>
              onUpdate("active", event.target.checked)
            }
          />
          Produs activ și vizibil
        </label>

        <button
          type="submit"
          disabled={saving || uploading}
          style={styles.primaryButton}
        >
          {saving
            ? "Se salvează..."
            : editingId === null
              ? "Adaugă produsul"
              : "Salvează modificările"}
        </button>
      </form>

      <section style={styles.card}>
        <div style={styles.cardHeader}>
          <div>
            <p style={styles.sectionEyebrow}>PRODUSE</p>
            <h3 style={styles.cardTitle}>
              Lista produselor ({products.length})
            </h3>
          </div>

          <button
            type="button"
            onClick={onReload}
            style={styles.smallButton}
          >
            Reîncarcă
          </button>
        </div>

        {loading ? (
          <p style={styles.mutedText}>Se încarcă...</p>
        ) : products.length === 0 ? (
          <div style={styles.emptyBox}>
            Nu există încă produse.
          </div>
        ) : (
          <div style={styles.productList}>
            {products.map((product) => (
              <article key={product.id} style={styles.productItem}>
                <div style={styles.productImageBox}>
                  {product.image_url ? (
                    <img
                      src={product.image_url}
                      alt={product.name}
                      style={styles.productImage}
                    />
                  ) : (
                    <span>Fără imagine</span>
                  )}
                </div>

                <div style={styles.productInfo}>
                  <div style={styles.productTitleRow}>
                    <strong>{product.name}</strong>
                    <span
                      style={
                        product.active
                          ? styles.activeBadge
                          : styles.inactiveBadge
                      }
                    >
                      {product.active ? "Activ" : "Inactiv"}
                    </span>
                  </div>

                  <p style={styles.productCode}>
                    Cod produs: {product.product_code ?? "Fără cod"}
                  </p>

                  <p style={styles.mutedText}>
                    {product.category} · Stoc {product.stock}
                  </p>

                  <strong style={styles.goldText}>
                    {Number(product.price).toFixed(2)} lei
                  </strong>

                  <div style={styles.actionRow}>
                    <button
                      type="button"
                      onClick={() => onEdit(product)}
                      style={styles.smallButton}
                    >
                      Editează
                    </button>
                    <button
                      type="button"
                      onClick={() => onDelete(product)}
                      style={styles.dangerSmallButton}
                    >
                      Șterge
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}


function HomepagePanel({
  settings,
  loading,
  saving,
  uploading,
  onSubmit,
  onUpdate,
  onUpload,
  onReload,
}: {
  settings: SiteSettings;
  loading: boolean;
  saving: boolean;
  uploading: boolean;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onUpdate: (
    field: keyof SiteSettings,
    value: string
  ) => void;
  onUpload: (event: ChangeEvent<HTMLInputElement>) => void;
  onReload: () => void;
}) {
  if (loading) {
    return <div style={styles.card}>Se încarcă pagina principală...</div>;
  }

  return (
    <form onSubmit={onSubmit} style={styles.card}>
      <div style={styles.cardHeader}>
        <div>
          <p style={styles.sectionEyebrow}>PAGINA PRINCIPALĂ</p>
          <h3 style={styles.cardTitle}>
            Banner, texte și buton
          </h3>
        </div>

        <button
          type="button"
          onClick={onReload}
          style={styles.smallButton}
        >
          Reîncarcă
        </button>
      </div>

      <Field
        label="Titlul principal"
        value={settings.hero_title}
        onChange={(value) => onUpdate("hero_title", value)}
        placeholder="VIRELLO"
      />

      <label style={styles.label}>
        Descrierea principală
        <textarea
          value={settings.hero_description}
          onChange={(event) =>
            onUpdate("hero_description", event.target.value)
          }
          rows={5}
          style={styles.textarea}
        />
      </label>

      <label style={styles.label}>
        Imaginea principală
        <input
          type="file"
          accept="image/png,image/jpeg,image/webp"
          onChange={onUpload}
          disabled={uploading}
          style={styles.fileInput}
        />
      </label>

      {uploading && (
        <p style={styles.mutedText}>
          Se încarcă imaginea principală...
        </p>
      )}

      {settings.hero_image_url && (
        <div style={styles.heroPreviewBox}>
          <img
            src={settings.hero_image_url}
            alt="Imagine principală"
            style={styles.heroPreviewImage}
          />
          <button
            type="button"
            onClick={() => onUpdate("hero_image_url", "")}
            style={styles.dangerSmallButton}
          >
            Elimină imaginea
          </button>
        </div>
      )}

      <div style={styles.formGrid}>
        <Field
          label="Textul butonului"
          value={settings.hero_button_text}
          onChange={(value) => onUpdate("hero_button_text", value)}
          placeholder="Vezi produsele"
        />
        <Field
          label="Linkul butonului"
          value={settings.hero_button_link}
          onChange={(value) => onUpdate("hero_button_link", value)}
          placeholder="#produse"
        />
      </div>

      <hr style={styles.separator} />

      <Field
        label="Titlul secțiunii de produse"
        value={settings.featured_title}
        onChange={(value) => onUpdate("featured_title", value)}
        placeholder="Produse recomandate"
      />

      <label style={styles.label}>
        Descrierea secțiunii de produse
        <textarea
          value={settings.featured_description}
          onChange={(event) =>
            onUpdate("featured_description", event.target.value)
          }
          rows={4}
          style={styles.textarea}
        />
      </label>

      <button
        type="submit"
        disabled={saving || uploading}
        style={styles.primaryButton}
      >
        {saving
          ? "Se salvează..."
          : "Salvează pagina principală"}
      </button>
    </form>
  );
}

function SettingsPanel({
  settings,
  loading,
  saving,
  onSubmit,
  onUpdate,
  onReload,
}: {
  settings: SiteSettings;
  loading: boolean;
  saving: boolean;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onUpdate: (
    field: keyof SiteSettings,
    value: string
  ) => void;
  onReload: () => void;
}) {
  if (loading) {
    return <div style={styles.card}>Se încarcă setările...</div>;
  }

  return (
    <form onSubmit={onSubmit} style={styles.card}>
      <div style={styles.cardHeader}>
        <div>
          <p style={styles.sectionEyebrow}>SETĂRI GENERALE</p>
          <h3 style={styles.cardTitle}>
            Date afișate pe site
          </h3>
        </div>

        <button
          type="button"
          onClick={onReload}
          style={styles.smallButton}
        >
          Reîncarcă
        </button>
      </div>

      <div style={styles.formGrid}>
        <Field
          label="Telefon"
          value={settings.phone}
          onChange={(value) => onUpdate("phone", value)}
          placeholder="0722 123 456"
        />
        <Field
          label="Email"
          value={settings.email}
          onChange={(value) => onUpdate("email", value)}
          placeholder="contact@virello.ro"
          type="email"
        />
      </div>

      <Field
        label="Adresă"
        value={settings.address}
        onChange={(value) => onUpdate("address", value)}
        placeholder="Strada, numărul, orașul"
      />

      <div style={styles.formGrid}>
        <Field
          label="WhatsApp"
          value={settings.whatsapp}
          onChange={(value) => onUpdate("whatsapp", value)}
          placeholder="40722123456"
        />
        <Field
          label="Facebook"
          value={settings.facebook}
          onChange={(value) => onUpdate("facebook", value)}
          placeholder="https://facebook.com/..."
          type="url"
        />
        <Field
          label="Instagram"
          value={settings.instagram}
          onChange={(value) => onUpdate("instagram", value)}
          placeholder="https://instagram.com/..."
          type="url"
        />
      </div>

      <Field
        label="Titlul principal"
        value={settings.hero_title}
        onChange={(value) => onUpdate("hero_title", value)}
        placeholder="VIRELLO"
      />

      <label style={styles.label}>
        Descrierea principală
        <textarea
          value={settings.hero_description}
          onChange={(event) =>
            onUpdate("hero_description", event.target.value)
          }
          rows={6}
          style={styles.textarea}
        />
      </label>

      <button
        type="submit"
        disabled={saving}
        style={styles.primaryButton}
      >
        {saving
          ? "Se salvează..."
          : "Salvează setările site-ului"}
      </button>
    </form>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <label style={styles.label}>
      {label}
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        min={type === "number" ? "0" : undefined}
        step={type === "number" ? "0.01" : undefined}
        style={styles.input}
      />
    </label>
  );
}

const styles: Record<string, CSSProperties> = {
  loadingPage: {
    minHeight: "100vh",
    display: "grid",
    placeItems: "center",
    background: "#080808",
    color: "#d9b632",
    fontFamily: "Arial, sans-serif",
  },
  page: {
    minHeight: "100vh",
    display: "grid",
    gridTemplateColumns: "260px minmax(0, 1fr)",
    background: "#080808",
    color: "#ffffff",
    fontFamily: "Arial, sans-serif",
  },
  sidebar: {
    position: "sticky",
    top: 0,
    height: "100vh",
    boxSizing: "border-box",
    padding: "28px 22px",
    display: "flex",
    flexDirection: "column",
    borderRight: "1px solid #292929",
    background: "#0d0d0d",
  },
  eyebrow: {
    margin: "0 0 8px",
    color: "#d9b632",
    fontSize: "10px",
    fontWeight: 800,
    letterSpacing: "2px",
  },
  logo: {
    margin: 0,
    color: "#d9b632",
    fontSize: "29px",
    letterSpacing: "5px",
  },
  sidebarText: {
    margin: "10px 0 0",
    color: "#777777",
    fontSize: "12px",
    lineHeight: 1.6,
  },
  navigation: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    marginTop: "35px",
  },
  navButton: {
    width: "100%",
    padding: "13px 14px",
    border: "1px solid transparent",
    borderRadius: "9px",
    background: "transparent",
    color: "#a8a8a8",
    textAlign: "left",
    cursor: "pointer",
    fontWeight: 700,
  },
  navButtonActive: {
    border: "1px solid rgba(217, 182, 50, 0.45)",
    background: "rgba(217, 182, 50, 0.1)",
    color: "#d9b632",
  },
  sidebarBottom: {
    marginTop: "auto",
    display: "flex",
    flexDirection: "column",
    gap: "9px",
  },
  accountLabel: {
    color: "#777777",
    fontSize: "10px",
    textTransform: "uppercase",
    letterSpacing: "1px",
  },
  accountEmail: {
    marginBottom: "8px",
    color: "#d9b632",
    fontSize: "12px",
    overflowWrap: "anywhere",
  },
  viewSiteButton: {
    padding: "11px",
    border: "1px solid rgba(217, 182, 50, 0.45)",
    borderRadius: "8px",
    background: "transparent",
    color: "#d9b632",
    cursor: "pointer",
    fontWeight: 700,
  },
  logoutButton: {
    padding: "11px",
    border: "1px solid #393939",
    borderRadius: "8px",
    background: "#171717",
    color: "#ffffff",
    cursor: "pointer",
    fontWeight: 700,
  },
  content: {
    minWidth: 0,
    padding: "30px",
    background:
      "radial-gradient(circle at top, #211d10 0%, #101010 35%, #080808 100%)",
  },
  topbar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "24px",
    padding: "22px 24px",
    border: "1px solid #292929",
    borderRadius: "14px",
    background: "rgba(15, 15, 15, 0.95)",
  },
  sectionEyebrow: {
    margin: "0 0 7px",
    color: "#d9b632",
    fontSize: "10px",
    fontWeight: 800,
    letterSpacing: "2px",
  },
  pageTitle: {
    margin: 0,
    fontSize: "27px",
  },
  statusBadge: {
    padding: "7px 10px",
    borderRadius: "7px",
    background: "rgba(70, 200, 110, 0.1)",
    color: "#78d997",
    fontSize: "10px",
    fontWeight: 800,
  },
  statGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))",
    gap: "16px",
    marginBottom: "20px",
  },
  statCard: {
    padding: "22px",
    border: "1px solid #292929",
    borderRadius: "13px",
    background: "#111111",
  },
  statLabel: {
    display: "block",
    marginBottom: "10px",
    color: "#858585",
    fontSize: "11px",
    textTransform: "uppercase",
    letterSpacing: "1px",
  },
  statValue: {
    color: "#d9b632",
    fontSize: "22px",
  },
  dashboardGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "20px",
  },
  twoPanelLayout: {
    display: "grid",
    gridTemplateColumns: "minmax(330px, 500px) minmax(420px, 1fr)",
    gap: "20px",
    alignItems: "start",
  },
  card: {
    padding: "24px",
    border: "1px solid #292929",
    borderRadius: "14px",
    background: "#111111",
  },
  cardHeader: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: "14px",
    marginBottom: "22px",
  },
  cardTitle: {
    margin: 0,
    fontSize: "22px",
  },
  quickActions: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    marginTop: "22px",
  },
  primaryButton: {
    width: "100%",
    padding: "14px",
    border: "none",
    borderRadius: "9px",
    background: "#d9b632",
    color: "#080808",
    cursor: "pointer",
    fontWeight: 800,
  },
  secondaryButton: {
    width: "100%",
    padding: "14px",
    border: "1px solid rgba(217, 182, 50, 0.5)",
    borderRadius: "9px",
    background: "rgba(217, 182, 50, 0.08)",
    color: "#d9b632",
    cursor: "pointer",
    fontWeight: 800,
  },
  smallButton: {
    padding: "8px 11px",
    border: "1px solid rgba(217, 182, 50, 0.45)",
    borderRadius: "7px",
    background: "transparent",
    color: "#d9b632",
    cursor: "pointer",
    fontWeight: 700,
  },
  dangerSmallButton: {
    padding: "8px 11px",
    border: "1px solid rgba(255, 80, 80, 0.45)",
    borderRadius: "7px",
    background: "transparent",
    color: "#ff8585",
    cursor: "pointer",
    fontWeight: 700,
  },
  formGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: "14px",
  },
  label: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    marginBottom: "16px",
    color: "#dddddd",
    fontSize: "13px",
    fontWeight: 700,
  },
  input: {
    width: "100%",
    boxSizing: "border-box",
    padding: "12px 13px",
    border: "1px solid #363636",
    borderRadius: "8px",
    outline: "none",
    background: "#191919",
    color: "#ffffff",
  },
  textarea: {
    width: "100%",
    boxSizing: "border-box",
    padding: "12px 13px",
    border: "1px solid #363636",
    borderRadius: "8px",
    outline: "none",
    resize: "vertical",
    background: "#191919",
    color: "#ffffff",
    fontFamily: "Arial, sans-serif",
  },
  fileInput: {
    width: "100%",
    boxSizing: "border-box",
    padding: "11px",
    border: "1px dashed rgba(217, 182, 50, 0.5)",
    borderRadius: "8px",
    background: "#191919",
    color: "#ffffff",
  },
  checkboxLabel: {
    display: "flex",
    alignItems: "center",
    gap: "9px",
    marginBottom: "17px",
    color: "#cccccc",
    fontSize: "13px",
  },
  previewBox: {
    display: "flex",
    alignItems: "center",
    gap: "13px",
    marginBottom: "16px",
    padding: "10px",
    border: "1px solid #333333",
    borderRadius: "9px",
  },
  previewImage: {
    width: "95px",
    height: "95px",
    objectFit: "cover",
    borderRadius: "7px",
  },
  heroPreviewBox: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    marginBottom: "18px",
    padding: "12px",
    border: "1px solid #333333",
    borderRadius: "10px",
    background: "#151515",
  },
  heroPreviewImage: {
    width: "100%",
    maxHeight: "360px",
    objectFit: "cover",
    borderRadius: "8px",
  },
  separator: {
    margin: "26px 0",
    border: "none",
    borderTop: "1px solid #303030",
  },
  productList: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  productItem: {
    display: "flex",
    gap: "14px",
    padding: "13px",
    border: "1px solid #292929",
    borderRadius: "10px",
    background: "#161616",
  },
  productImageBox: {
    width: "90px",
    minWidth: "90px",
    height: "90px",
    display: "grid",
    placeItems: "center",
    overflow: "hidden",
    borderRadius: "8px",
    background: "#242424",
    color: "#777777",
    fontSize: "10px",
  },
  productImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  productInfo: {
    minWidth: 0,
    flex: 1,
  },
  productTitleRow: {
    display: "flex",
    justifyContent: "space-between",
    gap: "10px",
  },
  actionRow: {
    display: "flex",
    gap: "8px",
    marginTop: "12px",
  },
  activeBadge: {
    padding: "4px 7px",
    borderRadius: "6px",
    background: "rgba(70, 200, 110, 0.1)",
    color: "#78d997",
    fontSize: "9px",
    fontWeight: 800,
  },
  inactiveBadge: {
    padding: "4px 7px",
    borderRadius: "6px",
    background: "rgba(255, 100, 100, 0.1)",
    color: "#ff9292",
    fontSize: "9px",
    fontWeight: 800,
  },
  productCode: {
    margin: "8px 0 0",
    color: "#d9b632",
    fontSize: "12px",
    fontWeight: 800,
    letterSpacing: "0.8px",
  },
  mutedText: {
    color: "#8d8d8d",
    fontSize: "13px",
    lineHeight: 1.6,
  },
  goldText: {
    color: "#d9b632",
  },
  emptyBox: {
    padding: "30px",
    border: "1px dashed #383838",
    borderRadius: "10px",
    color: "#888888",
    textAlign: "center",
  },
  errorBox: {
    marginBottom: "18px",
    padding: "13px",
    border: "1px solid rgba(255, 85, 85, 0.45)",
    borderRadius: "9px",
    background: "rgba(255, 50, 50, 0.08)",
    color: "#ff9999",
    fontSize: "13px",
  },
  successBox: {
    marginBottom: "18px",
    padding: "13px",
    border: "1px solid rgba(70, 200, 110, 0.4)",
    borderRadius: "9px",
    background: "rgba(70, 200, 110, 0.08)",
    color: "#82dfa1",
    fontSize: "13px",
  },
};