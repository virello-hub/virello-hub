"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

type ProdusCos = {
  id: number;
  nume: string;
  pret: number;
  imagine_url: string | null;
  cantitate: number;
};

type CartContextType = {
  produseCos: ProdusCos[];
  incarcat: boolean;
  adaugaInCos: (produs: Omit<ProdusCos, "cantitate">) => void;
  stergeDinCos: (id: number) => void;
  schimbaCantitatea: (id: number, cantitate: number) => void;
  golesteCosul: () => void;
  totalProduse: number;
  totalPret: number;
};

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [produseCos, setProduseCos] = useState<ProdusCos[]>([]);
  const [incarcat, setIncarcat] = useState(false);

  useEffect(() => {
    try {
      const cosSalvat = localStorage.getItem("cos");

      if (cosSalvat) {
        const produseSalvate = JSON.parse(cosSalvat);

        if (Array.isArray(produseSalvate)) {
          setProduseCos(produseSalvate);
        }
      }
    } catch (error) {
      console.error("Coșul salvat nu a putut fi citit:", error);
      localStorage.removeItem("cos");
    } finally {
      setIncarcat(true);
    }
  }, []);

  useEffect(() => {
    if (!incarcat) {
      return;
    }

    localStorage.setItem("cos", JSON.stringify(produseCos));
  }, [produseCos, incarcat]);

  function adaugaInCos(produs: Omit<ProdusCos, "cantitate">) {
    setProduseCos((lista) => {
      const produsExistent = lista.find((item) => item.id === produs.id);

      if (produsExistent) {
        return lista.map((item) =>
          item.id === produs.id
            ? {
                ...item,
                cantitate: item.cantitate + 1,
              }
            : item
        );
      }

      return [
        ...lista,
        {
          ...produs,
          cantitate: 1,
        },
      ];
    });
  }

  function stergeDinCos(id: number) {
    setProduseCos((lista) =>
      lista.filter((item) => item.id !== id)
    );
  }

  function schimbaCantitatea(id: number, cantitate: number) {
    if (!Number.isInteger(cantitate) || cantitate < 1) {
      return;
    }

    setProduseCos((lista) =>
      lista.map((item) =>
        item.id === id
          ? {
              ...item,
              cantitate,
            }
          : item
      )
    );
  }

  function golesteCosul() {
    setProduseCos([]);
  }

  const totalProduse = useMemo(
    () =>
      produseCos.reduce(
        (total, produs) => total + produs.cantitate,
        0
      ),
    [produseCos]
  );

  const totalPret = useMemo(
    () =>
      produseCos.reduce(
        (total, produs) =>
          total + Number(produs.pret) * produs.cantitate,
        0
      ),
    [produseCos]
  );

  return (
    <CartContext.Provider
      value={{
        produseCos,
        incarcat,
        adaugaInCos,
        stergeDinCos,
        schimbaCantitatea,
        golesteCosul,
        totalProduse,
        totalPret,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error(
      "useCart trebuie folosit în interiorul CartProvider"
    );
  }

  return context;
}