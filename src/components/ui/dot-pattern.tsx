import { useId, type SVGProps } from "react"
import "./dot-pattern.css"

/**
 * Dot Pattern — a repeating grid of dots drawn with a native SVG <pattern>.
 *
 * Ported from the Tailwind/shadcn original to plain CSS (`dot-pattern.css`).
 * It fills its nearest positioned ancestor and ignores the pointer, so it can
 * sit behind any content. Dot colour comes from `fill` (CSS `--dot-pattern-fill`).
 *
 * Works in Server Components: `useId` is the only hook it uses.
 */
export interface DotPatternProps extends Omit<SVGProps<SVGSVGElement>, "width" | "height" | "x" | "y"> {
  /** Horizontal spacing between dots, in px. */
  width?: number
  /** Vertical spacing between dots, in px. */
  height?: number
  /** Pattern offset, in px. */
  x?: number
  y?: number
  /** Dot centre inside each cell, in px. */
  cx?: number
  cy?: number
  /** Dot radius, in px. */
  cr?: number
  className?: string
}

export function DotPattern({
  width = 24,
  height = 24,
  x = 0,
  y = 0,
  cx = 1,
  cy = 0.5,
  cr = 0.5,
  className,
  ...props
}: DotPatternProps) {
  // useId can contain characters that are awkward inside url(#…); keep it plain.
  const id = `dot-pattern-${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`

  return (
    <svg
      aria-hidden="true"
      focusable="false"
      className={className ? `dot-pattern ${className}` : "dot-pattern"}
      {...props}
    >
      <defs>
        <pattern
          id={id}
          width={width}
          height={height}
          patternUnits="userSpaceOnUse"
          patternContentUnits="userSpaceOnUse"
          x={x}
          y={y}
        >
          <circle cx={cx} cy={cy} r={cr} />
        </pattern>
      </defs>
      <rect width="100%" height="100%" strokeWidth={0} fill={`url(#${id})`} />
    </svg>
  )
}

export default DotPattern
