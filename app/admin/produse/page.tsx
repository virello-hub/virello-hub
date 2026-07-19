"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { supabase } from "@/lib/supabase/client";

const NUME_BUCKET = "produse";
const DIMENSIUNE_MAXIMA_IMAGINE = 5 * 1024 * 1024;


type Produs = {
  id: number;
  nume: string;
  pret: number;
  stoc: number;
  activ: boolean;
  imagine_url: string | null;
};


type FormularProdus = {
  nume: string;
  pret: string;
  stoc: string;
  activ: boolean;
};


const formularInitial: FormularProdus = {
  nume: "",
  pret: "",
  stoc: "",
  activ: true,
};


export default function ProduseAdminPage() {

  const [produse, setProduse] =
    useState<Produs[]>([]);

  const [incarcare, setIncarcare] =
    useState(true);

  const [mesaj, setMesaj] =
    useState("");

  const [eroare, setEroare] =
    useState("");


  const [formularAdaugareDeschis, setFormularAdaugareDeschis] =
    useState(false);


  const [formularNou, setFormularNou] =
    useState<FormularProdus>(
      formularInitial
    );


  const [imagineNoua, setImagineNoua] =
    useState<File | null>(null);


  const [previewImagineNoua, setPreviewImagineNoua] =
    useState("");


  const [adaugare, setAdaugare] =
    useState(false);


  const [produsEditat, setProdusEditat] =
    useState<Produs | null>(null);


  const [imagineEditare, setImagineEditare] =
    useState<File | null>(null);


  const [previewImagineEditare, setPreviewImagineEditare] =
    useState("");


  const [salvare, setSalvare] =
    useState(false);



  useEffect(() => {
    incarcaProdusele();
  }, []);



  async function incarcaProdusele() {

    setIncarcare(true);
    setEroare("");


    const { data, error } =
      await supabase
        .from("produse")
        .select(
          "id, nume, pret, stoc, activ, imagine_url"
        )
        .order("id", {
          ascending: false,
        });


    if(error){

      setEroare(error.message);
      setProduse([]);

    } else {

      setProduse(
        (data || []) as Produs[]
      );

    }


    setIncarcare(false);
  }



  function afiseazaMesaj(text:string){

    setMesaj(text);

    window.setTimeout(() => {
      setMesaj("");
    },3000);

  }



  function valideazaImagine(
    fisier:File
  ){

    if(!fisier.type.startsWith("image/")){

      setEroare(
        "Fișierul trebuie să fie o imagine."
      );

      return false;
    }


    if(
      fisier.size >
      DIMENSIUNE_MAXIMA_IMAGINE
    ){

      setEroare(
        "Imaginea trebuie să aibă maximum 5 MB."
      );

      return false;
    }


    return true;

  }



  function genereazaNumeFisier(
    fisier:File
  ){

    const extensie =
      fisier.name.split(".").pop() || "jpg";


    return `${
      crypto.randomUUID()
    }.${extensie}`;

  }



  async function incarcaImagine(
    fisier:File
  ){

    const numeFisier =
      genereazaNumeFisier(
        fisier
      );


    const cale =
      `imagini/${numeFisier}`;


    const { error } =
      await supabase.storage
        .from(NUME_BUCKET)
        .upload(
          cale,
          fisier,
          {
            cacheControl:"3600",
            upsert:false,
            contentType:fisier.type,
          }
        );


    if(error){

      throw new Error(
        error.message
      );

    }


    const { data } =
      supabase.storage
        .from(NUME_BUCKET)
        .getPublicUrl(cale);


    return {
      url:data.publicUrl,
      cale,
    };

  }
    function handleImagineNoua(
    event: ChangeEvent<HTMLInputElement>
  ) {

    const fisier =
      event.target.files?.[0];


    if (!fisier) return;


    if (!valideazaImagine(fisier))
      return;


    setImagineNoua(fisier);

    setPreviewImagineNoua(
      URL.createObjectURL(fisier)
    );

  }



  function handleImagineEditare(
    event: ChangeEvent<HTMLInputElement>
  ) {

    const fisier =
      event.target.files?.[0];


    if (!fisier) return;


    if (!valideazaImagine(fisier))
      return;


    setImagineEditare(fisier);

    setPreviewImagineEditare(
      URL.createObjectURL(fisier)
    );

  }



  function inchideFormularAdaugare(){

    setFormularAdaugareDeschis(false);

    setFormularNou(
      formularInitial
    );

    setImagineNoua(null);

    setPreviewImagineNoua("");

    setEroare("");

  }



  function deschideEditarea(
    produs: Produs
  ){

    setProdusEditat({
      ...produs,
    });

    setImagineEditare(null);

    setPreviewImagineEditare(
      produs.imagine_url || ""
    );

    setEroare("");

  }



  function inchideEditarea(){

    setProdusEditat(null);

    setImagineEditare(null);

    setPreviewImagineEditare("");

    setEroare("");

  }



  async function adaugaProdus(
    event: FormEvent<HTMLFormElement>
  ){

    event.preventDefault();

    setAdaugare(true);

    setEroare("");


    try {

      let imagineUrl = null;


      if(imagineNoua){

        const imagine =
          await incarcaImagine(
            imagineNoua
          );


        imagineUrl =
          imagine.url;

      }


      const { error } =
        await supabase
          .from("produse")
          .insert({

            nume:
              formularNou.nume.trim(),

            pret:
              Number(formularNou.pret),

            stoc:
              Number(formularNou.stoc),

            activ:
              formularNou.activ,

            imagine_url:
              imagineUrl,

          });



      if(error)
        throw error;



      inchideFormularAdaugare();


      afiseazaMesaj(
        "Produsul a fost adăugat."
      );


      await incarcaProdusele();


    } catch(error){

      setEroare(
        error instanceof Error
          ? error.message
          : "Produsul nu a putut fi adăugat."
      );

    } finally {

      setAdaugare(false);

    }

  }



  async function schimbaStatus(
    produs: Produs
  ){

    const { error } =
      await supabase
        .from("produse")
        .update({
          activ: !produs.activ,
        })
        .eq(
          "id",
          produs.id
        );


    if(error){

      setEroare(error.message);
      return;

    }


    await incarcaProdusele();

  }



  async function stergeImagineDinStorage(
    url:string | null
  ){

    if(!url) return;


    const parte =
      url.split("/").pop();


    if(!parte) return;


    await supabase.storage
      .from(NUME_BUCKET)
      .remove([
        `imagini/${parte}`,
      ]);

  }



  async function stergeProdus(
    produs: Produs
  ){

    const confirmare =
      window.confirm(
        "Sigur vrei să ștergi produsul?"
      );


    if(!confirmare)
      return;



    const { error } =
      await supabase
        .from("produse")
        .delete()
        .eq(
          "id",
          produs.id
        );


    if(error){

      setEroare(error.message);
      return;

    }


    await stergeImagineDinStorage(
      produs.imagine_url
    );


    afiseazaMesaj(
      "Produsul a fost șters."
    );


    await incarcaProdusele();

  }
  async function salveazaEditarea(
  event: FormEvent<HTMLFormElement>
){

  event.preventDefault();

  if(!produsEditat)
    return;


  setSalvare(true);

  setEroare("");


  try {

    let imagineNouaUrl =
      produsEditat.imagine_url;


    if(imagineEditare){

      const imagine =
        await incarcaImagine(
          imagineEditare
        );


      imagineNouaUrl =
        imagine.url;

    }


    const { error } =
      await supabase
        .from("produse")
        .update({

          nume:
            produsEditat.nume.trim(),

          pret:
            Number(produsEditat.pret),

          stoc:
            Number(produsEditat.stoc),

          activ:
            produsEditat.activ,

          imagine_url:
            imagineNouaUrl,

        })
        .eq(
          "id",
          produsEditat.id
        );


    if(error)
      throw error;


    inchideEditarea();


    afiseazaMesaj(
      "Produs actualizat."
    );


    await incarcaProdusele();


  } catch(error){

    setEroare(
      error instanceof Error
        ? error.message
        : "Eroare la salvare."
    );

  } finally {

    setSalvare(false);

  }

}



return (

<main className="min-h-screen bg-[#F5F4F0] p-6">

<div className="mx-auto max-w-7xl">


<div className="mb-8 flex items-center justify-between">

<h1 className="text-4xl font-bold">
Produse
</h1>


<button
onClick={() =>
setFormularAdaugareDeschis(true)
}
className="rounded-xl bg-black px-6 py-3 text-white"
>
+ Adaugă produs
</button>


</div>



{mesaj && (
<div className="mb-5 rounded-xl bg-green-100 p-4 text-green-700">
{mesaj}
</div>
)}


{eroare && (
<div className="mb-5 rounded-xl bg-red-100 p-4 text-red-700">
{eroare}
</div>
)}



{incarcare ? (

<div>
Se încarcă...
</div>

) : (

<div className="grid gap-6 md:grid-cols-3">


{produse.map((produs)=>(


<div
key={produs.id}
className="rounded-2xl bg-white p-5 shadow"
>


{produs.imagine_url ? (

<img
src={produs.imagine_url}
alt={produs.nume}
className="h-48 w-full rounded-xl object-cover"
/>

) : (

<div className="flex h-48 items-center justify-center rounded-xl bg-gray-100">
Fără imagine
</div>

)}



<h2 className="mt-4 text-xl font-bold">
{produs.nume}
</h2>


<p>
{Number(produs.pret).toFixed(2)} lei
</p>


<p>
Stoc: {produs.stoc}
</p>


<p>
{produs.activ ? "Activ" : "Inactiv"}
</p>



<div className="mt-4 flex gap-2">


<button
onClick={() =>
deschideEditarea(produs)
}
className="rounded-lg bg-black px-3 py-2 text-white"
>
Editează
</button>



<button
onClick={() =>
schimbaStatus(produs)
}
className="rounded-lg border px-3 py-2"
>
Status
</button>



<button
onClick={() =>
stergeProdus(produs)
}
className="rounded-lg bg-red-600 px-3 py-2 text-white"
>
Șterge
</button>


</div>


</div>


))}


</div>

)}



</div>



{formularAdaugareDeschis && (

<div className="fixed inset-0 flex items-center justify-center bg-black/60 p-4">

<form
onSubmit={adaugaProdus}
className="w-full max-w-lg rounded-2xl bg-white p-6"
>


<h2 className="text-2xl font-bold">
Adaugă produs
</h2>


<input
className="mt-4 w-full rounded-lg border p-3"
placeholder="Nume produs"
value={formularNou.nume}
onChange={(e)=>
setFormularNou({
...formularNou,
nume:e.target.value
})
}
/>


<input
className="mt-3 w-full rounded-lg border p-3"
placeholder="Preț"
value={formularNou.pret}
onChange={(e)=>
setFormularNou({
...formularNou,
pret:e.target.value
})
}
/>


<input
className="mt-3 w-full rounded-lg border p-3"
placeholder="Stoc"
value={formularNou.stoc}
onChange={(e)=>
setFormularNou({
...formularNou,
stoc:e.target.value
})
}
/>


<input
type="file"
accept="image/*"
className="mt-4"
onChange={handleImagineNoua}
/>


<button
disabled={adaugare}
className="mt-5 w-full rounded-xl bg-black p-3 text-white"
>
{adaugare ? "Se adaugă..." : "Salvează"}
</button>


</form>

</div>

)}



{produsEditat && (

<div className="fixed inset-0 flex items-center justify-center bg-black/60 p-4">

<form
onSubmit={salveazaEditarea}
className="w-full max-w-lg rounded-2xl bg-white p-6"
>


<h2 className="text-2xl font-bold">
Editează produs
</h2>


<input
className="mt-4 w-full rounded-lg border p-3"
value={produsEditat.nume}
onChange={(e)=>
setProdusEditat({
...produsEditat,
nume:e.target.value
})
}
/>


<input
className="mt-3 w-full rounded-lg border p-3"
value={produsEditat.pret}
onChange={(e)=>
setProdusEditat({
...produsEditat,
pret:Number(e.target.value)
})
}
/>


<input
className="mt-3 w-full rounded-lg border p-3"
value={produsEditat.stoc}
onChange={(e)=>
setProdusEditat({
...produsEditat,
stoc:Number(e.target.value)
})
}
/>


<input
type="file"
accept="image/*"
className="mt-4"
onChange={handleImagineEditare}
/>


<button
disabled={salvare}
className="mt-5 w-full rounded-xl bg-black p-3 text-white"
>
{salvare ? "Se salvează..." : "Salvează modificări"}
</button>


</form>

</div>

)}



</main>

);

}
