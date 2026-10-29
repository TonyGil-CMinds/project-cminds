import type { Metadata } from "next";
import {
  ACTIONS,
  AUDIENCES,
  GLOSSARY,
  HERO,
  IMAGES,
  PAGES,
  TEMPLATES,
  TOOLKIT_VERSION,
  toolkitHref,
  type ToolkitPage,
} from "./data";

export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "https://www.cminds.co")
).replace(/\/$/, "");

const OG_IMAGE = IMAGES.hero.src;
const stripRefs = (s: string) => s.replace(/\s*\[[^\]]+\]/g, "");

/** El contenido solo existe en español: /en y /es declaran /es como canónica. */
export function pageMetadata(page: ToolkitPage): Metadata {
  const canonical = toolkitHref("es", page.slug);
  const title = page.kind === "inicio" ? "Toolkit de conservación con IA en México — Tech4Nature" : `${page.code ? `${page.code} ` : ""}${page.title} · Toolkit Tech4Nature`;
  return {
    title,
    description: page.description,
    keywords: [
      "toolkit de conservación",
      "inteligencia artificial para la biodiversidad",
      "monitoreo de biodiversidad",
      "fototrampeo",
      "jaguar",
      "BioScanner",
      "Tech4Nature México",
      "C Minds",
    ],
    authors: [{ name: "C Minds", url: "https://www.cminds.co" }],
    alternates: { canonical, languages: { es: canonical, "x-default": canonical } },
    openGraph: {
      type: "article",
      title,
      description: page.description,
      url: canonical,
      siteName: "C Minds",
      locale: "es_MX",
      publishedTime: "2026-10-27",
      modifiedTime: "2026-10-27",
      section: "AI for Biodiversity",
      images: [{ url: OG_IMAGE, width: 1238, height: 793, type: "image/png", alt: IMAGES.hero.alt }],
    },
    twitter: { card: "summary_large_image", title, description: page.description, images: [{ url: OG_IMAGE, alt: IMAGES.hero.alt }] },
  };
}

/** Datos estructurados de cada página: página web, migas y el tipo de contenido que muestra. */
export function pageJsonLd(page: ToolkitPage) {
  const url = `${SITE_URL}${toolkitHref("es", page.slug)}`;
  const home = `${SITE_URL}${toolkitHref("es", "")}`;
  const org = { "@type": "Organization", "@id": `${SITE_URL}/#organization`, name: "C Minds", url: SITE_URL };

  const crumbs = [
    { name: "AI for Biodiversity", item: `${SITE_URL}/es/aiforbiodiversity` },
    { name: "Tech4Nature México", item: `${SITE_URL}/es/aiforbiodiversity/techfornature` },
    { name: "Toolkit de conservación con IA", item: home },
    ...(page.kind === "inicio" ? [] : [{ name: page.label, item: url }]),
  ];

  const graph: Record<string, unknown>[] = [
    {
      "@type": "WebPage",
      "@id": `${url}#webpage`,
      url,
      name: page.title,
      description: page.description,
      inLanguage: "es",
      isPartOf: { "@id": `${home}#toolkit` },
      breadcrumb: { "@id": `${url}#breadcrumb` },
      primaryImageOfPage: `${SITE_URL}${OG_IMAGE}`,
    },
    {
      "@type": "BreadcrumbList",
      "@id": `${url}#breadcrumb`,
      itemListElement: crumbs.map((c, i) => ({ "@type": "ListItem", position: i + 1, name: c.name, item: c.item })),
    },
  ];

  if (page.kind === "inicio") {
    graph.push({
      "@type": "LearningResource",
      "@id": `${home}#toolkit`,
      name: HERO.title,
      description: HERO.subtitle,
      url: home,
      inLanguage: "es",
      version: TOOLKIT_VERSION,
      datePublished: "2026-10-27",
      image: `${SITE_URL}${OG_IMAGE}`,
      learningResourceType: ["Guía", "Plantilla", "Ejercicio"],
      audience: AUDIENCES.map((a) => ({ "@type": "Audience", audienceType: a.title })),
      about: ["Conservación de la biodiversidad", "Inteligencia artificial", "Monitoreo con cámaras trampa", "Jaguar", "Gobernanza de datos"],
      spatialCoverage: { "@type": "Place", name: "Yucatán, México" },
      author: org,
      publisher: org,
      teaches: ACTIONS.map((a) => a.title),
      hasPart: PAGES.filter((p) => p.kind !== "inicio").map((p) => ({
        "@type": "WebPage",
        name: p.title,
        url: `${SITE_URL}${toolkitHref("es", p.slug)}`,
      })),
    });
  }

  if (page.kind === "accion") {
    const a = ACTIONS.find((x) => x.id === page.ref)!;
    graph.push({
      "@type": "HowTo",
      "@id": `${url}#howto`,
      name: `${a.code} ${a.title}`,
      description: stripRefs(a.result),
      inLanguage: "es",
      isPartOf: { "@id": `${home}#toolkit` },
      step: a.procedure.map((text, i) => ({ "@type": "HowToStep", position: i + 1, text: stripRefs(text) })),
    });
  }

  if (page.kind === "plantilla") {
    const t = TEMPLATES.find((x) => x.id === page.ref)!;
    graph.push({
      "@type": "CreativeWork",
      "@id": `${url}#plantilla`,
      name: `${t.code} ${t.title}`,
      description: t.intro,
      inLanguage: "es",
      encodingFormat: ["text/csv", "text/markdown"],
      isPartOf: { "@id": `${home}#toolkit` },
      author: org,
    });
  }

  if (page.kind === "glosario") {
    graph.push({
      "@type": "DefinedTermSet",
      "@id": `${url}#glosario`,
      name: page.title,
      hasDefinedTerm: GLOSSARY.map((g) => ({ "@type": "DefinedTerm", name: g.term, description: g.def })),
    });
  }

  return { "@context": "https://schema.org", "@graph": graph };
}

export function JsonLd({ data }: { data: unknown }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }} />;
}
