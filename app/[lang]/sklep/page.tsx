import { ProductFilters } from "@/components/product-filters";
import { ProductGrid } from "@/components/product-grid";
import { listProducts, listTaxonomy } from "@/lib/products";
import { Locale } from "@/lib/i18n";
import { getDictionary } from "@/lib/get-dictionary";

type SearchParams = Promise<{
  q?: string;
  category?: string;
  color?: string;
  material?: string;
  sort?: string;
}>;

export default async function ShopPage({
  params,
  searchParams,
}: {
  params: Promise<{ lang: Locale }>;
  searchParams: SearchParams;
}) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  const paramsQuery = await searchParams;

  const products = await listProducts({
    search: paramsQuery.q,
    category: paramsQuery.category,
    color: paramsQuery.color,
    material: paramsQuery.material,
    sort: paramsQuery.sort,
  });

  const taxonomy = await listTaxonomy();

  return (
    <div className="container store-page">
      <section className="store-heading panel">
        <div>
          <div className="eyebrow">{dict.shop.collection}</div>
          <h1>{dict.shop.title}</h1>
          <p className="footer-muted">{dict.shop.description}</p>
        </div>
        <div className="store-heading__meta">
          <strong>{products.length}</strong>
          <span>{dict.shop.products}</span>
        </div>
      </section>

      <div className="store-layout">
        <ProductFilters
          lang={lang}
          categories={taxonomy.categories}
          colors={taxonomy.colors}
          materials={taxonomy.materials}
          current={{
            q: paramsQuery.q ?? "",
            category: paramsQuery.category ?? "",
            color: paramsQuery.color ?? "",
            material: paramsQuery.material ?? "",
            sort: paramsQuery.sort ?? "newest",
          }}
        />

        <section>
          <div className="toolbar">
            <div>
              <h3>{dict.shop.selectedModels}</h3>
              <div className="toolbar__meta">{dict.shop.listingMeta}</div>
            </div>
          </div>

          <ProductGrid products={products} lang={lang} />
        </section>
      </div>
    </div>
  );
}