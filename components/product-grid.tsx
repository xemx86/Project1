import { ProductRow } from "@/types/store";
import { ProductCard } from "@/components/product-card";
import { Locale } from "@/lib/i18n";

export function ProductGrid({
  products,
  lang,
}: {
  products: ProductRow[];
  lang: Locale;
}) {
  if (products.length === 0) {
    return <div className="empty-state">Brak produktów dla wybranych filtrów.</div>;
  }

  return (
    <div className="product-grid">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} lang={lang} />
      ))}
    </div>
  );
}