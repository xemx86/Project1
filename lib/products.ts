import { createServerSupabaseClient } from "@/lib/supabase/server";
import { ProductRow } from "@/types/store";

type ListOptions = {
  limit?: number;
  featuredOnly?: boolean;
  search?: string;
  category?: string;
  color?: string;
  material?: string;
  sort?: string;
};

export async function listProducts(options: ListOptions = {}): Promise<ProductRow[]> {
  const supabase = await createServerSupabaseClient();

  let query = supabase
    .from("products")
    .select("*")
    .eq("is_active", true);

  if (options.featuredOnly) {
    query = query.eq("is_featured", true);
  }

  if (options.search) {
    query = query.or(`name.ilike.%${options.search}%,brand.ilike.%${options.search}%,description.ilike.%${options.search}%`);
  }

  if (options.category) query = query.eq("category", options.category);
  if (options.color) query = query.eq("color", options.color);
  if (options.material) query = query.eq("material", options.material);

  switch (options.sort) {
    case "price_asc":
      query = query.order("price", { ascending: true });
      break;
    case "price_desc":
      query = query.order("price", { ascending: false });
      break;
    case "name_asc":
      query = query.order("name", { ascending: true });
      break;
    default:
      query = query.order("created_at", { ascending: false });
      break;
  }

  if (options.limit) {
    query = query.limit(options.limit);
  }

  const { data, error } = await query;

  if (error) {
    console.error("listProducts error", error.message);
    return [];
  }

  return (data ?? []) as ProductRow[];
}

export async function getProductBySlug(slug: string): Promise<ProductRow | null> {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("slug", slug)
    .eq("is_active", true)
    .maybeSingle();

  if (error) {
    console.error("getProductBySlug error", error.message);
    return null;
  }

  return (data ?? null) as ProductRow | null;
}

export async function listTaxonomy() {
  const products = await listProducts({ limit: 500 });

  const categories = [...new Set(products.map((item) => item.category).filter(Boolean))].sort();
  const colors = [...new Set(products.map((item) => item.color).filter(Boolean))].sort();
  const materials = [...new Set(products.map((item) => item.material).filter(Boolean))].sort();

  return { categories, colors, materials };
}
