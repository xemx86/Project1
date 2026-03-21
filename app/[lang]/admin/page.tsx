import Link from "next/link";
import { redirect } from "next/navigation";
import { listProducts } from "@/lib/products";
import { getCurrentProfile } from "@/lib/auth";
import { ProductAdminForm } from "@/components/product-admin-form";
import { ProductAdminList } from "@/components/product-admin-list";
import { Locale } from "@/lib/i18n";

export default async function AdminPage({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}) {
  const { lang } = await params;
  const profile = await getCurrentProfile();

  if (!profile) {
    redirect(`/${lang}/login`);
  }

  if (profile.role !== "admin") {
    return (
      <div className="container admin-page">
        <div className="info-card status-card">
          <h1>Brak dostępu</h1>
          <p className="footer-muted">
            Konto jest zalogowane, ale nie ma roli admin. Nadaj rolę w tabeli
            <code> profiles</code>.
          </p>
          <Link className="button" href={`/${lang}`}>
            Wróć na start
          </Link>
        </div>
      </div>
    );
  }

  const products = await listProducts({ sort: "newest", limit: 100 });

  return (
    <div className="container admin-page">
      <div className="admin-stack">
        <section className="admin-card">
          <div className="admin-toolbar">
            <div>
              <div className="eyebrow">Panel admina</div>
              <h1 style={{ marginTop: 10, marginBottom: 8 }}>Zarządzanie sklepem</h1>
              <div className="footer-muted">Zalogowany jako {profile.email}</div>
            </div>
            <div className="inline-actions">
              <Link href={`/${lang}/sklep`} className="button-secondary">
                Podejrzyj sklep
              </Link>
              <Link href={`/${lang}/koszyk`} className="button-secondary">
                Sprawdź koszyk
              </Link>
            </div>
          </div>
        </section>

        <section className="admin-card">
          <h2>Dodaj nowy produkt</h2>
          <ProductAdminForm mode="create" />
        </section>

        <section className="admin-card">
          <div className="admin-toolbar">
            <div>
              <h2>Produkty</h2>
              <div className="footer-muted">{products.length} pozycji</div>
            </div>
          </div>
          <ProductAdminList products={products} />
        </section>
      </div>
    </div>
  );
}