import { Fragment, type ReactNode } from "react";
import { slugify, type Table } from "../data";
import { NewTabNote, Ref } from "./RefLink";

/** Id estable para un encabezado, usado por el índice "En esta página". */
export const slugId = (title: string) => slugify(title).slice(0, 60);

export { Ref };

// Enlaces externos ("[texto](https://…)"), grupos de códigos entre corchetes
// ("[P1, P2]", "[R09]") o códigos de recurso sueltos en el texto ("R09").
const CODE = String.raw`(?:R\d{2}|[EP]\d)`;
const CODE_RE = new RegExp(
  String.raw`\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)|\[(${CODE}(?:,\s*${CODE})*)\]|\b(R\d{2})\b`,
  "g",
);

export function Refs({ codes }: { codes: string[] }) {
  return (
    <span className="tk-cite">
      {codes.map((c) => (
        <Ref key={c} code={c} />
      ))}
    </span>
  );
}

/** Enlace a un sitio externo: se abre en una pestaña nueva y lo anuncia. */
export function ExternalLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a className="tk-ext" href={href} target="_blank" rel="noopener noreferrer">
      {children}
      <NewTabNote />
    </a>
  );
}

/** Texto con referencias y enlaces externos. */
export function Rich({ text }: { text: string }) {
  const out: ReactNode[] = [];
  let last = 0;
  for (const m of text.matchAll(CODE_RE)) {
    const at = m.index ?? 0;
    if (at > last) out.push(text.slice(last, at));
    if (m[2]) out.push(<ExternalLink key={at} href={m[2]}>{m[1]}</ExternalLink>);
    else if (m[3]) out.push(<Refs key={at} codes={m[3].split(/,\s*/)} />);
    else out.push(<Ref key={at} code={m[4]} />);
    last = at + m[0].length;
  }
  if (last < text.length) out.push(text.slice(last));
  return <>{out.map((n, i) => (typeof n === "string" ? <Fragment key={`t${i}`}>{n}</Fragment> : n))}</>;
}

export function DataTable({ table, flashRow }: { table: Table; flashRow?: number }) {
  return (
    <div className="tk-table-wrap">
      <table className="tk-table">
        {table.caption ? <caption>{table.caption}</caption> : null}
        <thead>
          <tr>
            {table.head.map((h) => (
              <th key={h} scope="col">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {table.rows.map((row, i) => (
            <tr key={row[0]} className={i === flashRow ? "is-flash" : undefined}>
              {row.map((c, j) => (
                <td key={j} data-label={table.head[j]}>
                  <Rich text={c} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
