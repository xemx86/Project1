export type ProductRow = {
  id: string;
  name: string;
  slug: string;
  brand: string;
  description: string | null;
  image_url: string | null;
  category: string;
  color: string;
  material: string;
  price: number;
  sale_price: number | null;
  sizes: string[];
  is_featured: boolean;
  is_active: boolean;
  created_at: string;
};

export type ProfileRow = {
  id: string;
  email: string;
  role: "admin" | "customer";
};
