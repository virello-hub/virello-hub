import StaticPage from "../components/StaticPage";

export default function ConfidentialitatePage() {
  return (
    <StaticPage
      eyebrow="Protecția datelor"
      title="Politica de confidențialitate"
      description="Informații privind prelucrarea datelor personale pe www.virellohub.ro."
    >
      <div className="space-y-8 text-neutral-300">
        <section><h2 className="text-xl font-semibold text-white">Operatorul datelor</h2><p className="mt-3 leading-8">Operatorul datelor este VIRELLO HUB S.R.L., CUI 55334393, nr. Registrul Comerțului J2026047281006, cu sediul în București, Sector 3, Bulevardul 1 Decembrie 1918, Nr. 27B, Bl. PM 74, Scara 1, Etaj 5, Ap. 35. Contact: 0773242794, virello2hub@gmail.com.</p></section>
        <section><h2 className="text-xl font-semibold text-white">Ce date putem prelucra</h2><p className="mt-3 leading-8">În funcție de serviciile utilizate, putem prelucra numele, datele de contact, adresa de livrare și facturare, informații despre comandă, comunicările cu magazinul și date tehnice necesare funcționării și securității site-ului.</p></section>
        <section><h2 className="text-xl font-semibold text-white">Scopuri și temeiuri</h2><p className="mt-3 leading-8">Datele sunt utilizate pentru preluarea și executarea comenzilor, livrare, facturare, relația cu clienții, îndeplinirea obligațiilor legale, prevenirea fraudelor și protejarea site-ului. Comunicările comerciale sunt transmise numai atunci când există un temei legal corespunzător.</p></section>
        <section><h2 className="text-xl font-semibold text-white">Destinatari</h2><p className="mt-3 leading-8">Datele pot fi transmise, strict în măsura necesară, furnizorilor implicați în funcționarea magazinului, procesatorilor de plăți precum NETOPIA Payments, firmelor de curierat, furnizorilor IT/hosting, serviciilor de contabilitate și autorităților publice atunci când legea impune acest lucru.</p></section>
        <section><h2 className="text-xl font-semibold text-white">Plata cu cardul</h2><p className="mt-3 leading-8">Pentru plățile online, informațiile necesare procesării tranzacției sunt gestionate prin infrastructura procesatorului de plăți. VIRELLO nu solicită și nu stochează în propriile sisteme datele complete ale cardului bancar.</p></section>
        <section><h2 className="text-xl font-semibold text-white">Durata păstrării</h2><p className="mt-3 leading-8">Datele sunt păstrate numai atât timp cât este necesar scopurilor pentru care au fost colectate și pentru perioadele impuse de obligațiile legale aplicabile, inclusiv cele contabile și fiscale.</p></section>
        <section><h2 className="text-xl font-semibold text-white">Drepturile persoanelor vizate</h2><p className="mt-3 leading-8">În condițiile Regulamentului (UE) 2016/679, persoanele vizate pot solicita, după caz, accesul la date, rectificarea, ștergerea, restricționarea prelucrării, portabilitatea datelor și se pot opune anumitor prelucrări. De asemenea, există dreptul de a depune o plângere la autoritatea competentă pentru protecția datelor.</p></section>
        <section><h2 className="text-xl font-semibold text-white">Exercitarea drepturilor</h2><p className="mt-3 leading-8">Solicitările privind datele personale pot fi trimise la virello2hub@gmail.com. Pentru protejarea datelor, putem solicita informații rezonabile pentru verificarea identității solicitantului.</p></section>
        <p className="pt-2 text-sm text-neutral-500">Ultima actualizare: 10.09.2026</p>
      </div>
    </StaticPage>
  );
}
