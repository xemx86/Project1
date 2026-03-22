import Link from "next/link";
import { ProductRow } from "@/types/store";
import { Locale } from "@/lib/i18n";
import { formatPrice } from "@/lib/utils";

type Props = {
  product: ProductRow;
  lang: Locale;
};

export function ProductCard({ product, lang }: Props) {
  const sizes = product.sizes ?? [];

  return (
    <article className="product-card">
      <Link href={`/${lang}/produkt/${product.slug}`} className="product-card__image">
        <img
          src={product.image_url ?? "/placeholder-product.svg"}
          alt={product.name}
        />
      </Link>

      <div className="product-card__body">
        <Link href={`/${lang}/produkt/${product.slug}`} className="product-card__title">
          {product.name}
        </Link>

        <div className="product-card__meta">
          <span>{product.brand}</span>
          <span>{product.category}</span>
        </div>

        <div className="product-card__price">
          {product.sale_price ? (
            <>
              <span className="price price--sale">
                {formatPrice(product.sale_price)}
              </span>
              <span className="price price--old">
                {formatPrice(product.price)}
              </span>
            </>
          ) : (
            <span className="price">{formatPrice(product.price)}</span>
          )}
        </div>

        {sizes.length > 0 ? (
          <div className="size-row">
            {sizes.slice(0, 4).map((size) => (
              <span className="size-pill" key={size}>
                {size}
              </span>
            ))}
          </div>
        ) : null}
      </div>
    </article>
  );
}
