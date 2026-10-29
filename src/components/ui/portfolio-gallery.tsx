"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { useState, type CSSProperties } from "react"
import "./portfolio-gallery.css"

/**
 * Portfolio Gallery — a fan of overlapping 3D cards on desktop that lift on
 * hover, and a marquee on mobile.
 *
 * Ported from the Tailwind/shadcn original to plain CSS (`portfolio-gallery.css`),
 * since this project styles with vanilla CSS. The `spacing` class prop of the
 * original is replaced by `itemWidth` and `overlap`, in pixels.
 */

export interface PortfolioGalleryImage {
  src: string
  alt: string
  /** Shown as a caption on the card. */
  title?: string
}

interface PortfolioGalleryProps {
  title?: string
  description?: string
  archiveButton?: {
    text: string
    href: string
  }
  images?: PortfolioGalleryImage[]
  className?: string
  /** How far the middle card rises above the edges, in px. */
  maxHeight?: number
  /** Desktop card width, in px. */
  itemWidth?: number
  /** How much each desktop card overlaps the previous one, in px. */
  overlap?: number
  onImageClick?: (index: number) => void
  /**
   * Whether to pause marquee animation on hover (mobile only)
   * @default true
   */
  pauseOnHover?: boolean
  /**
   * Number of times to repeat the content in marquee (mobile only)
   * @default 4
   */
  marqueeRepeat?: number
}

const DEFAULT_IMAGES: PortfolioGalleryImage[] = [
  {
    src: "https://cdn.21st.dev/assets/mirror/d7/d7b4f814ea6a53c734011ba07290c57cd90c7fcbbdc6d733c58bb96e1974c35d.jpg",
    alt: "SaaS Dashboard Design",
  },
  {
    src: "https://cdn.21st.dev/assets/mirror/07/0771aea1a63bf4c0f86a50a671a2a8c0def8d6dfaed9d4059094144dfae128b2.jpg",
    alt: "Web Development",
  },
  {
    src: "https://cdn.21st.dev/assets/mirror/06/06a56789c12bfaff3d8ca3cdaf4b6c904afb6dffa29ef229b1710e79efe74605.jpg",
    alt: "E-Commerce Platform",
  },
  {
    src: "https://cdn.21st.dev/assets/mirror/d9/d9518d4aa10cfcbe33ddac518bdc215a2a8056166d66428ecfd9a9f93a27d77f.jpg",
    alt: "Mobile App Design",
  },
  {
    src: "https://cdn.21st.dev/assets/mirror/4e/4e73d3917d198eb3f4d198d415a5184f4a41713f5f549675e2ec7682bab28770.jpg",
    alt: "Brand Identity",
  },
  {
    src: "https://cdn.21st.dev/assets/mirror/74/74761eb7d8ecb048e423824fb405469ab51993b5b90bb414d05748a01a4e3c35.jpg",
    alt: "Marketing Campaign",
  },
  {
    src: "https://cdn.21st.dev/assets/mirror/07/07ab48b81e987c96630c5f2ad3ab6fcc5f4d687fb5bc3b74b9fad9b4a95648c0.jpg",
    alt: "Product Photography",
  },
]

export function PortfolioGallery({
  title = "Browse my library",
  description,
  archiveButton = {
    text: "View gallery",
    href: "/work",
  },
  images: customImages,
  className = "",
  maxHeight = 120,
  itemWidth = 384,
  overlap = 320,
  onImageClick,
  pauseOnHover = true,
  marqueeRepeat = 4,
}: PortfolioGalleryProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const images = customImages || DEFAULT_IMAGES

  return (
    <section aria-label={title} className={`pg-section ${className}`.trim()}>
      <div className="pg-card">
        {/* Header Section */}
        <div className="pg-header">
          <h2 className="pg-title">{title}</h2>
          {description ? <p className="pg-description">{description}</p> : null}

          <Link href={archiveButton.href} className="pg-button">
            <span>{archiveButton.text}</span>
            <svg className="pg-button-icon" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </Link>
        </div>

        {/* Desktop 3D overlapping layout - hidden on mobile */}
        <div className="pg-desktop">
          <div className="pg-row" style={{ "--pg-overlap": `${overlap}px` } as CSSProperties}>
            {images.map((image, index) => {
              // Stagger height - peak in middle, descending to edges
              const total = images.length
              const middle = Math.floor(total / 2)
              const distanceFromMiddle = Math.abs(index - middle)
              const staggerOffset = maxHeight - distanceFromMiddle * 20

              const isHovered = hoveredIndex === index
              const isOtherHovered = hoveredIndex !== null && hoveredIndex !== index

              // The hovered card rises to a fixed height; the others settle to the baseline
              const yOffset = isHovered ? -120 : isOtherHovered ? 0 : -staggerOffset

              return (
                <motion.button
                  key={index}
                  type="button"
                  className="pg-item"
                  aria-label={image.title ?? image.alt}
                  style={{ zIndex: total - index }}
                  initial={{
                    transform: `perspective(5000px) rotateY(-45deg) translateY(200px)`,
                    opacity: 0,
                  }}
                  animate={{
                    transform: `perspective(5000px) rotateY(-45deg) translateY(${yOffset}px)`,
                    opacity: 1,
                  }}
                  transition={{
                    duration: 0.2,
                    delay: index * 0.05,
                    ease: [0.25, 0.1, 0.25, 1],
                  }}
                  onHoverStart={() => setHoveredIndex(index)}
                  onHoverEnd={() => setHoveredIndex(null)}
                  onFocus={() => setHoveredIndex(index)}
                  onBlur={() => setHoveredIndex(null)}
                  onClick={() => onImageClick?.(index)}
                >
                  <span className="pg-frame" style={{ width: itemWidth }}>
                    <img src={image.src} alt={image.alt} className="pg-img" loading="lazy" decoding="async" />
                    {image.title ? <span className="pg-caption">{image.title}</span> : null}
                  </span>
                </motion.button>
              )
            })}
          </div>
        </div>

        {/* Mobile marquee layout */}
        <div className="pg-mobile">
          <div className={`pg-marquee${pauseOnHover ? " pg-marquee--pause" : ""}`}>
            {Array.from({ length: marqueeRepeat }, (_, i) => (
              <div key={i} className="pg-marquee-track" aria-hidden={i > 0 || undefined}>
                {images.map((image, index) => (
                  <button
                    key={`${i}-${index}`}
                    type="button"
                    className="pg-mobile-item"
                    tabIndex={i > 0 ? -1 : undefined}
                    aria-label={image.title ?? image.alt}
                    onClick={() => onImageClick?.(index)}
                  >
                    <span className="pg-frame pg-frame--mobile">
                      <img src={image.src} alt={i > 0 ? "" : image.alt} className="pg-img" loading="lazy" decoding="async" />
                      {image.title ? <span className="pg-caption">{image.title}</span> : null}
                    </span>
                  </button>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default PortfolioGallery
