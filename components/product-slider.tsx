"use client";

import { RotatingProductImage } from "@/components/rotating-product-image";
import Link from "next/link";
import { useMemo, useRef, useState } from "react";
import { ProductRow } from "@/types/store";
import { Locale } from "@/lib/i18n";
import { formatPrice } from "@/lib/utils";

type Props = {
  products: ProductRow[];
  lang: Locale;
  title?: string;
};

export function ProductSlider({
  products,
  lang,
  title = "New Arrivals",
}: Props) {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const validProducts = useMemo(() => products ?? [], [products]);

  function scrollToIndex(index: number) {
    const track = trackRef.current;
    if (!track) return;

    const slides = track.querySelectorAll<HTMLElement>(".slider-slide");
    const clampedIndex = Math.max(0, Math.min(index, slides.length - 1));
    const target = slides[clampedIndex];

    if (!target) return;

    target.scrollIntoView({
      behavior: "smooth",
      inline: "start",
      block: "nearest",
    });

    setActiveIndex(clampedIndex);
  }

  function handlePrev() {
    scrollToIndex(activeIndex - 1);
  }

  function handleNext() {
    scrollToIndex(activeIndex + 1);
  }

  function handleScroll() {
    const track = trackRef.current;
    if (!track) return;

    const slides = Array.from(
      track.querySelectorAll<HTMLElement>(".slider-slide")
    );

    if (!slides.length) return;

    const trackLeft = track.getBoundingClientRect().left;

    let closestIndex = 0;
    let closestDistance = Number.POSITIVE_INFINITY;

    slides.forEach((slide, index) => {
      const distance = Math.abs(slide.getBoundingClientRect().left - trackLeft);
      if (distance < closestDistance) {
        closestDistance = distance;
        closestIndex = index;
      }
    });

    setActiveIndex(closestIndex);
  }

  if (!validProducts.length) return null;

  return (
    <section className="slider-section">
      <div className="slider-header">
        <h2>{title}</h2>
      </div>

      <div className="slider-shell">
        <button
          type="button"
          className="slider-arrow slider-arrow--left"
          onClick={handlePrev}
          aria-label="Previous products"
        >
          ‹
        </button>

        <div
          className="slider-track"
          ref={trackRef}
          onScroll={handleScroll}
        >
          {validProducts.map((product) => (
            <div className="slider-slide" key={product.id}>
              <article className="slider-card">
                <Link
                  href={`/${lang}/produkt/${product.slug}`}
                  className="slider-card__image"
                >
                  <RotatingProductImage
                    name={product.name}
                    imageUrl={product.image_url}
                    imageUrls={product.image_urls ?? []}
                    intervalMs={1500}
                  />
                </Link>

                <div className="slider-card__body">
                  <Link
                    href={`/${lang}/produkt/${product.slug}`}
                    className="slider-card__title"
                  >
                    {product.name}
                  </Link>

                  <div className="slider-card__price">
                    {formatPrice(product.sale_price ?? product.price)}
                  </div>
                </div>
              </article>
            </div>
          ))}
        </div>

        <button
          type="button"
          className="slider-arrow slider-arrow--right"
          onClick={handleNext}
          aria-label="Next products"
        >
          ›
        </button>
      </div>

      <div className="slider-dots">
        {validProducts.map((_, index) => (
          <button
            key={index}
            type="button"
            className={index === activeIndex ? "slider-dot is-active" : "slider-dot"}
            onClick={() => scrollToIndex(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
