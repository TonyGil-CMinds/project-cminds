// Datos de la portada de Tech4Nature México: especies, fotos, mapa y equipo.
// Generado a partir del reporte técnico de la fase 1 y del informe de BioScanner (29 oct 2026).

/** [nombre científico, nombre común, clase, NOM-059, UICN] */
export type SpeciesP1 = [string, string, string, string, string];
export const SPECIES_P1: SpeciesP1[] = [
  ["Lithobates brownorum", "Rana leopardo de Brown", "Anfibios", "Pr", "LC"],
  ["Agalychnis callidryas", "Rana verde de ojos rojos", "Anfibios", "", "LC"],
  ["Leptodactylus melanonotus", "Ranita del sabinal", "Anfibios", "", "LC"],
  ["Lithobates berlandieri", "Rana leopardo del Río Grande", "Anfibios", "", "LC"],
  ["Smilisca baudinii", "Rana arborícola mexicana", "Anfibios", "", "LC"],
  ["Trachycephalus typhonius", "Rana lechosa", "Anfibios", "", "LC"],
  ["Rupornis magnirostris", "Aguililla caminera", "Aves", "", "LC"],
  ["Penelope purpurascens", "Pava cojolita", "Aves", "A", "NT"],
  ["Buteo plagiatus", "Aguililla gris", "Aves", "", "LC"],
  ["Ictinia plumbea", "Milano plomizo", "Aves", "Pr", "LC"],
  ["Buteogallus urubitinga", "Aguililla negra mayor", "Aves", "Pr", "LC"],
  ["Dendrocygna autumnalis", "Pijije alas blancas", "Aves", "", "LC"],
  ["Aramus guarauna", "Carrao", "Aves", "A", "LC"],
  ["Ardea alba", "Garza blanca", "Aves", "", "LC"],
  ["Ardea herodias", "Garza morena", "Aves", "Pr", "LC"],
  ["Tigrisoma mexicanum", "Garza tigre mexicana", "Aves", "Pr", "LC"],
  ["Butorides virescens", "Garza verde", "Aves", "", ""],
  ["Egretta caerulea", "Garza azul", "Aves", "", "LC"],
  ["Egretta tricolor", "Garza tricolor", "Aves", "", "LC"],
  ["Agamia agami", "Garza agami", "Aves", "Pr", "VU"],
  ["Egretta thula", "Garza dedos dorados", "Aves", "", "LC"],
  ["Cochlearius cochlearius", "Garza cucharón", "Aves", "", "LC"],
  ["Nyctidromus albicollis", "Chotacabras pauraque", "Aves", "", "LC"],
  ["Passerina ciris", "Colorín sietecolores", "Aves", "Pr", "LC"],
  ["Coragyps atratus", "Zopilote común", "Aves", "", "LC"],
  ["Mycteria americana", "Cigüeña americana", "Aves", "Pr", "LC"],
  ["Zenaida aurita", "Paloma zenaida", "Aves", "Pr", "LC"],
  ["Leptotila jamaicensis", "Paloma caribeña", "Aves", "", "LC"],
  ["Leptotila verreauxi", "Paloma arroyera", "Aves", "Pr", "LC"],
  ["Columbina passerina", "Tortolita pico rojo", "Aves", "A", "LC"],
  ["Cyanocorax yucatanicus", "Chara yucateca", "Aves", "", "LC"],
  ["Cyanocorax yncas", "Chara verde", "Aves", "", "LC"],
  ["Ortalis vetula", "Chachalaca oriental", "Aves", "", "LC"],
  ["Crax rubra", "Hocofaisán", "Aves", "A", "VU"],
  ["Xiphorhynchus flavigaster", "Trepatroncos bigotudo", "Aves", "", "LC"],
  ["Quiscalus mexicanus", "Zanate mayor", "Aves", "", "LC"],
  ["Dives dives", "Tordo cantor", "Aves", "", "LC"],
  ["Mimus gilvus", "Centzontle tropical", "Aves", "", "LC"],
  ["Eumomota superciliosa", "Momoto cejas azules (toh)", "Aves", "", "LC"],
  ["Momotus lessonii", "Momoto corona azul", "Aves", "", "LC"],
  ["Colinus nigrogularis", "Codorniz yucateca", "Aves", "", "LC"],
  ["Parkesia motacilla", "Chipe arroyero", "Aves", "", "LC"],
  ["Seiurus aurocapilla", "Chipe suelero", "Aves", "", "LC"],
  ["Geothlypis trichas", "Mascarita común", "Aves", "", "LC"],
  ["Meleagris ocellata", "Pavo ocelado", "Aves", "A", "NT"],
  ["Melanerpes pygmaeus", "Carpintero yucateco", "Aves", "", "LC"],
  ["Aramides albiventris", "Rascón cuello rufo", "Aves", "", "LC"],
  ["Porzana carolina", "Polluela sora", "Aves", "", "LC"],
  ["Gallinago delicata", "Agachona norteamericana", "Aves", "", "LC"],
  ["Tringa solitaria", "Playero solitario", "Aves", "", "LC"],
  ["Eudocimus albus", "Ibis blanco", "Aves", "", "LC"],
  ["Crypturellus cinnamomeus", "Tinamú canelo", "Aves", "Pr", "LC"],
  ["Amazilia rutila", "Colibrí canelo", "Aves", "", "LC"],
  ["Cynanthus canivetii", "Esmeralda de Canivet", "Aves", "", "LC"],
  ["Turdus grayi", "Mirlo café", "Aves", "", "LC"],
  ["Hylocichla mustelina", "Zorzal moteado", "Aves", "", "LC"],
  ["Pitangus sulphuratus", "Luis bienteveo", "Aves", "", "LC"],
  ["Myiozetetes similis", "Luis gregario", "Aves", "", "LC"],
  ["Myiarchus yucatanensis", "Papamoscas yucateco", "Aves", "", "LC"],
  ["Attila spadiceus", "Mosquero atila", "Aves", "Pr", "LC"],
  ["Herpetotheres cachinnans", "Halcón guaco", "Aves", "", "LC"],
  ["Micrastur semitorquatus", "Halcón selvático de collar", "Aves", "Pr", "LC"],
  ["Elanoides forficatus", "Milano tijereta", "Aves", "Pr", "LC"],
  ["Buteogallus anthracinus", "Aguililla negra menor", "Aves", "Pr", "LC"],
  ["Laterallus ruber", "Polluela rojiza", "Aves", "", "LC"],
  ["Himantopus mexicanus", "Candelero americano", "Aves", "", "LC"],
  ["Patagioenas flavirostris", "Paloma morada", "Aves", "", "LC"],
  ["Streptopelia decaocto", "Paloma turca", "Aves", "", "LC"],
  ["Zenaida asiatica", "Paloma alas blancas", "Aves", "", "LC"],
  ["Amazona albifrons", "Loro frente blanca", "Aves", "Pr", "LC"],
  ["Coccyzus americanus", "Cuclillo pico amarillo", "Aves", "", "LC"],
  ["Coccyzus minor", "Cuclillo de manglar", "Aves", "", "LC"],
  ["Crotophaga sulcirostris", "Garrapatero pijuy", "Aves", "P", "LC"],
  ["Bubo virginianus", "Búho cornudo", "Aves", "A", "LC"],
  ["Glaucidium brasilianum", "Tecolote bajeño", "Aves", "", "LC"],
  ["Nyctiphrynus yucatanicus", "Tapacaminos tucuchillo", "Aves", "", "LC"],
  ["Trogon melanocephalus", "Trogón cabeza negra", "Aves", "", "LC"],
  ["Chloroceryle aenea", "Martín pescador enano", "Aves", "", "LC"],
  ["Melanerpes aurifrons", "Carpintero cheje", "Aves", "", "LC"],
  ["Colaptes rubiginosus", "Carpintero olivo", "Aves", "", "LC"],
  ["Hylatomus lineatus", "Carpintero lineado", "Aves", "", "LC"],
  ["Camptostoma imberbe", "Mosquero lampiño", "Aves", "", "LC"],
  ["Tyrannus melancholicus", "Tirano tropical", "Aves", "", "LC"],
  ["Myiarchus tuberculifer", "Papamoscas triste", "Aves", "", "LC"],
  ["Myiarchus tyrannulus", "Papamoscas gritón", "Aves", "", "LC"],
  ["Thamnophilus doliatus", "Batará barrado", "Aves", "", "LC"],
  ["Cyclarhis gujanensis", "Vireón cejas canela", "Aves", "Pr", "LC"],
  ["Vireo pallens", "Vireo manglero", "Aves", "Pr", "LC"],
  ["Campylorhynchus yucatanicus", "Matraca yucateca", "Aves", "P", "NT"],
  ["Troglodytes aedon", "Saltapared común", "Aves", "Pr", "LC"],
  ["Uropsila leucogastra", "Saltapared vientre blanco", "Aves", "", "LC"],
  ["Geothlypis poliocephala", "Mascarita pico grueso", "Aves", "", "LC"],
  ["Amblycercus holosericeus", "Cacique pico claro", "Aves", "", "LC"],
  ["Icterus mesomelas", "Calandria cola amarilla", "Aves", "", "LC"],
  ["Icterus gularis", "Calandria dorso negro mayor", "Aves", "", "LC"],
  ["Agelaius phoeniceus", "Tordo sargento", "Aves", "", "LC"],
  ["Volatinia jacarina", "Semillero brincador", "Aves", "", "LC"],
  ["Sporophila morelleti", "Semillero de collar", "Aves", "", "LC"],
  ["Arremonops rufivirgatus", "Rascador oliváceo", "Aves", "", "LC"],
  ["Euphonia affinis", "Eufonia garganta negra", "Aves", "", "LC"],
  ["Cardinalis cardinalis", "Cardenal rojo", "Aves", "Pr", "LC"],
  ["Cyanocompsa parellina", "Colorín azulnegro", "Aves", "", "LC"],
  ["Antrostomus badius", "Tapacaminos yucateco", "Aves", "", "LC"],
  ["Rallus crepitans", "Rascón picudo", "Aves", "", "LC"],
  ["Dryobates scalaris", "Carpintero mexicano", "Aves", "", "LC"],
  ["Eupsittula nana", "Perico pecho sucio", "Aves", "", "NT"],
  ["Psilorhinus morio", "Chara pea", "Aves", "", "LC"],
  ["Pheugopedius maculipectus", "Saltapared moteado", "Aves", "", "LC"],
  ["Polioptila albiloris albiventris", "Perlita yucateca", "Aves", "", "LC"],
  ["Setophaga petechia", "Chipe amarillo", "Aves", "", "LC"],
  ["Saltator coerulescens grandis", "Picurero grisáceo", "Aves", "", "LC"],
  ["Nycticorax nycticorax", "Pedrete corona negra", "Aves", "", "LC"],
  ["Tringa flavipes", "Patamarilla menor", "Aves", "", "LC"],
  ["Piaya cayana", "Cuclillo canelo", "Aves", "", "LC"],
  ["Pachyramphus aglaiae", "Mosquero cabezón degollado", "Aves", "", "LC"],
  ["Tyrannus couchii", "Tirano silbador", "Aves", "", "LC"],
  ["Polioptila caerulea", "Perlita azulgris", "Aves", "", "LC"],
  ["Canis latrans", "Coyote", "Mamíferos", "", "LC"],
  ["Urocyon cinereoargenteus", "Zorra gris", "Mamíferos", "", "LC"],
  ["Mazama pandora", "Temazate yucateco", "Mamíferos", "", "VU"],
  ["Odocoileus virginianus", "Venado cola blanca", "Mamíferos", "", "LC"],
  ["Cuniculus paca", "Tepezcuintle", "Mamíferos", "", "LC"],
  ["Dasyprocta punctata", "Sereque", "Mamíferos", "", "LC"],
  ["Didelphis virginiana", "Tlacuache norteño", "Mamíferos", "", "LC"],
  ["Didelphis marsupialis", "Tlacuache común", "Mamíferos", "", "LC"],
  ["Philander opossum", "Tlacuache cuatro ojos", "Mamíferos", "A", "LC"],
  ["Panthera onca", "Jaguar", "Mamíferos", "P", "NT"],
  ["Leopardus pardalis", "Ocelote", "Mamíferos", "P", "LC"],
  ["Herpailurus yagouaroundi", "Yaguarundi", "Mamíferos", "A", "LC"],
  ["Leopardus wiedii", "Tigrillo (margay)", "Mamíferos", "P", "NT"],
  ["Sylvilagus floridanus", "Conejo castellano", "Mamíferos", "", "LC"],
  ["Spilogale angustifrons", "Zorrillo manchado sureño", "Mamíferos", "", "LC"],
  ["Conepatus semistriatus", "Zorrillo de espalda blanca", "Mamíferos", "Pr", "LC"],
  ["Eira barbara", "Cabeza de viejo", "Mamíferos", "P", "LC"],
  ["Nasua narica", "Coatí", "Mamíferos", "A", ""],
  ["Procyon lotor", "Mapache", "Mamíferos", "", "LC"],
  ["Sciurus yucatanensis", "Ardilla yucateca", "Mamíferos", "", "LC"],
  ["Pecari tajacu", "Pecarí de collar", "Mamíferos", "", "LC"],
  ["Tayassu pecari", "Pecarí de labios blancos", "Mamíferos", "P", "VU"],
  ["Ateles geoffroyi", "Mono araña", "Mamíferos", "", "EN"],
  ["Rhinoclemmys areolata", "Tortuga mojina", "Reptiles", "A", "NT"],
  ["Basiliscus vittatus", "Toloque rayado", "Reptiles", "", "LC"],
  ["Conophis lineatus", "Culebra guardacaminos", "Reptiles", "", "LC"],
  ["Crocodylus moreletii", "Cocodrilo de pantano", "Reptiles", "Pr", "LC"],
  ["Ctenosaura similis", "Iguana rayada (garrobo)", "Reptiles", "A", "LC"],
  ["Sceloporus chrysostictus", "Lagartija escamosa yucateca", "Reptiles", "", "LC"],
];

/** [nombre científico, nombre común, clase, NOM-059, UICN, eventos, campañas, marca, nota, también en fase 1] */
export type SpeciesBS = [string, string, string, string, string, number, number, "" | "domestica" | "revisar", string, boolean];
export const SPECIES_BS: SpeciesBS[] = [
  ["Odocoileus virginianus", "Venado cola blanca", "Mamíferos", "", "LC", 1928, 15, "", "", true],
  ["Urocyon cinereoargenteus", "Zorra gris", "Mamíferos", "", "LC", 907, 15, "", "", true],
  ["Dasyprocta punctata", "Sereque", "Mamíferos", "", "LC", 720, 14, "", "", true],
  ["Aramides cajaneus", "Rascón cuello gris", "Aves", "", "LC", 581, 14, "", "", false],
  ["Tayassu pecari", "Pecarí de labios blancos", "Mamíferos", "subsp.", "VU", 522, 14, "", "", true],
  ["Panthera onca", "Jaguar", "Mamíferos", "P", "NT", 480, 16, "", "", true],
  ["Pecari tajacu", "Pecarí de collar", "Mamíferos", "", "LC", 457, 14, "", "", true],
  ["Meleagris ocellata", "Pavo ocelado", "Aves", "A end.", "NT", 436, 14, "", "", true],
  ["Sylvilagus floridanus", "Conejo castellano", "Mamíferos", "", "LC", 331, 12, "", "", true],
  ["Crax rubra", "Hocofaisán", "Aves", "A", "VU", 288, 14, "", "", true],
  ["Ortalis vetula", "Chachalaca oriental", "Aves", "", "LC", 286, 14, "", "", true],
  ["Canis latrans", "Coyote", "Mamíferos", "", "LC", 253, 11, "", "", true],
  ["Ardea alba", "Garza blanca", "Aves", "", "LC", 242, 6, "", "", true],
  ["Nasua narica", "Coatí", "Mamíferos", "subsp.", "LC", 233, 13, "", "", true],
  ["Didelphis virginiana", "Tlacuache norteño", "Mamíferos", "", "LC", 140, 10, "", "", true],
  ["Mazama temama", "Temazate rojo", "Mamíferos", "", "DD", 117, 14, "revisar", "En el norte de Yucatán suele registrarse el temazate yucateco (Mazama pandora).", false],
  ["Leptotila verreauxi", "Paloma arroyera", "Aves", "subsp.", "LC", 112, 9, "", "", true],
  ["Cuniculus paca", "Tepezcuintle", "Mamíferos", "", "LC", 92, 7, "", "", true],
  ["Bos taurus", "Ganado vacuno (doméstico)", "Mamíferos", "", "", 89, 12, "domestica", "", false],
  ["Leopardus pardalis", "Ocelote", "Mamíferos", "P", "LC", 86, 12, "", "", true],
  ["Didelphis marsupialis", "Tlacuache común", "Mamíferos", "", "LC", 78, 9, "", "", true],
  ["Procyon lotor", "Mapache", "Mamíferos", "subsp.", "LC", 72, 14, "", "", true],
  ["Canis familiaris", "Perro (doméstico)", "Mamíferos", "", "", 59, 9, "domestica", "", false],
  ["Conepatus semistriatus", "Zorrillo de espalda blanca", "Mamíferos", "subsp.", "LC", 56, 8, "", "", true],
  ["Equus caballus", "Caballo (doméstico)", "Mamíferos", "", "", 54, 8, "domestica", "", false],
  ["Felis catus", "Gato (doméstico)", "Mamíferos", "", "", 44, 6, "domestica", "", false],
  ["Aramus guarauna", "Carrao", "Aves", "A", "LC", 34, 7, "", "", true],
  ["Eira barbara", "Cabeza de viejo", "Mamíferos", "P", "LC", 32, 9, "", "", true],
  ["Egretta tricolor", "Garza tricolor", "Aves", "", "LC", 31, 6, "", "", true],
  ["Dendrocygna autumnalis", "Pijije alas blancas", "Aves", "", "LC", 29, 2, "", "", true],
  ["Cyanocorax yucatanicus", "Chara yucateca", "Aves", "", "LC", 21, 5, "", "", true],
  ["Tigrisoma mexicanum", "Garza tigre mexicana", "Aves", "Pr", "LC", 19, 8, "", "", true],
  ["Ardea herodias", "Garza morena", "Aves", "subsp.", "LC", 18, 6, "", "", true],
  ["Sciurus yucatanensis", "Ardilla yucateca", "Mamíferos", "", "LC", 17, 7, "", "", true],
  ["Coragyps atratus", "Zopilote común", "Aves", "", "LC", 16, 1, "", "", true],
  ["Leptotila jamaicensis", "Paloma caribeña", "Aves", "", "LC", 14, 6, "", "", true],
  ["Herpailurus yagouaroundi", "Yaguarundi", "Mamíferos", "A", "NT", 12, 9, "", "", true],
  ["Buteogallus anthracinus", "Aguililla negra menor", "Aves", "Pr", "LC", 10, 7, "", "", true],
  ["Buteogallus urubitinga", "Aguililla negra mayor", "Aves", "Pr", "LC", 10, 5, "", "", true],
  ["Cathartes aura", "Zopilote aura", "Aves", "", "LC", 10, 3, "", "", false],
  ["Puma concolor", "Puma", "Mamíferos", "", "LC", 10, 5, "", "", false],
  ["Leopardus wiedii", "Tigrillo (margay)", "Mamíferos", "P", "NT", 8, 3, "", "", true],
  ["Melanoptila glabrirostris", "Maullador negro", "Aves", "Pr end.", "LC", 8, 3, "", "", false],
  ["Zenaida aurita", "Paloma zenaida", "Aves", "Pr", "LC", 8, 3, "", "", true],
  ["Crypturellus cinnamomeus", "Tinamú canelo", "Aves", "Pr", "LC", 7, 4, "", "", true],
  ["Dives dives", "Tordo cantor", "Aves", "", "LC", 7, 4, "", "", true],
  ["Colinus nigrogularis", "Codorniz yucateca", "Aves", "", "LC", 6, 2, "", "", true],
  ["Spilogale yucatanensis", "Zorrillo manchado yucateco", "Mamíferos", "", "", 6, 3, "", "", false],
  ["Chordeiles acutipennis", "Chotacabras menor", "Aves", "", "LC", 5, 4, "", "", false],
  ["Eumomota superciliosa", "Momoto cejas azules (toh)", "Aves", "", "LC", 5, 5, "", "", true],
  ["Herpetotheres cachinnans", "Halcón guaco", "Aves", "", "LC", 5, 2, "", "", true],
  ["Mycteria americana", "Cigüeña americana", "Aves", "Pr", "LC", 5, 2, "", "", true],
  ["Penelope obscura", "Pava oscura", "Aves", "", "LC", 5, 1, "revisar", "Fuera de su distribución; posible confusión con la pava cojolita.", false],
  ["Eudocimus albus", "Ibis blanco", "Aves", "", "LC", 4, 2, "", "", true],
  ["Mimus gilvus", "Centzontle tropical", "Aves", "", "LC", 4, 3, "", "", true],
  ["Penelope purpurascens", "Pava cojolita", "Aves", "A", "NT", 3, 1, "", "", true],
  ["Turdus grayi", "Mirlo café", "Aves", "", "LC", 3, 2, "", "", true],
  ["Butorides virescens", "Garza verde", "Aves", "", "LC", 2, 1, "", "", true],
  ["Cathartes burrovianus", "Zopilote sabanero", "Aves", "Pr", "LC", 2, 2, "", "", false],
  ["Cochlearius cochlearius", "Garza cucharón", "Aves", "", "LC", 2, 1, "", "", true],
  ["Ctenosaura similis", "Iguana rayada (garrobo)", "Reptiles", "A", "LC", 2, 2, "", "", true],
  ["Dasypus novemcinctus", "Armadillo", "Mamíferos", "", "LC", 2, 1, "", "", false],
  ["Geranospiza caerulescens", "Gavilán zancón", "Aves", "A", "LC", 2, 2, "", "", false],
  ["Tamandua mexicana", "Oso hormiguero", "Mamíferos", "subsp.", "LC", 2, 2, "", "", false],
  ["Zenaida asiatica", "Paloma alas blancas", "Aves", "", "LC", 2, 1, "", "", true],
  ["Ascalapha odorata", "Mariposa bruja", "Insectos", "", "", 1, 1, "", "", false],
  ["Ateles geoffroyi", "Mono araña", "Mamíferos", "P", "EN", 1, 1, "", "", true],
  ["Buteo plagiatus", "Aguililla gris", "Aves", "", "LC", 1, 1, "", "", true],
  ["Columbina passerina", "Tortolita pico rojo", "Aves", "subsp.", "LC", 1, 1, "", "", true],
  ["Crocodylus moreletii", "Cocodrilo de pantano", "Reptiles", "Pr", "LC", 1, 1, "", "", true],
  ["Cyanocorax yncas", "Chara verde", "Aves", "", "LC", 1, 1, "", "", true],
  ["Cynanthus canivetii", "Esmeralda de Canivet", "Aves", "", "LC", 1, 1, "", "", true],
  ["Dromococcyx phasianellus", "Cuclillo faisán", "Aves", "", "LC", 1, 1, "", "", false],
  ["Egretta caerulea", "Garza azul", "Aves", "", "LC", 1, 1, "", "", true],
  ["Geococcyx velox", "Correcaminos tropical", "Aves", "", "LC", 1, 1, "", "", false],
  ["Limnodromus griseus", "Costurero pico corto", "Aves", "", "VU", 1, 1, "", "", false],
  ["Melanerpes pygmaeus", "Carpintero yucateco", "Aves", "", "LC", 1, 1, "", "", true],
  ["Pitangus sulphuratus", "Luis bienteveo", "Aves", "", "LC", 1, 1, "", "", true],
  ["Pyrocephalus obscurus", "Mosquero cardenal", "Aves", "", "", 1, 1, "", "", false],
  ["Quiscalus mexicanus", "Zanate mayor", "Aves", "", "LC", 1, 1, "", "", true],
  ["Quiscalus mexicanus peruvianus", "Zanate mayor (subespecie)", "Aves", "", "", 1, 1, "revisar", "Subespecie del zanate mayor, ya incluido en la lista.", false],
  ["Tigrisoma lineatum", "Garza tigre rojiza", "Aves", "", "LC", 1, 1, "revisar", "Fuera de su distribución; posible confusión con la garza tigre mexicana.", false],
  ["Tringa solitaria", "Playero solitario", "Aves", "", "LC", 1, 1, "", "", true],
  ["Tyto alba", "Lechuza de campanario", "Aves", "", "LC", 1, 1, "", "", false],
];

export const MAP_SHAPE = {"W": 1000, "H": 381, "d": "M94 358L100 340L97 333L101 331L98 328L100 325L95 321L100 307L106 307L99 305L107 290L107 273L111 273L107 263L111 263L109 259L117 253L115 252L122 236L123 230L121 230L128 225L137 198L141 198L144 191L148 192L150 184L157 184L164 174L176 171L195 158L204 156L209 158L215 152L219 155L228 147L234 147L237 142L249 139L249 133L249 138L252 139L287 135L288 126L280 127L278 123L301 120L295 122L301 129L309 122L322 127L325 122L337 122L337 114L342 114L342 117L373 115L383 112L383 108L479 95L513 82L506 89L518 79L526 78L527 70L513 81L531 64L583 54L600 57L612 56L624 53L626 49L629 51L648 42L654 46L659 45L676 54L684 54L685 56L688 53L693 57L696 53L698 56L700 53L707 55L712 55L717 63L727 69L739 70L739 68L753 72L756 69L754 72L748 71L761 75L762 72L768 74L770 71L733 64L727 62L720 60L718 58L709 53L702 52L694 48L688 50L675 46L673 48L671 49L673 48L668 46L663 47L662 46L651 44L650 42L647 42L649 40L633 42L642 39L685 43L734 62L791 73L770 71L782 75L792 74L797 81L807 78L828 87L839 85L845 90L850 89L851 93L853 89L857 91L854 96L860 97L859 93L861 99L860 84L864 87L864 96L866 95L864 87L869 94L870 88L872 90L872 87L878 85L883 79L884 59L882 57L885 53L880 54L887 50L886 52L905 59L932 93L940 130L941 134L944 132L944 133L945 135L944 135L948 140L949 137L947 137L944 133L944 132L949 133L950 131L945 127L949 124L949 116L953 113L955 109L955 101L949 91L955 98L954 93L956 108L954 112L951 118L950 124L955 157L950 163L950 184L953 186L935 234L921 249L916 261L905 268L884 296L842 332L821 372L809 387L802 406L96 406L95 403L100 402L100 393L97 389L100 383L97 386L98 362L94 358ZM167 214L168 220L169 214L167 214ZM113 250L113 241L117 231L115 232L125 203L133 190L154 177L130 197L127 216L121 227L119 237L117 234L118 239L116 236L116 243L114 237L113 250ZM246 134L245 132L278 124L279 127L279 130L276 127L249 132L248 133L246 133L246 134ZM872 86L869 84L870 79L876 83L872 86ZM199 155L233 136L246 133L234 136L231 142L233 142L233 140L235 142L235 139L239 140L238 138L240 142L230 143L230 140L232 138L228 139L214 149L199 155ZM816 69L815 66L829 54L840 60L856 59L881 46L857 64L837 64L831 57L827 60L827 56L816 69ZM903 340L924 306L931 302L937 310L940 308L938 306L943 306L943 309L950 307L952 309L971 296L955 328L946 334L930 357L910 376L903 369L901 352L903 340Z"} as const;

export const MAP_POINTS = {"merida": [298, 202], "dzilam": [467, 96], "sanfelipe": [620, 53], "riolagartos": [638, 46], "cancun": [942, 154], "valladolid": [628, 271]} as const;

// ---------------------------------------------------------------------------
// Fotos

const T4N_FILES = "/platforms/aiforbiodiversity/initiative-tech4nature/toolkit";

export type Photo = { src: string; alt: string; caption: string };

const jag = (file: string, caption: string, alt = "Jaguar registrado por una cámara trampa en la Reserva Estatal de Dzilam"): Photo => ({
  src: `${T4N_FILES}/jaguares/${file}.jpg`,
  alt,
  caption,
});

export const JAGUAR_PHOTOS: Photo[] = [
  jag("jaguar-2025-04", "Abril de 2025"),
  jag("jaguar-2025-10-agua", "Octubre de 2025, en una aguada"),
  jag("jaguar-2025-09-a", "Septiembre de 2025"),
  jag("jaguar-2024-02", "Febrero de 2024"),
  jag("jaguar-2025-10-c", "Octubre de 2025"),
  jag("jaguar-2026-04-noche", "Abril de 2026, de noche"),
  jag("jaguar-2025-07-b", "Julio de 2025"),
  jag("jaguar-2026-03", "Marzo de 2026"),
  jag("jaguar-2024-04-a", "Abril de 2024"),
  jag("jaguar-2025-10-niebla", "Octubre de 2025, al amanecer"),
  jag("jaguar-2025-10-b", "Octubre de 2025"),
  jag("jaguar-2025-07-a", "Julio de 2025"),
];

const bs = (file: string, caption: string, alt: string): Photo => ({ src: `${T4N_FILES}/bioscanner/${file}.jpg`, alt, caption });

export const BIOSCANNER_PHOTOS: Photo[] = [
  bs("bs-puma-96", "Puma, 96 % de confianza", "Foto de cámara trampa con un puma enmarcado y la etiqueta Puma concolor 96 %"),
  bs("bs-jaguar-84", "Jaguar, 84 % de confianza", "Foto de cámara trampa con un jaguar enmarcado y la etiqueta Panthera onca 84 %"),
  bs("bs-margay", "Tigrillo, 90 % de confianza", "Foto nocturna con un tigrillo enmarcado y la etiqueta Leopardus wiedii 90 %"),
  bs("bs-mono-arana", "Mono araña: uno detectado por el modelo y otro añadido a mano", "Dos monos araña enmarcados, uno por el modelo con 88 % y otro marcado a mano"),
  bs("bs-tayra", "Cabeza de viejo, 48 %: el modelo pide revisión", "Foto con una cabeza de viejo enmarcada y la etiqueta Eira barbara 48 %"),
  bs("bs-ocelote", "Ocelote de noche, 31 %: una persona lo valida", "Foto nocturna con un ocelote enmarcado y la etiqueta Leopardus pardalis 31 %"),
];

// ---------------------------------------------------------------------------
// Portada: qué es Tech4Nature México y lo que hemos logrado

export const T4N_HOME = {
  title: "Tech4Nature México",
  subtitle:
    "Comunidad, gobierno, ciencia e inteligencia artificial trabajando juntos para conservar al jaguar y la biodiversidad de la costa norte de Yucatán.",
  eyebrow: "Crea tu propio Tech4Nature · Toolkit 2022–2026",
  invite:
    "Este toolkit reúne lo que aprendimos en cuatro años para que otros territorios creen su propio Tech4Nature. Antes de los pasos, conoce la historia, los resultados y a las personas que lo hicieron posible.",
};

export const EXPANSION = {
  before: 69000,
  after: 104304,
  decree: {
    label: "Acuerdo 76/2024, Diario Oficial del Gobierno del Estado de Yucatán, 23 de septiembre de 2024",
    url: "https://www.yucatan.gob.mx/docs/diario_oficial/diarios/2024/2024-09-23_2.pdf",
  },
  paragraphs: [
    "En 2024, el Gobierno de Yucatán amplió la Reserva Estatal de Dzilam de 69,000 a 104,304 hectáreas: más de 35,000 hectáreas nuevas bajo protección, un aumento de 51 %.",
    "La fundamentación técnica del acuerdo incluye los estudios de Tech4Nature México con cámaras trampa, los registros de jaguar en zonas aledañas a la reserva y la necesidad de reforzar la conectividad ecológica. La evidencia que la comunidad, la SDS y C Minds construyeron en campo se convirtió en una decisión de conservación de largo plazo.",
    "La ampliación abrió una nueva etapa: actualizar el programa de manejo con quienes viven y trabajan en el territorio. En la fase 2, Tech4Nature México acompañó esa actualización con 17 entrevistas a los sectores de turismo, pesca, ganadería, comunidad y gobierno.",
  ],
};

export const BIOSCANNER_REPORT = {
  date: "29 de octubre de 2026",
  period: "marzo de 2022 a agosto de 2026",
  files: 333087,
  photos: 317565,
  videos: 15522,
  emptyShare: "89,1 %",
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
    "BioScanner es la plataforma de inteligencia artificial que nació de Tech4Nature México. Recibe miles de fotos y videos de cámaras trampa, descarta los vacíos, propone la especie en cada registro e identifica jaguares por el patrón único de sus manchas. Las personas revisan y validan cada resultado, y la plataforma convierte esos registros en informes que un equipo de campo puede usar.",
  capabilities: [
    { title: "Filtra lo vacío", text: "Descarta automáticamente las fotos sin animales, que suelen ser la mayoría." },
    { title: "Propone la especie", text: "Marca cada animal en la foto con su especie y un nivel de confianza; cuando duda, pide revisión." },
    { title: "Reconoce jaguares", text: "Compara las rosetas de cada jaguar para proponer de qué individuo se trata." },
    { title: "Genera informes", text: "Riqueza de especies, índices de diversidad y abundancia, esfuerzo por estación, especies en riesgo y actividad por hora." },
    { title: "Cuida los datos", text: "Cada proyecto decide quién ve sus registros; las ubicaciones de especies sensibles se protegen." },
    { title: "Habla tu idioma", text: "Interfaz en español, inglés, portugués y maya, pensada para equipos de campo." },
  ],
  reportNote:
    "Cifras del informe de proyecto que BioScanner generó para Tech4Nature México el 29 de octubre de 2026, con las cámaras trampa de marzo de 2022 a agosto de 2026.",
  cta: { label: "Entrar a BioScanner", url: "https://app.bioscanner.io" },
};

export const SPECIES_PANEL = {
  lead: "Dos listas, dos métodos. Juntas muestran lo que cada herramienta ve del territorio.",
  note: [
    "La lista de la fase 1 (2022–2024) reúne 146 especies registradas con cámaras trampa (81) y grabadoras acústicas (95); 30 se registraron con ambos métodos. Muchas aves solo se detectaron por su canto, y 40 especies están en alguna categoría de riesgo según la NOM-059 o la Lista Roja de la UICN.",
    "El informe de BioScanner (marzo de 2022 a agosto de 2026) analiza solo fotos y videos de cámaras trampa, sin audio. Registra 84 taxones: 76 especies silvestres, 4 animales domésticos y 4 identificaciones por revisar. Por eso incluye menos aves, y suma 16 especies que no aparecen en la lista de la fase 1, como el puma, el oso hormiguero y la lechuza de campanario.",
  ],
  sources: [
    { label: "Reporte técnico de la fase 1 de Tech4Nature México (2024)", url: "" },
    { label: "Informe de proyecto de BioScanner, 29 de octubre de 2026", url: "" },
  ],
};

export const JAGUAR_PANEL = {
  lead:
    "El jaguar es la especie que dio origen a Tech4Nature México. Estas fotos son registros reales de las cámaras trampa del proyecto en la Reserva Estatal de Dzilam y sus alrededores.",
  facts: [
    "16 jaguares identificados de forma individual por el patrón de sus rosetas. El catálogo está en verificación.",
    "480 registros independientes de jaguar en 25 estaciones de cámara trampa, según el informe de BioScanner.",
    "Un mismo jaguar fue registrado en dos sitios a cerca de 40 km de distancia, de Dzilam hacia Ría Lagartos: evidencia de que el paisaje sigue conectado.",
  ],
  care: "Para proteger a la especie, las fotos no muestran la ubicación de las cámaras.",
};

// ---------------------------------------------------------------------------
// Mapa

export const MAP_TEXT = {
  lead:
    "Tech4Nature México trabaja en la costa norte de Yucatán, entre la Reserva Estatal de Dzilam y la Reserva de la Biosfera Ría Lagartos. Es un mosaico de selva baja, manglar, petenes, dunas costeras y lagunas, con comunidades que viven de la pesca, la ganadería y el turismo.",
  facts: [
    { value: "104,304 ha", label: "Reserva Estatal de Dzilam, tras su ampliación en 2024" },
    { value: "33", label: "estaciones de cámara trampa analizadas en BioScanner" },
    { value: "12,024", label: "días-cámara de monitoreo, de 2022 a 2026" },
    { value: "~40 km", label: "entre dos registros del mismo jaguar, hacia Ría Lagartos" },
  ],
  googleEmbed:
    "https://www.google.com/maps?q=Reserva%20Estatal%20de%20Dzilam%2C%20Dzilam%20de%20Bravo%2C%20Yucat%C3%A1n&ll=21.4616374,-88.6608063&z=11&t=k&output=embed",
  googleUrl:
    "https://www.google.com/maps/place/97608+Reserva+Estatal+de+Dzilam+de+Bravo,+Yucatan,+Mexico/@21.4616374,-88.6608063,48060m/data=!3m1!1e3!4m6!3m5!1s0x8f53956fb63c5145:0x257bef41330fb623!8m2!3d21.5027274!4d-88.4908506!16s%2Fg%2F1wyc5d26",
  googleCaption: "Vista satelital de la Reserva Estatal de Dzilam en Google Maps. Explora la costa, el manglar y la selva que cuida el proyecto.",
  note: "Mapa esquemático. Por seguridad de la fauna no mostramos la ubicación de las cámaras; los límites oficiales de la reserva están en el Acuerdo 76/2024.",
};

// ---------------------------------------------------------------------------
// Equipo

export type Person = { name: string; role: string; org?: string; photo?: string };
export type TeamGroup = { id: string; title: string; intro?: string; people: Person[]; names?: { label: string; list: string[] }[] };

const wix = (id: string) => `https://static.wixstatic.com/media/${id}/v1/fill/w_240,h_240,al_c,q_80,enc_auto/foto.jpg`;

export const TEAM_INTRO =
  "Tech4Nature México existe gracias a muchas personas. Algunas siguen en el proyecto; otras lo construyeron en distintos momentos y hoy están en otros caminos. Esta página es un reconocimiento a todas.";

export const TEAM_CORE: TeamGroup[] = [
  {
    id: "c-minds",
    title: "C Minds",
    people: [
      { name: "Constanza Gómez-Mont", role: "Fundadora y presidenta de C Minds. Líder del proyecto", photo: "/core/constanzaGM.png" },
      { name: "Regina Cervera", role: "Directora de programas de innovación para la naturaleza. Coordinación del proyecto", photo: `${T4N_FILES}/equipo/p-regina.jpg` },
      { name: "Ángel Escalante", role: "Líder de desarrollo tecnológico de BioScanner", photo: "/team/Angel Escalante.png" },
      { name: "Xiomara Vázquez", role: "Líder de marca y experiencia de BioScanner", photo: "/team/Xiomy Vazquez.png" },
      { name: "Daniela Pérez", role: "Consultora de programas de conservación: campo, KoboToolbox y coordinación", photo: `${T4N_FILES}/equipo/p-daniela.jpg` },
      { name: "Bryan Ruiz", role: "Líder de experiencia creativa", photo: "/team/Bryan Ruiz.png" },
    ],
  },
  {
    id: "territorio",
    title: "En el territorio: Grupo de Monitoreo Chac Mool",
    people: [
      { name: "Benjamín Campos", role: "Monitor fundador y líder comunitario", photo: `${T4N_FILES}/equipo/p-benja.jpg` },
      { name: "Juan Castillo", role: "Monitor fundador", photo: `${T4N_FILES}/equipo/p-juan.jpg` },
      { name: "Darwin Sosa", role: "Monitor fundador y líder de turismo sustentable", photo: `${T4N_FILES}/equipo/p-darwin.jpg` },
      { name: "Efraín Uicab", role: "Monitor", photo: `${T4N_FILES}/equipo/p-efrain.jpg` },
      { name: "Mateo Ordóñez", role: "Monitor", photo: `${T4N_FILES}/equipo/p-mateo.jpg` },
      { name: "Josué Argáez", role: "Monitor", photo: `${T4N_FILES}/equipo/p-josue.jpg` },
      { name: "Toshio Yokoyama", role: "Liderazgo de operaciones de campo y política. Antes, director de Conservación en la SDS", photo: `${T4N_FILES}/equipo/p-toshio.jpg` },
    ],
  },
  {
    id: "uicn",
    title: "UICN",
    people: [
      { name: "James McBreen", role: "Gerente de programa de Tecnología e Innovación. Supervisión del proyecto", photo: wix("0fecb2_b25958664415423c86cabb2ca37d3086~mv2.jpg") },
      { name: "Úrsula Parrilla", role: "Directora regional para México, América Central y el Caribe" },
    ],
  },
];

export const TEAM_MORE: TeamGroup[] = [
  {
    id: "gobierno",
    title: "Gobierno de Yucatán",
    intro: "La Secretaría de Desarrollo Sustentable (SDS) co-lideró el proyecto desde el diseño y el trabajo de campo.",
    people: [
      { name: "Neyra Silva Rosado", role: "Secretaria de Desarrollo Sustentable", org: "SDS" },
    ],
  },
  {
    id: "comunidad",
    title: "Comunidad de Dzilam",
    people: [
      { name: "Javier Nadal", role: "Exguardaparque y líder comunitario", org: "Reserva Estatal de Dzilam", photo: wix("0fecb2_39858f848de24a5b928e3d45872a69ce~mv2.jpeg") },
    ],
      },
  {
    id: "c-minds-mas",
    title: "C Minds a lo largo del proyecto",
    people: [
      { name: "Enrique Portillo", role: "Administración y finanzas", org: "C Minds", photo: "/team/Enrique Portillo.png" },
      { name: "Ana Sofía Schmidt", role: "Comunicación y redes", org: "C Minds" },
      { name: "Nicte Cabañas", role: "Asistente de proyectos, fase 1", org: "C Minds" },
      { name: "Lucía Tróchez", role: "Directora de programas, fase 1", org: "C Minds" },
      { name: "Larissa Gus", role: "Líder de proyecto, fase 1", org: "C Minds" },
      { name: "Reese Jacobs", role: "Práctica profesional, fase 1", org: "C Minds" },
    ],
  },
];

export const TEAM_ALLIES: TeamGroup[] = [
  {
    id: "ex-sds",
    title: "Secretaría de Desarrollo Sustentable (SDS), fases 1 y 2",
    intro: "Integrantes de la SDS que co-lideraron el diseño y el trabajo de campo del proyecto.",
    people: [
      { name: "Alejandro Pacheco", role: "Líder operativo. Exjefe del Departamento de Conservación Ambiental", org: "Ex-SDS", photo: wix("0fecb2_525ff66e48664df1866066b370387a84~mv2.jpeg") },
      { name: "Esteban Ramírez", role: "Coordinación operativa", org: "Ex-SDS", photo: wix("0fecb2_8d9d8de4ab7a4b53b9221a025bc73314~mv2.jpeg") },
      { name: "Kay Vilchis", role: "Operaciones de campo", org: "Ex-SDS", photo: wix("0fecb2_91ae30dabbef4a9f98772afd23cacb21~mv2.jpeg") },
    ],
    names: [
      { label: "También en la SDS", list: ["Sayda Rodríguez", "Allam Tzab", "Valentina Vanegas", "Luis Roberto Pérez", "Asis Alcocer"] },
    ],
  },
  {
    id: "upy",
    title: "Universidad Politécnica de Yucatán (UPY)",
    intro: "Desarrolló con el proyecto los primeros modelos de reconocimiento de imágenes y formó a estudiantes en ingeniería de datos y sistemas embebidos.",
    people: [
      { name: "Mario Campos Soberanis", role: "Supervisión del algoritmo de imagen; después, modelos de BioScanner con Neuraan", org: "UPY · Neuraan", photo: wix("0fecb2_e4a97697c8fa42528a0bb03e624ec7f4~mv2.jpeg") },
      { name: "Diego Campos Sobrino", role: "Ingeniería de datos", org: "UPY", photo: wix("0fecb2_c9203c7671ce4936b395ca61e2cdf874~mv2.jpg") },
      { name: "Sharleen Morales", role: "Vinculación con estudiantes", org: "UPY", photo: wix("0fecb2_134c66f9aaa54ed29ed521cdf16ffd8d~mv2.jpg") },
      { name: "José Augusto Canul", role: "Equipo del algoritmo de imagen", org: "Ingeniero de datos", photo: wix("de03fd_b051b384c84449f09345e9aacdb9d597~mv2.jpg") },
    ],
    names: [
      { label: "Equipo académico", list: ["Ángel Pech", "Cristina Erales", "Jorge Mena", "Eduardo Espadas", "Julio Molina"] },
      {
        label: "Estudiantes de reconocimiento de imágenes y sistemas embebidos",
        list: ["Adrián Carmona", "Adriana Ku", "Efraín Matu", "Karla Valdez", "Pedro Uicab", "Matthew Esquivel", "Jorge Aguilar", "Andrés Martínez", "Carlos Dzul", "Ángel Quintal", "Edwin Camacho"],
      },
    ],
  },
  {
    id: "rfcx",
    title: "Rainforest Connection (RFCx), fase 1",
    intro: "Equipo que lideró el monitoreo acústico de la fase 1: grabadoras, análisis en Arbimon y modelos para reconocer especies por su sonido.",
    people: [
      { name: "Brooke Livesay", role: "Análisis acústico. Jefa de proyecto", org: "Ex-RFCx", photo: wix("0fecb2_26eb7ffa3f7c449793c890ab692e1c4c~mv2.jpg") },
      { name: "Mahreen Qazi", role: "Análisis acústico. Estrategia y operaciones", org: "Ex-RFCx", photo: wix("0fecb2_927d67e474c54cdca495e8b2abc6d5bc~mv2.jpg") },
      { name: "Chrissy Durkin", role: "Desarrollo de proyectos", org: "Ex-RFCx" },
      { name: "Marconi Campos-Cerqueira", role: "Ciencia acústica", org: "Ex-RFCx" },
    ],
    names: [{ label: "Equipo científico (ex-RFCx)", list: ["Kris Harmon", "Gabriel Leite", "Tomaz Melo", "Nelson Buainain", "José Wagner Ribeiro", "Carly Batist", "Lola Abed"] }],
  },
  {
    id: "huawei",
    title: "Huawei",
    intro: "Aliado de la iniciativa global Tech4Nature con la UICN, a través de su programa Tech4All.",
    people: [
      { name: "Samira Herrera", role: "Relaciones públicas y comunicación", org: "Huawei México", photo: wix("de03fd_e6489ec7dd0942c2bdcd5f9610e50459~mv2.jpg") },
      { name: "Armando Guauxochitl", role: "Director de estrategia y marketing", org: "Huawei Latam", photo: wix("0fecb2_f9790ac781274bcd919add96a6cf7d04~mv2.jpg") },
      { name: "Sira Lin", role: "Coordinación del proyecto", org: "Ex-Huawei México", photo: wix("0fecb2_fe116709e5be474e953cae28829f5525~mv2.jpg") },
      { name: "Joaquín Saldaña", role: "Estrategia de comunicación, fase 1. En memoria", org: "Ex-Huawei Latam" },
    ],
    names: [{ label: "También en Huawei", list: ["Leon Du", "Zeng Ming", "Eric Chendalong", "Zhang Jing"] }],
  },
  {
    id: "tecnicos",
    title: "Aliados técnicos",
    people: [
      { name: "Anuar Hernández", role: "Asesoría en identificación de jaguares y trabajo de campo", org: "Pronatura Península de Yucatán" },
      { name: "Adrián Hernández", role: "Estudio de conectividad entre Dzilam y Ría Lagartos", org: "Consultor" },
      { name: "Joel Koupermann", role: "Uso de BioScanner en la Estrategia Biocultural del Jaguar, Ecuador", org: "Fundación Pachamama" },
      { name: "Daning Montaño", role: "Uso de BioScanner en la Estrategia Biocultural del Jaguar, Ecuador", org: "Fundación Pachamama" },
      { name: "Jorge Osorno", role: "Video y registro audiovisual", org: "Independiente" },
    ],
  },
];

// ---------------------------------------------------------------------------
// Fotos de campo y de la serie de video

const C = (file: string) => `${T4N_FILES}/campo/${file}.jpg`;
const E = (file: string) => `${T4N_FILES}/equipo/${file}.jpg`;

export type GalleryPhoto = { src: string; alt: string; caption?: string };

export const GALLERY: { id: string; title: string; text: string; photos: GalleryPhoto[] }[] = [
  {
    id: "campo",
    title: "En el monte",
    text: "Los monitores del Grupo Chac Mool recorren la selva, los humedales y el manglar para revisar cámaras, cambiar baterías y buscar rastros. En temporada de lluvias, muchas veces el camino es de agua.",
    photos: [
      { src: C("juan-camara"), alt: "Juan Castillo revisa una cámara trampa sujeta a un árbol", caption: "Juan Castillo revisa una cámara trampa" },
      { src: C("agua-b"), alt: "Monitores de pie en un humedal inundado", caption: "Recorrido por un humedal inundado" },
      { src: C("caminata"), alt: "Equipo de campo caminando por la selva", caption: "Rumbo a una estación de monitoreo" },
      { src: C("mateo-camara"), alt: "Mateo Ordóñez junto a una cámara trampa", caption: "Mateo Ordóñez junto a una cámara trampa" },
      { src: C("cruce-humedal-b"), alt: "Integrantes del equipo cruzando un humedal con botas y machete", caption: "Cruce de humedal, fase 1" },
      { src: C("darwin-senala"), alt: "Darwin Sosa señala hacia el monte", caption: "Darwin Sosa muestra por dónde pasa la fauna" },
      { src: C("manglar"), alt: "Monitor sonriente de pie sobre las raíces del manglar", caption: "En el manglar" },
      { src: C("equipo-camioneta"), alt: "Equipo de Tech4Nature México en la batea de una camioneta", caption: "Monitores y equipo antes de salir a campo" },
      { src: C("cruce-humedal"), alt: "Equipo caminando por un humedal inundado", caption: "Rumbo al humedal en temporada de lluvias" },
    ],
  },
  {
    id: "bioscanner",
    title: "BioScanner en manos del territorio",
    text: "En los talleres de BioScanner, monitores, guardaparques y equipos de áreas protegidas suben sus fotos, revisan lo que propone la IA y validan cada especie. Lo que antes tomaba de tres a cinco días de trabajo ahora se resuelve en minutos u horas.",
    photos: [
      { src: C("taller-bs"), alt: "Monitor sonriente en un taller de BioScanner con laptops", caption: "Taller de BioScanner" },
      { src: C("taller-bs-e"), alt: "Participantes chocan las manos al final de un taller", caption: "Cierre de un taller" },
      { src: C("taller-bs-b"), alt: "Dos participantes revisan resultados en una laptop", caption: "Revisando detecciones" },
      { src: C("taller-bs-d"), alt: "Facilitador explica frente a un grupo con laptops", caption: "Sesión de práctica" },
      { src: C("taller-bs-f"), alt: "Participante recibe un kit al terminar el taller", caption: "Entrega de kits" },
    ],
  },
  {
    id: "festival",
    title: "Festival del Jaguar Chac Mool",
    text: "En 2025, Dzilam de Bravo celebró su primer Festival del Jaguar: realidad virtual, juegos, charlas y fotos de las cámaras para acercar la reserva y el jaguar a la gente. Los monitores recibieron un reconocimiento por su trabajo.",
    photos: [
      { src: C("festival-grupo"), alt: "Grupo numeroso frente al mural del Festival del Jaguar", caption: "¡Chac Mool!" },
      { src: C("festival-vr"), alt: "Una niña prueba lentes de realidad virtual acompañada por monitores", caption: "La reserva en realidad virtual" },
      { src: C("festival-premios"), alt: "Monitores reciben reconocimientos de madera con huellas de jaguar", caption: "Reconocimiento a los monitores" },
      { src: C("festival-publico"), alt: "Público del festival con un micrófono", caption: "La comunidad pregunta y comparte" },
      { src: C("festival-benja"), alt: "Benjamín Campos sonríe frente a una computadora", caption: "Benja Campos muestra los registros" },
    ],
  },
  {
    id: "comunidad",
    title: "Talleres y escuelas",
    text: "El proyecto también se cuenta en las escuelas, en talleres con familias y en salidas de campo con estudiantes de ingeniería, para que más personas conozcan lo que vive en su territorio.",
    photos: [
      { src: C("taller-comunidad"), alt: "Familias, monitores y equipo reunidos en una palapa", caption: "Taller con familias en Dzilam de Bravo" },
      { src: C("taller-jovenes"), alt: "Jóvenes y adultos en círculo durante un taller bajo una palapa", caption: "Taller sobre áreas protegidas" },
      { src: C("capacitacion-acustica"), alt: "Monitores aprenden a usar una grabadora acústica", caption: "Capacitación con grabadoras acústicas" },
      { src: C("salida-upy"), alt: "Estudiantes de la UPY escuchan a un guía en campo", caption: "Salida de campo con estudiantes de la UPY" },
      { src: C("festival-familias"), alt: "Familias participan en actividades del Festival del Jaguar", caption: "Familias en el Festival del Jaguar" },
    ],
  },
];

// ---------------------------------------------------------------------------
// Protagonistas

export type Spotlight = { name: string; role: string; photo: string; quote?: string; source?: string };

export const SPOTLIGHT_INTRO =
  "Tech4Nature México existe porque hay personas que conocen el monte, lo cuidan y decidieron demostrar lo que sabían. Estas son algunas de ellas.";

export const SPOTLIGHT: Spotlight[] = [
  {
    name: "Benjamín «Benja» Campos",
    role: "Monitor fundador, Grupo de Monitoreo Chac Mool",
    photo: E("p-benja"),
  },
  {
    name: "Juan Castillo",
    role: "Monitor fundador, Grupo de Monitoreo Chac Mool",
    photo: E("p-juan"),
  },
  {
    name: "Darwin Sosa",
    role: "Monitor fundador, Grupo de Monitoreo Chac Mool",
    photo: E("p-darwin"),
  },
  {
    name: "Efraín Uicab",
    role: "Monitor, Grupo de Monitoreo Chac Mool",
    photo: E("p-efrain"),
  },
  {
    name: "Mateo Ordóñez",
    role: "Monitor, Grupo de Monitoreo Chac Mool",
    photo: E("p-mateo"),
  },
  {
    name: "Josué Argáez",
    role: "Monitor, Grupo de Monitoreo Chac Mool",
    photo: E("p-josue"),
  },
  {
    name: "Toshio Yokoyama",
    role: "Liderazgo de operaciones de campo y política pública",
    photo: E("p-toshio"),
  },
  {
    name: "Regina Cervera",
    role: "Directora de programas de innovación para la naturaleza, C Minds",
    photo: E("p-regina"),
  },
];


// ---------------------------------------------------------------------------
// ¿Qué es una cámara trampa?

export const CAMERA_TRAP = {
  lead:
    "Una cámara trampa es una cámara resistente al agua que se sujeta a un árbol o un poste y se dispara sola cuando detecta el calor y el movimiento de un animal. Toma fotos o videos de día y, con luz infrarroja, también de noche, sin que nadie esté presente. Así registra animales que casi nunca se dejan ver.",
  photos: [
    { src: C("juan-camara-trampa"), alt: "Juan Castillo junto a una cámara trampa instalada en un árbol de la selva", caption: "Una cámara trampa a la altura del paso de los animales" },
    { src: C("toshio-camara-trampa"), alt: "Toshio Yokoyama sujeta una cámara trampa a un árbol en la selva", caption: "Toshio Yokoyama instala una cámara trampa" },
    { src: C("mateo-baterias"), alt: "Mateo Ordóñez cambia las baterías de una cámara trampa", caption: "Mateo Ordóñez cambia baterías y tarjeta de memoria" },
  ] as GalleryPhoto[],
  how: [
    { title: "Sensor", text: "Detecta la diferencia de calor de un animal en movimiento y activa la cámara en menos de un segundo." },
    { title: "Fotos y video", text: "Guarda ráfagas de fotos o videos cortos con fecha y hora. De noche usa luz infrarroja que los animales casi no perciben." },
    { title: "Autonomía", text: "Con pilas y una tarjeta de memoria puede trabajar semanas o meses. El equipo la visita para cambiar baterías y bajar los archivos." },
  ],
  goodFor: [
    "Saber qué mamíferos medianos y grandes y qué aves de suelo viven en un lugar.",
    "Documentar especies difíciles de ver, nocturnas o escasas, como el jaguar, el ocelote o el pecarí de labios blancos.",
    "Identificar individuos con marcas únicas, como las rosetas del jaguar.",
    "Comparar sitios y temporadas con el mismo esfuerzo de muestreo.",
    "Registrar pasos de fauna, aguadas y encuentros con ganado o cacería.",
  ],
  lessGood: [
    "Aves pequeñas, ranas e insectos: se registran mejor con grabadoras acústicas.",
    "Conteos exactos de animales sin marcas individuales.",
    "Sitios con mucha gente o riesgo de robo, salvo con candado y acuerdo comunitario.",
    "Zonas sin quien pueda visitarlas con regularidad.",
  ],
  tip: "En Dzilam, las cámaras se colocan a la altura de la rodilla, a unos 3 o 4 metros del paso de fauna, y donde los monitores saben que pasan los animales. Cada estación tiene un nombre y una ficha de registro.",
};

/** Fotos que acompañan cada etapa. */
export const STAGE_PHOTOS: Record<string, GalleryPhoto[]> = {
  e1: [
    { src: C("taller-comunidad"), alt: "Familias, monitores y equipo reunidos en una palapa", caption: "Taller con familias y monitores en Dzilam de Bravo" },
    { src: C("equipo-camioneta"), alt: "Equipo en una camioneta antes de salir a campo", caption: "Comunidad, gobierno y C Minds, un mismo equipo" },
  ],
  e2: [
    { src: C("caminata-b"), alt: "Equipo caminando en fila por la selva", caption: "Recorrido hacia las estaciones" },
    { src: C("agua"), alt: "Monitores en un humedal inundado", caption: "En lluvias, el camino es de agua" },
  ],
  e3: [
    { src: C("taller-bs"), alt: "Taller de BioScanner con monitores", caption: "Taller de BioScanner" },
    { src: C("festival-benja"), alt: "Benjamín Campos frente a una computadora", caption: "Benja Campos revisa registros" },
  ],
  e4: [
    { src: C("agua-b"), alt: "Monitores en un humedal", caption: "Humedales que conectan Dzilam con Ría Lagartos" },
    { src: C("humedal"), alt: "Humedal con tule y manglar", caption: "Tule y manglar en la costa norte de Yucatán" },
  ],
  e5: [
    { src: C("festival-premios"), alt: "Monitores reciben reconocimientos en el festival", caption: "Reconocimiento a los monitores en el Festival del Jaguar" },
    { src: C("festival-grupo-b"), alt: "Grupo frente al mural del Festival del Jaguar", caption: "Devolver resultados al territorio" },
  ],
};

/** Fotos para las páginas del marco de referencia. */
export const PAGE_PHOTOS: Record<string, GalleryPhoto[]> = {
  "por-que-importa": [
    { src: C("cruce-humedal"), alt: "Equipo cruzando un humedal", caption: "Humedales de la Reserva Estatal de Dzilam" },
    { src: C("atardecer"), alt: "Atardecer sobre la selva", caption: "Atardecer sobre la selva de Dzilam" },
  ],
  biocultural: [
    { src: C("darwin-senala"), alt: "Darwin Sosa señala hacia el monte", caption: "Darwin Sosa muestra por dónde pasa la fauna" },
    { src: C("capacitacion-acustica"), alt: "Monitores revisan una grabadora acústica", caption: "Capacitación con grabadoras acústicas" },
  ],
  soberania: [
    { src: C("taller-jovenes"), alt: "Taller en círculo bajo una palapa", caption: "Conversaciones abiertas con la comunidad" },
    { src: C("festival-publico"), alt: "Público del Festival del Jaguar", caption: "Devolver y compartir resultados" },
  ],
  listaverde: [
    { src: C("daniela-camara-b"), alt: "Daniela Pérez revisa una cámara trampa", caption: "La evidencia de campo alimenta los criterios del Estándar" },
    { src: C("equipo-campo"), alt: "Monitores conversan en campo", caption: "Gestión compartida entre comunidad y autoridad" },
  ],
};

// ---------------------------------------------------------------------------
// Videos

export type Video = { id: string; title: string; channel: string; start?: number };

export const VIDEOS_INTRO =
  "Tech4Nature México también se ha contado en video: desde el lanzamiento en 2022 hasta los primeros registros del jaguar, el camino a la fase 2 y el uso de la IA para acelerar el fototrampeo.";

export const VIDEOS: Video[] = [
  { id: "4cKLMpL_des", title: "Tech4Nature México", channel: "C Minds" },
  { id: "RqBuHwRkdKM", title: "El escurridizo jaguar ha sido captado con Tech4Nature México", channel: "Huawei Latinoamérica" },
  { id: "H_06ybOH_Co", title: "Tech4Nature México: creando un corredor biológico de los jaguares", channel: "Huawei Latinoamérica" },
  { id: "9UAdhdnhdLw", title: "De días a minutos: así está cambiando la IA el fototrampeo en México", channel: "C Minds" },
  { id: "w0x76cR111o", title: "The road to Tech4Nature Mexico's Phase 2", channel: "C Minds", start: 10 },
  { id: "bbjwulJHNN0", title: "How AI Is Helping Save Jaguars Across Latin America (Interview with Tech4Nature Mexico)", channel: "Paris Peace Forum" },
  { id: "TilMnT73Oh4", title: "Tech4Nature México: evento de lanzamiento", channel: "Huawei Latinoamérica", start: 2173 },
];
