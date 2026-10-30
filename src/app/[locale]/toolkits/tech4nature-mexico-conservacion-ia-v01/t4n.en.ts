export * from "./t4n";

import type { Photo, Person, TeamGroup, GalleryPhoto, Spotlight, Video, Partner } from "./t4n";
import type * as Es from "./t4n";

// t4n.ts declares the *_INTRO strings without an annotation, so their type is the
// Spanish string literal; widen-then-narrow so the English text keeps that shape.
type Text<K extends "TEAM_INTRO" | "SPOTLIGHT_INTRO" | "VIDEOS_INTRO"> = (typeof Es)[K];

// English version of the user-facing constants in t4n.ts. Same shapes; src, id,
// photo, href and url values are identical to the Spanish source.

const T4N_FILES = "/platforms/aiforbiodiversity/initiative-tech4nature/toolkit";

// ---------------------------------------------------------------------------
// Photos

const jag = (file: string, caption: string, alt = "Jaguar recorded by a camera trap in the Dzilam State Reserve"): Photo => ({
  src: `${T4N_FILES}/jaguares/${file}.jpg`,
  alt,
  caption,
});

export const JAGUAR_PHOTOS: Photo[] = [
  jag("jaguar-2025-04", "April 2025"),
  jag("jaguar-2025-10-agua", "October 2025, at a watering hole"),
  jag("jaguar-2025-09-a", "September 2025"),
  jag("jaguar-2024-02", "February 2024"),
  jag("jaguar-2025-10-c", "October 2025"),
  jag("jaguar-2026-04-noche", "April 2026, at night"),
  jag("jaguar-2025-07-b", "July 2025"),
  jag("jaguar-2026-03", "March 2026"),
  jag("jaguar-2024-04-a", "April 2024"),
  jag("jaguar-2025-10-niebla", "October 2025, at dawn"),
  jag("jaguar-2025-10-b", "October 2025"),
  jag("jaguar-2025-07-a", "July 2025"),
];

const bs = (file: string, caption: string, alt: string): Photo => ({ src: `${T4N_FILES}/bioscanner/${file}.jpg`, alt, caption });

export const BIOSCANNER_PHOTOS: Photo[] = [
  bs("bs-puma-96", "Puma, 96% confidence", "Camera trap photo with a puma in a bounding box labeled Puma concolor 96%"),
  bs("bs-jaguar-84", "Jaguar, 84% confidence", "Camera trap photo with a jaguar in a bounding box labeled Panthera onca 84%"),
  bs("bs-margay", "Margay, 90% confidence", "Night photo with a margay in a bounding box labeled Leopardus wiedii 90%"),
  bs("bs-mono-arana", "Spider monkeys: one detected by the model and one added by hand", "Two spider monkeys in bounding boxes, one by the model at 88% and one marked by hand"),
  bs("bs-tayra", "Tayra, 48%: the model asks for review", "Photo with a tayra in a bounding box labeled Eira barbara 48%"),
  bs("bs-ocelote", "Ocelot at night, 31%: a person validates it", "Night photo with an ocelot in a bounding box labeled Leopardus pardalis 31%"),
];

// ---------------------------------------------------------------------------
// Home: what Tech4Nature Mexico is and what we have achieved

export const T4N_HOME = {
  title: "Tech4Nature Mexico",
  subtitle:
    "A multisector initiative that strengthens nature conservation and territorial governance on the Yucatán Peninsula through biodiversity monitoring, strategic partnerships and frontier technologies that support data-driven decision-making.",
  eyebrow: "Tech4Nature Mexico · 2022–2026",
  invite:
    "The replication toolkit brings together what we learned over four years, organized in five stages with tools and templates, so other territories can create their own initiative.",
};

export const EXPANSION = {
  before: 69000,
  after: 104304,
  decree: {
    label: "Acuerdo 76/2024, Diario Oficial del Gobierno del Estado de Yucatán, September 23, 2024 (in Spanish)",
    url: "https://www.yucatan.gob.mx/docs/diario_oficial/diarios/2024/2024-09-23_2.pdf",
  },
  paragraphs: [
    "In 2024, the Government of Yucatán expanded the Dzilam State Reserve from 69,000 to 104,304 hectares: more than 35,000 new hectares under protection, a 51% increase.",
    "The technical basis for the decree includes Tech4Nature Mexico's camera trap studies, the jaguar records in areas surrounding the reserve and the need to strengthen ecological connectivity. The evidence that the community, the SDS and C Minds built in the field became a long-term conservation decision.",
    "The expansion opened a new chapter: updating the management program with the people who live and work in the territory. In phase 2, Tech4Nature Mexico supported that update with 17 interviews across the tourism, fishing, livestock, community and government sectors.",
  ],
};

export const BIOSCANNER_REPORT = {
  date: "October 29, 2026",
  period: "March 2022 to August 2026",
  files: 333087,
  photos: 317565,
  videos: 15522,
  emptyShare: "89.1%",
  empty: 296622,
  withAnimal: 32044,
  events: 9070,
  species: 84,
  wild: 76,
  stations: 33,
  cameraDays: 12024,
  campaigns: 18,
  jaguarEvents: 480,
  jaguarStations: 25,
};

export const BIOSCANNER_PANEL = {
  lead:
    "BioScanner is the artificial intelligence platform born from Tech4Nature Mexico. It takes in thousands of camera trap photos and videos, sets aside the empty ones, suggests the species in each record and identifies jaguars by the unique pattern of their spots. People review and validate every result, and the platform turns those records into reports a field team can use.",
  capabilities: [
    { title: "Filters out empty images", text: "Automatically sets aside photos with no animals, which are usually the majority." },
    { title: "Suggests the species", text: "Marks each animal in the photo with its species and a confidence level; when uncertain, it asks for review." },
    { title: "Recognizes jaguars", text: "Compares each jaguar's rosettes to suggest which individual it is." },
    { title: "Generates reports", text: "Species richness, diversity and abundance indices, effort per station, at-risk species and activity by hour." },
    { title: "Protects the data", text: "Each project decides who sees its records; locations of sensitive species are protected." },
    { title: "Speaks your language", text: "Interface in Spanish, English, Portuguese and Maya, designed for field teams." },
  ],
  reportNote:
    "Figures from the project report BioScanner generated for Tech4Nature Mexico on October 29, 2026, covering camera traps from March 2022 to August 2026.",
  cta: { label: "Go to BioScanner", url: "https://app.bioscanner.io" },
};

export const SPECIES_PANEL = {
  lead: "Two lists, two methods. Together they show what each tool sees of the territory.",
  note: [
    "The phase 1 list (2022–2024) brings together 146 species recorded with camera traps (81) and acoustic recorders (95); 30 were recorded with both methods. Many birds were detected only by their song, and 40 species are in a risk category under NOM-059 or the IUCN Red List.",
    "The BioScanner report (March 2022 to August 2026) analyzes only camera trap photos and videos, without audio. It records 84 taxa: 76 wild species, 4 domestic animals and 4 identifications pending review. That is why it includes fewer birds, and it adds 16 species that do not appear in the phase 1 list, such as the puma, the northern tamandua and the barn owl.",
  ],
  sources: [
    { label: "Tech4Nature México phase 1 technical report (2024) (in Spanish)", url: "" },
    { label: "BioScanner project report, October 29, 2026", url: "" },
  ],
};

export const JAGUAR_PANEL = {
  lead:
    "The jaguar is the species that gave rise to Tech4Nature Mexico. These photos are real records from the project's camera traps in and around the Dzilam State Reserve.",
  facts: [
    "16 individual jaguars identified over the years by the pattern of their rosettes. The catalog is being verified.",
    "480 independent jaguar events across 25 camera trap stations, according to the BioScanner report.",
    "The same jaguar was recorded at two sites about 40 km apart, from Dzilam toward Ría Lagartos: evidence that the landscape remains connected.",
  ],
  care: "To protect the species, the photos do not show where the cameras are located.",
};

// ---------------------------------------------------------------------------
// Map

export const MAP_TEXT = {
  lead:
    "Tech4Nature Mexico has focused on the northern coast of Yucatán, between the Dzilam State Reserve and the Ría Lagartos Biosphere Reserve. It is a mosaic of low forest, mangroves, petenes (tree islands), coastal dunes and lagoons, with communities that make their living from fishing, livestock and tourism.",
  facts: [
    { value: "104,304 ha", label: "Dzilam State Reserve, after its 2024 expansion" },
    { value: "33", label: "camera trap stations analyzed in BioScanner" },
    { value: "12,024", label: "camera-days of monitoring, 2022 to 2026" },
    { value: "~40 km", label: "between two records of the same jaguar, toward Ría Lagartos" },
  ],
  googleEmbed:
    "https://www.google.com/maps?q=Reserva%20Estatal%20de%20Dzilam%2C%20Dzilam%20de%20Bravo%2C%20Yucat%C3%A1n&ll=21.4616374,-88.6608063&z=11&t=k&output=embed",
  googleUrl:
    "https://www.google.com/maps/place/97608+Reserva+Estatal+de+Dzilam+de+Bravo,+Yucatan,+Mexico/@21.4616374,-88.6608063,48060m/data=!3m1!1e3!4m6!3m5!1s0x8f53956fb63c5145:0x257bef41330fb623!8m2!3d21.5027274!4d-88.4908506!16s%2Fg%2F1wyc5d26",
  googleCaption: "Satellite view of the Dzilam State Reserve on Google Maps. Explore the coast, mangroves and forest the project helps protect.",
  note: "To keep wildlife safe, we do not show camera locations. The reserve's official boundaries are set out in Acuerdo 76/2024.",
};

// ---------------------------------------------------------------------------
// Team

const wix = (id: string) => `https://static.wixstatic.com/media/${id}/v1/fill/w_240,h_240,al_c,q_80,enc_auto/foto.jpg`;

export const TEAM_INTRO =
  "Tech4Nature Mexico exists thanks to many people. Some are still part of the project; others built it at different moments and have since moved on to other paths. This page recognizes all of them." as string as Text<"TEAM_INTRO">;

const CORE_PEOPLE_CMINDS: Person[] = [
  { name: "Constanza Gómez-Mont", role: "Founder and President of C Minds. Project lead", photo: "/core/constanzaGM.png" },
  { name: "Regina Cervera", role: "Director of Nature Innovation Programs. Project coordination", photo: `${T4N_FILES}/equipo/p-regina.jpg` },
  { name: "Ángel Escalante", role: "BioScanner technology development lead", photo: "/team/Angel Escalante.png" },
  { name: "Xiomara Vázquez", role: "BioScanner brand and experience lead", photo: "/team/Xiomy Vazquez.png" },
  { name: "Daniela Pérez", role: "Conservation programs consultant: fieldwork, KoboToolbox and coordination", photo: `${T4N_FILES}/equipo/p-daniela.jpg` },
  { name: "Bryan Ruiz", role: "Creative experience lead", photo: "/team/Bryan Ruiz.png" },
];

export const TEAM_CORE: TeamGroup[] = [
  {
    id: "c-minds",
    title: "C Minds",
    people: CORE_PEOPLE_CMINDS,
  },
  {
    id: "territorio",
    title: "In the territory: Chac Mool Monitoring Group",
    people: [
      { name: "Benjamín Campos", role: "Founding community monitor and community leader", photo: `${T4N_FILES}/equipo/p-benja.jpg` },
      { name: "Juan Castillo", role: "Founding community monitor", photo: `${T4N_FILES}/equipo/p-juan.jpg` },
      { name: "Darwin Sosa", role: "Founding community monitor and sustainable tourism leader", photo: `${T4N_FILES}/equipo/p-darwin.jpg` },
      { name: "Efraín Uicab", role: "Community monitor", photo: `${T4N_FILES}/equipo/p-efrain.jpg` },
      { name: "Mateo Ordóñez", role: "Community monitor", photo: `${T4N_FILES}/equipo/p-mateo.jpg` },
      { name: "Josué Argáez", role: "Community monitor", photo: `${T4N_FILES}/equipo/p-josue.jpg` },
      { name: "Toshio Yokoyama", role: "Field operations and policy leadership. Formerly Director of Conservation at the SDS", photo: `${T4N_FILES}/equipo/p-toshio.jpg` },
    ],
  },
  {
    id: "uicn",
    title: "IUCN",
    people: [
      { name: "James McBreen", role: "Technology and Innovation Program Manager. Project oversight", photo: wix("0fecb2_b25958664415423c86cabb2ca37d3086~mv2.jpg") },
      { name: "Úrsula Parrilla", role: "Regional Director for Mexico, Central America and the Caribbean" },
    ],
  },
];

export const TEAM_MORE: TeamGroup[] = [
  {
    id: "gobierno",
    title: "Government of Yucatán",
    intro: "The Ministry of Sustainable Development (SDS) co-led the project from design through fieldwork.",
    people: [
      { name: "Neyra Silva Rosado", role: "Secretary of Sustainable Development", org: "SDS" },
    ],
  },
  {
    id: "comunidad",
    title: "Dzilam community",
    people: [
      { name: "Javier Nadal", role: "Former park ranger and community leader", org: "Dzilam State Reserve", photo: wix("0fecb2_39858f848de24a5b928e3d45872a69ce~mv2.jpeg") },
    ],
  },
  {
    id: "c-minds-mas",
    title: "C Minds throughout the project",
    people: [
      { name: "Enrique Portillo", role: "Administration and finance", org: "C Minds", photo: "/team/Enrique Portillo.png" },
      { name: "Ana Sofía Schmidt", role: "Communications and social media", org: "C Minds" },
      { name: "Nicte Cabañas", role: "Project assistant, phase 1", org: "C Minds" },
      { name: "Lucía Tróchez", role: "Program director, phase 1", org: "C Minds" },
      { name: "Larissa Gus", role: "Project lead, phase 1", org: "C Minds" },
      { name: "Reese Jacobs", role: "Professional internship, phase 1", org: "C Minds" },
    ],
  },
];

export const TEAM_ALLIES: TeamGroup[] = [
  {
    id: "ex-sds",
    title: "Ministry of Sustainable Development (SDS), phases 1 and 2",
    intro: "SDS team members who co-led the project's design and fieldwork.",
    people: [
      { name: "Alejandro Pacheco", role: "Operations lead. Former Head of the Environmental Conservation Department", org: "Former SDS", photo: wix("0fecb2_525ff66e48664df1866066b370387a84~mv2.jpeg") },
      { name: "Esteban Ramírez", role: "Operations coordination", org: "Former SDS", photo: wix("0fecb2_8d9d8de4ab7a4b53b9221a025bc73314~mv2.jpeg") },
      { name: "Kay Vilchis", role: "Field operations", org: "Former SDS", photo: wix("0fecb2_91ae30dabbef4a9f98772afd23cacb21~mv2.jpeg") },
    ],
    names: [
      { label: "Also at the SDS", list: ["Sayda Rodríguez", "Allam Tzab", "Valentina Vanegas", "Luis Roberto Pérez", "Asis Alcocer"] },
    ],
  },
  {
    id: "upy",
    title: "Universidad Politécnica de Yucatán (UPY)",
    intro: "Developed the first image recognition models with the project and trained students in data engineering and embedded systems.",
    people: [
      { name: "Mario Campos Soberanis", role: "Oversight of the image algorithm; later, BioScanner models with Neuraan", org: "UPY · Neuraan", photo: wix("0fecb2_e4a97697c8fa42528a0bb03e624ec7f4~mv2.jpeg") },
      { name: "Diego Campos Sobrino", role: "Data engineering", org: "UPY", photo: wix("0fecb2_c9203c7671ce4936b395ca61e2cdf874~mv2.jpg") },
      { name: "Sharleen Morales", role: "Student engagement", org: "UPY", photo: wix("0fecb2_134c66f9aaa54ed29ed521cdf16ffd8d~mv2.jpg") },
      { name: "José Augusto Canul", role: "Image algorithm team", org: "Data engineer", photo: wix("de03fd_b051b384c84449f09345e9aacdb9d597~mv2.jpg") },
    ],
    names: [
      { label: "Academic team", list: ["Ángel Pech", "Cristina Erales", "Jorge Mena", "Eduardo Espadas", "Julio Molina"] },
      {
        label: "Image recognition and embedded systems students",
        list: ["Adrián Carmona", "Adriana Ku", "Efraín Matu", "Karla Valdez", "Pedro Uicab", "Matthew Esquivel", "Jorge Aguilar", "Andrés Martínez", "Carlos Dzul", "Ángel Quintal", "Edwin Camacho"],
      },
    ],
  },
  {
    id: "rfcx",
    title: "Rainforest Connection (RFCx), phase 1",
    intro: "The team that led phase 1 acoustic monitoring: recorders, analysis in Arbimon and models that recognize species by their sound.",
    people: [
      { name: "Brooke Livesay", role: "Acoustic analysis. Project manager", org: "Former RFCx", photo: wix("0fecb2_26eb7ffa3f7c449793c890ab692e1c4c~mv2.jpg") },
      { name: "Mahreen Qazi", role: "Acoustic analysis. Strategy and operations", org: "Former RFCx", photo: wix("0fecb2_927d67e474c54cdca495e8b2abc6d5bc~mv2.jpg") },
      { name: "Chrissy Durkin", role: "Project development", org: "Former RFCx" },
      { name: "Marconi Campos-Cerqueira", role: "Acoustic science", org: "Former RFCx" },
    ],
    names: [{ label: "Scientific team (former RFCx)", list: ["Kris Harmon", "Gabriel Leite", "Tomaz Melo", "Nelson Buainain", "José Wagner Ribeiro", "Carly Batist", "Lola Abed"] }],
  },
  {
    id: "huawei",
    title: "Huawei",
    intro: "Partner in the global Tech4Nature initiative with IUCN, through its Tech4All program.",
    people: [
      { name: "Samira Herrera", role: "Public relations and communications", org: "Huawei México", photo: wix("de03fd_e6489ec7dd0942c2bdcd5f9610e50459~mv2.jpg") },
      { name: "Armando Guauxochitl", role: "Director of Strategy and Marketing", org: "Huawei Latam", photo: wix("0fecb2_f9790ac781274bcd919add96a6cf7d04~mv2.jpg") },
      { name: "Sira Lin", role: "Project coordination", org: "Former Huawei México", photo: wix("0fecb2_fe116709e5be474e953cae28829f5525~mv2.jpg") },
      { name: "Joaquín Saldaña", role: "Communications strategy, phase 1. In memoriam", org: "Former Huawei Latam" },
    ],
    names: [{ label: "Also at Huawei", list: ["Leon Du", "Zeng Ming", "Eric Chendalong", "Zhang Jing"] }],
  },
  {
    id: "tecnicos",
    title: "Technical partners",
    people: [
      { name: "Anuar Hernández", role: "Advice on jaguar identification and fieldwork", org: "Pronatura Península de Yucatán" },
      { name: "Adrián Hernández", role: "Connectivity study between Dzilam and Ría Lagartos", org: "Consultant" },
      { name: "Joel Koupermann", role: "Use of BioScanner in the Jaguar Biocultural Strategy, Ecuador", org: "Fundación Pachamama" },
      { name: "Daning Montaño", role: "Use of BioScanner in the Jaguar Biocultural Strategy, Ecuador", org: "Fundación Pachamama" },
      { name: "Jorge Osorno", role: "Video and audiovisual documentation", org: "Independent" },
    ],
  },
];

// ---------------------------------------------------------------------------
// Field photos and video series

const C = (file: string) => `${T4N_FILES}/campo/${file}.jpg`;
const E = (file: string) => `${T4N_FILES}/equipo/${file}.jpg`;

export const GALLERY: { id: string; title: string; text: string; photos: GalleryPhoto[] }[] = [
  {
    id: "campo",
    title: "Out in the forest",
    text: "Community monitors from the Chac Mool Group travel through the forest, wetlands and mangroves to select monitoring sites, deploy equipment, collect data and report hunting, wildfires and other activity in the area.",
    photos: [
      { src: C("juan-camara"), alt: "Juan Castillo checks a camera trap strapped to a tree", caption: "Juan Castillo checks a camera trap" },
      { src: C("agua-b"), alt: "Community monitors standing in a flooded wetland", caption: "Walking through a flooded wetland" },
      { src: C("caminata"), alt: "Field team walking through the forest", caption: "On the way to a monitoring station" },
      { src: C("mateo-camara"), alt: "Mateo Ordóñez next to a camera trap", caption: "Mateo Ordóñez next to a camera trap" },
      { src: C("darwin-senala"), alt: "Darwin Sosa points toward the forest", caption: "Darwin Sosa shows where wildlife passes" },
      { src: C("manglar"), alt: "Smiling community monitor standing on mangrove roots", caption: "In the mangroves" },
    ],
  },
  {
    id: "bioscanner",
    title: "BioScanner in the hands of the territory",
    text: "In BioScanner workshops, community monitors, park rangers, students, partners and protected area teams upload their photos, review the species detections and jaguar identifications the AI suggests, and validate each species.",
    photos: [
      { src: C("taller-bs"), alt: "Smiling community monitor at a BioScanner workshop with laptops", caption: "BioScanner workshop" },
      { src: C("taller-bs-e"), alt: "Participants high-five at the end of a workshop", caption: "Wrapping up a workshop" },
      { src: C("taller-bs-b"), alt: "Two participants review results on a laptop", caption: "Reviewing detections" },
      { src: C("taller-bs-d"), alt: "Facilitator speaks to a group with laptops", caption: "Practice session" },
      { src: C("taller-bs-f"), alt: "Participant receives a kit at the end of the workshop", caption: "Handing out kits" },
    ],
  },
  {
    id: "festival",
    title: "Chac Mool Jaguar Festival",
    text: "In 2025, Dzilam de Bravo held its first Jaguar Festival: virtual reality, games, talks and camera trap photos to bring the reserve and the jaguar closer to people.",
    photos: [
      { src: C("festival-grupo"), alt: "Large group in front of the Jaguar Festival mural", caption: "Chac Mool!" },
      { src: C("festival-vr"), alt: "A girl tries on virtual reality goggles alongside community monitors", caption: "The reserve in virtual reality" },
      { src: C("festival-premios"), alt: "Community monitors receive wooden awards with jaguar tracks", caption: "Chac Mool Group monitors at the festival" },
      { src: C("festival-publico"), alt: "Festival audience with a microphone", caption: "The community asks and shares" },
      { src: C("festival-benja"), alt: "Benjamín Campos smiles in front of a computer", caption: "Benja Campos shows the records" },
    ],
  },
  {
    id: "comunidad",
    title: "Workshops and schools",
    text: "The project is also shared in schools, in workshops with families and on field trips with engineering students, so more people get to know what lives in their territory.",
    photos: [
      { src: C("taller-comunidad"), alt: "Families, community monitors and team gathered under a palapa", caption: "Workshop with families in Dzilam de Bravo" },
      { src: C("taller-jovenes"), alt: "Young people and adults in a circle during a workshop under a palapa", caption: "Workshop on protected areas" },
      { src: C("capacitacion-acustica"), alt: "Community monitors learn to use an acoustic recorder", caption: "Training with acoustic recorders" },
      { src: C("salida-upy"), alt: "UPY students listen to a guide in the field", caption: "Field trip with UPY students" },
      { src: C("festival-familias"), alt: "Families take part in Jaguar Festival activities", caption: "Families at the Jaguar Festival" },
    ],
  },
];

// ---------------------------------------------------------------------------
// Spotlight

export const SPOTLIGHT_INTRO =
  "Tech4Nature Mexico exists because there are people who know the forest, care for it and chose to show what they knew. These are some of them." as string as Text<"SPOTLIGHT_INTRO">;

export const SPOTLIGHT: Spotlight[] = [
  {
    name: "Benjamín «Benja» Campos",
    role: "Founding community monitor, Chac Mool Monitoring Group",
    photo: E("p-benja"),
  },
  {
    name: "Juan Castillo",
    role: "Founding community monitor, Chac Mool Monitoring Group",
    photo: E("p-juan"),
  },
  {
    name: "Darwin Sosa",
    role: "Founding community monitor, Chac Mool Monitoring Group",
    photo: E("p-darwin"),
  },
  {
    name: "Efraín Uicab",
    role: "Community monitor, Chac Mool Monitoring Group",
    photo: E("p-efrain"),
  },
  {
    name: "Mateo Ordóñez",
    role: "Community monitor, Chac Mool Monitoring Group",
    photo: E("p-mateo"),
  },
  {
    name: "Josué Argáez",
    role: "Community monitor, Chac Mool Monitoring Group",
    photo: E("p-josue"),
  },
  {
    name: "Toshio Yokoyama",
    role: "Field operations and public policy leadership",
    photo: E("p-toshio"),
  },
  {
    name: "Regina Cervera",
    role: "Director of Nature Innovation Programs, C Minds",
    photo: E("p-regina"),
  },
];

// ---------------------------------------------------------------------------
// What is a camera trap?

export const CAMERA_TRAP = {
  lead:
    "A camera trap is a weatherproof camera strapped to a tree or post that triggers on its own when it detects an animal's heat and movement. It takes photos or videos by day and, with infrared light, by night too, with no one present. That is how it records animals that are rarely seen.",
  photos: [
    { src: C("juan-camara-trampa"), alt: "Juan Castillo next to a camera trap mounted on a tree in the forest", caption: "A camera trap set at the height where animals pass" },
    { src: C("toshio-camara-trampa"), alt: "Toshio Yokoyama straps a camera trap to a tree in the forest", caption: "Toshio Yokoyama installs a camera trap" },
    { src: C("mateo-baterias"), alt: "Mateo Ordóñez changes the batteries of a camera trap", caption: "Mateo Ordóñez changes the batteries and memory card" },
  ] as GalleryPhoto[],
  how: [
    { title: "Sensor", text: "Detects the heat difference of a moving animal and triggers the camera in under a second." },
    { title: "Photos and video", text: "Saves bursts of photos or short videos with date and time. At night it uses infrared light that animals barely notice." },
    { title: "Autonomy", text: "With batteries and a memory card it can run for weeks or months. The team visits to change batteries and download the files." },
  ],
  goodFor: [
    "Learning which medium and large mammals and ground-dwelling birds live in a place.",
    "Documenting species that are hard to see, nocturnal or scarce, such as the jaguar, the ocelot or the white-lipped peccary.",
    "Identifying individuals with unique markings, such as jaguar rosettes.",
    "Comparing sites and seasons with the same sampling effort.",
    "Recording wildlife crossings, watering holes and encounters with cattle or hunting.",
  ],
  lessGood: [
    "Small birds, frogs and insects: these are better recorded with acoustic recorders.",
    "Exact counts of animals without individual markings.",
    "Busy sites or places at risk of theft, unless there is a lock and a community agreement.",
    "Areas with no one able to visit them regularly.",
  ],
  tip: "In Dzilam, cameras are placed at knee height, about 3 to 4 meters from the wildlife trail, where community monitors know animals pass. Each station has a name and a record sheet.",
};

/** Photos for each stage. */
export const STAGE_PHOTOS: Record<string, GalleryPhoto[]> = {
  e1: [
    { src: C("taller-comunidad"), alt: "Families, community monitors and team gathered under a palapa", caption: "Workshop with families and community monitors in Dzilam de Bravo" },
    { src: C("equipo-camioneta"), alt: "Team in a pickup truck before heading to the field", caption: "Community, government and C Minds: one team" },
  ],
  e2: [
    { src: C("caminata-b"), alt: "Team walking single file through the forest", caption: "Heading to the stations" },
    { src: C("agua"), alt: "Community monitors in a flooded wetland", caption: "In the rainy season, the path is water" },
  ],
  e3: [
    { src: C("taller-bs"), alt: "BioScanner workshop with community monitors", caption: "BioScanner workshop" },
    { src: C("festival-benja"), alt: "Benjamín Campos in front of a computer", caption: "Benja Campos reviews records" },
  ],
  e4: [
    { src: C("agua-b"), alt: "Community monitors in a wetland", caption: "Wetlands that connect Dzilam with Ría Lagartos" },
    { src: C("humedal"), alt: "Wetland with cattails and mangroves", caption: "Cattails and mangroves on the northern coast of Yucatán" },
  ],
  e5: [
    { src: C("festival-premios"), alt: "Community monitors receive awards at the festival", caption: "Chac Mool Group monitors at the Jaguar Festival" },
    { src: C("festival-grupo-b"), alt: "Group in front of the Jaguar Festival mural", caption: "Results analyzed and celebrated with the community" },
  ],
};

/** Photos for the reference framework pages. */
export const PAGE_PHOTOS: Record<string, GalleryPhoto[]> = {
  "por-que-importa": [
    { src: C("cruce-humedal"), alt: "Team crossing a wetland", caption: "Wetlands of the Dzilam State Reserve" },
    { src: C("atardecer"), alt: "Sunset over the forest", caption: "Sunset over the Dzilam forest" },
  ],
  biocultural: [
    { src: C("darwin-senala"), alt: "Darwin Sosa points toward the forest", caption: "Darwin Sosa shows where wildlife passes" },
    { src: C("capacitacion-acustica"), alt: "Community monitors examine an acoustic recorder", caption: "Training with acoustic recorders" },
  ],
  soberania: [
    { src: C("taller-jovenes"), alt: "Workshop in a circle under a palapa", caption: "Open conversations with the community" },
    { src: C("festival-publico"), alt: "Jaguar Festival audience", caption: "Sharing results with the community" },
  ],
  listaverde: [
    { src: C("daniela-camara-b"), alt: "Daniela Pérez checks a camera trap", caption: "Field evidence feeds into the Standard's criteria" },
    { src: C("equipo-campo"), alt: "Community monitors talking in the field", caption: "Shared management between community and authority" },
  ],
};

// ---------------------------------------------------------------------------
// Videos

export const VIDEOS_INTRO =
  "Relive more moments from Tech4Nature Mexico over the years." as string as Text<"VIDEOS_INTRO">;

export const VIDEOS: Video[] = [
  { id: "4cKLMpL_des", title: "Tech4Nature México", channel: "C Minds" },
  { id: "RqBuHwRkdKM", title: "El escurridizo jaguar ha sido captado con Tech4Nature México", channel: "Huawei Latinoamérica" },
  { id: "H_06ybOH_Co", title: "Tech4Nature México: creando un corredor biológico de los jaguares", channel: "Huawei Latinoamérica" },
  { id: "9UAdhdnhdLw", title: "De días a minutos: así está cambiando la IA el fototrampeo en México", channel: "C Minds" },
  { id: "w0x76cR111o", title: "The road to Tech4Nature Mexico's Phase 2", channel: "C Minds", start: 10 },
  { id: "bbjwulJHNN0", title: "How AI Is Helping Save Jaguars Across Latin America (Interview with Tech4Nature Mexico)", channel: "Paris Peace Forum" },
  { id: "TilMnT73Oh4", title: "Tech4Nature México: evento de lanzamiento", channel: "Huawei Latinoamérica", start: 2173 },
];

// ---------------------------------------------------------------------------
// Partners

const logo = (file: string) => `/platforms/aiforbiodiversity/initiative-tech4nature/${file}`;

export const PARTNERS: { title: string; partners: Partner[] }[] = [
  {
    title: "Led by",
    partners: [
      { name: "C Minds", logo: logo("ledby-cminds-1.svg") },
      { name: "AI for Climate and Biodiversity", logo: logo("ledby-aiforclimate-2.svg") },
      { name: "Chac Mool Monitoring Group", logo: logo("partner-chacmool-w.png"), height: 64 },
      { name: "Government of the State of Yucatán, Ministry of Sustainable Development", logo: logo("ledby-sds-3.svg") },
    ],
  },
  {
    title: "With support from",
    partners: [
      { name: "IUCN", logo: logo("supportedby-iucn-1.svg") },
      { name: "Huawei", logo: logo("supportedby-huawei-3.svg") },
      { name: "Tech4All", logo: logo("supportedby-tech4all-4.svg") },
      { name: "IUCN Green List", logo: logo("supportedby-greenlist-2.svg") },
    ],
  },
  {
    title: "With strategic contributions from",
    partners: [
      { name: "Pronatura Península de Yucatán", logo: logo("partner-pronatura-w.png"), height: 60 },
      { name: "Fundación Pachamama", logo: logo("partner-pachamama-w.png") },
      { name: "Universidad Politécnica de Yucatán", logo: logo("innovationpartner-upy.svg") },
    ],
  },
];

// ---------------------------------------------------------------------------
// Findings, recommendations and principles

export const FINDINGS = {
  intro:
    "Beyond the results, four years of work produced knowledge that can serve any territory. We gather it here on three levels: what we discovered about the reserve, what we learned along the way and the principles that guide a project like this one.",
  science: [
    {
      title: "More vegetation, more species",
      text: "Species richness correlated positively with forest cover: sites with a higher share of low forest recorded more species. Conserving and reconnecting vegetation means conserving biodiversity.",
    },
    {
      title: "Soundscapes change",
      text: "Dzilam's soundscapes vary with the season and habitat type. That is why it pays to monitor year-round and across different environments: forest, mangrove, peten and grassland.",
    },
    {
      title: "Sound reveals what goes unseen",
      text: "Species that are hard to observe, such as the thicket tinamou, were among those most often detected by the recorders. Combining camera traps with acoustic monitoring expands what a team can record.",
    },
  ],
  lessons: [
    {
      title: "Recognize the value of adapting",
      text: "Deploying monitoring in hard-to-reach areas changes plans: rain, flooding, roads and equipment that fails. Projects that adapt learn faster.",
      rec: "Design monitoring with the people who know the territory, adopt biocultural monitoring as a principle and revisit the plan in every campaign.",
      href: "monitoreo-biocultural",
      link: "Biocultural monitoring",
    },
    {
      title: "Governance, in all its dimensions, matters most",
      text: "Who decides, how partners coordinate and who owns the data determine the project's trust and continuity.",
      rec: "Agree on roles, decision-making spaces and data rules before installing the first piece of equipment, with free, prior and informed consent.",
      href: "soberania-de-datos",
      link: "Data sovereignty",
    },
    {
      title: "Adoption comes from co-creation",
      text: "BioScanner works because it was designed with community monitors, park rangers, students and the authority, testing every version in the field.",
      rec: "Involve the people who will use the tool from the design stage and test with them in short cycles.",
    },
    {
      title: "Multisector collaboration is key from the start",
      text: "Community, government, academia, civil society and technology partners each bring different capacities. When they take part from the design stage, evidence reaches decisions such as the reserve's expansion.",
      rec: "Bring decision-makers in from day one and document the agreements and focal points of each institution.",
    },
    {
      title: "Closing capacity gaps takes deliberate work",
      text: "Using phones, forms, AI platforms and data analysis takes learning time and close support.",
      rec: "Budget for ongoing training, materials in the local language and support staff in the territory.",
    },
    {
      title: "More data is not always better information",
      text: "Hundreds of thousands of photos only become useful when they are organized, validated and tied to a goal.",
      rec: "Start with the goal and the decisions, and define what data you need to get there.",
    },
    {
      title: "Plan for sustainability from the outset",
      text: "A project's continuity is designed: data that demonstrates conservation and regeneration can sustain economies and financial mechanisms for the territory.",
      rec: "Design innovative financial mechanisms for continuity early on, ones that ensure the prosperity and Buen Vivir of those who care for the territory.",
      href: "etapa-5-decidir-y-sostener",
      link: "Decide and sustain",
    },
    {
      title: "Sharing data requires trust",
      text: "Information exchange between institutions is built step by step and takes time.",
      rec: "Start with small, concrete agreements, show the value of sharing and expand the exchange as trust grows.",
    },
  ],
  principles: [
    { title: "The territory guides the technology", text: "Local knowledge defines where, how and why monitoring happens; AI extends what the community already observes." },
    { title: "The goal defines the data", text: "Every data point answers a shared goal and a decision someone needs to make." },
    { title: "Data is governed before it is collected", text: "Clear agreements on ownership, access and use make trust and exchange possible." },
    { title: "Continuity is designed from day one", text: "Local capacities, committed institutions and funding sustain monitoring over time." },
  ],
  report: {
    eyebrow: "Public report · Phase 1",
    title: "Uso ético de sistemas de IA para la protección de la biodiversidad: el caso de Tech4Nature México (in Spanish)",
    text: "Methodology, results, lessons learned and recommendations from the project's first phase, including the responsible use of AI.",
    label: "Read the report (PDF, in Spanish)",
    url: "https://b51f2df9-b416-4320-ac2c-b010b75f6691.filesusr.com/ugd/0fecb2_1520b2af718e4c9984e4c3d7f73f3405.pdf",
  },
};

// ---------------------------------------------------------------------------
// Local videos

export const LOCAL_VIDEOS = [
  {
    src: `${T4N_FILES}/video/festival-jaguar.mp4`,
    poster: `${T4N_FILES}/video/festival-jaguar.jpg`,
    title: "Where Dzilam de Bravo is",
    caption: "From the continent to the northern coast of Yucatán: this is how you reach the reserve and the Jaguar Festival.",
    loop: false,
  },
  {
    src: `${T4N_FILES}/video/dzilam-dron.mp4`,
    poster: `${T4N_FILES}/video/dzilam-dron.jpg`,
    title: "The Dzilam forest from the air",
    caption: "Drone footage of the low forest and the trails the team uses to reach the monitoring stations.",
    loop: true,
  },
];
