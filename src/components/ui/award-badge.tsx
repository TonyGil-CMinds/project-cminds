"use client"

import React, { useId, useRef, useState, type FocusEvent, type MouseEvent, type ReactNode } from "react"

/**
 * Award Badge — a holographic badge that tilts toward the cursor, with
 * rotating colour washes blended over it.
 *
 * Ported from the Tailwind original to plain CSS. The Product Hunt presets
 * (`type`, `place`) still work; `eyebrow`, `title`, `icon` and the colour
 * props turn it into a badge for anything else. SVG ids are unique per
 * instance, so several badges can share a page.
 */

type AwardBadgeType = "golden-kitty" | "product-of-the-day" | "product-of-the-month" | "product-of-the-week"

interface AwardBadgeProps {
  type?: AwardBadgeType
  place?: number
  /** Renders the badge as a link that opens in a new tab. */
  link?: string
  /** Small line above the title. Defaults to "PRODUCT HUNT". */
  eyebrow?: string
  /** Main line. Defaults to the preset title for `type`. */
  title?: string
  /** SVG content for the left slot, drawn in viewBox units (54 high). */
  icon?: ReactNode
  /** Width of the icon slot in viewBox units. */
  iconWidth?: number
  /** A colour, or two colours for a diagonal gradient. */
  background?: string | [string, string]
  /** Text and icon colour. */
  ink?: string
  /** Inner border colour. */
  stroke?: string
  /** Rendered width in px; the height follows the 260 × 54 ratio. */
  width?: number
  /** Accessible name; defaults to eyebrow + title. */
  label?: string
  className?: string
}

const identityMatrix =
  "1, 0, 0, 0, " +
  "0, 1, 0, 0, " +
  "0, 0, 1, 0, " +
  "0, 0, 0, 1"

const maxRotate = 0.25
const minRotate = -0.25
const maxScale = 1
const minScale = 0.97

const presetBackground = ["#f3e3ac", "#ddd", "#f1cfa6"]

const presetTitle: Record<AwardBadgeType, string> = {
  "golden-kitty": "Golden Kitty Awards",
  "product-of-the-day": "Product of the Day",
  "product-of-the-month": "Product of the Month",
  "product-of-the-week": "Product of the Week",
}

const OVERLAYS = [
  "hsl(358, 100%, 62%)",
  "hsl(30, 100%, 50%)",
  "hsl(60, 100%, 50%)",
  "hsl(96, 100%, 50%)",
  "hsl(233, 85%, 47%)",
  "hsl(271, 85%, 47%)",
  "hsl(300, 20%, 35%)",
  "transparent",
  "transparent",
  "white",
]

const AB_CSS =
  `
.ab-root { display: block; height: auto; cursor: pointer; text-decoration: none; -webkit-tap-highlight-color: transparent; }
.ab-root:focus-visible { outline: 2px solid currentColor; outline-offset: 4px; border-radius: 12px; }
.ab-root svg { display: block; width: 100%; height: auto; overflow: visible; }
.ab-tilt { transform-origin: center center; transition: transform 200ms ease-out; }
@media (prefers-reduced-motion: reduce) {
  .ab-tilt { transform: none !important; }
  .ab-wash { animation: none !important; transition: none !important; }
}
` +
  Array.from(
    { length: 10 },
    (_, e) => `
@keyframes ab-overlay-${e + 1} {
  0% { transform: rotate(${e * 10}deg); }
  50% { transform: rotate(${(e + 1) * 10}deg); }
  100% { transform: rotate(${e * 10}deg); }
}`,
  ).join("")

const ProductHuntIcon = ({ ink }: { ink: string }) => (
  <g transform="translate(8, 9)">
    <path
      fill={ink}
      d="M14.963 9.075c.787-3-.188-5.887-.188-5.887S12.488 5.175 11.7 8.175c-.787 3 .188 5.887.188 5.887s2.25-1.987 3.075-4.987m-4.5 1.987c.787 3-.188 5.888-.188 5.888S7.988 14.962 7.2 11.962c-.787-3 .188-5.887.188-5.887s2.287 1.987 3.075 4.987m.862 10.388s-.6-2.962-2.775-5.175C6.337 14.1 3.375 13.5 3.375 13.5s.6 2.962 2.775 5.175c2.213 2.175 5.175 2.775 5.175 2.775m3.3 3.413s-1.988-2.288-4.988-3.075-5.887.187-5.887.187 1.987 2.287 4.988 3.075c3 .787 5.887-.188 5.887-.188Zm6.75 0s1.988-2.288 4.988-3.075c3-.826 5.887.187 5.887.187s-1.988 2.287-4.988 3.075c-3 .787-5.887-.188-5.887-.188ZM32.625 13.5s-2.963.6-5.175 2.775c-2.213 2.213-2.775 5.175-2.775 5.175s2.962-.6 5.175-2.775c2.175-2.213 2.775-5.175 2.775-5.175M28.65 6.075s.975 2.887.188 5.887c-.826 3-3.076 4.988-3.076 4.988s-.974-2.888-.187-5.888c.788-3 3.075-4.987 3.075-4.987m-4.5 7.987s.975-2.887.188-5.887c-.788-3-3.076-4.988-3.076-4.988s-.974 2.888-.187 5.888c.788 3 3.075 4.988 3.075 4.988ZM18 26.1c.975-.225 3.113-.6 5.325 0 3 .788 5.063 3.038 5.063 3.038s-2.888.975-5.888.187a13 13 0 0 1-1.425-.525c.563.788 1.125 1.425 2.288 1.913l-.863 2.062c-2.063-.862-2.925-2.137-3.675-3.262-.262-.375-.525-.713-.787-1.05-.26.293-.465.586-.686.903l-.102.147-.048.068c-.775 1.108-1.643 2.35-3.627 3.194l-.862-2.062c1.162-.488 1.725-1.125 2.287-1.913-.45.225-.938.375-1.425.525-3 .788-5.887-.187-5.887-.187s1.987-2.288 4.987-3.075c2.212-.563 4.35-.188 5.325.037"
    />
  </g>
)

export const AwardBadge = ({
  type = "golden-kitty",
  place,
  link,
  eyebrow = "PRODUCT HUNT",
  title,
  icon,
  iconWidth = 36,
  background,
  ink = "#666",
  stroke = "#bbb",
  width,
  label,
  className,
}: AwardBadgeProps) => {
  const uid = useId().replace(/:/g, "")
  const ref = useRef<HTMLElement>(null)
  const [firstOverlayPosition, setFirstOverlayPosition] = useState<number>(0)
  const [matrix, setMatrix] = useState<string>(identityMatrix)
  const [currentMatrix, setCurrentMatrix] = useState<string>(identityMatrix)
  const [disableInOutOverlayAnimation, setDisableInOutOverlayAnimation] = useState<boolean>(true)
  const [disableOverlayAnimation, setDisableOverlayAnimation] = useState<boolean>(false)
  const [isTimeoutFinished, setIsTimeoutFinished] = useState<boolean>(false)
  const enterTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)
  const leaveTimeout1 = useRef<ReturnType<typeof setTimeout> | null>(null)
  const leaveTimeout2 = useRef<ReturnType<typeof setTimeout> | null>(null)
  const leaveTimeout3 = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Once the entry tilt has settled, the badge follows the pointer directly.
  const shownMatrix = isTimeoutFinished ? currentMatrix : matrix

  const getDimensions = () => {
    const rect = ref.current?.getBoundingClientRect()
    return { left: rect?.left || 0, right: rect?.right || 0, top: rect?.top || 0, bottom: rect?.bottom || 0 }
  }

  const getMatrix = (clientX: number, clientY: number) => {
    const { left, right, top, bottom } = getDimensions()
    const xCenter = (left + right) / 2
    const yCenter = (top + bottom) / 2

    const scale = [
      maxScale - ((maxScale - minScale) * Math.abs(xCenter - clientX)) / (xCenter - left),
      maxScale - ((maxScale - minScale) * Math.abs(yCenter - clientY)) / (yCenter - top),
      maxScale -
        ((maxScale - minScale) * (Math.abs(xCenter - clientX) + Math.abs(yCenter - clientY))) /
          (xCenter - left + yCenter - top),
    ]

    const rotate = {
      x1: 0.25 * ((yCenter - clientY) / yCenter - (xCenter - clientX) / xCenter),
      x2: maxRotate - ((maxRotate - minRotate) * Math.abs(right - clientX)) / (right - left),
      x3: 0,
      y0: 0,
      y2: maxRotate - ((maxRotate - minRotate) * (top - clientY)) / (top - bottom),
      y3: 0,
      z0: -(maxRotate - ((maxRotate - minRotate) * Math.abs(right - clientX)) / (right - left)),
      z1: 0.2 - ((0.2 + 0.6) * (top - clientY)) / (top - bottom),
      z3: 0,
    }
    return (
      `${scale[0]}, ${rotate.y0}, ${rotate.z0}, 0, ` +
      `${rotate.x1}, ${scale[1]}, ${rotate.z1}, 0, ` +
      `${rotate.x2}, ${rotate.y2}, ${scale[2]}, 0, ` +
      `${rotate.x3}, ${rotate.y3}, ${rotate.z3}, 1`
    )
  }

  const getOppositeMatrix = (_matrix: string, clientY: number, onMouseEnter?: boolean) => {
    const { top, bottom } = getDimensions()
    const oppositeY = bottom - clientY + top
    const weakening = onMouseEnter ? 0.7 : 4
    const multiplier = onMouseEnter ? -1 : 1

    return _matrix
      .split(", ")
      .map((item, index) => {
        if (index === 2 || index === 4 || index === 8) {
          return (-parseFloat(item) * multiplier) / weakening
        } else if (index === 0 || index === 5 || index === 10) {
          return "1"
        } else if (index === 6) {
          return (multiplier * (maxRotate - ((maxRotate - minRotate) * (top - oppositeY)) / (top - bottom))) / weakening
        } else if (index === 9) {
          return (maxRotate - ((maxRotate - minRotate) * (top - oppositeY)) / (top - bottom)) / weakening
        }
        return item
      })
      .join(", ")
  }

  const onMouseEnter = (e: MouseEvent<HTMLElement>) => {
    if (leaveTimeout1.current) clearTimeout(leaveTimeout1.current)
    if (leaveTimeout2.current) clearTimeout(leaveTimeout2.current)
    if (leaveTimeout3.current) clearTimeout(leaveTimeout3.current)
    setDisableOverlayAnimation(true)

    const { left, right, top, bottom } = getDimensions()
    const xCenter = (left + right) / 2
    const yCenter = (top + bottom) / 2

    setDisableInOutOverlayAnimation(false)
    enterTimeout.current = setTimeout(() => setDisableInOutOverlayAnimation(true), 350)
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setFirstOverlayPosition((Math.abs(xCenter - e.clientX) + Math.abs(yCenter - e.clientY)) / 1.5)
      })
    })

    const entered = getMatrix(e.clientX, e.clientY)
    const oppositeMatrix = getOppositeMatrix(entered, e.clientY, true)

    setMatrix(oppositeMatrix)
    setCurrentMatrix(oppositeMatrix)
    setIsTimeoutFinished(false)
    setTimeout(() => setIsTimeoutFinished(true), 200)
  }

  const onMouseMove = (e: MouseEvent<HTMLElement>) => {
    const { left, right, top, bottom } = getDimensions()
    const xCenter = (left + right) / 2
    const yCenter = (top + bottom) / 2

    setTimeout(
      () => setFirstOverlayPosition((Math.abs(xCenter - e.clientX) + Math.abs(yCenter - e.clientY)) / 1.5),
      150,
    )

    if (isTimeoutFinished) {
      setCurrentMatrix(getMatrix(e.clientX, e.clientY))
    }
  }

  const onMouseLeave = (e: MouseEvent<HTMLElement>) => {
    const oppositeMatrix = getOppositeMatrix(shownMatrix, e.clientY)

    if (enterTimeout.current) clearTimeout(enterTimeout.current)

    setIsTimeoutFinished(true)
    setCurrentMatrix(oppositeMatrix)
    setTimeout(() => setCurrentMatrix(identityMatrix), 200)

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setDisableInOutOverlayAnimation(false)
        leaveTimeout1.current = setTimeout(() => setFirstOverlayPosition(-firstOverlayPosition / 4), 150)
        leaveTimeout2.current = setTimeout(() => setFirstOverlayPosition(0), 300)
        leaveTimeout3.current = setTimeout(() => {
          setDisableOverlayAnimation(false)
          setDisableInOutOverlayAnimation(true)
        }, 500)
      })
    })
  }

  // Keyboard focus gets a gentle fixed tilt so the badge still reacts.
  const onFocus = (e: FocusEvent<HTMLElement>) => {
    const r = e.currentTarget.getBoundingClientRect()
    setIsTimeoutFinished(true)
    setCurrentMatrix(getMatrix(r.left + r.width * 0.75, r.top + r.height * 0.3))
  }
  const onBlur = () => setCurrentMatrix(identityMatrix)

  const fill = background ?? presetBackground[(place || 2) - 1] ?? presetBackground[1]
  const gradientId = `ab-bg-${uid}`
  const textX = 8 + iconWidth + 9
  const heading = title ?? `${presetTitle[type]}${place ? ` #${place}` : ""}`
  const name = label ?? `${eyebrow} — ${heading}`

  const svg = (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 260 54" aria-hidden="true">
      <defs>
        <filter id={`ab-blur-${uid}`}>
          <feGaussianBlur in="SourceGraphic" stdDeviation="3" />
        </filter>
        <mask id={`ab-mask-${uid}`}>
          <rect width="260" height="54" fill="white" rx="10" />
        </mask>
        {Array.isArray(fill) ? (
          <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor={fill[0]} />
            <stop offset="1" stopColor={fill[1]} />
          </linearGradient>
        ) : null}
      </defs>
      <rect width="260" height="54" rx="10" fill={Array.isArray(fill) ? `url(#${gradientId})` : fill} />
      <rect x="4" y="4" width="252" height="46" rx="8" fill="transparent" stroke={stroke} strokeWidth="1" />
      <text fontFamily="Helvetica-Bold, Helvetica, Arial, sans-serif" fontSize="9" fontWeight="bold" fill={ink} x={textX + 1} y="20" letterSpacing="0.4">
        {eyebrow}
      </text>
      <text fontFamily="Helvetica-Bold, Helvetica, Arial, sans-serif" fontSize="16" fontWeight="bold" fill={ink} x={textX} y="40">
        {heading}
      </text>
      {icon ?? <ProductHuntIcon ink={ink} />}
      <g style={{ mixBlendMode: "overlay" }} mask={`url(#ab-mask-${uid})`}>
        {OVERLAYS.map((color, i) => (
          <g
            key={i}
            className="ab-wash"
            style={{
              transform: `rotate(${firstOverlayPosition + i * 10}deg)`,
              transformOrigin: "center center",
              transition: !disableInOutOverlayAnimation ? "transform 200ms ease-out" : "none",
              animation: disableOverlayAnimation ? "none" : `ab-overlay-${i + 1} 5s infinite`,
              willChange: "transform",
            }}
          >
            <polygon points="0,0 260,54 260,0 0,54" fill={color} filter={`url(#ab-blur-${uid})`} opacity="0.5" />
          </g>
        ))}
      </g>
    </svg>
  )

  const common = {
    className: "ab-root" + (className ? " " + className : ""),
    style: { width: width ?? "min(260px, 100%)" },
    onMouseMove,
    onMouseLeave,
    onMouseEnter,
    onFocus,
    onBlur,
  }

  const inner = (
    <>
      <style href="award-badge" precedence="medium">
        {AB_CSS}
      </style>
      <div className="ab-tilt" style={{ transform: `perspective(700px) matrix3d(${shownMatrix})` }}>
        {svg}
      </div>
    </>
  )

  return link ? (
    <a ref={ref as React.RefObject<HTMLAnchorElement>} href={link} target="_blank" rel="noopener noreferrer" aria-label={name} {...common}>
      {inner}
    </a>
  ) : (
    <div ref={ref as React.RefObject<HTMLDivElement>} role="img" aria-label={name} tabIndex={0} {...common}>
      {inner}
    </div>
  )
}

export default AwardBadge
