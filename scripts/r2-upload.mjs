#!/usr/bin/env node
// Sube archivos de /public a Cloudflare R2 conservando su ruta (public/a/b.jpg → a/b.jpg),
// que es lo que espera src/lib/assets.ts. Sin dependencias: firma AWS SigV4 propia.
//
// Uso (desde la raíz del repo; lee .env.local; ver docs/r2-assets.md):
//   npm run r2:upload                       # simulación: no escribe nada
//   npm run r2:upload -- --upload           # sube nuevos y cambiados
//   npm run r2:upload -- --check-public     # prueba las URL públicas
//   npm run r2:upload -- --self-test        # prueba la firma, sin red
// (equivale a `node --env-file-if-exists=.env.local scripts/r2-upload.mjs …`; Node 22.9+)
//
// Carpetas: por defecto platforms/aiforbiodiversity/initiative-tech4nature. Puedes pasar otras
// rutas relativas a /public como argumentos (p. ej. `team`).
//
// Opciones:
//   --upload         escribe en el bucket (sin esto solo informa)
//   --force          vuelve a subir aunque el archivo ya exista igual en R2
//   --check-public   hace HEAD a ${NEXT_PUBLIC_ASSETS_URL}/<ruta> de cada archivo
//   --concurrency=N  subidas en paralelo (4 por defecto)
//
// Variables (.env.local): R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET,
// R2_CACHE_CONTROL (opcional), NEXT_PUBLIC_ASSETS_URL (para --check-public).
// Nunca borra objetos del bucket.

import { createHash, createHmac } from "node:crypto";
import { readdir, readFile, stat } from "node:fs/promises";
import { join, relative, sep, extname, resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const PUBLIC_DIR = join(ROOT, "public");
const DEFAULT_PREFIXES = ["platforms/aiforbiodiversity/initiative-tech4nature"];
const DEFAULT_CACHE = "public, max-age=31536000, immutable";

const CONTENT_TYPES = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".avif": "image/avif",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".mp4": "video/mp4",
  ".webm": "video/webm",
  ".mov": "video/quicktime",
  ".vtt": "text/vtt; charset=utf-8",
  ".pdf": "application/pdf",
  ".xlsx": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  ".docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ".pptx": "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  ".csv": "text/csv; charset=utf-8",
  ".json": "application/json",
  ".txt": "text/plain; charset=utf-8",
  ".woff2": "font/woff2",
  ".woff": "font/woff",
  ".otf": "font/otf",
};

// ---------------------------------------------------------------------------
// Firma AWS Signature Version 4 (la que acepta la API S3 de R2, región "auto")

const sha256 = (data) => createHash("sha256").update(data).digest("hex");
const hmac = (key, data) => createHmac("sha256", key).update(data).digest();

/** Codifica una ruta S3: cada segmento en RFC 3986, conservando las "/". */
export function encodeKey(key) {
  return key
    .split("/")
    .map((s) => encodeURIComponent(s).replace(/[!'()*]/g, (c) => `%${c.charCodeAt(0).toString(16).toUpperCase()}`))
    .join("/");
}

/**
 * Devuelve el header Authorization. `path` ya codificado; `headers` en minúsculas e
 * incluye todos los que se firman (host, x-amz-date, x-amz-content-sha256…).
 */
export function signV4({ method, path, query = "", headers, payloadHash, accessKeyId, secretAccessKey, region, service }) {
  const amzDate = headers["x-amz-date"];
  const day = amzDate.slice(0, 8);
  const names = Object.keys(headers).map((h) => h.toLowerCase()).sort();
  const canonicalHeaders = names.map((h) => `${h}:${String(headers[h]).trim().replace(/\s+/g, " ")}\n`).join("");
  const signedHeaders = names.join(";");
  const canonicalRequest = [method, path, query, canonicalHeaders, signedHeaders, payloadHash].join("\n");
  const scope = `${day}/${region}/${service}/aws4_request`;
  const stringToSign = ["AWS4-HMAC-SHA256", amzDate, scope, sha256(canonicalRequest)].join("\n");
  const kDate = hmac(`AWS4${secretAccessKey}`, day);
  const kSigning = hmac(hmac(hmac(kDate, region), service), "aws4_request");
  const signature = createHmac("sha256", kSigning).update(stringToSign).digest("hex");
  return `AWS4-HMAC-SHA256 Credential=${accessKeyId}/${scope}, SignedHeaders=${signedHeaders}, Signature=${signature}`;
}

function selfTest() {
  const EMPTY = sha256("");
  const cases = [
    {
      name: "AWS SigV4 test suite: get-vanilla",
      args: {
        method: "GET",
        path: "/",
        headers: { host: "example.amazonaws.com", "x-amz-date": "20150830T123600Z" },
        payloadHash: EMPTY,
        accessKeyId: "AKIDEXAMPLE",
        secretAccessKey: "wJalrXUtnFEMI/K7MDENG+bPxRfiCYEXAMPLEKEY",
        region: "us-east-1",
        service: "service",
      },
      signature: "5fa00fa31553b73ebf1942676e86291e8372ff2a2260956d9b8aae1d763fbf31",
    },
    {
      name: "Amazon S3 docs: GET Object",
      args: {
        method: "GET",
        path: "/test.txt",
        headers: {
          host: "examplebucket.s3.amazonaws.com",
          range: "bytes=0-9",
          "x-amz-content-sha256": EMPTY,
          "x-amz-date": "20130524T000000Z",
        },
        payloadHash: EMPTY,
        accessKeyId: "AKIAIOSFODNN7EXAMPLE",
        secretAccessKey: "wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY",
        region: "us-east-1",
        service: "s3",
      },
      signature: "f0e8bdb87c964420e857bd35b5d6ed310bd44f0170aba48dd91039c6036bdb41",
    },
  ];
  let ok = true;
  for (const c of cases) {
    const got = signV4(c.args).split("Signature=")[1];
    const pass = got === c.signature;
    ok &&= pass;
    console.log(`${pass ? "OK   " : "FALLA"} ${c.name}${pass ? "" : `\n      esperado ${c.signature}\n      obtenido ${got}`}`);
  }
  const enc = encodeKey("team/Angel Escalante (1)!.png");
  const encOk = enc === "team/Angel%20Escalante%20%281%29%21.png";
  ok &&= encOk;
  console.log(`${encOk ? "OK   " : "FALLA"} codificación de rutas: ${enc}`);
  process.exit(ok ? 0 : 1);
}

// ---------------------------------------------------------------------------
// Cliente R2 mínimo

function r2Config() {
  const env = (k) => (process.env[k] ?? "").trim();
  const cfg = {
    accountId: env("R2_ACCOUNT_ID"),
    accessKeyId: env("R2_ACCESS_KEY_ID"),
    secretAccessKey: env("R2_SECRET_ACCESS_KEY"),
    bucket: env("R2_BUCKET"),
    cacheControl: env("R2_CACHE_CONTROL") || DEFAULT_CACHE,
  };
  const missing = ["R2_ACCOUNT_ID", "R2_ACCESS_KEY_ID", "R2_SECRET_ACCESS_KEY", "R2_BUCKET"].filter((k) => !env(k));
  return { cfg, missing };
}

async function r2Request(cfg, method, key, { body, headers: extra = {} } = {}) {
  const host = `${cfg.accountId}.r2.cloudflarestorage.com`;
  const path = `/${encodeURIComponent(cfg.bucket)}/${encodeKey(key)}`;
  const payloadHash = body ? sha256(body) : sha256("");
  const amzDate = new Date().toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
  const headers = { host, "x-amz-date": amzDate, "x-amz-content-sha256": payloadHash, ...extra };
  const authorization = signV4({
    method,
    path,
    headers,
    payloadHash,
    accessKeyId: cfg.accessKeyId,
    secretAccessKey: cfg.secretAccessKey,
    region: "auto",
    service: "s3",
  });
  // fetch pone el Host por su cuenta (y no deja fijarlo); el valor firmado es el mismo.
  const sendHeaders = { ...headers };
  delete sendHeaders.host;
  for (let attempt = 1; ; attempt++) {
    try {
      const res = await fetch(`https://${host}${path}`, { method, headers: { ...sendHeaders, authorization }, body });
      if (res.status >= 500 && attempt < 3) throw new Error(`HTTP ${res.status}`);
      return res;
    } catch (err) {
      if (attempt >= 3) throw err;
      await new Promise((r) => setTimeout(r, 500 * attempt));
    }
  }
}

// ---------------------------------------------------------------------------

async function walk(dir) {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    if (entry.name.startsWith(".") || entry.name === "Thumbs.db" || entry.name === "desktop.ini") continue;
    const full = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await walk(full)));
    else if (entry.isFile()) out.push(full);
  }
  return out;
}

const mb = (n) => `${(n / 1048576).toFixed(2)} MB`;

async function pool(items, size, fn) {
  let i = 0;
  await Promise.all(Array.from({ length: Math.min(size, items.length) }, async () => {
    while (i < items.length) await fn(items[i++]);
  }));
}

async function main() {
  const args = process.argv.slice(2);
  if (args.includes("--self-test")) return selfTest();
  const upload = args.includes("--upload");
  const force = args.includes("--force");
  const checkPublic = args.includes("--check-public");
  const concurrency = Number(args.find((a) => a.startsWith("--concurrency="))?.split("=")[1]) || 4;
  const prefixes = args.filter((a) => !a.startsWith("--")).map((p) => p.replace(/^\/+|\/+$/g, ""));

  const files = [];
  for (const prefix of prefixes.length ? prefixes : DEFAULT_PREFIXES) {
    const dir = join(PUBLIC_DIR, prefix);
    const info = await stat(dir).catch(() => null);
    if (!info?.isDirectory()) {
      console.error(`No existe la carpeta public/${prefix}`);
      process.exit(1);
    }
    for (const full of await walk(dir)) {
      const key = relative(PUBLIC_DIR, full).split(sep).join("/");
      const ext = extname(full).toLowerCase();
      files.push({ full, key, size: (await stat(full)).size, type: CONTENT_TYPES[ext] ?? "application/octet-stream" });
    }
  }
  files.sort((a, b) => a.key.localeCompare(b.key));
  const total = files.reduce((n, f) => n + f.size, 0);
  console.log(`${files.length} archivos, ${mb(total)} en ${(prefixes.length ? prefixes : DEFAULT_PREFIXES).map((p) => `public/${p}`).join(", ")}`);
  const unknown = files.filter((f) => f.type === "application/octet-stream");
  if (unknown.length) console.log(`Aviso: tipo desconocido (se subirán como octet-stream):\n  ${unknown.map((f) => f.key).join("\n  ")}`);

  if (checkPublic) {
    const base = (process.env.NEXT_PUBLIC_ASSETS_URL ?? "").trim().replace(/\/+$/, "");
    if (!base) {
      console.error("Falta NEXT_PUBLIC_ASSETS_URL en .env.local");
      process.exit(1);
    }
    const bad = [];
    await pool(files, 8, async (f) => {
      const res = await fetch(`${base}/${encodeKey(f.key)}`, { method: "HEAD" }).catch((e) => ({ status: e.message, headers: new Headers() }));
      const type = res.headers.get("content-type") ?? "";
      if (res.status !== 200 || !type.startsWith(f.type.split(";")[0])) bad.push(`${res.status} ${type || "-"}  ${f.key}`);
    });
    console.log(bad.length ? `Con problemas (${bad.length}):\n  ${bad.join("\n  ")}` : `Las ${files.length} URL públicas responden 200 con el tipo correcto en ${base}`);
    process.exit(bad.length ? 1 : 0);
  }

  const { cfg, missing } = r2Config();
  if (missing.length) {
    if (upload) {
      console.error(`Faltan variables para subir: ${missing.join(", ")} (ver .env.example)`);
      process.exit(1);
    }
    console.log(`\nSimulación sin credenciales (faltan ${missing.join(", ")}): se subirían todos.`);
    for (const f of files) console.log(`  ${mb(f.size).padStart(9)}  ${f.type.padEnd(28)} ${f.key}`);
    return;
  }

  console.log(`Bucket: ${cfg.bucket} · Cache-Control: ${cfg.cacheControl}${upload ? "" : " · SIMULACIÓN (añade --upload para escribir)"}\n`);
  const summary = { nuevo: 0, cambiado: 0, igual: 0, subido: 0, error: 0 };
  let bytes = 0;
  await pool(files, concurrency, async (f) => {
    const body = await readFile(f.full);
    const md5 = createHash("md5").update(body).digest();
    let state = "nuevo";
    // identity: sin esto, para tipos de texto (SVG) R2 responde con el ETag de la versión comprimida.
    const head = await r2Request(cfg, "HEAD", f.key, { headers: { "accept-encoding": "identity" } });
    const etag = head.headers.get("etag")?.replace(/^W\//, "").replaceAll('"', "");
    if (head.status === 200) state = etag === md5.toString("hex") ? "igual" : "cambiado";
    else if (head.status === 403 || head.status === 401) throw new Error(`R2 rechazó las credenciales (HTTP ${head.status}). Revisa el token y R2_BUCKET.`);
    summary[state]++;
    if (state === "igual" && !force) return;
    if (!upload) return console.log(`  ${state.padEnd(8)} ${mb(f.size).padStart(9)}  ${f.key}`);
    const res = await r2Request(cfg, "PUT", f.key, {
      body,
      headers: { "content-type": f.type, "cache-control": cfg.cacheControl, "content-md5": md5.toString("base64") },
    });
    if (res.ok) {
      summary.subido++;
      bytes += f.size;
      console.log(`  subido   ${mb(f.size).padStart(9)}  ${f.key}`);
    } else {
      summary.error++;
      console.log(`  ERROR ${res.status} ${f.key}\n    ${(await res.text()).slice(0, 300)}`);
    }
  });

  console.log(`\nNuevos ${summary.nuevo} · cambiados ${summary.cambiado} · iguales ${summary.igual}` +
    (upload ? ` · subidos ${summary.subido} (${mb(bytes)}) · errores ${summary.error}` : ""));
  if (upload && process.env.NEXT_PUBLIC_ASSETS_URL) {
    console.log(`Comprueba las URL públicas con: node --env-file=.env.local scripts/r2-upload.mjs --check-public`);
  }
  if (summary.error) process.exit(1);
}

main().catch((err) => {
  console.error(err.message ?? err);
  process.exit(1);
});
