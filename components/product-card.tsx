import Link from "next/link";
import { ProductRow } from "@/types/store";
import { formatPrice } from "@/lib/utils";
import { AddToCartButton } from "@/components/add-to-cart-button";
import { Locale } from "@/lib/i18n";

const ui = {
  en: {
    featured: "Featured",
    details: "Details",
  },
  es: {
    featured: "Destacado",
    details: "Detalles",
  },
};

export function ProductCard({
  product,
  lang,
}: {
  product: ProductRow;
  lang: Locale;
}) {
  const t = ui[lang];

  return (
    <article className="product-card">
      <Link href={`/${lang}/produkt/${product.slug}`}>
        <div className="product-card__image">
          <img src={product.image_url || "/placeholder-product.svg"} alt={product.name} />
        </div>
      </Link>

      <div className="product-card__body">
        <div className="tag-row">
          <span className="tag">{product.category}</span>
          <span className="tag">{product.color}</span>
          {product.is_featured ? (
            <span className="tag tag--accent">{t.featured}</span>
          ) : null}
        </div>

        <Link href={`/${lang}/produkt/${product.slug}`} className="product-card__title">
          {product.name}
        </Link>

        <div className="footer-muted">{product.brand}</div>

        <div className="price-row">
          <span className="price">{formatPrice(product.sale_price ?? product.price)}</span>
          {product.sale_price ? (
            <span className="price--old">{formatPrice(product.price)}</span>
          ) : null}
        </div>

        {product.sizes.length > 0 ? (
          <div className="size-row">
            {product.sizes.slice(0, 4).map((size) => (
              <span className="size-pill" key={size}>
                {size}
              </span>
            ))}
          </div>
        ) : null}

        <div className="inline-actions inline-actions--stretch">
          <AddToCartButton product={product} lang={lang} />
          <Link href={`/${lang}/produkt/${product.slug}`} className="button-link">
            {t.details}
          </Link>
        </div>
      </div>
    </article>
  );
}