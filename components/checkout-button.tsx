"use client";

import { useState } from "react";
import { useCart } from "@/components/cart-provider";

export function CheckoutButton() {
  const { items } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleCheckout() {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          items: items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            size: item.size
          }))
        })
      });

      const payload = (await response.json()) as { error?: string; url?: string };

      if (!response.ok || !payload.url) {
        setError(payload.error || "Nie udało się utworzyć checkoutu.");
        setLoading(false);
        return;
      }

      window.location.href = payload.url;
    } catch {
      setError("Połączenie z checkoutem nie powiodło się.");
      setLoading(false);
    }
  }

  return (
    <div className="checkout-box">
      {error ? <div className="notice notice--danger">{error}</div> : null}
      <button className="button button--wide" type="button" onClick={handleCheckout} disabled={loading || items.length === 0}>
        {loading ? "Przekierowanie..." : "Zapłać przez Stripe"}
      </button>
    </div>
  );
}
