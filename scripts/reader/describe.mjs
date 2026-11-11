// Descripciones de fotos sin pie, hechas con Claude, para el lector 3D.
//
// describePhotos(manifest, files, { lang, max }) agrega a cada foto pendiente:
//   - un punto de zoom «photo» con la descripción (marcado con ai: true)
//   - el texto alternativo de la página (page.alt), que lee el panel de texto
// Necesita ANTHROPIC_API_KEY; sin ella no hace nada. Si una foto falla, sigue con las demás.

import Anthropic from "@anthropic-ai/sdk";
import sharp from "sharp";

const MODEL = "claude-opus-5-5";
const HI_W = 1600; // ancho de la imagen grande de cada página (convert.mjs)

const LANG_NAME = { es: "español", en: "English", pt: "português" };
const TITLE = { es: "Fotografía", en: "Photograph", pt: "Fotografia" };

const SYSTEM = `Escribes texto alternativo para fotos de publicaciones institucionales (reportes de políticas públicas, tecnología y medio ambiente) que se leen en un visor accesible.
Describe lo que se ve, de forma objetiva y concreta: personas (sin suponer identidad, origen ni emociones que no sean evidentes), lugar, acción y detalles relevantes para entender la página.
Una o dos frases, máximo 220 caracteres. Sin empezar con «Imagen de», «Foto de» ni similares. Sin comillas ni markdown.
Si la imagen es un gráfico, diagrama, logotipo o texto, di qué es y su idea principal en pocas palabras.
Responde solo con la descripción, en el idioma que se indique.`;

/**
 * @param {object} manifest  manifest del lector (se modifica)
 * @param {Map<string, Buffer>} files  imágenes de las páginas (src → webp)
 * @param {{ lang: string, pending: { page: number, rect: number[] }[], max?: number, log?: (m: string) => void }} opts
 */
export async function describePhotos(manifest, files, opts) {
  const log = opts.log || (() => {});
  if (!process.env.ANTHROPIC_API_KEY) {
    if (opts.pending.length) log(`  Fotos sin pie: ${opts.pending.length} (sin ANTHROPIC_API_KEY no se describen)`);
    return { described: 0, failed: 0 };
  }
  const client = new Anthropic();
  const lang = LANG_NAME[opts.lang] ? opts.lang : "es";
  const [refW] = manifest.ref;
  const k = HI_W / refW;
  const todo = opts.pending.slice(0, opts.max ?? 40);
  let described = 0, failed = 0;

  for (const [n, { page: pi, rect }] of todo.entries()) {
    log(`  Describiendo foto ${n + 1} de ${todo.length}…`);
    const page = manifest.pages[pi];
    const buf = page?.src && files.get(page.src);
    if (!buf) continue;
    try {
      const meta = await sharp(buf).metadata();
      const left = Math.max(0, Math.floor(rect[0] * k)), top = Math.max(0, Math.floor(rect[1] * k));
      const width = Math.min(meta.width - left, Math.ceil((rect[2] - rect[0]) * k));
      const height = Math.min(meta.height - top, Math.ceil((rect[3] - rect[1]) * k));
      if (width < 32 || height < 32) continue;
      const jpg = await sharp(buf)
        .extract({ left, top, width, height })
        .resize({ width: 1024, height: 1024, fit: "inside", withoutEnlargement: true })
        .jpeg({ quality: 82 })
        .toBuffer();

      const context = [`Publicación: «${manifest.title}».`, page.label ? `Sección: «${page.label}».` : "", page.head ? `Título de la página: «${page.head}».` : ""]
        .filter(Boolean)
        .join(" ");
      const response = await client.beta.messages.create({
        model: MODEL,
        max_tokens: 2000,
        output_config: { effort: "low" },
        // Si un filtro de seguridad rechaza la petición, la API la reintenta con otro modelo.
        betas: ["server-side-fallback-2026-07-01"],
        fallbacks: "default",
        system: SYSTEM,
        messages: [
          {
            role: "user",
            content: [
              { type: "image", source: { type: "base64", media_type: "image/jpeg", data: jpg.toString("base64") } },
              { type: "text", text: `${context}\nDescribe esta foto en ${LANG_NAME[lang]}.` },
            ],
          },
        ],
      });
      if (response.stop_reason === "refusal") {
        failed++;
        continue;
      }
      const text = response.content
        .filter((b) => b.type === "text")
        .map((b) => b.text)
        .join(" ")
        .replace(/\s+/g, " ")
        .trim();
      if (!text) {
        failed++;
        continue;
      }
      page.hs.push({
        kind: "photo",
        zone: rect.map(Math.round),
        dot: [Math.round((rect[0] + rect[2]) / 2), Math.round((rect[1] + rect[3]) / 2)],
        title: TITLE[lang],
        text,
        ai: true,
      });
      page.alt = page.alt ? `${page.alt} ${text}` : text;
      described++;
    } catch (e) {
      failed++;
      if (e instanceof Anthropic.AuthenticationError) {
        log("  ANTHROPIC_API_KEY no es válida: se omiten las descripciones.");
        break;
      }
      if (e instanceof Anthropic.APIError) log(`  La foto ${n + 1} no se pudo describir (${e.status}).`);
      else log(`  La foto ${n + 1} no se pudo describir: ${e?.message ?? e}`);
    }
  }
  if (opts.pending.length > todo.length) log(`  Se describieron ${todo.length} de ${opts.pending.length} fotos (límite por publicación).`);
  return { described, failed };
}
