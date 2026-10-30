import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { localePath, type Locale } from "@/i18n/config";
import {
  GL_MANUAL_URL,
  GL_WORKSHEET_URL,
  TOOLKIT_PATH,
  TOOLKIT_VERSION,
  stageSlug,
  templateSlug,
  toolkitHref,
  type Stage,
  type Template,
  type ToolkitPage,
} from "../data";
import { getContent } from "../content";
import RouteSelector from "./RouteSelector";
import ReadinessCheck from "./ReadinessCheck";
import ResourceLibrary from "./ResourceLibrary";
import { TemplateDownloads, TemplateFolder, TemplateShelf } from "./TemplateLibrary";
import { ActionDone, ActionFinish, CopyButton } from "./SmallIslands";
import { BadgePanel } from "./Badge";
import Achievements from "./Achievements";
import Avatar from "./Avatar";
import PhotoGrid from "./PhotoGrid";
import VideoList from "./VideoList";
import WhyCharts from "./WhyCharts";
import type { TeamGroup } from "../t4n";
import { ExternalLink, Rich, slugId } from "./rich";
import { IconArrowRight, IconCalendar, IconCheckCircle, IconChevronDown, IconChevronLeft, IconExternal, IconPin } from "./icons";

const L = {
  es: {
    crumbs: "Ruta de navegación",
    t4n: "Tech4Nature México",
    mexico: "México",
    pager: "Paginación del toolkit",
    prev: "Anterior",
    next: "Siguiente",
    result: "Al terminar tendrás:",
    caseEyebrow: "Conoce el caso completo",
    caseText: "Monitoreo con IA, liderazgo comunitario y conservación del jaguar en la península de Yucatán.",
    caseCta: "Ver la iniciativa",
    teamPeople: "Más de 80 personas",
    teamRest:
      " de la comunidad de Dzilam, el Gobierno de Yucatán, la UICN, C Minds, universidades y aliados tecnológicos construyeron Tech4Nature México.",
    teamCta: "Conoce al equipo",
    portrait: (name: string) => `Retrato de ${name}`,
    version: "Versión",
    chipPlace: "Reserva Estatal de Dzilam, Yucatán",
    chipPartners: "C Minds · SDS Yucatán · Grupo Chac Mool · UICN",
    whatIs: "Qué es Tech4Nature México",
    partners: "Socios",
    results: "Resultados destacados",
    resultsHint: "Toca cada tarjeta para ver el detalle: el acuerdo de ampliación, el listado de especies, BioScanner y las fotos de los jaguares.",
    learned: "Lo que aprendimos",
    discovered: "Lo que descubrimos sobre la reserva",
    lessons: "Aprendizajes y recomendaciones",
    lessonsHint: "Abre cada aprendizaje para ver qué pasó y qué recomendamos.",
    recommendation: "Recomendación:",
    principles: "Principios para crear tu propio Tech4Nature",
    impact: "Área de impacto",
    mapTitle: "Mapa satelital de la Reserva Estatal de Dzilam en Google Maps",
    openMaps: "Abrir en Google Maps",
    timeline: "Tech4Nature México a través de los años",
    stories: "Historias del territorio",
    people: "Quienes lo hacen posible",
    pictures: "El proyecto en imágenes",
    video: "Tech4Nature México en video",
    toolkit: "Toolkit de replicabilidad",
    inviteTitle: "Aprende cómo crear una iniciativa como",
    goToolkit: "Ir al toolkit",
    goStages: "Ir a las cinco etapas",
    team: "Equipo",
    coreTeam: "Primera fila",
    moreTeam: "Gobierno, comunidad y C Minds",
    allies: "Aliados a lo largo del tiempo",
    teamFix:
      "¿Formaste parte de Tech4Nature México y no apareces aquí, o quieres corregir tu nombre o tu rol? Escríbenos a través de la",
    t4nPage: "página de Tech4Nature México",
    forYou: "¿Este toolkit es para ti?",
    youCan: "Con este toolkit podrás",
    statStages: "etapas",
    statQuestions: "preguntas rápidas",
    statTemplates: "plantillas",
    statResources: "herramientas y recursos",
    howTo: "Cómo recorrerlo",
    startStage1: "Empezar por la etapa 1",
    tenQuestions: "Diez preguntas rápidas",
    fiveStages: "Las cinco etapas",
    framework: "Marco de referencia",
    sourcesA: "Consulta las",
    sourcesLink: "fuentes de los datos",
    biocultural: "Enfoque biocultural",
    bioculturalPhotos: "Fotos del monitoreo biocultural",
    knowledge: "El conocimiento que proviene del territorio",
    didDzilam: "Lo que hicimos en Dzilam",
    integrate: "Cómo integrarlo al muestreo",
    learning: "Aprendizaje",
    tools: "Herramientas para empezar",
    elsewhere: "En otro territorio",
    governance: "Gobernanza de datos",
    workshopPhotos: "Fotos de talleres con la comunidad",
    supplyChain: "La Cadena de Suministro con Soberanía de Datos",
    protocols: "Los cinco protocolos",
    questions: "Preguntas para poner sobre la mesa",
    standard: "Estándar de gestión",
    areaPhotos: "Fotos del trabajo en el área protegida",
    standardBrief: "El Estándar en breve",
    path: "El camino hacia la Lista Verde",
    glsat: "GL-SAT y COMPASS",
    didDzilamRL: "Lo que hicimos en Dzilam y Ría Lagartos",
    manual: "Descargar el manual (PDF)",
    worksheet: "Descargar la hoja de trabajo (Excel)",
    prepare: "Cómo preparar tu área protegida",
    connects: "Cómo se conecta con las cinco etapas",
    stageN: (n: number | string) => `Etapa ${n}`,
    stageOf: (n: number | string, total: number) => `Etapa ${n} de ${total}`,
    bsEyebrow: "Plataforma de Tech4Nature México",
    bsTitle: "Empieza con un lote pequeño",
    bsText: "Acceso con cuenta, actualmente en etapa de acceso anticipado. Interfaz en español, inglés, portugués y maya.",
    bsCta: "Entrar a BioScanner",
    ctWhat: "¿Qué es una cámara trampa?",
    ctPhotos: "Cámaras trampa en Dzilam",
    ctGood: "Úsala cuando quieras…",
    ctLess: "Combínala con otras herramientas para…",
    purpose: "Para qué sirve.",
    e2Note: "Para diseñar el muestreo con el conocimiento del territorio, consulta",
    e2Link: "El territorio guía el monitoreo",
    e1Note: "Para acordar quién decide sobre los datos, consulta",
    e1Link: "Soberanía de datos",
    bsHow: "Cómo funciona BioScanner",
    photosOf: (title: string) => `Fotos: ${title}`,
    keySteps: "Pasos clave",
    whereStart: "Por dónde empezar",
    models: "Modelos de sostenibilidad",
    greenList: "Conexión con la Lista Verde",
    greenListLink: "Ver cómo prepararte para la Lista Verde",
    moreOptions: "Más opciones, filtrables por idioma, acceso y nivel, en la",
    toolbox: "caja de herramientas",
    disclaimer:
      "La inclusión de una herramienta no supone un aval institucional. Si encuentras un enlace roto o una herramienta nueva, escríbenos a través de la",
    termDoubt: "¿Dudas con algún término? Consulta el",
    glossary: "glosario",
    templatesLead:
      "Descarga cada una como hoja de trabajo (.csv) o como texto (.md) para duplicar en tu editor. Abre una carpeta para ver sus campos; el menú ··· la abre o la descarga.",
    answer: "Respuesta",
    template: "Plantilla",
    usedIn: "Se usa en:",
    columns: "Columnas",
    fields: "Campos",
    otherTemplates: "Otras plantillas:",
    closing: "Cierre",
    living: "Documento vivo",
    cite: "Cómo citar",
    copyCite: "Copiar cita",
    gathered: "Las herramientas de cada etapa están reunidas en la",
    badgeLead: (n: number) => `Revisa las ${n} etapas para desbloquear la insignia del toolkit. Puedes descargarla y publicarla en tus redes.`,
    accessReviewed: "Información de acceso revisada en octubre de 2026.",
  },
  en: {
    crumbs: "Breadcrumb",
    t4n: "Tech4Nature Mexico",
    mexico: "Mexico",
    pager: "Toolkit pagination",
    prev: "Previous",
    next: "Next",
    result: "By the end you will have:",
    caseEyebrow: "Explore the full case",
    caseText: "AI-powered monitoring, community leadership and jaguar conservation in the Yucatán Peninsula.",
    caseCta: "See the initiative",
    teamPeople: "More than 80 people",
    teamRest:
      " from the Dzilam community, the Government of Yucatán, IUCN, C Minds, universities and technology partners built Tech4Nature Mexico.",
    teamCta: "Meet the team",
    portrait: (name: string) => `Portrait of ${name}`,
    version: "Version",
    chipPlace: "Dzilam State Reserve, Yucatán",
    chipPartners: "C Minds · SDS Yucatán · Chac Mool Group · IUCN",
    whatIs: "What is Tech4Nature Mexico",
    partners: "Partners",
    results: "Key results",
    resultsHint: "Tap each card for details: the expansion agreement, the species list, BioScanner and the jaguar photos.",
    learned: "What we learned",
    discovered: "What we discovered about the reserve",
    lessons: "Lessons and recommendations",
    lessonsHint: "Open each lesson to see what happened and what we recommend.",
    recommendation: "Recommendation:",
    principles: "Principles for creating your own Tech4Nature",
    impact: "Impact area",
    mapTitle: "Satellite map of the Dzilam State Reserve on Google Maps",
    openMaps: "Open in Google Maps",
    timeline: "Tech4Nature Mexico over the years",
    stories: "Stories from the territory",
    people: "The people who make it possible",
    pictures: "The project in pictures",
    video: "Tech4Nature Mexico on video",
    toolkit: "Replication toolkit",
    inviteTitle: "Learn how to create an initiative like",
    goToolkit: "Go to the toolkit",
    goStages: "Go to the five stages",
    team: "Team",
    coreTeam: "Core team",
    moreTeam: "Government, community and C Minds",
    allies: "Partners over time",
    teamFix:
      "Were you part of Tech4Nature Mexico and would like to be listed here, or to correct your name or role? Write to us through the",
    t4nPage: "Tech4Nature Mexico page",
    forYou: "Is this toolkit for you?",
    youCan: "With this toolkit you can",
    statStages: "stages",
    statQuestions: "quick questions",
    statTemplates: "templates",
    statResources: "tools and resources",
    howTo: "How to use it",
    startStage1: "Start with Stage 1",
    tenQuestions: "Ten quick questions",
    fiveStages: "The five stages",
    framework: "Reference framework",
    sourcesA: "See the",
    sourcesLink: "data sources",
    biocultural: "Biocultural approach",
    bioculturalPhotos: "Photos of biocultural monitoring",
    knowledge: "Knowledge that comes from the territory",
    didDzilam: "What we did in Dzilam",
    integrate: "How to integrate it into sampling",
    learning: "Lesson learned",
    tools: "Tools to get started",
    elsewhere: "In another territory",
    governance: "Data governance",
    workshopPhotos: "Photos of community workshops",
    supplyChain: "The Sovereign Data Supply Chain",
    protocols: "The five protocols",
    questions: "Questions to put on the table",
    standard: "Management standard",
    areaPhotos: "Photos of work in the protected area",
    standardBrief: "The Standard at a glance",
    path: "The path to the Green List",
    glsat: "GL-SAT and COMPASS",
    didDzilamRL: "What we did in Dzilam and Ría Lagartos",
    manual: "Download the manual (PDF, in Spanish)",
    worksheet: "Download the worksheet (Excel, in Spanish)",
    prepare: "How to prepare your protected area",
    connects: "How it connects to the five stages",
    stageN: (n: number | string) => `Stage ${n}`,
    stageOf: (n: number | string, total: number) => `Stage ${n} of ${total}`,
    bsEyebrow: "Tech4Nature Mexico platform",
    bsTitle: "Start with a small batch",
    bsText: "Account-based access, currently in early access. Interface in Spanish, English, Portuguese and Maya.",
    bsCta: "Open BioScanner",
    ctWhat: "What is a camera trap?",
    ctPhotos: "Camera traps in Dzilam",
    ctGood: "Use it when you want to…",
    ctLess: "Combine it with other tools to…",
    purpose: "What it's for.",
    e2Note: "To design sampling with knowledge from the territory, see",
    e2Link: "The territory guides monitoring",
    e1Note: "To agree on who decides about the data, see",
    e1Link: "Data sovereignty",
    bsHow: "How BioScanner works",
    photosOf: (title: string) => `Photos: ${title}`,
    keySteps: "Key steps",
    whereStart: "Where to start",
    models: "Sustainability models",
    greenList: "Connection to the Green List",
    greenListLink: "See how to prepare for the Green List",
    moreOptions: "More options, filterable by language, access and level, in the",
    toolbox: "toolbox",
    disclaimer:
      "Listing a tool does not imply institutional endorsement. If you find a broken link or a new tool, write to us through the",
    termDoubt: "Unsure about a term? See the",
    glossary: "glossary",
    templatesLead:
      "Download each one as a worksheet (.csv) or as text (.md) to copy into your editor. Open a folder to see its fields; the ··· menu opens or downloads it.",
    answer: "Answer",
    template: "Template",
    usedIn: "Used in:",
    columns: "Columns",
    fields: "Fields",
    otherTemplates: "Other templates:",
    closing: "Wrap-up",
    living: "Living document",
    cite: "How to cite",
    copyCite: "Copy citation",
    gathered: "The tools for each stage are gathered in the",
    badgeLead: (n: number) => `Review the ${n} stages to unlock the toolkit badge. You can download it and share it on social media.`,
    accessReviewed: "Access information reviewed in October 2026.",
  },
} satisfies Record<Locale, Record<string, string | ((...args: never[]) => string)>>;

function groupLabel(locale: Locale, id: string) {
  return getContent(locale).GROUPS.find((g) => g.id === id)?.label;
}

export function citation(locale: Locale) {
  const { HERO } = getContent(locale);
  return `C Minds (2026). ${HERO.title}. ${HERO.subtitle}. ${L[locale].version} ${TOOLKIT_VERSION}. https://www.cminds.co/${locale}${TOOLKIT_PATH}`;
}

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
  const l = L[locale];
  return (
    <nav aria-label={l.crumbs} data-hero>
      <ol className="tk-crumbs">
        <li>
          <Link href={localePath(locale, "/aiforbiodiversity/techfornature")}>{l.t4n}</Link>
        </li>
        <li>
          <Link href={toolkitHref(locale, "")}>Toolkit</Link>
        </li>
        <li>{groupLabel(locale, page.group)}</li>
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
          <span className="tk-kicker">{kicker ?? groupLabel(locale, page.group)}</span>
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
  const { PAGES } = getContent(locale);
  const l = L[locale];
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
    <nav className="tk-pager" aria-label={l.pager} data-edge={!prev ? "start" : !next ? "end" : undefined}>
      {prev ? (
        <Link className="tk-pager-link tk-pager-link--prev" href={toolkitHref(locale, prev.slug)} rel="prev">
          <small>
            <IconChevronLeft /> {l.prev}
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
            {l.next} <IconArrowRight />
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
  const { IMAGES } = getContent(locale);
  const l = L[locale];
  return (
    <Link className="tk-next" href={localePath(locale, "/aiforbiodiversity/techfornature")} data-reveal>
      <span className="tk-next-body">
        <span className="tk-eyebrow">{l.caseEyebrow}</span>
        <strong>{l.t4n}</strong>
        <span>{l.caseText}</span>
        <span className="tk-next-cta">
          {l.caseCta} <IconArrowRight />
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
  const { STAGES } = getContent(locale);
  const l = L[locale];
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
              <strong>{l.result}</strong> {s.result}
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
  const { TEAM_CORE } = getContent(locale);
  const l = L[locale];
  const people = TEAM_CORE.flatMap((g) => g.people);
  return (
    <Link className="tk-teamstrip" href={toolkitHref(locale, "equipo")} data-reveal>
      <span className="tk-teamstrip-faces" aria-hidden="true">
        {people.map((p) => (
          <Avatar key={p.name} name={p.name} photo={p.photo} size={52} />
        ))}
      </span>
      <span className="tk-teamstrip-text">
        <strong>{l.teamPeople}</strong>{l.teamRest}
        <span className="tk-next-cta">
          {l.teamCta} <IconArrowRight />
        </span>
      </span>
    </Link>
  );
}

function Spotlight({ locale }: { locale: Locale }) {
  const { SPOTLIGHT } = getContent(locale);
  const l = L[locale];
  return (
    <>
      <ul className="tk-spot">
        {SPOTLIGHT.map((s) => (
          <li key={s.name} className="tk-spot-card" data-reveal>
            <img className="tk-spot-photo" src={s.photo} alt={l.portrait(s.name)} loading="lazy" decoding="async" width={480} height={480} />
            <div className="tk-spot-body">
              <strong>{s.name}</strong>
              <span className="tk-spot-role">{s.role}</span>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}

export function HomePage({ page, locale }: { page: ToolkitPage; locale: Locale }) {
  const {
    CASE,
    FINDINGS,
    GALLERY,
    IMAGES,
    LOCAL_VIDEOS,
    MAP_TEXT,
    PARTNERS,
    SPOTLIGHT,
    SPOTLIGHT_INTRO,
    STAGES,
    T4N_HOME,
    TOOLKIT_DATE_LABEL,
    VIDEOS,
    VIDEOS_INTRO,
  } = getContent(locale);
  const l = L[locale];
  return (
    <article className="tk-article" aria-labelledby="tk-page-title">
      <header className="tk-hero">
        <nav aria-label={l.crumbs} data-hero>
          <ol className="tk-crumbs">
            <li>
              <Link href={localePath(locale, "/aiforbiodiversity")}>AI for Biodiversity</Link>
            </li>
            <li>
              <Link href={localePath(locale, "/aiforbiodiversity/techfornature")}>{l.t4n}</Link>
            </li>
            <li aria-current="page">Toolkit</li>
          </ol>
        </nav>
        <div className="tk-hero-chips" data-hero>
          <span className="tk-chip tk-chip--lime">{l.version} {TOOLKIT_VERSION}</span>
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
          <span className="tk-grad">Tech4Nature</span> {l.mexico}
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
                {l.chipPlace}
              </span>
              <span className="tk-chip">{l.chipPartners}</span>
            </div>
          </div>
        </div>
      </header>

      <section aria-labelledby="que-es">
        <H2 id="que-es">{l.whatIs}</H2>
        {CASE.intro.map((p, i) => (
          <p key={i} data-reveal>
            {p}
          </p>
        ))}
      </section>

      <section aria-labelledby="socios" className="tk-partners" data-reveal>
        <H2 id="socios">{l.partners}</H2>
        {PARTNERS.map((g) => (
          <div key={g.title} className="tk-partners-group">
            <p className="tk-partners-title">{g.title}</p>
            <ul>
              {g.partners.map((p) => (
                <li key={p.name}>
                  <img src={p.logo} alt={p.name} title={p.name} loading="lazy" decoding="async" style={p.height ? { height: p.height } : undefined} />
                </li>
              ))}
            </ul>
          </div>
        ))}
      </section>

      <section aria-labelledby="logros">
        <H2 id="logros">{l.results}</H2>
        <p data-reveal>{l.resultsHint}</p>
        <Achievements locale={locale} />
      </section>

      <section aria-labelledby="aprendizajes">
        <H2 id="aprendizajes">{l.learned}</H2>
        <p data-reveal>{FINDINGS.intro}</p>
        <h3 className="tk-h3">{l.discovered}</h3>
        <dl className="tk-glossary tk-glossary--3">
          {FINDINGS.science.map((s) => (
            <div key={s.title} className="tk-term" data-reveal>
              <dt>{s.title}</dt>
              <dd>{s.text}</dd>
            </div>
          ))}
        </dl>
        <h3 className="tk-h3">{l.lessons}</h3>
        <p className="tk-meta-line">{l.lessonsHint}</p>
        <ul className="tk-lessons">
          {FINDINGS.lessons.map((ls, i) => (
            <li key={ls.title} className="tk-lesson" data-reveal>
              <details>
                <summary>
                  <span className="tk-lesson-n" aria-hidden="true">
                    {i + 1}
                  </span>
                  <strong>{ls.title}</strong>
                  <IconChevronDown />
                </summary>
                <p>{ls.text}</p>
                <p className="tk-lesson-rec">
                  <span>{l.recommendation}</span> {ls.rec}
                  {ls.href ? (
                    <>
                      {" "}
                      <Link href={toolkitHref(locale, ls.href)}>{ls.link}</Link>
                    </>
                  ) : null}
                </p>
              </details>
            </li>
          ))}
        </ul>
        <h3 className="tk-h3">{l.principles}</h3>
        <ol className="tk-principles">
          {FINDINGS.principles.map((p) => (
            <li key={p.title} data-reveal>
              <strong>{p.title}</strong>
              <span>{p.text}</span>
            </li>
          ))}
        </ol>
        <a className="tk-report" href={FINDINGS.report.url} target="_blank" rel="noopener noreferrer" data-reveal>
          <span className="tk-report-icon" aria-hidden="true">PDF</span>
          <span className="tk-report-body">
            <span className="tk-eyebrow">{FINDINGS.report.eyebrow}</span>
            <strong>{FINDINGS.report.title}</strong>
            <span>{FINDINGS.report.text}</span>
            <span className="tk-next-cta">
              {FINDINGS.report.label} <IconExternal />
            </span>
          </span>
        </a>
      </section>

      <section aria-labelledby="area-de-impacto">
        <H2 id="area-de-impacto">{l.impact}</H2>
        <p data-reveal>{MAP_TEXT.lead}</p>
        <figure className="tk-gmap" data-reveal>
          <iframe
            src={MAP_TEXT.googleEmbed}
            title={l.mapTitle}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
          <figcaption>
            {MAP_TEXT.googleCaption}{" "}
            <a href={MAP_TEXT.googleUrl} target="_blank" rel="noopener noreferrer">
              {l.openMaps}
            </a>
          </figcaption>
        </figure>
        <div className="tk-localvids">
          {LOCAL_VIDEOS.map((v) => (
            <figure key={v.src} className="tk-localvid" data-reveal>
              <video
                src={v.src}
                poster={v.poster}
                controls
                playsInline
                preload="none"
                muted={v.loop}
                loop={v.loop}
              />
              <figcaption>
                <strong>{v.title}</strong> {v.caption}
              </figcaption>
            </figure>
          ))}
        </div>
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

      <section aria-labelledby="linea-de-tiempo">
        <H2 id="linea-de-tiempo">{l.timeline}</H2>
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

      <article className="tk-story" aria-labelledby="historia-juan" data-reveal>
        <div className="tk-story-head">
          <Avatar name={CASE.story.name} photo={SPOTLIGHT.find((p) => p.name === CASE.story.name)?.photo} size={88} />
          <div>
            <span className="tk-eyebrow">{l.stories}</span>
            <h3 id="historia-juan" className="tk-story-name">
              {CASE.story.name}
            </h3>
            <span className="tk-story-role">{CASE.story.role}</span>
          </div>
        </div>
        <div className="tk-story-body">
          {CASE.story.paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      </article>

      <section aria-labelledby="quienes">
        <H2 id="quienes">{l.people}</H2>
        <p data-reveal>{SPOTLIGHT_INTRO}</p>
        <Spotlight locale={locale} />
        <TeamStrip locale={locale} />
      </section>
      <section aria-labelledby="en-imagenes">
        <H2 id="en-imagenes">{l.pictures}</H2>
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

      <section aria-labelledby="videos">
        <H2 id="videos">{l.video}</H2>
        <p data-reveal>{VIDEOS_INTRO}</p>
        <VideoList videos={VIDEOS} />
      </section>

      <section aria-labelledby="crea-el-tuyo-cta" className="tk-invite" data-reveal>
        <span className="tk-eyebrow">{l.toolkit}</span>
        <h2 id="crea-el-tuyo-cta" className="tk-invite-title" data-toc={l.toolkit}>
          {l.inviteTitle} <span className="tk-grad">{l.t4n}</span>
        </h2>
        <p>{T4N_HOME.invite}</p>
        <div className="tk-start">
          <Link className="tk-cta" href={toolkitHref(locale, "crea-el-tuyo")}>
            {l.goToolkit}
            <IconArrowRight />
          </Link>
          <Link className="tk-ghost" href={toolkitHref(locale, stageSlug(STAGES[0]))}>
            {l.goStages}
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
  const { TEAM_ALLIES, TEAM_CORE, TEAM_INTRO, TEAM_MORE } = getContent(locale);
  const l = L[locale];
  return (
    <PageFrame page={page} locale={locale} kicker={l.team} lead={<p>{TEAM_INTRO}</p>}>
      <H2>{l.people}</H2>
      <Spotlight locale={locale} />
      <H2>{l.coreTeam}</H2>
      {TEAM_CORE.map((g) => (
        <section key={g.id} aria-label={g.title}>
          <h3 className="tk-h3">{g.title}</h3>
          <PeopleGrid group={g} big />
        </section>
      ))}

      <H2>{l.moreTeam}</H2>
      {TEAM_MORE.map((g) => (
        <section key={g.id} aria-label={g.title}>
          <h3 className="tk-h3">{g.title}</h3>
          {g.intro ? <p>{g.intro}</p> : null}
          <PeopleGrid group={g} />
        </section>
      ))}

      <H2>{l.allies}</H2>
      {TEAM_ALLIES.map((g) => (
        <section key={g.id} aria-label={g.title}>
          <h3 className="tk-h3">{g.title}</h3>
          {g.intro ? <p>{g.intro}</p> : null}
          <PeopleGrid group={g} />
        </section>
      ))}
      <p className="tk-meta-line">
        {l.teamFix}{" "}
        <Link href={localePath(locale, "/aiforbiodiversity/techfornature")}>{l.t4nPage}</Link>.
      </p>
    </PageFrame>
  );
}

// ---------------------------------------------------------------------------
// Crea el tuyo

export function CreaPage({ page, locale }: { page: ToolkitPage; locale: Locale }) {
  const { HERO, INTRO, QUESTIONS, RESOURCES, STAGES, TEMPLATES } = getContent(locale);
  const l = L[locale];
  return (
    <PageFrame page={page} locale={locale} kicker={l.toolkit} lead={<p>{HERO.subtitle}.</p>}>
      <section aria-labelledby="para-ti">
        <H2 id="para-ti">{l.forYou}</H2>
        {INTRO.paragraphs.map((p, i) => (
          <p key={i} data-reveal>
            {p}
          </p>
        ))}
        <h3 className="tk-h3">{l.youCan}</h3>
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
            { value: STAGES.length, label: l.statStages },
            { value: QUESTIONS.items.length, label: l.statQuestions },
            { value: TEMPLATES.length, label: l.statTemplates },
            { value: RESOURCES.length, label: l.statResources },
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
        <H2 id="como-recorrerlo">{l.howTo}</H2>
        <p data-reveal>{INTRO.howTo}</p>
        <RouteSelector />
        <div className="tk-start" data-reveal>
          <Link className="tk-cta" href={toolkitHref(locale, stageSlug(STAGES[0]))}>
            {l.startStage1}
            <IconArrowRight />
          </Link>
          <Link className="tk-ghost" href={toolkitHref(locale, "diez-preguntas")}>
            {l.tenQuestions}
          </Link>
        </div>
      </section>

      <section aria-labelledby="cinco-etapas">
        <H2 id="cinco-etapas">{l.fiveStages}</H2>
        <StageMap locale={locale} />
      </section>

    </PageFrame>
  );
}

// ---------------------------------------------------------------------------
// Empezar

export function PorQueImportaPage({ page, locale }: { page: ToolkitPage; locale: Locale }) {
  const { WHY } = getContent(locale);
  const l = L[locale];
  return (
    <PageFrame page={page} locale={locale} kicker={l.framework} lead={<p>{WHY.intro}</p>}>
      <WhyCharts locale={locale} />
      <p className="tk-meta-line">
        {l.sourcesA} <Link href={toolkitHref(locale, "fuentes")}>{l.sourcesLink}</Link>.
      </p>
    </PageFrame>
  );
}

// ---------------------------------------------------------------------------
// Monitoreo biocultural

export function BioculturalPage({ page, locale }: { page: ToolkitPage; locale: Locale }) {
  const { BIOCULTURAL, PAGE_PHOTOS } = getContent(locale);
  const l = L[locale];
  const e = BIOCULTURAL.elsewhere;
  return (
    <PageFrame page={page} locale={locale} kicker={l.biocultural} lead={<p>{BIOCULTURAL.lead}</p>}>
      <p data-reveal>{BIOCULTURAL.leadMore}</p>
      <PhotoGrid photos={PAGE_PHOTOS.biocultural} label={l.bioculturalPhotos} variant="pair" />
      <H2>{l.knowledge}</H2>
      <dl className="tk-glossary tk-glossary--2">
        {BIOCULTURAL.contributions.map((c) => (
          <div key={c.title} className="tk-term" data-reveal>
            <dt>{c.title}</dt>
            <dd>{c.text}</dd>
          </div>
        ))}
      </dl>

      <H2>{l.didDzilam}</H2>
      <div className="tk-result" data-reveal>
        {BIOCULTURAL.dzilam.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>

      <H2>{l.integrate}</H2>
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

      <CheckBox title={l.learning} text={BIOCULTURAL.learning} />

      <H2>{l.tools}</H2>
      <ul className="tk-list tk-tools">
        {BIOCULTURAL.tools.map((t) => (
          <li key={t}>
            <Rich text={t} />
          </li>
        ))}
      </ul>

      <section className="tk-callout tk-callout--sky tk-elsewhere" aria-labelledby="otro-biocultural" data-reveal>
        <span className="tk-callout-label">{l.elsewhere}</span>
        <h2 id="otro-biocultural" className="tk-elsewhere-title" data-toc={`${l.elsewhere}: ${e.place}`}>
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
  const { PAGE_PHOTOS, SOVEREIGNTY } = getContent(locale);
  const l = L[locale];
  const e = SOVEREIGNTY.elsewhere;
  return (
    <PageFrame page={page} locale={locale} kicker={l.governance} lead={<p>{SOVEREIGNTY.lead}</p>}>
      <PhotoGrid photos={PAGE_PHOTOS.soberania} label={l.workshopPhotos} variant="pair" />
      <H2>{l.supplyChain}</H2>
      {SOVEREIGNTY.framework.map((p, i) => (
        <p key={i} data-reveal>
          {p}
        </p>
      ))}
      <dl className="tk-glossary">
        {SOVEREIGNTY.layers.map((ly) => (
          <div key={ly.title} className="tk-term" data-reveal>
            <dt>{ly.title}</dt>
            <dd>{ly.text}</dd>
          </div>
        ))}
      </dl>

      <H2>{l.protocols}</H2>
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

      <H2>{l.didDzilam}</H2>
      <div className="tk-result" data-reveal>
        {SOVEREIGNTY.dzilam.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>

      <H2>{l.questions}</H2>
      <p data-reveal>{SOVEREIGNTY.questionsIntro}</p>
      <ul className="tk-list">
        {SOVEREIGNTY.questions.map((q) => (
          <li key={q}>{q}</li>
        ))}
      </ul>

      <CheckBox title={l.learning} text={SOVEREIGNTY.learning} />

      <H2>{l.tools}</H2>
      <ul className="tk-list tk-tools">
        {SOVEREIGNTY.tools.map((t) => (
          <li key={t}>
            <Rich text={t} />
          </li>
        ))}
      </ul>

      <section className="tk-callout tk-callout--sky tk-elsewhere" aria-labelledby="otro-soberania" data-reveal>
        <span className="tk-callout-label">{l.elsewhere}</span>
        <h2 id="otro-soberania" className="tk-elsewhere-title" data-toc={`${l.elsewhere}: ${e.place}`}>
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
  const { GREEN_LIST, PAGE_PHOTOS, STAGES, STAGE_GREEN_LIST } = getContent(locale);
  const l = L[locale];
  const e = GREEN_LIST.elsewhere;
  return (
    <PageFrame page={page} locale={locale} kicker={l.standard} lead={<p>{GREEN_LIST.lead}</p>}>
      <PhotoGrid photos={PAGE_PHOTOS.listaverde} label={l.areaPhotos} variant="pair" />
      <H2>{l.standardBrief}</H2>
      <dl className="tk-glossary">
        {GREEN_LIST.components.map((c) => (
          <div key={c.title} className="tk-term" data-reveal>
            <dt>{c.title}</dt>
            <dd>{c.text}</dd>
          </div>
        ))}
      </dl>
      <p className="tk-meta-line">{GREEN_LIST.componentsNote}</p>

      <H2>{l.path}</H2>
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

      <H2>{l.glsat}</H2>
      {GREEN_LIST.glsat.map((p, i) => (
        <p key={i} data-reveal>
          {p}
        </p>
      ))}

      <H2>{l.didDzilamRL}</H2>
      <div className="tk-result" data-reveal>
        {GREEN_LIST.dzilam.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>
      <div className="tk-inline-promo-actions">
        <a className="tk-cta" href={GL_MANUAL_URL} target="_blank" rel="noopener noreferrer">
          {l.manual}
          <IconExternal />
        </a>{" "}
        <a className="tk-cta" href={GL_WORKSHEET_URL} download>
          {l.worksheet}
        </a>
      </div>

      <H2>{l.prepare}</H2>
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

      <CheckBox title={l.learning} text={GREEN_LIST.learning} />

      <H2>{l.connects}</H2>
      <ul className="tk-list">
        {STAGES.map((s) => {
          const g = STAGE_GREEN_LIST[s.id];
          return g ? (
            <li key={s.id}>
              <Link href={toolkitHref(locale, stageSlug(s))}>
                {l.stageN(s.n)}. {s.title}
              </Link>
              : {g.criteria}.
            </li>
          ) : null;
        })}
      </ul>

      <H2>{l.tools}</H2>
      <ul className="tk-list tk-tools">
        {GREEN_LIST.tools.map((t) => (
          <li key={t}>
            <Rich text={t} />
          </li>
        ))}
      </ul>

      <section className="tk-callout tk-callout--sky tk-elsewhere" aria-labelledby="otro-listaverde" data-reveal>
        <span className="tk-callout-label">{l.elsewhere}</span>
        <h2 id="otro-listaverde" className="tk-elsewhere-title" data-toc={`${l.elsewhere}: ${e.place}`}>
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

function BioScannerInline({ locale }: { locale: Locale }) {
  const { IMAGES } = getContent(locale);
  const l = L[locale];
  return (
    <aside className="tk-inline-promo" aria-label="BioScanner">
      <Image src={IMAGES.bioscanner.src} alt={IMAGES.bioscanner.alt} width={482} height={298} sizes="180px" />
      <div>
        <span className="tk-eyebrow">{l.bsEyebrow}</span>
        <p className="tk-promo-title">{l.bsTitle}</p>
        <p>{l.bsText}</p>
        <div className="tk-inline-promo-actions">
          <a className="tk-cta" href="https://app.bioscanner.io" target="_blank" rel="noopener noreferrer">
            {l.bsCta}
            <IconExternal />
          </a>
        </div>
      </div>
    </aside>
  );
}

function CameraTrap({ locale }: { locale: Locale }) {
  const { CAMERA_TRAP } = getContent(locale);
  const l = L[locale];
  return (
    <section className="tk-ct" aria-labelledby="que-es-camara-trampa">
      <H2 id="que-es-camara-trampa">{l.ctWhat}</H2>
      <p data-reveal>{CAMERA_TRAP.lead}</p>
      <PhotoGrid photos={CAMERA_TRAP.photos} label={l.ctPhotos} variant="trio" />
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
          <h3 className="tk-h3">{l.ctGood}</h3>
          <ul className="tk-list">
            {CAMERA_TRAP.goodFor.map((g) => (
              <li key={g}>{g}</li>
            ))}
          </ul>
        </div>
        <div className="tk-ct-col tk-ct-col--alt" data-reveal>
          <h3 className="tk-h3">{l.ctLess}</h3>
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

function AudioRecorder({ locale }: { locale: Locale }) {
  const a = getContent(locale).AUDIO_RECORDER;
  return (
    <section className="tk-audio" aria-labelledby="grabadora-acustica">
      <H2 id="grabadora-acustica">{a.title}</H2>
      <div className="tk-audio-grid">
        <figure className="tk-audio-photo" data-reveal>
          <img src={a.photo.src} alt={a.photo.alt} loading="lazy" decoding="async" width={1280} height={720} />
          <figcaption>{a.caption}</figcaption>
        </figure>
        <div data-reveal>
          <p>{a.lead}</p>
          <ul className="tk-list tk-tools">
            {a.links.map((lk) => (
              <li key={lk.url}>
                <ExternalLink href={lk.url}>{lk.label}</ExternalLink>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

export function StagePage({ page, locale, stage }: { page: ToolkitPage; locale: Locale; stage: Stage }) {
  const { BIOSCANNER_FLOW, E4_ORIENT, E5_MODELS, PAGES, STAGES, STAGE_GREEN_LIST, STAGE_PHOTOS } = getContent(locale);
  const l = L[locale];
  const nextPage = PAGES[PAGES.findIndex((p) => p.slug === page.slug) + 1];
  const label = l.stageN(stage.n);
  return (
    <PageFrame
      page={page}
      locale={locale}
      kicker={l.stageOf(stage.n, STAGES.length)}
      lead={
        <p>
          <strong>{l.purpose}</strong> {stage.purpose}
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
          <strong>{l.result}</strong> {stage.result}
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
          {l.e2Note}{" "}
          <Link href={toolkitHref(locale, "monitoreo-biocultural")}>{l.e2Link}</Link>.
        </p>
      ) : null}

      {stage.id === "e1" ? (
        <p className="tk-meta-line">
          {l.e1Note}{" "}
          <Link href={toolkitHref(locale, "soberania-de-datos")}>{l.e1Link}</Link>.
        </p>
      ) : null}

      {stage.id === "e3" ? (
        <>
          <h3 className="tk-h3">{l.bsHow}</h3>
          <dl className="tk-glossary tk-glossary--3">
            {BIOSCANNER_FLOW.map((f) => (
              <div key={f.title} className="tk-term" data-reveal>
                <dt>{f.title}</dt>
                <dd>{f.text}</dd>
              </div>
            ))}
          </dl>
        </>
      ) : null}

      {STAGE_PHOTOS[stage.id] ? <PhotoGrid photos={STAGE_PHOTOS[stage.id]} label={l.photosOf(stage.title)} variant="pair" /> : null}

      {stage.id === "e2" ? (
        <>
          <CameraTrap locale={locale} />
          <AudioRecorder locale={locale} />
        </>
      ) : null}

      {stage.steps.length ? (
        <>
          <H2>{l.keySteps}</H2>
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
        </>
      ) : null}

      {stage.id === "e4" ? (
        <>
          <H2>{l.whereStart}</H2>
          <dl className="tk-glossary tk-glossary--3">
            {E4_ORIENT.map((o) => (
              <div key={o.title} className="tk-term" data-reveal>
                <dt>{o.title}</dt>
                <dd>{o.text}</dd>
              </div>
            ))}
          </dl>
        </>
      ) : null}

      {stage.id === "e5" ? (
        <>
          <H2>{l.models}</H2>
          <p data-reveal>{E5_MODELS.lead}</p>
          <dl className="tk-glossary tk-glossary--3">
            {E5_MODELS.items.map((o) => (
              <div key={o.title} className="tk-term" data-reveal>
                <dt>{o.title}</dt>
                <dd>{o.text}</dd>
              </div>
            ))}
          </dl>
        </>
      ) : null}

      <CheckBox title={l.learning} text={stage.learning} />

      <H2>{l.tools}</H2>
      <ul className="tk-list tk-tools">
        {stage.tools.map((t) => (
          <li key={t}>
            <Rich text={t} />
          </li>
        ))}
      </ul>
      {stage.id === "e3" ? <BioScannerInline locale={locale} /> : null}
      {STAGE_GREEN_LIST[stage.id] ? (
        <section className="tk-callout tk-callout--amber" aria-label={l.greenList} data-reveal>
          <span className="tk-callout-label">{l.greenList}</span>
          <p>
            <strong>{STAGE_GREEN_LIST[stage.id].criteria}.</strong> {STAGE_GREEN_LIST[stage.id].text}{" "}
            <Link href={toolkitHref(locale, "lista-verde-uicn")}>{l.greenListLink}</Link>.
          </p>
        </section>
      ) : null}
      <p className="tk-meta-line">
        {l.moreOptions}{" "}
        <Link href={toolkitHref(locale, "caja-de-herramientas")}>{l.toolbox}</Link>.
      </p>

      <section className="tk-callout tk-callout--sky tk-elsewhere" aria-labelledby={`otro-${stage.id}`} data-reveal>
        <span className="tk-callout-label">{l.elsewhere}</span>
        <h2 id={`otro-${stage.id}`} className="tk-elsewhere-title" data-toc={`${l.elsewhere}: ${stage.elsewhere.place}`}>
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
  const { QUESTIONS } = getContent(locale);
  return (
    <PageFrame page={page} locale={locale} lead={<p>{QUESTIONS.intro}</p>}>
      <ReadinessCheck />
    </PageFrame>
  );
}

export function CajaPage({ page, locale }: { page: ToolkitPage; locale: Locale }) {
  const { TOOLBOX } = getContent(locale);
  const l = L[locale];
  return (
    <PageFrame page={page} locale={locale} lead={<p>{TOOLBOX.intro}</p>}>
      <ResourceLibrary />
      <p className="tk-meta-line">
        {l.disclaimer}{" "}
        <Link href={localePath(locale, "/aiforbiodiversity/techfornature")}>{l.t4nPage}</Link>.
      </p>
      <p className="tk-meta-line">
        {l.termDoubt} <Link href={toolkitHref(locale, "glosario")}>{l.glossary}</Link>.
      </p>
    </PageFrame>
  );
}

export function GlosarioPage({ page, locale }: { page: ToolkitPage; locale: Locale }) {
  const { GLOSSARY, GLOSSARY_INTRO } = getContent(locale);
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
  const { TEMPLATES_INTRO } = getContent(locale);
  const l = L[locale];
  return (
    <PageFrame
      page={page}
      locale={locale}
      lead={
        <p>
          {TEMPLATES_INTRO} {l.templatesLead}
        </p>
      }
    >
      <TemplateShelf />
    </PageFrame>
  );
}

/** Vista de la plantilla: una fila por campo, o un registro con sus columnas. */
function TemplateSheet({ template, locale }: { template: Template; locale: Locale }) {
  if (template.layout === "log") {
    return (
      <div className="tk-table-wrap">
        <table className="tk-table tk-table--log">
          <thead>
            <tr>
              {template.fields.map((f) => (
                <th key={f.label} scope="col">
                  {f.label}
                  {f.key ? <code className="tk-col-key">{f.key}</code> : null}
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
              <td aria-label={L[locale].answer}>&nbsp;</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function TemplatePage({ page, locale, template }: { page: ToolkitPage; locale: Locale; template: Template }) {
  const { STAGES, TEMPLATES, TEMPLATES_INTRO } = getContent(locale);
  const l = L[locale];
  const index = TEMPLATES.findIndex((t) => t.id === template.id);
  const stage = STAGES.find((s) => s.code === template.stage)!;
  return (
    <PageFrame
      page={page}
      locale={locale}
      kicker={l.template}
      lead={<p>{TEMPLATES_INTRO}</p>}
      aside={<TemplateFolder template={template} index={index} width={230} />}
    >
      <div className="tk-template-bar" data-hero>
        <TemplateDownloads id={template.id} />
        {template.extra ? (
          <a className="tk-ghost" href={template.extra.url} download>
            {template.extra.label}
          </a>
        ) : null}
        <div className="tk-viewer-links">
          <span>{l.usedIn}</span>
          <Link href={toolkitHref(locale, stageSlug(stage))} data-ref={stage.code}>
            {l.stageN(stage.n)} · {stage.title}
          </Link>
        </div>
      </div>
      {template.note ? <p className="tk-template-note">{template.note}</p> : null}
      <H2>{template.layout === "log" ? l.columns : l.fields}</H2>
      <TemplateSheet template={template} locale={locale} />
      <p className="tk-meta-line">
        {l.otherTemplates}{" "}
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
  const { LIVING_NOTE, SOURCES } = getContent(locale);
  const l = L[locale];
  const cite = citation(locale);
  return (
    <PageFrame page={page} locale={locale} kicker={l.closing}>
      <ul className="tk-list tk-sources-list">
        {SOURCES.map((s) => (
          <li key={s}>
            <Rich text={s} />
          </li>
        ))}
      </ul>
      <div className="tk-callout" data-reveal>
        <span className="tk-callout-label">{l.living}</span>
        <p>{LIVING_NOTE}</p>
      </div>
      <H2>{l.cite}</H2>
      <div className="tk-cite-box" data-reveal>
        <p>{cite}</p>
        <CopyButton text={cite} label={l.copyCite} />
      </div>
      <p className="tk-meta-line">
        {l.gathered}{" "}
        <Link href={toolkitHref(locale, "caja-de-herramientas")}>{l.toolbox}</Link>.
      </p>
    </PageFrame>
  );
}

export function InsigniaPage({ page, locale }: { page: ToolkitPage; locale: Locale }) {
  const { STAGES, TOOLKIT_DATE_LABEL } = getContent(locale);
  const l = L[locale];
  return (
    <PageFrame
      page={page}
      locale={locale}
      kicker={l.closing}
      lead={<p>{l.badgeLead(STAGES.length)}</p>}
    >
      <BadgePanel />
      <CaseCard locale={locale} />
      <p className="tk-meta-line">
        {l.version} {TOOLKIT_VERSION} · {TOOLKIT_DATE_LABEL} · {l.accessReviewed}
      </p>
    </PageFrame>
  );
}
