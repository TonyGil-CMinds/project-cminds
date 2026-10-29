/**
 * Contenido del toolkit «Crea tu propio Tech4Nature», versión 0.2 (octubre de 2026).
 * Fuente: Tech4Nature_Mexico_Toolkit_Conservacion_IA_v02.docx. La nota interna
 * para el equipo editorial y web de ese documento no se publica.
 *
 * La ruta conserva el segmento «-v01» para no romper enlaces ya compartidos.
 *
 * En los textos:
 * - [E1] … [E5] enlazan a una etapa, [P1] … [P4] a una plantilla y [R01] … a
 *   una ficha de la caja de herramientas (ver `Rich` en _components/rich.tsx).
 * - [texto](https://…) es un enlace externo.
 * Las imágenes viven en `IMAGES`: cambiarlas ahí actualiza todo el toolkit.
 */

export const TOOLKIT_SLUG = "tech4nature-mexico-conservacion-ia-v01";
export const TOOLKIT_PATH = `/toolkits/${TOOLKIT_SLUG}`;
export const TOOLKIT_VERSION = "0.2";
export const TOOLKIT_DATE = "2026-10";
export const TOOLKIT_DATE_LABEL = "Octubre de 2026";
/** Clave del avance guardado en el navegador; cambia con la estructura de etapas. */
export const STORAGE_KEY = "tk-t4n-v02";

const T4N = "/platforms/aiforbiodiversity/initiative-tech4nature";
const unsplash = (id: string, w = 1200) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=70`;

/** Imágenes de referencia: activos locales del proyecto y placeholders públicos de Unsplash. */
export const IMAGES = {
  hero: { src: `${T4N}/tech4nature-hero.png`, alt: "Equipo de campo de Tech4Nature México caminando por la selva de Yucatán" },
  jaguar: { src: `${T4N}/theimpact-jaguar.png`, alt: "Jaguar descansando en la copa de un árbol" },
  algorithm: { src: `${T4N}/theimpact-algorithm.png`, alt: "Código de un modelo de inteligencia artificial en una pantalla" },
  platform: { src: `${T4N}/theimpact-platform.png`, alt: "Líderes de conservación revisando registros en una computadora" },
  bioscanner: { src: `${T4N}/bioscanner.png`, alt: "Logotipo de BioScanner" },
  logo: { src: `${T4N}/logo-tech4nature.svg`, alt: "Tech4Nature México" },
  afbLogo: { src: "/platforms/aiforbiodiversity/logo-aiforclimate.svg", alt: "AI for Climate & Biodiversity" },
  people: { src: unsplash("1522202176988-66273c2fd55f"), alt: "Personas colaborando alrededor de una mesa con computadoras" },
  forestPath: { src: unsplash("1441974231531-c6227db76b6e"), alt: "Sendero en un bosque iluminado por el sol" },
  kingfisher: { src: unsplash("1444464666168-49d633b86797"), alt: "Martín pescador posado en una rama" },
  earth: { src: unsplash("1446776811953-b23d57bd21aa"), alt: "La Tierra vista desde la órbita, con nubes sobre el océano" },
  feline: { src: unsplash("1456926631375-92c8ce872def"), alt: "Felino manchado descansando sobre un tronco" },
  dashboard: { src: unsplash("1551288049-bebda4e38f71"), alt: "Panel de análisis de datos en una pantalla" },
  map: { src: unsplash("1524661135-423995f22d0b"), alt: "Mapa mundial impreso" },
  mistyForest: { src: unsplash("1542273917363-3b1817f69a2d"), alt: "Bosque cubierto de niebla" },
  pineLight: { src: unsplash("1425913397330-cf8af2ff40a1"), alt: "Luz entre los troncos de un bosque" },
  turtle: { src: unsplash("1437622368342-7a3d73a34c8f"), alt: "Tortuga marina nadando en aguas abiertas" },
} as const;

export type Img = { src: string; alt: string };

export type Table = { caption?: string; head: string[]; rows: string[][] };

// ---------------------------------------------------------------------------
// Portada

export const HERO = {
  title: "Crea tu propio Tech4Nature",
  subtitle:
    "Toolkit para co-diseñar, implementar y sostener proyectos de conservación con inteligencia artificial en América Latina y el Caribe",
  eyebrow: "Aprendizajes de Tech4Nature México (2022–2026) y de otras iniciativas de la región",
};

export const INTRO = {
  paragraphs: [
    "Sí, si trabajas en un área protegida, en una comunidad, en un gobierno local, en una universidad o en una organización y quieres saber qué especies viven en tu territorio, cómo cambian y qué decisiones se pueden tomar con esa información. Para empezar necesitas una pregunta clara y aliados dispuestos a responderla contigo; el programador y el presupuesto grande pueden llegar después.",
    "Aquí encontrarás lo que aprendimos en cuatro años de trabajo en la Reserva Estatal de Dzilam, en Yucatán, junto con líderes comunitarios, el gobierno del estado, universidades y aliados tecnológicos. También encontrarás ejemplos de Colombia, Ecuador, Bolivia, Perú y otras zonas de Yucatán, porque cada territorio resuelve los mismos retos de forma distinta.",
  ],
  outcomes: [
    "Definir una pregunta de conservación que alguien necesita responder para tomar una decisión.",
    "Acordar con la comunidad y las instituciones quién decide sobre los datos y cómo se comparten.",
    "Instalar y operar cámaras trampa y dispositivos de monitoreo acústico con manuales en español.",
    "Usar BioScanner y otras herramientas gratuitas de IA para revisar miles de imágenes en días.",
    "Analizar cambios de cobertura con QGIS, Google Earth Engine y MapBiomas México.",
    "Llevar la evidencia a planes de manejo, procesos de política pública y estrategias de financiamiento.",
  ],
  howTo:
    "El toolkit tiene cinco etapas. Puedes leerlas en orden o ir directo a la que necesitas. Cada etapa sigue la misma estructura: para qué sirve, lo que hicimos en Dzilam, pasos clave, un aprendizaje, herramientas para empezar y un ejemplo de otra iniciativa de la región.",
};

// ---------------------------------------------------------------------------
// Rutas por público («Cómo recorrerlo»)

export type Audience = {
  id: string;
  title: string;
  /** Texto de «Empieza por». */
  short: string;
  /** Secuencia sugerida, en orden: códigos de etapa o slugs de página. */
  path: string[];
};

export const AUDIENCES: Audience[] = [
  {
    id: "territorio",
    title: "Líder comunitario o equipo de un área protegida",
    short: "Etapa 1 (acordar con el territorio) y Etapa 2 (salir a campo)",
    path: ["E1", "E2"],
  },
  {
    id: "autoridades",
    title: "Autoridad ambiental o gobierno local",
    short: "Etapa 1 y Etapa 5 (decidir y sostener)",
    path: ["E1", "E5"],
  },
  {
    id: "academia",
    title: "Universidad, estudiante o equipo científico",
    short: "Etapa 3 (analizar con IA) y Etapa 4 (leer el paisaje)",
    path: ["E3", "E4"],
  },
  {
    id: "aliados",
    title: "Aliado tecnológico o financiador",
    short: "Tech4Nature México en una mirada, Etapa 3 y Etapa 5",
    path: ["tech4nature-mexico", "E3", "E5"],
  },
];

// ---------------------------------------------------------------------------
// Por qué importa

export const WHY = {
  intro:
    "América Latina y el Caribe concentra una gran proporción de la biodiversidad del planeta y también registra las mayores caídas en las poblaciones. Al mismo tiempo, la región tiene una sólida tradición de conservación comunitaria y cada vez más herramientas abiertas para medir lo que ocurre en el territorio. La oportunidad está en juntar ambas cosas.",
  facts: [
    {
      figure: "−95 %",
      fact: "es el cambio promedio en las poblaciones de vertebrados monitoreadas de América Latina y el Caribe entre 1970 y 2022, el mayor de todas las regiones (Índice Planeta Vivo 2026, WWF y ZSL).",
      meaning:
        "Medir con método y continuidad permite saber si las acciones locales están funcionando. El índice describe un cambio promedio de tamaño poblacional; no equivale a especies extintas.",
    },
    {
      figure: "12 %",
      fact: "México alberga cerca del 12 % de las especies del mundo y ocupa el quinto lugar entre los 17 países megadiversos (CONANP).",
      meaning: "Hay mucho por documentar, y buena parte ocurre fuera de las bases de datos nacionales.",
    },
    {
      figure: "51 %",
      fact: "El jaguar está catalogado como Casi Amenazado por la UICN y ocupa alrededor del 51 % de su distribución histórica (Grupo de Especialistas en Felinos de la UICN). El tercer Censo Nacional del Jaguar estimó 5,326 jaguares en México con datos a 2024, 1,699 de ellos en la Península de Yucatán.",
      meaning:
        "El jaguar es una especie paraguas: necesita territorios amplios y conectados, así que monitorearlo ayuda a entender y proteger el paisaje completo.",
    },
    {
      figure: "70–95 %",
      fact: "Entre 70 % y 95 % de las fotos de cámaras trampa suelen salir vacías (MegaDetector, Microsoft). Una persona experta clasifica entre 300 y 1,000 imágenes por hora (Wildlife Insights).",
      meaning:
        "La IA permite descartar imágenes vacías y pre-clasificar especies en horas. El tiempo de las personas expertas se dedica entonces a validar e interpretar.",
    },
    {
      figure: "43 %",
      fact: "En América Latina y el Caribe, el 43 % de la población rural tiene conectividad significativa, frente al 79 % de la urbana (IICA y aliados, 2022).",
      meaning: "Diseña para trabajar sin conexión en campo y sincronizar después. Las herramientas de este toolkit lo permiten.",
    },
  ],
};

// ---------------------------------------------------------------------------
// Tech4Nature México en una mirada

export type Kpi = {
  label: string;
  /** Cifra animada; si falta, se muestra `text`. */
  value?: number;
  prefix?: string;
  suffix?: string;
  text?: string;
  note?: string;
};

export const CASE = {
  intro: [
    "Tech4Nature México nació en 2022 en la Reserva Estatal de Dzilam, en la costa norte de Yucatán, como parte de la alianza global Tech4Nature de la UICN y Huawei. Lo co-lideran C Minds, la Secretaría de Desarrollo Sustentable de Yucatán (SDS) y el Grupo Chac Mool, formado por líderes comunitarios de Dzilam de Bravo, con la colaboración de CONANP, la Universidad Autónoma de Yucatán, la Universidad Politécnica de Yucatán y Pronatura.",
    "La pregunta de partida fue sencilla: ¿cómo usar la tecnología para conocer mejor la fauna de la reserva y apoyar las decisiones de quienes la cuidan? Para responderla, el equipo combinó cámaras trampa, monitoreo acústico y modelos de IA para detectar especies e identificar jaguares de forma individual. De ese trabajo nació BioScanner, la plataforma que hoy reúne esas capacidades para que otros equipos puedan usarlas.",
  ],
  kpis: [
    { value: 147, label: "especies registradas en la fase 1, 40 de ellas en alguna categoría de riesgo" },
    { text: "20+ / 60", label: "cámaras trampa / grabadoras acústicas desplegadas en la fase 1" },
    { value: 93, suffix: " %", label: "precisión del modelo en la detección de jaguar" },
    { value: 333099, label: "archivos procesados en BioScanner a septiembre de 2026", note: "317,577 fotos y 15,522 videos" },
    { value: 16, label: "jaguares identificados de forma individual", note: "En proceso de verificación" },
    { value: 40, prefix: "~", suffix: " km", label: "entre dos registros del mismo jaguar, de Dzilam hacia Ría Lagartos" },
    { value: 104304, suffix: " ha", label: "superficie de la Reserva Estatal de Dzilam tras su ampliación", note: "Antes, 69,000 ha" },
    { text: "GLOMO 2026", label: "Premio GSMA GLOMO América Latina al Impacto Social, mayo de 2026" },
  ] satisfies Kpi[],
  timeline: [
    {
      range: "2022–2024 · Fase 1",
      text: "Instalación de cámaras trampa y dispositivos de monitoreo acústico con los líderes comunitarios, primeros modelos de IA para especies y jaguares, dos tableros de visualización y un programa piloto de formación local en gestión de proyectos de conservación con innovación.",
    },
    {
      range: "2024",
      text: "El Gobierno de Yucatán amplía la Reserva Estatal de Dzilam a 104,304 ha. La fundamentación del acuerdo incluye estudios de Tech4Nature México con cámaras trampa, registros de jaguar en zonas aledañas y la necesidad de reforzar la conectividad ecológica.",
    },
    {
      range: "Abril 2025 · Fase 2",
      text: "Lanzamiento en la Cumbre Tech4Nature en Mérida. Objetivos: distribución de la población de jaguar, apoyo a decisiones de manejo y trabajo hacia un corredor biológico.",
    },
    {
      range: "2025–2026",
      text: "BioScanner se consolida como plataforma, se construye el catálogo de jaguares, se estudia la conectividad con Ría Lagartos y se realizan autoevaluaciones para la Lista Verde de la UICN en Dzilam y Ría Lagartos.",
    },
  ],
  story: {
    quote: "El día que yo me muera me gustaría convertirme en jaguar",
    author: "Juan Castillo",
    paragraphs: [
      "Juan Castillo creció en una familia que vivía de la caza, la agricultura y la ganadería en lo que hoy es la Reserva de Dzilam, donde por mucho tiempo se vio al jaguar como una amenaza para el ganado.",
      "Con los años decidió retirar su ganado de la reserva y hoy es uno de los líderes comunitarios de Tech4Nature México y, junto con Benjamín Campos, cuida las cámaras trampa y los equipos acústicos y guía al equipo en el territorio.",
    ],
    closing: "La tecnología funcionó porque había personas del territorio dispuestas a usarla y a darle sentido.",
  },
};

// ---------------------------------------------------------------------------
// Las cinco etapas

export type Stage = {
  /** Id estable usado para guardar el avance. */
  id: string;
  /** E1 … E5 */
  code: string;
  n: number;
  title: string;
  /** Nombre corto para la barra lateral. */
  short: string;
  question: string;
  result: string;
  image: Img;
  purpose: string;
  dzilam: { title: string; paragraphs: string[] };
  steps: string[];
  learning: string;
  tools: string[];
  elsewhere: { place: string; text: string; link: { label: string; url: string } };
};

export const STAGES: Stage[] = [
  {
    id: "e1",
    code: "E1",
    n: 1,
    title: "Acordar con el territorio",
    short: "Acordar con el territorio",
    question: "¿Qué queremos saber, para qué y quién decide?",
    result: "Una pregunta, un grupo de aliados y un acuerdo de datos",
    image: IMAGES.people,
    purpose:
      "Antes de comprar equipo, conviene ponerse de acuerdo en qué se quiere saber y quién va a usar la respuesta. Un proyecto que arranca con una pregunta compartida entre comunidad, autoridad y academia tiene muchas más posibilidades de llegar a una decisión real.",
    dzilam: {
      title: "Lo que hicimos en Dzilam",
      paragraphs: [
        "La SDS participó desde el diseño, junto con el Grupo Chac Mool y C Minds. La pregunta sobre la presencia y el movimiento del jaguar respondía a una necesidad concreta de la autoridad estatal, que más adelante evaluaba la ampliación de la reserva. Los líderes comunitarios ayudaron a definir dónde instalar el equipo porque conocen los senderos y los sitios de paso de la fauna.",
      ],
    },
    steps: [
      "Escribe tu pregunta en una frase y nombra la decisión que ayudará a tomar. Por ejemplo: “¿El jaguar usa la zona entre dos reservas?” para informar un corredor biológico.",
      "Identifica a la institución o comunidad que tomará esa decisión e invítala desde el inicio.",
      "Reúne a quienes conocen el territorio, a quienes pueden revisar el diseño científico y a quienes darán soporte técnico.",
      "Acuerda por escrito quién es dueño de los datos, quién puede verlos, qué se publica y qué se protege. Las ubicaciones de especies sensibles se protegen siempre.",
      "Define cómo se reconocerá y remunerará el trabajo de las personas de la comunidad.",
      "Agenda desde ahora una reunión para devolver resultados al territorio.",
    ],
    learning:
      "En Dzilam, la alineación de objetivos entre el gobierno estatal, la comunidad y C Minds desde el diseño permitió que los datos se integraran a un proceso público. Cuando la autoridad participa desde el principio, la evidencia llega a tiempo para la decisión.",
    tools: [
      "[Principios CREA para la gobernanza de datos indígenas](https://www.gida-global.org/s/Principios-CREA.pdf) (versión en español de los principios CARE, GIDA).",
      "[Buenas prácticas para generalizar datos de especies sensibles](https://docs.gbif.org/sensitive-species-best-practices/master/es/buenas-practicas-para-generalizar-datos-de-especies-sensibles-en-registros-biologicos.es.pdf) (GBIF, español).",
      "[Recomendación sobre la Ética de la Inteligencia Artificial](https://digitallibrary.un.org/record/4062376/files/1416674-ES.pdf) (UNESCO, español).",
      "[AI for Environment and Ecosystems Toolkit](https://www.unesco.org/ethics-ai/en/ai-environment-ecosystems-toolkit) (UNESCO, inglés), para equipos de gobierno.",
      "Plantillas 1 y 2 de este toolkit: ficha de arranque y acuerdo de datos. [P1, P2]",
    ],
    elsewhere: {
      place: "Reserva Biocultural del Puuc, Yucatán",
      text: "Desde 2021, 43 personas de cuatro ejidos de Tekax operan 16 cámaras trampa en la zona de amortiguamiento de la reserva, con apoyo de la SDS, WWF, la Junta Intermunicipal Biocultural del Puuc, CONAFOR y PNUD. Han registrado 36 especies de mamíferos, aves y reptiles con una inversión de 96,000 pesos. El caso muestra que un proyecto pequeño, liderado por ejidatarios, puede generar información útil cuando hay compromiso local y alineación con la política de conservación del estado.",
      link: {
        label: "Ver caso (Regions4 y SDS)",
        url: "https://www.theclimategroup.org/sites/default/files/2024-01/MONITOREO-COMUNITARIO_YUCATAN_ES_CSD_0.pdf",
      },
    },
  },
  {
    id: "e2",
    code: "E2",
    n: 2,
    title: "Salir a campo",
    short: "Salir a campo",
    question: "¿Cómo recolectamos datos confiables?",
    result: "Cámaras y grabadoras instaladas con un registro de esfuerzo",
    image: IMAGES.forestPath,
    purpose:
      "La calidad de todo lo que viene después depende de cómo se instalan y registran los equipos. Un buen diseño de muestreo permite comparar sitios y temporadas; un registro ordenado permite que otras personas confíen en tus datos.",
    dzilam: {
      title: "Lo que hicimos en Dzilam",
      paragraphs: [
        "En la fase 1 se instalaron más de 20 cámaras trampa y 60 grabadoras acústicas en manglares y selva baja. El equipo Chac Mool se encargó de la instalación, el mantenimiento y la descarga de datos. Combinar imagen y sonido amplió los grupos de fauna registrados: las cámaras captan mamíferos medianos y grandes, y las grabadoras registran aves, anfibios e insectos. En la fase 2 se probaron tres formularios digitales para registrar actividades de campo.",
      ],
    },
    steps: [
      "Elige el método según tu pregunta: cámaras trampa para mamíferos y jaguar; grabadoras acústicas para aves, anfibios y murciélagos; ambos para un inventario amplio.",
      "Diseña la ubicación de las estaciones con apoyo de alguien con formación en ecología y con quienes conocen los senderos de la fauna.",
      "Para identificar jaguares de forma individual, instala cámaras en pares, una frente a otra, para fotografiar ambos costados del animal.",
      "Registra cada despliegue: código de estación, coordenadas, fechas de instalación y retiro, altura, configuración y fallas. Usa la plantilla 3. [P3]",
      "Guarda siempre los archivos originales y haz una copia de respaldo antes de procesar.",
      "Si no hay señal en campo, usa formularios que funcionen sin conexión y sincroniza al volver.",
    ],
    learning:
      "El conocimiento local sobre dónde se mueve la fauna fue tan valioso como el equipo. Cuando el equipo comunitario participa en el diseño, también se hace cargo del mantenimiento, y el monitoreo se sostiene entre campañas.",
    tools: [
      "[Manual de fototrampeo para estudio de fauna silvestre: el jaguar en México como estudio de caso](https://simec.conanp.gob.mx/Publicaciones2020/Publicaciones%20CONANP/Parte%203/Manuales/2013%20Manual%20fototrampeo%20jaguar.pdf) (Chávez y colaboradores, 2013).",
      "[Manual de fototrampeo: herramienta de investigación para la conservación de la biodiversidad en Colombia](http://hdl.handle.net/20.500.11761/31415) (Instituto Humboldt y Panthera, 2012).",
      "[BIOCOMUNI v2.0 Fauna](https://desarrollo.fmcn.org/wp-content/uploads/2025/06/BIOCOMUNI_v2.0_Fauna.pdf) (FMCN y CONAFOR), protocolo de monitoreo comunitario con formatos imprimibles.",
      "[Buenas prácticas para gestionar y publicar datos de cámaras trampa](https://docs.gbif.org/camera-trap-guide/es/) (GBIF, 2026, español).",
      "[Manual de configuración de AudioMoth](https://www.protocols.io/view/manual-de-configuraci-n-audiomoth-1-2-0-gu-a-de-8-cmvju64n.pdf) (Ciencia Ciudadana Perú, español), grabadora abierta de bajo costo.",
      "[KoboToolbox](https://www.kobotoolbox.org), formularios de campo gratuitos que funcionan sin conexión.",
      "[SMART](https://smartconservationtools.org), herramienta gratuita para registrar patrullajes y observaciones en áreas protegidas.",
    ],
    elsewhere: {
      place: "Alto Isoso, Bolivia",
      text: "Diez guardaparques comunitarios guaraníes monitorean el guanaco chaqueño en el Área de Vida Guajukaka (284,670 ha), en la Autonomía Indígena Guaraní Charagua Iyambae. Usan SMART sin conexión, cámaras trampa y muestras de heces para análisis de ADN. Fue el primer sitio de Bolivia en implementar SMART, y Fundación Natura Bolivia extiende el modelo a 24 áreas protegidas subnacionales. La operación cuesta alrededor de 2,500 dólares al mes, dato útil para planear presupuestos.",
      link: {
        label: "Ver caso (PANORAMA)",
        url: "https://panorama.solutions/en/solution/technology-roots-guarani-indigenous-guardians-safeguarding-guanaco-and-their-collective",
      },
    },
  },
  {
    id: "e3",
    code: "E3",
    n: 3,
    title: "Analizar con IA",
    short: "Analizar con IA",
    question: "¿Cómo convertimos miles de archivos en información?",
    result: "Especies y jaguares identificados y validados por personas",
    image: IMAGES.platform,
    purpose:
      "Una campaña de fototrampeo puede generar cientos de miles de archivos. La IA filtra las imágenes vacías, propone la especie y ayuda a reconocer individuos. Las personas validan cada resultado antes de usarlo, y esa revisión humana es parte del método.",
    dzilam: {
      title: "Lo que hicimos en Dzilam: BioScanner",
      paragraphs: [
        "BioScanner es una plataforma desarrollada por C Minds en el marco de Tech4Nature México, incubada con la UICN y Huawei y construida sobre Huawei Cloud. Detecta y clasifica especies en fotos y videos, identifica jaguares de forma individual por el patrón de sus manchas y genera reportes. Su interfaz está disponible en español, inglés, portugués y maya. A septiembre de 2026 había procesado 333,099 archivos de la reserva.",
        "BioScanner se diseñó para que equipos sin perfil técnico puedan usar IA. Se está construyendo en la dirección de que cada comunidad e institución decida sobre sus datos: quién los ve, qué se comparte y con quién.",
      ],
    },
    steps: [
      "Empieza con un lote pequeño, de una o dos estaciones, para conocer la herramienta.",
      "Sube los archivos con sus metadatos de estación y fecha, que son la base de cualquier análisis ecológico posterior.",
      "Deja que la IA descarte vacíos y proponga especies; asigna a una persona para validar las detecciones.",
      "Revisa con más cuidado las especies raras, las que se parecen entre sí y las que importan para tu decisión.",
      "Para jaguares, compara ambos costados y confirma cada nueva identidad con al menos dos personas.",
      "Exporta los resultados validados en un formato estándar, como Camtrap DP, para analizarlos o compartirlos.",
    ],
    learning:
      "La IA hizo posible trabajar con un archivo de más de 300,000 medios, y la revisión experta le dio confianza a los resultados. La participación de estudiantes en el desarrollo y la revisión de modelos formó además nuevas capacidades en la región.",
    tools: [
      "[BioScanner](https://app.bioscanner.io) (C Minds). Acceso con cuenta, actualmente en etapa de acceso anticipado. Presentación en [bioscanner.io/es](https://bioscanner.io/es).",
      "[Repositorio público de Tech4Nature México en GitHub](https://github.com/aiforclimate/tech4naturemexico), con el cuaderno del modelo de identificación de jaguares.",
      "[Wildlife Insights](https://www.wildlifeinsights.org) (Google y aliados), plataforma en la nube gratuita para la mayoría de organizaciones de la región.",
      "[AddaxAI](https://github.com/PetervanLunteren/AddaxAI), programa de escritorio gratuito que usa MegaDetector sin programar y funciona sin internet.",
      "[SpeciesNet](https://github.com/google/cameratrapai) (Google), clasificador abierto de más de 2,000 categorías con filtro por país.",
      "[Timelapse](https://timelapse.ucalgary.ca), revisión y etiquetado de imágenes en tu computadora.",
      "[BirdNET](https://birdnet.cornell.edu) y [Arbimon](https://arbimon.org), para identificar especies en grabaciones acústicas.",
    ],
    elsewhere: {
      place: "comunidades kichwa de Napo, Ecuador",
      text: "Fundación Jocotoco reentrenó modelos de IA con sonidos de la Amazonía ecuatoriana y clasificó más de 2 millones de audios recopilados entre 2023 y 2025. Desde finales de 2025 opera monitores acústicos en las comunidades kichwa Santa Rita y San Francisco, reconocidas como las primeras OMEC comunitarias de Ecuador. Las comunidades usan la lista de especies validada para zonificar su territorio, gestionar financiamiento y presentar evidencia frente a la minería y la tala. Los resultados se tradujeron al kichwa para las asambleas, y los guardaparques agregaron al modelo el sonido de la motoguadaña.",
      link: { label: "Ver reportaje (Mongabay Latam)", url: "https://elbuho.pe/?p=424346" },
    },
  },
  {
    id: "e4",
    code: "E4",
    n: 4,
    title: "Leer el paisaje",
    short: "Leer el paisaje",
    question: "¿Qué está cambiando alrededor?",
    result: "Mapas de cobertura, cambios y conectividad",
    image: IMAGES.earth,
    purpose:
      "Las cámaras te dicen qué especies están; las imágenes satelitales te dicen qué está pasando con su hábitat. Juntas permiten entender por dónde se mueve la fauna, qué zonas se están perdiendo y dónde conviene actuar.",
    dzilam: {
      title: "Lo que hicimos en Dzilam",
      paragraphs: [
        "El mismo jaguar fue fotografiado en dos sitios separados por cerca de 40 km, entre Dzilam y su transición hacia la Reserva de la Biosfera Ría Lagartos. Ese registro motivó un estudio de conectividad entre ambas reservas y abrió la conversación sobre una zona de acción conjunta. El registro confirma que el animal estuvo en ambos sitios; la ruta que siguió requiere más datos para conocerse.",
      ],
    },
    steps: [
      "Mapea tus estaciones y registros en QGIS, sobre una capa de vegetación y uso de suelo.",
      "Consulta la cobertura y sus cambios en MapBiomas México, Dynamic World o Global Nature Watch, sin necesidad de programar.",
      "Si tu equipo programa, usa Google Earth Engine para comparar años con Sentinel-2 o con los datos de pérdida forestal de Hansen.",
      "Verifica en campo, con el equipo comunitario, los cambios que detectes en los mapas.",
      "Si te interesa la conectividad, combina tus registros con modelos de resistencia del paisaje, como Circuitscape, y con apoyo especializado.",
      "Presenta los mapas con fecha, fuente y escala, y protege las ubicaciones exactas de especies sensibles.",
    ],
    learning:
      "Un solo registro bien documentado puede abrir una conversación entre instituciones. El valor del dato de 40 km estuvo en que se convirtió en una pregunta compartida entre dos reservas.",
    tools: [
      "[QGIS](https://qgis.org), sistema de información geográfica gratuito, con [manual de aprendizaje en español](https://docs.qgis.org/latest/es/docs/training_manual/index.html).",
      "[MapBiomas México](https://mexico.mapbiomas.org), mapas anuales de cobertura y uso de suelo, gratuitos.",
      "[Dynamic World](https://dynamicworld.app), cobertura de suelo casi en tiempo real a 10 m.",
      "[Global Nature Watch](https://www.globalnaturewatch.org) (WRI, antes Global Forest Watch), alertas y datos de pérdida de cobertura.",
      "[Google Earth Engine](https://earthengine.google.com/noncommercial/), gratuito para uso no comercial, con cuotas mensuales.",
      "[Copernicus Browser](https://dataspace.copernicus.eu/browser/), imágenes Sentinel-2 gratuitas con cuenta.",
      "[Global Mangrove Watch](https://www.globalmangrovewatch.org), útil para costas con manglar como Dzilam.",
    ],
    elsewhere: {
      place: "MAAP y FENAMAD, Madre de Dios, Perú",
      text: "El Proyecto de Monitoreo de la Amazonía Andina (MAAP), de Amazon Conservation, publica desde 2015 reportes cortos basados en imágenes satelitales. Comparte sus análisis con la Federación Nativa del Río Madre de Dios y Afluentes (FENAMAD), que representa a 38 comunidades indígenas y los usa para patrullajes y acciones legales frente a incursiones ilegales. Su formato, un mapa y un mensaje por reporte, es un buen modelo para comunicar hallazgos a autoridades y comunidades.",
      link: {
        label: "Ver caso (Amazon Conservation)",
        url: "https://www.amazonconservation.org/celebrating-10-years-of-maap-stopping-deforestation-and-driving-conservation-impact-at-scale/",
      },
    },
  },
  {
    id: "e5",
    code: "E5",
    n: 5,
    title: "Decidir y sostener",
    short: "Decidir y sostener",
    question: "¿Cómo se usa la evidencia y cómo seguimos?",
    result: "Una decisión informada y un plan de continuidad",
    image: IMAGES.pineLight,
    purpose:
      "El monitoreo cumple su propósito cuando la evidencia llega a una decisión: un plan de manejo, una ampliación, un acuerdo entre reservas o una inversión. Para que el trabajo continúe, también se necesitan financiamiento, capacidades locales y una forma de compartir lo aprendido.",
    dzilam: {
      title: "Lo que hicimos en Dzilam",
      paragraphs: [
        "La evidencia del monitoreo formó parte de la fundamentación técnica con la que el Gobierno de Yucatán amplió la Reserva Estatal de Dzilam de 69,000 a 104,304 ha en 2024, en línea con sus compromisos hacia la meta 30x30. La decisión fue de la autoridad, que integró varios estudios y aportaciones. En la fase 2, el proyecto apoyó la actualización del programa de manejo con 17 entrevistas, acompañó autoevaluaciones para la Lista Verde de la UICN en Dzilam y Ría Lagartos, y compartió aprendizajes con la Reserva Biocultural del Puuc. La continuidad de largo plazo se articula con el esquema Herencia Maya de financiamiento para la permanencia.",
      ],
    },
    steps: [
      "Identifica el calendario de la decisión (revisión del plan de manejo, presupuesto anual, consulta pública) y prepara la evidencia para ese momento.",
      "Resume tus hallazgos en una página por audiencia: qué observaste, qué propones y qué falta saber. Usa la plantilla 4. [P4]",
      "Devuelve los resultados al territorio en una sesión presencial y en el idioma de la comunidad.",
      "Usa el Estándar de la Lista Verde de la UICN como guía para ordenar la evidencia de gestión, aunque no busques la certificación.",
      "Presupuesta la continuidad con al menos dos años de horizonte: salarios del equipo local, reposición de equipo, almacenamiento y revisión de datos.",
      "Publica lo aprendido en formatos que otros puedan reutilizar, como una solución en PANORAMA o un conjunto de datos en GBIF.",
    ],
    learning:
      "La evidencia trazable y verificable es lo que más ayuda a abrir conversaciones con financiadores e instituciones. Un registro ordenado de qué se midió, cómo y con qué resultado vale más que una cifra llamativa.",
    tools: [
      "[Estándar de la Lista Verde de Áreas Protegidas y Conservadas, versión 1.1](https://www.iucn.org/sites/default/files/2024-03/estandar-lista-verde-version-1.1.pdf) (UICN, español).",
      "[Directrices de la UICN sobre conflictos y coexistencia entre humanos y vida silvestre](https://doi.org/10.2305/CFRX2122) (2024, español).",
      "[Programa de trabajo de la Iniciativa para la Conservación del Jaguar](https://www.cms.int/sites/default/files/011_jaguar-work-programme_s%20%283%29.pdf) (CITES y CMS, español).",
      "[PANORAMA Soluciones para un Planeta Saludable](https://panorama.solutions/es) (UICN y aliados), para publicar y consultar casos replicables.",
      "[Conservation Evidence Toolkit](https://about.conservationevidence.com/wp-content/uploads/2025/01/Conservation-Evidence-Toolkit-v1.0-15-01-2025.pdf) (inglés), para evaluar si las acciones funcionan.",
    ],
    elsewhere: {
      place: "Red OTUS, Colombia",
      text: "Lanzada en 2024 por las 33 Corporaciones Autónomas Regionales y Conservación Internacional Colombia, la Red OTUS es una red nacional de cámaras trampa que procesa sus imágenes con IA en Wildlife Insights. Ciudades como Cali se han sumado con sus propias cámaras y con guardabosques capacitados. Es un ejemplo de cómo una red de autoridades ambientales puede adoptar una misma herramienta y compartir aprendizajes a escala nacional.",
      link: {
        label: "Ver nota (El Espectador)",
        url: "https://www.elespectador.com/la-red-zoocial/lanzamiento-de-otus-la-red-nacional-de-camaras-de-fauna-como-funciona/",
      },
    },
  },
];

// ---------------------------------------------------------------------------
// Antes de empezar: diez preguntas rápidas

export const QUESTIONS = {
  intro:
    "Si puedes responder “sí” a la mayoría, estás listo para arrancar. Si no, las etapas 1 y 5 te ayudarán a resolverlas.",
  items: [
    "¿Tenemos una pregunta escrita en una frase?",
    "¿Sabemos qué decisión informará y quién la toma?",
    "¿La autoridad ambiental o la comunidad que decide participa desde el inicio?",
    "¿Hay un acuerdo sobre quién es dueño de los datos y qué se publica?",
    "¿Tenemos personas del territorio con tiempo remunerado para el trabajo de campo?",
    "¿Contamos con alguien que pueda revisar el diseño ecológico y las identificaciones?",
    "¿Sabemos cómo llegarán los datos del campo a la computadora si no hay señal?",
    "¿Tenemos presupuesto para al menos una campaña completa y la devolución de resultados?",
    "¿Hay una fecha acordada para presentar resultados al territorio?",
    "¿Sabemos dónde y cómo compartiremos lo aprendido?",
  ],
};

// ---------------------------------------------------------------------------
// Caja de herramientas

export const CATEGORIES = [
  { id: "t4n", label: "Tech4Nature México y BioScanner", image: IMAGES.platform },
  { id: "camaras", label: "Cámaras trampa y acústica", image: IMAGES.feline },
  { id: "campo", label: "Trabajo de campo", image: IMAGES.forestPath },
  { id: "mapas", label: "Mapas y paisaje", image: IMAGES.earth },
  { id: "jaguar", label: "Jaguar", image: IMAGES.jaguar },
  { id: "datos", label: "Datos, ética y comunidad", image: IMAGES.people },
] as const;

export type CategoryId = (typeof CATEGORIES)[number]["id"];

export type AccessKind = "gratuito" | "cuenta" | "costo";

export const ACCESS_KINDS: { id: AccessKind; label: string }[] = [
  { id: "gratuito", label: "Gratuito o público" },
  { id: "cuenta", label: "Requiere cuenta" },
  { id: "costo", label: "Con costo" },
];

export const LANG_FILTERS = [
  { id: "ES", label: "Español", test: /\bES\b/ },
  { id: "EN", label: "Inglés", test: /\bEN\b/ },
  { id: "MULTI", label: "Multilingüe", test: /multiling|PT|maya/i },
] as const;

export const LEVELS = [
  { id: "Básico", label: "Básico", hint: "sin programar" },
  { id: "Intermedio", label: "Intermedio", hint: "requiere práctica o formación" },
  { id: "Avanzado", label: "Avanzado", hint: "requiere programación o especialistas" },
] as const;

export type Level = (typeof LEVELS)[number]["id"];

export type Resource = {
  id: string;
  code: string;
  category: CategoryId;
  title: string;
  url: string;
  /** Segundo enlace, por ejemplo el manual de una herramienta. */
  extra?: { label: string; url: string };
  /** Institución, cuando el documento la menciona. */
  org?: string;
  use: string;
  /** Acceso tal como lo indica el toolkit; vacío cuando la tabla no lo especifica. */
  access?: string;
  kind?: AccessKind;
  lang: string;
  level?: Level;
};

type RawResource = Omit<Resource, "id" | "code">;

const RAW_RESOURCES: RawResource[] = [
  // Tech4Nature México y BioScanner
  { category: "t4n", title: "BioScanner", url: "https://app.bioscanner.io", org: "C Minds", use: "Clasificar especies e identificar jaguares en fotos y videos", access: "Cuenta, acceso anticipado", kind: "cuenta", lang: "ES, EN, PT, maya", level: "Básico" },
  { category: "t4n", title: "GitHub de Tech4Nature México", url: "https://github.com/aiforclimate/tech4naturemexico", use: "Revisar el modelo de identificación individual de jaguares", access: "Público", kind: "gratuito", lang: "EN", level: "Avanzado" },
  { category: "t4n", title: "Página de Tech4Nature México", url: "https://www.forclimate.ai/tech4nature", use: "Conocer el proyecto, sus socios y publicaciones", access: "Público", kind: "gratuito", lang: "ES, EN", level: "Básico" },
  { category: "t4n", title: "Reporte de la fase 1: Uso de sistemas de IA para la protección de la biodiversidad", url: "https://docs.google.com/document/d/12OQ36ia6frIHRFIOJWm4dyT5uFbb8vHfJBcyQWP_CqY/edit", use: "Metodología, dispositivos y recomendaciones éticas de la fase 1", access: "Público", kind: "gratuito", lang: "ES", level: "Básico" },
  { category: "t4n", title: "De los datos al impacto en Yucatán", url: "https://tech4nature.iucngreenlist.org/from-data-to-impact-scaling-ai-powered-conservation-in-mexicos-yucatan-peninsula/", org: "UICN", use: "Caso de Tech4Nature México publicado por la UICN", access: "Público", kind: "gratuito", lang: "EN", level: "Básico" },
  { category: "t4n", title: "Solutions in Focus: Tech4Nature 2025", url: "https://panorama.solutions/sites/default/files/2025-10/Panorama%20Tech4Nature%202025%20-%20Lena%20v04%20FINAL%20WEB.pdf", use: "Casos de la alianza Tech4Nature en el mundo", access: "Público", kind: "gratuito", lang: "EN", level: "Básico" },
  // Cámaras trampa y acústica
  { category: "camaras", title: "Manual de fototrampeo: el jaguar en México", url: "https://simec.conanp.gob.mx/Publicaciones2020/Publicaciones%20CONANP/Parte%203/Manuales/2013%20Manual%20fototrampeo%20jaguar.pdf", use: "Diseñar y operar fototrampeo para jaguar", access: "PDF gratuito", kind: "gratuito", lang: "ES", level: "Intermedio" },
  { category: "camaras", title: "Manual de fototrampeo (Instituto Humboldt)", url: "http://hdl.handle.net/20.500.11761/31415", org: "Instituto Humboldt", use: "Guía práctica de fototrampeo en el trópico", access: "PDF gratuito", kind: "gratuito", lang: "ES", level: "Básico" },
  { category: "camaras", title: "BIOCOMUNI v2.0 Fauna", url: "https://desarrollo.fmcn.org/wp-content/uploads/2025/06/BIOCOMUNI_v2.0_Fauna.pdf", org: "FMCN y CONAFOR", use: "Monitoreo comunitario con formatos de campo", access: "PDF gratuito", kind: "gratuito", lang: "ES", level: "Básico" },
  { category: "camaras", title: "Guía GBIF de datos de cámaras trampa", url: "https://docs.gbif.org/camera-trap-guide/es/", org: "GBIF", use: "Organizar, documentar y publicar datos", access: "Gratuito", kind: "gratuito", lang: "ES", level: "Intermedio" },
  { category: "camaras", title: "Wildlife Insights", url: "https://www.wildlifeinsights.org", use: "Subir, clasificar con IA y compartir imágenes", access: "Gratuito para la mayoría de usuarios de la región", kind: "gratuito", lang: "EN, guías en ES", level: "Básico" },
  { category: "camaras", title: "AddaxAI", url: "https://github.com/PetervanLunteren/AddaxAI", use: "Filtrar imágenes vacías en tu computadora, sin internet", access: "Gratuito, código abierto", kind: "gratuito", lang: "EN", level: "Básico" },
  { category: "camaras", title: "MegaDetector", url: "https://github.com/microsoft/MegaDetector", use: "Detectar animales, personas y vehículos", access: "Código abierto", kind: "gratuito", lang: "EN", level: "Avanzado" },
  { category: "camaras", title: "SpeciesNet", url: "https://github.com/google/cameratrapai", org: "Google", use: "Clasificar especies con filtro por país", access: "Código abierto", kind: "gratuito", lang: "EN", level: "Avanzado" },
  { category: "camaras", title: "Timelapse", url: "https://timelapse.ucalgary.ca", use: "Revisar y etiquetar imágenes", access: "Gratuito", kind: "gratuito", lang: "EN", level: "Básico" },
  { category: "camaras", title: "Zamba Cloud", url: "https://zamba-cloud.drivendata.org", use: "Clasificar especies en videos", access: "Gratuito", kind: "gratuito", lang: "EN", level: "Básico" },
  { category: "camaras", title: "camtrapR", url: "https://cran.r-project.org/web/packages/camtrapR/", use: "Preparar datos para modelos de ocupación y captura-recaptura", access: "Gratuito (R)", kind: "gratuito", lang: "EN", level: "Avanzado" },
  { category: "camaras", title: "AudioMoth y su manual", url: "https://www.protocols.io/view/manual-de-configuraci-n-audiomoth-1-2-0-gu-a-de-8-cmvju64n.pdf", use: "Grabar sonidos del ambiente de forma autónoma", access: "Equipo de bajo costo, manual gratuito", kind: "costo", lang: "ES", level: "Básico" },
  { category: "camaras", title: "BirdNET", url: "https://birdnet.cornell.edu", use: "Identificar aves por su canto", access: "Gratuito", kind: "gratuito", lang: "ES, EN", level: "Básico" },
  { category: "camaras", title: "Arbimon", url: "https://arbimon.org", use: "Almacenar y analizar grabaciones acústicas", access: "Plan gratuito y planes de pago", kind: "gratuito", lang: "EN", level: "Intermedio" },
  // Trabajo de campo
  { category: "campo", title: "KoboToolbox", url: "https://www.kobotoolbox.org", use: "Formularios de campo sin conexión", access: "Gratuito para organizaciones", kind: "gratuito", lang: "ES", level: "Básico" },
  { category: "campo", title: "SMART", url: "https://smartconservationtools.org", use: "Registrar patrullajes y observaciones", access: "Gratuito, código abierto", kind: "gratuito", lang: "Multilingüe", level: "Intermedio" },
  { category: "campo", title: "QField", url: "https://qfield.org", use: "Llevar mapas de QGIS al celular", access: "Gratuito", kind: "gratuito", lang: "ES", level: "Intermedio" },
  { category: "campo", title: "iNaturalist México (NaturaLista)", url: "https://mexico.inaturalist.org", use: "Registrar observaciones y aprender a identificar especies", access: "Cuenta gratuita", kind: "cuenta", lang: "ES", level: "Básico" },
  // Mapas y paisaje
  { category: "mapas", title: "QGIS", url: "https://qgis.org", extra: { label: "Manual de QGIS", url: "https://docs.qgis.org/latest/es/docs/training_manual/index.html" }, use: "Hacer mapas y análisis espaciales", access: "Gratuito, código abierto", kind: "gratuito", lang: "ES", level: "Intermedio" },
  { category: "mapas", title: "MapBiomas México", url: "https://mexico.mapbiomas.org", use: "Consultar cobertura y uso de suelo por año", access: "Gratuito", kind: "gratuito", lang: "ES", level: "Básico" },
  { category: "mapas", title: "Dynamic World", url: "https://dynamicworld.app", use: "Ver cobertura de suelo reciente a 10 m", access: "Gratuito", kind: "gratuito", lang: "EN", level: "Básico" },
  { category: "mapas", title: "Global Nature Watch", url: "https://www.globalnaturewatch.org", org: "WRI", use: "Alertas y datos de pérdida de cobertura", access: "Gratuito", kind: "gratuito", lang: "EN", level: "Básico" },
  { category: "mapas", title: "Global Mangrove Watch", url: "https://www.globalmangrovewatch.org", use: "Monitorear manglares", access: "Gratuito", kind: "gratuito", lang: "EN", level: "Básico" },
  { category: "mapas", title: "Copernicus Browser", url: "https://dataspace.copernicus.eu/browser/", use: "Ver y descargar imágenes Sentinel-2", access: "Cuenta gratuita", kind: "cuenta", lang: "Multilingüe", level: "Intermedio" },
  { category: "mapas", title: "Google Earth Engine", url: "https://earthengine.google.com/noncommercial/", use: "Analizar series de imágenes satelitales", access: "Gratuito no comercial, con cuotas", kind: "gratuito", lang: "EN", level: "Avanzado" },
  { category: "mapas", title: "Global Forest Change (Hansen)", url: "https://glad.earthengine.app/view/global-forest-change", use: "Consultar pérdida y ganancia de bosque desde 2000", access: "Gratuito", kind: "gratuito", lang: "EN", level: "Básico" },
  { category: "mapas", title: "Planet", url: "https://www.planet.com", use: "Imágenes de alta resolución y alta frecuencia", access: "De pago", kind: "costo", lang: "EN", level: "Intermedio" },
  { category: "mapas", title: "Circuitscape", url: "https://circuitscape.org", use: "Modelar conectividad del paisaje", access: "Gratuito, código abierto", kind: "gratuito", lang: "EN", level: "Avanzado" },
  { category: "mapas", title: "INEGI: Uso de suelo y vegetación", url: "https://www.inegi.org.mx/temas/usosuelo/", org: "INEGI", use: "Cartografía oficial de vegetación en México", access: "Gratuito", kind: "gratuito", lang: "ES", level: "Intermedio" },
  { category: "mapas", title: "Geoportal de CONABIO", url: "http://www.conabio.gob.mx/informacion/gis/", org: "CONABIO", use: "Capas de biodiversidad de México", access: "Gratuito", kind: "gratuito", lang: "ES", level: "Intermedio" },
  // Jaguar
  { category: "jaguar", title: "Jaguar en EncicloVida", url: "https://enciclovida.mx/especies/34460-panthera-onca", org: "CONABIO", use: "Distribución y registros en México", lang: "ES" },
  { category: "jaguar", title: "Iniciativa para la Conservación del Jaguar", url: "https://www.cms.int/sites/default/files/011_jaguar-work-programme_s%20%283%29.pdf", org: "CITES y CMS", use: "Prioridades regionales de conservación", lang: "ES" },
  { category: "jaguar", title: "Hoja de ruta Jaguar 2030", url: "https://panthera.org/sites/default/files/Panthera_Jaguar2030Roadmap_ENG_0.pdf", use: "Paisajes prioritarios y corredores en 14 países", lang: "EN" },
  { category: "jaguar", title: "Programa de jaguar de Panthera", url: "https://www.panthera.org/jaguar", org: "Panthera", use: "Investigación y Corredor del Jaguar", lang: "EN" },
  { category: "jaguar", title: "Directrices UICN de coexistencia", url: "https://doi.org/10.2305/CFRX2122", org: "UICN", use: "Atender conflictos entre personas y fauna", lang: "ES" },
  // Datos, ética y comunidad
  { category: "datos", title: "Principios CREA (CARE)", url: "https://www.gida-global.org/s/Principios-CREA.pdf", org: "GIDA", use: "Gobernanza de datos de pueblos indígenas", lang: "ES" },
  { category: "datos", title: "Datos de especies sensibles (GBIF)", url: "https://docs.gbif.org/sensitive-species-best-practices/master/es/buenas-practicas-para-generalizar-datos-de-especies-sensibles-en-registros-biologicos.es.pdf", org: "GBIF", use: "Decidir qué ubicaciones publicar", lang: "ES" },
  { category: "datos", title: "Recomendación sobre la Ética de la IA (UNESCO)", url: "https://digitallibrary.un.org/record/4062376/files/1416674-ES.pdf", org: "UNESCO", use: "Principios para un uso responsable de la IA", lang: "ES" },
  { category: "datos", title: "AI for Environment and Ecosystems Toolkit (UNESCO)", url: "https://www.unesco.org/ethics-ai/en/ai-environment-ecosystems-toolkit", org: "UNESCO", use: "Políticas públicas de IA y ambiente", lang: "EN" },
  { category: "datos", title: "Estándar de la Lista Verde (UICN)", url: "https://www.iucn.org/sites/default/files/2024-03/estandar-lista-verde-version-1.1.pdf", org: "UICN", use: "Evaluar gobernanza y gestión de áreas protegidas", lang: "ES" },
  { category: "datos", title: "WILDLABS", url: "https://wildlabs.net/es", use: "Comunidad global de tecnología para la conservación, con grupo de América Latina", lang: "ES, EN" },
  { category: "datos", title: "PANORAMA", url: "https://panorama.solutions/es", use: "Consultar y publicar soluciones replicables", lang: "ES, EN" },
];

export const RESOURCES: Resource[] = RAW_RESOURCES.map((r, i) => {
  const n = String(i + 1).padStart(2, "0");
  return { ...r, id: `r${n}`, code: `R${n}` };
});

export const TOOLBOX = {
  intro:
    "Esta selección prioriza recursos gratuitos, en español y fáciles de usar. El nivel indica cuánta experiencia técnica se necesita: básico (sin programar), intermedio (requiere práctica o formación) y avanzado (requiere programación o especialistas). Información de acceso revisada en octubre de 2026.",
};

// ---------------------------------------------------------------------------
// Plantillas

export type TemplateField = { label: string; hint?: string };

export type Template = {
  id: string;
  /** P1 … P4 */
  code: string;
  n: number;
  title: string;
  short: string;
  /** Etapa en la que se usa. */
  stage: string;
  /** «form»: un campo por fila. «log»: registro con columnas. */
  layout: "form" | "log";
  fields: TemplateField[];
};

export const TEMPLATES_INTRO = "Cada plantilla cabe en una página. Puedes copiarlas, imprimirlas o adaptarlas a tu proyecto.";

export const TEMPLATES: Template[] = [
  {
    id: "p1",
    code: "P1",
    n: 1,
    title: "Ficha de arranque",
    short: "Ficha de arranque",
    stage: "E1",
    layout: "form",
    fields: [
      { label: "Nombre del proyecto y territorio" },
      { label: "Pregunta en una frase" },
      { label: "Decisión que informará y quién la toma" },
      { label: "Fecha en que se necesita la evidencia" },
      { label: "Aliados y rol de cada uno", hint: "comunidad, autoridad, ciencia, tecnología" },
      { label: "Métodos", hint: "cámaras, acústica, imágenes satelitales, entrevistas" },
      { label: "Presupuesto disponible y meses cubiertos" },
      { label: "Fecha de devolución de resultados al territorio" },
    ],
  },
  {
    id: "p2",
    code: "P2",
    n: 2,
    title: "Acuerdo de datos",
    short: "Acuerdo de datos",
    stage: "E1",
    layout: "form",
    fields: [
      { label: "¿Quién es responsable de los datos?" },
      { label: "¿Quién puede ver los datos originales?" },
      { label: "¿Qué se puede publicar y con qué nivel de detalle?" },
      { label: "¿Qué información se protege?", hint: "ubicaciones de especies sensibles, rostros, conocimientos tradicionales" },
      { label: "¿Quién autoriza nuevos usos?" },
      { label: "¿Cómo se reconoce a la comunidad en publicaciones y beneficios?" },
      { label: "¿Dónde se guardan las copias de respaldo?" },
      { label: "Firmas y fecha" },
    ],
  },
  {
    id: "p3",
    code: "P3",
    n: 3,
    title: "Registro de estación de cámara trampa",
    short: "Registro de estación",
    stage: "E2",
    layout: "log",
    fields: [
      { label: "Código de estación" },
      { label: "Coordenadas" },
      { label: "Hábitat" },
      { label: "Fecha de instalación" },
      { label: "Fecha de retiro" },
      { label: "Cámara y configuración" },
      { label: "Fallas o notas" },
      { label: "Responsable" },
    ],
  },
  {
    id: "p4",
    code: "P4",
    n: 4,
    title: "Hallazgo en una página",
    short: "Hallazgo en una página",
    stage: "E5",
    layout: "form",
    fields: [
      { label: "Para quién es" },
      { label: "Qué observamos", hint: "dato, periodo, método" },
      { label: "Qué significa para el territorio" },
      { label: "Qué proponemos" },
      { label: "Qué falta saber" },
      { label: "Mapa o imagen de apoyo", hint: "con fecha y fuente" },
      { label: "Contacto" },
    ],
  },
];

// ---------------------------------------------------------------------------
// Fuentes

export const SOURCES = [
  "WWF y ZSL (2026). [Informe Planeta Vivo 2026](https://www.wwf.org.uk/press-release/living-planet-report-2026).",
  "CONANP. [México megadiverso](https://www.gob.mx/conanp/articulos/mexico-megadiverso-173682).",
  "Grupo de Especialistas en Felinos de la UICN. [Jaguar](https://www.catsg.org/living-species-jaguar).",
  "Tercer Censo Nacional del Jaguar, datos a 2024, presentado en 2025. [Xataka México (2025)](https://www.xataka.com.mx/ecologia-y-naturaleza/alguien-ha-contado-cuantos-jaguares-salvajes-quedan-todo-mexico-hay-muy-buenas-noticias).",
  "Microsoft AI for Good. [MegaDetector](https://github.com/microsoft/MegaDetector); Wildlife Insights, [preguntas frecuentes](https://www.wildlifeinsights.org/faq).",
  "IICA y aliados (2022). Conectividad significativa en zonas rurales de América Latina y el Caribe.",
  "UICN (2025). [Phase two of Tech4Nature jaguar protection project launched in Mexico](https://iucn.org/news/202504/phase-two-tech4nature-jaguar-protection-project-launched-mexico).",
  "Gobierno del Estado de Yucatán (2024). [Acuerdo 76/2024, Diario Oficial](https://www.yucatan.gob.mx/docs/diario_oficial/diarios/2024/2024-09-23_2.pdf).",
  "C Minds (2026). Informe técnico final de Tech4Nature México y estudio de conectividad Dzilam–Ría Lagartos (documentos internos).",
];

export const LIVING_NOTE =
  "Este toolkit es un documento vivo. Se revisará al menos una vez al año. Si encuentras un enlace roto, una herramienta nueva o una experiencia que quieras compartir, escríbenos a través de la página de Tech4Nature México.";

// ---------------------------------------------------------------------------
// Páginas: el toolkit se lee por capítulos, uno por URL.

export function slugify(s: string): string {
  return s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

const clip = (s: string, n = 158) => (s.length > n ? `${s.slice(0, n - 1).replace(/\s+\S*$/, "")}…` : s);

export type PageKind =
  | "inicio"
  | "por-que-importa"
  | "caso"
  | "etapa"
  | "preguntas"
  | "caja"
  | "plantillas"
  | "plantilla"
  | "fuentes"
  | "insignia";

export type ToolkitPage = {
  /** Segmento de URL; "" es la portada. */
  slug: string;
  kind: PageKind;
  title: string;
  /** Nombre corto para la barra lateral y la paginación. */
  label: string;
  group: string;
  description: string;
  code?: string;
  /** Id de la etapa o plantilla que muestra. */
  ref?: string;
};

export const GROUPS = [
  { id: "empezar", label: "Empezar" },
  { id: "etapas", label: "Las cinco etapas" },
  { id: "herramientas", label: "Herramientas" },
  { id: "plantillas", label: "Plantillas" },
  { id: "cierre", label: "Cierre" },
];

export const stageSlug = (s: Stage) => `etapa-${s.n}-${slugify(s.title)}`;
export const templateSlug = (t: Template) => `plantilla-${t.n}-${slugify(t.short)}`;

export const PAGES: ToolkitPage[] = [
  {
    slug: "",
    kind: "inicio",
    title: HERO.title,
    label: "Inicio",
    group: "empezar",
    description:
      "Toolkit para co-diseñar, implementar y sostener proyectos de conservación con inteligencia artificial en América Latina y el Caribe: cinco etapas, plantillas y una caja de herramientas gratuitas.",
  },
  {
    slug: "por-que-importa",
    kind: "por-que-importa",
    title: "Por qué importa",
    label: "Por qué importa",
    group: "empezar",
    description:
      "Datos de biodiversidad, jaguar, cámaras trampa y conectividad rural en América Latina y el Caribe, y qué significan para un proyecto de conservación con IA.",
  },
  {
    slug: "tech4nature-mexico",
    kind: "caso",
    title: "Tech4Nature México en una mirada",
    label: "Tech4Nature México en una mirada",
    group: "empezar",
    description:
      "147 especies, 333,099 archivos en BioScanner y un jaguar registrado a 40 km: resultados, línea de tiempo y aprendizajes de Tech4Nature México en la Reserva Estatal de Dzilam.",
  },
  ...STAGES.map(
    (s): ToolkitPage => ({
      slug: stageSlug(s),
      kind: "etapa",
      title: `Etapa ${s.n}. ${s.title}`,
      label: s.short,
      group: "etapas",
      description: clip(`${s.question} ${s.purpose}`),
      code: s.code,
      ref: s.id,
    }),
  ),
  {
    slug: "diez-preguntas",
    kind: "preguntas",
    title: "Antes de empezar: diez preguntas rápidas",
    label: "Diez preguntas rápidas",
    group: "herramientas",
    description:
      "Diez preguntas para saber si tu proyecto está listo para arrancar: pregunta, decisión, acuerdos de datos, equipo de campo, presupuesto y devolución de resultados.",
  },
  {
    slug: "caja-de-herramientas",
    kind: "caja",
    title: "Caja de herramientas",
    label: "Caja de herramientas",
    group: "herramientas",
    description: `${RESOURCES.length} recursos gratuitos y en español para cámaras trampa, acústica, trabajo de campo, mapas, jaguar y gobernanza de datos, filtrables por categoría, idioma, acceso y nivel.`,
  },
  {
    slug: "plantillas",
    kind: "plantillas",
    title: "Plantillas",
    label: "Todas las plantillas",
    group: "plantillas",
    description:
      "Cuatro plantillas de una página para descargar: ficha de arranque, acuerdo de datos, registro de estación de cámara trampa y hallazgo en una página.",
  },
  ...TEMPLATES.map(
    (t): ToolkitPage => ({
      slug: templateSlug(t),
      kind: "plantilla",
      title: `Plantilla ${t.n}. ${t.title}`,
      label: t.short,
      group: "plantillas",
      description: `Plantilla ${t.n} del toolkit Crea tu propio Tech4Nature: ${t.title.toLowerCase()}. ${TEMPLATES_INTRO}`,
      code: t.code,
      ref: t.id,
    }),
  ),
  {
    slug: "fuentes",
    kind: "fuentes",
    title: "Fuentes de los datos",
    label: "Fuentes y cita",
    group: "cierre",
    description: "Fuentes de las cifras del toolkit Crea tu propio Tech4Nature y forma de citarlo.",
  },
  {
    slug: "insignia",
    kind: "insignia",
    title: "Tu insignia del toolkit",
    label: "Insignia",
    group: "cierre",
    description: "Revisa las cinco etapas para desbloquear la insignia del toolkit Crea tu propio Tech4Nature, descárgala y compártela en redes.",
  },
];

export const PAGE_BY_SLUG = new Map(PAGES.map((p) => [p.slug, p]));

/**
 * Capítulos de la versión 0.1 que ya no existen, con la página que los
 * sustituye, para que los enlaces compartidos sigan funcionando.
 */
export const LEGACY_SLUGS: Record<string, string> = {
  contexto: "por-que-importa",
  caso: "tech4nature-mexico",
  gestion: stageSlug(STAGES[4]),
  diagnostico: "diez-preguntas",
  "a01-pregunta-y-teoria-de-cambio": stageSlug(STAGES[0]),
  "a02-gobernanza-y-soberania": stageSlug(STAGES[0]),
  "a03-diseno-del-muestreo": stageSlug(STAGES[1]),
  "a04-operacion-de-campo": stageSlug(STAGES[1]),
  "a05-uso-de-bioscanner": stageSlug(STAGES[2]),
  "a06-identidades-de-jaguar": stageSlug(STAGES[2]),
  "a07-analisis-ecologico": stageSlug(STAGES[2]),
  "a08-cartografia-accesible": stageSlug(STAGES[3]),
  "a09-analisis-en-earth-engine": stageSlug(STAGES[3]),
  "a10-gestion-y-lista-verde": stageSlug(STAGES[4]),
  "a11-financiamiento-y-operacion": stageSlug(STAGES[4]),
  "a12-capacidades-y-adopcion": stageSlug(STAGES[4]),
  "noventa-dias": "",
  ejercicio: stageSlug(STAGES[2]),
  "t01-diseno-de-la-iniciativa": templateSlug(TEMPLATES[0]),
  "t02-gobernanza-de-datos": templateSlug(TEMPLATES[1]),
  "t03-despliegue-y-esfuerzo": templateSlug(TEMPLATES[2]),
  "t04-calidad-y-trazabilidad": "plantillas",
  "t05-evaluacion-de-un-modelo": "plantillas",
  "t06-identidad-de-jaguar": "plantillas",
  "t07-analisis-y-cartografia": "plantillas",
  "t08-expediente-para-decidir": templateSlug(TEMPLATES[3]),
  "t09-presupuesto-y-escenarios": "plantillas",
  "t10-tablero-de-aprendizaje": "plantillas",
  biblioteca: "caja-de-herramientas",
  glosario: "",
};

/** Ruta de una página del toolkit, con locale y ancla opcional. */
export function toolkitHref(locale: string, slug: string, hash?: string): string {
  return `/${locale}${TOOLKIT_PATH}${slug ? `/${slug}` : ""}${hash ? `#${hash}` : ""}`;
}

/** Página y ancla a las que lleva un código (E1, P1, R01) o una clave de ruta. */
export function targetOf(key: string): { slug: string; hash?: string } {
  if (/^E\d$/.test(key)) return { slug: stageSlug(STAGES.find((s) => s.code === key)!) };
  if (/^P\d$/.test(key)) return { slug: templateSlug(TEMPLATES.find((t) => t.code === key)!) };
  if (/^R\d{2}$/.test(key)) return { slug: "caja-de-herramientas", hash: key.toLowerCase() };
  return { slug: key };
}
