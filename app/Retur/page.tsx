import StaticPage from "../components/StaticPage";

export default function ReturPage() {
  return (
    <StaticPage eyebrow="Dreptul de retragere" title="Politica de retur" description="Informații privind retragerea din contract și returnarea produselor cumpărate de la VIRELLO.">
      <div className="space-y-8 text-neutral-300">
        <section><h2 className="text-xl font-semibold text-white">Termenul de retragere</h2><p className="mt-3 leading-8">Consumatorul are dreptul, în condițiile OUG 34/2014, să se retragă din contractul la distanță fără a invoca un motiv, în termenul legal de 14 zile calendaristice. Pentru bunuri, termenul curge, de regulă, de la data la care consumatorul sau o persoană indicată de acesta intră în posesia fizică a bunurilor.</p></section>
        <section><h2 className="text-xl font-semibold text-white">Cum ne anunțați</h2><p className="mt-3 leading-8">Pentru exercitarea dreptului de retragere, transmiteți înainte de expirarea termenului o declarație neechivocă la virello2hub@gmail.com. Includeți numele, numărul comenzii, produsele pe care doriți să le returnați și datele de contact. Vă vom comunica instrucțiunile necesare returnării.</p></section>
        <section><h2 className="text-xl font-semibold text-white">Returnarea produselor</h2><p className="mt-3 leading-8">Produsele trebuie expediate înapoi conform instrucțiunilor comunicate după înregistrarea cererii. Consumatorul suportă costurile directe ale returnării, cu excepția cazurilor în care VIRELLO acceptă să le suporte sau legea prevede altfel. Consumatorul răspunde numai pentru diminuarea valorii produsului rezultată din manipulări care depășesc ceea ce este necesar pentru stabilirea naturii, caracteristicilor și funcționării acestuia.</p></section>
        <section><h2 className="text-xl font-semibold text-white">Rambursarea</h2><p className="mt-3 leading-8">În cazul unei retrageri valabile, sumele datorate se rambursează în termenul prevăzut de lege. Rambursarea poate fi amânată până la recepționarea produselor returnate sau până la primirea dovezii expedierii lor, în condițiile legii. Pentru livrare se rambursează costul livrării standard în limitele prevăzute de legislația aplicabilă.</p></section>
        <section><h2 className="text-xl font-semibold text-white">Excepții</h2><p className="mt-3 leading-8">Dreptul de retragere nu se aplică în situațiile exceptate de art. 16 din OUG 34/2014. Acestea pot include, după caz, bunuri realizate după specificațiile consumatorului, bunuri susceptibile a se deteriora sau expira rapid și bunuri sigilate care nu pot fi returnate din motive de protecție a sănătății sau igienă și care au fost desigilate de consumator.</p></section>
        <section><h2 className="text-xl font-semibold text-white">Produse neconforme sau deteriorate</h2><p className="mt-3 leading-8">Dacă produsul primit este deteriorat, greșit sau prezintă o problemă de conformitate, contactați-ne la virello2hub@gmail.com sau 0773242794 pentru soluționare conform drepturilor legale aplicabile.</p></section>
        <p className="pt-2 text-sm text-neutral-500">Ultima actualizare: 10.09.2026</p>
      </div>
    </StaticPage>
  );
}
