/**
 * Contenido del Toolkit Tech4Nature México v0.1 (octubre de 2026).
 * Fuente: Tech4Nature_Mexico_Toolkit_Conservacion_IA_v01.pdf, págs. 1–49.
 * El anexo de implementación (págs. 50–53) es un documento interno de C Minds
 * y no se publica aquí.
 *
 * En los textos, los códigos A01, T01, R01 y E01 se convierten en enlaces
 * (ver `Rich` en _components/rich.tsx). Las imágenes viven en `IMAGES`:
 * cambiarlas ahí actualiza todo el toolkit.
 */

export const TOOLKIT_SLUG = "tech4nature-mexico-conservacion-ia-v01";
export const TOOLKIT_PATH = `/toolkits/${TOOLKIT_SLUG}`;
export const TOOLKIT_VERSION = "0.1";
export const TOOLKIT_DATE = "2026-10";
export const STORAGE_KEY = "tk-t4n-v01";

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

// ---------------------------------------------------------------------------
// Portada

export const HERO = {
  eyebrow: "Aprendizajes de Tech4Nature México 2022–2026",
  title: "Toolkit para iniciativas de conservación con inteligencia artificial en México",
  subtitle:
    "Herramientas para diseñar, implementar y sostener monitoreo de biodiversidad y decisiones territoriales en América Latina y el Caribe.",
};

export const PURPOSE = {
  paragraphs: [
    "Este toolkit busca compartir aprendizajes de la iniciativa Tech4Nature México, con el fin de acercar recomendaciones, recursos, buenas prácticas y un repositorio vivo de información para quienes busquen construir una iniciativa de conservación multisectorial que vincule conocimiento territorial, monitoreo de biodiversidad, inteligencia artificial y toma de decisiones desde la gestión pública.",
    "Reúne ejemplos de procedimientos, criterios de decisión, plantillas y recursos para que comunidades locales, tomadores de decisión, líderes de conservación, organizaciones y equipos científicos desarrollen capacidades propias y produzcan información útil para actuar en sus territorios.",
    "La experiencia de Tech4Nature México proporciona un ejemplo de caso de aplicación; una ruta de cuatro años de colaboración en Yucatán que ha conectado monitoreo de biodiversidad y desarrollo tecnológico con liderazgo comunitario, planeación y toma de decisiones para manejo de áreas protegidas y colaboración multisectorial. BioScanner, plataforma desarrollada bajo la iniciativa Tech4Nature México por C Minds, agrupa una parte de esa capacidad facilitando la validación humana, el análisis colaborativo y el control sobre el uso de los datos de monitoreo de biodiversidad.",
  ],
  unit:
    "La unidad de trabajo del toolkit es una decisión de conservación. Cada acción busca acompañar a definir qué evidencia se necesita, cómo se recomienda obtenerla, quién podría interpretarla y qué condiciones permiten sostener su uso. Las herramientas pueden combinarse según recursos, conectividad, capacidades y prioridades; la metodología busca ser adaptativa a las características ecológicas y sociales de cada lugar.",
  outputs: [
    "Un plan de monitoreo asociado a una pregunta ecológica orientada a la acción y toma de decisiones.",
    "Un acuerdo de gobernanza y una base de datos documentada, con acceso y usos definidos.",
    "Un flujo de revisión de datos de biodiversidad con BioScanner y herramientas complementarias de campo y análisis espacial.",
    "Un expediente para decisiones, un presupuesto de continuidad y un sistema de seguimiento.",
  ],
  reference:
    "La referencia metodológica de política pública es el toolkit de UNESCO, adaptada aquí al trabajo territorial de conservación. [R06]",
};

export const STATS = [
  { value: 6, label: "pasos" },
  { value: 12, label: "acciones" },
  { value: 10, label: "plantillas" },
  { value: 66, label: "fichas de recursos" },
];

// ---------------------------------------------------------------------------
// Rutas por público

export type Audience = {
  id: string;
  title: string;
  short: string;
  /** Secuencia sugerida, en orden. */
  path: string[];
  extra?: string;
  reason: string;
};

export const AUDIENCES: Audience[] = [
  {
    id: "autoridades",
    title: "Autoridades y equipos gestores",
    short: "Decidir con evidencia y sostener la acción pública.",
    path: ["contexto", "caso", "A01", "A02", "A10", "A11", "T01", "T08", "T09"],
    reason:
      "Parte de la decisión pública: acordar la pregunta y las reglas de datos, convertir resultados en acciones de gestión y asegurar continuidad financiera.",
  },
  {
    id: "lideres",
    title: "Líderes de conservación y organizaciones",
    short: "Llevar el ciclo completo de campo a datos revisados.",
    path: ["A01", "A02", "A03", "A04", "A05", "A12", "T02", "T03", "T04", "T10"],
    reason:
      "Recorre el ciclo territorial: acordar, diseñar y operar el monitoreo, revisar datos con BioScanner y fortalecer capacidades locales.",
  },
  {
    id: "universidades",
    title: "Universidades y especialistas",
    short: "Diseño, modelos e interpretación con rigor.",
    path: ["A03", "A05", "A06", "A07", "A09", "T05", "T06", "T07"],
    reason:
      "Concentra el rigor científico: diseño de muestreo, evaluación de modelos, catálogo de identidades y análisis ecológico y geoespacial.",
  },
  {
    id: "tecnologia",
    title: "Equipos tecnológicos y financiadores",
    short: "Plataforma, gobernanza de datos y continuidad.",
    path: ["A02", "A05", "A11", "A12", "biblioteca"],
    reason:
      "Prioriza soberanía de datos, operación de la plataforma, financiamiento de continuidad y adopción medida por tareas.",
  },
];

// ---------------------------------------------------------------------------
// Pasos y acciones

export type Step = { n: number; id: string; title: string; product: string; image: Img };

export const STEPS: Step[] = [
  { n: 1, id: "paso-1", title: "Definir y acordar", product: "Mandato, pregunta y reglas de uso de datos", image: IMAGES.people },
  { n: 2, id: "paso-2", title: "Observar el territorio", product: "Protocolo y registro verificable del esfuerzo", image: IMAGES.forestPath },
  { n: 3, id: "paso-3", title: "Validar y comprender", product: "Datos revisados e interpretación con incertidumbre", image: IMAGES.platform },
  { n: 4, id: "paso-4", title: "Integrar el paisaje", product: "Mapa de evidencia y cambios que requieren revisión", image: IMAGES.earth },
  { n: 5, id: "paso-5", title: "Actuar y sostener", product: "Acuerdos de acción, presupuesto y seguimiento", image: IMAGES.pineLight },
  { n: 6, id: "paso-6", title: "Aprender y adaptar", product: "Personas capacitadas y decisiones de ampliación", image: IMAGES.map },
];

export type Table = { caption?: string; head: string[]; rows: string[][] };

export type Block = {
  title: string;
  paragraphs?: string[];
  list?: string[];
  table?: Table;
  /** Ejemplo con cifras: se muestra como recuadro destacado. */
  example?: string;
};

export type Action = {
  id: string;
  code: string;
  step: number;
  title: string;
  short: string;
  result: string;
  procedureTitle: string;
  procedure: string[];
  blocks: Block[];
  check: string;
  templates: string[];
  resources: string[];
};

export const ACTIONS: Action[] = [
  {
    id: "a01",
    code: "A01",
    step: 1,
    title: "Definir la pregunta y la teoría de cambio",
    short: "Pregunta y teoría de cambio",
    result:
      "Una pregunta de monitoreo que permita informar una decisión concreta, con indicadores y supuestos identificados. Participan quienes conocen el territorio, quienes usarán la información y quienes responderán por su calidad científica.",
    procedureTitle: "Procedimiento",
    procedure: [
      "Describa el objeto de conservación: una especie, un ensamble, un hábitat o una relación de conectividad. Delimite el área y las actividades humanas relevantes.",
      "Identifique la presión o incertidumbre y la decisión disponible. Por ejemplo, seleccionar áreas para verificación de conectividad o revisar medidas de convivencia con fauna.",
      "Formule una pregunta medible y su escala temporal. “¿En qué estaciones se registra jaguar durante campañas comparables?” requiere un diseño diferente de “¿cambió la densidad de jaguares?”.",
      "Construya la secuencia de contribución: acciones financiadas → información validada → decisión y medida de manejo → respuesta esperada. Registre los supuestos entre cada paso.",
      "Elija indicadores de implementación, calidad, uso y resultados. Establezca una línea base y la evidencia que permitiría modificar la intervención.",
    ],
    blocks: [
      {
        title: "Aplicación de Tech4Nature",
        paragraphs: [
          "La conexión entre observaciones en Dzilam y la transición hacia Ría Lagartos muestra cómo una pregunta puede ampliarse cuando la evidencia supera el límite administrativo de una reserva. La respuesta transferible es revisar la escala de cooperación y del muestreo, conservando el vínculo con decisiones que las instituciones pueden adoptar. [E01]",
        ],
      },
      {
        title: "Cada pregunta exige un diseño distinto",
        table: {
          head: ["Pregunta", "Diseño necesario", "Uso posible"],
          rows: [
            ["Qué especies se detectan", "Inventario por método y esfuerzo", "Priorizar revisión y estudios"],
            ["Dónde se repite su detección", "Sitios y ocasiones comparables", "Focalizar seguimiento"],
            ["Cómo cambia la ocupación", "Visitas repetidas y detectabilidad", "Evaluar patrones temporales"],
            ["Qué explica un cambio", "Diseño de evaluación y factores alternativos", "Revisar una intervención"],
          ],
        },
      },
    ],
    check:
      "Otra persona debe poder identificar la decisión, la unidad de observación, el periodo y la limitación del resultado sin recibir una explicación adicional. Complete T01 antes de seleccionar herramientas.",
    templates: ["T01"],
    resources: ["R09", "R52"],
  },
  {
    id: "a02",
    code: "A02",
    step: 1,
    title: "Acordar gobernanza y soberanía de datos",
    short: "Gobernanza y soberanía",
    result:
      "Un acuerdo práctico sobre autoridad, acceso, responsabilidades y beneficios a lo largo de la cadena de datos. La soberanía se expresa en la capacidad efectiva de decidir sobre la recolección, el procesamiento, el intercambio y los usos posteriores de información territorial.",
    procedureTitle: "Procedimiento",
    procedure: [
      "Identifique titulares de derechos, autoridades, organizaciones y personas que producen, custodian o utilizan los registros. Incorpore las instancias propias de decisión cuando participen pueblos indígenas.",
      "Separe usos: manejo local, investigación, formación, comunicación pública y entrenamiento de modelos. Un permiso para una finalidad no debe interpretarse como autorización general para las demás.",
      "Acuerde niveles de acceso. Distinga medios originales, coordenadas precisas, identidades humanas, conocimiento cultural y resultados agregados, e identifique quién puede autorizar cada circulación.",
      "Defina cómo se corrigen registros y decisiones, cómo se retira acceso, cómo se conserva una copia y cómo se devuelve información en formatos útiles para las comunidades.",
      "Documente proveedor, ubicación o condiciones de alojamiento, exportación, conservación y salida del servicio. Pruebe la recuperación de datos antes de depender de una plataforma.",
    ],
    blocks: [
      {
        title: "Acuerdos que deben ser operables",
        paragraphs: [
          "FAIR aporta criterios de documentación e intercambio, mientras CARE ayuda a examinar beneficio colectivo y autoridad sobre datos indígenas. Ambos pueden contribuir a un arreglo territorial, siempre que sus principios se traduzcan en permisos y responsabilidades comprensibles para las personas involucradas. [R11, R12]",
          "BioScanner se propone fortalecer esta autonomía mediante revisión humana y colaboración con permisos. El equipo debe comprobar qué controles están habilitados en su cuenta y complementar la plataforma con acuerdos, respaldos y procedimientos de decisión. Un desarrollo regional y una interfaz en español facilitan apropiación, pero el control de datos se demuestra en la práctica. [E01, R01, R13]",
        ],
      },
    ],
    check:
      "Cada integrante puede explicar qué ve, qué puede modificar y quién autoriza compartirlo. Existe un mecanismo para resolver discrepancias y una copia recuperable del conjunto. Complete T02 y realice una prueba de exportación o de recuperación con datos de ensayo.",
    templates: ["T02"],
    resources: ["R10", "R11", "R12", "R15", "R16"],
  },
  {
    id: "a03",
    code: "A03",
    step: 2,
    title: "Diseñar un monitoreo ecológicamente válido",
    short: "Diseño del muestreo",
    result:
      "Un protocolo que especifique dónde, cuándo y cómo observar, y qué inferencias permite el diseño. La selección de cámaras o grabadores debe seguir a la pregunta ecológica y a la revisión del equipo científico.",
    procedureTitle: "Procedimiento",
    procedure: [
      "Delimite el área de inferencia y los estratos relevantes, como hábitat, régimen de inundación o presión humana. Registre zonas excluidas y razones de acceso.",
      "Defina la unidad de muestreo, el método de selección de estaciones y las ocasiones de observación. La ubicación dirigida a senderos puede aumentar detecciones, pero también modifica qué población de sitios representa el muestreo.",
      "Ajuste dispositivos, altura, orientación y configuración a los grupos de interés. Para identificar jaguares, evalúe estaciones dobles que permitan registrar ambos flancos.",
      "Programe campañas que cubran la variación temporal pertinente y puedan repetirse. Documente cambios de ubicación, equipo, vegetación frente al sensor y configuración.",
      "Defina desde el inicio cómo calcular esfuerzo efectivo y cómo tratar fallas, imágenes sin fecha, estaciones incompletas y observaciones que no pueden identificarse.",
    ],
    blocks: [
      {
        title: "Seleccionar métodos complementarios",
        table: {
          head: ["Método", "Aporta", "Debe documentarse"],
          rows: [
            ["Fototrampeo", "Detecciones y rasgos visibles", "Operación por estación y sensibilidad del dispositivo"],
            ["Acústica pasiva", "Actividad vocal y especies detectables por sonido", "Horario, duración, frecuencia de muestreo y ruido"],
            ["Observación territorial", "Contexto y cambios percibidos", "Autoría, condiciones, consentimiento y posibilidad de contraste"],
            ["Teledetección", "Cobertura y patrones espaciales", "Resolución, fecha, clasificación e incertidumbre"],
          ],
        },
        paragraphs: [
          "Los manuales en español de México y Ecuador permiten preparar el componente de campo; sus ejemplos deben adaptarse al objetivo y al paisaje. La combinación de cámaras y acústica en Tech4Nature amplió el inventario observado, mostrando la utilidad de conservar la procedencia de cada detección. [R19, R20, R04]",
        ],
      },
    ],
    check:
      "El protocolo permite repetir el muestreo y conocer sus sesgos. Cuando se pretenda estimar densidad u ocupación, obtenga revisión especializada antes de instalar la red. Producto: T03.",
    templates: ["T03"],
    resources: ["R19", "R20", "R49", "R50", "R51"],
  },
  {
    id: "a04",
    code: "A04",
    step: 2,
    title: "Operar el campo y conservar el registro original",
    short: "Operación de campo",
    result:
      "Datos vinculados a despliegues verificables, con respaldo y un procedimiento de mantenimiento que pueda sostener el equipo territorial. La calidad comienza con la instalación y continúa después de retirar una tarjeta de memoria.",
    procedureTitle: "Procedimiento",
    procedure: [
      "Asigne identificadores estables al sitio, dispositivo y despliegue. Un despliegue corresponde a un equipo en un lugar y periodo definidos; al moverlo o reiniciar una campaña, genere un nuevo registro.",
      "Antes de instalar, revise reloj y zona horaria, batería, memoria, prueba de detección y configuración. Registre coordenadas, incertidumbre de posición, fotografías de instalación y condiciones de acceso.",
      "En cada visita anote apertura y cierre, mantenimiento, fallas y cambios. Si no conoce el momento exacto de una falla, registre el intervalo de incertidumbre y la regla conservadora usada para calcular esfuerzo.",
      "Copie los medios originales sin sobrescribirlos. Separe originales, versiones de trabajo y productos; relacione cada archivo con su despliegue y verifique que el respaldo pueda recuperarse.",
      "Use formularios adecuados a conectividad y alfabetización digital. Pruebe una transferencia completa desde campo hasta el equipo revisor, incluida la devolución de resultados.",
    ],
    blocks: [
      {
        title: "Acústica y condiciones territoriales",
        paragraphs: [
          "En monitoreo acústico registre programación, duración y frecuencia de muestreo, además de condiciones que afectan el sonido. Conserve grabaciones de referencia y anote ruidos o eventos que puedan sesgar detecciones. Arbimon y BirdNET ofrecen rutas de análisis complementarias, mientras la selección y validación local de sonidos conserva el control científico del resultado. [R24, R25, R26]",
          "El plan operativo debe reconocer tiempos y responsabilidades de líderes de conservación, transporte, seguridad, acceso a predios y reposición de equipos. Los tres formularios digitales piloto de Tech4Nature ofrecen un aprendizaje de diseño: el registro funciona cuando acompaña la actividad real y puede ser completado y revisado por quienes la realizan. [E01]",
        ],
      },
    ],
    check:
      "Seleccione un archivo al azar y reconstruya su origen, fecha, equipo y despliegue; después seleccione una estación y determine su esfuerzo efectivo. Productos: T03 y T04.",
    templates: ["T03", "T04"],
    resources: ["R14", "R21", "R22", "R23"],
  },
  {
    id: "a05",
    code: "A05",
    step: 3,
    title: "Trabajar con BioScanner y revisión humana",
    short: "Uso de BioScanner",
    result:
      "Un conjunto de observaciones revisadas que conserve su relación con los medios originales y pueda utilizarse en un análisis acordado. BioScanner permite acercar este trabajo a equipos con distintos niveles de experiencia y construir una interpretación compartida de los registros. [R01, E01]",
    procedureTitle: "Recorrido de aplicación",
    procedure: [
      "Acceda a BioScanner, revise las condiciones aplicables y acuerde quién administra el espacio de trabajo. Configure la colaboración y compruebe permisos con un conjunto de prueba.",
      "Seleccione un lote pequeño cuyos archivos tengan procedencia conocida. Vincule sitio, campaña y despliegue mediante las funciones disponibles o una tabla externa de referencia.",
      "Ejecute el análisis asistido y revise ejemplos de cada categoría, incluidas imágenes sin animales, detecciones difíciles y registros de interés para la conservación.",
      "Valide taxonomía y evidencia con personas que conozcan la fauna. Conserve identificaciones inciertas como tales y registre las correcciones; evite forzar una especie cuando la imagen no lo permite.",
      "Revise las agrupaciones de archivos en eventos y las propuestas de identidad individual. Antes de comparar campañas, compruebe fechas, estaciones y esfuerzo.",
      "Genere el informe, registre fecha de corte y revisión realizada, y explique a las instituciones usuarias qué resultados están listos para interpretación y cuáles siguen en proceso.",
    ],
    blocks: [
      {
        title: "Comprobar la calidad de la IA",
        paragraphs: [
          "Construya una muestra de evaluación separada del entrenamiento y de los ajustes del modelo. Incluya distintos sitios, cámaras, condiciones de luz y especies difíciles; revise también una muestra de archivos clasificados como vacíos para detectar omisiones. Mida precisión y sensibilidad por clase, con denominadores y tamaño de muestra. Una exactitud general puede ocultar errores importantes en especies poco frecuentes.",
          "Si selecciona deliberadamente una muestra con muchos casos raros, sus métricas describen ese conjunto de prueba; para estimar desempeño en todo el archivo debe tener en cuenta el diseño de selección. La decisión sobre uso científico depende del error aceptable para la pregunta, no de un porcentaje universal.",
        ],
      },
    ],
    check:
      "Cada resultado prioritario puede rastrearse al archivo y a la revisión; el reporte identifica su universo y fecha. Productos: T04 y T05. El repositorio público actual de BioScanner queda como recurso por habilitar. [R03]",
    templates: ["T04", "T05"],
    resources: ["R01", "R02", "R03"],
  },
  {
    id: "a06",
    code: "A06",
    step: 3,
    title: "Construir un catálogo verificable de jaguares",
    short: "Identidades de jaguar",
    result:
      "Un catálogo versionado de identidades con evidencia suficiente para revisar cada asignación. Las rosetas permiten comparar individuos, pero la calidad de imagen, el flanco visible y la continuidad del historial condicionan la confiabilidad de las coincidencias.",
    procedureTitle: "Procedimiento",
    procedure: [
      "Separe detección de jaguar e identificación de individuo. Primero confirme la especie; después seleccione imágenes con calidad suficiente para comparar patrones.",
      "Agrupe referencias por flanco y conserve archivo, fecha y sitio. Evite asumir que dos flancos no vinculados pertenecen al mismo individuo.",
      "Use las coincidencias sugeridas por la herramienta como candidatos. Dos revisores deben examinar los registros prioritarios y documentar acuerdos y discrepancias.",
      "Asigne un identificador persistente a cada individuo confirmado. Mantenga estados “candidato”, “confirmado”, “sin resolución” y un historial cuando se unan o separen identidades.",
      "Distinga individuos únicos acumulados, individuos observados en una campaña y estimaciones poblacionales. Registre el esfuerzo y los supuestos del análisis que acompañe al catálogo.",
    ],
    blocks: [
      {
        title: "De una recaptura a una pregunta territorial",
        paragraphs: [
          "En Tech4Nature, el registro del mismo jaguar en sitios separados por unos 40 km sustenta una recaptura espacial y una pregunta de conectividad entre áreas. Su utilidad es orientar seguimiento y colaboración; el trayecto, los tiempos de desplazamiento y las barreras efectivamente atravesadas no se reconstruyen con dos observaciones. [E01, E02]",
          "El catálogo puede aportar historiales para estudios de captura y recaptura espacial cuando existe un diseño apropiado y revisión experta. También permite consultas descriptivas sobre la última observación confirmada y los sitios de recaptura. Una ausencia de imágenes reciente debe interpretarse junto con esfuerzo, fallas y probabilidad de detección.",
        ],
      },
    ],
    check:
      "Un revisor independiente puede reconstruir por qué se asignó cada identidad y reconocer cuáles siguen abiertas. La cifra pública corresponde a una versión y un periodo definidos. Producto: T06.",
    templates: ["T06"],
    resources: ["R19", "R20", "R51", "R54"],
  },
  {
    id: "a07",
    code: "A07",
    step: 3,
    title: "Interpretar biodiversidad con esfuerzo comparable",
    short: "Análisis ecológico",
    result:
      "Indicadores cuyo significado ecológico sea claro y cuya comparación sea defendible. Antes de calcular un índice, defina la unidad de análisis, el periodo, el área, el método y los registros que cumplen el control de calidad.",
    procedureTitle: "Procedimiento",
    procedure: [
      "Revise identificaciones, duplicados, sitios y fechas; conserve una lista de exclusiones con su razón.",
      "Documente cómo se agrupan fotografías en eventos y pruebe si cambiar esa regla modifica las conclusiones. Un intervalo temporal de separación no demuestra independencia biológica.",
      "Compare campañas con esfuerzo y condiciones compatibles. Si cambió el diseño, analice esa diferencia o limite la comparación a un subconjunto justificable.",
      "Presente intervalos de incertidumbre cuando corresponda, tamaños de muestra y límites. Para inferir efectos de una intervención, examine factores alternativos y un diseño de evaluación adecuado.",
    ],
    blocks: [
      {
        title: "Qué significa cada indicador",
        table: {
          head: ["Pregunta o indicador", "Requisito", "Interpretación adecuada"],
          rows: [
            ["Riqueza observada", "Taxonomía revisada y método explícito", "Número de especies detectadas dentro del esfuerzo realizado"],
            ["Último registro confirmado", "Fecha válida y evidencia revisada", "Fecha de la observación más reciente disponible"],
            ["Actividad horaria", "Horas correctas y regla de eventos", "Distribución temporal de detecciones bajo el protocolo"],
            ["Detecciones por 100 días cámara", "Eventos comparables y esfuerzo efectivo", "Índice de detección; no equivale automáticamente a abundancia"],
            ["Shannon, Simpson o Chao1", "Unidad y datos apropiados para el estimador", "Resumen dependiente del muestreo y sus supuestos"],
            ["Ocupación o densidad", "Diseño específico y modelo de observación", "Estimación con incertidumbre y evaluación de supuestos"],
          ],
        },
      },
      {
        title: "Ejemplo didáctico",
        example:
          "24 eventos en 1,200 días cámara equivalen a 2 eventos por 100 días cámara; 30 eventos en 3,000 días cámara equivalen a 1. Las fotografías o detecciones pueden aumentar mientras disminuye el índice ajustado por esfuerzo. Ninguno de estos valores demuestra por sí mismo una variación de la población.",
      },
    ],
    check: "Otra persona puede recalcular el indicador y explicar qué representa. Productos: T05 y T07.",
    templates: ["T05", "T07"],
    resources: ["R49", "R50", "R51"],
  },
  {
    id: "a08",
    code: "A08",
    step: 4,
    title: "Preparar mapas útiles con herramientas accesibles",
    short: "Cartografía accesible",
    result:
      "Un mapa que integre evidencia ecológica, contexto territorial y límites de interpretación. Puede comenzar con visores públicos y avanzar a QGIS cuando necesite combinar capas, controlar el análisis o preparar productos institucionales.",
    procedureTitle: "Ruta sin programación",
    procedure: [
      "Ubique el territorio en un visor y consulte límites oficiales, cobertura y registros existentes. Anote fuente, fecha, escala y condiciones de uso de cada capa.",
      "Explore dos periodos comparables en Copernicus Browser o Dynamic World y señale zonas donde sería útil verificar un cambio. Registre fechas y condiciones de visibilidad.",
      "En QGIS, cargue límites y estaciones, establezca el sistema de coordenadas y compruebe que las geometrías coinciden correctamente.",
      "Cruce registros validados con hábitats y presión territorial; resuma por unidades de gestión apropiadas. Prepare una versión de trabajo y otra pública con el detalle sensible generalizado.",
      "Incluya leyenda, escala, fechas, procedencia e incertidumbre. Revise el mapa con líderes de conservación y equipos gestores antes de proponer una acción.",
    ],
    blocks: [
      {
        title: "Elegir el dato que responde a la pregunta",
        paragraphs: [
          "La cobertura describe lo que ocupa la superficie; el uso del suelo se refiere a actividades humanas y requiere otras fuentes para interpretarse. Una pérdida detectada por satélite puede originarse en procesos distintos. La verificación de campo y la documentación institucional permiten relacionar el cambio cartográfico con su causa y con una posible respuesta. [R46, R47]",
          "Para manglares, combine una fuente específica como Global Mangrove Watch con conocimiento hidrológico y observación local. Para conectividad, diferencie continuidad de cobertura, hipótesis modeladas y registros de movimiento. Circuitscape puede examinar conectividad potencial, siempre que la resistencia del paisaje tenga una justificación ecológica y se analicen escenarios. [R45, R48]",
        ],
      },
    ],
    check:
      "Cada capa tiene una ficha de procedencia y cada propuesta un responsable de verificarla. La versión pública protege coordenadas sensibles y no presenta un polígono de análisis como una zona decretada. Producto: T07.",
    templates: ["T07"],
    resources: ["R16", "R30", "R31", "R32", "R33", "R34", "R45", "R47"],
  },
  {
    id: "a09",
    code: "A09",
    step: 4,
    title: "Analizar cambios de cobertura en Earth Engine",
    short: "Análisis en Earth Engine",
    result:
      "Un análisis reproducible que compare cobertura en periodos definidos y produzca candidatos de cambio para validación. Esta ruta requiere una persona con experiencia geoespacial; los visores de A08 ofrecen una entrada previa sin programación.",
    procedureTitle: "Receta de trabajo",
    procedure: [
      "Registre un proyecto de Google Cloud con Earth Engine, compruebe elegibilidad y cuotas, y documente quién administra el acceso. La disponibilidad gratuita depende del uso y de la institución. [R35, R36]",
      "Cargue un polígono autorizado y seleccione periodos equivalentes dentro del ciclo estacional. Guarde geometría, fechas, fuentes y versión del procedimiento.",
      "Abra los ejemplos oficiales de Sentinel 2 o Dynamic World. Aplique control de nubes y construya compuestos que permitan comparar observaciones válidas. [R37, R38]",
      "Para Dynamic World, conserve probabilidades y número de observaciones; trate baja confianza y falta de datos como tales. Defina una regla de agregación temporal y evalúe su sensibilidad antes de interpretar transiciones.",
      "Calcule una matriz de cambios sobre el área efectivamente comparable, con resolución y proyección apropiadas. Exporte el mapa, las superficies, la máscara de calidad y los parámetros.",
      "Valide una muestra independiente mediante imágenes y observación de campo. Cuando el diseño lo permita, estime exactitud y superficies ajustadas con incertidumbre; documente desacuerdos y recalcule.",
    ],
    blocks: [
      {
        title: "Alternativas y ampliaciones",
        paragraphs: [
          "Hansen Global Forest Change permite explorar pérdida de cobertura arbórea y orientar verificación. SEPAL ofrece flujos guiados; Collect Earth Online puede apoyar interpretación de muestras. Planet aporta mosaicos de mayor detalle bajo condiciones de licencia y acceso que deben presupuestarse. Ninguna fuente debe elegirse únicamente por su resolución nominal. [R39, R40, R41, R43, R44]",
          "Un ejemplo de pregunta viable es “¿qué zonas muestran cambios persistentes de cobertura entre periodos comparables y cuáles coinciden con sitios de interés para seguimiento?”. Atribuir esos cambios a actividades específicas o concluir efectos sobre jaguares exige información adicional.",
        ],
      },
    ],
    check:
      "Otra persona puede repetir el análisis con los mismos parámetros y distinguir cambio probable de cambio verificado. Producto: T07. Los ejemplos de código oficiales están enlazados en las fichas de los catálogos.",
    templates: ["T07"],
    resources: ["R35", "R36", "R37", "R38", "R39", "R43", "R44"],
  },
  {
    id: "a10",
    code: "A10",
    step: 5,
    title: "Convertir resultados en acciones de gestión",
    short: "Gestión y Lista Verde",
    result:
      "Un expediente breve que conecte evidencia validada con opciones de actuación, responsabilidades y seguimiento. La presentación debe adaptarse al procedimiento institucional y a los derechos de quienes pueden verse afectados.",
    procedureTitle: "Procedimiento",
    procedure: [
      "Defina la decisión y su ámbito: priorización de verificación, actualización de manejo, restauración, convivencia con fauna o coordinación entre áreas. Identifique quién tiene atribuciones y quién debe participar.",
      "Prepare una síntesis con hallazgo, método, incertidumbre y ubicación generalizada. Distinga registro observado, interpretación científica y recomendación.",
      "Formule opciones con sus implicaciones de costo, factibilidad, derechos y seguimiento. Incluya una alternativa de investigación adicional cuando la evidencia sea insuficiente.",
      "Discuta las opciones con los actores pertinentes y registre acuerdos, desacuerdos y tareas. Vincule la acción seleccionada a un instrumento, presupuesto o responsable operativo.",
      "Revise después si la información fue utilizada, qué medida se ejecutó y qué respuesta ecológica o social puede evaluarse.",
    ],
    blocks: [
      {
        title: "Usar la Lista Verde como herramienta de aprendizaje",
        paragraphs: [
          "Los componentes de gobernanza, diseño, manejo y resultados de conservación de la Lista Verde ayudan a organizar necesidades de evidencia. La autoevaluación preparatoria puede orientar un plan de mejora, mientras los procedimientos formales del estándar determinan el reconocimiento correspondiente. Cada institución debe utilizar la versión y adaptación que le sean aplicables. [R53]",
          "En Tech4Nature, las autoevaluaciones de Dzilam y Ría Lagartos se acompañaron con materiales para traducir hallazgos en acciones. La lección consiste en hacer que cada brecha tenga evidencia identificada, responsable y fecha de revisión. No corresponde convertir las puntuaciones de una herramienta particular en una medida universal de salud ecológica. [E01]",
        ],
      },
      {
        title: "Conectividad y convivencia",
        paragraphs: [
          "Cuando las observaciones atraviesan jurisdicciones, acuerde un protocolo de intercambio y una agenda conjunta. Para incidentes con fauna, verifique la evidencia con especialistas y actores afectados antes de decidir la respuesta; las imágenes no bastan para atribuir un ataque o identificar responsables. [R56]",
        ],
      },
    ],
    check:
      "Existe una acción trazable o una necesidad de información claramente asignada. Producto: T08; seguimiento mediante T10.",
    templates: ["T08", "T10"],
    resources: ["R09", "R52", "R53", "R54", "R56"],
  },
  {
    id: "a11",
    code: "A11",
    step: 5,
    title: "Financiar la continuidad y operar con eficiencia",
    short: "Financiamiento y operación",
    result:
      "Un modelo de operación que cubra personas, campo, datos, tecnología y uso de resultados durante un horizonte realista. El costo de adquirir equipos es una parte del compromiso financiero.",
    procedureTitle: "Procedimiento",
    procedure: [
      "Presupueste remuneración de líderes de conservación, coordinación, revisión científica, traslado, permisos operativos, seguridad y devolución de resultados.",
      "Incluya reemplazo y mantenimiento de dispositivos, conectividad, almacenamiento, revisión de datos, soporte de plataforma y actualización de capacidades.",
      "Compare tres escenarios: operación mínima viable, continuidad completa y expansión. Para cada uno defina qué preguntas puede responder, qué área cubre y qué tareas quedan financiadas.",
      "Separe recursos confirmados, aportaciones en especie y oportunidades por gestionar. Un compromiso de nube debe incluir duración, límites, salida y el costo posterior al apoyo.",
      "Reduzca procesamiento innecesario: reutilice modelos adecuados, pruebe lotes pequeños, evite ejecuciones duplicadas y conserve una política de archivo que respete el valor científico y los derechos.",
    ],
    blocks: [
      {
        title: "Financiar resultados sin anticipar ingresos inciertos",
        paragraphs: [
          "El monitoreo puede aportar a mecanismos de medición, reporte y verificación, conocidos como MRV, cuando existe una metodología pertinente. Los pagos por resultados y créditos de biodiversidad requieren definir línea base, adicionalidad, permanencia o duración, posibles desplazamientos de presión, reparto de beneficios y verificación. BioScanner puede contribuir al registro y revisión de evidencia; utilizarlo no acredita automáticamente un resultado financiero ni garantiza acceso a un mercado. [R61, R62]",
          "Una combinación viable puede incluir presupuesto público de manejo, filantropía, cooperación, aportaciones de socios y servicios autorizados. Los ingresos emergentes deben evaluarse como una opción adicional mientras se asegura la operación básica. No trate el trabajo territorial no remunerado como un subsidio permanente al desarrollo tecnológico.",
        ],
      },
    ],
    check:
      "Cada actividad crítica tiene financiamiento o una decisión explícita de alcance. Existe un plan para recuperar datos y mantener responsabilidades si cambia un proveedor o termina una aportación. Producto: T09. Para estimar el componente computacional, use herramientas apropiadas y declare su alcance; CodeCarbon no sustituye una evaluación completa de ciclo de vida. [R59, R60]",
    templates: ["T09"],
    resources: ["R59", "R60", "R61", "R62"],
  },
  {
    id: "a12",
    code: "A12",
    step: 6,
    title: "Desarrollar capacidades y adaptar la iniciativa",
    short: "Capacidades y adopción",
    result:
      "Personas e instituciones que puedan sostener el trabajo, utilizar los resultados y decidir cómo adaptarlo. La adopción se evalúa por tareas y decisiones realizadas, además de cuentas abiertas o participantes en talleres.",
    procedureTitle: "Procedimiento",
    procedure: [
      "Diagnostique conocimientos previos, idiomas, accesibilidad, disponibilidad de tiempo y conectividad. Acuerde objetivos de aprendizaje con las personas que utilizarán las herramientas.",
      "Organice prácticas sobre tareas reales: registrar un despliegue, recuperar un respaldo, revisar una identificación, interpretar un mapa y explicar el alcance de un indicador.",
      "Combine acompañamiento entre pares con especialistas. Integre a estudiantes en problemas concretos de conservación con supervisión biológica, acuerdos de datos y reconocimiento de contribuciones.",
      "Evalúe autonomía mediante una tarea nueva y una revisión posterior. Registre dificultades de interfaz, tiempos de soporte y ajustes que requieren quienes trabajan en campo.",
      "Antes de ampliar, revise costos, desempeño local, legitimidad de los acuerdos y capacidad de devolución. Repita las pruebas cuando cambien ecosistemas, especies, dispositivos o idiomas.",
    ],
    blocks: [
      {
        title: "Adaptación regional",
        paragraphs: [
          "Compartir herramientas entre México, Centroamérica, el Caribe y Sudamérica requiere reconocer diferencias de instituciones, regímenes de propiedad, especies y conectividad digital. La colaboración regional puede aportar revisión experta y aprendizaje entre paisajes, mientras cada territorio conserva capacidad para definir preguntas y usos de información.",
          "El enfoque de Tech4Nature combina formación científica y tecnológica con liderazgo de conservación. Transferir esa experiencia implica financiar acompañamiento y responsabilidades locales, reconocer la autoría de conocimientos y reservar espacio para que las instituciones adapten el método. La plataforma debe evolucionar a partir de necesidades demostradas durante su uso. [R04, R66]",
        ],
      },
      {
        title: "Indicadores de adopción",
        list: [
          "Personas que completan una tarea acordada sin asistencia, sobre el total evaluado.",
          "Equipos que mantienen un ciclo completo de captura, revisión y devolución de resultados.",
          "Tiempo y barreras para participar, incluyendo diferencias de género, idioma y acceso digital.",
          "Decisiones documentadas que utilizan la evidencia y acciones de mejora completadas.",
        ],
      },
    ],
    check: "La ampliación propuesta tiene responsables, recursos y una prueba local de funcionamiento. Producto: T10.",
    templates: ["T10"],
    resources: ["R06", "R11", "R58", "R63", "R64"],
  },
];

// ---------------------------------------------------------------------------
// Contexto, caso y gestión

export const CONTEXT = {
  intro: [
    "América Latina y el Caribe necesita información adecuada y contextual que permita reconocer cambios en la integridad ecológica de los territorios, y las herramientas que permiten responder a ellos en territorios complejos donde convergen ecosistemas prioritarios para conservación y regeneración, producción, infraestructura y medios de vida.",
    "El monitoreo adquiere valor público cuando sus resultados pueden interpretarse, discutirse y utilizarse por las personas e instituciones que intervienen en esas dinámicas y toman decisiones.",
  ],
  cards: [
    {
      figure: "95%",
      label: "disminución media del Índice Planeta Vivo en ALC, 1970–2022",
      fact: "El Índice Planeta Vivo de 2026 reporta una disminución media del 95% en las poblaciones de vertebrados monitoreadas de América Latina y el Caribe entre 1970 y 2022. [R07]",
      implication: "Diseñar series comparables y registrar esfuerzo y detectabilidad.",
      note: "El indicador regional expresa un cambio proporcional agregado; no significa que desapareció el 95% de las especies o de los animales de la región.",
    },
    {
      figure: "18.69%",
      label: "cobertura terrestre global de áreas protegidas y OMEC",
      fact: "Protected Planet registra en octubre de 2026 cobertura global de áreas protegidas y otras medidas eficaces de conservación del 18.69% terrestre y de aguas continentales y 10.04% marina. [R08]",
      implication: "Evaluar la calidad y conectividad de la conservación junto con su extensión.",
      note: "Estas cifras son globales y de cobertura designada; no miden resultados locales.",
    },
    {
      figure: "85 / 58%",
      label: "uso de internet, población urbana / rural (2025)",
      fact: "En 2025 utiliza internet el 85% de la población urbana y el 58% de la rural a escala mundial, según la UIT. [R64]",
      implication: "Incluir captura sin conexión, formación, soporte y formatos ligeros.",
      note: "La conectividad de cada comunidad debe diagnosticarse directamente.",
    },
    {
      figure: "415 TWh",
      label: "consumo estimado de centros de datos en 2024",
      fact: "La AIE estima que los centros de datos consumieron unos 415 TWh en 2024, cerca del 1.5% de la electricidad mundial. [R60]",
      implication: "Seleccionar cómputo proporcional y documentar consumo.",
      note: "Es una cifra de centros de datos, no una medición de la huella de BioScanner ni de toda la IA por separado.",
    },
  ],
  mainstreaming: [
    "Este proceso consiste en incorporar evidencia de biodiversidad a procedimientos que son parte de las decisiones territoriales: programas de manejo, presupuestos, ordenamiento, educación, manejo productivo y evaluación de inversiones. Para hacerlo, el equipo debe identificar una institución usuaria, una decisión recurrente y el momento en que la evidencia puede influir en ella.",
    "Las metas 1, 3 y 14 del Marco Mundial de Biodiversidad ofrecen referentes de planeación, conservación e integración sectorial; las metas 20, 21, 22 y 23 orientan capacidades, conocimiento, participación y equidad. [R09]",
  ],
};

export const CASE = {
  intro: [
    "Tech4Nature México es una iniciativa co-liderada por C Minds, la Secretaría de Desarrollo Sustentable de Yucatán, el Grupo Chac Mool (líderes comunitarios de la Reserva Estatal de Dzilam), aliados científicos y tecnológicos dentro de la alianza global Tech4Nature de UICN y Huawei.",
    "El enfoque integral de la iniciativa combina monitoreo de biodiversidad, desarrollo de tecnología basada en IA para la detección de especies e identificación individual de jaguares, colaboración inter-institucional, soberanía de datos, inclusividad y accesibilidad; liderazgo local, fortalecimiento de capacidades tecnológicas y de conservación; acompañamiento en la toma de decisiones basadas en datos, y trabajo institucional colaborativo enfocado en proponer y liderar esfuerzos de conectividad biológica y biocultural en la costa norte de Yucatán. [R04, R66]",
  ],
  kpis: [
    {
      value: 146,
      prefix: "",
      suffix: "",
      label: "especies en el inventario integrado inicial",
      evidence: "Monitoreo con cámaras y acústica que documentó 146 especies en el inventario integrado inicial en fase piloto. [R04]",
      learning: "Combinar métodos amplía los grupos observados; conservar su procedencia evita duplicar especies y confundir inventarios con censos completos.",
    },
    {
      value: 333099,
      prefix: "",
      suffix: "",
      label: "archivos incorporados a BioScanner (sept. 2026)",
      evidence: "333,099 archivos incorporados a BioScanner de septiembre de 2026: 317,577 fotografías y 15,522 videos, procedentes de 20 análisis. [E01]",
      learning: "La escala exige un flujo de revisión, metadatos consistentes y trazabilidad. El volumen de archivos es capacidad operativa, no número de animales.",
    },
    {
      value: 40,
      prefix: "~",
      suffix: " km",
      label: "entre sitios de reidentificación de un mismo jaguar",
      evidence: "Reidentificación de un jaguar en sitios separados por aproximadamente 40 km entre Dzilam y su transición hacia Ría Lagartos. [E01, E02]",
      learning: "Una recaptura espacial permite formular preguntas y priorizar estudios de conectividad; el recorrido entre registros necesita evidencia adicional.",
    },
    {
      value: 17,
      prefix: "",
      suffix: "",
      label: "entrevistas para el programa de manejo",
      evidence: "17 entrevistas para aportar a la actualización del programa de manejo y tres formularios digitales piloto de campo. [E01]",
      learning: "El diseño de información debe integrar actividades, conocimientos y necesidades de quienes habitan y administran el territorio.",
    },
    {
      value: 2,
      prefix: "",
      suffix: "",
      label: "autoevaluaciones GL SAT (Dzilam y Ría Lagartos)",
      evidence: "Autoevaluaciones preparatorias GL SAT en Dzilam y Ría Lagartos y aprendizaje compartido con la Reserva Biocultural del Puuc. [E01]",
      learning: "Traducir criterios de gestión en evidencia, responsables y acciones pendientes; la preparación es distinta de la certificación.",
    },
    {
      value: 0,
      prefix: "",
      suffix: "",
      text: "Formación",
      label: "de líderes de conservación y estudiantes",
      evidence: "Formación de líderes de conservación y participación estudiantil en desarrollo y revisión de modelos. [R04, R66]",
      learning: "Financiar responsabilidades territoriales y combinar conocimiento biológico con capacidades digitales.",
    },
  ],
  sources: [
    {
      code: "E01",
      title: "Informe técnico final de Tech4Nature México",
      detail: "C Minds y aliados, 2026. Documento de trabajo; distingue resultados revisados de análisis ecológicos pendientes. Versión pública por habilitar.",
    },
    {
      code: "E02",
      title: "Estudio de conectividad entre Dzilam y Ría Lagartos",
      detail: "Documento de evidencia de 2026 proporcionado por C Minds. Insumo de conectividad; síntesis autorizada por habilitar.",
    },
  ],
};

export const GOVERNANCE = {
  intro:
    "El valor del monitoreo depende de su incorporación a procesos donde existen autoridad, participación y capacidad de actuar. En Dzilam, la presencia de fauna y las relaciones entre hábitats han aportado una base para discutir protección territorial, conectividad y cooperación entre reservas. El jaguar funciona como especie focal porque sus requerimientos de presas, hábitat y desplazamiento permiten estudiar procesos a escala de paisaje. [R54]",
  policy: [
    "El Acuerdo 76 de 2024 amplió la Reserva Estatal de Dzilam hasta 104,304.315113 hectáreas. Su fundamentación incorpora estudios biológicos con cámaras trampa, registros de jaguar en zonas aledañas y la necesidad de reforzar la conectividad ecológica. Tech4Nature se inscribe en este proceso mediante la generación de evidencia y la colaboración territorial; la decisión corresponde al Gobierno de Yucatán y reúne varios instrumentos y aportaciones. [R65, R66]",
    "Para replicar esta contribución, conserve una cadena documental que conecte registros, análisis, entrega a la autoridad, discusión y resolución. La superficie total designada debe distinguirse de la superficie muestreada y de las áreas donde se implementan medidas concretas de manejo.",
  ],
  chain: ["Registros", "Análisis", "Entrega a la autoridad", "Discusión", "Resolución"],
  coordination: [
    "El trabajo hacia Ría Lagartos ha producido insumos de conectividad y una propuesta de zona de acción conjunta; su utilidad consiste en estructurar preguntas, responsabilidades y posibilidades de colaboración entre jurisdicciones. La actualización del programa de manejo y las entrevistas territoriales permiten incorporar actividades económicas, derechos y conocimiento local a esa discusión. [E01, E02]",
    "Los líderes de conservación participan en la definición del trabajo, el mantenimiento de los registros y la interpretación de las condiciones de campo. La formación digital, las responsabilidades remuneradas y espacios como el Festival Chac Mool conectan conservación, aprendizaje y vida comunitaria. Evaluar estas contribuciones requiere observar autonomía, continuidad y capacidad de decisión, además de asistencia a actividades. [E01, R66]",
  ],
  apply: [
    "Identifique el proceso público o comunitario que puede utilizar los resultados y su calendario.",
    "Acuerde con quienes aportan conocimiento cómo participarán en la interpretación y los beneficios.",
    "Asigne una persona responsable de preparar evidencia para la decisión y otra de documentar su seguimiento.",
    "Mantenga explícito qué se observó, qué se propone y qué ha sido adoptado formalmente.",
  ],
};

// ---------------------------------------------------------------------------
// Diagnóstico de preparación

export const READINESS = {
  intro:
    "Realice esta revisión con representantes territoriales, responsables científicos y la institución que utilizará los resultados. Para cada condición registre “disponible”, “requiere fortalecimiento” o “pendiente”, junto con una persona responsable y una fecha. Las condiciones pendientes definen el trabajo inicial; no son una clasificación de mérito entre comunidades.",
  conditions: [
    { id: "pregunta", title: "Pregunta y uso de resultados", evidence: "Una decisión identificada, su responsable y el dato necesario para informarla." },
    { id: "participacion", title: "Participación y derechos", evidence: "Acuerdos de acceso al territorio, participación y usos del conocimiento y de los registros." },
    { id: "ecologica", title: "Responsabilidad ecológica", evidence: "Una persona capaz de revisar el diseño, identificación de especies e interpretación." },
    { id: "campo", title: "Capacidad de campo", evidence: "Líderes de conservación, equipo, seguridad, transporte y mantenimiento presupuestados." },
    { id: "datos", title: "Gobernanza de datos", evidence: "Roles para revisar, compartir, autorizar usos secundarios y atender solicitudes." },
    { id: "conectividad", title: "Conectividad y respaldo", evidence: "Ruta viable de transferencia, copia recuperable y acceso de las personas responsables." },
    { id: "financiera", title: "Operación financiera", evidence: "Recursos para una campaña completa y devolución de resultados, incluidos salarios y revisión." },
    { id: "seguimiento", title: "Seguimiento", evidence: "Una reunión acordada para revisar evidencia, decisiones y ajustes." },
  ],
  scale: [
    "Un grupo que inicia puede trabajar con una pregunta acotada y acompañamiento científico. Una red de reservas necesitará armonizar protocolos, permisos y versiones de datos. Una universidad que desarrolla modelos debe garantizar acceso autorizado a datos y una evaluación independiente del conjunto de entrenamiento. La complejidad debe crecer cuando estas capacidades funcionan de forma comprobable.",
    "Acordar el uso de resultados antes de comprar equipos reduce el riesgo de acumular datos que nadie puede interpretar o utilizar. Cuando no exista conectividad suficiente, organice captura local, transferencia periódica y sesiones presenciales de revisión; BioScanner puede formar parte del análisis posterior sin exigir que la conectividad esté disponible en cada sitio de muestreo.",
  ],
  product:
    "Producto de esta revisión: ficha T01 y lista de condiciones con responsables. Mantenga abiertos los temas de gobernanza que requieren decisiones colectivas y evite sustituirlas por un puntaje agregado.",
};

// ---------------------------------------------------------------------------
// Práctica

export const NINETY_DAYS = {
  intro:
    "La siguiente secuencia orientativa permite organizar el arranque de una iniciativa. Las duraciones deben ajustarse a procesos de participación, temporadas de campo, acceso y disponibilidad institucional. El calendario no sustituye un diseño de monitoreo ni representa el tiempo requerido para demostrar cambios ecológicos.",
  periods: [
    { range: "Días 1 a 15", work: "Reunir actores, definir pregunta, identificar decisión y revisar condiciones de participación.", product: "T01 completo y responsabilidades iniciales acordadas." },
    { range: "Días 16 a 30", work: "Acordar gobernanza; diseñar muestreo; presupuestar campaña y devolución.", product: "T02, T03 y T09 revisados por los responsables." },
    { range: "Días 31 a 45", work: "Probar equipos y formularios, registrar despliegues y ensayar recuperación de archivos.", product: "Datos de ensayo rastreables y plan de mantenimiento." },
    { range: "Días 46 a 60", work: "Probar BioScanner, revisar errores y documentar necesidades de capacitación.", product: "T04 y T05 completos para el lote de prueba." },
    { range: "Días 61 a 75", work: "Preparar un primer análisis descriptivo y un mapa con sus límites.", product: "Informe revisado y T07 con fuentes y parámetros." },
    { range: "Días 76 a 90", work: "Devolver resultados, revisar decisiones posibles y ajustar operación.", product: "T08, T10 y presupuesto de continuidad actualizado." },
  ],
  combos: [
    {
      title: "Inicio con conectividad limitada",
      text: "Formularios en papel o captura local con KoboToolbox, almacenamiento con respaldo y revisión periódica en BioScanner cuando exista conexión. QGIS permite preparar mapas locales.",
      tools: ["R21", "R01", "R30"],
    },
    {
      title: "Equipo gestor con apoyo técnico",
      text: "BioScanner, formularios digitales, cartografía oficial y visores satelitales; reuniones regulares de interpretación y seguimiento de acciones.",
      tools: ["R01", "R21", "R46", "R32"],
    },
    {
      title: "Red científica o interinstitucional",
      text: "Lo anterior más estándares de intercambio, análisis estadístico y Earth Engine, con responsabilidades explícitas para métodos, revisión y mantenimiento.",
      tools: ["R15", "R49", "R50", "R35"],
    },
  ],
  closing:
    "La selección puede cambiar al probar el flujo completo. Si los datos no pueden recuperarse, revisarse o usarse en una decisión, resuelva ese punto antes de aumentar dispositivos, volumen o territorio. Recursos de inicio: [R01, R21, R30, R32].",
};

export const EXERCISE = {
  intro:
    "Ejemplo didáctico propuesto por este toolkit. Las cifras siguientes son ficticias y sirven para aprender a interpretar esfuerzo y calidad; no son resultados de Tech4Nature México.",
  situation:
    "Una reserva quiere saber si cambió la frecuencia de detección de una especie focal entre dos campañas y qué sitios requieren seguimiento. El equipo mantiene diez estaciones, pero algunos dispositivos fallan y una parte de las identificaciones automáticas queda sin resolver.",
  table: {
    head: ["Variable", "Campaña A", "Campaña B"],
    rows: [
      ["Esfuerzo planificado", "10 estaciones × 60 días", "10 estaciones × 60 días"],
      ["Esfuerzo efectivo documentado", "540 días cámara", "450 días cámara"],
      ["Eventos confirmados de la especie", "18", "20"],
      ["Eventos sin identificación resuelta", "3", "5"],
      ["Eventos confirmados por 100 días cámara", "3.33", "4.44"],
    ],
  } satisfies Table,
  campaigns: [
    { name: "Campaña A", planned: 600, effective: 540, confirmed: 18, unresolved: 3 },
    { name: "Campaña B", planned: 600, effective: 450, confirmed: 20, unresolved: 5 },
  ],
  howTo: [
    "Revise que las campañas tengan sitios, configuración y condiciones temporales comparables. Investigue la causa y distribución de las fallas.",
    "Reproduzca los cálculos: eventos confirmados divididos entre esfuerzo efectivo, multiplicados por 100. Mantenga separados los casos sin identificación resuelta.",
    "Examine los resultados por estación y la incertidumbre. La diferencia descriptiva no basta para afirmar un aumento de abundancia.",
    "Prepare un mapa generalizado de estaciones con fallas y detecciones. Proponga mantenimiento, revisión de casos inciertos y continuidad del diseño.",
    "Registre en T08 qué acción se acuerda y en T10 cuándo se evaluará su ejecución.",
  ],
  outcome:
    "Un equipo que completa la práctica puede explicar por qué 20 eventos no representan 20 individuos, por qué el esfuerzo real cambia la comparación y qué decisiones sí pueden tomarse. El aprendizaje verificable es la capacidad de transformar datos revisados en una acción razonada, conservando las preguntas que requieren más evidencia.",
  model: { tp: 45, fn: 5, fp: 15 },
};

// ---------------------------------------------------------------------------
// Plantillas

export type Template = {
  id: string;
  code: string;
  title: string;
  short: string;
  intro: string;
  table: Table;
  sections: Block[];
  control: string;
  actions: string[];
  resources: string[];
};

export const TEMPLATES: Template[] = [
  {
    id: "t01",
    code: "T01",
    title: "Ficha de diseño de la iniciativa",
    short: "Diseño de la iniciativa",
    intro:
      "Utilice esta ficha al inicio y actualícela cuando cambien la pregunta, el territorio o la decisión. Las respuestas deben acordarse con quienes aportan conocimiento y con quienes utilizarán los resultados.",
    table: {
      head: ["Campo", "Información que debe completar"],
      rows: [
        ["Nombre y versión", "Nombre de la iniciativa, responsable de la ficha y fecha."],
        ["Territorio y alcance", "Área de trabajo, ecosistemas, jurisdicciones y escala de inferencia."],
        ["Actores y titulares de derechos", "Personas e instituciones participantes, representación y mecanismos propios de decisión."],
        ["Objeto de conservación", "Especie, ensamble, hábitat o proceso ecológico que orienta el trabajo."],
        ["Pregunta prioritaria", "Qué se necesita conocer, dónde y durante qué periodo."],
        ["Decisión y autoridad", "Qué decisión podrá tomar quién y en qué momento."],
        ["Teoría de cambio", "Acción → producto → uso → resultado esperado; supuestos entre cada relación."],
        ["Método y evidencia", "Diseño, fuentes, esfuerzo y revisión científica requeridos."],
        ["Condiciones de participación", "Acceso, consentimiento cuando corresponda, remuneración, devolución y resolución de desacuerdos."],
        ["Continuidad", "Costos, financiamiento confirmado, responsable de custodia y siguiente revisión."],
      ],
    },
    sections: [
      {
        title: "Ejemplo orientativo",
        example:
          "Pregunta: ¿en qué sectores de la transición entre dos áreas se repite la detección de la especie focal bajo campañas comparables? Decisión: seleccionar sitios de seguimiento conjunto. Producto: registros revisados y mapa de esfuerzo. Supuestos: acceso acordado, equipos operativos y capacidad de las instituciones para mantener la colaboración. Este ejemplo define una investigación; no presupone que exista un corredor funcional confirmado.",
      },
    ],
    control:
      "La pregunta cabe en una frase, el método puede responderla y la institución usuaria reconoce el producto que recibirá.",
    actions: ["A01"],
    resources: [],
  },
  {
    id: "t02",
    code: "T02",
    title: "Matriz de gobernanza y circulación de datos",
    short: "Gobernanza de datos",
    intro:
      "Use esta matriz como insumo para acuerdos adaptados al contexto. Complete nombres o cargos responsables y criterios de acceso; la plataforma elegida debe permitir ejecutar lo acordado o contar con un procedimiento complementario.",
    table: {
      head: ["Tipo de información", "Quién decide y con qué condición", "Nivel de circulación"],
      rows: [
        ["Archivos originales de fauna", "Custodia y revisión asignadas; propósito y periodo documentados.", "Equipo autorizado"],
        ["Coordenadas precisas", "Autoridad de acceso acordada; necesidad de uso y sensibilidad evaluadas.", "Acceso restringido"],
        ["Personas o actividades identificables", "Revisión específica de privacidad, finalidad y tratamiento.", "Acceso restringido o exclusión de copia pública"],
        ["Conocimiento territorial o cultural", "Titulares e instancias legítimas determinan usos y representación.", "Según acuerdos específicos"],
        ["Datos revisados para investigación", "Autorización para uso, atribución, devolución y publicación.", "Intercambio bajo acuerdo"],
        ["Resultados públicos agregados", "Revisión científica y territorial de texto, mapas y medios.", "Público con fuente y límites"],
      ],
    },
    sections: [
      {
        title: "Preguntas que el acuerdo debe resolver",
        list: [
          "¿Quién autoriza nuevos usos, incluido entrenamiento de IA, y cómo se informa a las personas involucradas?",
          "¿Cómo se conserva la autoría y cómo se comparten beneficios, capacidades y resultados?",
          "¿Qué procedimiento permite corregir, restringir o retirar acceso sin perder la trazabilidad necesaria?",
          "¿Dónde se conserva la copia recuperable y quién mantiene acceso si termina una aportación o cambia un proveedor?",
          "¿Qué canal permite resolver desacuerdos y cuándo se revisarán los permisos?",
        ],
      },
    ],
    control:
      "Prueba operativa: cree cuentas de ensayo con roles distintos y compruebe qué pueden ver, cambiar y exportar. Registre diferencias entre el acuerdo y las funciones habilitadas.",
    actions: ["A02"],
    resources: ["R11", "R12", "R16"],
  },
  {
    id: "t03",
    code: "T03",
    title: "Registro de despliegue y esfuerzo de campo",
    short: "Despliegue y esfuerzo",
    intro:
      "Una fila debe representar un despliegue definido de un dispositivo. Conserve un historial separado de visitas y fallas para reconstruir el periodo efectivo de observación. El esquema siguiente es adaptable y no pretende ser una exportación certificada de un estándar.",
    table: {
      head: ["Grupo de campos", "Contenido"],
      rows: [
        ["Identificación", "Iniciativa; campaña; sitio; estación; dispositivo; identificador único del despliegue."],
        ["Ubicación", "Coordenadas; sistema de referencia; incertidumbre; hábitat; criterio de selección; nivel de sensibilidad."],
        ["Operación", "Inicio y fin con zona horaria; configuración; tipo de medio; prueba de funcionamiento; responsables."],
        ["Visitas y fallas", "Fecha; tarea; batería y memoria; cambio de configuración; falla conocida o intervalo incierto."],
        ["Esfuerzo", "Tiempo operativo documentado; exclusiones; regla usada ante incertidumbre; persona que revisó."],
        ["Archivo", "Ruta o identificador del lote; número de archivos transferidos; copia de respaldo y comprobación."],
      ],
    },
    sections: [
      {
        title: "Lista de comprobación en una visita",
        list: [
          "Comprobar reloj, zona horaria y funcionamiento sin alterar el registro anterior.",
          "Registrar cualquier cambio de ubicación, orientación, configuración o dispositivo.",
          "Anotar el intervalo de operación comprobable y las incertidumbres.",
          "Relacionar la tarjeta o lote con el despliegue y completar la transferencia con respaldo.",
          "Devolver al equipo territorial los problemas encontrados y la acción de mantenimiento acordada.",
        ],
      },
      {
        title: "Ejemplo didáctico",
        example:
          "Si dos cámaras registran ambos flancos en una misma estación, documente esfuerzo por dispositivo y también por estación. No sume automáticamente ambas unidades para un indicador definido por estación. Si el momento de una falla es incierto, conserve el intervalo y justifique el tratamiento analítico.",
      },
    ],
    control: "Cada fila corresponde a un despliegue verificable y su esfuerzo puede reconstruirse desde el historial de visitas.",
    actions: ["A03", "A04"],
    resources: ["R19", "R20", "R21", "R22"],
  },
  {
    id: "t04",
    code: "T04",
    title: "Registro de calidad y trazabilidad",
    short: "Calidad y trazabilidad",
    intro:
      "Organice una cola de revisión que permita priorizar problemas y conservar decisiones. Las correcciones deben mantener una relación verificable con el dato original.",
    table: {
      head: ["Problema", "Registro requerido", "Criterio de resolución"],
      rows: [
        ["Fecha inconsistente", "Archivo, valor original, fuente de corrección, responsable.", "Fecha corroborada o exclusión del análisis temporal."],
        ["Estación sin asignar", "Archivo, lote, despliegues posibles y evidencia disponible.", "Vínculo confirmado o registro retenido sin análisis espacial."],
        ["Taxón incierto", "Predicción, evidencia, revisión y grado de resolución.", "Identificación sustentada o categoría taxonómica más amplia."],
        ["Identidad de jaguar discutida", "Imágenes comparadas, flanco y dictamen de revisores.", "Asignación confirmada o estado sin resolución."],
        ["Duplicado", "Identificadores comparados y criterio de duplicación.", "Una representación analítica sin eliminar la procedencia."],
        ["Información sensible", "Tipo de sensibilidad y autorización de tratamiento.", "Versión de circulación adecuada y original controlado."],
      ],
    },
    sections: [
      {
        title: "Campos mínimos de la bitácora",
        paragraphs: [
          "Identificador del problema; archivo o registro afectado; fecha de detección; versión de datos; estado; persona asignada; evidencia de la corrección; decisión; fecha de cierre; análisis que debe recalcularse.",
        ],
      },
      {
        title: "Comprobación de un lote antes de analizar",
        list: [
          "Todos los registros incluidos tienen un vínculo suficiente con su procedencia.",
          "Las fechas y estaciones cumplen los requisitos del análisis previsto.",
          "La revisión taxonómica corresponde al nivel de afirmación que se publicará.",
          "Las exclusiones y los problemas abiertos están cuantificados.",
          "Existe una versión congelada y una copia recuperable para repetir los cálculos.",
        ],
      },
    ],
    control:
      "Una observación puede ser útil para confirmar presencia y, al mismo tiempo, no ser apta para analizar actividad horaria. La calidad debe evaluarse frente a la pregunta.",
    actions: ["A04", "A05", "A07"],
    resources: ["R14", "R15"],
  },
  {
    id: "t05",
    code: "T05",
    title: "Ficha de evaluación de un modelo",
    short: "Evaluación de un modelo",
    intro:
      "Prepare esta ficha antes de usar resultados automáticos para sustentar una afirmación ecológica. Documente tanto el desempeño como las condiciones en que se midió.",
    table: {
      head: ["Campo", "Qué registrar"],
      rows: [
        ["Tarea y versión", "Detección, clasificación o identificación individual; modelo y fecha de ejecución."],
        ["Dominio de evaluación", "Territorios, hábitats, cámaras, estaciones, temporadas y condiciones de luz incluidos."],
        ["Conjunto de referencia", "Número de casos; forma de selección; clases; revisión experta; desacuerdos."],
        ["Separación de datos", "Cómo se evitó compartir sitios, secuencias o individuos entre entrenamiento y prueba cuando corresponda."],
        ["Resultados por clase", "Verdaderos positivos, falsos positivos y falsos negativos; precisión y sensibilidad; incertidumbre."],
        ["Errores relevantes", "Omisiones en especies prioritarias, confusión con especies semejantes y casos no evaluables."],
        ["Decisión de uso", "Uso permitido, revisión humana necesaria, condiciones de suspensión y próxima evaluación."],
      ],
    },
    sections: [
      {
        title: "Ejemplo didáctico de cálculo",
        example:
          "En un conjunto de prueba hay 50 imágenes confirmadas con la especie. El modelo identifica correctamente 45, omite 5 y marca 15 imágenes de otras categorías como si fueran de esa especie. La precisión es 45 dividido entre 60, equivalente al 75%. La sensibilidad es 45 dividido entre 50, equivalente al 90%. Son medidas distintas y describen ese conjunto de prueba, no todo territorio posible.",
        paragraphs: [
          "Conservar un conjunto de prueba fijo ayuda a comparar versiones. Añadir una evaluación en sitios o periodos nuevos permite examinar transferencia. Si el costo de omitir una especie es alto, la elección del umbral y el esfuerzo de revisión deben reflejar esa necesidad.",
        ],
      },
    ],
    control: "La ficha permite repetir el cálculo y conocer qué quedó fuera de la evaluación.",
    actions: ["A05"],
    resources: ["R27", "R29"],
  },
  {
    id: "t06",
    code: "T06",
    title: "Ficha de identidad de jaguar",
    short: "Identidad de jaguar",
    intro:
      "Utilice una ficha por identidad candidata o confirmada, con control de versiones. Las fotografías originales y las anotaciones que sustentan la comparación deben conservarse bajo el nivel de acceso acordado.",
    table: {
      head: ["Campo", "Contenido"],
      rows: [
        ["Identificador y estado", "Código persistente; candidato, confirmado o sin resolución; versión."],
        ["Imágenes de referencia", "Archivos originales; flanco; calidad; región corporal visible."],
        ["Observaciones asociadas", "Fecha verificada; sitio; despliegue; evento; evidencia de vinculación."],
        ["Rasgos utilizados", "Patrones de rosetas y otras características que sustentan la comparación."],
        ["Revisión", "Personas revisoras; fecha; coincidencias; desacuerdos y decisión."],
        ["Historial de cambios", "Unión o separación de identidades; códigos anteriores; justificación."],
        ["Uso analítico", "Periodo y análisis para el que la identidad es utilizable."],
        ["Circulación", "Personas autorizadas; versión pública de medios y ubicaciones."],
      ],
    },
    sections: [
      {
        title: "Reglas de interpretación",
        list: [
          "No asignar una nueva identidad únicamente porque la primera comparación no encontró coincidencia.",
          "Mantener separados los flancos cuya pertenencia no puede establecerse con evidencia.",
          "Revisar el catálogo completo cuando una nueva imagen cambia la interpretación de registros anteriores.",
          "Publicar el número de identidades confirmadas con periodo, versión y método de revisión.",
          "Utilizar un diseño de captura y recaptura apropiado para estimar densidad o población.",
        ],
      },
      {
        title: "Ejemplo didáctico",
        example:
          "Una imagen clara del flanco izquierdo puede confirmar la coincidencia con una referencia existente. Una imagen parcial del flanco derecho sin vínculo adicional permanece sin resolución; forzar su asignación alteraría el catálogo y los análisis posteriores.",
      },
    ],
    control: "Cada identidad tiene evidencia revisable, estado explícito e historial de cambios.",
    actions: ["A06"],
    resources: ["R19", "R20", "R51", "R54", "R55"],
  },
  {
    id: "t07",
    code: "T07",
    title: "Ficha de análisis ecológico y cartográfico",
    short: "Análisis y cartografía",
    intro:
      "Complete una ficha por análisis o mapa. Debe permitir reproducir el producto y reconocer si las fuentes responden a la pregunta.",
    table: {
      head: ["Campo", "Contenido"],
      rows: [
        ["Pregunta y decisión", "Uso esperado, persona usuaria y ámbito de aplicación."],
        ["Universo analizado", "Territorio, periodo, taxones, campañas, sitios y registros incluidos."],
        ["Fuentes y versiones", "Base de observaciones, productos satelitales, límites, fecha de descarga y licencias."],
        ["Esfuerzo y exclusiones", "Unidad y cálculo de esfuerzo; fallas, datos inciertos y registros excluidos."],
        ["Parámetros", "Regla de eventos; filtros; resolución; proyección; tratamiento de nubes; umbrales."],
        ["Método", "Procedimiento, código o secuencia de operaciones y versiones de herramientas."],
        ["Validación", "Muestra independiente, responsables, desacuerdos y medidas de calidad."],
        ["Resultados", "Indicadores o superficies; incertidumbre; mapas y tablas asociados."],
        ["Interpretación", "Qué se puede concluir, hipótesis alternativas y nueva información necesaria."],
        ["Publicación y archivo", "Nivel de acceso; versión pública; ubicación de copia reproducible."],
      ],
    },
    sections: [
      {
        title: "Control específico para cambio de cobertura",
        paragraphs: [
          "Verifique que los periodos sean comparables, la leyenda tenga el mismo significado, la zona sin datos esté identificada y el cálculo use el área efectivamente observada. Conserve resultados de baja confianza y ejemplos de errores. La medición de área debe usar una proyección o un cálculo geodésico apropiado; contar píxeles sin revisar geometría puede introducir errores.",
        ],
      },
      {
        title: "Control específico para fauna",
        paragraphs: [
          "Compruebe que la comparación no confunda mayor esfuerzo, cámaras nuevas o mejores identificaciones con una respuesta ecológica.",
        ],
      },
    ],
    control: "Otra persona puede reproducir el producto con las mismas fuentes, parámetros y versiones.",
    actions: ["A07", "A08", "A09"],
    resources: ["R30", "R31", "R37", "R38", "R39", "R49", "R50"],
  },
  {
    id: "t08",
    code: "T08",
    title: "Expediente para una decisión de conservación",
    short: "Expediente para decidir",
    intro:
      "Prepare una síntesis de una o dos páginas para la persona o institución que puede actuar. Acompáñela con acceso a la evidencia revisada y a los anexos metodológicos necesarios.",
    table: {
      head: ["Sección", "Contenido que debe quedar explícito"],
      rows: [
        ["Decisión solicitada", "Qué se propone considerar, a quién corresponde y cuál es el plazo pertinente."],
        ["Hallazgo", "Dato principal con fuente, fecha, alcance y unidad."],
        ["Interpretación", "Relación del hallazgo con la gestión y explicación de incertidumbres."],
        ["Opciones", "Alternativas factibles, incluida la necesidad de nueva información."],
        ["Implicaciones", "Costo, capacidad, derechos, participación y condiciones operativas."],
        ["Recomendación", "Opción justificada y condiciones para implementarla."],
        ["Responsabilidades", "Quién coordina, quién participa y cómo se documentarán acuerdos."],
        ["Seguimiento", "Indicador, línea base, fecha de revisión y procedimiento de ajuste."],
      ],
    },
    sections: [
      {
        title: "Ejemplo basado en el aprendizaje de conectividad",
        example:
          "Hallazgo: un individuo fue registrado en sitios separados por aproximadamente 40 km. Interpretación: existe evidencia de uso de sitios distantes por el mismo jaguar que justifica estudiar conectividad. Opción de actuación: acordar seguimiento entre áreas y revisar hábitats y presiones en la zona de transición. Evidencia adicional: diseño espacial, registros intermedios y análisis de barreras. La recomendación se presenta como propuesta para deliberación, no como un corredor decretado. [E01, E02]",
      },
      {
        title: "Registro posterior a la reunión",
        paragraphs: [
          "Anote fecha, participantes, decisión adoptada, cambios solicitados, responsable, recursos y siguiente revisión. Si la evidencia no fue utilizada, documente la razón: oportunidad institucional, calidad, competencia, recursos o desacuerdo. Ese registro permite mejorar la contribución del monitoreo.",
        ],
      },
    ],
    control: "La persona que decide recibe hallazgo, incertidumbre, opciones y responsables en una síntesis breve.",
    actions: ["A10"],
    resources: ["R09", "R52", "R53"],
  },
  {
    id: "t09",
    code: "T09",
    title: "Presupuesto de continuidad y escenarios",
    short: "Presupuesto y escenarios",
    intro:
      "Complete cantidades, tarifas y moneda con cotizaciones y acuerdos del territorio. La matriz debe cubrir el mismo horizonte temporal en todos los escenarios y distinguir recursos confirmados de recursos por gestionar.",
    table: {
      head: ["Rubro", "Unidad de cálculo", "Condición que debe quedar cubierta"],
      rows: [
        ["Liderazgo territorial", "Personas × meses o jornadas acordadas", "Remuneración, responsabilidades y continuidad"],
        ["Campo y seguridad", "Salidas × costo completo", "Transporte, logística, seguridad y mantenimiento"],
        ["Equipamiento", "Unidades × costo y reposición", "Dispositivos, baterías, memoria y protección"],
        ["Revisión científica", "Horas o productos acordados", "Identificaciones, análisis y control de calidad"],
        ["Datos y plataforma", "Meses × almacenamiento y servicio", "Copias, cómputo, acceso, soporte y salida"],
        ["Capacidades y devolución", "Sesiones y acompañamiento", "Materiales, facilitación, traducción y seguimiento"],
        ["Gestión y evaluación", "Tiempo y productos", "Coordinación, administración y evaluación"],
        ["Contingencia justificada", "Riesgos específicos", "Fallas, variación logística o necesidades documentadas"],
      ],
    },
    sections: [
      {
        title: "Tres escenarios para negociar alcance",
        list: [
          "Operación mínima viable: pregunta acotada, campaña completa y revisión de resultados; conserva responsabilidades y acuerdos esenciales.",
          "Continuidad: campañas repetidas, mantenimiento, actualización del catálogo, uso institucional y capacidades locales sostenidas.",
          "Expansión: nuevos sitios o territorios con validación local, acompañamiento, interoperabilidad y financiamiento adicional de operación.",
        ],
        paragraphs: [
          "Calcule costo total y costo por producto útil, como campaña con datos revisados o decisión acompañada. No use costo por imagen como único criterio de eficiencia. Registre el valor y vencimiento de aportaciones en especie, especialmente nube y equipos, y pruebe cómo se sostendría el trabajo al terminar ese apoyo.",
        ],
      },
    ],
    control:
      "Las opciones de pago por resultados requieren evaluación específica y no se incluyen como ingresos garantizados. [R61, R62]",
    actions: ["A11"],
    resources: ["R61", "R62"],
  },
  {
    id: "t10",
    code: "T10",
    title: "Tablero de aprendizaje y continuidad",
    short: "Tablero de aprendizaje",
    intro:
      "Seleccione indicadores proporcionales a la escala y registre definición, línea base, meta acordada, fuente, frecuencia y responsable. Evite sumar áreas o personas que se superponen.",
    table: {
      head: ["Dimensión", "Indicador propuesto", "Lectura y condición"],
      rows: [
        ["Operación", "Días cámara efectivos sobre planificados", "Reconocer fallas y diferencias por estación."],
        ["Calidad", "Registros incluidos con metadatos completos sobre registros incluidos", "Definir previamente los campos indispensables."],
        ["Validación", "Observaciones revisadas sobre observaciones que requieren revisión", "Desagregar por taxón y nivel de incertidumbre."],
        ["IA", "Precisión y sensibilidad por clase", "Indicar muestra, dominio y versión del modelo."],
        ["Soberanía", "Solicitudes de uso resueltas mediante el acuerdo vigente", "Registrar autoridad, condiciones y devolución."],
        ["Autonomía", "Personas que completan una tarea sin asistencia sobre evaluadas", "Comparar tareas equivalentes y revisar barreras."],
        ["Continuidad local", "Responsabilidades territoriales financiadas y mantenidas", "Distinguir participación ocasional de trabajo sostenido."],
        ["Uso público", "Decisiones documentadas que utilizan evidencia revisada", "Conservar actas, instrumentos y seguimiento."],
        ["Gestión", "Acciones de mejora completadas sobre acciones acordadas", "Revisar calidad del cumplimiento, no solo cantidad."],
        ["Resultado ecológico", "Indicador definido por el diseño del estudio", "Incluir esfuerzo, detectabilidad e incertidumbre."],
        ["Sostenibilidad", "Meses de operación cubiertos con recursos confirmados", "Separar proyecciones y aportaciones en especie."],
      ],
    },
    sections: [
      {
        title: "Cómo reportar",
        paragraphs: [
          "La superficie de referencia, muestreada, sujeta a acciones y formalmente protegida debe reportarse en campos distintos. Para personas, distinga participantes únicos, responsabilidades y tareas demostradas. Las metas se acuerdan después del diagnóstico y no se derivan automáticamente de cifras de Tech4Nature.",
        ],
      },
    ],
    control: "Revise el tablero con quienes producen y utilizan la evidencia, y documente ajustes.",
    actions: ["A10", "A11", "A12"],
    resources: [],
  },
];

// ---------------------------------------------------------------------------
// Biblioteca

export type AccessKind = "publica" | "cuenta" | "abierto" | "suscripcion" | "habilitar";

export const ACCESS_KINDS: { id: AccessKind; label: string }[] = [
  { id: "publica", label: "Consulta pública" },
  { id: "cuenta", label: "Requiere cuenta" },
  { id: "abierto", label: "Software o código abierto" },
  { id: "suscripcion", label: "Suscripción" },
  { id: "habilitar", label: "Por habilitar" },
];

export const LANG_FILTERS = [
  { id: "ES", label: "Español", test: /\bES\b/ },
  { id: "EN", label: "Inglés", test: /\bEN\b/ },
  { id: "PT", label: "Portugués", test: /\bPT\b/ },
  { id: "MULTI", label: "Multilingüe", test: /multiling/i },
] as const;

export const NEEDS = [
  { id: "comenzar", label: "Comenzar con Tech4Nature y BioScanner", from: 1, to: 6, image: IMAGES.platform },
  { id: "gobernanza", label: "Contextualizar y acordar gobernanza", from: 7, to: 13, image: IMAGES.people },
  { id: "muestreo", label: "Estandarizar datos y preparar el muestreo", from: 14, to: 20, image: IMAGES.forestPath },
  { id: "campo", label: "Registrar y revisar datos de campo", from: 21, to: 29, image: IMAGES.kingfisher },
  { id: "cobertura", label: "Cartografiar y analizar cobertura", from: 30, to: 48, image: IMAGES.earth },
  { id: "fauna", label: "Analizar fauna y orientar conservación", from: 49, to: 58, image: IMAGES.feline },
  { id: "operacion", label: "Sostener operación y consultar evidencia", from: 59, to: 66, image: IMAGES.dashboard },
] as const;

export type NeedId = (typeof NEEDS)[number]["id"];

export type Resource = {
  id: string;
  code: string;
  title: string;
  org: string;
  type: string;
  lang: string;
  access: string;
  kind: AccessKind;
  /** `null` cuando el recurso todavía no tiene enlace público. */
  url: string | null;
  use: string;
  condition: string;
};

type RawResource = Omit<Resource, "id" | "code">;

const RAW_RESOURCES: RawResource[] = [
  // 01–06 Comenzar con Tech4Nature y BioScanner
  { title: "BioScanner", org: "C Minds", type: "Aplicación", lang: "ES", access: "Cuenta", kind: "cuenta", url: "https://app.bioscanner.io", use: "Analizar imágenes y videos con asistencia de IA, revisar especies, trabajar con identidades de jaguar y generar informes. Ingresar o solicitar una cuenta y comenzar con un lote pequeño de datos autorizados.", condition: "El acceso al inicio de sesión se comprobó. Confirmar condiciones de servicio, capacidad y funciones habilitadas para cada cuenta." },
  { title: "Conocer BioScanner", org: "C Minds", type: "Introducción", lang: "EN", access: "Consulta pública", kind: "publica", url: "https://www.forclimate.ai/bioscanner", use: "Entender el origen y la orientación de la plataforma antes de incorporarla a un programa de monitoreo. Revisar la presentación y seguir el acceso a la aplicación.", condition: "La página de presentación puede describir funciones en desarrollo; comprobarlas en la versión utilizada." },
  { title: "Repositorio de BioScanner", org: "C Minds", type: "Desarrollo", lang: "Por definir", access: "Por habilitar", kind: "habilitar", url: null, use: "Facilitar revisión técnica, reutilización de componentes y contribuciones cuando se publique el repositorio actual. El enlace se activará cuando C Minds publique la URL y la licencia correspondientes.", condition: "Recurso por habilitar. No se ofrece el repositorio histórico como código de la plataforma actual." },
  { title: "Uso de sistemas de IA para la protección de la biodiversidad", org: "C Minds y aliados de Tech4Nature México", type: "Introducción", lang: "ES", access: "Documento compartido", kind: "publica", url: "https://docs.google.com/document/d/12OQ36ia6frIHRFIOJWm4dyT5uFbb8vHfJBcyQWP_CqY/preview", use: "Consultar el caso de origen, los dispositivos, los socios y las recomendaciones éticas de la iniciativa. Leer metodología y aprendizajes para reconocer decisiones transferibles.", condition: "Documento histórico; se enlaza en modo de solo lectura." },
  { title: "Tech4Nature México", org: "C Minds", type: "Introducción", lang: "EN", access: "Consulta pública", kind: "publica", url: "https://www.forclimate.ai/tech4nature", use: "Acceder al contexto, publicaciones y materiales de la iniciativa. Consultar las publicaciones y los materiales disponibles en la página.", condition: "El sitio conserva información histórica; revisar la fecha y el alcance de cada publicación." },
  { title: "AI for Environment and Ecosystems Toolkit", org: "UNESCO", type: "Política pública", lang: "EN", access: "Consulta pública", kind: "publica", url: "https://www.unesco.org/ethics-ai/en/ai-environment-ecosystems-toolkit", use: "Conectar políticas de IA con objetivos ambientales, capacidades y responsabilidad institucional. Elegir el paso relacionado con la decisión pública que se necesita preparar.", condition: "Es una referencia de política; la aplicación territorial requiere adaptar instituciones, derechos y recursos." },
  // 07–13 Contextualizar y acordar gobernanza
  { title: "Living Planet Report 2026", org: "WWF y ZSL", type: "Contexto", lang: "EN", access: "Consulta pública", kind: "publica", url: "https://www.wwf.org.uk/our-reports/living-planet-report-2026", use: "Interpretar tendencias de poblaciones de vertebrados y contextualizar la urgencia regional. Leer resultados y explicación metodológica del Índice Planeta Vivo.", condition: "La caída del índice no equivale al porcentaje de especies extintas ni al número de animales perdidos." },
  { title: "Protected Planet", org: "PNUMA WCMC y UICN", type: "Consulta y análisis", lang: "Multilingüe", access: "Consulta pública y términos de descarga", kind: "publica", url: "https://www.protectedplanet.net/en", use: "Consultar áreas protegidas y otras medidas eficaces de conservación basadas en áreas. Buscar el país o área y registrar la fecha de actualización y categoría del dato.", condition: "Cobertura designada y efectividad de conservación son indicadores distintos; revisar términos de uso." },
  { title: "Metas del Marco Mundial de Biodiversidad", org: "Convenio sobre la Diversidad Biológica", type: "Política pública", lang: "Multilingüe", access: "Consulta pública", kind: "publica", url: "https://www.cbd.int/gbf/targets", use: "Relacionar una iniciativa con planificación, conectividad, participación, tecnología y acceso al conocimiento. Seleccionar las metas pertinentes y asociarles un producto y un responsable.", condition: "La alineación temática no demuestra cumplimiento de una meta nacional o global." },
  { title: "Recomendación sobre la Ética de la IA", org: "UNESCO", type: "Política pública", lang: "Multilingüe", access: "Consulta pública", kind: "publica", url: "https://www.unesco.org/en/legal-affairs/recommendation-ethics-artificial-intelligence", use: "Fundamentar responsabilidades ambientales, supervisión humana y proporcionalidad de la IA. Revisar el ámbito de medio ambiente y ecosistemas junto con los principios generales.", condition: "Aplicar sus orientaciones mediante acuerdos y procedimientos verificables, adecuados al contexto." },
  { title: "Principios CARE", org: "Global Indigenous Data Alliance", type: "Gobernanza", lang: "EN y traducciones", access: "Consulta pública", kind: "publica", url: "https://www.gida-global.org/careprinciples", use: "Examinar beneficio colectivo, autoridad para controlar, responsabilidad y ética de los datos indígenas. Usarlos en la conversación sobre quién decide los usos de datos y conocimientos.", condition: "Su aplicación debe partir de las instituciones y protocolos propios de los pueblos, sin sustituirlos." },
  { title: "Principios FAIR", org: "GO FAIR", type: "Gobernanza y datos", lang: "EN", access: "Consulta pública", kind: "publica", url: "https://www.go-fair.org/fair-principles/", use: "Mejorar localización, accesibilidad, interoperabilidad y reutilización de datos. Documentar identificadores, metadatos, formatos y condiciones de acceso.", condition: "FAIR no exige abrir datos sensibles; accesible puede significar acceso bajo autorización." },
  { title: "Cadena de suministro de datos soberanos", org: "C Minds", type: "Gobernanza", lang: "ES", access: "Consulta mediante lector web", kind: "publica", url: "https://ecos.cminds.co/publicaciones/sovereign-data-supply-chain?reader=1", use: "Explorar el enfoque de C Minds sobre autonomía y decisiones a lo largo de la cadena de datos. Relacionar recolección, procesamiento, uso y devolución de información con responsabilidades territoriales.", condition: "El lector web requiere navegación interactiva; la ficha de publicación debe conservar una alternativa accesible." },
  // 14–20 Estandarizar datos y preparar el muestreo
  { title: "Buenas prácticas para gestionar y publicar datos de cámaras trampa", org: "GBIF", type: "Aplicación y datos", lang: "ES", access: "Guía abierta", kind: "publica", url: "https://docs.gbif.org/camera-trap-guide/es/", use: "Preparar datos de despliegues, archivos y observaciones para su documentación e intercambio. Consultar las secciones de metadatos y publicación antes de definir la base de datos.", condition: "No reemplaza el diseño ecológico del muestreo ni la autorización para compartir información." },
  { title: "Camtrap DP", org: "TDWG y comunidad de desarrollo", type: "Desarrollo", lang: "EN", access: "Especificación abierta", kind: "abierto", url: "https://camtrap-dp.tdwg.org/", use: "Intercambiar datos de fototrampeo mediante una estructura común. Revisar deployments, media y observations y conservar la versión del esquema.", condition: "La compatibilidad de BioScanner con un esquema de exportación debe comprobarse; no se presupone una integración nativa." },
  { title: "Generalización de datos de especies sensibles", org: "GBIF", type: "Datos", lang: "ES", access: "Guía abierta", kind: "publica", url: "https://docs.gbif.org/sensitive-species-best-practices/master/es/", use: "Definir qué detalle espacial o temporal se puede publicar de manera responsable. Clasificar sensibilidad y documentar la transformación aplicada a cada registro público.", condition: "Conservar el original bajo acceso controlado y declarar la incertidumbre introducida." },
  { title: "GBIF", org: "Global Biodiversity Information Facility", type: "Consulta y análisis", lang: "Multilingüe", access: "Datos con licencias por conjunto", kind: "publica", url: "https://www.gbif.org/", use: "Consultar ocurrencias y conjuntos de datos para construir antecedentes de biodiversidad. Descargar una selección documentada, conservar su DOI y revisar duplicados y coordenadas.", condition: "Las ocurrencias oportunistas no constituyen por sí mismas un muestreo de ausencias o abundancia." },
  { title: "Información sobre biodiversidad en México", org: "CONABIO", type: "Consulta", lang: "ES", access: "Consulta pública", kind: "publica", url: "https://www.biodiversidad.gob.mx/conabio/preguntas-frecuentes", use: "Localizar información del SNIB, fuentes taxonómicas y vías de consulta cartográfica. Identificar el conjunto que corresponde a la pregunta y revisar sus restricciones.", condition: "La ausencia de registros en una base no demuestra ausencia de la especie en el territorio." },
  { title: "Manual de fototrampeo para estudio de fauna silvestre", org: "Chávez y colaboradores 2013 · Alianza WWF Telcel y UNAM", type: "Campo", lang: "ES", access: "PDF de consulta", kind: "publica", url: "https://simec.conanp.gob.mx/Publicaciones2020/Publicaciones%20CONANP/Parte%203/Manuales/2013%20Manual%20fototrampeo%20jaguar.pdf", use: "Diseñar y operar fototrampeo usando al jaguar en México como caso de estudio. Revisar diseño, colocación y estructura de la base antes de comprar equipos.", condition: "Adaptar configuraciones al objetivo, equipos actuales y revisión especializada; no copiar distancias o ajustes automáticamente." },
  { title: "Manual de aplicación de fototrampeo para jaguar", org: "Salvador 2020 · WCS Ecuador", type: "Campo", lang: "ES", access: "Manual de consulta", kind: "publica", url: "https://library.wcs.org/en-us/Scientific-Research/Research-Publications/Publications-Library/ctl/view/mid/40093/pubid/DMX3792000000.aspx", use: "Complementar la formación de equipos que investigan y monitorean jaguares. Acceder al texto completo desde la ficha y preparar una práctica supervisada.", condition: "La identificación individual y las inferencias poblacionales necesitan revisión y diseño consistentes." },
  // 21–29 Registrar y revisar datos de campo
  { title: "KoboToolbox", org: "KoboToolbox", type: "Campo", lang: "ES y otros", access: "Cuenta y planes según elegibilidad", kind: "cuenta", url: "https://support.kobotoolbox.org/", use: "Crear formularios para despliegues, mantenimiento, observaciones y entrevistas. Preparar un formulario de prueba y comprobar captura sin conexión y sincronización posterior.", condition: "El plan comunitario tiene condiciones y límites; presupuestar almacenamiento, soporte y uso real." },
  { title: "QField", org: "QField y OPENGIS.ch", type: "Campo y SIG", lang: "ES y otros", access: "Aplicación abierta y servicios opcionales", kind: "abierto", url: "https://docs.qfield.org/", use: "Llevar mapas y formularios geográficos al campo con trabajo sin conexión. Preparar un proyecto en QGIS y verificar su funcionamiento en el dispositivo de campo.", condition: "QFieldCloud es un servicio separado; la sincronización y sus costos dependen del arreglo elegido." },
  { title: "SMART", org: "SMART Partnership", type: "Gestión y campo", lang: "EN y materiales multilingües", access: "Consultar despliegue y servicios", kind: "cuenta", url: "https://smartconservationtools.org/en-us/SMART-Approach/Technology", use: "Vincular patrullajes, observaciones y gestión adaptativa de áreas de conservación. Revisar los manuales y definir quién operará la base y las actividades de campo.", condition: "Los datos de patrullaje dependen del esfuerzo y la distribución de recorridos; no representan toda la incidencia de amenazas." },
  { title: "Arbimon", org: "Rainforest Connection", type: "Acústica", lang: "EN", access: "Cuenta y plataforma anunciada gratuita", kind: "cuenta", url: "https://arbimon.org/", use: "Trabajar con archivos acústicos, detecciones y análisis colaborativos. Cargar grabaciones autorizadas y validar un conjunto de referencia local.", condition: "La calidad acústica, el horario de grabación y la validación condicionan las interpretaciones." },
  { title: "BirdNET", org: "Cornell Lab y equipo BirdNET", type: "Acústica", lang: "ES y otros", access: "Herramientas y licencias según componente", kind: "abierto", url: "https://birdnet.cornell.edu/", use: "Explorar identificación asistida de sonidos y análisis de grabaciones. Elegir aplicación o analizador y comprobar su desempeño con sonidos locales revisados.", condition: "Una predicción acústica necesita validación; revisar licencia del modelo y del software por separado." },
  { title: "AudioMoth", org: "Open Acoustic Devices", type: "Campo", lang: "EN", access: "Documentación abierta y hardware de pago", kind: "abierto", url: "https://www.openacousticdevices.info/", use: "Preparar monitoreo acústico pasivo y configuración de grabadores. Consultar la guía de campo y realizar una prueba de autonomía y calidad.", condition: "Presupuestar carcasa, tarjetas, baterías, mantenimiento y recuperación de equipos." },
  { title: "MegaDetector", org: "Dan Morris y comunidad de desarrollo", type: "Desarrollo", lang: "EN", access: "Código y modelos con sus licencias", kind: "abierto", url: "https://github.com/agentmorris/MegaDetector", use: "Detectar animales, personas y vehículos en fotografías para facilitar revisión. Probar una implementación apropiada y medir omisiones en imágenes locales.", condition: "Detección de objetos y clasificación de especies son tareas diferentes; no atribuirle identificación individual." },
  { title: "Wildlife Insights", org: "Alianza Wildlife Insights", type: "Aplicación", lang: "EN", access: "Cuenta y gratuidad según elegibilidad", kind: "cuenta", url: "https://www.wildlifeinsights.org/pricing", use: "Comparar alternativas para clasificar, administrar y compartir datos de fototrampeo. Revisar elegibilidad, permisos y exportación antes de una prueba.", condition: "Ofrece acceso gratuito a grupos elegibles, incluidos usuarios académicos y ciertos organismos públicos; otros usos requieren suscripción." },
  { title: "LILA BC", org: "Comunidad de investigación en biología y conservación", type: "Desarrollo", lang: "EN", access: "Licencias por conjunto", kind: "abierto", url: "https://lila.science/", use: "Obtener conjuntos etiquetados para aprendizaje, pruebas y evaluación de modelos. Seleccionar datos cercanos al dominio de uso y conservar su atribución.", condition: "Separar entrenamiento y evaluación por sitios o periodos para evitar resultados inflados." },
  // 30–48 Cartografiar y analizar cobertura
  { title: "QGIS", org: "Proyecto QGIS", type: "SIG", lang: "ES y otros", access: "Software libre", kind: "abierto", url: "https://qgis.org/", use: "Combinar límites, estaciones, cobertura y resultados para análisis y mapas. Instalar una versión soportada y trabajar en un proyecto con sistema de coordenadas documentado.", condition: "Software gratuito no elimina necesidades de formación, datos adecuados y control de calidad." },
  { title: "Manual de formación de QGIS", org: "Proyecto QGIS", type: "Aprendizaje", lang: "ES", access: "Manual abierto", kind: "publica", url: "https://docs.qgis.org/latest/es/docs/training_manual/", use: "Aprender operaciones de SIG y preparar ejercicios reproducibles. Completar los módulos de datos vectoriales y ráster relevantes para el trabajo.", condition: "La versión del manual y la instalada pueden diferir; registrar ambas en la capacitación." },
  { title: "Copernicus Browser", org: "Copernicus Data Space Ecosystem", type: "Observación terrestre", lang: "Multilingüe", access: "Cuenta para algunas funciones", kind: "cuenta", url: "https://browser.dataspace.copernicus.eu/", use: "Examinar imágenes satelitales y comparar fechas sin comenzar con programación. Seleccionar sensor, periodo y área de interés; revisar nubes antes de interpretar cambios.", condition: "Una visualización de color no sustituye una clasificación validada ni una determinación jurídica del uso del suelo." },
  { title: "Global Nature Watch", org: "World Resources Institute y aliados", type: "Observación terrestre", lang: "Multilingüe", access: "Consulta y funciones según cuenta", kind: "publica", url: "https://globalnaturewatch.org/", use: "Acceder a aplicaciones de monitoreo de naturaleza y bosque vinculadas a Global Forest Watch. Elegir una aplicación y registrar el conjunto de datos utilizado.", condition: "Global Forest Watch redirige a este portal en la revisión de octubre de 2026; comprobar rutas y metodologías al publicar." },
  { title: "Explorador Dynamic World", org: "Google y World Resources Institute", type: "Observación terrestre", lang: "EN", access: "Consulta pública", kind: "publica", url: "https://dynamicworld.app/", use: "Explorar cobertura terrestre a 10 metros y reconocer zonas que merecen verificación. Comparar periodos equivalentes y revisar la leyenda de nueve clases.", condition: "Una clase de vegetación inundada no identifica por sí sola manglar; distinguir clasificación de validación local." },
  { title: "Acceso no comercial a Earth Engine", org: "Google", type: "Análisis y desarrollo", lang: "EN", access: "Elegibilidad verificada", kind: "cuenta", url: "https://earthengine.google.com/noncommercial/", use: "Determinar si una institución y su uso califican para acceso sin cargo de Earth Engine. Revisar el tipo de organización y el uso previsto antes de registrar el proyecto.", condition: "Servicios por encargo y algunos usos gubernamentales u operativos requieren condiciones comerciales." },
  { title: "Cuotas no comerciales de Earth Engine", org: "Google", type: "Análisis y desarrollo", lang: "Multilingüe", access: "Cuotas por nivel", kind: "cuenta", url: "https://developers.google.com/earth-engine/guides/noncommercial_tiers", use: "Dimensionar capacidad de cómputo y evitar diseñar procesos que excedan los recursos disponibles. Revisar el nivel asignado, consumo y opciones de solicitud de cuota.", condition: "En la documentación consultada el nivel Community contempla 150 EECU horas mensuales; no equivale a tiempo de trabajo humano." },
  { title: "Sentinel 2 armonizado en Earth Engine", org: "Copernicus y Google", type: "Análisis", lang: "Multilingüe", access: "Catálogo y acceso a Earth Engine", kind: "cuenta", url: "https://developers.google.com/earth-engine/datasets/catalog/COPERNICUS_S2_SR_HARMONIZED", use: "Construir compuestos de reflectancia superficial para cartografía y comparación temporal. Usar el ejemplo oficial con enmascaramiento de nubes adecuado.", condition: "Las bandas tienen distintas resoluciones; declarar remuestreo y no convertir resolución nominal en exactitud." },
  { title: "Dynamic World en Earth Engine", org: "Google y World Resources Institute", type: "Análisis", lang: "Multilingüe", access: "Datos abiertos y cuenta de cómputo", kind: "cuenta", url: "https://developers.google.com/earth-engine/datasets/catalog/GOOGLE_DYNAMICWORLD_V1", use: "Analizar probabilidades de nueve clases y cambios de cobertura a 10 metros. Examinar probabilidades además de la etiqueta dominante y construir compuestos comparables.", condition: "El umbral de confianza debe evaluarse localmente; cambios de etiqueta pueden reflejar estacionalidad o incertidumbre." },
  { title: "Hansen Global Forest Change", org: "Universidad de Maryland y colaboradores", type: "Análisis", lang: "Multilingüe", access: "Datos con licencia declarada", kind: "publica", url: "https://developers.google.com/earth-engine/datasets/catalog/UMD_hansen_global_forest_change_2025_v1_13", use: "Explorar pérdida de cobertura arbórea entre 2000 y 2025 a resolución aproximada de 30 metros. Registrar versión, umbral de cobertura inicial y años incluidos.", condition: "Pérdida de cobertura arbórea no equivale automáticamente a deforestación permanente, pérdida de selva natural o ilegalidad." },
  { title: "Planet Tropical Forest Observatory", org: "Planet", type: "Observación terrestre", lang: "EN", access: "Suscripción y elegibilidad", kind: "suscripcion", url: "https://www.planet.com/tropical-forest-observatory/", use: "Acceder a mosaicos PlanetScope y archivo histórico para monitoreo de bosques tropicales. Revisar cobertura, licencia, cuotas y modalidad apropiada para la organización.", condition: "Es una opción de pago con condiciones específicas. No prometer continuidad del antiguo acceso gratuito de NICFI." },
  { title: "Planet en Google Earth Engine", org: "Planet", type: "Desarrollo", lang: "EN", access: "Cuenta Planet y Earth Engine", kind: "suscripcion", url: "https://docs.planet.com/platform/integrations/google-earth-engine/tfo-gee/", use: "Incorporar mosaicos autorizados de Tropical Forest Observatory al análisis geoespacial. Seguir la integración oficial después de comprobar los derechos de acceso.", condition: "La integración no vuelve abiertos los datos licenciados ni habilita redistribuir imágenes fuente." },
  { title: "MapBiomas Alerta", org: "Red MapBiomas", type: "Observación terrestre", lang: "PT", access: "Consulta y términos del producto", kind: "publica", url: "https://alerta.mapbiomas.org/", use: "Consultar alertas y métodos de validación para cambios de vegetación nativa en Brasil. Revisar cobertura, periodo y metodología antes de comparar con otra región.", condition: "Este producto es territorialmente específico; no usar sus resultados como si cubriera México o todo el Caribe." },
  { title: "SEPAL", org: "FAO Open Foris", type: "Análisis guiado", lang: "EN y formación multilingüe", access: "Cuenta y recursos asignados", kind: "cuenta", url: "https://www.openforis.org/sepal/", use: "Preparar análisis de bosque y cobertura mediante herramientas y flujos guiados. Comenzar con una receta y un área pequeña, verificando las conexiones necesarias.", condition: "Algunos procesos dependen de Earth Engine; confirmar cuentas, cuotas y capacidad antes de escalar." },
  { title: "Collect Earth Online", org: "Open Foris y socios de desarrollo", type: "Validación geoespacial", lang: "EN y materiales multilingües", access: "Cuenta", kind: "cuenta", url: "https://www.collect.earth/", use: "Organizar interpretación visual de muestras para cartografía y evaluación de cambios. Definir clases, muestras y reglas de revisión antes de invitar intérpretes.", condition: "La independencia y calidad de las muestras determinan la utilidad de la evaluación de exactitud." },
  { title: "Global Mangrove Watch", org: "Alianza Global Mangrove Watch", type: "Observación terrestre", lang: "EN", access: "Consulta y licencias de datos", kind: "publica", url: "https://www.globalmangrovewatch.org/", use: "Consultar extensión y cambios de manglar para apoyar preguntas de conservación costera. Revisar versión, fechas y resolución del producto seleccionado.", condition: "Distinguir extensión, condición ecológica e hidrología; complementar con verificación local." },
  { title: "Información de uso del suelo y vegetación", org: "INEGI", type: "SIG", lang: "ES", access: "Consulta pública", kind: "publica", url: "https://www.inegi.org.mx/app/biblioteca/ficha.html?upc=889463902836", use: "Interpretar las clases y escalas de la cartografía oficial mexicana. Revisar la guía y localizar la serie apropiada para el periodo de análisis.", condition: "No comparar series o leyendas sin armonizarlas; la escala nacional no resuelve todas las decisiones prediales." },
  { title: "Geovisualización de biodiversidad", org: "CONABIO", type: "Consulta y SIG", lang: "ES", access: "Consulta pública", kind: "publica", url: "https://www.biodiversidad.gob.mx/region/geoviz", use: "Localizar mapas temáticos y comprender relaciones entre biodiversidad y territorio. Seleccionar un tema y seguir la referencia del conjunto original.", condition: "Registrar procedencia, escala, antigüedad y restricciones de cada capa." },
  { title: "Circuitscape", org: "Proyecto Circuitscape", type: "Análisis especializado", lang: "EN", access: "Software abierto", kind: "abierto", url: "https://circuitscape.org/", use: "Modelar conectividad potencial mediante superficies de resistencia. Definir hipótesis ecológicas y comparar escenarios de resistencia con apoyo especializado.", condition: "Un corredor modelado es una hipótesis; no demuestra rutas recorridas ni crea una figura legal de protección." },
  // 49–58 Analizar fauna y orientar conservación
  { title: "camtrapR", org: "Niedballa y colaboradores", type: "Análisis especializado", lang: "EN", access: "R y software abierto", kind: "abierto", url: "https://cran.r-project.org/web/packages/camtrapR/index.html", use: "Preparar historiales de detección, esfuerzo y análisis de fototrampeo. Probar los ejemplos con una base depurada y conservar las reglas de eventos.", condition: "El software no corrige automáticamente sesgos de diseño, fechas erróneas o identificaciones equivocadas." },
  { title: "unmarked", org: "Chandler, Kellner y colaboradores", type: "Análisis especializado", lang: "EN", access: "R y software abierto", kind: "abierto", url: "https://cran.r-project.org/web/packages/unmarked/index.html", use: "Ajustar modelos de ocurrencia y otros modelos jerárquicos que separan estado y observación. Definir ocasiones repetidas y covariables con una persona experta en ecología cuantitativa.", condition: "La ocupación depende de supuestos y detectabilidad; no aplicar modelos sin verificar el diseño." },
  { title: "secr", org: "Efford y colaboradores", type: "Análisis especializado", lang: "EN", access: "R y software abierto", kind: "abierto", url: "https://cran.r-project.org/web/packages/secr/index.html", use: "Estimar densidad mediante captura y recaptura espacial cuando el diseño y los datos lo permiten. Preparar identidades revisadas, detectores, esfuerzo e historiales de captura.", condition: "Un catálogo acumulado de jaguares no reemplaza los requisitos de una estimación poblacional." },
  { title: "Estándares para la práctica de la conservación", org: "Conservation Measures Partnership", type: "Planeación", lang: "EN y traducciones", access: "Estándar y recursos de consulta", kind: "publica", url: "https://www.conservationstandards.org/", use: "Organizar teoría de cambio, planificación, seguimiento y adaptación de una iniciativa. Utilizar el ciclo de manejo para relacionar amenazas, acciones y resultados.", condition: "Comprobar la versión de cada traducción; una plantilla completada no constituye evidencia de impacto." },
  { title: "Estándar de la Lista Verde", org: "UICN", type: "Gestión y gobernanza", lang: "EN y materiales traducidos", access: "Consulta pública", kind: "publica", url: "https://iucngreenlist.org/standard/global-standard/", use: "Examinar gobernanza, diseño, manejo y resultados de conservación de áreas protegidas y conservadas. Revisar la versión aplicable y preparar evidencia por criterio con los equipos gestores.", condition: "La autoevaluación preparatoria y la certificación formal corresponden a procesos diferentes." },
  { title: "Jaguar 2030", org: "Panthera, WWF, WCS y PNUD", type: "Conservación del jaguar", lang: "EN", access: "Hoja de ruta pública", kind: "publica", url: "https://panthera.org/sites/default/files/Panthera_Jaguar2030Roadmap_ENG_0.pdf", use: "Relacionar paisajes prioritarios, conectividad y cooperación en el rango del jaguar. Identificar qué objetivos regionales se corresponden con la pregunta local.", condition: "No convertir mapas regionales en rutas individuales confirmadas ni atribuirles precisión predial." },
  { title: "Jaguar en Enciclovida", org: "CONABIO", type: "Consulta", lang: "ES", access: "Consulta pública", kind: "publica", url: "https://enciclovida.mx/especies/34461", use: "Acceder a información sobre Panthera onca, nombres, distribución y categorías de conservación. Revisar las fuentes asociadas a la ficha y distinguir evaluación nacional de evaluación global.", condition: "Consultar fecha y ámbito de las categorías antes de utilizarlas en informes." },
  { title: "Convivencia entre personas y fauna silvestre", org: "Comisión de Supervivencia de Especies UICN", type: "Gestión y participación", lang: "ES y otros", access: "Guía y traducciones públicas", kind: "publica", url: "https://www.hwctf.org/guidelines", use: "Preparar respuestas a conflictos con fauna atendiendo sus dimensiones ecológicas y sociales. Elegir la traducción española y reunir a actores afectados y autoridades competentes.", condition: "La respuesta a un incidente requiere verificación, seguridad y acuerdos locales; no etiquetar responsables a partir de imágenes." },
  { title: "iNaturalist y Naturalista", org: "iNaturalist y comunidad participante", type: "Participación", lang: "ES y otros", access: "Cuenta para contribuir", kind: "cuenta", url: "https://www.inaturalist.org/pages/help", use: "Facilitar aprendizaje e identificación colaborativa de observaciones. Revisar licencias, geoprivacidad y reglas de proyectos antes de publicar registros.", condition: "Los datos oportunistas complementan el monitoreo sistemático; las identificaciones comunitarias también requieren evaluación." },
  { title: "WILDLABS The Inventory", org: "WILDLABS", type: "Selección tecnológica", lang: "EN", access: "Consulta pública", kind: "publica", url: "https://wildlabs.net/en/inventory/about", use: "Buscar herramientas y experiencias de conservación tecnológica y contrastar alternativas. Filtrar por necesidad y revisar evidencia de uso y soporte.", condition: "Una ficha de producto no constituye una evaluación independiente de desempeño." },
  // 59–66 Sostener operación y consultar evidencia
  { title: "CodeCarbon", org: "Comunidad CodeCarbon", type: "Desarrollo", lang: "EN", access: "Software abierto", kind: "abierto", url: "https://docs.codecarbon.io/", use: "Estimar energía y emisiones de ejecuciones de cómputo para comparar opciones. Definir el alcance de medición y registrar equipo, región y configuración.", condition: "Es una estimación parcial; no sustituye un análisis de ciclo de vida ni mide por sí sola agua o biodiversidad." },
  { title: "Energy and AI", org: "Agencia Internacional de Energía", type: "Contexto y operación", lang: "EN", access: "Consulta pública", kind: "publica", url: "https://www.iea.org/reports/energy-and-ai/energy-demand-from-ai", use: "Contextualizar demanda energética de centros de datos y discutir uso proporcional de cómputo. Separar datos observados de escenarios y documentar el año de referencia.", condition: "Las cifras globales de centros de datos no representan la huella particular de BioScanner." },
  { title: "Principios para créditos de biodiversidad", org: "Biodiversity Credit Alliance, IAPB y aliados", type: "Financiamiento", lang: "EN y recursos traducidos", access: "Consulta pública", kind: "publica", url: "https://www.biodiversitycreditalliance.org/high-level-principles/", use: "Examinar integridad ecológica, derechos y reparto de beneficios antes de explorar pagos por resultados. Revisar los principios y requisitos del mecanismo concreto, junto con quienes administran el territorio.", condition: "Contar con monitoreo o usar BioScanner no certifica créditos ni garantiza compradores o ingresos." },
  { title: "Marco de integridad para mercados de biodiversidad", org: "International Advisory Panel on Biodiversity Credits", type: "Financiamiento", lang: "EN", access: "Consulta pública", kind: "publica", url: "https://www.iapbiocredits.org/FRAMEWORK/framework", use: "Evaluar condiciones para financiar resultados verificables y proteger integridad y participación. Contrastar objetivos, metodología, adicionalidad y verificación con el mecanismo propuesto.", condition: "Estos instrumentos emergentes requieren valoración específica; mantener financiamiento operativo independiente de ingresos inciertos." },
  { title: "Accesibilidad de contenidos web", org: "World Wide Web Consortium", type: "Diseño digital", lang: "EN y traducciones", access: "Estándar público", kind: "publica", url: "https://www.w3.org/TR/WCAG22/", use: "Diseñar contenidos utilizables con teclado, lectores de pantalla y distintas capacidades. Aplicar WCAG 2.2 nivel AA como objetivo de diseño y realizar pruebas con personas usuarias.", condition: "La conformidad requiere evaluación de la implementación, no únicamente una declaración editorial." },
  { title: "Brecha de acceso digital urbana y rural", org: "Unión Internacional de Telecomunicaciones 2025", type: "Contexto", lang: "EN", access: "Consulta pública", kind: "publica", url: "https://www.itu.int/itu-d/reports/statistics/2025/10/15/ff25-internet-use-in-urban-and-rural-areas/", use: "Fundamentar estrategias de acceso que consideren conectividad y capacidades desiguales. Usar la comparación global y buscar el diagnóstico específico de la localidad.", condition: "Los promedios globales no describen por sí mismos la conectividad de Dzilam ni de cada país de la región." },
  { title: "Ampliación de la Reserva Estatal de Dzilam", org: "Gobierno del Estado de Yucatán 2024", type: "Política pública", lang: "ES", access: "Documento oficial", kind: "publica", url: "https://www.yucatan.gob.mx/docs/diario_oficial/diarios/2024/2024-09-23_2.pdf", use: "Consultar el Acuerdo 76 de 2024 y la fundamentación de la ampliación territorial. Revisar páginas impresas 62 y 63 y diferenciar evidencia técnica de decisión de autoridad.", condition: "La superficie de la reserva no equivale a superficie muestreada, restaurada o atribuible íntegramente a la iniciativa." },
  { title: "De los datos al impacto en Yucatán", org: "Cervera 2026 · UICN Tech4Nature", type: "Caso de aplicación", lang: "EN", access: "Consulta pública", kind: "publica", url: "https://tech4nature.iucngreenlist.org/from-data-to-impact-scaling-ai-powered-conservation-in-mexicos-yucatan-peninsula/", use: "Conocer el enfoque de liderazgo territorial, tecnología y colaboración de Tech4Nature México. Utilizar el caso para discutir capacidades que requieren continuidad y adaptación.", condition: "Diferenciar comunicación institucional de estimaciones ecológicas y consultar la metodología de cada cifra." },
];

export const RESOURCES: Resource[] = RAW_RESOURCES.map((r, i) => {
  const n = String(i + 1).padStart(2, "0");
  return { ...r, id: `r${n}`, code: `R${n}` };
});

export function needOf(code: string): NeedId {
  const n = parseInt(code.slice(1), 10);
  return (NEEDS.find((need) => n >= need.from && n <= need.to) ?? NEEDS[0]).id;
}

export const LIBRARY = {
  intro:
    "Las 66 fichas reúnen aplicaciones, datos, manuales y marcos de trabajo. Cada entrada indica para qué sirve, cómo comenzar y qué condición de uso o interpretación debe revisar. Los enlaces conducen al proveedor, autor o fuente institucional; la fecha de revisión editorial es el 27 de octubre de 2026.",
  howTo:
    "Primero seleccione la tarea y el nivel de acompañamiento disponible. Después compare requisitos de cuenta, conectividad, idioma, licencia, soporte, exportación y costo de continuidad. Ensaye un flujo pequeño de principio a fin antes de comprometer el archivo completo. Una herramienta de consulta puede bastar para explorar una pregunta; un análisis reproducible requiere conservar datos, versiones y parámetros.",
  scope:
    "La revisión documental identifica funciones y condiciones publicadas; no equivale a una prueba comparativa de todos los productos ni garantiza disponibilidad futura. La inclusión no supone aval institucional o integración nativa con BioScanner. Cada organización conserva la responsabilidad de comprobar términos y requisitos para su uso.",
};

// ---------------------------------------------------------------------------
// Glosario

export const GLOSSARY = [
  { term: "Archivo y observación", def: "Un archivo es una fotografía, video o audio. Puede contener ninguna, una o varias observaciones; no equivale a un individuo." },
  { term: "Evento", def: "Agrupación analítica de registros según una regla documentada. La separación temporal no demuestra independencia biológica." },
  { term: "Despliegue y esfuerzo", def: "Un despliegue vincula dispositivo, lugar y periodo. El esfuerzo efectivo mide observación comprobable, descontando interrupciones." },
  { term: "Detectabilidad", def: "Probabilidad de registrar una especie o individuo bajo condiciones de observación definidas, dado que está presente." },
  { term: "Ocupación y densidad", def: "La ocupación describe la presencia estimada en unidades de muestreo; la densidad expresa individuos por unidad de superficie. Requieren modelos y diseños adecuados." },
  { term: "Precisión y sensibilidad", def: "La precisión mide qué fracción de predicciones positivas es correcta; la sensibilidad mide qué fracción de positivos reales fue detectada." },
  { term: "Validación y verificación", def: "La validación examina la aptitud del dato, modelo o método para su uso. La verificación comprueba una afirmación o requisito mediante evidencia." },
  { term: "Conectividad", def: "La conectividad estructural describe disposición del hábitat; la funcional considera cómo organismos o procesos se desplazan a través del paisaje." },
  { term: "Soberanía e interoperabilidad", def: "La soberanía es capacidad de decidir sobre datos y usos. La interoperabilidad permite intercambiar e interpretar información con significado compartido." },
  { term: "MRV", def: "Medición, reporte y verificación de resultados bajo una metodología definida. La herramienta informática es una parte del sistema." },
  { term: "Mainstreaming", def: "Integración de la biodiversidad en políticas, presupuestos y procedimientos de sectores e instituciones." },
  { term: "OMEC", def: "Otra medida eficaz de conservación basada en áreas. Su reconocimiento depende de criterios específicos; no es sinónimo genérico de zona con biodiversidad." },
];

export const GLOSSARY_NOTE =
  "En esta guía, “resultado esperado” identifica un producto propuesto para quien aplica el toolkit. Los ejemplos didácticos se distinguen de los resultados documentados de Tech4Nature.";

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

const stripRefs = (s: string) => s.replace(/\s*\[[^\]]+\]/g, "");
const clip = (s: string, n = 158) => (s.length > n ? `${s.slice(0, n - 1).trimEnd()}…` : s);

export type PageKind =
  | "inicio"
  | "contexto"
  | "caso"
  | "gestion"
  | "diagnostico"
  | "accion"
  | "noventa-dias"
  | "ejercicio"
  | "plantillas"
  | "plantilla"
  | "biblioteca"
  | "glosario"
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
  /** Id de la acción o plantilla que muestra. */
  ref?: string;
};

export const GROUPS = [
  { id: "empezar", label: "Empezar" },
  ...STEPS.map((s) => ({ id: s.id, label: `${s.n} · ${s.title}` })),
  { id: "practica", label: "Práctica" },
  { id: "plantillas", label: "Plantillas" },
  { id: "recursos", label: "Recursos" },
  { id: "cierre", label: "Cierre" },
];

export const actionSlug = (a: Action) => `${a.id}-${slugify(a.short)}`;
export const templateSlug = (t: Template) => `${t.id}-${slugify(t.short)}`;

export const PAGES: ToolkitPage[] = [
  {
    slug: "",
    kind: "inicio",
    title: HERO.title,
    label: "Inicio",
    group: "empezar",
    description:
      "6 pasos, 12 acciones, 10 plantillas y 66 recursos para monitorear biodiversidad con IA y llevar la evidencia a decisiones de conservación. Aprendizajes de Tech4Nature México.",
  },
  {
    slug: "contexto",
    kind: "contexto",
    title: "Por qué fortalecer la inteligencia territorial en la región",
    label: "Por qué la inteligencia territorial",
    group: "empezar",
    description:
      "Datos de contexto para América Latina y el Caribe —Índice Planeta Vivo, áreas protegidas, brecha digital y energía— y qué implican para diseñar una iniciativa de monitoreo.",
  },
  {
    slug: "caso",
    kind: "caso",
    title: "Capacidades construidas por Tech4Nature México",
    label: "Capacidades de Tech4Nature",
    group: "empezar",
    description:
      "146 especies, 333,099 archivos en BioScanner y un jaguar reidentificado a 40 km: lo que documentó Tech4Nature México en Yucatán y qué aprendizajes son transferibles.",
  },
  {
    slug: "gestion",
    kind: "gestion",
    title: "Cómo se conecta la evidencia con la gestión",
    label: "De la evidencia a la gestión",
    group: "empezar",
    description:
      "De los registros de fauna a la ampliación de la Reserva Estatal de Dzilam: cómo construir una cadena documental entre evidencia, autoridad y decisión.",
  },
  {
    slug: "diagnostico",
    kind: "diagnostico",
    title: "Evaluar condiciones antes de desplegar tecnología",
    label: "Diagnóstico de preparación",
    group: "empezar",
    description:
      "Diagnóstico interactivo de ocho condiciones —pregunta, derechos, datos, campo, financiamiento— para definir el trabajo inicial antes de comprar equipos.",
  },
  ...ACTIONS.map(
    (a): ToolkitPage => ({
      slug: actionSlug(a),
      kind: "accion",
      title: a.title,
      label: a.short,
      group: `paso-${a.step}`,
      description: clip(`${a.code}: ${stripRefs(a.result)}`),
      code: a.code,
      ref: a.id,
    }),
  ),
  {
    slug: "noventa-dias",
    kind: "noventa-dias",
    title: "Organizar los primeros noventa días",
    label: "Primeros noventa días",
    group: "practica",
    description:
      "Calendario orientativo de 90 días con productos comprobables y tres combinaciones de herramientas según conectividad y acompañamiento disponible.",
  },
  {
    slug: "ejercicio",
    kind: "ejercicio",
    title: "Ejercicio completo para practicar el flujo de trabajo",
    label: "Ejercicio y laboratorio",
    group: "practica",
    description:
      "Practica con dos campañas ficticias: calcula eventos por 100 días cámara, precisión y sensibilidad, y aprende por qué 20 eventos no son 20 individuos.",
  },
  {
    slug: "plantillas",
    kind: "plantillas",
    title: "Diez plantillas listas para completar",
    label: "Todas las plantillas",
    group: "plantillas",
    description:
      "Diez plantillas descargables en CSV y Markdown: diseño de la iniciativa, gobernanza de datos, despliegue, calidad, modelos, jaguares, análisis, decisiones, presupuesto y aprendizaje.",
  },
  ...TEMPLATES.map(
    (t): ToolkitPage => ({
      slug: templateSlug(t),
      kind: "plantilla",
      title: t.title,
      label: t.short,
      group: "plantillas",
      description: clip(`Plantilla ${t.code} descargable. ${t.intro}`),
      code: t.code,
      ref: t.id,
    }),
  ),
  {
    slug: "biblioteca",
    kind: "biblioteca",
    title: "Biblioteca para seleccionar herramientas y fuentes",
    label: "Biblioteca de 66 recursos",
    group: "recursos",
    description:
      "66 fichas de herramientas, datos, manuales y marcos para conservación con IA, filtrables por necesidad, acceso e idioma, con su condición de uso.",
  },
  {
    slug: "glosario",
    kind: "glosario",
    title: "Glosario para interpretar los resultados",
    label: "Glosario",
    group: "recursos",
    description:
      "Detectabilidad, esfuerzo, ocupación, precisión, soberanía de datos, MRV y otros términos para interpretar resultados de monitoreo sin sobreafirmar.",
  },
  {
    slug: "insignia",
    kind: "insignia",
    title: "Tu insignia del toolkit",
    label: "Insignia y cierre",
    group: "cierre",
    description:
      "Revisa las 12 acciones para desbloquear la insignia del Toolkit Tech4Nature México, descárgala y compártela en redes.",
  },
];

export const PAGE_BY_SLUG = new Map(PAGES.map((p) => [p.slug, p]));

/** Ruta de una página del toolkit, con locale y ancla opcional. */
export function toolkitHref(locale: string, slug: string, hash?: string): string {
  return `/${locale}${TOOLKIT_PATH}${slug ? `/${slug}` : ""}${hash ? `#${hash}` : ""}`;
}

/** Página y ancla a las que lleva un código (A01, T01, R01, E01) o una clave de ruta. */
export function targetOf(key: string): { slug: string; hash?: string } {
  if (/^A\d{2}$/.test(key)) return { slug: actionSlug(ACTIONS.find((a) => a.code === key)!) };
  if (/^T\d{2}$/.test(key)) return { slug: templateSlug(TEMPLATES.find((t) => t.code === key)!) };
  if (/^R\d{2}$/.test(key)) return { slug: "biblioteca", hash: key.toLowerCase() };
  if (/^E\d{2}$/.test(key)) return { slug: "caso", hash: "fuentes-caso" };
  return { slug: key };
}
