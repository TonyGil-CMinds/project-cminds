export * from "./data";

/**
 * English version of the toolkit texts. Same shape as data.ts; ids, codes,
 * slugs, URLs and image sources stay identical. Resources (RESOURCES) and
 * SOURCES are re-exported in Spanish.
 */
import {
  IMAGES as ES_IMAGES,
  AUDIO_RECORDER as ES_AUDIO_RECORDER,
  GL_MANUAL_URL,
  GL_WORKSHEET_URL,
  RESOURCES,
  TOOLKIT_DATE_LABEL as ES_TOOLKIT_DATE_LABEL,
  GLOSSARY_INTRO as ES_GLOSSARY_INTRO,
  TEMPLATES_INTRO as ES_TEMPLATES_INTRO,
  LIVING_NOTE as ES_LIVING_NOTE,
  stageSlug,
  templateSlug,
} from "./data";
import type {
  AccessKind,
  Audience,
  CategoryId,
  GlossaryTerm,
  Img,
  Kpi,
  Level,
  Stage,
  Template,
  ToolkitPage,
} from "./data";

/** data.ts declares the plain string constants with literal types; widen and cast so `Content` still matches. */
export const TOOLKIT_DATE_LABEL = "October 2026" as string as typeof ES_TOOLKIT_DATE_LABEL;

export const IMAGES = {
  hero: { src: ES_IMAGES.hero.src, alt: "Tech4Nature Mexico field team walking through the Yucatán forest" },
  jaguar: { src: ES_IMAGES.jaguar.src, alt: "Jaguar resting in a treetop" },
  algorithm: { src: ES_IMAGES.algorithm.src, alt: "Code for an artificial intelligence model on a screen" },
  platform: { src: ES_IMAGES.platform.src, alt: "Conservation leaders reviewing records on a computer" },
  bioscanner: { src: ES_IMAGES.bioscanner.src, alt: "BioScanner logo" },
  logo: { src: ES_IMAGES.logo.src, alt: "Tech4Nature Mexico" },
  afbLogo: { src: ES_IMAGES.afbLogo.src, alt: "AI for Climate & Biodiversity" },
  people: { src: ES_IMAGES.people.src, alt: "Community monitors, families and the Tech4Nature Mexico team gathered under a palapa in Dzilam de Bravo" },
  forestPath: { src: ES_IMAGES.forestPath.src, alt: "Field team walking through the forest of the Dzilam State Reserve" },
  kingfisher: { src: ES_IMAGES.kingfisher.src, alt: "Community monitors checking an acoustic recorder in the wetland" },
  earth: { src: ES_IMAGES.earth.src, alt: "Community monitors crossing a flooded wetland in the reserve" },
  feline: { src: ES_IMAGES.feline.src, alt: "Juan Castillo next to a camera trap mounted on a tree" },
  dashboard: { src: ES_IMAGES.dashboard.src, alt: "BioScanner workshop with community monitors and protected area teams" },
  map: { src: ES_IMAGES.map.src, alt: "Tech4Nature Mexico team in the bed of a pickup truck before heading into the field" },
  mistyForest: { src: ES_IMAGES.mistyForest.src, alt: "Wetland with cattails and mangroves on the northern coast of Yucatán" },
  pineLight: { src: ES_IMAGES.pineLight.src, alt: "Attendees at the first Chac Mool Jaguar Festival in Dzilam de Bravo" },
  turtle: { src: ES_IMAGES.turtle.src, alt: "Sunset over the Dzilam forest" },
};

// ---------------------------------------------------------------------------
// Home

export const HERO = {
  title: "Tech4Nature Mexico: replication toolkit",
  subtitle:
    "A toolkit to co-design, implement and sustain AI-powered conservation projects in Latin America and the Caribbean",
  eyebrow: "Lessons from Tech4Nature Mexico (2022–2026) and other initiatives across the region",
};

export const INTRO = {
  paragraphs: [
    "Yes, if you work in a protected area, a community, a local government, a university or an organization and want to harness the positive impact of technology and data to effectively conserve species and territories. To get started, you need a goal and partners willing to work toward it together.",
    "Here you will find what we learned over four years of work in the Dzilam State Reserve, in Yucatán, together with community leaders, the state government, universities and technology partners. You will also find examples from Colombia, Ecuador, Bolivia, Peru and other parts of Yucatán, because each territory solves the same challenges in its own way.",
  ],
  outcomes: [
    "Align goals across institutions to work toward a shared purpose.",
    "Agree with the community and institutions on who decides about the data and how it is shared.",
    "Place camera traps and acoustic devices using local knowledge of trails and wildlife crossings, with manuals in Spanish.",
    "Use BioScanner and other free AI tools to review thousands of images in days.",
    "Observe changes in the territory with mapping and AI platforms that require no coding.",
    "Bring the evidence into management decisions and sustainability models for the territory.",
  ],
  howTo:
    "The toolkit has five stages. You can read them in order or go straight to the one you need. Each stage explains what it's for, what we did in Dzilam, how to move forward, a lesson learned, tools to get started and an example from another initiative in the region.",
};

// ---------------------------------------------------------------------------
// Paths by audience

export const AUDIENCES: Audience[] = [
  {
    id: "territorio",
    title: "Community leader or protected area team",
    short: "Stage 1 (goal alignment) and Stage 2 (co-design and deployment)",
    path: ["E1", "E2"],
  },
  {
    id: "autoridades",
    title: "Environmental authority or local government",
    short: "Stage 1 and Stage 5 (decide and sustain)",
    path: ["E1", "E5"],
  },
  {
    id: "academia",
    title: "University, student or science team",
    short: "Stage 3 (analyze with AI) and Stage 4 (observe the territory)",
    path: ["E3", "E4"],
  },
  {
    id: "aliados",
    title: "Technology partner or funder",
    short: "The people behind Tech4Nature, Stage 3 and Stage 5",
    path: ["equipo", "E3", "E5"],
  },
];

// ---------------------------------------------------------------------------
// Why it matters

export const WHY = {
  intro:
    "Latin America and the Caribbean holds a large share of the planet's biodiversity, and Mexico is home to about 12% of the world's species. The region also shows the steepest declines in wildlife populations. At the same time, it has a strong tradition of community conservation and a growing set of open tools to measure what happens on the ground. The opportunity lies in bringing the two together.",
  planet: {
    title: "The planet outside its safe operating space",
    source: "Planetary Health Check 2026 (Potsdam Institute, September 2026)",
    text: "Seven of the nine planetary boundaries have been crossed, all seven at their highest recorded level. They include biosphere integrity and land-system change, the two that a project like Tech4Nature helps measure and address.",
    boundaries: [
      { name: "Biosphere integrity", crossed: true, focus: true },
      { name: "Land-system change", crossed: true, focus: true },
      { name: "Freshwater", crossed: true },
      { name: "Nitrogen and phosphorus flows", crossed: true },
      { name: "Novel entities", crossed: true },
      { name: "Climate", crossed: true },
      { name: "Ocean acidification", crossed: true },
      { name: "Ozone layer", crossed: false },
      { name: "Atmospheric aerosols", crossed: false },
    ],
    meaning: "Measuring biodiversity with sound methods and continuity shows whether local actions are helping to reverse the trend.",
  },
  lpr: {
    title: "The steepest decline is in our region",
    source: "Living Planet Report 2026 (WWF and ZSL), average change from 1970 to 2022",
    regions: [
      { name: "Latin America and the Caribbean", value: 95, focus: true },
      { name: "Africa", value: 80 },
      { name: "Asia-Pacific", value: 49 },
      { name: "North America", value: 28 },
      { name: "Europe and Central Asia", value: 23 },
    ],
    meaning:
      "The index describes an average change in the size of monitored vertebrate populations; it does not equal extinct species. Measuring continuously shows whether local actions are working.",
  },
  jaguar: {
    title: "A third of Mexico's jaguars live on the peninsula",
    source: "Third National Jaguar Census, data to 2024; IUCN SSC Cat Specialist Group",
    total: 5326,
    peninsula: 1699,
    text: "The jaguar is listed as Near Threatened by the IUCN and occupies about 51% of its historical range.",
    meaning: "It is an umbrella species: it needs large, connected territories, so monitoring it helps understand and protect the whole landscape.",
  },
  empty: {
    title: "Nine out of ten photos are empty",
    source: "BioScanner project report for Tech4Nature Mexico, 2022–2026",
    total: 333087,
    empty: 296622,
    text: "In the Dzilam monitoring, 89% of files contained no animals. In other projects the share ranges from 70% to 95% (MegaDetector), and an expert reviews between 300 and 1,000 images per hour (Wildlife Insights).",
    meaning: "AI sets aside the empty files and suggests species within hours; experts spend their time validating and interpreting.",
  },
  connectivity: {
    title: "Less connectivity where monitoring happens",
    source: "IICA and partners (2022), meaningful connectivity in Latin America and the Caribbean",
    bars: [
      { name: "Urban population", value: 79 },
      { name: "Rural population", value: 43, focus: true },
    ],
    meaning: "Design to work offline in the field and sync later. The tools in this toolkit make that possible.",
  },
};

// ---------------------------------------------------------------------------
// Tech4Nature Mexico at a glance

export const CASE = {
  intro: [
    "Tech4Nature Mexico began in 2022 in the Dzilam State Reserve, on the northern coast of Yucatán, as part of the global Tech4Nature partnership between the IUCN and Huawei. It is co-led by C Minds, the Yucatán Ministry of Sustainable Development (SDS) and the Chac Mool Group, made up of community leaders from the Dzilam State Reserve. Pronatura Península de Yucatán, the Universidad Politécnica de Yucatán and Fundación Pachamama are strategic collaborators.",
    "The starting question was simple: how can technology help us better understand the reserve's wildlife and support the decisions of those who care for it? To answer it, the team combined camera traps, acoustic monitoring and AI models to detect species and identify individual jaguars. That work gave rise to BioScanner, the platform that now brings these capabilities together so other teams can use them.",
  ],
  kpis: [
    { value: 146, label: "species recorded in phase 1, 40 of them in a risk category" },
    { text: "20+ / 60", label: "camera traps / acoustic recorders deployed in phase 1" },
    { value: 93, suffix: "%", label: "model accuracy in jaguar detection" },
    { value: 333087, label: "files processed in BioScanner as of October 2026", note: "317,565 photos and 15,522 videos" },
    { value: 16, label: "individual jaguars identified over the years", note: "Verification in progress" },
    { value: 40, prefix: "~", suffix: " km", label: "between two records of the same jaguar, from Dzilam toward Ría Lagartos" },
    { value: 104304, suffix: " ha", label: "area of the Dzilam State Reserve after its expansion", note: "Previously 69,000 ha" },
  ] satisfies Kpi[],
  timeline: [
    {
      range: "2022–2024 · Phase 1",
      text: "Co-design of the project based on needs identified by local leaders and the government; agreements among multisector peers on coordination, follow-up and learning roles; deployment of the monitoring effort; adaptive learning and continuous data collection; data analysis; and the conception of BioScanner for individual jaguar identification.",
    },
    {
      range: "2024",
      text: "The Government of Yucatán expands the Dzilam State Reserve to 104,304 ha. The rationale for the decree includes Tech4Nature Mexico camera trap studies, jaguar records in neighboring areas and the need to strengthen ecological connectivity.",
    },
    {
      range: "April 2025 · Phase 2",
      text: "Launch at the Tech4Nature Summit in Mérida. Goals: jaguar population distribution, support for management decisions and work toward a biological corridor.",
    },
    {
      range: "2025–2026",
      text: "BioScanner consolidates as a platform for analyzing camera trap biodiversity data to inform conservation, regeneration and connectivity decisions, with jaguar identification as its core strategy. The team builds the area's jaguar catalog, begins a connectivity study with Ría Lagartos, supports the update of the management program and carries out IUCN Green List self-assessments in Dzilam and Ría Lagartos.",
    },
    {
      range: "October 2026",
      text: "The lessons learned are published in this toolkit so other territories in Latin America and the Caribbean can create their own Tech4Nature.",
    },
  ],
  story: {
    name: "Juan Castillo",
    role: "Founding community monitor, Chac Mool Monitoring Group",
    paragraphs: [
      "Juan Castillo grew up in a nomadic family that roamed the forest long before it became a protected area. Settling near water sources, they thrived on hunting, farming and cattle ranching. Like his family, Juan used to believe that defending the cattle from jaguars came first, even if it meant killing these big cats.",
      "Over the years, he reached a profound realization: it was he and his family who were moving into the jaguar's habitat and using its resources, not the other way around. He made a bold decision to take his cattle out of the reserve and move to town.",
      "Now a grandfather, Juan passes on his love of nature to his grandchildren, teaching them that these species are worth more alive than dead, and that they are vital to the survival of the forest, its countless inhabitants and, ultimately, people.",
      "Today, Juan has donated his land for conservation. Together with his friend Benjamín, a former hunter, he has become a respected guide, explorer and passionate advocate for jaguar conservation and for protecting its prey, the tropical forest and the mangroves. They carefully look after the camera traps, keeping everyone in the Tech4Nature Mexico project safe. Juan Castillo has become an international advocate for conservation, admired for his tireless dedication to this cause.",
    ],
  },
};

// ---------------------------------------------------------------------------
// The five stages

export const STAGES: Stage[] = [
  {
    id: "e1",
    code: "E1",
    n: 1,
    title: "Aligning goals with needs and contexts",
    short: "Goal alignment",
    question: "What do we want to achieve, why, and who decides?",
    result: "Goals aligned among partners and a data agreement",
    image: IMAGES.people,
    purpose:
      "Before deciding on methods, it is important to know which conservation, regeneration, well-being, Buen Vivir and prosperity goal you are pursuing. In today's climate, social and geopolitical contexts, and with accelerating access to artificial intelligence systems and data, defining a course of action that takes all these variables into account will be key to achieving effective results.",
    dzilam: {
      title: "What we did in Dzilam",
      paragraphs: [
        "The foundation of these processes is governance. The SDS took part from the design stage, together with the Chac Mool Group and C Minds. Tech4Nature Mexico has a history that predates the project: for a long time, Juan Castillo, along with leaders from the communities of Dzilam de Bravo and Dzilam González, voiced to the authorities their concern about jaguar hunting in the area. When the SDS confirmed the presence of the species, bringing in technology to monitor biodiversity became especially relevant. C Minds came to the table with protocols and courses of action, visibility, data sovereignty and multisector coordination, and the IUCN and Huawei joined to ensure alignment with the Green List and to provide computing capacity, respectively.",
        "It is the spaces for listening, joint work and trust, the combination of different capabilities so that each actor fulfills a role, and the ability to coordinate actions transparently and ensure effective governance that have determined the initiative's success.",
      ],
    },
    steps: [
      "Listen to the needs of the territory and the institutions: what concerns the community, what the authority needs and what capabilities each partner can bring. In Dzilam, everything began with the community's concern about jaguar hunting.",
      "Build a shared conservation, regeneration and well-being goal with your partners, and name the decisions it will help make, such as a biological corridor or the update of a management program.",
      "Agree on each actor's role: coordination, fieldwork, scientific review, technical support, follow-up and learning. Use the start-up sheet. [P1]",
      "Define how decisions will be made among peers: spaces for dialogue, meeting frequency, how agreements are recorded and how disagreements are resolved.",
      "With the community's free, prior and informed consent, agree in writing on who owns the data, who can see it, what is published and what is protected. Locations of sensitive species are always protected. [P2]",
      "Agree on how the work of people from the territory is recognized and compensated, and how benefits are shared.",
    ],
    learning:
      "In Dzilam, the trust among the community, the state government and C Minds, built from the design stage, allowed the data to become part of a public process. When each actor has a clear role and actions are coordinated transparently, the evidence arrives in time for the decision.",
    tools: [
      "[Sovereign Data Supply Chain](https://ecos.cminds.co/publicaciones/sovereign-data-supply-chain?reader=1) (Kinray Hub, NaturaTech LAC and Climate Collective), the framework that guides our data agreements.",
      "[Principios CREA para la gobernanza de datos indígenas](https://www.gida-global.org/s/Principios-CREA.pdf) (GIDA, Spanish version of the CARE Principles).",
      "[Buenas prácticas para generalizar datos de especies sensibles](https://docs.gbif.org/sensitive-species-best-practices/master/es/buenas-practicas-para-generalizar-datos-de-especies-sensibles-en-registros-biologicos.es.pdf) (GBIF, in Spanish).",
      "[Recomendación sobre la Ética de la Inteligencia Artificial](https://digitallibrary.un.org/record/4062376/files/1416674-ES.pdf) (UNESCO, in Spanish).",
      "[AI for Environment and Ecosystems Toolkit](https://www.unesco.org/ethics-ai/en/ai-environment-ecosystems-toolkit) (UNESCO), for government teams.",
      "Templates 1 and 2 of this toolkit: start-up sheet and data agreement. [P1, P2]",
    ],
    elsewhere: {
      place: "Puuc Biocultural Reserve, Yucatán",
      text: "Since 2021, 43 people from four ejidos in Tekax have operated 16 camera traps in the reserve's buffer zone, with support from the SDS, WWF, the Junta Intermunicipal Biocultural del Puuc, CONAFOR and UNDP. They have recorded 36 species of mammals, birds and reptiles with an investment of 96,000 pesos. The case shows that a small project led by ejido members can produce useful information when there is local commitment and alignment with the state's conservation policy.",
      link: {
        label: "See case (Regions4 and SDS, in Spanish)",
        url: "https://www.theclimategroup.org/sites/default/files/2024-01/MONITOREO-COMUNITARIO_YUCATAN_ES_CSD_0.pdf",
      },
    },
  },
  {
    id: "e2",
    code: "E2",
    n: 2,
    title: "Co-design and deployment",
    short: "Co-design and deployment",
    question: "How do we design monitoring with the territory and collect reliable data?",
    result: "An agreed monitoring design and equipment installed and logged",
    image: IMAGES.feline,
    purpose:
      "Monitoring is designed together: knowledge of the territory, scientific rigor and technical capabilities define what is measured, where and how. The quality of everything that follows depends on that design and on an orderly record of every piece of equipment installed.",
    dzilam: {
      title: "What we did in Dzilam",
      paragraphs: [
        "Community leaders from the Chac Mool Group, the SDS and C Minds chose the monitoring sites together: the community monitors knew where the jaguar crossed and where equipment could withstand flooding. In phase 1, camera traps and 60 acoustic recorders were installed in mangroves and low forest, and the Chac Mool Group handled installation, maintenance and data downloads. Combining image and sound broadened the wildlife groups recorded: cameras capture medium and large mammals, while recorders pick up birds, amphibians and insects. In phase 2, digital forms were tested to log field activities.",
      ],
    },
    steps: [
      "Hold a co-design workshop with the community team, the authority and people trained in ecology: species of interest, sites, visit schedule, roles and field budget.",
      "Choose the method according to the goal: camera traps for medium and large mammals and for jaguars; acoustic recorders such as AudioMoth for birds, amphibians, bats and insects; both for a broad inventory.",
      "Place stations with people who know the trails, wildlife crossings, waterholes and hunting areas, and combine them with a systematic design that allows sites to be compared. Record that knowledge in template 5. [P5]",
      "To identify individual jaguars, install cameras in pairs, facing each other, to photograph both flanks of the animal.",
      "Log each camera with the same fields BioScanner requires, ideally in a KoboToolbox form on a phone with good GPS. Use template 3. [P3]",
      "Store the original files in one folder per camera and per visit, and make a backup copy before processing.",
    ],
    learning:
      "Local knowledge about where wildlife moves was as valuable as the equipment. When the community team takes part in the design, it also takes charge of maintenance, and monitoring continues between field campaigns.",
    tools: [
      "[Manual de fototrampeo para estudio de fauna silvestre: el jaguar en México como estudio de caso](https://simec.conanp.gob.mx/Publicaciones2020/Publicaciones%20CONANP/Parte%203/Manuales/2013%20Manual%20fototrampeo%20jaguar.pdf) (Chávez et al., 2013, in Spanish).",
      "[Manual de fototrampeo: herramienta de investigación para la conservación de la biodiversidad en Colombia](http://hdl.handle.net/20.500.11761/31415) (Instituto Humboldt and Panthera, 2012, in Spanish).",
      "[BIOCOMUNI v2.0 Fauna](https://desarrollo.fmcn.org/wp-content/uploads/2025/06/BIOCOMUNI_v2.0_Fauna.pdf) (FMCN and CONAFOR, in Spanish), a community monitoring protocol with printable forms.",
      "[Introducción al monitoreo ambiental comunitario](https://transformativepathways.net/wp-content/uploads/2024/07/JA-591-Introduction-to-community-based-environmental-monitoring-ICCS-ES-v2-FINAL.pdf) (Forest Peoples Programme, in Spanish): designing monitoring with the community.",
      "[Buenas prácticas para gestionar y publicar datos de cámaras trampa](https://docs.gbif.org/camera-trap-guide/es/) (GBIF, 2026, in Spanish).",
      "[KoboToolbox](https://www.kobotoolbox.org), free field forms that work offline and record location with the phone's GPS.",
      "[SMART](https://smartconservationtools.org), a free tool to log patrols and observations in protected areas.",
    ],
    elsewhere: {
      place: "Alto Isoso, Bolivia",
      text: "Ten Guaraní community park rangers monitor the Chaco guanaco in the Guajukaka Habitat Area (284,670 ha), in the Guaraní Indigenous Autonomy of Charagua Iyambae. They use SMART offline, camera traps and fecal samples for DNA analysis. It was the first site in Bolivia to implement SMART, and Fundación Natura Bolivia is extending the model to 24 subnational protected areas. Operations cost about 2,500 dollars a month, a useful figure for budget planning.",
      link: {
        label: "See case (PANORAMA)",
        url: "https://panorama.solutions/en/solution/technology-roots-guarani-indigenous-guardians-safeguarding-guanaco-and-their-collective",
      },
    },
  },
  {
    id: "e3",
    code: "E3",
    n: 3,
    title: "Analyze with AI",
    short: "Analyze with AI",
    question: "How do we turn thousands of files into information?",
    result: "Species and jaguars identified and validated by people",
    image: IMAGES.dashboard,
    purpose:
      "A camera trapping campaign can generate hundreds of thousands of files. AI filters out empty images, suggests the species and helps recognize individuals. People validate every result before it is used, and that human review is part of the method.",
    dzilam: {
      title: "What we did in Dzilam: BioScanner",
      paragraphs: [
        "BioScanner is a platform developed by C Minds as part of Tech4Nature Mexico, incubated with the IUCN and Huawei and built on Huawei Cloud. It detects and classifies species in photos and videos, identifies individual jaguars by their spot patterns and generates reports. Its interface is available in Spanish, English, Portuguese and Maya. As of October 2026 it had processed 333,087 photos and videos from the reserve.",
        "It was designed so that non-technical teams can use AI, and with the aim that each community and institution decides about its own data: who sees it, what is shared and with whom.",
      ],
    },
    steps: [
      "Create the organization and the project, and invite your team. Start with a small analysis of one or two cameras to get to know the tool.",
      "Register the cameras by importing the CSV from template 3, or let BioScanner read the GPS coordinates from the files. [P3]",
      "Upload one folder per camera and per visit, set the period and turn on the detection, classification and grouping modules.",
      "Check under “Cameras and dates” that each folder is assigned to its camera and that the camera clocks were set correctly.",
      "Validate the suggested species, taking extra care with rare species, look-alikes and those that matter for your decision. For jaguars, compare both flanks and confirm each new identity with at least two people.",
      "Use the project report and download the validated results to analyze, share or publish them in a standard format such as Camtrap DP.",
    ],
    learning:
      "AI made it possible to work with an archive of more than 300,000 media files, and expert review gave the results credibility. Students' participation in developing and reviewing models also built new capacity in the region.",
    tools: [
      "[BioScanner](https://app.bioscanner.io) (C Minds). Account-based access, currently in early access.",
      "[Tech4Nature Mexico public repository on GitHub](https://github.com/aiforclimate/tech4naturemexico), with the notebook for the jaguar identification model.",
      "[Wildlife Insights](https://www.wildlifeinsights.org) (Google and partners), a cloud platform that is free for most organizations in the region.",
      "[AddaxAI](https://github.com/PetervanLunteren/AddaxAI), a free desktop program that runs MegaDetector without coding and works offline.",
      "[Arbimon](https://arbimon.org) ([getting started](https://help.rfcx.org/arbimon/get-started/getting-started-with-arbimon/)) and [BirdNET](https://birdnet.cornell.edu), to identify species in acoustic recordings.",
    ],
    elsewhere: {
      place: "Kichwa communities of Napo, Ecuador",
      text: "Fundación Jocotoco retrained AI models with sounds from the Ecuadorian Amazon and classified more than 2 million audio files collected between 2023 and 2025. Since late 2025 it has operated acoustic monitors in the Kichwa communities of Santa Rita and San Francisco, recognized as Ecuador's first community-based OECMs. The communities use the validated species list to zone their territory, secure funding and present evidence against mining and logging. The results were translated into Kichwa for community assemblies, and the park rangers added the sound of brush cutters to the model.",
      link: { label: "See report (Mongabay Latam, in Spanish)", url: "https://elbuho.pe/?p=424346" },
    },
  },
  {
    id: "e4",
    code: "E4",
    n: 4,
    title: "Observe the territory",
    short: "Observe the territory",
    question: "What is changing in the territory?",
    result: "A shared reading of changes in the territory",
    image: IMAGES.earth,
    purpose:
      "Cameras tell you which species are present; satellite images show what is happening to their habitat. Together they help understand where wildlife moves, which areas are changing and where it makes sense to act. This stage is an orientation: today there are platforms you can ask questions without any background in geographic information systems.",
    dzilam: {
      title: "What we did in Dzilam",
      paragraphs: [
        "The same jaguar was photographed at two sites about 40 km apart, between Dzilam and its transition toward the Ría Lagartos Biosphere Reserve. That record prompted a connectivity study between the two reserves and opened a conversation about a joint action area. The record confirms the animal was at both sites; the route it took requires more data to be known.",
      ],
    },
    steps: [],
    learning:
      "A single well-documented record can open a conversation between institutions. The value of the 40 km record lay in turning it into a question shared by two reserves.",
    tools: [
      "[Global Nature Watch](https://www.globalnaturewatch.org) (WRI), with an AI assistant that answers questions about land cover and land change.",
      "[Planet's geospatial AI agent](https://www.satellitetoday.com/imagery-and-sensing/2026/05/21/planet-is-building-an-agentic-geospatial-ai-query/), in private beta since May 2026.",
      "[Planet tropical mosaics (NICFI program)](https://www.planet.com/nicfi/), free high-resolution imagery for non-commercial use in the tropics.",
      "[MapBiomas México](https://mexico.mapbiomas.org), free annual land cover and land use maps.",
      "[Dynamic World](https://dynamicworld.app), near-real-time land cover at 10 m.",
      "[Global Mangrove Watch](https://www.globalmangrovewatch.org), useful for mangrove coastlines like Dzilam.",
      "[QGIS](https://qgis.org) and [Google Earth Engine](https://earthengine.google.com/noncommercial/), for teams trained in geographic analysis.",
    ],
    elsewhere: {
      place: "MAAP and FENAMAD, Madre de Dios, Peru",
      text: "Amazon Conservation's Monitoring of the Andean Amazon Project (MAAP) has published short reports based on satellite imagery since 2015. It shares its analyses with the Native Federation of the Madre de Dios River and Tributaries (FENAMAD), which represents 38 Indigenous communities and uses them for patrols and legal action against illegal incursions. Its format, one map and one message per report, is a good model for communicating findings to authorities and communities.",
      link: {
        label: "See case (Amazon Conservation)",
        url: "https://www.amazonconservation.org/celebrating-10-years-of-maap-stopping-deforestation-and-driving-conservation-impact-at-scale/",
      },
    },
  },
  {
    id: "e5",
    code: "E5",
    n: 5,
    title: "Decide and sustain",
    short: "Decide and sustain",
    question: "How is the evidence used, and how do we sustain what we have built?",
    result: "Informed decisions and a sustainability model for the territory",
    image: IMAGES.pineLight,
    purpose:
      "Monitoring fulfills its purpose when the evidence reaches a decision: a management program, an expansion, an agreement between reserves or an investment. When data becomes information that demonstrates conservation, regeneration, ecological and cultural relevance, and relevance for climate regulation, it also opens innovative sustainability models for the territory.",
    dzilam: {
      title: "What we did in Dzilam",
      paragraphs: [
        "Monitoring evidence was part of the technical rationale the Government of Yucatán used to expand the Dzilam State Reserve from 69,000 to 104,304 ha in 2024, in line with its commitments toward the 30x30 target. The decision was the authority's, which brought together several studies and contributions. In phase 2, the project supported the update of the management program with 17 interviews, accompanied IUCN Green List self-assessments in Dzilam and Ría Lagartos, and shared lessons with the Puuc Biocultural Reserve. Long-term continuity is linked to Herencia Maya, a permanence financing scheme.",
      ],
    },
    steps: [
      "Identify the decision calendar (management program review, annual budget, public consultation) and have the evidence ready for that moment.",
      "Summarize the findings in one page per audience, using the figures from the BioScanner report. Use template 4. [P4]",
      "Analyze and interpret the results together with the territory and local partners, in spaces where everyone decides what they mean and what to do with them, and in the community's language.",
      "Use the IUCN Green List Standard as a guide to organize management evidence, even if you are not seeking certification. Start with the worksheet in template 6. [P6]",
      "Identify alternative economic opportunities and how the results can strengthen them: community tourism, regenerative agroforestry, education, or financial mechanisms such as biodiversity credits and payments for ecosystem services.",
      "Publish what you learned in formats others can reuse, such as a solution on PANORAMA or a dataset on GBIF.",
    ],
    learning:
      "Traceable, verifiable evidence is what helps most to open conversations with funders and institutions. An orderly record of what was measured, how and with what result is worth more than a striking number.",
    tools: [
      "[Estándar de la Lista Verde de Áreas Protegidas y Conservadas, versión 1.1](https://www.iucn.org/sites/default/files/2024-03/estandar-lista-verde-version-1.1.pdf) (IUCN, in Spanish).",
      "[Jaguar Biocultural Strategy and Jaguar Biocultural Credits](https://www.naturatech.org/en/minga-estrategia) (Sacred Headwaters Alliance, Fundación Pachamama and NaturaTech LAC).",
      "[Directrices de la UICN sobre conflictos y coexistencia entre humanos y vida silvestre](https://doi.org/10.2305/CFRX2122) (2024, in Spanish).",
      "[PANORAMA – Solutions for a Healthy Planet](https://panorama.solutions/es) (IUCN and partners), to publish and browse replicable cases.",
      "[Conservation Evidence Toolkit](https://about.conservationevidence.com/wp-content/uploads/2025/01/Conservation-Evidence-Toolkit-v1.0-15-01-2025.pdf), to assess whether actions work.",
    ],
    elsewhere: {
      place: "OTUS Network, Colombia",
      text: "Launched in 2024 by Colombia's 33 Regional Autonomous Corporations and Conservation International Colombia, the OTUS Network is a national camera trap network that processes its images with AI in Wildlife Insights. Cities such as Cali have joined with their own cameras and trained forest rangers. It shows how a network of environmental authorities can adopt a common tool and share lessons at national scale.",
      link: {
        label: "See article (El Espectador, in Spanish)",
        url: "https://www.elespectador.com/la-red-zoocial/lanzamiento-de-otus-la-red-nacional-de-camaras-de-fauna-como-funciona/",
      },
    },
  },
];

/** Acoustic recorders (stage 2). */
export const AUDIO_RECORDER = {
  title: "What about an acoustic recorder?",
  lead:
    "An autonomous acoustic recorder such as AudioMoth straps to a tree and records the soundscape on a schedule. It captures what a camera cannot see: birds, amphibians, bats and insects. It is open, low-cost and fits in the palm of your hand.",
  photo: { src: ES_AUDIO_RECORDER.photo.src, alt: "An AudioMoth recorder without its case in the palm of a hand, next to a camera trap and a phone in the forest" },
  caption: "An AudioMoth recorder before installation, next to a camera trap",
  links: [
    { label: "Manual de configuración e instalación de AudioMoth 1.2.0 (in Spanish, 2026)", url: "https://www.protocols.io/view/manual-de-configuraci-n-e-instalaci-n-de-audiomoth-hrpfb55jp.html" },
    { label: "AudioMoth Operation Manual (Open Acoustic Devices)", url: "https://github.com/OpenAcousticDevices/Application-Notes/blob/master/AudioMoth_Operation_Manual.pdf" },
    { label: "Configuring your AudioMoth for Arbimon (Rainforest Connection)", url: "https://help.rfcx.org/devices/field-recorders/configuring-your-audiomoth/" },
    { label: "Getting started with Arbimon, to analyze the recordings", url: "https://help.rfcx.org/arbimon/get-started/getting-started-with-arbimon/" },
  ],
};

/** How BioScanner works (stage 3), as of October 2026. */
export const BIOSCANNER_FLOW = [
  { title: "Organizations and projects", text: "Communities, governments and organizations create their workspace, invite their team and decide whether each analysis is private or public." },
  { title: "Cameras on the map", text: "Cameras are registered on the map, imported from a CSV or read from the files' GPS data. Each folder is assigned to its camera." },
  { title: "Three AI modules", text: "Animal detection, species classification and grouping of photos into events and individuals." },
  { title: "Jaguars", text: "BioScanner groups records by the animal's flank and suggests matches; people verify them before adding an individual to the catalog." },
  { title: "Project report", text: "Species and jaguars by station, independent events, effort, comparison between campaigns, species richness and activity throughout the day." },
  { title: "On your phone", text: "A viewing mode brings analyses, galleries and reports to the field. Anyone who knows a species can also contribute photos to improve the models." },
];

/** Stage 4 orientation: where to start, from simplest to most specialized. */
export const E4_ORIENT = [
  { title: "Ask the map", text: "Platforms such as Global Nature Watch answer plain-language questions like “how much forest has this municipality lost since 2020?”. Planet is developing a similar agent for its image archive." },
  { title: "See the changes", text: "MapBiomas México, Dynamic World and Global Mangrove Watch show land cover and its changes year by year, with nothing to install." },
  { title: "Zoom in with imagery", text: "Planet mosaics from the NICFI program offer monthly high-resolution imagery for the tropics, free for non-commercial use." },
  { title: "Go back to the territory", text: "Verify in the field, with the community team, what you see on the maps. Many changes have a local explanation." },
  { title: "As the team grows", text: "QGIS, Google Earth Engine and connectivity models require training; bring them in with academic partners or specialists." },
  { title: "Protect locations", text: "Present maps with date, source and scale, and protect the exact locations of sensitive species." },
];

/** Sustainability models (stage 5). */
export const E5_MODELS = {
  lead:
    "When the evidence demonstrates conservation, regeneration and ecological and cultural relevance, it can support economies and financial mechanisms that keep monitoring going and bring prosperity to the territory.",
  items: [
    { title: "Community tourism", text: "Tours, wildlife watching and festivals that share what lives in the territory, such as the Jaguar Festival in Dzilam de Bravo." },
    { title: "Regenerative production", text: "Agroforestry systems and ranching that coexist with wildlife, with evidence of their contribution to connectivity." },
    { title: "Education and community science", text: "Schools, universities and community monitors that build new capacity and provide monitoring services." },
    { title: "Biodiversity credits", text: "Instruments that recognize verifiable conservation results, such as the Jaguar Biocultural Credits in Ecuador." },
    { title: "Payments for ecosystem services", text: "Public and private programs that reward the conservation of forests, mangroves and water." },
    { title: "Permanence funds", text: "Long-term schemes, such as Herencia Maya in Yucatán, that secure resources for protected areas." },
  ],
};

// ---------------------------------------------------------------------------
// Biocultural monitoring

export const BIOCULTURAL = {
  lead:
    "People who live in a territory and know its paths hold highly valuable information: empirical, traditional and ancestral knowledge that comes from observation, daily coexistence and connection with the land.",
  leadMore:
    "In biocultural monitoring, that knowledge defines where each camera goes, what is recorded and how the results are interpreted. Technology extends what the community already observes, and the community gives meaning to what the technology records.",
  contributions: [
    {
      title: "Behavior of the region's species",
      text: "Knowledge about the presence of animals, their behavior, where they roam, whether they have stopped appearing, whether climate and weather have affected their lives, and much more.",
    },
    {
      title: "Water, food and shelter",
      text: "Waterholes, cenotes, fruiting trees, salt licks and burrows that concentrate wildlife depending on the season.",
    },
    {
      title: "Hunting and pressure",
      text: "Areas, seasons and species for hunting, fishing and extraction. They help explain why a site has fewer records and where monitoring is most needed.",
    },
    {
      title: "Names and stories in Indigenous languages",
      text: "How each species is named and classified in the traditional language. This brings cultural heritage closer to scientific results.",
    },
  ],
  dzilam: [
    "In Dzilam, community leaders from the Chac Mool Group chose and characterized the monitoring sites: they knew where the jaguar crossed and where equipment could withstand flooding. Some, like Juan Castillo, came to know the forest through hunting and ranching, and today use that experience to care for it. They also take part in monthly fieldwork, maintain the equipment and help validate species records.",
    "That knowledge also guides interpretation: a record at a known crossing or an encounter between a jaguar and cattle is read together with the people who live in the territory. A protocol for responding to those encounters was tested with communities and ranchers, and the AI was designed to complement local knowledge.",
  ],
  steps: [
    "Before installing equipment, present the project at a community assembly and obtain the community's free, prior and informed consent for the monitoring and the use of the data.",
    "Lead guided walks and participatory mapping with elders, hunters, women and young people to locate wildlife crossings, waterholes, hunting areas and sacred sites. Record what is shared in template 5. [P5]",
    "Combine those sites with a systematic design: stations at comparable distances, across different habitats and with the same sampling effort, so results can be compared.",
    "Include in the field forms what the community observes: tracks, hunting, fishing and wildlife encounters, in addition to camera records.",
    "Review the results with the community using local species names, and decide together whether to move cameras or add sites.",
    "Agree on which knowledge is public and which is protected. Trails, sacred places, hunting sites and locations of sensitive species are shared only with authorization. [P2]",
  ],
  learning:
    "Sampling works best when it combines two sources: local knowledge, which points to where wildlife is, and a systematic design, which allows sites and seasons to be compared. Together they produce reliable data that the community recognizes as its own.",
  tools: [
    "[Principios CREA para la gobernanza de datos indígenas](https://www.gida-global.org/s/Principios-CREA.pdf) (GIDA, Spanish version of the CARE Principles).",
    "[BIOCOMUNI v2.0 Fauna](https://desarrollo.fmcn.org/wp-content/uploads/2025/06/BIOCOMUNI_v2.0_Fauna.pdf) (FMCN and CONAFOR, in Spanish), a community monitoring protocol with printable forms.",
    "[Buenas prácticas para generalizar datos de especies sensibles](https://docs.gbif.org/sensitive-species-best-practices/master/es/buenas-practicas-para-generalizar-datos-de-especies-sensibles-en-registros-biologicos.es.pdf) (GBIF, in Spanish).",
    "[Directrices de la UICN sobre conflictos y coexistencia entre humanos y vida silvestre](https://doi.org/10.2305/CFRX2122) (2024, in Spanish).",
    "[KoboToolbox](https://www.kobotoolbox.org) and [SMART](https://smartconservationtools.org), to record community observations offline.",
    "[Introducción al monitoreo ambiental comunitario](https://transformativepathways.net/wp-content/uploads/2024/07/JA-591-Introduction-to-community-based-environmental-monitoring-ICCS-ES-v2-FINAL.pdf) (Forest Peoples Programme, in Spanish), a guide to designing monitoring with the community.",
    "[Camera trap monitoring protocol](https://forestgeo.si.edu/sites/default/files/teamterrestrialvertebrate-pt-en-3.1.pdf) (TEAM Network), for the scientific sampling design.",
    "Template 5 of this toolkit: territory knowledge map. [P5]",
  ],
  elsewhere: {
    place: "Jaguar Biocultural Strategy, Ecuadorian Amazon",
    paragraphs: [
      "The Achuar community of Sharamentsa has monitored its territory since 2021 with support from Fundación Pachamama. The Jaguar Biocultural Strategy, led by the Sacred Headwaters Alliance and Fundación Pachamama together with the community, and supported by NaturaTech LAC (IDB Lab and C Minds) and Regen Network, extended the model to the communities of Wayusentsa, Tsekuntsa, Shuinmamus and Kapawi.",
      "The system brings together camera traps, AI analysis, digital forms and traditional knowledge about jaguar behavior, so that each source validates the other. The forms also record hunting, fishing and resource use, and species keep their names in the community's own language. The community decides what information is shared: trails, sacred places and resource locations are safeguarded under agreements with Fundación Pachamama.",
      "As of May 2025, the strategy had 21 trained community monitors, 33,700 ha under monitoring and 58 species recorded with camera traps, including 14 jaguar records. The Jaguar Biocultural Credits channel resources toward the priorities the community defines.",
    ],
    link: { label: "See the Jaguar Biocultural Strategy (NaturaTech LAC)", url: "https://www.naturatech.org/en/minga-estrategia" },
  },
};

// ---------------------------------------------------------------------------
// Data sovereignty

export const SOVEREIGNTY = {
  lead:
    "Every photo, sound or field record originates in a territory and in the work of the people who care for it. Data sovereignty ensures that those communities have authority over how their data is collected, stored, used and shared, and that they receive the benefits. It is a condition for replicating a project like Tech4Nature Mexico: with clear data agreements, the project gains trust and continuity.",
  framework: [
    "The guide we use is the Sovereign Data Supply Chain, a functional and operational framework by Kinray Hub, NaturaTech LAC and Climate Collective (version 1.0, February 2026, CC BY 4.0 license). Its goal is for communities to move from being passive data subjects to Source Domain Authorities, with real capacity to decide about their biocultural assets.",
    "The framework builds on the CARE and FAIR principles, free, prior and informed consent, and instruments such as the United Nations Declaration on the Rights of Indigenous Peoples, ILO Convention 169, the Escazú Agreement and the Nagoya Protocol.",
  ],
  layers: [
    {
      title: "Upstream: territorial authorities",
      text: "Indigenous peoples, local communities and their governing councils. They are the source of the data and the authority that decides about it.",
    },
    {
      title: "Midstream: intermediaries",
      text: "Those who hold, process or label data on behalf of a community: supporting organizations, universities and platforms such as BioScanner.",
    },
    {
      title: "Downstream: users",
      text: "Those who use the data to make decisions, conduct research or develop products: public agencies, conservation organizations, research centers and markets.",
    },
  ],
  protocols: [
    {
      code: "P1",
      title: "Establish the Source Domain Authority",
      text: "Identify who legitimately speaks for the territory, distinguish between Indigenous peoples and local communities, and appoint in assembly the people who will act as a bridge, with a written mandate. It is the basis for everything else.",
    },
    {
      code: "P2",
      title: "Agree on an FPIC-centered contract",
      text: "Inventory the types of data and their sensitivity, define authorization levels and draft the agreement in at least two languages, with an ecological veto and the right to revoke access.",
    },
    {
      code: "P3",
      title: "Ensure biocultural and technical integrity",
      text: "Set how data is collected, verify its provenance and quality, and mark traditional knowledge with labels that state its conditions of use.",
    },
    {
      code: "P4",
      title: "Register biocultural assets",
      text: "Document the relationship between data, territory and authority, assign provenance identifiers and allow analysis of sensitive data without handing over the original data.",
    },
    {
      code: "P5",
      title: "Activate reciprocity and revocability",
      text: "Agree on how benefits are distributed, including training, co-authorship and recognition, how access is suspended and how conflicts are resolved, with primacy of community jurisdiction.",
    },
  ],
  dzilam: [
    "In Dzilam, access to equipment and jaguar locations is reserved for the state government, C Minds, community leaders and authorized partners, to protect the species and keep the community in control of information about its territory. BioScanner is being built so that each community and institution decides who sees its data, what is shared and with whom.",
    "The experience also raised questions we are still discussing with the institutions and the community, and that are worth putting on the table at the start of any project.",
  ],
  questionsIntro:
    "Many protected areas are publicly administered, while the communities are the ones who monitor, conserve and lead day to day. In those cases, these questions deserve an open conversation among the authority, the community and partners before the first piece of equipment is installed.",
  questions: [
    "Who is the source domain authority when the government manages the reserve and the community generates the data: the authority, the community or both, and under what rules?",
    "How do you balance transparency and access to public information with the protection of knowledge, trails and sensitive locations?",
    "Who authorizes new uses of the data, such as research, training AI models or financing mechanisms?",
    "Where is the data stored, and who is responsible for it when the government changes or a project ends?",
    "How are the people who generate the data recognized and compensated when it underpins public decisions, reports or new resources?",
    "Can the community revoke access or withdraw data, and through what procedure?",
    "Is this an Indigenous people, a local community or both, and which rights and consultation processes apply in each case?",
  ],
  learning:
    "Data sovereignty is built through explicit agreements from the design stage. When the public authority and the community answer these questions together, monitoring gains legitimacy, continuity and the trust it needs to scale.",
  tools: [
    "[Sovereign Data Supply Chain, framework V1.0](https://ecos.cminds.co/publicaciones/sovereign-data-supply-chain?reader=1) (Kinray Hub, NaturaTech LAC and Climate Collective, 2026). DOI 10.5281/zenodo.18675313.",
    "[Principios CREA para la gobernanza de datos indígenas](https://www.gida-global.org/s/Principios-CREA.pdf) (GIDA, Spanish version of the CARE Principles).",
    "[Etiquetas de Conocimiento Tradicional](https://localcontexts.org/es/etiquetas/etiquetas-ct/) (Local Contexts, in Spanish), to state conditions of use for traditional knowledge in digital environments.",
    "[Buenas prácticas para generalizar datos de especies sensibles](https://docs.gbif.org/sensitive-species-best-practices/master/es/buenas-practicas-para-generalizar-datos-de-especies-sensibles-en-registros-biologicos.es.pdf) (GBIF, in Spanish).",
    "Template 2 of this toolkit: data agreement. [P2]",
  ],
  elsewhere: {
    place: "The framework in practice",
    paragraphs: [
      "Since April 2026, Fundación Pachamama and the Achuar community of Sharamentsa have been piloting the framework within the Jaguar Biocultural Strategy. Under Protocol 1, the community assembly grants mandates and delegates to community members the authority to decide about the data.",
      "Other pilots apply it in different contexts, such as Seaflower WISE with the Raizal community of the Colombian Caribbean, on artisanal fishing data and marine mapping. Lessons from the pilots feed into the next version of the framework.",
    ],
    link: { label: "Read the framework on ECOS (NaturaTech LAC)", url: "https://ecos.cminds.co/publicaciones/sovereign-data-supply-chain?reader=1" },
  },
};

// ---------------------------------------------------------------------------
// IUCN Green List

export const GREEN_LIST = {
  lead:
    "The IUCN Green List of Protected and Conserved Areas is the global standard that recognizes areas with good governance, sound design and planning, effective management and demonstrable conservation outcomes. Using it as a guide from the start brings order to a protected area's work and turns monitoring evidence into management progress that others can recognize.",
  components: [
    {
      title: "1. Good governance",
      text: "Legitimacy and voice; transparency and accountability; governance vitality and capacity to respond adaptively.",
    },
    {
      title: "2. Sound design and planning",
      text: "Identifying and understanding the site's values; designing for their long-term conservation; understanding threats and the social and economic context.",
    },
    {
      title: "3. Effective management",
      text: "Long-term management strategy; management of ecological conditions, threats, access and resource use; law enforcement; measuring success.",
    },
    {
      title: "4. Conservation outcomes",
      text: "Demonstrating the conservation of major natural values, associated ecosystem services and cultural values.",
    },
  ],
  componentsNote:
    "There are 17 criteria in total, each with indicators demonstrated through documentary evidence.",
  phases: [
    {
      title: "Preparation",
      text: "The area reviews its situation with the GL-SAT self-assessment tool, organizes evidence and defines improvement actions. It can repeat this as many times as needed.",
    },
    {
      title: "Application",
      text: "The area makes a voluntary commitment by registering in COMPASS, the IUCN platform for the process, and submits initial evidence for five indicators.",
    },
    {
      title: "Candidacy",
      text: "The area provides evidence for all indicators and addresses the gaps. This includes a stakeholder consultation and a field visit by the Expert Assessment Group (EAGL). It can take months or years, up to a maximum of five.",
    },
    {
      title: "Green List",
      text: "The IUCN grants the certificate, valid for five years. From then on, the work focuses on maintaining and improving the status.",
    },
  ],
  glsat: [
    "GL-SAT (Green List Self-Assessment Tool) is the IUCN online tool that lets protected area teams review their situation against the Standard. It was presented with its pilot phase at the IUCN World Conservation Congress in October 2025.",
    "The platform asks for baseline information about the area, such as its official name, its identifier in the World Database on Protected Areas (WDPA) and its IUCN management category, and guides the self-assessment of 54 indicators. When finished, it generates a report by component and criterion with strengths and areas for improvement, which serves as a baseline. The self-assessment is a learning tool; certification is obtained through the formal process in COMPASS.",
  ],
  dzilam: [
    "With technical support from Tech4Nature Mexico, the teams of the Dzilam State Reserve and the Ría Lagartos Biosphere Reserve built their worksheets, mapped and organized their evidence, and completed their GL-SAT self-assessment in September 2026. Each reserve now has a baseline and a roadmap of improvement actions, and the lessons were shared in an experience exchange that also included the Puuc Biocultural Reserve.",
    "The experience was documented in the manual «Camino hacia la Lista Verde» (Road to the Green List, in Spanish) and in a worksheet that any protected area can download and adapt. Monitoring with BioScanner, the species inventory, the connectivity study and the interviews for the management program provide direct evidence for criteria 2.1, 2.2, 3.1 and 3.7.",
  ],
  steps: [
    "Build your worksheet: list each component, criterion and indicator of the Standard and note which documents or records could demonstrate it. Use the downloadable worksheet or template 6. [P6]",
    "Map and organize your documents: decrees, management programs, minutes, monitoring reports and agreements. Prioritize those from the last five years and store them in folders by component, with clear names such as 2024_Biodiversity_Monitoring_Report.pdf.",
    "Register in GL-SAT with the area's official name, its WDPA identifier and its management category, and answer the indicators based on the organized evidence.",
    "Analyze the gaps and distinguish documentation gaps from those that require strengthening management. Prioritize according to conservation goals and the team's capacity.",
    "Define improvement actions linked to each indicator, with a lead, timeline, resources and expected evidence, and repeat the self-assessment as you make progress.",
    "When the area is ready, review the IUCN's current guidelines and begin the formal application in COMPASS.",
  ],
  learning:
    "Many gaps are about documentation: the team already does the work, but it has not been recorded. Organizing evidence from the start makes management visible, preserves institutional memory across administrations and connects biodiversity monitoring with outcomes the IUCN recognizes.",
  tools: [
    `[Manual «Camino hacia la Lista Verde»](https://www.cminds.co${GL_MANUAL_URL}) (Tech4Nature Mexico, 2026, PDF, in Spanish), a four-stage guide: worksheets, document organization, GL-SAT and gap analysis.`,
    `[Hoja de trabajo de la Lista Verde](https://www.cminds.co${GL_WORKSHEET_URL}) (Tech4Nature Mexico, 2026, Excel, in Spanish), with indicators, evidence types and a list of reference documents.`,
    "[GL-SAT self-assessment tool](https://glsat.iucngreenlist.org/) (IUCN), an online platform with registration.",
    "[Estándar de la Lista Verde, versión 1.1](https://www.iucn.org/sites/default/files/2024-03/estandar-lista-verde-version-1.1.pdf) (IUCN, in Spanish).",
    "[Componentes y criterios del Estándar](https://iucngreenlist.org/es/estandar/components-criteria/) (IUCN, in Spanish).",
    "[How does the Green List work?](https://iucngreenlist.org/how-does-it-work/) (IUCN), phases of the process.",
    "[IUCN Green List User Manual, version 1.2](https://iucngreenlist.org/wp-content/uploads/2020/04/IUCN-Green-List-User-Manual-Version-1.2.pdf) (IUCN, 2019).",
    "[COMPASS, the Green List platform](https://iucn.org/news/protected-areas/202103/iucn-green-lists-compass-platform-gets-a-new-look-and-feel) (IUCN).",
  ],
  elsewhere: {
    place: "Marine areas of the Coral Triangle",
    text: "In the Solomon Islands, Papua New Guinea, the Philippines, Indonesia and Malaysia, communities, marine protected area managers and governments are advancing toward the Green List through participatory self-assessments and GL-SAT. Nine of the twelve nominated pilot areas progressed in their self-assessment, and the region's six countries recommended recognizing GL-SAT as a complementary tool to assess the effectiveness of their regional system of marine protected areas.",
    link: {
      label: "See case (IUCN, 2026)",
      url: "https://iucn.org/blog/202606/communities-and-marine-protected-areas-advance-iucn-green-list-progress-across-coral",
    },
  },
};

/** How each stage connects to the Green List criteria. */
export const STAGE_GREEN_LIST: Record<string, { criteria: string; text: string }> = {
  e1: {
    criteria: "Criteria 1.1, 1.2 and 1.3 (good governance)",
    text: "Agreements with the community and the authority, assembly minutes and the data agreement are evidence of legitimacy, voice, transparency and accountability.",
  },
  e2: {
    criteria: "Criteria 2.1, 2.3 and 2.4 (design and planning)",
    text: "The species inventory, the threat log and local knowledge about land use show that the area identifies and understands its values, threats and social context.",
  },
  e3: {
    criteria: "Criteria 2.1 and 3.7 (site values and measuring success)",
    text: "Validated records in BioScanner and its reports document key species and make it possible to measure change over time.",
  },
  e4: {
    criteria: "Criteria 2.2 and 3.4 (long-term design and threat management)",
    text: "Land cover maps and connectivity studies support the area's long-term design and the response to its threats.",
  },
  e5: {
    criteria: "Criteria 3.1, 3.7 and component 4 (management and outcomes)",
    text: "Bringing the evidence into the management program and the follow-up reports demonstrates a long-term strategy and conservation outcomes.",
  },
};

// ---------------------------------------------------------------------------
// Glossary

export const GLOSSARY_INTRO =
  "Terms that appear in the toolkit and in the recommended tools, explained in a few words." as string as typeof ES_GLOSSARY_INTRO;

export const GLOSSARY: { group: string; terms: GlossaryTerm[] }[] = [
  {
    group: "Territory and data governance",
    terms: [
      { term: "Biocultural", def: "The relationship between a territory's biological and cultural diversity: species, landscapes, languages, practices and knowledge that sustain one another." },
      { term: "Traditional and local knowledge", def: "Knowledge that communities build and pass on about their territory: wildlife routes, seasons, species names, uses and stewardship practices. It belongs to those who share it." },
      { term: "Free, prior and informed consent (FPIC)", def: "The right of Indigenous peoples and local communities to decide, with complete information, without pressure and before it begins, on an activity that affects their territory, including monitoring and the use of their data." },
      { term: "Data sovereignty", def: "The capacity of a community or institution to decide how data about its territory and people is collected, stored, used and shared." },
      { term: "Sovereign Data Supply Chain", def: "A framework by Kinray Hub, NaturaTech LAC and Climate Collective that organizes the journey of data, from the territory that generates it to those who use it, in five protocols that give communities authority over their data." },
      { term: "Source Domain Authority", def: "The person or institution that legitimately speaks for the territory where the data is generated and decides on its use. It is recognized through an assembly mandate." },
      { term: "Revocability", def: "The community's right to suspend access or withdraw its data from an agreed use, through a procedure defined in the agreement." },
      { term: "CARE Principles", def: "Principles for Indigenous data governance: Collective benefit, Authority to control, Responsibility and Ethics. They complement the FAIR principles for open data." },
      { term: "Sensitive species", def: "A species whose exact location, if published, could facilitate its hunting, capture or disturbance. Its records are generalized or protected." },
    ],
  },
  {
    group: "Fieldwork",
    terms: [
      { term: "Camera trap", def: "A camera triggered by an animal's movement or body heat that records photos or video day and night." },
      { term: "Sampling station", def: "A point where a camera or a pair of facing cameras is installed. Pairs photograph both flanks of an animal to identify it." },
      { term: "Wildlife crossing", def: "A place where animals frequently cross: trails, clearings, waterhole edges or road crossings. It is usually identified through local knowledge." },
      { term: "Deployment", def: "The period during which a camera or recorder operates at a station, from installation to removal." },
      { term: "Sampling effort", def: "The total time the equipment was active, for example in camera-days. It allows sites and seasons to be compared fairly." },
      { term: "Passive acoustic monitoring", def: "Automatic recording of environmental sounds with autonomous recorders to identify birds, amphibians, bats and other groups." },
    ],
  },
  {
    group: "AI analysis",
    terms: [
      { term: "Detection", def: "The step in which an AI model indicates whether an image contains an animal, a person or a vehicle, or is empty." },
      { term: "Classification", def: "The step in which a model suggests the species present in an image or a sound, with a confidence level." },
      { term: "Individual identification", def: "Recognizing a specific animal by its unique markings, such as a jaguar's rosette pattern." },
      { term: "Human validation", def: "Review of each AI result by a person who knows the species, before it is used." },
      { term: "Independent event", def: "A set of records of the same species at a station counted as a single visit, based on an agreed time interval, for example 30 minutes." },
      { term: "Metadata", def: "Information that accompanies each file: station, date, time, equipment and settings. It makes it possible to use the record in an analysis." },
      { term: "Camtrap DP", def: "An open standard format for exchanging camera trap data between platforms and publishing it on GBIF." },
    ],
  },
  {
    group: "Landscape and management",
    terms: [
      { term: "Umbrella species", def: "A species with such extensive habitat needs that protecting it also protects many others. The jaguar is an example." },
      { term: "Spatial recapture", def: "Recording the same individual at two or more different sites. It provides evidence about its movement and use of the landscape." },
      { term: "Ecological connectivity", def: "The degree to which the landscape allows species and ecological processes to move between habitat areas." },
      { term: "Biological corridor", def: "A strip of land that maintains or restores the connection between habitat areas so wildlife can move." },
      { term: "Land cover and land use", def: "A description of what is on the ground, such as forest, mangrove, grassland, water or urban area, and how people use it." },
      { term: "Remote sensing", def: "Study of the territory using images taken by satellites, aircraft or drones." },
      { term: "OECM", def: "Other effective area-based conservation measure: an area outside formal protected areas that conserves biodiversity in a lasting way, according to the criteria of the Convention on Biological Diversity." },
      { term: "IUCN Green List", def: "A global standard that recognizes protected and conserved areas with good governance, sound design, effective management and conservation outcomes. The GL-SAT self-assessment is a first step to prepare." },
      { term: "GL-SAT", def: "The IUCN online tool that lets a protected area team assess its situation against the Green List Standard, identify gaps and define improvement actions. It is a learning tool and does not grant certification." },
      { term: "COMPASS", def: "The IUCN online platform where areas register their commitment, upload evidence and follow the formal process toward Green List certification." },
      { term: "EAGL", def: "Expert Assessment Group for the Green List. It reviews the evidence of each candidate area, makes a field visit and recommends whether to certify it." },
      { term: "WDPA", def: "World Database on Protected Areas, by the IUCN and UNEP. Each area has a unique identifier used, for example, to register in GL-SAT." },
    ],
  },
];

// ---------------------------------------------------------------------------
// Ten quick questions

export const QUESTIONS = {
  intro:
    "If you can answer “yes” to most of them, you are ready to start. If not, stages 1 and 5 will help you work through them.",
  items: [
    "Do we have a goal shared by the community, the authority and partners?",
    "Do we know which decisions it will help make and who makes them?",
    "Does each partner have a clear, agreed role?",
    "Is there an agreement on who owns the data and what is published?",
    "Do we have people from the territory with paid time for fieldwork?",
    "Do we have someone who can review the ecological design and the identifications?",
    "Do our field records use the same fields the analysis platform will require?",
    "Do we know how data will get from the field to the computer if there is no signal?",
    "Are there agreed spaces to analyze the results together with the territory?",
    "Have we identified opportunities to sustain the project, such as local economies, financial instruments or public programs?",
  ],
};

// ---------------------------------------------------------------------------
// Toolbox

export const CATEGORIES: { id: CategoryId; label: string; image: Img }[] = [
  { id: "t4n", label: "Tech4Nature Mexico and BioScanner", image: IMAGES.platform },
  { id: "camaras", label: "Camera traps and acoustics", image: IMAGES.feline },
  { id: "campo", label: "Fieldwork", image: IMAGES.forestPath },
  { id: "mapas", label: "Maps and landscape", image: IMAGES.earth },
  { id: "jaguar", label: "Jaguar", image: IMAGES.jaguar },
  { id: "datos", label: "Data, ethics and community", image: IMAGES.people },
  { id: "listaverde", label: "IUCN Green List", image: IMAGES.mistyForest },
];

export const ACCESS_KINDS: { id: AccessKind; label: string }[] = [
  { id: "gratuito", label: "Free or public" },
  { id: "cuenta", label: "Account required" },
  { id: "costo", label: "Paid" },
];

export const LANG_FILTERS: { id: "ES" | "EN" | "MULTI"; label: string; test: RegExp }[] = [
  { id: "ES", label: "Spanish", test: /\bES\b/ },
  { id: "EN", label: "English", test: /\bEN\b/ },
  { id: "MULTI", label: "Multilingual", test: /multiling|PT|maya/i },
];

export const LEVELS: { id: Level; label: string; hint: string }[] = [
  { id: "Básico", label: "Basic", hint: "no coding" },
  { id: "Intermedio", label: "Intermediate", hint: "requires practice or training" },
  { id: "Avanzado", label: "Advanced", hint: "requires coding or specialists" },
];

export const TOOLBOX = {
  intro:
    "This selection prioritizes free, easy-to-use resources, most of them in Spanish. The level shows how much technical experience is needed: basic (no coding), intermediate (requires practice or training) and advanced (requires coding or specialists). Access information reviewed in October 2026.",
};

// ---------------------------------------------------------------------------
// Templates

export const TEMPLATES_INTRO = "Each template fits on one page. You can copy, print or adapt them to your project." as string as typeof ES_TEMPLATES_INTRO;

export const TEMPLATES: Template[] = [
  {
    id: "p1",
    code: "P1",
    n: 1,
    title: "Start-up sheet",
    short: "Start-up sheet",
    stage: "E1",
    layout: "form",
    fields: [
      { label: "Project name and territory" },
      { label: "Needs it addresses", hint: "of the territory and the institutions" },
      { label: "Shared goal" },
      { label: "Decisions it will inform and who makes them" },
      { label: "Partners and the role of each", hint: "coordination, field, science, technology, follow-up and learning" },
      { label: "How we make decisions", hint: "spaces, frequency and record of agreements" },
      { label: "Methods", hint: "cameras, acoustics, satellite imagery, interviews" },
      { label: "Available budget and months covered" },
      { label: "Spaces to analyze results together" },
      { label: "Sustainability opportunities" },
    ],
  },
  {
    id: "p2",
    code: "P2",
    n: 2,
    title: "Data agreement",
    short: "Data agreement",
    stage: "E1",
    layout: "form",
    fields: [
      { label: "Who is the source domain authority?", hint: "who speaks for the territory and with what mandate" },
      { label: "Who is responsible for the data?" },
      { label: "Who can see the original data?" },
      { label: "What can be published, and at what level of detail?" },
      { label: "What information is protected?", hint: "locations of sensitive species, faces, traditional knowledge" },
      { label: "Who authorizes new uses?" },
      { label: "How is access revoked?" },
      { label: "How is the community recognized in publications and benefits?" },
      { label: "Where are backup copies stored?" },
      { label: "Signatures and date" },
    ],
  },
  {
    id: "p3",
    code: "P3",
    n: 3,
    title: "Camera and station log",
    short: "Station log",
    stage: "E2",
    layout: "log",
    note:
      "The columns match the ones BioScanner requires to import cameras: the CSV imports straight into the platform, with no extra desk work. It works on paper, but we recommend capturing it in KoboToolbox on a field-ready phone with good GPS: the form saves location, altitude and accuracy at the moment of recording, works without signal and syncs when you return, with no copying coordinates by hand or running them through a GIS. Station coordinates are treated as sensitive information.",
    extra: { label: "KoboToolbox form (.xlsx, in Spanish)", url: "/platforms/aiforbiodiversity/initiative-tech4nature/toolkit/plantillas/registro-camaras-kobotoolbox.xlsx" },
    fields: [
      { label: "Camera name", hint: "for example Cam 1", key: "name" },
      { label: "Latitude", hint: "decimal degrees", key: "latitude" },
      { label: "Longitude", hint: "decimal degrees", key: "longitude" },
      { label: "Altitude", hint: "meters", key: "altitude" },
      { label: "GPS accuracy", hint: "meters", key: "precision" },
      { label: "Station code", hint: "both cameras in a pair share a station", key: "station_code" },
      { label: "Installation date", hint: "YYYY-MM-DD", key: "install_date" },
      { label: "Removal date", hint: "YYYY-MM-DD", key: "uninstall_date" },
      { label: "Community or ejido", key: "community" },
      { label: "Transect", key: "transect" },
      { label: "Habitat", hint: "low forest, mangrove, secondary forest…", key: "habitat" },
      { label: "Notes", hint: "settings, failures, person in charge", key: "notes" },
    ],
  },
  {
    id: "p4",
    code: "P4",
    n: 4,
    title: "One-page finding",
    short: "One-page finding",
    stage: "E5",
    layout: "form",
    note: "The fields follow the sections of the BioScanner project report, so each figure can be copied straight from the platform.",
    fields: [
      { label: "Who it is for" },
      { label: "Project and period", hint: "BioScanner analyses or campaigns" },
      { label: "Effort", hint: "stations and camera-days" },
      { label: "Species recorded", hint: "richness and independent events at 30 min" },
      { label: "Species at risk", hint: "NOM-059 and IUCN Red List" },
      { label: "Focal species", hint: "events, stations and identified individuals" },
      { label: "What it means for the territory" },
      { label: "What we propose" },
      { label: "What we still need to know" },
      { label: "Supporting chart or map", hint: "with date and source, without sensitive locations" },
    ],
  },
  {
    id: "p5",
    code: "P5",
    n: 5,
    title: "Territory knowledge map",
    short: "Knowledge map",
    stage: "E2",
    layout: "log",
    fields: [
      { label: "Place or reference", hint: "local name; coordinates only if agreed" },
      { label: "What is known", hint: "wildlife crossing, waterhole, hunting, species" },
      { label: "Species and name in the Indigenous language" },
      { label: "Season" },
      { label: "Who shares it" },
      { label: "Level of care", hint: "public, team or community only" },
      { label: "Agreed use" },
    ],
  },
  {
    id: "p6",
    code: "P6",
    n: 6,
    title: "Green List worksheet",
    short: "Green List worksheet",
    stage: "E5",
    layout: "log",
    fields: [
      { label: "Component", hint: "governance, design, management or outcomes" },
      { label: "Criterion and indicator", hint: "for example 2.1.1" },
      { label: "What the indicator requires" },
      { label: "Type of evidence", hint: "decree, minutes, report, database" },
      { label: "Document and location", hint: "file name and folder" },
      { label: "Status", hint: "complete, partial or missing" },
      { label: "Next step and person in charge" },
    ],
  },
];

export const LIVING_NOTE =
  "This toolkit is a living document. It will be reviewed at least once a year. If you find a broken link, a new tool or an experience you would like to share, write to us through the Tech4Nature Mexico page." as string as typeof ES_LIVING_NOTE;

// ---------------------------------------------------------------------------
// Pages (same slugs as Spanish)

const clip = (s: string, n = 158) => (s.length > n ? `${s.slice(0, n - 1).replace(/\s+\S*$/, "")}…` : s);

export const GROUPS: { id: string; label: string; section?: string }[] = [
  { id: "t4n", label: "Tech4Nature Mexico" },
  { id: "marco", label: "Reference framework" },
  { id: "etapas", label: "The five stages", section: "Replication toolkit" },
  { id: "herramientas", label: "Tools", section: "Replication toolkit" },
  { id: "plantillas", label: "Templates", section: "Replication toolkit" },
  { id: "cierre", label: "Sources", section: "Replication toolkit" },
];

export const PAGES: ToolkitPage[] = [
  {
    slug: "",
    kind: "inicio",
    title: HERO.title,
    label: "Home",
    group: "t4n",
    description:
      "Tech4Nature Mexico, a multisector initiative for biodiversity monitoring, partnerships and frontier technologies in Yucatán. Results, impact area, team and a replication toolkit with five stages, templates and tools.",
  },
  {
    slug: "equipo",
    kind: "equipo",
    title: "The people behind Tech4Nature Mexico",
    label: "Team",
    group: "t4n",
    description:
      "Community leaders, the Government of Yucatán, the IUCN, C Minds, universities and technology partners who made Tech4Nature Mexico possible between 2022 and 2026.",
  },
  {
    slug: "por-que-importa",
    kind: "por-que-importa",
    title: "Why it matters",
    label: "Why it matters",
    group: "marco",
    description:
      "Charts from the Living Planet Report 2026, the Planetary Health Check 2026, the jaguar, camera traps and rural connectivity, and what they mean for an AI-powered conservation project.",
  },
  {
    slug: "monitoreo-biocultural",
    kind: "biocultural",
    title: "The territory guides monitoring",
    label: "Biocultural monitoring",
    group: "marco",
    description:
      "How local knowledge of wildlife crossings, trails, hunting and species guides the sampling and interpretation of biodiversity monitoring, with the cases of Dzilam and the Jaguar Biocultural Strategy in Ecuador.",
  },
  {
    slug: "soberania-de-datos",
    kind: "soberania",
    title: "Data sovereignty",
    label: "Data sovereignty",
    group: "marco",
    description:
      "The Sovereign Data Supply Chain and its five protocols so communities have authority over their data, with open questions for publicly administered areas where the community monitors and conserves.",
  },
  {
    slug: "lista-verde-uicn",
    kind: "listaverde",
    title: "IUCN Green List",
    label: "IUCN Green List",
    group: "marco",
    description:
      "How to use the IUCN Green List Standard to guide a protected area's work: components, phases, GL-SAT self-assessment and COMPASS, with the Tech4Nature Mexico manual and worksheet.",
  },
  {
    slug: "crea-el-tuyo",
    kind: "crea",
    title: "Learn how to create an initiative like Tech4Nature Mexico",
    label: "How to use the toolkit",
    group: "etapas",
    description:
      "Who the replication toolkit is for, what you can do with it, how to navigate it according to your role, and the five stages to co-design, implement and sustain a conservation project with technology and AI.",
  },
  ...STAGES.map(
    (s): ToolkitPage => ({
      slug: stageSlug(s),
      kind: "etapa",
      title: `Stage ${s.n}. ${s.title}`,
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
    title: "Before you start: ten quick questions",
    label: "Ten quick questions",
    group: "herramientas",
    description:
      "Ten questions to check whether your project is ready to start: shared goal, roles, data agreements, field team, compatible records, joint analysis and sustainability.",
  },
  {
    slug: "caja-de-herramientas",
    kind: "caja",
    title: "Toolbox",
    label: "Toolbox",
    group: "herramientas",
    description: `${RESOURCES.length} free resources, most of them in Spanish, for camera traps, acoustics, fieldwork, maps, jaguars, data governance and the IUCN Green List, filterable by category, language, access and level.`,
  },
  {
    slug: "glosario",
    kind: "glosario",
    title: "Glossary",
    label: "Glossary",
    group: "herramientas",
    description: `${GLOSSARY.reduce((n, g) => n + g.terms.length, 0)} toolkit terms explained in a few words: biocultural knowledge and data governance, fieldwork, AI analysis, landscape and management.`,
  },
  {
    slug: "plantillas",
    kind: "plantillas",
    title: "Templates",
    label: "All templates",
    group: "plantillas",
    description:
      "Six one-page templates to download: start-up sheet, data agreement, camera log in BioScanner format with a KoboToolbox form, one-page finding, territory knowledge map and IUCN Green List worksheet.",
  },
  ...TEMPLATES.map(
    (t): ToolkitPage => ({
      slug: templateSlug(t),
      kind: "plantilla",
      title: `Template ${t.n}. ${t.title}`,
      label: t.short,
      group: "plantillas",
      description: `Template ${t.n} of the Tech4Nature Mexico replication toolkit: ${t.title}. ${TEMPLATES_INTRO}`,
      code: t.code,
      ref: t.id,
    }),
  ),
  {
    slug: "fuentes",
    kind: "fuentes",
    title: "Data sources",
    label: "Sources and citation",
    group: "cierre",
    description: "Sources for the figures in the Tech4Nature Mexico replication toolkit and how to cite it.",
  },
  {
    slug: "insignia",
    kind: "insignia",
    title: "Your toolkit badge",
    label: "Badge",
    group: "cierre",
    description: "Go through the five stages to unlock the Tech4Nature Mexico replication toolkit badge, then download it and share it on social media.",
  },
];

export const PAGE_BY_SLUG = new Map(PAGES.map((p) => [p.slug, p]));
