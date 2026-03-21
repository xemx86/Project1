import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

type CheckoutBody = {
  items?: Array<{
    productId?: string;
    quantity?: number;
    size?: string;
  }>;
};

type ProductCheckoutRow = {
  id: string;
  name: string;
  slug: string;
  image_url: string | null;
  price: number;
  sale_price: number | null;
};

function getBaseUrl(request: NextRequest) {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (configured) return configured.replace(/\/$/, "");
  const origin = request.headers.get("origin");
  if (origin) return origin.replace(/\/$/, "");
  return request.nextUrl.origin.replace(/\/$/, "");
}

function normalizeImageUrl(value: string | null) {
  if (!value) return undefined;
  if (value.startsWith("http://") || value.startsWith("https://")) return value;
  return undefined;
}

export async function POST(request: NextRequest) {
  try {
    const secretKey = process.env.STRIPE_SECRET_KEY;

    if (!secretKey) {
      return NextResponse.json(
        { error: "Brakuje STRIPE_SECRET_KEY. Uzupełnij env i spróbuj ponownie." },
        { status: 501 }
      );
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json(
        { error: "Brakuje danych Supabase w env." },
        { status: 500 }
      );
    }

    const body = (await request.json()) as CheckoutBody;
    const items = (body.items ?? [])
      .map((item) => ({
        productId: String(item.productId || ""),
        quantity: Math.max(1, Number(item.quantity || 1)),
        size: item.size ? String(item.size) : undefined
      }))
      .filter((item) => item.productId);

    if (items.length === 0) {
      return NextResponse.json({ error: "Koszyk jest pusty." }, { status: 400 });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);
    const productIds = [...new Set(items.map((item) => item.productId))];

    const { data, error } = await supabase
      .from("products")
      .select("id, name, slug, image_url, price, sale_price")
      .in("id", productIds)
      .eq("is_active", true);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const products = (data ?? []) as ProductCheckoutRow[];

    if (products.length === 0) {
      return NextResponse.json({ error: "Nie znaleziono produktów do checkoutu." }, { status: 400 });
    }

    const stripe = new Stripe(secretKey);
    const baseUrl = getBaseUrl(request);

    const lineItems = items.map((item) => {
      const product = products.find((entry) => entry.id === item.productId);

      if (!product) {
        throw new Error(`Produkt ${item.productId} nie istnieje lub jest nieaktywny.`);
      }

      const unitAmount = Math.round(Number(product.sale_price ?? product.price) * 100);
      const image = normalizeImageUrl(product.image_url);

      return {
        quantity: item.quantity,
        price_data: {
          currency: "pln",
          unit_amount: unitAmount,
          product_data: {
            name: product.name,
            images: image ? [image] : undefined,
            metadata: item.size ? { size: item.size, slug: product.slug } : { slug: product.slug }
          }
        }
      };
    });

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      billing_address_collection: "required",
      allow_promotion_codes: true,
      shipping_address_collection: {
        allowed_countries: ["PL", "US", "GB", "DE"]
      },
      success_url: `${baseUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/checkout/cancel`,
      line_items: lineItems,
      client_reference_id: `kickrush-${Date.now()}`
    });

    if (!session.url) {
      return NextResponse.json({ error: "Stripe nie zwrócił URL checkoutu." }, { status: 500 });
    }

    return NextResponse.json({ url: session.url });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Nie udało się utworzyć sesji Stripe."
      },
      { status: 500 }
    );
  }
}
