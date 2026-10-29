import { Fragment, type ReactNode } from "react";
import { slugify, type Block, type Table } from "../data";
import { Ref } from "./RefLink";

/** Id estable para un encabezado, usado por el índice "En esta página". */
export const slugId = (title: string) => slugify(title).slice(0, 60);

export { Ref };

// Grupos entre corchetes ("[R09, R52]") o códigos sueltos en el texto ("Complete T01").
const CODE_RE = /\[((?:[ARTE]\d{2})(?:,\s*[ARTE]\d{2})*)\]|\b([ART]\d{2})\b/g;

export function Refs({ codes }: { codes: string[] }) {
  return (
    <span className="tk-cite">
      {codes.map((c) => (
        <Ref key={c} code={c} />
      ))}
    </span>
  );
}

/** Texto con referencias enlazadas. */
export function Rich({ text }: { text: string }) {
  const out: ReactNode[] = [];
  let last = 0;
  for (const m of text.matchAll(CODE_RE)) {
    const at = m.index ?? 0;
    if (at > last) out.push(text.slice(last, at));
    if (m[1]) out.push(<Refs key={at} codes={m[1].split(/,\s*/)} />);
    else out.push(<Ref key={at} code={m[2]} />);
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

export function BlockView({ block, level = 3 }: { block: Block; level?: 2 | 3 }) {
  const Heading = level === 2 ? "h2" : "h3";
  return (
    <section className="tk-block">
      <Heading id={level === 2 ? slugId(block.title) : undefined} className={level === 2 ? "tk-h2" : "tk-h3"}>
        {block.title}
      </Heading>
      {block.example ? (
        <div className="tk-example">
          {/^Ejemplo/i.test(block.title) ? null : <span className="tk-example-label">Ejemplo</span>}
          <p>
            <Rich text={block.example} />
          </p>
        </div>
      ) : null}
      {block.table ? <DataTable table={block.table} /> : null}
      {block.paragraphs?.map((p, i) => (
        <p key={i}>
          <Rich text={p} />
        </p>
      ))}
      {block.list ? (
        <ul className="tk-list">
          {block.list.map((li) => (
            <li key={li}>
              <Rich text={li} />
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  );
}
