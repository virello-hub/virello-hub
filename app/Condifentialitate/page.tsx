import StaticPage from "../components/StaticPage";

export default function ConfidentialitatePage() {
  return (
    <StaticPage
      eyebrow="Protecția datelor"
      title="Politica de confidențialitate"
      description="Aici vor fi explicate modul de colectare, utilizare și protejare a datelor personale."
    >
      <p className="leading-8 text-neutral-400">
        Politica finală va fi completată înainte de lansare, după stabilirea
        serviciilor de plată, livrare, analiză și comunicare folosite de magazin.
      </p>
    </StaticPage>
  );
}