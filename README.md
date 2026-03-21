# KickRush Luxe Store

To jest ulepszona wersja startera sklepu:
- lepszy, bardziej premium front
- koszyk w `localStorage`
- checkout Stripe przez serwerowy endpoint
- panel admina na Supabase
- publiczny katalog i strony produktów

## Stack
- Next.js App Router
- Supabase Auth + Postgres
- Stripe Checkout

## 1. Supabase

W `SQL Editor` wklej najpierw:
- `supabase/schema.sql`

Potem opcjonalnie:
- `supabase/seed.sql`

## 2. Zmienne środowiskowe

Skopiuj `.env.example` do `.env.local` i uzupełnij:

```bash
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=...
STRIPE_SECRET_KEY=sk_test_...
```

## 3. Instalacja

```bash
npm install
npm run dev
```

## 4. Pierwszy admin

1. Załóż konto przez `/login`
2. W tabeli `profiles` zmień `role` z `customer` na `admin`
3. Zaloguj się ponownie i wejdź na `/admin`

## 5. Jak działa checkout

Endpoint `POST /api/checkout`:
- bierze produkty z koszyka
- pobiera aktualne ceny z tabeli `products`
- tworzy sesję Stripe Checkout
- odsyła klienta na URL Stripe

Po płatności klient wraca na:
- `/checkout/success`
- albo `/checkout/cancel`

## 6. Co jeszcze warto dorobić

To już jest sensowny starter, ale do pełnej wersji produkcyjnej warto jeszcze dodać:
- webhook Stripe do zapisu zamówień
- tabelę `orders` i `order_items`
- stany magazynowe
- upload zdjęć do Supabase Storage
- kupony, dostawy i politykę zwrotów

## 7. Uwaga praktyczna

Koszyk działa lokalnie w przeglądarce. To jest wygodne na start i do demo. Ceny do checkoutu i tak lecą z bazy, więc klient nie płaci według danych z localStorage.
