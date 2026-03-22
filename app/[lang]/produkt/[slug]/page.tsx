import { notFound } from "next/navigation";
import Link from "next/link";
import { getProductBySlug } from "@/lib/products";
import { ProductPurchaseBox } from "@/components/product-purchase-box";
import { ProductGallery } from "@/components/product-gallery";
import { Locale } from "@/lib/i18n";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ lang: Locale; slug: string }>;
}) {
  const { lang, slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  return (
    <div className="container product-page">
      <div className="breadcrumbs">
        <Link href={`/${lang}`}>Start</Link> /{" "}
        <Link href={`/${lang}/sklep`}>Sklep</Link> / {product.name}
      </div>

<ProductGallery
  name={product.name}
  imageUrl={product.image_url}
  imageUrls={product.image_url ? [product.image_url] : []}
/>

        <article className="product-info panel">
          <div className="product-info__meta">
            <span className="badge">{product.category}</span>
            <span className="badge">{product.brand}</span>
            <span className="badge">{product.material}</span>
          </div>

          <h1>{product.name}</h1>
          <p>{product.description || "Brak opisu produktu."}</p>

          <div className="tag-row">
            <span className="tag">Color: {product.color}</span>
            {product.is_featured ? (
              <span className="tag tag--accent">Wyróżniony</span>
            ) : null}
          </div>

          <ProductPurchaseBox
            lang={lang}
            product={{
              id: product.id,
              slug: product.slug,
              name: product.name,
              brand: product.brand,
              image_url: product.image_url,
              sizes: product.sizes,
              price: product.price,
              sale_price: product.sale_price,
            }}
          />
        </article>
      </div>
    </div>
  );
}
