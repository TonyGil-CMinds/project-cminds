# Medios en Cloudflare R2

Guía para crear el bucket de R2 de www.cminds.co, subir los medios y conectarlos al sitio.
Empieza por el toolkit Tech4Nature, pero el mismo mecanismo sirve para cualquier página.

Última revisión: 5 de noviembre de 2026.

## Cómo funciona

- `NEXT_PUBLIC_ASSETS_URL` es la URL pública del bucket, por ejemplo `https://assets.naturatech.org`.
- En el bucket, cada archivo conserva la ruta que tiene en `/public`:
  `public/platforms/x/foto.jpg` se sirve en `${NEXT_PUBLIC_ASSETS_URL}/platforms/x/foto.jpg`.
- El código no escribe rutas de medios a mano. Usa `asset("/platforms/x/foto.jpg")` de
  [src/lib/assets.ts](../src/lib/assets.ts).
  - Si la variable está vacía, devuelve la ruta local y todo sale de `/public`, como siempre.
  - Si tiene valor, antepone la URL de R2.
- [next.config.ts](../next.config.ts) añade el host de esa variable a `images.remotePatterns`, así
  `next/image` sigue optimizando las fotos. También permite `media-src https:` en la CSP.
- Las variables `NEXT_PUBLIC_*` se fijan al compilar. Cambiar la variable no afecta a un deploy
  ya hecho: hay que volver a desplegar.
- Los archivos siguen también en `/public`. No los borres hasta confirmar que producción carga
  todo desde R2. Además, la insignia del toolkit usa la copia local de respaldo si R2 falla.

Qué usa ya `asset()`: todos los medios del toolkit en
`src/app/[locale]/toolkits/tech4nature-mexico-conservacion-ia-v01/` (`data.ts`, `data.en.ts`,
`t4n.ts`, `t4n.en.ts`), es decir, todo lo que cuelga de
`/platforms/aiforbiodiversity/initiative-tech4nature/`. Son 109 archivos, unos 29 MB: fotos de
campo y de equipo en WebP, logos, el manual PDF, las plantillas `.xlsx` y los dos videos. Se
subieron al bucket `cminds-media` el 5 nov 2026.

Qué sigue fuera:

- Las fotos de `/team/*.png` y los logos generales del sitio, que se usan en otras páginas.
- Las 14 fotos de equipo que cargan desde `static.wixstatic.com`, vía la función `wix()` en
  `t4n.ts` y `t4n.en.ts`. Se romperán si se da de baja el sitio de Wix: conviene descargarlas
  a `public/platforms/aiforbiodiversity/initiative-tech4nature/toolkit/equipo/` y subirlas
  con el script.

## 1. Elegir el dominio público (decisión previa)

R2 solo puede servir un bucket en un dominio propio si ese dominio es una zona DNS en
**la misma cuenta de Cloudflare** que el bucket. La situación hoy:

| Dominio | DNS | ¿Se puede usar directo? |
|---|---|---|
| `cminds.co` | Wix (`ns12/ns13.wixdns.net`) | No. Primero habría que mover el DNS a Cloudflare. |
| `naturatech.org` | Cloudflare | Sí, si está en la misma cuenta que el bucket. |
| `pub-xxxx.r2.dev` | Cloudflare | Sí, pero solo para pruebas: tiene límite de tráfico y no usa la caché de Cloudflare. |

Opciones:

1. **Recomendada para empezar: `assets.naturatech.org`** (o `media.naturatech.org`). No toca
   nada del dominio principal. Antes, confirma en el panel de Cloudflare que `naturatech.org`
   está en la misma cuenta donde crearás el bucket.
2. **`assets.cminds.co`**, si se quiere la marca en las URL. Pasos:
   - Mover los nameservers de `cminds.co` de Wix a Cloudflare (plan gratis).
   - Antes, copiar **todos** los registros DNS actuales: MX y TXT del correo (SPF, DKIM,
     DMARC), los registros que apuntan a Vercel y las verificaciones.

   Un error aquí corta el correo o el sitio, así que es una tarea aparte, planificada y con
   respaldo. La configuración parcial por CNAME, que mantiene el DNS en Wix, requiere un plan
   de pago de Cloudflare.
3. **Solo `r2.dev`**: sirve para probar hoy mismo, como hace `project-june`. No es apto para
   producción.

Puedes empezar con r2.dev para validar y pasar después a un dominio propio. Basta con cambiar
`NEXT_PUBLIC_ASSETS_URL` y volver a desplegar: las rutas son las mismas.

## 2. Crear el bucket

En el [panel de Cloudflare](https://dash.cloudflare.com), entra a **R2 Object Storage** y luego
a **Create bucket**. Si es la primera vez, R2 pide activar el servicio con un método de pago.

- **Nombre:** `cminds-media` (el que se creó). Usa un bucket propio del sitio, separado del de project-june,
  para que el token y los permisos no se mezclen.
- **Location:** Automatic.
- **Default storage class:** Standard.

## 3. Hacerlo público

Ve a **Bucket → Settings → Public access**:

- **Dominio propio:** en **Custom Domains**, elige **Connect Domain**, escribe por ejemplo
  `assets.naturatech.org` y confirma el registro DNS que se crea solo. Espera a que el estado
  pase de *Initializing* a *Active* (unos minutos).
- **Solo pruebas:** en **R2.dev subdomain**, elige **Allow** y copia la URL `https://pub-….r2.dev`.

Esa URL, sin barra final, es el valor de `NEXT_PUBLIC_ASSETS_URL`.

## 4. CORS

Las imágenes y videos se cargan sin CORS. Hace falta solo para lo que el navegador lee con
`fetch()`, que hoy es el logo con el que se genera la insignia descargable.

Ve a **Bucket → Settings → CORS Policy → Add/Edit** y pega:

```json
[
  {
    "AllowedOrigins": [
      "https://www.cminds.co",
      "https://cminds.co",
      "https://*.vercel.app",
      "http://localhost:3000"
    ],
    "AllowedMethods": ["GET", "HEAD"],
    "AllowedHeaders": ["*"],
    "MaxAgeSeconds": 3600
  }
]
```

R2 acepta un solo `*` por origen. `https://*.vercel.app` cubre los previews de Vercel.

## 5. Token de API (solo para subir)

Ve a **R2 → Manage R2 API Tokens → Create API token**:

- **Permissions:** Object Read & Write.
- **Specify bucket(s):** solo `cminds-media`.
- **TTL:** el que prefieras. Si caduca, se genera otro.

Al crearlo, Cloudflare muestra **una sola vez** el *Access Key ID* y el *Secret Access Key*.
Guárdalos en el gestor de contraseñas del equipo. El *Account ID* aparece en la misma pantalla,
dentro del endpoint `https://<ACCOUNT_ID>.r2.cloudflarestorage.com`, y en la barra lateral del
panel.

Este token **no va en Vercel**: el sitio solo lee URL públicas. Solo lo necesita quien sube
archivos, y solo en su `.env.local`.

## 6. Configurar `.env.local`

```bash
cp .env.example .env.local
```

Rellena estas variables:

```bash
NEXT_PUBLIC_ASSETS_URL=https://assets.naturatech.org   # o la URL r2.dev
R2_ACCOUNT_ID=…
R2_ACCESS_KEY_ID=…
R2_SECRET_ACCESS_KEY=…
R2_BUCKET=cminds-media
```

## 7. Subir los archivos

El script [scripts/r2-upload.mjs](../scripts/r2-upload.mjs) no tiene dependencias. Por defecto
sube `public/platforms/aiforbiodiversity/initiative-tech4nature/` y **nunca borra** nada del
bucket.

```bash
npm run r2:upload -- --self-test    # comprueba la firma (sin red)
npm run r2:upload                   # simulación: qué es nuevo, qué cambió, qué ya está igual
npm run r2:upload -- --upload       # sube solo lo nuevo o cambiado
npm run r2:upload -- --check-public # pide cada archivo por su URL pública: 200 y tipo correcto
```

Otros usos:

- **Otras carpetas:** pásalas como argumento, relativas a `/public`, por ejemplo
  `npm run r2:upload -- team --upload`.
- **Volver a subir todo:** añade `--force`.

Cada objeto se sube con su `Content-Type` y `Cache-Control: public, max-age=31536000, immutable`.
Por eso, **para reemplazar una foto, súbela con otro nombre** (por ejemplo `-v2.jpg`) y cambia
la ruta en el código; si no, navegadores y CDN pueden seguir mostrando la vieja hasta un año.
Si de verdad hay que sobrescribir un archivo:

- Sube con `R2_CACHE_CONTROL="public, max-age=3600"`.
- Con dominio propio, purga la URL en **Caching → Purge Cache**.

### Fotos nuevas: conviértelas a WebP antes de subir

```bash
npm run images:webp -- public/platforms/.../carpeta-o-foto.jpg            # crea .webp junto al original
npm run images:webp -- public/platforms/.../carpeta --replace             # y borra los originales
```

El script usa sharp, que ya viene con Next, y no reduce las dimensiones salvo que pases
`--max-width=1600`. Para fotos usa calidad 80; si así el WebP no pesa menos que el JPG (pasa
con fotos de cámara trampa, que tienen mucho ruido), baja la calidad hasta un mínimo de 70.
Los logos con transparencia los guarda con la opción más ligera, con o sin pérdida.

Después:

1. Cambia la ruta en el código de `.jpg`/`.png` a `.webp`.
2. Revisa la página.
3. Sube con `npm run r2:upload -- --upload`.

No conviertas la imagen que se usa para compartir en redes (`og:image`, en el toolkit
`tech4nature-hero.png`), porque algunas redes no muestran WebP en la vista previa. Tampoco hace
falta convertir lo que se muestra con `next/image`: Vercel ya la sirve en WebP o AVIF.

Resultado en el toolkit Tech4Nature (5 nov 2026):

- **Fotos y logos de socios:** 71 archivos, de 12.5 MB a 9.4 MB (−24 %). Ya eran JPG comprimidos.
- **Ilustraciones de la sección de impacto:** 3 PNG, de 1 MB a 165 KB (−84 %). Se conservan
  los PNG porque la portada de Tech4Nature los usa.

## 8. Probar en local

1. Con `NEXT_PUBLIC_ASSETS_URL` en `.env.local`, reinicia `npm run dev`. La variable se lee al
   arrancar.
2. Abre `/es/toolkits/tech4nature-mexico-conservacion-ia-v01` y, en DevTools → Network, filtra
   por el dominio de R2.
3. Recorre las páginas: galería, equipo, videos, Lista Verde (PDF y Excel) e insignia (descarga
   la imagen).
4. Si algo falla, borra la variable, reinicia y vuelves a `/public`.

Prueba hecha el 5 nov 2026 contra el bucket real `cminds-media`, vía `r2.dev`:

- **URL públicas:** las 109 responden 200, con su `Content-Type` y la caché de un año.
- **Páginas:** las 24 del toolkit (ES y EN) cargan desde R2 las imágenes WebP, los logos SVG,
  los 2 videos y las descargas, sin imágenes rotas.
- **Insignia:** se descarga bien. Sin CORS configurado, usa el logo local de respaldo y deja
  un aviso en la consola; con el CORS del paso 4, lee el de R2.

## 9. Producción (requiere aprobación del dueño)

1. En Vercel, entra a **project-cminds → Settings → Environment Variables** y agrega
   `NEXT_PUBLIC_ASSETS_URL` en **Production** y **Preview**. Las credenciales `R2_*` no se
   agregan.
2. Vuelve a desplegar. Un deploy viejo no toma la variable nueva.
3. Verifica:
   - El código fuente de la página muestra las URL de R2.
   - `/_next/image?url=https%3A%2F%2Fassets…` responde 200.
   - Videos, PDF, Excel e insignia funcionan.
   - Los metadatos `og:image` apuntan a una URL absoluta que abre.
4. Solo después, y si se quiere aligerar el repo, se pueden quitar archivos de `/public`. Antes
   hay que revisar que ninguna otra página los use sin `asset()`. Por ejemplo, la portada de
   Tech4Nature usa la misma carpeta con rutas directas.

## Costos

R2 no cobra por tráfico de salida. El plan gratis incluye 10 GB-mes de almacenamiento,
1 millón de operaciones de escritura y 10 millones de lectura al mes. Los ~29 MB del toolkit
quedan muy por debajo. Las fotos que pasan por `next/image` siguen contando en el uso de
optimización de imágenes de Vercel, igual que hoy.

## Problemas comunes

- **`next/image` dice "hostname is not configured":** la variable no estaba al compilar o al
  arrancar `npm run dev`. Reinicia o vuelve a desplegar.
- **La insignia no se descarga desde un dominio nuevo:** agrega ese origen a la política CORS
  (paso 4).
- **El script dice "R2 rechazó las credenciales":** revisa que el token tenga *Object Read &
  Write* sobre ese bucket y que `R2_BUCKET` sea el nombre exacto.
- **Un archivo nuevo no aparece:** ¿está dentro de la carpeta que subiste? Ejecuta la
  simulación para verlo en la lista.

Referencias:

- [Buckets públicos y dominios propios](https://developers.cloudflare.com/r2/buckets/public-buckets/)
- [CORS en R2](https://developers.cloudflare.com/r2/buckets/cors/)
- [Límites](https://developers.cloudflare.com/r2/platform/limits/)
