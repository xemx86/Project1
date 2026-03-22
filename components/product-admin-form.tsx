"use client";

import { useActionState, useEffect, useMemo, useState } from "react";
import {
  createProductAction,
  updateProductAction,
  type ProductActionState,
} from "@/lib/actions/products";
import { ProductRow } from "@/types/store";

const initialState: ProductActionState = {
  status: "idle",
  message: "",
};

function normalizeSizes(value?: string[] | null) {
  return value?.join(", ") ?? "";
}

function normalizeExtraImageUrls(
  value?: string[] | null,
  mainImage?: string | null
) {
  const main = (mainImage ?? "").trim();

  const cleaned = (value ?? [])
    .map((item) => item.trim())
    .filter(Boolean)
    .filter((item) => item !== main);

  return [cleaned[0] ?? "", cleaned[1] ?? "", cleaned[2] ?? ""];
}

export function ProductAdminForm({
  mode,
  product,
  onSaved,
}: {
  mode: "create" | "update";
  product?: ProductRow;
  onSaved?: () => void;
}) {
  const action = mode === "create" ? createProductAction : updateProductAction;
  const [state, formAction, isPending] = useActionState(action, initialState);
  const [featured, setFeatured] = useState(Boolean(product?.is_featured));

  const initialExtraImages = useMemo(
    () => normalizeExtraImageUrls(null, product?.image_url),
    [product?.image_url]
  );

  const [extraImages, setExtraImages] = useState<string[]>(initialExtraImages);

  useEffect(() => {
    setExtraImages(initialExtraImages);
  }, [initialExtraImages]);

  useEffect(() => {
    if (state.status === "success" && onSaved) {
      onSaved();
    }
  }, [state.status, onSaved]);

  return (
    <form action={formAction} className="admin-form">
      {product ? <input type="hidden" name="id" value={product.id} /> : null}

      <div className="form-grid">
        <div className="field">
          <label>
            Nazwa
            <input name="name" required defaultValue={product?.name} />
          </label>
        </div>

        <div className="field">
          <label>
            Slug
            <input
              name="slug"
              required
              defaultValue={product?.slug}
              placeholder="np. kickrush-barefoot-sand"
            />
          </label>
        </div>
      </div>

      <div className="form-grid-3">
        <div className="field">
          <label>
            Marka
            <input name="brand" required defaultValue={product?.brand ?? "KickRush"} />
          </label>
        </div>

        <div className="field">
          <label>
            Kategoria
            <input name="category" required defaultValue={product?.category} />
          </label>
        </div>

        <div className="field">
          <label>
            Kolor
            <input name="color" required defaultValue={product?.color} />
          </label>
        </div>
      </div>

      <div className="form-grid-3">
        <div className="field">
          <label>
            Materiał
            <input name="material" required defaultValue={product?.material} />
          </label>
        </div>

        <div className="field">
          <label>
            Cena
            <input
              name="price"
              type="number"
              min="0"
              step="0.01"
              required
              defaultValue={product?.price}
            />
          </label>
        </div>

        <div className="field">
          <label>
            Cena promocyjna
            <input
              name="sale_price"
              type="number"
              min="0"
              step="0.01"
              defaultValue={product?.sale_price ?? ""}
            />
          </label>
        </div>
      </div>

      <div className="form-grid">
        <div className="field">
          <label>
            Główne zdjęcie URL
            <input
              name="image_url"
              defaultValue={product?.image_url ?? ""}
              placeholder="https://..."
            />
          </label>
        </div>

        <div className="field">
          <label>
            Rozmiary
            <input
              name="sizes"
              defaultValue={normalizeSizes(product?.sizes)}
              placeholder="36, 37, 38, 39"
            />
          </label>
        </div>
      </div>

      <div className="field">
        <label style={{ marginBottom: 10, display: "block" }}>
          Dodatkowe zdjęcia URL
        </label>

        <div className="url-list">
          {extraImages.map((value, index) => (
            <div key={index} className="url-row">
              <input
                name="image_urls"
                value={value}
                onChange={(event) => {
                  const next = [...extraImages];
                  next[index] = event.target.value;
                  setExtraImages(next);
                }}
                placeholder={`https://... (zdjęcie ${index + 2})`}
              />

              <button
                type="button"
                className="button-secondary"
                onClick={() => {
                  if (extraImages.length === 1) {
                    setExtraImages([""]);
                    return;
                  }

                  setExtraImages(extraImages.filter((_, i) => i !== index));
                }}
              >
                Usuń
              </button>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 10 }}>
          <button
            type="button"
            className="button-secondary"
            onClick={() => setExtraImages([...extraImages, ""])}
          >
            Dodaj kolejne zdjęcie
          </button>
        </div>
      </div>

      <label style={{ display: "inline-flex", alignItems: "center", gap: 10 }}>
        <input
          type="checkbox"
          name="is_featured"
          checked={featured}
          onChange={(event) => setFeatured(event.target.checked)}
        />
        Pokaż na stronie głównej
      </label>

      {state.message ? (
        <div className={state.status === "error" ? "notice notice--danger" : "notice"}>
          {state.message}
        </div>
      ) : null}

      <button className="button" disabled={isPending} type="submit">
        {isPending ? "Zapisywanie..." : mode === "create" ? "Dodaj produkt" : "Zapisz zmiany"}
      </button>
    </form>
  );
}
