import type { HTMLAttributes, ReactNode } from "react";
import { DotPattern } from "@/components/ui/dot-pattern";

type Tone = "lime" | "sky" | "amber";

type CalloutProps = Omit<HTMLAttributes<HTMLElement>, "title"> & {
  /** Color del marco, las esquinas y la etiqueta. */
  tone?: Tone;
  /** Etiqueta superior en mayúsculas («En otro territorio», «Conexión con la Lista Verde»…). */
  label: string;
  as?: "section" | "aside" | "div";
  children: ReactNode;
};

/**
 * Bloque destacado: marco fino del color del bloque, esquinas cuadradas y una retícula
 * de puntos que se desvanece hacia el centro para no competir con el texto.
 */
export function Callout({ tone = "lime", label, as: Tag = "section", className, children, ...rest }: CalloutProps) {
  return (
    <Tag className={`tk-callout tk-callout--${tone}${className ? ` ${className}` : ""}`} data-reveal {...rest}>
      <DotPattern width={6} height={6} cx={1} cy={1} cr={0.7} className="tk-callout-dots" />
      <span className="tk-callout-corners" aria-hidden="true" />
      <div className="tk-callout-body">
        <span className="tk-callout-label">{label}</span>
        {children}
      </div>
    </Tag>
  );
}

/**
 * Título de un bloque: lo que va antes de la primera coma en negrita y el resto en
 * trazo fino («Estrategia Biocultural del Jaguar, | Amazonía ecuatoriana»).
 */
export function CalloutTitle({ id, text, toc }: { id: string; text: string; toc: string }) {
  const comma = text.indexOf(",");
  const strong = comma > 0 ? text.slice(0, comma + 1) : text;
  const light = comma > 0 ? text.slice(comma + 1).trim() : "";
  return (
    <h2 id={id} className="tk-elsewhere-title" data-toc={toc}>
      <span className="tk-elsewhere-strong">{strong}</span>
      {light ? <span className="tk-elsewhere-light"> {light}</span> : null}
    </h2>
  );
}
