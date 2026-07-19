"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase/client";


type StatusComanda =
  | "noua"
  | "confirmata"
  | "in_pregatire"
  | "expediata"
  | "finalizata"
  | "anulata";


type ProdusComanda = {
  id: number;
  produs_id: number | null;
  nume_produs: string;
  pret: number;
  cantitate: number;
  imagine_url: string | null;
};


type Comanda = {
  id: number;
  nume: string;
  email: string;
  telefon: string;
  adresa: string;
  oras: string;
  judet: string;
  observatii: string | null;
  metoda_plata: string;
  total: number;
  status: string;
  created_at: string;
  produse_comanda: ProdusComanda[];
};


const statusuri = [
  { valoare: "noua", eticheta: "Nouă" },
  { valoare: "confirmata", eticheta: "Confirmată" },
  { valoare: "in_pregatire", eticheta: "În pregătire" },
  { valoare: "expediata", eticheta: "Expediată" },
  { valoare: "finalizata", eticheta: "Finalizată" },
  { valoare: "anulata", eticheta: "Anulată" },
];


function normalizeazaStatus(
  status: string
): StatusComanda {

  const s =
    status
      .toLowerCase()
      .trim()
      .replaceAll("ă", "a")
      .replaceAll("â", "a")
      .replaceAll("î", "i")
      .replaceAll("ș", "s")
      .replaceAll("ț", "t")
      .replaceAll(" ", "_");


  if (s === "confirmata")
    return "confirmata";

  if (
    s === "in_pregatire" ||
    s === "pregatire"
  )
    return "in_pregatire";


  if (s === "expediata")
    return "expediata";


  if (
    s === "finalizata" ||
    s === "livrata"
  )
    return "finalizata";


  if (s === "anulata")
    return "anulata";


  return "noua";
}



function formatPret(
  value:number
){

  return new Intl.NumberFormat(
    "ro-RO",
    {
      style:"currency",
      currency:"RON",
    }
  ).format(
    Number(value)
  );

}



function formatData(
  value:string
){

  return new Intl.DateTimeFormat(
    "ro-RO",
    {
      dateStyle:"medium",
      timeStyle:"short",
    }
  ).format(
    new Date(value)
  );

}



export default function AdminComenziPage(){

  const [comenzi,setComenzi] =
    useState<Comanda[]>([]);

  const [incarcare,setIncarcare] =
    useState(true);

  const [eroare,setEroare] =
    useState("");

  const [cautare,setCautare] =
    useState("");

  const [filtruStatus,setFiltruStatus] =
    useState("toate");

  const [comandaSelectata,setComandaSelectata] =
    useState<Comanda | null>(null);

  const [statusInCurs,setStatusInCurs] =
    useState<number | null>(null);



  async function incarcaComenzile(){

    setIncarcare(true);


    const {data,error} =
      await supabase
        .from("comenzi")
        .select(`
          id,
          nume,
          email,
          telefon,
          adresa,
          oras,
          judet,
          observatii,
          metoda_plata,
          total,
          status,
          created_at,
          produse_comanda(
            id,
            produs_id,
            nume_produs,
            pret,
            cantitate,
            imagine_url
          )
        `)
        .order(
          "created_at",
          {
            ascending:false,
          }
        );


    if(error){

      setEroare(
        "Comenzile nu au putut fi încărcate."
      );

      setComenzi([]);

    }else{

      setComenzi(
        (data || []) as Comanda[]
      );

    }


    setIncarcare(false);

  }



  useEffect(()=>{
    incarcaComenzile();
  },[]);

  async function stergeComanda(
  id:number
){

  const confirmare =
    window.confirm(
      "Sigur vrei să ștergi această comandă?"
    );


  if(!confirmare)
    return;


  const { error: produseError } =
    await supabase
      .from("produse_comanda")
      .delete()
      .eq(
        "comanda_id",
        id
      );


  if(produseError){

    setEroare(
      "Produsele comenzii nu au putut fi șterse."
    );

    return;

  }



  const { error } =
    await supabase
      .from("comenzi")
      .delete()
      .eq(
        "id",
        id
      );


  if(error){

    setEroare(
      "Comanda nu a putut fi ștearsă."
    );

    return;

  }


  setComenzi((lista)=>
    lista.filter(
      (comanda)=>
        comanda.id !== id
    )
  );


  if(
    comandaSelectata?.id === id
  ){

    setComandaSelectata(null);

  }

}



async function schimbaStatus(
  id:number,
  statusNou:StatusComanda
){

  setStatusInCurs(id);

  setEroare("");


  const comandaVeche =
    comenzi.find(
      (comanda)=>
        comanda.id === id
    );


  if(!comandaVeche){

    setStatusInCurs(null);
    return;

  }



  const statusVechi =
    normalizeazaStatus(
      comandaVeche.status
    );



  if(
    statusNou === "anulata" &&
    statusVechi !== "anulata"
  ){

    for(
      const produs
      of comandaVeche.produse_comanda
    ){

      if(!produs.produs_id)
        continue;


      const {data:produsBaza} =
        await supabase
          .from("produse")
          .select("stoc")
          .eq(
            "id",
            produs.produs_id
          )
          .single();



      if(produsBaza){

        await supabase
          .from("produse")
          .update({

            stoc:
              Number(produsBaza.stoc)
              +
              Number(produs.cantitate),

          })
          .eq(
            "id",
            produs.produs_id
          );

      }

    }

  }



  const {error} =
    await supabase
      .from("comenzi")
      .update({

        status:
          statusNou,

      })
      .eq(
        "id",
        id
      );



  if(error){

    setEroare(
      "Statusul nu a putut fi schimbat."
    );

    setStatusInCurs(null);

    return;

  }



  setComenzi((lista)=>
    lista.map(
      (comanda)=>
        comanda.id === id
        ? {
            ...comanda,
            status:statusNou,
          }
        : comanda
    )
  );



  setStatusInCurs(null);

}



const comenziFiltrate =
  useMemo(()=>{

    const text =
      cautare
        .toLowerCase()
        .trim();


    return comenzi.filter(
      (comanda)=>{

        const status =
          normalizeazaStatus(
            comanda.status
          );


        const cautareOk =
          !text ||
          String(comanda.id)
            .includes(text) ||
          comanda.nume
            .toLowerCase()
            .includes(text) ||
          comanda.email
            .toLowerCase()
            .includes(text);



        const statusOk =
          filtruStatus === "toate" ||
          status === filtruStatus;



        return cautareOk && statusOk;

      }
    );


  },[
    comenzi,
    cautare,
    filtruStatus
  ]);



const totalVanzari =
  comenzi
    .filter(
      (comanda)=>
        normalizeazaStatus(
          comanda.status
        ) !== "anulata"
    )
    .reduce(
      (total,comanda)=>
        total + Number(comanda.total),
      0
    );



const comenziNoi =
  comenzi.filter(
    (comanda)=>
      normalizeazaStatus(
        comanda.status
      ) === "noua"
  ).length;



const comenziFinalizate =
  comenzi.filter(
    (comanda)=>
      normalizeazaStatus(
        comanda.status
      ) === "finalizata"
  ).length;
 return (

<main className="min-h-screen bg-slate-50 p-4 md:p-8">

<div className="mx-auto max-w-7xl">


<div className="mb-8 flex items-center justify-between">

<div>

<h1 className="text-3xl font-bold">
Comenzi
</h1>

<p className="text-slate-500">
Administrare comenzi magazin
</p>

</div>


<button
onClick={incarcaComenzile}
className="rounded-xl bg-black px-5 py-3 text-white"
>
Reîncarcă
</button>

</div>



{eroare && (

<div className="mb-5 rounded-xl bg-red-100 p-4 text-red-700">

{eroare}

</div>

)}



<div className="mb-6 grid gap-4 md:grid-cols-4">


<CardStatistica
titlu="Total comenzi"
valoare={String(comenzi.length)}
descriere="Toate comenzile"
/>


<CardStatistica
titlu="Comenzi noi"
valoare={String(comenziNoi)}
descriere="Necesită verificare"
/>


<CardStatistica
titlu="Finalizate"
valoare={String(comenziFinalizate)}
descriere="Livrate"
/>


<CardStatistica
titlu="Vânzări"
valoare={formatPret(totalVanzari)}
descriere="Total"
/>


</div>




<section className="overflow-hidden rounded-2xl bg-white shadow">


<div className="flex flex-col gap-3 border-b p-5 md:flex-row">


<input
placeholder="Caută comandă..."
value={cautare}
onChange={(e)=>
setCautare(e.target.value)
}
className="rounded-xl border p-3"
/>



<select
value={filtruStatus}
onChange={(e)=>
setFiltruStatus(e.target.value)
}
className="rounded-xl border p-3"
>

<option value="toate">
Toate
</option>


{statusuri.map((s)=>(

<option
key={s.valoare}
value={s.valoare}
>

{s.eticheta}

</option>

))}

</select>


</div>



{incarcare ? (

<div className="p-10 text-center">
Se încarcă comenzile...
</div>

) : (


<div className="overflow-x-auto">

<table className="w-full min-w-[900px]">


<thead className="bg-slate-100">

<tr>

<th className="p-4 text-left">
ID
</th>

<th className="p-4 text-left">
Client
</th>

<th className="p-4 text-left">
Total
</th>

<th className="p-4 text-left">
Status
</th>

<th className="p-4 text-right">
Acțiuni
</th>

</tr>

</thead>



<tbody>


{comenziFiltrate.map((comanda)=>(

<tr
key={comanda.id}
className="border-t"
>


<td className="p-4 font-bold">
#{comanda.id}
</td>


<td className="p-4">

<div className="font-semibold">
{comanda.nume}
</div>

<div className="text-sm text-gray-500">
{comanda.email}
</div>

</td>


<td className="p-4 font-bold">
{formatPret(comanda.total)}
</td>



<td className="p-4">


<select

value={
normalizeazaStatus(
comanda.status
)
}

disabled={
statusInCurs === comanda.id
}

onChange={(e)=>
schimbaStatus(
comanda.id,
e.target.value as StatusComanda
)
}

className="rounded-lg border p-2"

>


{statusuri.map((s)=>(

<option
key={s.valoare}
value={s.valoare}
>

{s.eticheta}

</option>

))}


</select>


</td>



<td className="p-4 text-right">


<div className="flex justify-end gap-2">


<button

onClick={()=>
setComandaSelectata(comanda)
}

className="rounded-lg border px-3 py-2"
>

Detalii

</button>



<button

onClick={()=>
stergeComanda(comanda.id)
}

className="rounded-lg bg-red-600 px-3 py-2 text-white"

>

Șterge

</button>


</div>


</td>


</tr>


))}


</tbody>


</table>


</div>


)}


</section>



{comandaSelectata && (

<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">


<div className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl bg-white p-6">


<div className="flex justify-between">

<h2 className="text-2xl font-bold">
Comanda #{comandaSelectata.id}
</h2>


<button
onClick={()=>
setComandaSelectata(null)
}
className="text-2xl"
>
×
</button>

</div>


<div className="mt-5 space-y-2">

<p>
<b>Client:</b> {comandaSelectata.nume}
</p>

<p>
<b>Telefon:</b> {comandaSelectata.telefon}
</p>

<p>
<b>Adresă:</b> {comandaSelectata.adresa}
</p>

<p>
<b>Total:</b> {formatPret(comandaSelectata.total)}
</p>

</div>


<h3 className="mt-6 text-xl font-bold">
Produse
</h3>


<div className="mt-4 space-y-3">

{comandaSelectata.produse_comanda.map((produs)=>(

<div
key={produs.id}
className="flex justify-between rounded-xl border p-3"
>

<span>
{produs.nume_produs} x {produs.cantitate}
</span>


<b>
{formatPret(
produs.pret * produs.cantitate
)}
</b>


</div>

))}

</div>



<button

onClick={()=>
setComandaSelectata(null)
}

className="mt-6 w-full rounded-xl bg-black py-3 text-white"

>

Închide

</button>


</div>


</div>

)}



</div>

</main>

);

}



function CardStatistica({

titlu,
valoare,
descriere,

}:{

titlu:string;
valoare:string;
descriere:string;

}){


return (

<div className="rounded-xl bg-white p-5 shadow">

<p className="text-sm text-gray-500">
{titlu}
</p>

<p className="mt-2 text-3xl font-bold">
{valoare}
</p>

<p className="text-xs text-gray-400">
{descriere}
</p>

</div>

);

}
 