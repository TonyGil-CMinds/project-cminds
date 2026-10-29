import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { localePath, type Locale } from "@/i18n/config";
import {
  ACTIONS,
  CASE,
  CONTEXT,
  EXERCISE,
  GLOSSARY,
  GLOSSARY_NOTE,
  GOVERNANCE,
  GROUPS,
  HERO,
  IMAGES,
  LIBRARY,
  NINETY_DAYS,
  PAGES,
  PURPOSE,
  READINESS,
  STATS,
  STEPS,
  TEMPLATES,
  TOOLKIT_PATH,
  TOOLKIT_VERSION,
  actionSlug,
  toolkitHref,
  type Action,
  type Template,
  type ToolkitPage,
} from "../data";
import RouteSelector from "./RouteSelector";
import ReadinessCheck from "./ReadinessCheck";
import EffortLab from "./EffortLab";
import ResourceLibrary from "./ResourceLibrary";
import { TemplateDownloads, TemplateFolder, TemplateShelf } from "./TemplateLibrary";
import { ActionDone, ActionFinish, CopyButton } from "./SmallIslands";
import { BadgePanel } from "./Badge";
import { BlockView, DataTable, Ref, Refs, Rich, slugId } from "./rich";
import { IconArrowRight, IconCalendar, IconCheckCircle, IconChevronLeft, IconExternal, IconPin } from "./icons";

const GROUP_LABEL = new Map(GROUPS.map((g) => [g.id, g.label]));

export const CITATION = `C Minds (2026). Toolkit para iniciativas de conservación con inteligencia artificial en México. Aprendizajes de Tech4Nature México 2022–2026. Versión de trabajo ${TOOLKIT_VERSION}. https://www.cminds.co/es${TOOLKIT_PATH}`;

// ---------------------------------------------------------------------------
// Piezas comunes

/** Encabezado de sección: entra en el índice "En esta página". */
export function H2({ children, id }: { children: string; id?: string }) {
  const anchor = id ?? slugId(children);
  return (
    <h2 id={anchor} className="tk-h2" data-toc={children}>
      <a className="tk-anchor" href={`#${anchor}`} aria-hidden="true" tabIndex={-1}>
        #
      </a>
      {children}
    </h2>
  );
}

function Crumbs({ page, locale }: { page: ToolkitPage; locale: Locale }) {
  return (
    <nav aria-label="Ruta de navegación" data-hero>
      <ol className="tk-crumbs">
        <li>
          <Link href={localePath(locale, "/aiforbiodiversity/techfornature")}>Tech4Nature México</Link>
        </li>
        <li>
          <Link href={toolkitHref(locale, "")}>Toolkit</Link>
        </li>
        <li>{GROUP_LABEL.get(page.group)}</li>
        <li aria-current="page">{page.label}</li>
      </ol>
    </nav>
  );
}

/** Marco de cada página interior: migas, título, contenido y paginación. */
export function PageFrame({
  page,
  locale,
  kicker,
  lead,
  aside,
  children,
}: {
  page: ToolkitPage;
  locale: Locale;
  kicker?: ReactNode;
  lead?: ReactNode;
  aside?: ReactNode;
  children: ReactNode;
}) {
  return (
    <article className="tk-article" aria-labelledby="tk-page-title">
      <header className="tk-pagehead">
        <Crumbs page={page} locale={locale} />
        <div className="tk-pagehead-meta" data-hero>
          {page.code ? <span className="tk-code">{page.code}</span> : null}
          <span className="tk-kicker">{kicker ?? GROUP_LABEL.get(page.group)}</span>
        </div>
        <div className={aside ? "tk-pagehead-grid" : undefined}>
          <div>
            <h1 id="tk-page-title" className="tk-h1">
              {page.title}
            </h1>
            {lead ? (
              <div className="tk-lead" data-hero>
                {lead}
              </div>
            ) : null}
          </div>
          {aside ? (
            <div className="tk-pagehead-aside" data-hero>
              {aside}
            </div>
          ) : null}
        </div>
      </header>
      {children}
      <Pager page={page} locale={locale} />
    </article>
  );
}

export function Pager({ page, locale }: { page: ToolkitPage; locale: Locale }) {
  const i = PAGES.findIndex((p) => p.slug === page.slug);
  const prev = i > 0 ? PAGES[i - 1] : null;
  const next = i < PAGES.length - 1 ? PAGES[i + 1] : null;
  const count = (
    <span className="tk-pager-count" aria-hidden="true">
      {i + 1} / {PAGES.length}
    </span>
  );
  // En la primera y la última página, el contador ocupa el extremo libre.
  return (
    <nav className="tk-pager" aria-label="Paginación del toolkit" data-edge={!prev ? "start" : !next ? "end" : undefined}>
      {prev ? (
        <Link className="tk-pager-link tk-pager-link--prev" href={toolkitHref(locale, prev.slug)} rel="prev">
          <small>
            <IconChevronLeft /> Anterior
          </small>
          <span>
            {prev.code ? `${prev.code} · ` : ""}
            {prev.label}
          </span>
        </Link>
      ) : (
        count
      )}
      {prev && next ? count : null}
      {next ? (
        <Link className="tk-pager-link tk-pager-link--next" href={toolkitHref(locale, next.slug)} rel="next">
          <small>
            Siguiente <IconArrowRight />
          </small>
          <span>
            {next.code ? `${next.code} · ` : ""}
            {next.label}
          </span>
        </Link>
      ) : (
        count
      )}
    </nav>
  );
}

function CheckBox({ title, text }: { title: string; text: string }) {
  return (
    <div className="tk-check">
      <span className="tk-check-icon">
        <IconCheckCircle />
      </span>
      <div>
        <h2 id={slugId(title)} className="tk-check-title" data-toc={title}>
          {title}
        </h2>
        <p>
          <Rich text={text} />
        </p>
      </div>
    </div>
  );
}

function CaseCard({ locale }: { locale: Locale }) {
  return (
    <Link className="tk-next" href={localePath(locale, "/aiforbiodiversity/techfornature")} data-reveal>
      <span className="tk-next-body">
        <span className="tk-eyebrow">Conoce el caso completo</span>
        <strong>Tech4Nature México</strong>
        <span>Monitoreo con IA, liderazgo comunitario y conservación del jaguar en la península de Yucatán.</span>
        <span className="tk-next-cta">
          Ver la iniciativa <IconArrowRight />
        </span>
      </span>
      <span className="tk-next-media">
        <Image src={IMAGES.hero.src} alt={IMAGES.hero.alt} fill sizes="(max-width: 760px) 100vw, 360px" />
      </span>
    </Link>
  );
}

// ---------------------------------------------------------------------------
// Portada

export function HomePage({ page, locale }: { page: ToolkitPage; locale: Locale }) {
  return (
    <article className="tk-article" aria-labelledby="tk-page-title">
      <header className="tk-hero">
        <nav aria-label="Ruta de navegación" data-hero>
          <ol className="tk-crumbs">
            <li>
              <Link href={localePath(locale, "/aiforbiodiversity")}>AI for Biodiversity</Link>
            </li>
            <li>
              <Link href={localePath(locale, "/aiforbiodiversity/techfornature")}>Tech4Nature México</Link>
            </li>
            <li aria-current="page">Toolkit</li>
          </ol>
        </nav>
        <div className="tk-hero-chips" data-hero>
          <span className="tk-chip tk-chip--lime">Versión de trabajo {TOOLKIT_VERSION}</span>
          <span className="tk-chip">
            <IconCalendar />
            Octubre de 2026
          </span>
          <span className="tk-chip">{HERO.eyebrow}</span>
        </div>
        <h1 id="tk-page-title" className="tk-h1 tk-h1--hero">
          Toolkit para iniciativas de conservación con <span className="tk-grad">inteligencia artificial</span> en México
        </h1>
        <p className="tk-hero-sub" data-hero>
          {HERO.subtitle}
        </p>
        <div className="tk-banner" data-hero>
          <Image className="tk-banner-img" src={IMAGES.hero.src} alt={IMAGES.hero.alt} fill priority sizes="(max-width: 1023px) 100vw, 780px" />
          <div className="tk-banner-body">
            <img className="tk-banner-logo" src={IMAGES.logo.src} alt={IMAGES.logo.alt} width={297} height={199} />
            <div className="tk-banner-meta">
              <span className="tk-chip">
                <IconPin />
                Costa norte de Yucatán
              </span>
              <span className="tk-chip">C Minds · SDS Yucatán · Grupo Chac Mool</span>
            </div>
          </div>
        </div>
      </header>

      <section aria-labelledby="ruta">
        <H2 id="ruta">Comienza por la ruta que corresponde a tu responsabilidad</H2>
        <RouteSelector />
        <div className="tk-start" data-reveal>
          <Link className="tk-cta" href={toolkitHref(locale, "contexto")}>
            Empezar el recorrido
            <IconArrowRight />
          </Link>
          <Link className="tk-ghost" href={toolkitHref(locale, actionSlug(ACTIONS[0]))}>
            Ir a las 12 acciones
          </Link>
          <span>{PAGES.length} páginas · lectura por capítulos</span>
        </div>
      </section>

      <section aria-labelledby="proposito">
        <H2 id="proposito">Propósito</H2>
        {PURPOSE.paragraphs.map((p, i) => (
          <p key={i} data-reveal>
            <Rich text={p} />
          </p>
        ))}
        <div className="tk-stats" data-reveal>
          {STATS.map((s) => (
            <div key={s.label} className="tk-stat">
              <span className="tk-stat-num" data-count={s.value}>
                {s.value}
              </span>
              <span className="tk-stat-label">{s.label}</span>
            </div>
          ))}
        </div>
        <div className="tk-callout" data-reveal>
          <span className="tk-callout-label">La unidad de trabajo</span>
          <p>{PURPOSE.unit}</p>
        </div>
        <h3 className="tk-h3">Qué se puede producir con esta guía</h3>
        <ul className="tk-outputs">
          {PURPOSE.outputs.map((o, i) => (
            <li key={o} className="tk-output" data-reveal>
              <span className="tk-output-n">{i + 1}</span>
              <span>{o}</span>
            </li>
          ))}
        </ul>
        <p data-reveal>
          <Rich text={PURPOSE.reference} />
        </p>
      </section>

      <section aria-labelledby="como-usar">
        <H2 id="como-usar">Cómo utilizar el toolkit</H2>
        <p data-reveal>
          Puedes entrar a una acción específica si ya dispones de los requisitos previos, manteniendo vinculados el diseño
          ecológico, los acuerdos de gobernanza y la continuidad operativa.
        </p>
        <ol className="tk-stepmap">
          {STEPS.map((s) => (
            <li key={s.id} data-reveal>
              <div className="tk-stepmap-card">
                <span className="tk-stepmap-n" aria-hidden="true">
                  {s.n}
                </span>
                <h3 className="tk-stepmap-title">{s.title}</h3>
                <div className="tk-stepmap-actions">
                  {ACTIONS.filter((a) => a.step === s.n).map((a) => (
                    <Link key={a.id} href={toolkitHref(locale, actionSlug(a))} data-ref={a.code}>
                      <span className="tk-side-code">{a.code}</span>
                      {a.short}
                    </Link>
                  ))}
                </div>
                <p className="tk-stepmap-product">
                  <strong>Producto:</strong> {s.product}
                </p>
              </div>
            </li>
          ))}
        </ol>
        <h3 className="tk-h3">Cómo leer los códigos</h3>
        <div className="tk-legend" data-reveal>
          <div>
            <span className="tk-ref tk-ref--a">A</span>
            Una acción, con su propia página.
          </div>
          <div>
            <span className="tk-ref tk-ref--t">T</span>
            Una plantilla descargable.
          </div>
          <div>
            <span className="tk-ref tk-ref--r">R</span>
            Un recurso de la biblioteca.
          </div>
          <div>
            <span className="tk-ref tk-ref--e">E</span>
            Evidencia documental del caso.
          </div>
        </div>
        <div className="tk-callout tk-callout--sky" data-reveal>
          <span className="tk-callout-label">Acompañamiento especializado</span>
          <p>
            Las plantillas son propuestas de trabajo de este toolkit y no instrumentos oficiales de certificación. Una
            interfaz accesible permite comenzar; las estimaciones de poblaciones, la validación de modelos y los
            procedimientos de política pública requieren acompañamiento especializado.
          </p>
        </div>
      </section>

      <Pager page={page} locale={locale} />
    </article>
  );
}

// ---------------------------------------------------------------------------
// Empezar

export function ContextoPage({ page, locale }: { page: ToolkitPage; locale: Locale }) {
  return (
    <PageFrame page={page} locale={locale} lead={<p>{CONTEXT.intro[0]}</p>}>
      <p data-reveal>{CONTEXT.intro[1]}</p>
      <H2>Datos que orientan el diseño</H2>
      <div className="tk-facts">
        {CONTEXT.cards.map((c) => (
          <div key={c.figure} className="tk-fact" data-reveal>
            <span className="tk-fact-figure">{c.figure}</span>
            <p className="tk-fact-label">{c.label}</p>
            <p className="tk-fact-text">
              <Rich text={c.fact} />
            </p>
            <div className="tk-fact-imp">
              <strong>Implicación</strong>
              <p>{c.implication}</p>
              <p className="tk-fact-note">{c.note}</p>
            </div>
          </div>
        ))}
      </div>
      <H2>Integrar la biodiversidad en la toma de decisiones</H2>
      {CONTEXT.mainstreaming.map((p, i) => (
        <p key={i} data-reveal>
          <Rich text={p} />
        </p>
      ))}
    </PageFrame>
  );
}

export function CasoPage({ page, locale }: { page: ToolkitPage; locale: Locale }) {
  return (
    <PageFrame page={page} locale={locale} kicker="Caso de aplicación" lead={<p>{CASE.intro[0]}</p>}>
      <p data-reveal>
        <Rich text={CASE.intro[1]} />
      </p>
      <H2>Lo que documentó la iniciativa</H2>
      <ul className="tk-kpis">
        {CASE.kpis.map((k) => (
          <li key={k.label} className="tk-kpi" data-reveal>
            {"text" in k && k.text ? (
              <span className="tk-kpi-num">{k.text}</span>
            ) : (
              <span className="tk-kpi-num" data-count={k.value} data-prefix={k.prefix} data-suffix={k.suffix}>
                {k.prefix}
                {k.value.toLocaleString("es-MX")}
                {k.suffix}
              </span>
            )}
            <span className="tk-kpi-label">{k.label}</span>
            <details>
              <summary>Aprendizaje transferible</summary>
              <p>
                <Rich text={k.evidence} />
              </p>
              <p>{k.learning}</p>
            </details>
          </li>
        ))}
      </ul>
      <H2 id="fuentes-caso">Fuentes del caso</H2>
      <div className="tk-sources">
        {CASE.sources.map((s) => (
          <div key={s.code} className="tk-source" data-reveal>
            <span className="tk-ref tk-ref--e">{s.code}</span>
            <strong>{s.title}</strong>
            {s.detail}
          </div>
        ))}
      </div>
      <CaseCard locale={locale} />
    </PageFrame>
  );
}

export function GestionPage({ page, locale }: { page: ToolkitPage; locale: Locale }) {
  return (
    <PageFrame page={page} locale={locale} lead={<p><Rich text={GOVERNANCE.intro} /></p>}>
      <div className="tk-bigfig" data-reveal>
        <span className="tk-bigfig-num">
          <span data-count={104304}>104,304</span> <small>ha</small>
        </span>
        <p>
          Superficie de la Reserva Estatal de Dzilam tras el <strong>Acuerdo 76 de 2024</strong>. La decisión corresponde al
          Gobierno de Yucatán; la superficie designada no equivale a la superficie muestreada. <Ref code="R65" />
        </p>
      </div>
      <H2>Un resultado de política pública con fundamento verificable</H2>
      {GOVERNANCE.policy.map((p, i) => (
        <p key={i} data-reveal>
          <Rich text={p} />
        </p>
      ))}
      <ol className="tk-chain" aria-label="Cadena documental">
        {GOVERNANCE.chain.map((step, i) => (
          <li key={step}>
            <span className="tk-chain-dot" aria-hidden="true">
              {i + 1}
            </span>
            {step}
          </li>
        ))}
      </ol>
      <H2>Coordinación y conocimiento social</H2>
      {GOVERNANCE.coordination.map((p, i) => (
        <p key={i} data-reveal>
          <Rich text={p} />
        </p>
      ))}
      <H2>Aplicación en otro territorio</H2>
      <ul className="tk-list" data-reveal>
        {GOVERNANCE.apply.map((li) => (
          <li key={li}>{li}</li>
        ))}
      </ul>
    </PageFrame>
  );
}

export function DiagnosticoPage({ page, locale }: { page: ToolkitPage; locale: Locale }) {
  return (
    <PageFrame page={page} locale={locale} kicker="Diagnóstico de preparación" lead={<p>{READINESS.intro}</p>}>
      <H2>Las ocho condiciones</H2>
      <ReadinessCheck />
      <H2>Elegir una escala viable</H2>
      {READINESS.scale.map((p, i) => (
        <p key={i} data-reveal>
          {p}
        </p>
      ))}
      <div className="tk-callout" data-reveal>
        <span className="tk-callout-label">Producto</span>
        <p>
          <Rich text={READINESS.product} />
        </p>
      </div>
    </PageFrame>
  );
}

// ---------------------------------------------------------------------------
// Acciones

function BioScannerInline() {
  return (
    <aside className="tk-inline-promo" aria-label="BioScanner">
      <Image src={IMAGES.bioscanner.src} alt={IMAGES.bioscanner.alt} width={482} height={298} sizes="180px" />
      <div>
        <span className="tk-eyebrow">Plataforma de Tech4Nature</span>
        <p className="tk-promo-title">Prueba el recorrido con un lote pequeño</p>
        <p>Revisión humana, colaboración con permisos e identidades de jaguar en una interfaz en español.</p>
        <div className="tk-inline-promo-actions">
          <a className="tk-cta" href="https://app.bioscanner.io" target="_blank" rel="noopener noreferrer">
            Entrar a BioScanner
            <IconExternal />
          </a>
        </div>
      </div>
    </aside>
  );
}

export function ActionPage({ page, locale, action }: { page: ToolkitPage; locale: Locale; action: Action }) {
  const step = STEPS[action.step - 1];
  const index = ACTIONS.indexOf(action);
  const nextPage = PAGES[PAGES.findIndex((p) => p.slug === page.slug) + 1];
  return (
    <PageFrame
      page={page}
      locale={locale}
      kicker={`Paso ${step.n} · ${step.title}`}
      aside={<ActionDone id={action.id} code={action.code} />}
    >
      <div className="tk-stepstrip" data-hero>
        <span className="tk-stepstrip-media">
          <img src={step.image.src} alt="" loading="lazy" decoding="async" width={120} height={90} />
        </span>
        <span>
          <small>
            Acción {index + 1} de {ACTIONS.length} · Paso {step.n} de {STEPS.length}
          </small>
          <strong>Producto del paso:</strong> {step.product}
        </span>
      </div>

      <div className="tk-result" data-hero>
        <span className="tk-callout-label">Resultado esperado</span>
        <p>
          <Rich text={action.result} />
        </p>
      </div>

      <H2>{action.procedureTitle}</H2>
      <ol className="tk-steps">
        {action.procedure.map((p, i) => (
          <li key={i}>
            <span className="tk-steps-n" aria-hidden="true">
              {i + 1}
            </span>
            <p>
              <Rich text={p} />
            </p>
          </li>
        ))}
      </ol>

      {action.id === "a05" ? <BioScannerInline /> : null}
      {action.id === "a06" ? (
        <figure className="tk-figure">
          <Image src={IMAGES.jaguar.src} alt={IMAGES.jaguar.alt} width={487} height={322} sizes="(max-width: 760px) 100vw, 720px" />
          <figcaption>
            Las rosetas permiten comparar individuos; la calidad de imagen y el flanco visible condicionan cada coincidencia.
          </figcaption>
        </figure>
      ) : null}

      {action.blocks.map((b) => (
        <BlockView key={b.title} block={b} level={2} />
      ))}

      <CheckBox title="Comprobación" text={action.check} />

      <H2>Plantillas y recursos</H2>
      <div className="tk-action-foot">
        <div>
          <span>Plantillas</span>
          <Refs codes={action.templates} />
        </div>
        <div>
          <span>Recursos</span>
          <Refs codes={action.resources} />
        </div>
      </div>

      <ActionFinish id={action.id} code={action.code} nextSlug={nextPage?.slug} nextLabel={nextPage?.label} />
    </PageFrame>
  );
}

// ---------------------------------------------------------------------------
// Práctica

export function NoventaPage({ page, locale }: { page: ToolkitPage; locale: Locale }) {
  return (
    <PageFrame page={page} locale={locale} lead={<p>{NINETY_DAYS.intro}</p>}>
      <H2>Secuencia orientativa</H2>
      <ol className="tk-ninety">
        {NINETY_DAYS.periods.map((p) => (
          <li key={p.range}>
            <span className="tk-ninety-range">{p.range}</span>
            <div className="tk-ninety-card">
              <p>{p.work}</p>
              <small>
                <strong>Producto comprobable:</strong> <Rich text={p.product} />
              </small>
            </div>
          </li>
        ))}
      </ol>
      <H2>Tres combinaciones de herramientas</H2>
      <div className="tk-combos">
        {NINETY_DAYS.combos.map((c) => (
          <div key={c.title} className="tk-combo" data-reveal>
            <h3>{c.title}</h3>
            <p>{c.text}</p>
            <Refs codes={c.tools} />
          </div>
        ))}
      </div>
      <p data-reveal>
        <Rich text={NINETY_DAYS.closing} />
      </p>
    </PageFrame>
  );
}

export function EjercicioPage({ page, locale }: { page: ToolkitPage; locale: Locale }) {
  return (
    <PageFrame page={page} locale={locale} kicker="Ejercicio" lead={<p>{EXERCISE.situation}</p>}>
      <div className="tk-callout tk-callout--amber" data-reveal>
        <span className="tk-callout-label">Cifras ficticias</span>
        <p>{EXERCISE.intro}</p>
      </div>
      <H2>Datos de las dos campañas</H2>
      <DataTable table={EXERCISE.table} />
      <H2>Laboratorio de cálculo</H2>
      <EffortLab />
      <H2>Cómo trabajar el caso</H2>
      <ul className="tk-list">
        {EXERCISE.howTo.map((li) => (
          <li key={li}>
            <Rich text={li} />
          </li>
        ))}
      </ul>
      <div className="tk-callout" data-reveal>
        <span className="tk-callout-label">Resultado esperado del ejercicio</span>
        <p>{EXERCISE.outcome}</p>
      </div>
    </PageFrame>
  );
}

// ---------------------------------------------------------------------------
// Plantillas

export function PlantillasPage({ page, locale }: { page: ToolkitPage; locale: Locale }) {
  return (
    <PageFrame
      page={page}
      locale={locale}
      lead={
        <p>
          Cada plantilla se descarga como hoja de trabajo (.csv, con columnas para respuesta, responsable y fecha) o como texto
          (.md) para duplicar en tu editor. Abre una carpeta para ver sus campos; el menú ··· la abre o la descarga.
        </p>
      }
    >
      <TemplateShelf />
      <p className="tk-meta-line">Son propuestas de trabajo de este toolkit y no instrumentos oficiales de certificación.</p>
    </PageFrame>
  );
}

export function TemplatePage({ page, locale, template }: { page: ToolkitPage; locale: Locale; template: Template }) {
  const index = TEMPLATES.indexOf(template);
  return (
    <PageFrame
      page={page}
      locale={locale}
      kicker="Plantilla"
      lead={<p>{template.intro}</p>}
      aside={<TemplateFolder template={template} index={index} width={230} />}
    >
      <div className="tk-template-bar" data-hero>
        <TemplateDownloads id={template.id} />
        <div className="tk-viewer-links">
          <span>Acción asociada:</span>
          <Refs codes={template.actions} />
          {template.resources.length ? (
            <>
              <span>Recursos:</span>
              <Refs codes={template.resources} />
            </>
          ) : null}
        </div>
      </div>
      <H2>Campos</H2>
      <DataTable table={template.table} />
      {template.sections.map((s) => (
        <BlockView key={s.title} block={s} level={2} />
      ))}
      <CheckBox title="Control de salida" text={template.control} />
    </PageFrame>
  );
}

// ---------------------------------------------------------------------------
// Recursos y cierre

export function BibliotecaPage({ page, locale }: { page: ToolkitPage; locale: Locale }) {
  return (
    <PageFrame page={page} locale={locale} kicker="Biblioteca" lead={<p>{LIBRARY.intro}</p>}>
      <ResourceLibrary />
      <H2>Cómo elegir</H2>
      <p data-reveal>{LIBRARY.howTo}</p>
      <p data-reveal>
        ES identifica recursos disponibles en español; EN en inglés y PT en portugués. «Multilingüe» puede referirse a la
        interfaz o a parte de la documentación, según el recurso.
      </p>
      <H2>Alcance de la selección</H2>
      <div className="tk-callout tk-callout--amber" data-reveal>
        <p>{LIBRARY.scope}</p>
        <p>
          <Ref code="R03" /> identifica el repositorio actual de BioScanner como recurso por habilitar. Los recursos externos
          no deben confundirse con componentes de la plataforma.
        </p>
      </div>
    </PageFrame>
  );
}

export function GlosarioPage({ page, locale }: { page: ToolkitPage; locale: Locale }) {
  return (
    <PageFrame page={page} locale={locale} kicker="Glosario" lead={<p>{GLOSSARY_NOTE}</p>}>
      <dl className="tk-glossary">
        {GLOSSARY.map((g, i) => (
          <div key={g.term} id={`g-${i + 1}`} className="tk-term" data-reveal>
            <dt>{g.term}</dt>
            <dd>{g.def}</dd>
          </div>
        ))}
      </dl>
    </PageFrame>
  );
}

export function InsigniaPage({ page, locale }: { page: ToolkitPage; locale: Locale }) {
  return (
    <PageFrame
      page={page}
      locale={locale}
      kicker="Cierre"
      lead={<p>Revisa las {ACTIONS.length} acciones para desbloquear la insignia de Tech4Nature México. Puedes descargarla y publicarla en tus redes.</p>}
    >
      <BadgePanel />
      <H2>Cómo citar</H2>
      <div className="tk-cite-box" data-reveal>
        <p>{CITATION}</p>
        <CopyButton text={CITATION} label="Copiar cita" />
      </div>
      <CaseCard locale={locale} />
      <p className="tk-meta-line">
        Versión de trabajo {TOOLKIT_VERSION} · Octubre de 2026 · Revisión editorial de enlaces: 27 de octubre de 2026.
      </p>
    </PageFrame>
  );
}
