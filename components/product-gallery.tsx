"use client";

import { useEffect, useMemo, useState } from "react";

type Props = {
  name: string;
  imageUrl: string | null;
  imageUrls?: string[];
};

export default function ProductGallery({
  name,
  imageUrl,
  imageUrls = [],
}: Props) {
  const images =
    imageUrls.length > 0 ? imageUrls : imageUrl ? [imageUrl] : [];

  return (
    <div>
      {images.map((src, index) => (
        <img
          key={index}
          src={src}
          alt={name}
        />
      ))}
    </div>
  );
}

export function ProductGallery({ name, imageUrl, imageUrls }: Props) {
  const images = useMemo(() => {
    const merged = [
      ...(imageUrl ? [imageUrl] : []),
      ...(imageUrls ?? []),
    ]
      .map((item) => item?.trim())
      .filter(Boolean) as string[];

    const unique = Array.from(new Set(merged));
    return unique.length ? unique : ["/placeholder-product.svg"];
  }, [imageUrl, imageUrls]);

  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    setActiveIndex(0);
  }, [images]);

  function goPrev() {
    setActiveIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  }

  function goNext() {
    setActiveIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  }

  const activeImage = images[activeIndex];

  return (
    <div className="product-gallery panel">
      <div className="product-gallery__main">
        {images.length > 1 ? (
          <button
            type="button"
            className="product-gallery__arrow product-gallery__arrow--left"
            onClick={goPrev}
            aria-label="Previous image"
          >
            ‹
          </button>
        ) : null}

        <img src={activeImage} alt={name} />

        {images.length > 1 ? (
          <button
            type="button"
            className="product-gallery__arrow product-gallery__arrow--right"
            onClick={goNext}
            aria-label="Next image"
          >
            ›
          </button>
        ) : null}
      </div>
    </div>
  );
}
