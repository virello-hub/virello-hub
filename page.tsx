"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";

type SetariHomepage = {
  hero_title: string | null;
  hero_description: string | null;
  hero_image_url: string | null;
  hero_button_text: string | null;
};


export default function Home() {

  const [setari, setSetari] =
    useState<SetariHomepage | null>(null);


  useEffect(() => {

    async function incarcaHomepage(){

      const { data } =
        await supabase
          .from("setari")
          .select(
            "hero_title, hero_description, hero_image_url, hero_button_text"
          )
          .single();


      if(data){

        setSetari(data);

      }

    }


    incarcaHomepage();

  }, []);



  const titlu =
    setari?.hero_title ||
    "Eleganță în fiecare detaliu.";


  const descriere =
    setari?.hero_description ||
    "Descoperă produse atent selecționate pentru un stil modern. Calitate premium, design elegant și livrare rapidă.";


  const buton =
    setari?.hero_button_text ||
    "Vezi produsele";



  return (

    <main className="bg-white text-[#111827]">


      <section className="mx-auto flex min-h-[85vh] max-w-7xl items-center px-6 py-20">

        <div className="grid w-full items-center gap-16 lg:grid-cols-2">


          <div>

            <span className="rounded-full bg-[#D4AF37]/10 px-4 py-2 text-sm font-semibold text-[#B89222]">
              Magazin Online
            </span>



            <h1 className="mt-6 text-5xl font-bold leading-tight md:text-7xl">

              {titlu}

            </h1>



            <p className="mt-8 max-w-xl text-lg leading-8 text-gray-600">

              {descriere}

            </p>



            <div className="mt-10 flex flex-wrap gap-4">


              <Link
                href="/produse"
                className="rounded-xl bg-[#111827] px-8 py-4 font-semibold text-white transition hover:bg-[#D4AF37] hover:text-[#111827]"
              >
                {buton}
              </Link>


              <Link
                href="/cont"
                className="rounded-xl border-2 border-[#111827] px-8 py-4 font-semibold transition hover:border-[#D4AF37] hover:bg-[#D4AF37]"
              >
                Contul meu
              </Link>


            </div>


          </div>



          <div className="flex justify-center">


            <div className="relative flex h-[420px] w-full max-w-md items-center justify-center overflow-hidden rounded-[32px] border border-[#D4AF37]/20 bg-black shadow-2xl">


              {setari?.hero_image_url ? (

                <img
                  src={setari.hero_image_url}
                  alt="Virello"
                  className="h-full w-full object-cover"
                />

              ) : (

                <div className="text-center">

                  <p className="text-sm font-semibold uppercase tracking-[0.35em] text-[#D4AF37]">
                    Virello
                  </p>

                  <p className="mt-4 text-3xl font-bold text-white">
                    Premium
                  </p>

                </div>

              )}


            </div>


          </div>


        </div>


      </section>




      <section className="bg-[#F8F9FA] py-24">

        <div className="mx-auto max-w-7xl px-6">

          <div className="grid gap-8 md:grid-cols-3">


            <div className="rounded-3xl bg-white p-8 shadow">
              🚚
              <h3 className="mt-4 text-xl font-bold">
                Livrare rapidă
              </h3>
              <p className="mt-3 text-gray-600">
                Expediem comenzile rapid.
              </p>
            </div>


            <div className="rounded-3xl bg-white p-8 shadow">
              ⭐
              <h3 className="mt-4 text-xl font-bold">
                Produse premium
              </h3>
              <p className="mt-3 text-gray-600">
                Calitate și design elegant.
              </p>
            </div>


            <div className="rounded-3xl bg-white p-8 shadow">
              🔒
              <h3 className="mt-4 text-xl font-bold">
                Plăți sigure
              </h3>
              <p className="mt-3 text-gray-600">
                Comenzi procesate în siguranță.
              </p>
            </div>


          </div>

        </div>

      </section>




      <section className="px-6 py-24">

        <div className="mx-auto max-w-5xl rounded-[32px] bg-[#111827] px-8 py-20 text-center text-white">


          <h2 className="text-4xl font-bold">
            Descoperă colecția Virello
          </h2>


          <Link
            href="/produse"
            className="mt-8 inline-block rounded-xl bg-[#D4AF37] px-8 py-4 font-bold text-black"
          >
            Cumpără acum
          </Link>


        </div>


      </section>


    </main>

  );

}