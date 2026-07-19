import StaticPage from "../components/StaticPage";
import FavoriteProducts from "../components/FavoriteProducts";

export default function FavoritePage() {
  return (
    <StaticPage
      eyebrow="Lista ta"
      title="Produse favorite"
      description="Salvează aici produsele care îți plac pentru a le găsi mai ușor."
    >
      <FavoriteProducts />
    </StaticPage>
  );
}