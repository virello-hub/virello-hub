 "use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  useMemo,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";

import { useCart } from "@/app/context/CartContext";
import { supabase } from "@/lib/supabase/client";

type FormularCheckout = {
  nume: string;
  email: string;
  telefon: string;
  adresa: string;
  oras: string;
  judet: string;
};

type ProdusBazaDate = {
  id: number;
  nume: string;
  pret: number;
  stoc: number;
  activ: boolean;
  imagine_url: string | null;
};

const formularInitial: FormularCheckout = {
  nume: "",
  email: "",
  telefon: "",
  adresa: "",
  oras: "",
  judet: "",
};

export default function CheckoutPage() {
  const router = useRouter();

  const {
    produseCos,
    incarcat,
    totalProduse,
    golesteCosul,
  } = useCart();

  const [formular, setFormular] =
    useState<FormularCheckout>(formularInitial);

  const [seTrimite, setSeTrimite] = useState(false);
  const [eroare, setEroare] = useState("");

  const totalAfisat = useMemo(() => {
    return produseCos.reduce(
      (total, produs) =>
        total + Number(produs.pret) * produs.cantitate,
      0
    );
  }, [produseCos]);

  function handleSchimbare(
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value } = event.target;

    setFormular((vechi) => ({
      ...vechi,
      [name]: value,
    }));
  }

  function valideazaFormularul() {
    const nume = formular.nume.trim();
    const email = formular.email.trim();
    const telefon = formular.telefon.trim();
    const adresa = formular.adresa.trim();
    const oras = formular.oras.trim();
    const judet = formular.judet.trim();

    if (nume.length < 3) {
      return "Introdu numele complet.";
    }

    if (!email.includes("@")) {
      return "Introdu un email valid.";
    }

    if (telefon.length < 7) {
      return "Introdu un telefon valid.";
    }

    if (adresa.length < 5) {
      return "Introdu adresa.";
    }

    if (oras.length < 2) {
      return "Introdu orașul.";
    }

    if (judet.length < 2) {
      return "Introdu județul.";
    }

    return "";
  }

  async function trimiteComanda(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (seTrimite) return;

    setEroare("");

    const eroareValidare = valideazaFormularul();

    if (eroareValidare) {
      setEroare(eroareValidare);
      return;
    }

    if (produseCos.length === 0) {
      setEroare("Coșul este gol.");
      return;
    }

    setSeTrimite(true);

    try {
      const ids = produseCos.map(
        (produs) => produs.id
      );

      const { data: produseBaza, error } =
        await supabase
          .from("produse")
          .select(
            "id, nume, pret, stoc, activ, imagine_url"
          )
          .in("id", ids);

      if (error) {
        throw new Error(
          "Nu s-au putut verifica produsele."
        );
      }

      const produseVerificate =
        (produseBaza || []) as ProdusBazaDate[];

      const produseComanda = produseCos.map(
        (produsCos) => {
          const produs =
            produseVerificate.find(
              (p) => p.id === produsCos.id
            );

          if (!produs || !produs.activ) {
            throw new Error(
              "Un produs nu mai este disponibil."
            );
          }

          if (
            produs.stoc < produsCos.cantitate
          ) {
            throw new Error(
              "Stoc insuficient."
            );
          }

          return {
            produs_id: produs.id,
            nume_produs: produs.nume,
            pret: Number(produs.pret),
            cantitate: produsCos.cantitate,
            imagine_url: produs.imagine_url,
          };
        }
      );

      const total =
        produseComanda.reduce(
          (suma, produs) =>
            suma +
            produs.pret *
              produs.cantitate,
          0
        );
          const { data: comanda, error: eroareComanda } =
        await supabase
          .from("comenzi")
          .insert({
            nume: formular.nume.trim(),
            email: formular.email.trim().toLowerCase(),
            telefon: formular.telefon.trim(),
            adresa: formular.adresa.trim(),
            oras: formular.oras.trim(),
            judet: formular.judet.trim(),
            metoda_plata: "ramburs",
            total,
            status: "noua",
          })
          .select("id")
          .single();

      if (eroareComanda || !comanda) {
        throw new Error(
          "Comanda nu a putut fi salvată."
        );
      }

      const { error: eroareProduse } =
        await supabase
          .from("produse_comanda")
          .insert(
            produseComanda.map((produs) => ({
              comanda_id: comanda.id,
              produs_id: produs.produs_id,
              nume_produs: produs.nume_produs,
              pret: produs.pret,
              cantitate: produs.cantitate,
              imagine_url: produs.imagine_url,
            }))
          );

      if (eroareProduse) {
        throw new Error(
          "Produsele comenzii nu au putut fi salvate."
        );
      }

      for (const produs of produseComanda) {
        const produsOriginal =
          produseVerificate.find(
            (p) => p.id === produs.produs_id
          );

        if (produsOriginal) {
          await supabase
            .from("produse")
            .update({
              stoc:
                produsOriginal.stoc -
                produs.cantitate,
            })
            .eq("id", produs.produs_id);
        }
      }

      sessionStorage.setItem(
        "ultimaComanda",
        JSON.stringify({
          id: comanda.id,
          nume: formular.nume,
          email: formular.email,
          total,
          numarProduse: totalProduse,
        })
      );

      golesteCosul();

      router.push("/comanda-confirmata");

    } catch (error) {
      setEroare(
        error instanceof Error
          ? error.message
          : "A apărut o eroare."
      );
    } finally {
      setSeTrimite(false);
    }
  }


  if (!incarcat) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#F7F5EF]">
        <div className="rounded-xl bg-white px-8 py-6 shadow">
          Se încarcă...
        </div>
      </main>
    );
  }


  if (produseCos.length === 0) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-100 p-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold">
            Coșul este gol
          </h1>

          <Link
            href="/produse"
            className="mt-6 inline-block rounded-xl bg-black px-6 py-3 text-white"
          >
            Vezi produsele
          </Link>
        </div>
      </main>
    );
  }


  return (
    <main className="min-h-screen bg-[#F7F5EF] p-6 md:p-10">
      <div className="mx-auto max-w-6xl">

        <h1 className="text-4xl font-bold">
          Finalizare comandă
        </h1>

        <div className="mt-8 grid gap-8 lg:grid-cols-2">

          <form
            onSubmit={trimiteComanda}
            className="rounded-2xl bg-white p-6 shadow"
          >

            <div className="space-y-4">

              <input
                name="nume"
                placeholder="Nume complet"
                value={formular.nume}
                onChange={handleSchimbare}
                className="w-full rounded-xl border p-3"
                required
              />

              <input
                name="email"
                type="email"
                placeholder="Email"
                value={formular.email}
                onChange={handleSchimbare}
                className="w-full rounded-xl border p-3"
                required
              />

              <input
                name="telefon"
                placeholder="Telefon"
                value={formular.telefon}
                onChange={handleSchimbare}
                className="w-full rounded-xl border p-3"
                required
              />
                  <textarea
                name="adresa"
                placeholder="Adresă completă"
                value={formular.adresa}
                onChange={handleSchimbare}
                className="min-h-28 w-full rounded-xl border p-3"
                required
              />

              <input
                name="oras"
                placeholder="Oraș"
                value={formular.oras}
                onChange={handleSchimbare}
                className="w-full rounded-xl border p-3"
                required
              />

              <input
                name="judet"
                placeholder="Județ"
                value={formular.judet}
                onChange={handleSchimbare}
                className="w-full rounded-xl border p-3"
                required
              />

            </div>


            {eroare && (
              <p className="mt-4 rounded-lg bg-red-50 p-3 text-red-600">
                {eroare}
              </p>
            )}


            <button
              type="submit"
              disabled={seTrimite}
              className="mt-6 w-full rounded-xl bg-black py-4 font-bold text-white disabled:bg-gray-400"
            >
              {seTrimite
                ? "Se trimite comanda..."
                : "Plasează comanda"}
            </button>

          </form>


          <aside className="rounded-2xl bg-white p-6 shadow">

            <h2 className="text-2xl font-bold">
              Rezumat comandă
            </h2>


            <div className="mt-5 space-y-4">

              {produseCos.map((produs) => (
                <div
                  key={produs.id}
                  className="flex justify-between border-b pb-3"
                >

                  <div>
                    <p className="font-semibold">
                      {produs.nume}
                    </p>

                    <p className="text-sm text-gray-500">
                      Cantitate: {produs.cantitate}
                    </p>
                  </div>


                  <p className="font-bold">
                    {(
                      produs.pret *
                      produs.cantitate
                    ).toFixed(2)} lei
                  </p>

                </div>
              ))}

            </div>


            <div className="mt-6 flex justify-between border-t pt-5 text-xl font-bold">
              <span>
                Total
              </span>

              <span>
                {totalAfisat.toFixed(2)} lei
              </span>
            </div>


            <p className="mt-5 text-sm text-gray-500">
              Metoda de plată: ramburs la livrare
            </p>

          </aside>

        </div>

      </div>
    </main>
  );
}              