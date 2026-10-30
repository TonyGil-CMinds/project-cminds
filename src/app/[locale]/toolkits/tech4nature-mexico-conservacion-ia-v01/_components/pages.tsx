import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { localePath, type Locale } from "@/i18n/config";
import {
  BIOCULTURAL,
  CASE,
  GLOSSARY,
  GLOSSARY_INTRO,
  GL_MANUAL_URL,
  GL_WORKSHEET_URL,
  GREEN_LIST,
  STAGE_GREEN_LIST,
  SOVEREIGNTY,
  GROUPS,
  HERO,
  IMAGES,
  INTRO,
  LIVING_NOTE,
  PAGES,
  QUESTIONS,
  RESOURCES,
  SOURCES,
  STAGES,
  TEMPLATES,
  TEMPLATES_INTRO,
  TOOLBOX,
  TOOLKIT_DATE_LABEL,
  TOOLKIT_PATH,
  TOOLKIT_VERSION,
  WHY,
  stageSlug,
  templateSlug,
  toolkitHref,
  type Stage,
  type Template,
  type ToolkitPage,
} from "../data";
import RouteSelector from "./RouteSelector";
import ReadinessCheck from "./ReadinessCheck";
import ResourceLibrary from "./ResourceLibrary";
import { TemplateDownloads, TemplateFolder, TemplateShelf } from "./TemplateLibrary";
import { ActionDone, ActionFinish, CopyButton } from "./SmallIslands";
import { BadgePanel } from "./Badge";
import Achievements from "./Achievements";
import Avatar from "./Avatar";
import T4nMap from "./T4nMap";
import PhotoGrid from "./PhotoGrid";
import {
  CAMERA_TRAP,
  GALLERY,
  PAGE_PHOTOS,
  MAP_TEXT,
  SPOTLIGHT,
  SPOTLIGHT_INTRO,
  SPOTLIGHT_NOTE,
  STAGE_PHOTOS,
  T4N_HOME,
  TEAM_ALLIES,
  TEAM_CORE,
  TEAM_INTRO,
  TEAM_MORE,
  type TeamGroup,
} from "../t4n";
import { ExternalLink, Rich, slugId } from "./rich";
import { IconArrowRight, IconCalendar, IconCheckCircle, IconChevronLeft, IconExternal, IconPin } from "./icons";

const GROUP_LABEL = new Map(GROUPS.map((g) => [g.id, g.label]));

export const CITATION = `C Minds (2026). ${HERO.title}. ${HERO.subtitle}. Versión ${TOOLKIT_VERSION}. https://www.cminds.co/es${TOOLKIT_PATH}`;

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
          <span>{prev.label}</span>
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
          <span>{next.label}</span>
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

/** Tabla de las cinco etapas: pregunta que responde y lo que tendrás al terminar. */
function StageMap({ locale }: { locale: Locale }) {
  return (
    <ol className="tk-stepmap tk-stepmap--stages">
      {STAGES.map((s) => (
        <li key={s.id} data-reveal>
          <Link className="tk-stepmap-card" href={toolkitHref(locale, stageSlug(s))} data-ref={s.code}>
            <span className="tk-stepmap-n" aria-hidden="true">
              {s.n}
            </span>
            <h3 className="tk-stepmap-title">{s.title}</h3>
            <p className="tk-stepmap-question">{s.question}</p>
            <p className="tk-stepmap-product">
              <strong>Al terminar tendrás:</strong> {s.result}
            </p>
          </Link>
        </li>
      ))}
    </ol>
  );
}

// ---------------------------------------------------------------------------
// Portada: Tech4Nature México

function TeamStrip({ locale }: { locale: Locale }) {
  const people = TEAM_CORE.flatMap((g) => g.people);
  return (
    <Link className="tk-teamstrip" href={toolkitHref(locale, "equipo")} data-reveal>
      <span className="tk-teamstrip-faces" aria-hidden="true">
        {people.map((p) => (
          <Avatar key={p.name} name={p.name} photo={p.photo} size={52} />
        ))}
      </span>
      <span className="tk-teamstrip-text">
        <strong>Más de 80 personas</strong> de la comunidad de Dzilam, el Gobierno de Yucatán, la UICN, C Minds, universidades y aliados tecnológicos construyeron Tech4Nature México.
        <span className="tk-next-cta">
          Conoce al equipo <IconArrowRight />
        </span>
      </span>
    </Link>
  );
}

function Spotlight() {
  return (
    <>
      <ul className="tk-spot">
        {SPOTLIGHT.map((s) => (
          <li key={s.name} className="tk-spot-card" data-reveal>
            <img className="tk-spot-photo" src={s.photo} alt={`Retrato de ${s.name}`} loading="lazy" decoding="async" width={480} height={480} />
            <div className="tk-spot-body">
              <strong>{s.name}</strong>
              <span className="tk-spot-role">{s.role}</span>
              {s.quote ? <blockquote>“{s.quote}”</blockquote> : null}
            </div>
          </li>
        ))}
      </ul>
      <p className="tk-meta-line">{SPOTLIGHT_NOTE}</p>
    </>
  );
}

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
          <span className="tk-chip tk-chip--lime">Versión {TOOLKIT_VERSION}</span>
          <span className="tk-chip">
            <IconCalendar />
            {TOOLKIT_DATE_LABEL}
          </span>
          <span className="tk-chip">2022–2026</span>
        </div>
        <p className="tk-hero-eyebrow tk-hero-eyebrow--top" data-hero>
          {T4N_HOME.eyebrow}
        </p>
        <h1 id="tk-page-title" className="tk-h1 tk-h1--hero">
          <span className="tk-grad">Tech4Nature</span> México
        </h1>
        <p className="tk-hero-sub" data-hero>
          {T4N_HOME.subtitle}
        </p>
        <div className="tk-banner" data-hero>
          <Image className="tk-banner-img" src={IMAGES.hero.src} alt={IMAGES.hero.alt} fill priority sizes="(max-width: 1023px) 100vw, 780px" />
          <div className="tk-banner-body">
            <img className="tk-banner-logo" src={IMAGES.logo.src} alt={IMAGES.logo.alt} width={297} height={199} />
            <div className="tk-banner-meta">
              <span className="tk-chip">
                <IconPin />
                Reserva Estatal de Dzilam, Yucatán
              </span>
              <span className="tk-chip">C Minds · SDS Yucatán · Grupo Chac Mool · UICN</span>
            </div>
          </div>
        </div>
      </header>

      <section aria-labelledby="que-es">
        <H2 id="que-es">Qué es Tech4Nature México</H2>
        {CASE.intro.map((p, i) => (
          <p key={i} data-reveal>
            {p}
          </p>
        ))}
      </section>

      <section aria-labelledby="quienes">
        <H2 id="quienes">Quienes lo hacen posible</H2>
        <p data-reveal>{SPOTLIGHT_INTRO}</p>
        <Spotlight />
      </section>

      <section aria-labelledby="logros">
        <H2 id="logros">Lo que hemos logrado</H2>
        <p data-reveal>Toca cada tarjeta para ver el detalle: el acuerdo de ampliación, el listado de especies, BioScanner y las fotos de los jaguares.</p>
        <Achievements locale={locale} />
      </section>

      <section aria-labelledby="donde-trabajamos">
        <H2 id="donde-trabajamos">Dónde trabajamos</H2>
        <p data-reveal>{MAP_TEXT.lead}</p>
        <T4nMap />
        <ul className="tk-mapfacts">
          {MAP_TEXT.facts.map((f) => (
            <li key={f.label} data-reveal>
              <strong>{f.value}</strong>
              <span>{f.label}</span>
            </li>
          ))}
        </ul>
        <p className="tk-meta-line">{MAP_TEXT.note}</p>
      </section>

      <section aria-labelledby="en-imagenes">
        <H2 id="en-imagenes">El proyecto en imágenes</H2>
        {GALLERY.map((g) => (
          <section key={g.id} aria-labelledby={`galeria-${g.id}`} className="tk-gallery-block">
            <h3 id={`galeria-${g.id}`} className="tk-h3">
              {g.title}
            </h3>
            <p data-reveal>{g.text}</p>
            <PhotoGrid photos={g.photos} label={g.title} />
          </section>
        ))}
      </section>

      <section aria-labelledby="linea-de-tiempo">
        <H2 id="linea-de-tiempo">Cómo llegamos aquí</H2>
        <ol className="tk-ninety">
          {CASE.timeline.map((t) => (
            <li key={t.range}>
              <span className="tk-ninety-range">{t.range}</span>
              <div className="tk-ninety-card">
                <p>{t.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <figure className="tk-quote" data-reveal>
        <blockquote>
          <p>“{CASE.story.quote}”</p>
        </blockquote>
        <figcaption>{CASE.story.author}</figcaption>
        {CASE.story.paragraphs.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
        <p className="tk-quote-closing">{CASE.story.closing}</p>
      </figure>

      <section aria-labelledby="personas">
        <H2 id="personas">Las personas detrás</H2>
        <TeamStrip locale={locale} />
      </section>

      <section aria-labelledby="crea-el-tuyo-cta" className="tk-invite" data-reveal>
        <h2 id="crea-el-tuyo-cta" className="tk-invite-title" data-toc="Crea el tuyo">
          Crea tu propio <span className="tk-grad">Tech4Nature</span>
        </h2>
        <p>{T4N_HOME.invite}</p>
        <div className="tk-start">
          <Link className="tk-cta" href={toolkitHref(locale, "crea-el-tuyo")}>
            Empezar el toolkit
            <IconArrowRight />
          </Link>
          <Link className="tk-ghost" href={toolkitHref(locale, stageSlug(STAGES[0]))}>
            Ir a las cinco etapas
          </Link>
        </div>
      </section>

      <Pager page={page} locale={locale} />
    </article>
  );
}

// ---------------------------------------------------------------------------
// Equipo

function PeopleGrid({ group, big }: { group: TeamGroup; big?: boolean }) {
  return (
    <>
      <ul className={`tk-people${big ? " tk-people--big" : ""}`}>
        {group.people.map((p) => (
          <li key={p.name} className="tk-person" data-reveal>
            <Avatar name={p.name} photo={p.photo} size={big ? 96 : 64} />
            <span className="tk-person-name">{p.name}</span>
            <span className="tk-person-role">{p.role}</span>
            {p.org ? <span className="tk-person-org">{p.org}</span> : null}
          </li>
        ))}
      </ul>
      {group.names?.map((n) => (
        <p key={n.label} className="tk-people-names">
          <strong>{n.label}:</strong> {n.list.join(", ")}.
        </p>
      ))}
    </>
  );
}

export function EquipoPage({ page, locale }: { page: ToolkitPage; locale: Locale }) {
  return (
    <PageFrame page={page} locale={locale} kicker="Equipo" lead={<p>{TEAM_INTRO}</p>}>
      <H2>Sus voces</H2>
      <Spotlight />
      <H2>Primera fila</H2>
      {TEAM_CORE.map((g) => (
        <section key={g.id} aria-label={g.title}>
          <h3 className="tk-h3">{g.title}</h3>
          <PeopleGrid group={g} big />
        </section>
      ))}

      <H2>Gobierno, comunidad y C Minds</H2>
      {TEAM_MORE.map((g) => (
        <section key={g.id} aria-label={g.title}>
          <h3 className="tk-h3">{g.title}</h3>
          {g.intro ? <p>{g.intro}</p> : null}
          <PeopleGrid group={g} />
        </section>
      ))}

      <H2>Aliados a lo largo del tiempo</H2>
      {TEAM_ALLIES.map((g) => (
        <section key={g.id} aria-label={g.title}>
          <h3 className="tk-h3">{g.title}</h3>
          {g.intro ? <p>{g.intro}</p> : null}
          <PeopleGrid group={g} />
        </section>
      ))}
      <p className="tk-meta-line">
        ¿Formaste parte de Tech4Nature México y no apareces aquí, o quieres corregir tu nombre o tu rol? Escríbenos a través de la{" "}
        <Link href={localePath(locale, "/aiforbiodiversity/techfornature")}>página de Tech4Nature México</Link>.
      </p>
    </PageFrame>
  );
}

// ---------------------------------------------------------------------------
// Crea el tuyo

export function CreaPage({ page, locale }: { page: ToolkitPage; locale: Locale }) {
  return (
    <PageFrame page={page} locale={locale} kicker="Crea el tuyo" lead={<p>{HERO.subtitle}.</p>}>
      <section aria-labelledby="para-ti">
        <H2 id="para-ti">¿Este toolkit es para ti?</H2>
        {INTRO.paragraphs.map((p, i) => (
          <p key={i} data-reveal>
            {p}
          </p>
        ))}
        <h3 className="tk-h3">Con este toolkit podrás</h3>
        <ul className="tk-outputs">
          {INTRO.outcomes.map((o, i) => (
            <li key={o} className="tk-output" data-reveal>
              <span className="tk-output-n">{i + 1}</span>
              <span>{o}</span>
            </li>
          ))}
        </ul>
        <div className="tk-stats" data-reveal>
          {[
            { value: STAGES.length, label: "etapas" },
            { value: QUESTIONS.items.length, label: "preguntas rápidas" },
            { value: TEMPLATES.length, label: "plantillas" },
            { value: RESOURCES.length, label: "herramientas y recursos" },
          ].map((s) => (
            <div key={s.label} className="tk-stat">
              <span className="tk-stat-num" data-count={s.value}>
                {s.value}
              </span>
              <span className="tk-stat-label">{s.label}</span>
            </div>
          ))}
        </div>
      </section>

      <section aria-labelledby="como-recorrerlo">
        <H2 id="como-recorrerlo">Cómo recorrerlo</H2>
        <p data-reveal>{INTRO.howTo}</p>
        <RouteSelector />
        <div className="tk-start" data-reveal>
          <Link className="tk-cta" href={toolkitHref(locale, "por-que-importa")}>
            Empezar el recorrido
            <IconArrowRight />
          </Link>
          <Link className="tk-ghost" href={toolkitHref(locale, stageSlug(STAGES[0]))}>
            Ir a las cinco etapas
          </Link>
          <span>{PAGES.length} páginas · lectura por capítulos</span>
        </div>
      </section>

      <section aria-labelledby="cinco-etapas">
        <H2 id="cinco-etapas">Las cinco etapas</H2>
        <StageMap locale={locale} />
      </section>

    </PageFrame>
  );
}

// ---------------------------------------------------------------------------
// Empezar

export function PorQueImportaPage({ page, locale }: { page: ToolkitPage; locale: Locale }) {
  return (
    <PageFrame page={page} locale={locale} lead={<p>{WHY.intro}</p>}>
      <PhotoGrid photos={PAGE_PHOTOS["por-que-importa"]} label="Fotos de la reserva" variant="pair" />
      <H2>Datos y qué significan para tu proyecto</H2>
      <div className="tk-facts">
        {WHY.facts.map((c) => (
          <div key={c.figure} className="tk-fact" data-reveal>
            <span className="tk-fact-figure">{c.figure}</span>
            <p className="tk-fact-text">{c.fact}</p>
            <div className="tk-fact-imp">
              <strong>Qué significa para tu proyecto</strong>
              <p>{c.meaning}</p>
            </div>
          </div>
        ))}
      </div>
      <p className="tk-meta-line">
        Consulta las <Link href={toolkitHref(locale, "fuentes")}>fuentes de los datos</Link>.
      </p>
    </PageFrame>
  );
}

// ---------------------------------------------------------------------------
// Monitoreo biocultural

export function BioculturalPage({ page, locale }: { page: ToolkitPage; locale: Locale }) {
  const e = BIOCULTURAL.elsewhere;
  return (
    <PageFrame page={page} locale={locale} kicker="Enfoque biocultural" lead={<p>{BIOCULTURAL.lead}</p>}>
      <PhotoGrid photos={PAGE_PHOTOS.biocultural} label="Fotos del monitoreo biocultural" variant="pair" />
      <H2>Qué aporta el conocimiento del territorio</H2>
      <dl className="tk-glossary">
        {BIOCULTURAL.contributions.map((c) => (
          <div key={c.title} className="tk-term" data-reveal>
            <dt>{c.title}</dt>
            <dd>{c.text}</dd>
          </div>
        ))}
      </dl>

      <H2>Lo que hicimos en Dzilam</H2>
      <div className="tk-result" data-reveal>
        {BIOCULTURAL.dzilam.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>

      <H2>Cómo integrarlo al muestreo</H2>
      <ol className="tk-steps">
        {BIOCULTURAL.steps.map((p, i) => (
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

      <CheckBox title="Aprendizaje" text={BIOCULTURAL.learning} />

      <H2>Herramientas para empezar</H2>
      <ul className="tk-list tk-tools">
        {BIOCULTURAL.tools.map((t) => (
          <li key={t}>
            <Rich text={t} />
          </li>
        ))}
      </ul>

      <section className="tk-callout tk-callout--sky tk-elsewhere" aria-labelledby="otro-biocultural" data-reveal>
        <span className="tk-callout-label">En otro territorio</span>
        <h2 id="otro-biocultural" className="tk-elsewhere-title" data-toc={`En otro territorio: ${e.place}`}>
          {e.place}
        </h2>
        {e.paragraphs.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
        <p>
          <ExternalLink href={e.link.url}>{e.link.label}</ExternalLink>
        </p>
      </section>
    </PageFrame>
  );
}

// ---------------------------------------------------------------------------
// Soberanía de datos

export function SoberaniaPage({ page, locale }: { page: ToolkitPage; locale: Locale }) {
  const e = SOVEREIGNTY.elsewhere;
  return (
    <PageFrame page={page} locale={locale} kicker="Gobernanza de datos" lead={<p>{SOVEREIGNTY.lead}</p>}>
      <PhotoGrid photos={PAGE_PHOTOS.soberania} label="Fotos de talleres con la comunidad" variant="pair" />
      <H2>La Cadena de Suministro con Soberanía de Datos</H2>
      {SOVEREIGNTY.framework.map((p, i) => (
        <p key={i} data-reveal>
          {p}
        </p>
      ))}
      <dl className="tk-glossary">
        {SOVEREIGNTY.layers.map((l) => (
          <div key={l.title} className="tk-term" data-reveal>
            <dt>{l.title}</dt>
            <dd>{l.text}</dd>
          </div>
        ))}
      </dl>

      <H2>Los cinco protocolos</H2>
      <ol className="tk-steps">
        {SOVEREIGNTY.protocols.map((p, i) => (
          <li key={p.code}>
            <span className="tk-steps-n" aria-hidden="true">
              {i + 1}
            </span>
            <p>
              <strong>{p.title}.</strong> {p.text}
            </p>
          </li>
        ))}
      </ol>

      <H2>Lo que hicimos en Dzilam</H2>
      <div className="tk-result" data-reveal>
        {SOVEREIGNTY.dzilam.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>

      <H2>Preguntas para poner sobre la mesa</H2>
      <p data-reveal>{SOVEREIGNTY.questionsIntro}</p>
      <ul className="tk-list">
        {SOVEREIGNTY.questions.map((q) => (
          <li key={q}>{q}</li>
        ))}
      </ul>

      <CheckBox title="Aprendizaje" text={SOVEREIGNTY.learning} />

      <H2>Herramientas para empezar</H2>
      <ul className="tk-list tk-tools">
        {SOVEREIGNTY.tools.map((t) => (
          <li key={t}>
            <Rich text={t} />
          </li>
        ))}
      </ul>

      <section className="tk-callout tk-callout--sky tk-elsewhere" aria-labelledby="otro-soberania" data-reveal>
        <span className="tk-callout-label">En otro territorio</span>
        <h2 id="otro-soberania" className="tk-elsewhere-title" data-toc={`En otro territorio: ${e.place}`}>
          {e.place}
        </h2>
        {e.paragraphs.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
        <p>
          <ExternalLink href={e.link.url}>{e.link.label}</ExternalLink>
        </p>
      </section>
    </PageFrame>
  );
}

// ---------------------------------------------------------------------------
// Lista Verde de la UICN

export function ListaVerdePage({ page, locale }: { page: ToolkitPage; locale: Locale }) {
  const e = GREEN_LIST.elsewhere;
  return (
    <PageFrame page={page} locale={locale} kicker="Estándar de gestión" lead={<p>{GREEN_LIST.lead}</p>}>
      <PhotoGrid photos={PAGE_PHOTOS.listaverde} label="Fotos del trabajo en el área protegida" variant="pair" />
      <H2>El Estándar en breve</H2>
      <dl className="tk-glossary">
        {GREEN_LIST.components.map((c) => (
          <div key={c.title} className="tk-term" data-reveal>
            <dt>{c.title}</dt>
            <dd>{c.text}</dd>
          </div>
        ))}
      </dl>
      <p className="tk-meta-line">{GREEN_LIST.componentsNote}</p>

      <H2>El camino hacia la Lista Verde</H2>
      <ol className="tk-steps">
        {GREEN_LIST.phases.map((p, i) => (
          <li key={p.title}>
            <span className="tk-steps-n" aria-hidden="true">
              {i + 1}
            </span>
            <p>
              <strong>{p.title}.</strong> {p.text}
            </p>
          </li>
        ))}
      </ol>

      <H2>GL-SAT y COMPASS</H2>
      {GREEN_LIST.glsat.map((p, i) => (
        <p key={i} data-reveal>
          {p}
        </p>
      ))}

      <H2>Lo que hicimos en Dzilam y Ría Lagartos</H2>
      <div className="tk-result" data-reveal>
        {GREEN_LIST.dzilam.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>
      <div className="tk-inline-promo-actions">
        <a className="tk-cta" href={GL_MANUAL_URL} target="_blank" rel="noopener noreferrer">
          Descargar el manual (PDF)
          <IconExternal />
        </a>{" "}
        <a className="tk-cta" href={GL_WORKSHEET_URL} download>
          Descargar la hoja de trabajo (Excel)
        </a>
      </div>

      <H2>Cómo preparar tu área protegida</H2>
      <ol className="tk-steps">
        {GREEN_LIST.steps.map((p, i) => (
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

      <CheckBox title="Aprendizaje" text={GREEN_LIST.learning} />

      <H2>Cómo se conecta con las cinco etapas</H2>
      <ul className="tk-list">
        {STAGES.map((s) => {
          const g = STAGE_GREEN_LIST[s.id];
          return g ? (
            <li key={s.id}>
              <Link href={toolkitHref(locale, stageSlug(s))}>
                Etapa {s.n}. {s.title}
              </Link>
              : {g.criteria}.
            </li>
          ) : null;
        })}
      </ul>

      <H2>Herramientas para empezar</H2>
      <ul className="tk-list tk-tools">
        {GREEN_LIST.tools.map((t) => (
          <li key={t}>
            <Rich text={t} />
          </li>
        ))}
      </ul>

      <section className="tk-callout tk-callout--sky tk-elsewhere" aria-labelledby="otro-listaverde" data-reveal>
        <span className="tk-callout-label">En otro territorio</span>
        <h2 id="otro-listaverde" className="tk-elsewhere-title" data-toc={`En otro territorio: ${e.place}`}>
          {e.place}
        </h2>
        <p>{e.text}</p>
        <p>
          <ExternalLink href={e.link.url}>{e.link.label}</ExternalLink>
        </p>
      </section>
    </PageFrame>
  );
}

// ---------------------------------------------------------------------------
// Etapas

function BioScannerInline() {
  return (
    <aside className="tk-inline-promo" aria-label="BioScanner">
      <Image src={IMAGES.bioscanner.src} alt={IMAGES.bioscanner.alt} width={482} height={298} sizes="180px" />
      <div>
        <span className="tk-eyebrow">Plataforma de Tech4Nature México</span>
        <p className="tk-promo-title">Empieza con un lote pequeño</p>
        <p>Acceso con cuenta, actualmente en etapa de acceso anticipado. Interfaz en español, inglés, portugués y maya.</p>
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

function CameraTrap() {
  return (
    <section className="tk-ct" aria-labelledby="que-es-camara-trampa">
      <H2 id="que-es-camara-trampa">¿Qué es una cámara trampa?</H2>
      <p data-reveal>{CAMERA_TRAP.lead}</p>
      <PhotoGrid photos={CAMERA_TRAP.photos} label="Cámaras trampa en Dzilam" variant="trio" />
      <dl className="tk-glossary">
        {CAMERA_TRAP.how.map((h) => (
          <div key={h.title} className="tk-term" data-reveal>
            <dt>{h.title}</dt>
            <dd>{h.text}</dd>
          </div>
        ))}
      </dl>
      <div className="tk-ct-cols">
        <div className="tk-ct-col" data-reveal>
          <h3 className="tk-h3">Úsala cuando quieras…</h3>
          <ul className="tk-list">
            {CAMERA_TRAP.goodFor.map((g) => (
              <li key={g}>{g}</li>
            ))}
          </ul>
        </div>
        <div className="tk-ct-col tk-ct-col--alt" data-reveal>
          <h3 className="tk-h3">Combínala con otras herramientas para…</h3>
          <ul className="tk-list">
            {CAMERA_TRAP.lessGood.map((g) => (
              <li key={g}>{g}</li>
            ))}
          </ul>
        </div>
      </div>
      <p className="tk-meta-line">{CAMERA_TRAP.tip}</p>
    </section>
  );
}

export function StagePage({ page, locale, stage }: { page: ToolkitPage; locale: Locale; stage: Stage }) {
  const nextPage = PAGES[PAGES.findIndex((p) => p.slug === page.slug) + 1];
  const label = `Etapa ${stage.n}`;
  return (
    <PageFrame
      page={page}
      locale={locale}
      kicker={`Etapa ${stage.n} de ${STAGES.length}`}
      lead={
        <p>
          <strong>Para qué sirve.</strong> {stage.purpose}
        </p>
      }
      aside={<ActionDone id={stage.id} code={stage.code} label={label} />}
    >
      <div className="tk-stepstrip" data-hero>
        <span className="tk-stepstrip-media">
          <img src={stage.image.src} alt="" loading="lazy" decoding="async" width={120} height={90} />
        </span>
        <span>
          <small>{stage.question}</small>
          <strong>Al terminar tendrás:</strong> {stage.result}
        </span>
      </div>

      <H2>{stage.dzilam.title}</H2>
      <div className="tk-result" data-reveal>
        {stage.dzilam.paragraphs.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>

      {stage.id === "e2" ? (
        <p className="tk-meta-line">
          Para diseñar el muestreo con el conocimiento del territorio, consulta{" "}
          <Link href={toolkitHref(locale, "monitoreo-biocultural")}>El territorio guía el monitoreo</Link>.
        </p>
      ) : null}

      {stage.id === "e1" ? (
        <p className="tk-meta-line">
          Para acordar quién decide sobre los datos, consulta{" "}
          <Link href={toolkitHref(locale, "soberania-de-datos")}>Soberanía de datos</Link>.
        </p>
      ) : null}

      {stage.id === "e3" ? (
        <figure className="tk-figure">
          <Image src={IMAGES.jaguar.src} alt={IMAGES.jaguar.alt} width={487} height={322} sizes="(max-width: 760px) 100vw, 720px" />
          <figcaption>BioScanner identifica jaguares de forma individual por el patrón de sus manchas.</figcaption>
        </figure>
      ) : null}

      {STAGE_PHOTOS[stage.id] ? <PhotoGrid photos={STAGE_PHOTOS[stage.id]} label={`Fotos: ${stage.title}`} variant="pair" /> : null}

      {stage.id === "e2" ? <CameraTrap /> : null}

      <H2>Pasos clave</H2>
      <ol className="tk-steps">
        {stage.steps.map((p, i) => (
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

      <CheckBox title="Aprendizaje" text={stage.learning} />

      <H2>Herramientas para empezar</H2>
      <ul className="tk-list tk-tools">
        {stage.tools.map((t) => (
          <li key={t}>
            <Rich text={t} />
          </li>
        ))}
      </ul>
      {stage.id === "e3" ? <BioScannerInline /> : null}
      {STAGE_GREEN_LIST[stage.id] ? (
        <section className="tk-callout tk-callout--amber" aria-label="Conexión con la Lista Verde" data-reveal>
          <span className="tk-callout-label">Conexión con la Lista Verde</span>
          <p>
            <strong>{STAGE_GREEN_LIST[stage.id].criteria}.</strong> {STAGE_GREEN_LIST[stage.id].text}{" "}
            <Link href={toolkitHref(locale, "lista-verde-uicn")}>Ver cómo prepararte para la Lista Verde</Link>.
          </p>
        </section>
      ) : null}
      <p className="tk-meta-line">
        Más opciones, filtrables por idioma, acceso y nivel, en la{" "}
        <Link href={toolkitHref(locale, "caja-de-herramientas")}>caja de herramientas</Link>.
      </p>

      <section className="tk-callout tk-callout--sky tk-elsewhere" aria-labelledby={`otro-${stage.id}`} data-reveal>
        <span className="tk-callout-label">En otro territorio</span>
        <h2 id={`otro-${stage.id}`} className="tk-elsewhere-title" data-toc={`En otro territorio: ${stage.elsewhere.place}`}>
          {stage.elsewhere.place.charAt(0).toUpperCase() + stage.elsewhere.place.slice(1)}
        </h2>
        <p>{stage.elsewhere.text}</p>
        <p>
          <ExternalLink href={stage.elsewhere.link.url}>{stage.elsewhere.link.label}</ExternalLink>
        </p>
      </section>

      <ActionFinish id={stage.id} code={stage.code} label={label} nextSlug={nextPage?.slug} nextLabel={nextPage?.label} />
    </PageFrame>
  );
}

// ---------------------------------------------------------------------------
// Herramientas

export function PreguntasPage({ page, locale }: { page: ToolkitPage; locale: Locale }) {
  return (
    <PageFrame page={page} locale={locale} lead={<p>{QUESTIONS.intro}</p>}>
      <ReadinessCheck />
    </PageFrame>
  );
}

export function CajaPage({ page, locale }: { page: ToolkitPage; locale: Locale }) {
  return (
    <PageFrame page={page} locale={locale} lead={<p>{TOOLBOX.intro}</p>}>
      <ResourceLibrary />
      <p className="tk-meta-line">
        La inclusión de una herramienta no supone un aval institucional. Si encuentras un enlace roto o una herramienta
        nueva, escríbenos a través de la{" "}
        <Link href={localePath(locale, "/aiforbiodiversity/techfornature")}>página de Tech4Nature México</Link>.
      </p>
      <p className="tk-meta-line">
        ¿Dudas con algún término? Consulta el <Link href={toolkitHref(locale, "glosario")}>glosario</Link>.
      </p>
    </PageFrame>
  );
}

export function GlosarioPage({ page, locale }: { page: ToolkitPage; locale: Locale }) {
  return (
    <PageFrame page={page} locale={locale} lead={<p>{GLOSSARY_INTRO}</p>}>
      {GLOSSARY.map((g) => (
        <section key={g.group} aria-label={g.group}>
          <H2>{g.group}</H2>
          <dl className="tk-glossary">
            {g.terms.map((t) => (
              <div key={t.term} id={slugId(t.term)} className="tk-term">
                <dt>{t.term}</dt>
                <dd>
                  <Rich text={t.def} />
                </dd>
              </div>
            ))}
          </dl>
        </section>
      ))}
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
          {TEMPLATES_INTRO} Descarga cada una como hoja de trabajo (.csv) o como texto (.md) para duplicar en tu editor. Abre
          una carpeta para ver sus campos; el menú ··· la abre o la descarga.
        </p>
      }
    >
      <TemplateShelf />
    </PageFrame>
  );
}

/** Vista de la plantilla: una fila por campo, o un registro con sus columnas. */
function TemplateSheet({ template }: { template: Template }) {
  if (template.layout === "log") {
    return (
      <div className="tk-table-wrap">
        <table className="tk-table tk-table--log">
          <thead>
            <tr>
              {template.fields.map((f) => (
                <th key={f.label} scope="col">
                  {f.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[0, 1, 2].map((r) => (
              <tr key={r}>
                {template.fields.map((f) => (
                  <td key={f.label} data-label={f.label}>
                    &nbsp;
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
  return (
    <div className="tk-table-wrap">
      <table className="tk-table tk-table--form">
        <tbody>
          {template.fields.map((f) => (
            <tr key={f.label}>
              <th scope="row">
                {f.label}
                {f.hint ? <small> ({f.hint})</small> : null}
              </th>
              <td aria-label="Respuesta">&nbsp;</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function TemplatePage({ page, locale, template }: { page: ToolkitPage; locale: Locale; template: Template }) {
  const index = TEMPLATES.indexOf(template);
  const stage = STAGES.find((s) => s.code === template.stage)!;
  return (
    <PageFrame
      page={page}
      locale={locale}
      kicker="Plantilla"
      lead={<p>{TEMPLATES_INTRO}</p>}
      aside={<TemplateFolder template={template} index={index} width={230} />}
    >
      <div className="tk-template-bar" data-hero>
        <TemplateDownloads id={template.id} />
        <div className="tk-viewer-links">
          <span>Se usa en:</span>
          <Link href={toolkitHref(locale, stageSlug(stage))} data-ref={stage.code}>
            Etapa {stage.n} · {stage.title}
          </Link>
        </div>
      </div>
      <H2>{template.layout === "log" ? "Columnas" : "Campos"}</H2>
      <TemplateSheet template={template} />
      <p className="tk-meta-line">
        Otras plantillas:{" "}
        {TEMPLATES.filter((t) => t.id !== template.id).map((t, i, list) => (
          <span key={t.id}>
            <Link href={toolkitHref(locale, templateSlug(t))} data-ref={t.code}>
              {t.title}
            </Link>
            {i < list.length - 1 ? " · " : ""}
          </span>
        ))}
      </p>
    </PageFrame>
  );
}

// ---------------------------------------------------------------------------
// Cierre

export function FuentesPage({ page, locale }: { page: ToolkitPage; locale: Locale }) {
  return (
    <PageFrame page={page} locale={locale} kicker="Cierre">
      <ul className="tk-list tk-sources-list">
        {SOURCES.map((s) => (
          <li key={s}>
            <Rich text={s} />
          </li>
        ))}
      </ul>
      <div className="tk-callout" data-reveal>
        <span className="tk-callout-label">Documento vivo</span>
        <p>{LIVING_NOTE}</p>
      </div>
      <H2>Cómo citar</H2>
      <div className="tk-cite-box" data-reveal>
        <p>{CITATION}</p>
        <CopyButton text={CITATION} label="Copiar cita" />
      </div>
      <p className="tk-meta-line">
        Las herramientas de cada etapa están reunidas en la{" "}
        <Link href={toolkitHref(locale, "caja-de-herramientas")}>caja de herramientas</Link>.
      </p>
    </PageFrame>
  );
}

export function InsigniaPage({ page, locale }: { page: ToolkitPage; locale: Locale }) {
  return (
    <PageFrame
      page={page}
      locale={locale}
      kicker="Cierre"
      lead={<p>Revisa las {STAGES.length} etapas para desbloquear la insignia del toolkit. Puedes descargarla y publicarla en tus redes.</p>}
    >
      <BadgePanel />
      <CaseCard locale={locale} />
      <p className="tk-meta-line">
        Versión {TOOLKIT_VERSION} · {TOOLKIT_DATE_LABEL} · Información de acceso revisada en octubre de 2026.
      </p>
    </PageFrame>
  );
}
