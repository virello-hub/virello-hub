import StaticPage from "../components/StaticPage";

export default function LivrarePage() {
  return (
    <StaticPage eyebrow="Comenzi și transport" title="Politica de livrare" description="Informații despre expedierea comenzilor VIRELLO.">
      <div className="space-y-8 text-neutral-300">
        <section><h2 className="text-xl font-semibold text-white">Modalitatea de livrare</h2><p className="mt-3 leading-8">Comenzile plasate pe www.virellohub.ro sunt livrate prin curier la adresa indicată de client în comandă.</p></section>
        <section><h2 className="text-xl font-semibold text-white">Termen de livrare</h2><p className="mt-3 leading-8">Termenul estimat este de până la 3 zile lucrătoare de la confirmarea comenzii, în condiții normale de procesare și transport. În situații excepționale, clientul va fi informat dacă apare o întârziere relevantă.</p></section>
        <section><h2 className="text-xl font-semibold text-white">Costul livrării</h2><p className="mt-3 leading-8">Costul standard de transport este de 24,99 lei pentru o comandă. Costul aplicabil și valoarea totală a comenzii sunt prezentate înainte de finalizarea comenzii.</p></section>
        <section><h2 className="text-xl font-semibold text-white">Date de livrare</h2><p className="mt-3 leading-8">Clientul este responsabil pentru furnizarea unei adrese și a unor date de contact corecte. Dacă livrarea nu poate fi efectuată din cauza unor informații eronate sau incomplete, vom încerca să contactăm clientul pentru clarificare.</p></section>
        <section><h2 className="text-xl font-semibold text-white">Contact</h2><p className="mt-3 leading-8">Pentru informații despre livrare: 0773242794 sau virello2hub@gmail.com.</p></section>
        <p className="pt-2 text-sm text-neutral-500">Ultima actualizare: 10.09.2026</p>
      </div>
    </StaticPage>
  );
}
