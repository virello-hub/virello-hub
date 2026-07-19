import StaticPage from "../components/StaticPage";

export default function TermeniPage() {
  return (
    <StaticPage
      eyebrow="Informații legale"
      title="Termeni și condiții"
      description="Această pagină va conține condițiile complete de utilizare și cumpărare din magazinul Virello."
    >
      <p className="leading-8 text-neutral-400">
        Textul juridic final trebuie completat înainte de lansarea magazinului,
        folosind datele reale ale firmei și politicile comerciale aplicabile.
      </p>
    </StaticPage>
  );
}