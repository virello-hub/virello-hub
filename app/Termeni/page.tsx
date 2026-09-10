import StaticPage from "../components/StaticPage";

export default function TermeniPage() {
  return (
    <StaticPage
      eyebrow="Informații legale"
      title="Termeni și condiții"
      description="Condițiile aplicabile comenzilor plasate pe www.virellohub.ro."
    >
      <div className="space-y-8 text-neutral-300">
        <section>
          <h2 className="text-xl font-semibold text-white">1. Operatorul magazinului</h2>
          <p className="mt-3 leading-8">
            Magazinul online VIRELLO, disponibil la www.virellohub.ro, este operat de VIRELLO HUB S.R.L., CUI 55334393, nr. Registrul Comerțului J2026047281006, cu sediul în București, Sector 3, Bulevardul 1 Decembrie 1918, Nr. 27B, Bl. PM 74, Scara 1, Etaj 5, Ap. 35. Telefon: 0773242794. Email: virello2hub@gmail.com.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white">2. Produse și informații</h2>
          <p className="mt-3 leading-8">
            VIRELLO comercializează produse nealimentare din categorii variate. Descrierile și imaginile sunt prezentate cât mai fidel; pot exista diferențe minore de ambalaj, nuanță sau prezentare în funcție de producător și lot.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white">3. Prețuri</h2>
          <p className="mt-3 leading-8">
            Prețurile sunt afișate în lei (RON). Prețul aplicabil este cel afișat la momentul plasării comenzii, cu excepția erorilor evidente de afișare. Costul standard de livrare este de 24,99 lei/comandă, iar valoarea totală este afișată înainte de confirmarea comenzii.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white">4. Plasarea și confirmarea comenzii</h2>
          <p className="mt-3 leading-8">
            Clientul selectează produsele, completează datele necesare și transmite comanda prin site. Contractul la distanță se consideră încheiat după confirmarea comenzii de către VIRELLO. O comandă poate fi refuzată justificat în caz de indisponibilitate, suspiciune de fraudă, eroare tehnică sau imposibilitate de livrare. Pentru comenzile achitate în avans și care nu pot fi onorate, suma achitată va fi restituită.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white">5. Plata</h2>
          <p className="mt-3 leading-8">
            Metodele de plată disponibile sunt afișate în pagina de finalizare a comenzii. Plata online cu cardul este procesată prin NETOPIA Payments după activarea serviciului. VIRELLO nu solicită și nu stochează datele complete ale cardului bancar în propriile sisteme.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white">6. Livrarea</h2>
          <p className="mt-3 leading-8">
            Produsele sunt livrate prin curier la adresa indicată de client. Termenul estimat de livrare este de până la 3 zile lucrătoare de la confirmarea comenzii, în condiții normale de procesare și transport. Detaliile complete sunt disponibile în Politica de livrare.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white">7. Dreptul de retragere și returul</h2>
          <p className="mt-3 leading-8">
            Consumatorii beneficiază, în condițiile OUG 34/2014, de dreptul de retragere din contract în termenul legal, de regulă 14 zile calendaristice de la intrarea în posesia produselor. Cererea se poate transmite la virello2hub@gmail.com. Excepțiile prevăzute de lege, inclusiv pentru anumite produse sigilate care nu pot fi returnate din motive de protecție a sănătății sau igienă după desigilare, rămân aplicabile. Detaliile sunt disponibile în Politica de retur.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white">8. Conformitate și garanții</h2>
          <p className="mt-3 leading-8">
            Pentru produsele destinate consumatorilor se aplică drepturile privind conformitatea și garanțiile prevăzute de legislația în vigoare, inclusiv OUG 140/2021, după caz. Sesizările pot fi trimise la virello2hub@gmail.com.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white">9. Date personale</h2>
          <p className="mt-3 leading-8">
            Datele personale sunt prelucrate pentru administrarea comenzilor, livrare, facturare, suport clienți și îndeplinirea obligațiilor legale. Detaliile complete sunt disponibile în Politica de confidențialitate.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white">10. Reclamații și soluționarea litigiilor</h2>
          <p className="mt-3 leading-8">
            Pentru reclamații ne puteți contacta la 0773242794 sau virello2hub@gmail.com. Consumatorii pot apela și la mecanismele de soluționare alternativă a litigiilor puse la dispoziție de Autoritatea Națională pentru Protecția Consumatorilor (ANPC).
          </p>
          <p className="mt-3 leading-8">
            Informații SAL: https://anpc.ro/sal/ și platforma electronică https://reclamatiisal.anpc.ro/.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white">11. Actualizarea condițiilor</h2>
          <p className="mt-3 leading-8">
            VIRELLO poate actualiza prezentele condiții atunci când este necesar. Pentru o comandă se aplică versiunea condițiilor disponibilă la momentul încheierii contractului.
          </p>
        </section>

        <p className="pt-2 text-sm text-neutral-500">Ultima actualizare: 10.09.2026</p>
      </div>
    </StaticPage>
  );
}
