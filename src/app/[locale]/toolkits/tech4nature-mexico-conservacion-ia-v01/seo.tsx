import type { Metadata } from "next";
import type { Locale } from "@/i18n/config";
import { IMAGES, TOOLKIT_VERSION, toolkitHref, type ToolkitPage } from "./data";
import { getContent } from "./content";

export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "https://www.cminds.co")
).replace(/\/$/, "");

const OG_IMAGE = IMAGES.hero.src;
const stripRefs = (s: string) => s.replace(/\s*\[(?:R\d{2}|[EP]\d)(?:,\s*(?:R\d{2}|[EP]\d))*\]/g, "");

const META = {
  es: {
    home: "Tech4Nature México — Toolkit de replicabilidad para la conservación con IA",
    suffix: "Tech4Nature México",
    keywords: ["toolkit de conservación", "inteligencia artificial para la biodiversidad", "América Latina y el Caribe", "monitoreo de biodiversidad", "fototrampeo", "jaguar", "BioScanner", "Tech4Nature México", "C Minds"],
    og: "es_MX",
  },
  en: {
    home: "Tech4Nature Mexico — Replication toolkit for AI-powered conservation",
    suffix: "Tech4Nature Mexico",
    keywords: ["conservation toolkit", "artificial intelligence for biodiversity", "Latin America and the Caribbean", "biodiversity monitoring", "camera trapping", "jaguar", "BioScanner", "Tech4Nature Mexico", "C Minds"],
    og: "en_US",
  },
};

/** Cada idioma es su propia canónica y declara la otra como alternativa. */
export function pageMetadata(page: ToolkitPage, locale: Locale): Metadata {
  const m = META[locale];
  const canonical = toolkitHref(locale, page.slug);
  const title = page.kind === "inicio" ? m.home : `${page.title} · ${m.suffix}`;
  const hero = getContent(locale).IMAGES.hero;
  return {
    title,
    description: page.description,
    keywords: m.keywords,
    authors: [{ name: "C Minds", url: "https://www.cminds.co" }],
    alternates: {
      canonical,
      languages: { es: toolkitHref("es", page.slug), en: toolkitHref("en", page.slug), "x-default": toolkitHref("es", page.slug) },
    },
    openGraph: {
      type: "article",
      title,
      description: page.description,
      url: canonical,
      siteName: "C Minds",
      locale: m.og,
      publishedTime: "2026-10-27",
      modifiedTime: "2026-10-30",
      section: "AI for Biodiversity",
      images: [{ url: OG_IMAGE, width: 1238, height: 793, type: "image/png", alt: hero.alt }],
    },
    twitter: { card: "summary_large_image", title, description: page.description, images: [{ url: OG_IMAGE, alt: hero.alt }] },
  };
}

/** Datos estructurados de cada página: página web, migas y el tipo de contenido que muestra. */
export function pageJsonLd(page: ToolkitPage, locale: Locale) {
  const { AUDIENCES, HERO, PAGES, STAGES, TEMPLATES } = getContent(locale);
  const en = locale === "en";
  const url = `${SITE_URL}${toolkitHref(locale, page.slug)}`;
  const home = `${SITE_URL}${toolkitHref(locale, "")}`;
  const org = { "@type": "Organization", "@id": `${SITE_URL}/#organization`, name: "C Minds", url: SITE_URL };

  const crumbs = [
    { name: "AI for Biodiversity", item: `${SITE_URL}/${locale}/aiforbiodiversity` },
    { name: en ? "Tech4Nature Mexico" : "Tech4Nature México", item: `${SITE_URL}/${locale}/aiforbiodiversity/techfornature` },
    { name: "Toolkit", item: home },
    ...(page.kind === "inicio" ? [] : [{ name: page.label, item: url }]),
  ];

  const graph: Record<string, unknown>[] = [
    {
      "@type": "WebPage",
      "@id": `${url}#webpage`,
      url,
      name: page.title,
      description: page.description,
      inLanguage: locale,
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
      inLanguage: locale,
      version: TOOLKIT_VERSION,
      datePublished: "2026-10-27",
      image: `${SITE_URL}${OG_IMAGE}`,
      learningResourceType: en ? ["Guide", "Template", "Checklist"] : ["Guía", "Plantilla", "Lista de verificación"],
      audience: AUDIENCES.map((a) => ({ "@type": "Audience", audienceType: a.title })),
      about: en
        ? ["Biodiversity conservation", "Artificial intelligence", "Camera trap monitoring", "Jaguar", "Data governance"]
        : ["Conservación de la biodiversidad", "Inteligencia artificial", "Monitoreo con cámaras trampa", "Jaguar", "Gobernanza de datos"],
      spatialCoverage: { "@type": "Place", name: en ? "Latin America and the Caribbean" : "América Latina y el Caribe" },
      author: org,
      publisher: org,
      teaches: STAGES.map((s) => s.title),
      hasPart: PAGES.filter((p) => p.kind !== "inicio").map((p) => ({
        "@type": "WebPage",
        name: p.title,
        url: `${SITE_URL}${toolkitHref(locale, p.slug)}`,
      })),
    });
  }

  if (page.kind === "etapa") {
    const st = STAGES.find((x) => x.id === page.ref)!;
    graph.push({
      "@type": "HowTo",
      "@id": `${url}#howto`,
      name: `${en ? "Stage" : "Etapa"} ${st.n}. ${st.title}`,
      description: st.purpose,
      inLanguage: locale,
      isPartOf: { "@id": `${home}#toolkit` },
      step: st.steps.map((text, i) => ({ "@type": "HowToStep", position: i + 1, text: stripRefs(text) })),
    });
  }

  if (page.kind === "plantilla") {
    const t = TEMPLATES.find((x) => x.id === page.ref)!;
    graph.push({
      "@type": "CreativeWork",
      "@id": `${url}#plantilla`,
      name: `${en ? "Template" : "Plantilla"} ${t.n}. ${t.title}`,
      description: page.description,
      inLanguage: locale,
      encodingFormat: ["text/csv", "text/markdown"],
      isPartOf: { "@id": `${home}#toolkit` },
      author: org,
    });
  }

  return { "@context": "https://schema.org", "@graph": graph };
}

export function JsonLd({ data }: { data: unknown }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }} />;
}
