import type { Locale } from "@/i18n/config";

export const copy = {
  en: {
    header: {
      title: "Code of Ethics",
      dateLabel: "Last updated",
      dateValue: "Jun 24, 2026",
    },
    toc: {
      label: "Contents",
      sections: [
        { id: "sec-i",    roman: "I",    title: "Accordance with the Law" },
        { id: "sec-ii",   roman: "II",   title: "Confidentiality & Privacy" },
        { id: "sec-iii",  roman: "III",  title: "Discrimination & Harassment" },
        { id: "sec-iv",   roman: "IV",   title: "Health and Safety" },
        { id: "sec-v",    roman: "V",    title: "Recordkeeping & Integrity" },
        { id: "sec-vi",   roman: "VI",   title: "Professional Behavior" },
        { id: "sec-vii",  roman: "VII",  title: "Fiduciary Duty" },
        { id: "sec-viii", roman: "VIII", title: "C Minds Activities" },
        { id: "sec-ix",   roman: "IX",   title: "Environment" },
        { id: "sec-x",    roman: "X",    title: "Questions & Violations" },
        { id: "sec-xi",   roman: "XI",   title: "Periodic Certification" },
      ],
    },
    body: {
      secI: {
        text: "Employees, partners, and Board members are expected to comply with all applicable legal requirements",
        rest: " and understand the major laws and regulations that apply to their work. If you have any questions about the laws that govern our work, please consult our Office Manager.",
      },
      secII: {
        text: "Plans, projects, and any other information expressed in confidence will not be shared",
        rest: " with anyone outside the relevant parties unless explicitly stated.",
      },
      secIII: {
        p1Strong: "C Minds will not tolerate any kind of discrimination or harassment",
        p1Rest: " among its employees, its partners, or towards the general public.",
        p2: "During your time at C Minds, any comments, actions, or views that we are made aware of will be subject to scrutiny, and appropriate steps will be taken as a consequence of any behavior deemed inappropriate. C Minds will not tolerate any form of discrimination or harassment by collaborators.",
      },
      secIV: {
        p1Strong: "C Minds is committed to providing a clean, safe, and healthy work environment.",
        p1Rest: " Each employee has a responsibility for maintaining a safe and healthy workplace by following safety and health rules and practices and reporting accidents, injuries and unsafe conditions, procedures, or behaviors.",
        p2: "Violence and threatening behaviors are not permitted and any suspicion of such comportment will result in disciplinary measures.",
        p3: "Employees must report to work in a condition to perform their duties, free from the influence of recreational drugs or alcohol.",
      },
      secV: {
        strong: "C Minds' accounts, records, and financial statements must be maintained in appropriate detail,",
        rest: " must properly reflect the organization's transactions and must conform to both applicable law and to the organization's system of internal controls.",
      },
      secVI: {
        intro: "C Minds strictly forbids offering, providing, or accepting, either directly by employees or indirectly through third-parties:",
        list: [
          "Bribes in both government and commercial business;",
          "Facilitating payments to secure or expedite a routine government action by a government official.",
        ],
        outro: "C Minds expects all parties involved to behave in a respectful and professional manner, upholding the C Minds values and positively representing the organization in both appearance and conduct.",
      },
      secVII: {
        strong: "C Minds stakeholders will always act in the best interest of the community",
        rest: " that we are collaborating with and contributing to at the time.",
      },
      secVIII: {
        strong: "C Minds seeks to contribute to an inclusive Fourth Industrial Revolution and improved living conditions of communities,",
        rest: " therefore we only accept projects, articles, events, and other engagements that reflect this belief and fit into our strategy to achieve this objective.",
      },
      secIX: {
        strong: "C Minds stakeholders will take reasonable actions to minimize their carbon footprint",
        rest: " by not relying on paper, recycling when possible, and making smart environmental choices in all areas related to C Minds work and operations.",
      },
      secX: {
        p1: "Employees should speak with the Head of Operations when they have a question about the application of the Code of Conduct or when in doubt about how to properly act in a particular situation.",
        p2Strong: "C Minds will not allow retaliation against an employee or relevant actor for reporting actual or suspected misconduct",
        p2Rest: " by others in good faith. Any reports may be anonymous, however, we encourage adding your names so that we may contact you if any further action is needed. Reports can be made to the Head of Operations, the CEO, and the Board if necessary.",
      },
      secXI: {
        p1Strong: "C Minds leadership will conduct a periodical revision of anti-corruption risk assessment",
        p1Rest: " to identify, assess, and prioritize key compliance risk mitigation or remediation needs.",
        p2Start: "The C Minds Head of Operations will act as Compliance Officer. To report any concerns, you may contact this person at ",
        p2Mid: ". You may also reach out to the CEO, Constanza Gómez Mont, at ",
        p2End: " at any time.",
      },
    },
  },
  es: {
    header: {
      title: "Código de Ética",
      dateLabel: "Última actualización",
      dateValue: "24 jun 2026",
    },
    toc: {
      label: "Contenido",
      sections: [
        { id: "sec-i",    roman: "I",    title: "Cumplimiento de la Ley" },
        { id: "sec-ii",   roman: "II",   title: "Confidencialidad y Privacidad" },
        { id: "sec-iii",  roman: "III",  title: "Discriminación y Acoso" },
        { id: "sec-iv",   roman: "IV",   title: "Salud y Seguridad" },
        { id: "sec-v",    roman: "V",    title: "Registros e Integridad" },
        { id: "sec-vi",   roman: "VI",   title: "Comportamiento Profesional" },
        { id: "sec-vii",  roman: "VII",  title: "Deber Fiduciario" },
        { id: "sec-viii", roman: "VIII", title: "Actividades de C Minds" },
        { id: "sec-ix",   roman: "IX",   title: "Medio Ambiente" },
        { id: "sec-x",    roman: "X",    title: "Dudas e Infracciones" },
        { id: "sec-xi",   roman: "XI",   title: "Certificación Periódica" },
      ],
    },
    body: {
      secI: {
        text: "Se espera que colaboradores, socios y miembros del Consejo cumplan con todos los requisitos legales aplicables",
        rest: " y comprendan las principales leyes y regulaciones que rigen su trabajo. Si tienes alguna duda sobre las leyes que rigen nuestro trabajo, consulta a nuestra Gerencia de Oficina.",
      },
      secII: {
        text: "Los planes, proyectos y cualquier otra información compartida en confianza no se divulgarán",
        rest: " a nadie fuera de las partes relevantes, salvo que se indique explícitamente lo contrario.",
      },
      secIII: {
        p1Strong: "C Minds no tolerará ningún tipo de discriminación o acoso",
        p1Rest: " entre sus colaboradores, sus socios, o hacia el público en general.",
        p2: "Durante tu tiempo en C Minds, cualquier comentario, acción o postura de la que tengamos conocimiento será objeto de revisión, y se tomarán las medidas correspondientes ante cualquier comportamiento considerado inapropiado. C Minds no tolerará ninguna forma de discriminación o acoso por parte de sus colaboradores.",
      },
      secIV: {
        p1Strong: "C Minds se compromete a ofrecer un entorno de trabajo limpio, seguro y saludable.",
        p1Rest: " Cada colaborador es responsable de mantener un lugar de trabajo seguro y saludable, siguiendo las reglas y prácticas de seguridad y salud, y reportando accidentes, lesiones y condiciones, procedimientos o comportamientos inseguros.",
        p2: "No se permiten comportamientos violentos ni amenazantes, y cualquier sospecha de esta conducta dará lugar a medidas disciplinarias.",
        p3: "Los colaboradores deben presentarse a trabajar en condiciones de desempeñar sus funciones, libres de la influencia de drogas recreativas o alcohol.",
      },
      secV: {
        strong: "Las cuentas, registros y estados financieros de C Minds deben mantenerse con el detalle adecuado,",
        rest: " deben reflejar correctamente las operaciones de la organización y deben ajustarse tanto a la ley aplicable como al sistema de controles internos de la organización.",
      },
      secVI: {
        intro: "C Minds prohíbe estrictamente ofrecer, otorgar o aceptar, ya sea directamente por colaboradores o indirectamente a través de terceros:",
        list: [
          "Sobornos, tanto en el ámbito gubernamental como comercial;",
          "Pagos de facilitación para asegurar o agilizar un trámite gubernamental de rutina por parte de un funcionario público.",
        ],
        outro: "C Minds espera que todas las partes involucradas se comporten de manera respetuosa y profesional, respetando los valores de C Minds y representando a la organización de forma positiva tanto en su presentación como en su conducta.",
      },
      secVII: {
        strong: "Los actores de C Minds siempre actuarán en el mejor interés de la comunidad",
        rest: " con la que estamos colaborando y a la que estamos contribuyendo en cada momento.",
      },
      secVIII: {
        strong: "C Minds busca contribuir a una Cuarta Revolución Industrial incluyente y a mejorar las condiciones de vida de las comunidades,",
        rest: " por lo que solo aceptamos proyectos, artículos, eventos y otras colaboraciones que reflejen esta convicción y encajen en nuestra estrategia para lograr este objetivo.",
      },
      secIX: {
        strong: "Los actores de C Minds tomarán acciones razonables para minimizar su huella de carbono,",
        rest: " reduciendo el uso de papel, reciclando cuando sea posible y tomando decisiones ambientalmente responsables en todas las áreas relacionadas con el trabajo y las operaciones de C Minds.",
      },
      secX: {
        p1: "Los colaboradores deben acudir a la Jefatura de Operaciones cuando tengan alguna duda sobre la aplicación del Código de Conducta o cuando no sepan cómo actuar correctamente ante una situación en particular.",
        p2Strong: "C Minds no permitirá represalias contra un colaborador o actor relevante por reportar, de buena fe, una conducta indebida real o sospechada",
        p2Rest: " por parte de otros. Los reportes pueden ser anónimos; sin embargo, te invitamos a incluir tu nombre para poder contactarte en caso de requerirse alguna acción adicional. Los reportes pueden hacerse a la Jefatura de Operaciones, a la Dirección General y, de ser necesario, al Consejo.",
      },
      secXI: {
        p1Strong: "La dirección de C Minds llevará a cabo una revisión periódica de la evaluación de riesgos de anticorrupción",
        p1Rest: " para identificar, evaluar y priorizar las necesidades clave de mitigación o remediación de riesgos de cumplimiento.",
        p2Start: "La Jefatura de Operaciones de C Minds actuará como Oficial de Cumplimiento. Para reportar cualquier inquietud, puedes contactar a esta persona en ",
        p2Mid: ". También puedes contactar a la Directora General, Constanza Gómez Mont, en ",
        p2End: " en cualquier momento.",
      },
    },
  },
} satisfies Record<Locale, unknown>;

export type EthicsCopy = (typeof copy)["en"];
