"use server";

import { revalidatePath } from "next/cache";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { getCurrentProfile } from "@/lib/auth";
import { parseSizes } from "@/lib/utils";

export type ProductActionState = {
  status: "idle" | "success" | "error";
  message: string;
};

async function requireAdmin() {
  const profile = await getCurrentProfile();

  if (!profile || profile.role !== "admin") {
    throw new Error("Brak dostępu admina.");
  }

  return profile;
}

function parseImageUrls(values: FormDataEntryValue[]) {
  return Array.from(
    new Set(
      values
        .map((item) => String(item).trim())
        .filter(Boolean)
    )
  );
}

function getProductPayload(formData: FormData) {
  const salePriceRaw = String(formData.get("sale_price") || "").trim();
  const imageUrlsRaw = formData.getAll("image_urls");

  return {
    name: String(formData.get("name") || "").trim(),
    slug: String(formData.get("slug") || "").trim().toLowerCase(),
    brand: String(formData.get("brand") || "").trim(),
    category: String(formData.get("category") || "").trim(),
    color: String(formData.get("color") || "").trim(),
    material: String(formData.get("material") || "").trim(),
    description: String(formData.get("description") || "").trim(),
    image_url: String(formData.get("image_url") || "").trim() || null,
    image_urls: parseImageUrls(imageUrlsRaw),
    price: Number(formData.get("price") || 0),
    sale_price: salePriceRaw ? Number(salePriceRaw) : null,
    sizes: parseSizes(String(formData.get("sizes") || "")),
    is_featured: formData.get("is_featured") === "on",
  };
}

function revalidateStorePaths(slug?: string) {
  const paths = [
    "/",
    "/sklep",
    "/admin",
    "/en",
    "/es",
    "/en/sklep",
    "/es/sklep",
    "/en/admin",
    "/es/admin",
  ];

  if (slug) {
    paths.push(`/produkt/${slug}`);
    paths.push(`/en/produkt/${slug}`);
    paths.push(`/es/produkt/${slug}`);
  }

  for (const path of paths) {
    revalidatePath(path);
  }
}

export async function createProductAction(
  _: ProductActionState,
  formData: FormData
): Promise<ProductActionState> {
  try {
    await requireAdmin();
    const supabase = await createServerSupabaseClient();
    const payload = getProductPayload(formData);

    if (!payload.name || !payload.slug) {
      return { status: "error", message: "Nazwa i slug są wymagane." };
    }

    const { error } = await supabase.from("products").insert(payload);

    if (error) {
      return { status: "error", message: error.message };
    }

    revalidateStorePaths(payload.slug);

    return { status: "success", message: "Produkt został dodany." };
  } catch (error) {
    return {
      status: "error",
      message:
        error instanceof Error
          ? error.message
          : "Nie udało się dodać produktu.",
    };
  }
}

export async function updateProductAction(
  _: ProductActionState,
  formData: FormData
): Promise<ProductActionState> {
  try {
    await requireAdmin();
    const supabase = await createServerSupabaseClient();
    const id = String(formData.get("id") || "");
    const payload = getProductPayload(formData);

    if (!id) {
      return { status: "error", message: "Brakuje ID produktu." };
    }

    const { error } = await supabase.from("products").update(payload).eq("id", id);

    if (error) {
      return { status: "error", message: error.message };
    }

    revalidateStorePaths(payload.slug);

    return { status: "success", message: "Zmiany zostały zapisane." };
  } catch (error) {
    return {
      status: "error",
      message:
        error instanceof Error
          ? error.message
          : "Nie udało się zapisać zmian.",
    };
  }
}

export async function deleteProductAction(
  _: ProductActionState,
  formData: FormData
): Promise<ProductActionState> {
  try {
    await requireAdmin();
    const supabase = await createServerSupabaseClient();
    const id = String(formData.get("id") || "");

    if (!id) {
      return { status: "error", message: "Brakuje ID produktu." };
    }

    const { error } = await supabase.from("products").delete().eq("id", id);

    if (error) {
      return { status: "error", message: error.message };
    }

    revalidateStorePaths();

    return { status: "success", message: "Produkt został usunięty." };
  } catch (error) {
    return {
      status: "error",
      message:
        error instanceof Error
          ? error.message
          : "Nie udało się usunąć produktu.",
    };
  }
}