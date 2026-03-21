"use client";

import Link from "next/link";
import { useCart } from "@/components/cart-provider";
import { formatPrice } from "@/lib/utils";
import { CheckoutButton } from "@/components/checkout-button";
import { Locale } from "@/lib/i18n";

const ui = {
  en: {
    empty: "Your cart is empty.",
    goShop: "Go to shop",
    andAddProducts: "and add products.",
    remove: "Remove",
    summary: "Summary",
    ready: "Ready for checkout",
    items: "Items",
    shipping: "Shipping",
    calculatedInStripe: "calculated in Stripe",
    total: "Total",
    size: "size",
    checkoutInfo:
      "Checkout works based on current prices fetched from the database, not from localStorage.",
  },
  es: {
    empty: "Tu carrito está vacío.",
    goShop: "Ir a la tienda",
    andAddProducts: "y añade productos.",
    remove: "Eliminar",
    summary: "Resumen",
    ready: "Listo para el checkout",
    items: "Artículos",
    shipping: "Envío",
    calculatedInStripe: "calculado en Stripe",
    total: "Total",
    size: "talla",
    checkoutInfo:
      "El checkout funciona con los precios actuales obtenidos de la base de datos, no de localStorage.",
  },
};

export function CartPage({ lang }: { lang: Locale }) {
  const { items, subtotal, removeItem, setQuantity } = useCart();
  const t = ui[lang];

  if (items.length === 0) {
    return (
      <div className="empty-state">
        {t.empty} <Link href={`/${lang}/sklep`}>{t.goShop}</Link> {t.andAddProducts}
      </div>
    );
  }

  return (
    <div className="cart-layout">
      <section className="panel cart-items">
        {items.map((item) => (
          <article className="cart-item" key={`${item.productId}-${item.size || "one"}`}>
            <Link href={`/${lang}/produkt/${item.slug}`} className="cart-item__image">
              <img src={item.imageUrl || "/placeholder-product.svg"} alt={item.name} />
            </Link>

            <div className="cart-item__content">
              <div className="cart-item__head">
                <div>
                  <h3>{item.name}</h3>
                  <div className="footer-muted">
                    {item.brand}
                    {item.size ? ` · ${t.size} ${item.size}` : ""}
                  </div>
                </div>
                <button
                  type="button"
                  className="text-button"
                  onClick={() => removeItem(item.productId, item.size)}
                >
                  {t.remove}
                </button>
              </div>

              <div className="cart-item__footer">
                <div className="qty-stepper">
                  <button
                    type="button"
                    onClick={() => setQuantity(item.productId, item.quantity - 1, item.size)}
                  >
                    −
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    type="button"
                    onClick={() => setQuantity(item.productId, item.quantity + 1, item.size)}
                  >
                    +
                  </button>
                </div>

                <strong>{formatPrice(item.price * item.quantity)}</strong>
              </div>
            </div>
          </article>
        ))}
      </section>

      <aside className="panel cart-summary">
        <div className="eyebrow">{t.summary}</div>
        <h2>{t.ready}</h2>
        <div className="summary-row">
          <span>{t.items}</span>
          <strong>{formatPrice(subtotal)}</strong>
        </div>
        <div className="summary-row">
          <span>{t.shipping}</span>
          <strong>{t.calculatedInStripe}</strong>
        </div>
        <div className="summary-row summary-row--total">
          <span>{t.total}</span>
          <strong>{formatPrice(subtotal)}</strong>
        </div>

        <CheckoutButton />

        <p className="footer-muted" style={{ marginTop: 14 }}>
          {t.checkoutInfo}
        </p>
      </aside>
    </div>
  );
}