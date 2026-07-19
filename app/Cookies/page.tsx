import StaticPage from "../components/StaticPage";

export default function CookiesPage() {
  return (
    <StaticPage
      eyebrow="Preferințele tale"
      title="Politica privind cookie-urile"
      description="Această pagină va explica tipurile de cookie-uri utilizate de magazinul Virello."
    >
      <p className="leading-8 text-neutral-400">
        Informațiile finale vor fi adăugate după instalarea sistemelor de
        analiză, publicitate și administrare a consimțământului.
      </p>
    </StaticPage>
  );
}