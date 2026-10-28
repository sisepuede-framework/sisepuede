// SISEPUEDE Learning Course — bilingual content for all modules.
// All HTML strings use double-quotes; template literals are reserved for interpolation only.

window.COURSE_DATA = {
  tracks: {
    en: {
      foundations: "Foundations",
      data: "Variables & Data",
      sectors: "Sector Models",
      policy: "Policy & Strategies",
      experiments: "Experiments & RDM"
    },
    es: {
      foundations: "Fundamentos",
      data: "Variables y Datos",
      sectors: "Modelos Sectoriales",
      policy: "Políticas y Estrategias",
      experiments: "Experimentos y RDM"
    }
  },

  glossary: {
    en: [
      { term: "SISEPUEDE", def: "SImulating SEctoral Pathways and Uncertainty Exploration for DEcarbonization — a Python/Julia integrated modelling framework for exploratory decarbonisation analysis." },
      { term: "DAG", def: "Directed Acyclic Graph — SISEPUEDE's integration diagram that passes outputs between subsectors in a strict acyclic order." },
      { term: "AFOLU", def: "Agriculture, Forestry and Other Land Use — one of the four IPCC emission sectors, modelled in SISEPUEDE through six subsectors (AGRC, FRST, LNDU, LVST, LSMM, SOIL)." },
      { term: "IPPU", def: "Industrial Processes and Product Use — IPCC sector covering non-energy industrial emissions, including HFCs/PFCs/FCs, cement clinker, etc." },
      { term: "NemoMod", def: "Open-source energy optimisation framework (Julia, SEI) that SISEPUEDE wraps to simulate electricity generation and fuel production (ENTC + ENST)." },
      { term: "LHS", def: "Latin Hypercube Sampling — stratified random sampling that SISEPUEDE uses to explore the Xs (exogenous uncertainties) and LEs (lever effects) jointly." },
      { term: "XLRM", def: "Lempert-Popper-Bankes robust decision-making framework: X = exogenous uncertainties, L = levers, R = relationships (models), M = metrics." },
      { term: "Transformer", def: "Pre-defined Python callable that modifies baseline trajectories to achieve a specific outcome (e.g. TX:AGRC_INC_CONSERVATION_AGRICULTURE)." },
      { term: "Transformation", def: "A YAML-parameterised instance of a Transformer with a specific magnitude, categories and implementation ramp." },
      { term: "Strategy", def: "A named collection of Transformations identified by strategy_id — can combine levers across sectors." },
      { term: "LURF", def: "Land Use Reallocation Factor (η) — fraction of unmet demand that is resolved by reallocating pasture/cropland rather than by net imports." },
      { term: "Simplex group", def: "Attribute marker that signals a set of variable fields that must sum to 1 (e.g. land-use fractions, fuel-mix fractions)." },
      { term: "Metavariable", def: "Placeholder token (e.g. $CAT-AGRICULTURE$, $UNIT-MASS$, $EMISSION-GAS$) used to build input variable field names." },
      { term: "Primary key", def: "Unique id per model run, built from the product of design_id, future_id, strategy_id and (optionally) time_series_id." },
      { term: "Analysis ID", def: "Unique identifier that scopes a SISEPUEDE output database so a session can be reproduced or extended." },
      { term: "RDM", def: "Robust Decision Making — the uncertainty-first approach SISEPUEDE operationalises via dimensions of analysis and LHS." }
    ],
    es: [
      { term: "SISEPUEDE", def: "SImulación de SEndas sectoriales y Exploración de incertidumbres para la DEscarbonización — marco integrado Python/Julia para análisis exploratorio de descarbonización." },
      { term: "DAG", def: "Grafo Dirigido Acíclico — diagrama de integración de SISEPUEDE que transmite salidas entre subsectores en orden acíclico estricto." },
      { term: "AFOLU", def: "Agricultura, Silvicultura y Otros Usos del Suelo — uno de los cuatro sectores de emisiones del IPCC, modelado en SISEPUEDE mediante seis subsectores (AGRC, FRST, LNDU, LVST, LSMM, SOIL)." },
      { term: "IPPU", def: "Procesos Industriales y Uso de Productos — sector del IPCC que cubre emisiones industriales no energéticas (HFC/PFC/FC, clínker de cemento, etc.)." },
      { term: "NemoMod", def: "Marco de optimización energética open-source (Julia, SEI) que SISEPUEDE envuelve para simular generación eléctrica y producción de combustibles (ENTC + ENST)." },
      { term: "LHS", def: "Muestreo por Hipercubo Latino — muestreo aleatorio estratificado que SISEPUEDE utiliza para explorar conjuntamente las X (incertidumbres exógenas) y las LE (efectos de palanca)." },
      { term: "XLRM", def: "Marco de toma de decisiones robusta de Lempert-Popper-Bankes: X = incertidumbres exógenas, L = palancas, R = relaciones (modelos), M = métricas." },
      { term: "Transformer", def: "Clase callable predefinida en Python que modifica trayectorias base para alcanzar un resultado (p. ej. TX:AGRC_INC_CONSERVATION_AGRICULTURE)." },
      { term: "Transformación", def: "Instancia parametrizada en YAML de un Transformer con una magnitud, categorías y rampa de implementación concretas." },
      { term: "Estrategia", def: "Colección nombrada de Transformaciones identificada por strategy_id — puede combinar palancas de distintos sectores." },
      { term: "LURF", def: "Factor de Realocación de Uso del Suelo (η) — fracción de la demanda insatisfecha que se resuelve realocando pastos/cultivos en vez de con importaciones netas." },
      { term: "Grupo simplex", def: "Marcador que indica un conjunto de campos variables que deben sumar 1 (p. ej. fracciones de uso del suelo o mezcla de combustibles)." },
      { term: "Metavariable", def: "Token placeholder (p. ej. $CAT-AGRICULTURE$, $UNIT-MASS$, $EMISSION-GAS$) usado para componer los nombres de los campos de variables de entrada." },
      { term: "Clave primaria", def: "Identificador único por corrida del modelo, construido a partir del producto de design_id, future_id, strategy_id y (opcional) time_series_id." },
      { term: "Analysis ID", def: "Identificador único que delimita una base de datos de salida de SISEPUEDE de modo que una sesión pueda reproducirse o extenderse." },
      { term: "RDM", def: "Robust Decision Making — enfoque centrado en la incertidumbre que SISEPUEDE operacionaliza mediante las dimensiones de análisis y LHS." }
    ]
  },

  modules: [
    // ─────────────────────────────── 01 ───────────────────────────────
    {
      id: "intro",
      track: "foundations",
      duration: 20,
      title: {
        en: "Welcome to SISEPUEDE",
        es: "Bienvenida a SISEPUEDE"
      },
      summary: {
        en: "What SISEPUEDE is, what problem it solves, and the IPCC foundations that underpin the whole framework.",
        es: "Qué es SISEPUEDE, qué problema resuelve y los fundamentos IPCC sobre los que se apoya todo el marco."
      },
      content: {
        en: `
          <h2>What is SISEPUEDE?</h2>
          <p><strong>SISEPUEDE</strong> stands for <strong>SI</strong>mulating <strong>SE</strong>ctoral <strong>P</strong>athways and <strong>U</strong>ncertainty <strong>E</strong>xploration for <strong>DE</strong>carbonization. It is an open-source integrated modelling framework, written mostly in Python with Julia components, that lets analysts explore how an economy can decarbonise under deep uncertainty.</p>
          <p>Think of it as the glue between two worlds that rarely talk to each other:</p>
          <ul>
            <li>The <strong>bottom-up IPCC accounting world</strong>, where emissions are tallied gas-by-gas and sector-by-sector following the 2006 Guidelines and their 2019 Refinement.</li>
            <li>The <strong>robust decision-making world</strong>, where thousands of plausible futures are sampled to find policies that behave well across many scenarios.</li>
          </ul>

          <h2>Why does it exist?</h2>
          <p>Most national emission inventories give you a snapshot of the past. Most integrated assessment models give you a smooth future trajectory for a region or the world. Neither tells a policymaker: <em>"what happens if we electrify light-duty transport while also expanding silvopasture, under five different population projections, three fertiliser cost futures and two assumptions about rice yield?"</em></p>
          <p>SISEPUEDE answers that question. It combines:</p>
          <ol>
            <li><strong>Integrated yet separable sectoral models</strong> aligned with IPCC guidance.</li>
            <li>An <strong>uncertainty specification and trajectory sampling</strong> mechanism (Latin Hypercube).</li>
            <li>A <strong>data pipeline management system</strong> based on attribute tables and templates.</li>
            <li>A <strong>scalable architecture</strong> that can run thousands of futures across hundreds of regions.</li>
            <li>A <strong>customizable variable setup</strong> via sector-level categorisation (metavariables).</li>
          </ol>

          <h2>The IPCC foundations</h2>
          <p>SISEPUEDE is a compartmentalised, sector-based emissions model based primarily on two publications:</p>
          <ul>
            <li><a href="https://www.ipcc-nggip.iges.or.jp/public/2006gl/index.html" target="_blank" rel="noopener">2006 IPCC Guidelines for National Greenhouse Gas Inventories</a></li>
            <li><a href="https://www.ipcc-nggip.iges.or.jp/public/2019rf/index.html" target="_blank" rel="noopener">2019 Refinement to the 2006 IPCC Guidelines</a></li>
          </ul>
          <p>Throughout the attribute tables you will see citations like <code>V5, C6 IPCC GNGHGI</code> — <strong>V##</strong> is the volume, <strong>C##</strong> is the chapter. The example refers to Volume 5, Chapter 6 (Wastewater Treatment and Discharge).</p>

          <div class="callout note">
            <strong>IPCC Tier:</strong> SISEPUEDE operates at <strong>Tier 1 or higher</strong>. Tier 1 uses default IPCC emission factors; Tier 2 uses country-specific factors; Tier 3 uses process-level modelling. You can mix tiers depending on data availability.
          </div>

          <h2>The five sectors at a glance</h2>
          <p>SISEPUEDE organises every variable, equation and output around five sectors — four of which emit, one of which drives:</p>
          <table>
            <thead><tr><th>Sector</th><th>Code</th><th>Role</th></tr></thead>
            <tbody>
              <tr><td>Agriculture, Forestry &amp; Land Use</td><td>AFOLU</td><td>Emits (6 subsectors)</td></tr>
              <tr><td>Circular Economy</td><td>CE</td><td>Emits (3 subsectors)</td></tr>
              <tr><td>Energy</td><td>EN</td><td>Emits (9 subsectors)</td></tr>
              <tr><td>Industrial Processes &amp; Product Use</td><td>IPPU</td><td>Emits (1 subsector)</td></tr>
              <tr><td>Socioeconomic</td><td>SE</td><td>Drives, does not emit directly</td></tr>
            </tbody>
          </table>

          <h2>Who is this course for?</h2>
          <p>This course is designed for climate analysts, policy teams, researchers and graduate students who want to <em>understand</em> SISEPUEDE deeply enough to <em>use</em> it. We will not just skim the manual — we will unpack every concept the official documentation presents, add diagrams and worked examples, and keep the content bilingual (English/Spanish).</p>

          <h3>Prerequisites</h3>
          <ul>
            <li>Basic Python (you can read a <code>pandas</code> DataFrame).</li>
            <li>Comfort with environmental or climate concepts (CO₂e, GWP, inventories).</li>
            <li>No prior IPCC knowledge required — we introduce what you need.</li>
          </ul>

          <h2>How this course is organised</h2>
          <p>Twelve modules, five tracks. Each module maps roughly 1:1 to a section of the official docs at <a href="https://sisepuede.readthedocs.io/en/latest/" target="_blank" rel="noopener">sisepuede.readthedocs.io</a>:</p>
          <ol>
            <li><strong>Foundations</strong> — intro, DAG, install, config.</li>
            <li><strong>Variables &amp; Data</strong> — general data (gases, regions, units), schemas.</li>
            <li><strong>Sector Models</strong> — AFOLU, Circular Economy, Energy, IPPU, Socioeconomic.</li>
            <li><strong>Policy &amp; Strategies</strong> — transformers, transformations, strategies.</li>
            <li><strong>Experiments &amp; RDM</strong> — dimensions of analysis, LHS, database, maths.</li>
          </ol>

          <div class="callout math">
            <strong>What you will take away:</strong> By module 12 you should be able to explain the DAG to a colleague, read any attribute table, author a transformation YAML, and interpret a MODEL_OUTPUT row.
          </div>
        `,
        es: `
          <h2>¿Qué es SISEPUEDE?</h2>
          <p><strong>SISEPUEDE</strong> significa <strong>SI</strong>mulación de <strong>SE</strong>ndas sectoriales y <strong>P</strong>athways con <strong>U</strong>ncertainty <strong>E</strong>xploration para la <strong>DE</strong>scarbonización. Es un marco de modelado integrado de código abierto, escrito principalmente en Python con componentes en Julia, que permite explorar cómo una economía puede descarbonizarse bajo incertidumbre profunda.</p>
          <p>Piénsalo como el pegamento entre dos mundos que casi nunca se hablan:</p>
          <ul>
            <li>El <strong>mundo contable bottom-up del IPCC</strong>, donde las emisiones se contabilizan gas por gas y sector por sector siguiendo las Directrices de 2006 y su Refinamiento 2019.</li>
            <li>El <strong>mundo de la toma de decisiones robusta</strong>, donde se muestrean miles de futuros plausibles para encontrar políticas que se comporten bien en muchos escenarios.</li>
          </ul>

          <h2>¿Por qué existe?</h2>
          <p>La mayoría de los inventarios nacionales dan una fotografía del pasado. La mayoría de los modelos de evaluación integrada dan una trayectoria futura suave para una región o el mundo. Ninguno le dice a un tomador de decisiones: <em>"¿qué pasa si electrificamos el transporte ligero mientras expandimos la silvopasturicultura, bajo cinco proyecciones de población, tres futuros de costo de fertilizantes y dos supuestos sobre rendimiento de arroz?"</em></p>
          <p>SISEPUEDE responde esa pregunta. Combina:</p>
          <ol>
            <li><strong>Modelos sectoriales integrados pero separables</strong> alineados con las directrices del IPCC.</li>
            <li>Un mecanismo de <strong>especificación de incertidumbre y muestreo de trayectorias</strong> (Hipercubo Latino).</li>
            <li>Un <strong>sistema de pipeline de datos</strong> basado en tablas de atributos y plantillas.</li>
            <li>Una <strong>arquitectura escalable</strong> capaz de correr miles de futuros en cientos de regiones.</li>
            <li>Una <strong>configuración de variables personalizable</strong> mediante categorización a nivel sectorial (metavariables).</li>
          </ol>

          <h2>Los fundamentos IPCC</h2>
          <p>SISEPUEDE es un modelo de emisiones compartimentado y sectorial, basado principalmente en dos publicaciones:</p>
          <ul>
            <li><a href="https://www.ipcc-nggip.iges.or.jp/public/2006gl/index.html" target="_blank" rel="noopener">Directrices del IPCC 2006 para los Inventarios Nacionales de GEI</a></li>
            <li><a href="https://www.ipcc-nggip.iges.or.jp/public/2019rf/index.html" target="_blank" rel="noopener">Refinamiento 2019 a las Directrices del IPCC 2006</a></li>
          </ul>
          <p>En las tablas de atributos verás citas tipo <code>V5, C6 IPCC GNGHGI</code> — <strong>V##</strong> es el volumen y <strong>C##</strong> el capítulo. El ejemplo refiere al Volumen 5, Capítulo 6 (Tratamiento y Descarga de Aguas Residuales).</p>

          <div class="callout note">
            <strong>Nivel IPCC (Tier):</strong> SISEPUEDE opera en <strong>Tier 1 o superior</strong>. Tier 1 usa factores de emisión por defecto del IPCC; Tier 2 usa factores específicos del país; Tier 3 implica modelado a nivel de proceso. Puedes mezclar niveles según la disponibilidad de datos.
          </div>

          <h2>Los cinco sectores de un vistazo</h2>
          <p>SISEPUEDE organiza cada variable, ecuación y salida en torno a cinco sectores — cuatro emisores y uno impulsor:</p>
          <table>
            <thead><tr><th>Sector</th><th>Código</th><th>Rol</th></tr></thead>
            <tbody>
              <tr><td>Agricultura, Silvicultura y Uso del Suelo</td><td>AFOLU</td><td>Emite (6 subsectores)</td></tr>
              <tr><td>Economía Circular</td><td>CE</td><td>Emite (3 subsectores)</td></tr>
              <tr><td>Energía</td><td>EN</td><td>Emite (9 subsectores)</td></tr>
              <tr><td>Procesos Industriales y Uso de Productos</td><td>IPPU</td><td>Emite (1 subsector)</td></tr>
              <tr><td>Socioeconómico</td><td>SE</td><td>Impulsa, no emite directamente</td></tr>
            </tbody>
          </table>

          <h2>¿Para quién es este curso?</h2>
          <p>Este curso está diseñado para analistas climáticos, equipos de política pública, investigadores y estudiantes de posgrado que quieran <em>comprender</em> SISEPUEDE con la profundidad suficiente para <em>usarlo</em>. No vamos a hojear el manual — vamos a desmenuzar cada concepto que la documentación oficial presenta, añadir diagramas y ejemplos prácticos, y mantener el contenido bilingüe (inglés/español).</p>

          <h3>Prerrequisitos</h3>
          <ul>
            <li>Python básico (puedes leer un DataFrame de <code>pandas</code>).</li>
            <li>Familiaridad con conceptos ambientales/climáticos (CO₂e, GWP, inventarios).</li>
            <li>No se requiere conocimiento previo del IPCC — introducimos lo necesario.</li>
          </ul>

          <h2>Cómo está organizado el curso</h2>
          <p>Doce módulos, cinco rutas. Cada módulo mapea aproximadamente 1:1 a una sección de la documentación oficial en <a href="https://sisepuede.readthedocs.io/en/latest/" target="_blank" rel="noopener">sisepuede.readthedocs.io</a>:</p>
          <ol>
            <li><strong>Fundamentos</strong> — intro, DAG, instalación, configuración.</li>
            <li><strong>Variables y Datos</strong> — datos generales (gases, regiones, unidades), esquemas.</li>
            <li><strong>Modelos Sectoriales</strong> — AFOLU, Economía Circular, Energía, IPPU, Socioeconómico.</li>
            <li><strong>Políticas y Estrategias</strong> — transformers, transformaciones, estrategias.</li>
            <li><strong>Experimentos y RDM</strong> — dimensiones de análisis, LHS, base de datos, matemáticas.</li>
          </ol>

          <div class="callout math">
            <strong>Lo que te llevarás:</strong> Al terminar el módulo 12 deberías poder explicar el DAG a un colega, leer cualquier tabla de atributos, escribir un YAML de transformación e interpretar una fila de MODEL_OUTPUT.
          </div>
        `
      }
    },

    // ─────────────────────────────── 02 ───────────────────────────────
    {
      id: "concept-dag",
      track: "foundations",
      duration: 25,
      title: {
        en: "The SISEPUEDE Concept & DAG",
        es: "Concepto SISEPUEDE y el DAG"
      },
      summary: {
        en: "The directed acyclic graph that integrates all subsectors — the mental model you need to interpret everything else.",
        es: "El grafo dirigido acíclico que integra todos los subsectores — el modelo mental necesario para interpretar todo lo demás."
      },
      content: {
        en: `
          <h2>Why a DAG?</h2>
          <p>SISEPUEDE could have been a monolithic model or a loosely-coupled set of Excel sheets. Instead, the team chose a <strong>Directed Acyclic Graph (DAG)</strong>. In a DAG every subsector is a node, and every edge is "output of A becomes input of B". <em>Acyclic</em> means there are no feedback loops at the subsector level: once you execute subsectors in the right order, every downstream model has every input it needs.</p>

          <figure>
            <img src="assets/img/sisepuede_dag_color.png" alt="SISEPUEDE DAG">
            <figcaption>The full SISEPUEDE DAG. Colours encode the owning sector.</figcaption>
          </figure>

          <h2>What travels along the edges?</h2>
          <p>The DAG passes <em>physical and economic quantities</em>, not just numbers. For example:</p>
          <ul>
            <li><strong>LVST → LSMM</strong>: head counts of each animal class flow into manure management to compute methane and nitrogen flows.</li>
            <li><strong>LSMM → SOIL</strong>: nitrogen available from manure modifies the demand for synthetic fertiliser.</li>
            <li><strong>WASO → IPPU</strong>: recycled material volumes reduce virgin production demand.</li>
            <li><strong>IPPU + TRDE → INEN / ENTC</strong>: industrial production and transport demand drive fuel consumption and electricity demand, which then feed NemoMod.</li>
            <li><strong>LSMM → ENTC</strong>: biogas captured from anaerobic digestion becomes a fuel for electricity generation.</li>
          </ul>

          <h2>Reading the DAG left-to-right</h2>
          <p>A pragmatic way to internalise the DAG is to walk it in execution order:</p>
          <ol>
            <li><strong>Socioeconomic</strong> runs first (population, GDP, GDP/capita are purely exogenous).</li>
            <li><strong>AFOLU</strong> runs next — Agriculture, Livestock and Land Use are interleaved by the Markov-chain land use model.</li>
            <li><strong>LSMM &amp; SOIL</strong> close the AFOLU loop using LVST and LNDU outputs.</li>
            <li><strong>Circular Economy</strong> (WALI → TRWW, WASO) consumes socioeconomic drivers and some AFOLU outputs (food-waste composition).</li>
            <li><strong>IPPU</strong> computes industrial production and process emissions.</li>
            <li><strong>Energy Consumption</strong> (INEN, SCOE, TRNS, TRDE, CCSQ, FGTV) uses production, GDP, transport demand to compute fuel use.</li>
            <li><strong>Energy Production</strong> (ENTC + ENST via NemoMod) closes the system: fuel demand becomes electricity + fuel production.</li>
          </ol>

          <div class="callout note">
            <strong>Non-emission subsectors</strong> (TRDE, WALI, ENFU, ENST, ECON, GNRL) exist purely to carry drivers or structural data between emission subsectors. You will see them in the DAG but they contribute zero emissions on their own.
          </div>

          <h2>The 21 subsectors</h2>
          <p>Here is the full list that the <code>attribute_subsector.csv</code> file enumerates:</p>
          <table>
            <thead><tr><th>Sector</th><th>Subsector</th><th>Code</th><th>Emits?</th></tr></thead>
            <tbody>
              <tr><td>AFOLU</td><td>Agriculture</td><td>agrc</td><td>Yes</td></tr>
              <tr><td>AFOLU</td><td>Forest</td><td>frst</td><td>Yes</td></tr>
              <tr><td>AFOLU</td><td>Land Use</td><td>lndu</td><td>Yes</td></tr>
              <tr><td>AFOLU</td><td>Livestock</td><td>lvst</td><td>Yes</td></tr>
              <tr><td>AFOLU</td><td>Livestock Manure Management</td><td>lsmm</td><td>Yes</td></tr>
              <tr><td>AFOLU</td><td>Soil Management</td><td>soil</td><td>Yes</td></tr>
              <tr><td>Circular Economy</td><td>Liquid Waste</td><td>wali</td><td>No (driver)</td></tr>
              <tr><td>Circular Economy</td><td>Solid Waste</td><td>waso</td><td>Yes</td></tr>
              <tr><td>Circular Economy</td><td>Wastewater Treatment</td><td>trww</td><td>Yes</td></tr>
              <tr><td>Energy</td><td>Carbon Capture &amp; Sequestration</td><td>ccsq</td><td>Yes (negative)</td></tr>
              <tr><td>Energy</td><td>Energy Fuels</td><td>enfu</td><td>No (reference)</td></tr>
              <tr><td>Energy</td><td>Energy Storage</td><td>enst</td><td>No (reference)</td></tr>
              <tr><td>Energy</td><td>Energy Technology</td><td>entc</td><td>Yes</td></tr>
              <tr><td>Energy</td><td>Fugitive Emissions</td><td>fgtv</td><td>Yes</td></tr>
              <tr><td>Energy</td><td>Industrial Energy</td><td>inen</td><td>Yes</td></tr>
              <tr><td>Energy</td><td>Stationary Combustion &amp; Other</td><td>scoe</td><td>Yes</td></tr>
              <tr><td>Energy</td><td>Transportation</td><td>trns</td><td>Yes</td></tr>
              <tr><td>Energy</td><td>Transportation Demand</td><td>trde</td><td>No (driver)</td></tr>
              <tr><td>IPPU</td><td>IPPU</td><td>ippu</td><td>Yes</td></tr>
              <tr><td>Socioeconomic</td><td>Economy</td><td>econ</td><td>No (driver)</td></tr>
              <tr><td>Socioeconomic</td><td>General</td><td>gnrl</td><td>No (driver)</td></tr>
            </tbody>
          </table>

          <h2>Why "acyclic"?</h2>
          <p>Suppose IPPU production depended on INEN emissions, and INEN emissions depended on IPPU production — you would need to iterate until the system converges, which is expensive and introduces numerical fragility. By breaking the loop (industrial production is computed <em>first</em>, then energy use is derived from it, not the other way around), SISEPUEDE guarantees a single pass and reproducible results.</p>

          <div class="callout warn">
            <strong>Known trade-off:</strong> the DAG hard-codes some directions. The docs mention that <em>demand for harvested wood products in AFOLU is based on industrial demands that are not adjusted for recycling</em>; a future SISEPUEDE 2.0 is planned to lift this limitation.
          </div>

          <h2>What this means for you</h2>
          <p>When you add a transformation or inspect an output, trace the edges backwards: "my ENTC output depends on fuel demand from INEN, SCOE, TRNS and CCSQ; those depend on production (IPPU), transport demand (TRDE) and socioeconomic drivers." Mastering the DAG mentally shortcuts almost every debugging session.</p>
        `,
        es: `
          <h2>¿Por qué un DAG?</h2>
          <p>SISEPUEDE pudo haber sido un modelo monolítico o un conjunto suelto de hojas de Excel. En su lugar, el equipo eligió un <strong>Grafo Dirigido Acíclico (DAG)</strong>. En un DAG cada subsector es un nodo y cada arista significa "la salida de A es entrada de B". <em>Acíclico</em> quiere decir que no hay bucles de retroalimentación a nivel de subsector: una vez que ejecutas los subsectores en el orden correcto, cada modelo aguas abajo tiene todas sus entradas.</p>

          <figure>
            <img src="assets/img/sisepuede_dag_color.png" alt="DAG de SISEPUEDE">
            <figcaption>El DAG completo de SISEPUEDE. Los colores codifican el sector responsable.</figcaption>
          </figure>

          <h2>¿Qué viaja por las aristas?</h2>
          <p>El DAG transmite <em>cantidades físicas y económicas</em>, no sólo números. Por ejemplo:</p>
          <ul>
            <li><strong>LVST → LSMM</strong>: los conteos de cabezas por clase animal entran al manejo de estiércol para calcular metano y nitrógeno.</li>
            <li><strong>LSMM → SOIL</strong>: el nitrógeno disponible del estiércol modifica la demanda de fertilizante sintético.</li>
            <li><strong>WASO → IPPU</strong>: el material reciclado reduce la demanda de producción virgen.</li>
            <li><strong>IPPU + TRDE → INEN / ENTC</strong>: la producción industrial y la demanda de transporte impulsan el consumo de combustible y la demanda eléctrica, que luego alimentan NemoMod.</li>
            <li><strong>LSMM → ENTC</strong>: el biogás capturado en digestión anaerobia se convierte en combustible para generación eléctrica.</li>
          </ul>

          <h2>Leer el DAG de izquierda a derecha</h2>
          <p>Una forma pragmática de interiorizar el DAG es recorrerlo en orden de ejecución:</p>
          <ol>
            <li><strong>Socioeconómico</strong> corre primero (población, PIB, PIB/cápita son puramente exógenos).</li>
            <li><strong>AFOLU</strong> sigue — Agricultura, Ganadería y Uso del Suelo se intercalan por el modelo de cadena de Markov del uso del suelo.</li>
            <li><strong>LSMM y SOIL</strong> cierran el bucle AFOLU con las salidas de LVST y LNDU.</li>
            <li><strong>Economía Circular</strong> (WALI → TRWW, WASO) consume drivers socioeconómicos y algunas salidas AFOLU (composición de residuos alimentarios).</li>
            <li><strong>IPPU</strong> calcula producción industrial y emisiones de proceso.</li>
            <li><strong>Consumo de Energía</strong> (INEN, SCOE, TRNS, TRDE, CCSQ, FGTV) usa producción, PIB y demanda de transporte para calcular uso de combustible.</li>
            <li><strong>Producción de Energía</strong> (ENTC + ENST vía NemoMod) cierra el sistema: la demanda de combustible se convierte en producción de electricidad + combustibles.</li>
          </ol>

          <div class="callout note">
            <strong>Los subsectores no emisores</strong> (TRDE, WALI, ENFU, ENST, ECON, GNRL) existen únicamente para transportar drivers o datos estructurales entre subsectores emisores. Los verás en el DAG pero no contribuyen emisiones por sí mismos.
          </div>

          <h2>Los 21 subsectores</h2>
          <p>Esta es la lista completa que enumera <code>attribute_subsector.csv</code>:</p>
          <table>
            <thead><tr><th>Sector</th><th>Subsector</th><th>Código</th><th>¿Emite?</th></tr></thead>
            <tbody>
              <tr><td>AFOLU</td><td>Agricultura</td><td>agrc</td><td>Sí</td></tr>
              <tr><td>AFOLU</td><td>Bosque</td><td>frst</td><td>Sí</td></tr>
              <tr><td>AFOLU</td><td>Uso del Suelo</td><td>lndu</td><td>Sí</td></tr>
              <tr><td>AFOLU</td><td>Ganadería</td><td>lvst</td><td>Sí</td></tr>
              <tr><td>AFOLU</td><td>Gestión de Estiércol</td><td>lsmm</td><td>Sí</td></tr>
              <tr><td>AFOLU</td><td>Manejo de Suelo</td><td>soil</td><td>Sí</td></tr>
              <tr><td>Econ. Circular</td><td>Residuos Líquidos</td><td>wali</td><td>No (driver)</td></tr>
              <tr><td>Econ. Circular</td><td>Residuos Sólidos</td><td>waso</td><td>Sí</td></tr>
              <tr><td>Econ. Circular</td><td>Tratamiento de Aguas</td><td>trww</td><td>Sí</td></tr>
              <tr><td>Energía</td><td>Captura y Secuestro de Carbono</td><td>ccsq</td><td>Sí (negativo)</td></tr>
              <tr><td>Energía</td><td>Combustibles</td><td>enfu</td><td>No (referencia)</td></tr>
              <tr><td>Energía</td><td>Almacenamiento</td><td>enst</td><td>No (referencia)</td></tr>
              <tr><td>Energía</td><td>Tecnología Energética</td><td>entc</td><td>Sí</td></tr>
              <tr><td>Energía</td><td>Emisiones Fugitivas</td><td>fgtv</td><td>Sí</td></tr>
              <tr><td>Energía</td><td>Energía Industrial</td><td>inen</td><td>Sí</td></tr>
              <tr><td>Energía</td><td>Combustión Estacionaria y Otros</td><td>scoe</td><td>Sí</td></tr>
              <tr><td>Energía</td><td>Transporte</td><td>trns</td><td>Sí</td></tr>
              <tr><td>Energía</td><td>Demanda de Transporte</td><td>trde</td><td>No (driver)</td></tr>
              <tr><td>IPPU</td><td>IPPU</td><td>ippu</td><td>Sí</td></tr>
              <tr><td>Socioecon.</td><td>Economía</td><td>econ</td><td>No (driver)</td></tr>
              <tr><td>Socioecon.</td><td>General</td><td>gnrl</td><td>No (driver)</td></tr>
            </tbody>
          </table>

          <h2>¿Por qué "acíclico"?</h2>
          <p>Supón que la producción de IPPU dependiera de las emisiones de INEN y las emisiones de INEN de la producción de IPPU — necesitarías iterar hasta converger, lo que es caro y numéricamente frágil. Al romper el bucle (la producción industrial se calcula <em>primero</em>, y la energía se deriva de ella, no al revés), SISEPUEDE garantiza una sola pasada y resultados reproducibles.</p>

          <div class="callout warn">
            <strong>Trade-off conocido:</strong> el DAG fija algunas direcciones. La documentación señala que <em>la demanda de productos madereros en AFOLU se basa en demandas industriales no ajustadas por reciclaje</em>; se planea un SISEPUEDE 2.0 que levante esta limitación.
          </div>

          <h2>Qué significa esto para ti</h2>
          <p>Cuando añadas una transformación o inspecciones una salida, recorre las aristas hacia atrás: "mi salida ENTC depende de la demanda de combustible de INEN, SCOE, TRNS y CCSQ; esas dependen de la producción (IPPU), la demanda de transporte (TRDE) y los drivers socioeconómicos." Dominar mentalmente el DAG acorta casi cualquier sesión de depuración.</p>
        `
      }
    },

    // ─────────────────────────────── 03 ───────────────────────────────
    {
      id: "install",
      track: "foundations",
      duration: 15,
      title: {
        en: "Installation & Quick Start",
        es: "Instalación e Inicio Rápido"
      },
      summary: {
        en: "Setting up a Python 3.11 environment, installing SISEPUEDE from GitHub, and running your first scenario.",
        es: "Configuración de un entorno Python 3.11, instalación de SISEPUEDE desde GitHub y ejecución del primer escenario."
      },
      content: {
        en: `
          <h2>Prerequisites</h2>
          <ul>
            <li><strong>Python 3.11</strong> (SISEPUEDE pins to this minor version).</li>
            <li><strong>conda</strong> or <strong>micromamba</strong> for environment isolation.</li>
            <li><strong>git</strong> to pull the package from GitHub.</li>
            <li>(Optional, for energy production) <strong>Julia ≥ 1.9</strong> and the <code>NemoMod.jl</code> package.</li>
          </ul>

          <h2>Create a clean environment</h2>
<pre><code class="language-bash">conda create -n sisepuede python=3.11
conda activate sisepuede</code></pre>

          <h2>Install from GitHub</h2>
<pre><code class="language-bash">pip install git+https://github.com/jcsyme/sisepuede/</code></pre>
          <p>Once this completes you can <code>import sisepuede</code> from any Python session inside the <code>sisepuede</code> environment.</p>

          <div class="callout note">
            <strong>Why pin to 3.11?</strong> SISEPUEDE depends on scientific libraries that are tested against this Python version. 3.12+ may work but is not guaranteed by the maintainers.
          </div>

          <h2>Smoke-test the install</h2>
<pre><code class="language-python">import sisepuede
from sisepuede.manager.sisepuede import SISEPUEDE

# Instantiate the orchestrator with the default configuration
engine = SISEPUEDE("demo")
print(engine.analysis_id)</code></pre>
          <p>If this prints an <code>AnalysisID</code> string, your install is healthy. The <code>demo</code> argument tells SISEPUEDE to use the bundled demo input templates, which are generated from the attribute tables that ship with the package.</p>

          <h2>Where are the data files?</h2>
          <p>After installation, open the package directory to explore:</p>
<pre><code class="language-bash">python -c "import sisepuede, os; print(os.path.dirname(sisepuede.__file__))"</code></pre>
          <p>Inside you will find:</p>
          <ul>
            <li><code>attributes/</code> — the attribute tables we will refer to throughout the course.</li>
            <li><code>models/</code> — Python implementations of AFOLU, Circular Economy, IPPU, EnergyConsumption, EnergyProduction and Socioeconomic.</li>
            <li><code>julia/</code> — NemoMod wrapper.</li>
            <li><code>transformers/</code> — the pre-defined transformer library.</li>
            <li><code>sisepuede_config.yaml</code> — the global configuration (we cover this in the next module).</li>
          </ul>

          <h2>Running a first scenario</h2>
          <p>The high-level flow is:</p>
          <ol>
            <li>Load or generate <strong>input templates</strong> (one Excel per region per sector).</li>
            <li>Define <strong>strategies</strong> (YAML) and compose them into an <strong>experimental design</strong>.</li>
            <li>Call <code>engine.project()</code> — SISEPUEDE will build the LHS matrix, run every (future × strategy × design) combination, and store results in a SQLite database keyed by the Analysis ID.</li>
            <li>Query the database (<code>MODEL_OUTPUT</code>, <code>ATTRIBUTE_PRIMARY</code>, …) with pandas.</li>
          </ol>

          <h2>Minimal example</h2>
<pre><code class="language-python">from sisepuede.manager.sisepuede import SISEPUEDE

engine = SISEPUEDE(
    "demo",
    regions=["costa_rica"],
    n_trials=10,          # 10 futures per strategy
    time_period_u0=0,
    time_period_tf=20     # 2015-2035
)
engine.project()           # runs AFOLU, CE, IPPU, Energy for 10 futures

df = engine.read_output_table()
df.head()</code></pre>

          <div class="callout warn">
            <strong>Resource note:</strong> a full run across all 170+ regions with 1000 trials is a serious workload. Start with a single region and 10 trials, then scale up.
          </div>

          <h2>Troubleshooting</h2>
          <ul>
            <li><strong>Julia not found</strong>: install Julia and set <code>JULIA_PATH</code>, or disable energy production in config.</li>
            <li><strong>Missing attribute file</strong>: confirm the install directory contains <code>attributes/</code>; if not, reinstall with <code>--force-reinstall</code>.</li>
            <li><strong>Permission errors on SQLite output</strong>: SISEPUEDE writes to <code>~/.sisepuede/</code> by default; override via config.</li>
          </ul>
        `,
        es: `
          <h2>Prerrequisitos</h2>
          <ul>
            <li><strong>Python 3.11</strong> (SISEPUEDE fija esta versión menor).</li>
            <li><strong>conda</strong> o <strong>micromamba</strong> para aislar el entorno.</li>
            <li><strong>git</strong> para traer el paquete desde GitHub.</li>
            <li>(Opcional, para producción de energía) <strong>Julia ≥ 1.9</strong> y el paquete <code>NemoMod.jl</code>.</li>
          </ul>

          <h2>Crear un entorno limpio</h2>
<pre><code class="language-bash">conda create -n sisepuede python=3.11
conda activate sisepuede</code></pre>

          <h2>Instalar desde GitHub</h2>
<pre><code class="language-bash">pip install git+https://github.com/jcsyme/sisepuede/</code></pre>
          <p>Al terminar podrás hacer <code>import sisepuede</code> desde cualquier sesión Python dentro del entorno <code>sisepuede</code>.</p>

          <div class="callout note">
            <strong>¿Por qué fijar 3.11?</strong> SISEPUEDE depende de librerías científicas probadas contra esta versión. 3.12+ puede funcionar pero no está garantizado por los mantenedores.
          </div>

          <h2>Prueba de humo</h2>
<pre><code class="language-python">import sisepuede
from sisepuede.manager.sisepuede import SISEPUEDE

# Instancia el orquestador con la configuración por defecto
engine = SISEPUEDE("demo")
print(engine.analysis_id)</code></pre>
          <p>Si imprime una cadena <code>AnalysisID</code>, la instalación está sana. El argumento <code>demo</code> le dice a SISEPUEDE que use las plantillas de entrada demo que vienen incluidas.</p>

          <h2>¿Dónde están los archivos de datos?</h2>
<pre><code class="language-bash">python -c "import sisepuede, os; print(os.path.dirname(sisepuede.__file__))"</code></pre>
          <p>Dentro encontrarás:</p>
          <ul>
            <li><code>attributes/</code> — las tablas de atributos que usaremos durante todo el curso.</li>
            <li><code>models/</code> — implementaciones Python de AFOLU, Economía Circular, IPPU, Consumo y Producción de Energía y Socioeconómico.</li>
            <li><code>julia/</code> — wrapper de NemoMod.</li>
            <li><code>transformers/</code> — biblioteca predefinida de transformers.</li>
            <li><code>sisepuede_config.yaml</code> — configuración global (la vemos en el siguiente módulo).</li>
          </ul>

          <h2>Ejecutar un primer escenario</h2>
          <ol>
            <li>Carga o genera <strong>plantillas de entrada</strong> (un Excel por región por sector).</li>
            <li>Define <strong>estrategias</strong> (YAML) y compónlas en un <strong>diseño experimental</strong>.</li>
            <li>Llama a <code>engine.project()</code> — SISEPUEDE construye la matriz LHS, corre cada combinación (futuro × estrategia × diseño) y guarda resultados en una base SQLite indexada por Analysis ID.</li>
            <li>Consulta la base (<code>MODEL_OUTPUT</code>, <code>ATTRIBUTE_PRIMARY</code>, …) con pandas.</li>
          </ol>

          <h2>Ejemplo mínimo</h2>
<pre><code class="language-python">from sisepuede.manager.sisepuede import SISEPUEDE

engine = SISEPUEDE(
    "demo",
    regions=["costa_rica"],
    n_trials=10,          # 10 futuros por estrategia
    time_period_u0=0,
    time_period_tf=20     # 2015-2035
)
engine.project()           # corre AFOLU, CE, IPPU, Energía para 10 futuros

df = engine.read_output_table()
df.head()</code></pre>

          <div class="callout warn">
            <strong>Nota de recursos:</strong> una corrida completa de 170+ regiones con 1000 ensayos es una carga seria. Empieza con una región y 10 ensayos, y escala.
          </div>

          <h2>Problemas comunes</h2>
          <ul>
            <li><strong>Julia no encontrado</strong>: instala Julia y define <code>JULIA_PATH</code>, o desactiva producción de energía en la configuración.</li>
            <li><strong>Archivo de atributo faltante</strong>: confirma que el directorio de instalación contiene <code>attributes/</code>; si no, reinstala con <code>--force-reinstall</code>.</li>
            <li><strong>Errores de permisos en SQLite</strong>: SISEPUEDE escribe en <code>~/.sisepuede/</code> por defecto; sobrescribe por configuración.</li>
          </ul>
        `
      }
    },

    // ─────────────────────────────── 04 ───────────────────────────────
    {
      id: "general-data",
      track: "data",
      duration: 25,
      title: {
        en: "General Data: Sectors, Gases, Regions & Units",
        es: "Datos Generales: Sectores, Gases, Regiones y Unidades"
      },
      summary: {
        en: "The attribute tables that every variable, equation and output ultimately refers back to.",
        es: "Las tablas de atributos a las que todas las variables, ecuaciones y salidas remiten en última instancia."
      },
      content: {
        en: `
          <h2>Attribute tables as the backbone</h2>
          <p>SISEPUEDE never hard-codes a sector, gas, region or unit. Every one of these lives in a CSV inside <code>sisepuede/attributes/</code>. If you need to add a new biome, a new fluorinated gas or a new region, you edit the attribute table — the rest of the code picks it up automatically.</p>

          <h2>Sectors (<code>attribute_sector.csv</code>)</h2>
          <table>
            <thead><tr><th>Sector</th><th>Code</th><th>Role</th></tr></thead>
            <tbody>
              <tr><td>AFOLU</td><td>af</td><td>Agricultural activity</td></tr>
              <tr><td>Circular Economy</td><td>ce</td><td>Liquid &amp; solid waste production, storage, treatment</td></tr>
              <tr><td>Energy</td><td>en</td><td>Generation and consumption of energy</td></tr>
              <tr><td>IPPU</td><td>ip</td><td>Industrial processes and product use</td></tr>
              <tr><td>Socioeconomic</td><td>se</td><td>Demographic and economic drivers</td></tr>
            </tbody>
          </table>

          <h2>Gases (<code>attribute_gas.csv</code>)</h2>
          <p>SISEPUEDE tracks each gas separately and then converts to CO₂e when requested. The default conversion uses the IPCC AR6 WG1 Chapter 7 GWP-100 values.</p>
          <ul>
            <li>CO₂ — carbon dioxide (reference, GWP = 1)</li>
            <li>CH₄ — methane (GWP₁₀₀ = 27–30 depending on origin)</li>
            <li>N₂O — nitrous oxide (GWP₁₀₀ = 273)</li>
            <li>Fluorinated: HFC-23, HFC-32, HFC-125, HFC-134a, HFC-143a, HFC-152a, HFC-227ea, HFC-236fa, HFC-245fa, HFC-365mfc, HFC-43-10mee, PFC-14 (CF₄), PFC-116, PFC-218, c-C₄F₈, SF₆, NF₃, …</li>
          </ul>

          <div class="callout note">
            <strong>GWP time horizon:</strong> 100 years by default. Change <code>global_warming_potential</code> in the config file to switch to 20-year or 500-year horizons.
          </div>

          <h2>Regions (<code>attribute_region.csv</code>)</h2>
          <p>SISEPUEDE ships with over 170 countries. Each region carries:</p>
          <ul>
            <li>A code and an ISO-3 code.</li>
            <li>Latitude &amp; longitude of the population centroid (used for solar irradiance in NemoMod).</li>
            <li>Grid group assignments (for interconnection in NemoMod).</li>
            <li>Metadata (sub-region, NDC alignment, data quality).</li>
          </ul>
          <p>Regions are treated as independent in v1 — exports are exogenously defined. Future versions aim to model power sharing and trade more deeply.</p>

          <h2>Units</h2>
          <p>SISEPUEDE provides versatile unit reporting. The default units are:</p>
          <table>
            <thead><tr><th>Dimension</th><th>Default</th><th>File</th></tr></thead>
            <tbody>
              <tr><td>Area</td><td>ha (hectare)</td><td><code>attribute_unit_area.csv</code></td></tr>
              <tr><td>Energy</td><td>PJ (petajoule)</td><td><code>attribute_unit_energy.csv</code></td></tr>
              <tr><td>Length</td><td>km</td><td><code>attribute_unit_length.csv</code></td></tr>
              <tr><td>Mass (emissions)</td><td>MT (megaton)</td><td><code>attribute_unit_mass.csv</code></td></tr>
              <tr><td>Monetary</td><td>mm_usd (million USD)</td><td><code>attribute_unit_monetary.csv</code></td></tr>
              <tr><td>Power</td><td>GW</td><td><code>attribute_unit_power.csv</code></td></tr>
              <tr><td>Volume</td><td>m³</td><td><code>attribute_unit_volume.csv</code></td></tr>
            </tbody>
          </table>

          <div class="callout math">
            <strong>Energy ↔ Power:</strong> the energy attribute table ships explicit mappings between units of energy and their time-durational power equivalents (e.g. kWh ↔ kW over 1 h, GWy ↔ GW over 1 y). This is how SISEPUEDE bridges NemoMod's capacity figures with the Python-side energy demands.
          </div>

          <h2>Subsectors (<code>attribute_subsector.csv</code>)</h2>
          <p>Each subsector row contains:</p>
          <ul>
            <li>Parent sector and English name.</li>
            <li>Code abbreviation (<code>agrc</code>, <code>lvst</code>, …).</li>
            <li><strong>Primary category</strong> metavariable (e.g. <code>$CAT-AGRICULTURE$</code>).</li>
            <li>Model language (Python, Julia/Python).</li>
            <li>Emission flag.</li>
            <li>Default colour (used across SISEPUEDE plots — these colours are also used throughout this course site).</li>
          </ul>

          <h2>Why this matters</h2>
          <p>Every variable name is composed from these tables. A string like <code>ef_agactivity_maize_kg_co2_ha</code> is read by SISEPUEDE as:</p>
          <ul>
            <li><code>ef_agactivity_</code>: emission factor for agricultural activity</li>
            <li><code>maize</code>: a value from <code>attribute_cat_agriculture.csv</code> (the <code>$CAT-AGRICULTURE$</code> metavariable)</li>
            <li><code>kg</code>: from <code>attribute_unit_mass.csv</code></li>
            <li><code>co2</code>: from <code>attribute_gas.csv</code></li>
            <li><code>ha</code>: from <code>attribute_unit_area.csv</code></li>
          </ul>
          <p>So changing a unit or adding a crop never requires touching Python code — only the attribute table.</p>
        `,
        es: `
          <h2>Tablas de atributos como columna vertebral</h2>
          <p>SISEPUEDE nunca hard-codea un sector, gas, región o unidad. Cada uno vive en un CSV dentro de <code>sisepuede/attributes/</code>. Si necesitas añadir un nuevo bioma, un gas fluorado nuevo o una región, editas la tabla de atributos — el resto del código lo recoge automáticamente.</p>

          <h2>Sectores (<code>attribute_sector.csv</code>)</h2>
          <table>
            <thead><tr><th>Sector</th><th>Código</th><th>Rol</th></tr></thead>
            <tbody>
              <tr><td>AFOLU</td><td>af</td><td>Actividad agrícola</td></tr>
              <tr><td>Economía Circular</td><td>ce</td><td>Producción, almacenamiento y tratamiento de residuos</td></tr>
              <tr><td>Energía</td><td>en</td><td>Generación y consumo de energía</td></tr>
              <tr><td>IPPU</td><td>ip</td><td>Procesos industriales y uso de productos</td></tr>
              <tr><td>Socioeconómico</td><td>se</td><td>Drivers demográficos y económicos</td></tr>
            </tbody>
          </table>

          <h2>Gases (<code>attribute_gas.csv</code>)</h2>
          <p>SISEPUEDE rastrea cada gas por separado y convierte a CO₂e cuando se requiere. La conversión por defecto usa los valores GWP-100 del IPCC AR6 WG1 Capítulo 7.</p>
          <ul>
            <li>CO₂ — dióxido de carbono (referencia, GWP = 1)</li>
            <li>CH₄ — metano (GWP₁₀₀ = 27–30 según origen)</li>
            <li>N₂O — óxido nitroso (GWP₁₀₀ = 273)</li>
            <li>Fluorados: HFC-23, HFC-32, HFC-125, HFC-134a, HFC-143a, HFC-152a, HFC-227ea, HFC-236fa, HFC-245fa, HFC-365mfc, HFC-43-10mee, PFC-14 (CF₄), PFC-116, PFC-218, c-C₄F₈, SF₆, NF₃, …</li>
          </ul>

          <div class="callout note">
            <strong>Horizonte GWP:</strong> 100 años por defecto. Cambia <code>global_warming_potential</code> en la configuración para 20 o 500 años.
          </div>

          <h2>Regiones (<code>attribute_region.csv</code>)</h2>
          <p>SISEPUEDE viene con más de 170 países. Cada región contiene:</p>
          <ul>
            <li>Un código y un código ISO-3.</li>
            <li>Latitud y longitud del centroide poblacional (usado para irradiancia solar en NemoMod).</li>
            <li>Asignaciones a grupos de red (para interconexión en NemoMod).</li>
            <li>Metadatos (sub-región, alineación con NDC, calidad del dato).</li>
          </ul>
          <p>Las regiones se tratan como independientes en v1 — las exportaciones son exógenas. Versiones futuras buscan modelar el intercambio eléctrico y comercial más a fondo.</p>

          <h2>Unidades</h2>
          <p>SISEPUEDE provee reporte flexible de unidades. Las unidades por defecto son:</p>
          <table>
            <thead><tr><th>Dimensión</th><th>Defecto</th><th>Archivo</th></tr></thead>
            <tbody>
              <tr><td>Área</td><td>ha (hectárea)</td><td><code>attribute_unit_area.csv</code></td></tr>
              <tr><td>Energía</td><td>PJ (petajoule)</td><td><code>attribute_unit_energy.csv</code></td></tr>
              <tr><td>Longitud</td><td>km</td><td><code>attribute_unit_length.csv</code></td></tr>
              <tr><td>Masa (emisiones)</td><td>MT (megatón)</td><td><code>attribute_unit_mass.csv</code></td></tr>
              <tr><td>Monetaria</td><td>mm_usd (millones USD)</td><td><code>attribute_unit_monetary.csv</code></td></tr>
              <tr><td>Potencia</td><td>GW</td><td><code>attribute_unit_power.csv</code></td></tr>
              <tr><td>Volumen</td><td>m³</td><td><code>attribute_unit_volume.csv</code></td></tr>
            </tbody>
          </table>

          <div class="callout math">
            <strong>Energía ↔ Potencia:</strong> la tabla de energía incluye mapeos explícitos entre unidades de energía y sus equivalentes de potencia-tiempo (p. ej. kWh ↔ kW en 1 h, GWy ↔ GW en 1 y). Así SISEPUEDE puente las figuras de capacidad de NemoMod con las demandas del lado Python.
          </div>

          <h2>Subsectores (<code>attribute_subsector.csv</code>)</h2>
          <p>Cada fila de subsector contiene:</p>
          <ul>
            <li>Sector padre y nombre en inglés.</li>
            <li>Abreviatura (<code>agrc</code>, <code>lvst</code>, …).</li>
            <li><strong>Metavariable de categoría primaria</strong> (p. ej. <code>$CAT-AGRICULTURE$</code>).</li>
            <li>Lenguaje del modelo (Python, Julia/Python).</li>
            <li>Flag de emisor.</li>
            <li>Color por defecto (usado en los gráficos de SISEPUEDE y también en los acentos de este sitio).</li>
          </ul>

          <h2>Por qué importa</h2>
          <p>Cada nombre de variable se compone de estas tablas. Una cadena como <code>ef_agactivity_maize_kg_co2_ha</code> SISEPUEDE la lee así:</p>
          <ul>
            <li><code>ef_agactivity_</code>: factor de emisión por actividad agrícola</li>
            <li><code>maize</code>: valor de <code>attribute_cat_agriculture.csv</code> (metavariable <code>$CAT-AGRICULTURE$</code>)</li>
            <li><code>kg</code>: de <code>attribute_unit_mass.csv</code></li>
            <li><code>co2</code>: de <code>attribute_gas.csv</code></li>
            <li><code>ha</code>: de <code>attribute_unit_area.csv</code></li>
          </ul>
          <p>Así, cambiar una unidad o añadir un cultivo nunca requiere tocar código Python — sólo la tabla de atributos.</p>
        `
      }
    },

    // ─────────────────────────────── 05 ───────────────────────────────
    {
      id: "variables",
      track: "data",
      duration: 25,
      title: {
        en: "Variables, Categories & Schemas",
        es: "Variables, Categorías y Esquemas"
      },
      summary: {
        en: "Model variables, variable fields, metavariables and simplex groups — the grammar of SISEPUEDE inputs.",
        es: "Variables de modelo, campos de variable, metavariables y grupos simplex — la gramática de las entradas de SISEPUEDE."
      },
      content: {
        en: `
          <h2>Model variables vs. variable fields</h2>
          <p>SISEPUEDE separates <strong>conceptual variables</strong> (e.g. "Crop Yield Factor") from the concrete <strong>fields</strong> that appear in input DataFrames. One model variable may expand into dozens of fields — one per category and gas combination.</p>

          <h3>Example</h3>
          <ul>
            <li>Model variable: <em>Agricultural activity emission factor</em>.</li>
            <li>Schema: <code>ef_agactivity_$CAT-AGRICULTURE$_$UNIT-MASS$_$EMISSION-GAS$_$UNIT-AREA$</code>.</li>
            <li>Fields: <code>ef_agactivity_maize_kg_co2_ha</code>, <code>ef_agactivity_maize_kg_n2o_ha</code>, <code>ef_agactivity_rice_kg_ch4_ha</code>, …</li>
          </ul>

          <h2>The variable definition tables</h2>
          <p>Each subsector has a <code>variable_definitions_&lt;sector&gt;_&lt;subsector&gt;.csv</code> (for example <code>variable_definitions_af_agrc.csv</code>). Columns include:</p>
          <ul>
            <li><strong>Variable Name</strong> — human readable.</li>
            <li><strong>Variable Schema</strong> — the metavariable template.</li>
            <li><strong>Categories</strong> — which categories the variable applies to.</li>
            <li><strong>Simplex Group</strong> — integer marker for sum-to-1 constraints.</li>
            <li><strong>Default Value</strong> — used when a region is missing data.</li>
            <li>Other attributes (sector, subsector, variable trajectory group, lever flag, …).</li>
          </ul>

          <h2>Metavariables</h2>
          <p>Metavariables are <code>$NAME$</code> tokens that SISEPUEDE replaces at runtime with values from a category attribute table.</p>
          <table>
            <thead><tr><th>Token</th><th>Source table</th></tr></thead>
            <tbody>
              <tr><td><code>$CAT-AGRICULTURE$</code></td><td><code>attribute_cat_agriculture.csv</code></td></tr>
              <tr><td><code>$CAT-LANDUSE$</code></td><td><code>attribute_cat_land_use.csv</code></td></tr>
              <tr><td><code>$CAT-LIVESTOCK$</code></td><td><code>attribute_cat_livestock.csv</code></td></tr>
              <tr><td><code>$CAT-TRANSPORTATION$</code></td><td><code>attribute_cat_transportation.csv</code></td></tr>
              <tr><td><code>$CAT-INDUSTRY$</code></td><td><code>attribute_cat_industry.csv</code></td></tr>
              <tr><td><code>$CAT-FUEL$</code></td><td><code>attribute_cat_fuel.csv</code></td></tr>
              <tr><td><code>$CAT-TECHNOLOGY$</code></td><td><code>attribute_cat_technology.csv</code></td></tr>
              <tr><td><code>$EMISSION-GAS$</code></td><td><code>attribute_gas.csv</code></td></tr>
              <tr><td><code>$UNIT-MASS$</code></td><td><code>attribute_unit_mass.csv</code></td></tr>
              <tr><td><code>$UNIT-AREA$</code></td><td><code>attribute_unit_area.csv</code></td></tr>
              <tr><td><code>$UNIT-ENERGY$</code></td><td><code>attribute_unit_energy.csv</code></td></tr>
            </tbody>
          </table>

          <h2>Categorical scope</h2>
          <p>A variable may be:</p>
          <ul>
            <li><strong>Dimensionless</strong> — represents no categories (e.g. a global growth rate).</li>
            <li><strong>All-category</strong> — expands over the full attribute table.</li>
            <li><strong>Scoped</strong> — restricted to a subset (e.g. only cereals, only electric technologies).</li>
          </ul>
          <p>Scoping is declared in the <em>Categories</em> column of the variable definition table using operators like <code>|</code> (union) and <code>&amp;</code> (intersection). For multi-dimension variables you can also target specific dimensions (<code>$CAT-INDUSTRY-DIM1$</code> vs <code>$CAT-INDUSTRY-DIM2$</code>).</p>

          <h2>Simplex groups</h2>
          <p>Some sets of fields must sum to 1 — the simplex constraint. Examples:</p>
          <ul>
            <li>Initial fractions of area across land-use categories: $\\sum_u \\varphi_u = 1$.</li>
            <li>Fuel-mix fractions across all fuels in a sub-model.</li>
            <li>Rows of the land-use Markov transition matrix.</li>
          </ul>
          <p>Each variable row in a definition table may carry an integer <strong>Simplex Group</strong>. The rules are:</p>
          <ul>
            <li>1:1 — if a single variable owns a simplex group, all its fields must sum to 1.</li>
            <li>N:1 — if several variables share a group, their fields must sum to 1 <em>per category</em> across those variables.</li>
            <li>Simplex groups cannot cross attribute tables.</li>
          </ul>

          <div class="callout warn">
            <strong>Why this matters:</strong> when sampling with LHS, SISEPUEDE needs to know which fields are on a simplex so it can preserve the constraint. If you miss a simplex marker, LHS will produce physically impossible scenarios (fractions &gt; 1 or &lt; 0).
          </div>

          <h2>Variable trajectory groups</h2>
          <p>Trajectory groups let you perturb a collection of variables with a <em>single</em> LHS sample. Two definition approaches:</p>
          <ol>
            <li><strong>Bound-Mix:</strong> provide a lower trajectory \\(b_0\\), an upper trajectory \\(b_1\\) and a mixing fraction \\(m\\). The LHS sample becomes the mixing weight.</li>
            <li><strong>Trajectories-alone:</strong> provide many candidate trajectories and let LHS pick one.</li>
          </ol>

          <div class="callout note">
            <strong>Bound-Mix + simplex:</strong> with a Bound-Mix group, exogenous-uncertainty scalars are <em>not</em> applied to the bounds — this preserves simplex constraints automatically.
          </div>

          <h2>From schema to field: the lookup pattern</h2>
<pre><code class="language-python">from sisepuede.core.model_attributes import ModelAttributes

ma = ModelAttributes()  # auto-loads attribute tables
schema = "ef_agactivity_$CAT-AGRICULTURE$_$UNIT-MASS$_$EMISSION-GAS$_$UNIT-AREA$"
fields = ma.build_variable_fields(schema)
# fields -> ['ef_agactivity_maize_kg_co2_ha',
#            'ef_agactivity_maize_kg_n2o_ha', ...]</code></pre>
          <p>Internally, every subsector module uses this pattern to pull its input columns from the DataFrame.</p>
        `,
        es: `
          <h2>Variables de modelo vs. campos de variable</h2>
          <p>SISEPUEDE separa las <strong>variables conceptuales</strong> (p. ej. "Factor de Rendimiento del Cultivo") de los <strong>campos</strong> concretos que aparecen en los DataFrames de entrada. Una variable puede expandirse en docenas de campos — uno por combinación de categoría y gas.</p>

          <h3>Ejemplo</h3>
          <ul>
            <li>Variable: <em>Factor de emisión por actividad agrícola</em>.</li>
            <li>Esquema: <code>ef_agactivity_$CAT-AGRICULTURE$_$UNIT-MASS$_$EMISSION-GAS$_$UNIT-AREA$</code>.</li>
            <li>Campos: <code>ef_agactivity_maize_kg_co2_ha</code>, <code>ef_agactivity_maize_kg_n2o_ha</code>, <code>ef_agactivity_rice_kg_ch4_ha</code>, …</li>
          </ul>

          <h2>Las tablas de definición de variables</h2>
          <p>Cada subsector tiene un <code>variable_definitions_&lt;sector&gt;_&lt;subsector&gt;.csv</code> (p. ej. <code>variable_definitions_af_agrc.csv</code>). Columnas:</p>
          <ul>
            <li><strong>Variable Name</strong> — nombre legible.</li>
            <li><strong>Variable Schema</strong> — plantilla con metavariables.</li>
            <li><strong>Categories</strong> — a qué categorías aplica.</li>
            <li><strong>Simplex Group</strong> — entero que marca restricciones de suma 1.</li>
            <li><strong>Default Value</strong> — valor cuando una región no tiene dato.</li>
            <li>Otros atributos (sector, subsector, grupo de trayectoria, flag de palanca, …).</li>
          </ul>

          <h2>Metavariables</h2>
          <p>Las metavariables son tokens <code>$NOMBRE$</code> que SISEPUEDE reemplaza en tiempo de ejecución con valores de una tabla de categorías.</p>
          <table>
            <thead><tr><th>Token</th><th>Tabla fuente</th></tr></thead>
            <tbody>
              <tr><td><code>$CAT-AGRICULTURE$</code></td><td><code>attribute_cat_agriculture.csv</code></td></tr>
              <tr><td><code>$CAT-LANDUSE$</code></td><td><code>attribute_cat_land_use.csv</code></td></tr>
              <tr><td><code>$CAT-LIVESTOCK$</code></td><td><code>attribute_cat_livestock.csv</code></td></tr>
              <tr><td><code>$CAT-TRANSPORTATION$</code></td><td><code>attribute_cat_transportation.csv</code></td></tr>
              <tr><td><code>$CAT-INDUSTRY$</code></td><td><code>attribute_cat_industry.csv</code></td></tr>
              <tr><td><code>$CAT-FUEL$</code></td><td><code>attribute_cat_fuel.csv</code></td></tr>
              <tr><td><code>$CAT-TECHNOLOGY$</code></td><td><code>attribute_cat_technology.csv</code></td></tr>
              <tr><td><code>$EMISSION-GAS$</code></td><td><code>attribute_gas.csv</code></td></tr>
              <tr><td><code>$UNIT-MASS$</code></td><td><code>attribute_unit_mass.csv</code></td></tr>
              <tr><td><code>$UNIT-AREA$</code></td><td><code>attribute_unit_area.csv</code></td></tr>
              <tr><td><code>$UNIT-ENERGY$</code></td><td><code>attribute_unit_energy.csv</code></td></tr>
            </tbody>
          </table>

          <h2>Alcance categórico</h2>
          <p>Una variable puede ser:</p>
          <ul>
            <li><strong>Sin dimensión</strong> — no representa categorías (p. ej. una tasa global de crecimiento).</li>
            <li><strong>Todas las categorías</strong> — se expande sobre toda la tabla.</li>
            <li><strong>Restringida</strong> — a un subconjunto (p. ej. sólo cereales, sólo tecnologías eléctricas).</li>
          </ul>
          <p>La restricción se declara en la columna <em>Categories</em> con operadores como <code>|</code> (unión) y <code>&amp;</code> (intersección). Para variables multidimensionales puedes apuntar a dimensiones específicas (<code>$CAT-INDUSTRY-DIM1$</code> vs <code>$CAT-INDUSTRY-DIM2$</code>).</p>

          <h2>Grupos simplex</h2>
          <p>Algunos conjuntos de campos deben sumar 1 — restricción simplex. Ejemplos:</p>
          <ul>
            <li>Fracciones iniciales de área en categorías de uso del suelo: $\\sum_u \\varphi_u = 1$.</li>
            <li>Fracciones de mezcla de combustibles en un submodelo.</li>
            <li>Filas de la matriz de transición de Markov de uso del suelo.</li>
          </ul>
          <p>Cada fila de variable puede llevar un <strong>Simplex Group</strong> entero. Reglas:</p>
          <ul>
            <li>1:1 — una variable sola dueña del grupo, sus campos suman 1.</li>
            <li>N:1 — varias variables en el grupo, sus campos suman 1 <em>por categoría</em>.</li>
            <li>Los grupos simplex no cruzan tablas de atributos.</li>
          </ul>

          <div class="callout warn">
            <strong>Por qué importa:</strong> al muestrear con LHS, SISEPUEDE necesita saber qué campos están en un simplex para preservar la restricción. Si olvidas un marcador, LHS producirá escenarios físicamente imposibles (fracciones &gt; 1 o &lt; 0).
          </div>

          <h2>Grupos de trayectorias de variables</h2>
          <p>Los grupos de trayectoria permiten perturbar una colección de variables con una <em>sola</em> muestra LHS. Dos aproximaciones:</p>
          <ol>
            <li><strong>Bound-Mix:</strong> da una trayectoria inferior \\(b_0\\), una superior \\(b_1\\) y una fracción de mezcla \\(m\\). La muestra LHS se vuelve el peso de mezcla.</li>
            <li><strong>Sólo trayectorias:</strong> da varias trayectorias candidatas y LHS elige una.</li>
          </ol>

          <div class="callout note">
            <strong>Bound-Mix + simplex:</strong> en un grupo Bound-Mix los escalares de incertidumbre exógena <em>no</em> se aplican a las cotas — así se preservan las restricciones simplex.
          </div>

          <h2>De esquema a campo: el patrón</h2>
<pre><code class="language-python">from sisepuede.core.model_attributes import ModelAttributes

ma = ModelAttributes()  # auto-carga las tablas
schema = "ef_agactivity_$CAT-AGRICULTURE$_$UNIT-MASS$_$EMISSION-GAS$_$UNIT-AREA$"
fields = ma.build_variable_fields(schema)
# fields -> ['ef_agactivity_maize_kg_co2_ha', ...]</code></pre>
          <p>Internamente, cada módulo de subsector usa este patrón para traer sus columnas de entrada desde el DataFrame.</p>
        `
      }
    },

    // ─────────────────────────────── 06 ───────────────────────────────
    {
      id: "afolu",
      track: "sectors",
      duration: 35,
      title: {
        en: "AFOLU — Agriculture, Forestry & Land Use",
        es: "AFOLU — Agricultura, Silvicultura y Uso del Suelo"
      },
      summary: {
        en: "Six interlocking subsectors driven by a Markov-chain land-use model and a demand-driven reallocation mechanism.",
        es: "Seis subsectores interconectados, impulsados por un modelo Markov de uso del suelo y un mecanismo de realocación por demanda."
      },
      content: {
        en: `
          <h2>Six subsectors</h2>
          <ul>
            <li><strong>Agriculture (AGRC)</strong> — crop residues, rice paddy methane, cropland emissions.</li>
            <li><strong>Forest (FRST)</strong> — sequestration, deforestation emissions.</li>
            <li><strong>Land Use (LNDU)</strong> — the Markov-chain transition engine.</li>
            <li><strong>Livestock (LVST)</strong> — enteric fermentation, head counts, demand.</li>
            <li><strong>Livestock Manure Management (LSMM)</strong> — manure pathways and biogas capture.</li>
            <li><strong>Soil Management (SOIL)</strong> — fertiliser, liming, soil carbon.</li>
          </ul>

          <figure>
            <img src="assets/img/diagram_afolu.jpg" alt="AFOLU subsector diagram">
            <figcaption>How AFOLU subsectors feed each other.</figcaption>
          </figure>

          <h2>The Land Use Markov chain</h2>
          <p>Land use at time \\(t\\) is a vector \\(x(t) \\in \\mathbb{R}^m\\) where \\(m\\) is the number of land-use categories. SISEPUEDE evolves it with a row-stochastic transition matrix \\(Q(t)\\):</p>
          <p>$$\\tilde{x}(t+1) = x(t)^{T}\\tilde{Q}(t)$$</p>
          <p>where \\(\\tilde{Q}_{ij}(t)\\) is the probability of transitioning from category \\(i\\) to category \\(j\\) between \\(t\\) and \\(t+1\\). The matrix is row-stochastic:</p>
          <p>$$\\sum_j \\tilde{Q}_{ij}(t) = 1$$</p>

          <figure>
            <img src="assets/img/illustrative_transition_matrix.png" alt="Illustrative transition matrix">
            <figcaption>Illustrative transition matrix. Each row sums to 1.</figcaption>
          </figure>

          <div class="callout note">
            <strong>Why mix trajectories, not raw matrices?</strong> If you perturb each cell independently, you break row stochasticity. The recommended practice is to specify two bounding transition matrices and let LHS mix them with a scalar — this always yields a valid stochastic matrix.
          </div>

          <h2>The Land Use Reallocation Factor (LURF, η)</h2>
          <p>An exogenous transition matrix may be inconsistent with the demand for livestock and crops. The LURF \\(\\eta \\in [0, 1]\\) controls how surplus demand \\(I = D - S\\) is split:</p>
          <ul>
            <li>\\(\\eta = 0\\): no reallocation; the imbalance becomes a change in net imports.</li>
            <li>\\(\\eta = 1\\): all imbalance is absorbed by reallocating pasture/cropland so \\(D = S\\).</li>
            <li>Values in between split the imbalance between imports and reallocation.</li>
          </ul>

          <h3>Reallocation exhaustion directionality</h3>
          <p>In the <code>$CAT-LANDUSE$</code> attribute file you can mark categories as <em>Reallocation Transition Probability Exhaustion Categories</em>. The config parameter <code>land_use_reallocation_max_out_directionality</code> accepts:</p>
          <ul>
            <li><code>decrease_only</code> (default) — when demand drops, outbound probabilities from those categories into cropland/pasture are minimised first.</li>
            <li><code>increase_only</code> — when demand grows, outbound probabilities are maximised first.</li>
            <li><code>decrease_and_increase</code> — both.</li>
          </ul>

          <h2>Livestock demand</h2>
          <p>Livestock demand \\(D_v^{(lvst)}(t)\\) scales with population \\(P(t)\\) and growth in GDP per capita \\(\\Delta M(t)\\), through an income elasticity \\(\\lambda_v\\):</p>
          <p>$$\\hat{D}_v^{(lvst)}(t+1) = \\hat{D}_v^{(lvst)}(t)\\left[1 + \\lambda_v \\, \\Delta M(t)\\right]$$</p>
          <p>$$D_v^{(lvst)}(t) = P(t)\\,\\hat{D}_v^{(lvst)}(t)$$</p>
          <p>At \\(t = 0\\), \\(D_v^{(lvst)}(0) = L_v(0)\\) — demand equals the initial head count by construction.</p>

          <h3>Carrying capacity</h3>
          <p>Each livestock category \\(v\\) has an initial carrying capacity \\(\\chi_v(0) = L_v(0) \\, G_v(0)^{-1}\\), where \\(G_v(0)\\) is the grassland area allocated to that class. SISEPUEDE then applies a <strong>carrying capacity scalar</strong> \\(c(t)\\):</p>
          <p>$$\\chi_v(t) = c(t) \\, \\chi_v(0)$$</p>
          <p>Scaling \\(c(t)\\) represents improved grazing practices (rotational grazing, pasture management) that increase stocking density without more land.</p>

          <h2>Agriculture</h2>
          <p>Each crop in <code>$CAT-AGRICULTURE$</code> maps to a FAO classification. The emission factors use the IPCC naming <code>ef_agactivity_$CAT$_$UNIT-MASS$_$GAS$_$UNIT-AREA$</code>. N₂O emissions use Equations 11.6 and 11.7 (Volume 4, Chapter 11) with N<sub>AG(T)</sub>, N<sub>BG(T)</sub>, R<sub>AG(T)</sub>, RS<sub>T</sub> and DRY derived from Table 11.1.</p>

          <div class="callout math">
            <strong>Carbon stocks:</strong> all carbon stocks are converted to CO₂ with a factor of 44/12 (ratio of molecular weights). You will see this constant throughout AFOLU equations.
          </div>

          <h2>Soil</h2>
          <p>Although defined as its own subsector, SOIL overarches AFOLU. It accounts for:</p>
          <ul>
            <li>No-till soil carbon emissions.</li>
            <li>Land-use conversion soil carbon losses (biomass losses are in LNDU).</li>
            <li>Organic + synthetic fertiliser emissions.</li>
            <li>Liming emissions.</li>
          </ul>

          <h2>Manure management (LSMM)</h2>
          <p>Manure flows through several pathways: anaerobic digester, lagoon, dry lot, pasture, etc. Each pathway has methane and nitrogen factors. LSMM also passes:</p>
          <ul>
            <li>Nitrogen available for cropland/pasture to <strong>SOIL</strong>.</li>
            <li>Biogas captured to <strong>ENTC</strong> (anaerobic digestion for electricity).</li>
          </ul>

          <h2>Known issue</h2>
          <div class="callout warn">
            Demand for harvested wood products is based on industrial demands <em>not adjusted for recycling</em>. SISEPUEDE 2.0 will fix this.
          </div>
        `,
        es: `
          <h2>Seis subsectores</h2>
          <ul>
            <li><strong>Agricultura (AGRC)</strong> — residuos de cultivos, metano de arroz, emisiones de cultivos.</li>
            <li><strong>Bosque (FRST)</strong> — secuestro, emisiones por deforestación.</li>
            <li><strong>Uso del Suelo (LNDU)</strong> — motor de transición Markov.</li>
            <li><strong>Ganadería (LVST)</strong> — fermentación entérica, hatos, demanda.</li>
            <li><strong>Gestión de Estiércol (LSMM)</strong> — rutas de estiércol y captura de biogás.</li>
            <li><strong>Manejo de Suelo (SOIL)</strong> — fertilizante, encalado, carbono del suelo.</li>
          </ul>

          <figure>
            <img src="assets/img/diagram_afolu.jpg" alt="Diagrama AFOLU">
            <figcaption>Cómo los subsectores AFOLU se alimentan entre sí.</figcaption>
          </figure>

          <h2>Cadena de Markov del uso del suelo</h2>
          <p>El uso del suelo en el tiempo \\(t\\) es un vector \\(x(t) \\in \\mathbb{R}^m\\) con \\(m\\) categorías. SISEPUEDE lo evoluciona con una matriz de transición fila-estocástica \\(Q(t)\\):</p>
          <p>$$\\tilde{x}(t+1) = x(t)^{T}\\tilde{Q}(t)$$</p>
          <p>donde \\(\\tilde{Q}_{ij}(t)\\) es la probabilidad de pasar de la categoría \\(i\\) a la \\(j\\) entre \\(t\\) y \\(t+1\\). Fila-estocástica:</p>
          <p>$$\\sum_j \\tilde{Q}_{ij}(t) = 1$$</p>

          <figure>
            <img src="assets/img/illustrative_transition_matrix.png" alt="Matriz de transición ilustrativa">
            <figcaption>Matriz de transición ilustrativa. Cada fila suma 1.</figcaption>
          </figure>

          <div class="callout note">
            <strong>¿Por qué mezclar trayectorias y no celdas?</strong> Si perturbas cada celda por separado rompes la propiedad fila-estocástica. La práctica recomendada es definir dos matrices-cota y dejar que LHS las mezcle con un escalar — así siempre obtienes una matriz estocástica válida.
          </div>

          <h2>Factor de Realocación del Uso del Suelo (LURF, η)</h2>
          <p>Una matriz exógena puede ser inconsistente con la demanda de ganado y cultivos. El LURF \\(\\eta \\in [0, 1]\\) controla cómo se reparte el superávit \\(I = D - S\\):</p>
          <ul>
            <li>\\(\\eta = 0\\): sin realocación; el desbalance se convierte en cambio de importaciones netas.</li>
            <li>\\(\\eta = 1\\): todo se absorbe realocando pasto/cultivo para que \\(D = S\\).</li>
            <li>Valores intermedios reparten entre importaciones y realocación.</li>
          </ul>

          <h3>Direccionalidad de agotamiento de realocación</h3>
          <p>En <code>$CAT-LANDUSE$</code> puedes marcar categorías como <em>Reallocation Transition Probability Exhaustion Categories</em>. El parámetro <code>land_use_reallocation_max_out_directionality</code> acepta:</p>
          <ul>
            <li><code>decrease_only</code> (defecto) — si la demanda baja, se minimizan primero las probabilidades salientes de esas categorías hacia cultivo/pasto.</li>
            <li><code>increase_only</code> — si la demanda sube, se maximizan primero.</li>
            <li><code>decrease_and_increase</code> — ambos.</li>
          </ul>

          <h2>Demanda de ganado</h2>
          <p>La demanda \\(D_v^{(lvst)}(t)\\) escala con la población \\(P(t)\\) y el crecimiento del PIB/cápita \\(\\Delta M(t)\\), mediante una elasticidad-ingreso \\(\\lambda_v\\):</p>
          <p>$$\\hat{D}_v^{(lvst)}(t+1) = \\hat{D}_v^{(lvst)}(t)\\left[1 + \\lambda_v \\, \\Delta M(t)\\right]$$</p>
          <p>$$D_v^{(lvst)}(t) = P(t)\\,\\hat{D}_v^{(lvst)}(t)$$</p>
          <p>En \\(t = 0\\), \\(D_v^{(lvst)}(0) = L_v(0)\\) por construcción.</p>

          <h3>Capacidad de carga</h3>
          <p>Cada categoría de ganado \\(v\\) tiene una capacidad inicial \\(\\chi_v(0) = L_v(0) \\, G_v(0)^{-1}\\), donde \\(G_v(0)\\) es el área de pastos asignada. SISEPUEDE aplica un <strong>escalar de capacidad de carga</strong> \\(c(t)\\):</p>
          <p>$$\\chi_v(t) = c(t) \\, \\chi_v(0)$$</p>
          <p>Escalar \\(c(t)\\) representa mejoras en el manejo del pastoreo (rotación, pastoreo compartido) que aumentan la densidad sin más tierra.</p>

          <h2>Agricultura</h2>
          <p>Cada cultivo en <code>$CAT-AGRICULTURE$</code> se mapea a una clasificación FAO. Los factores de emisión usan el patrón IPCC <code>ef_agactivity_$CAT$_$UNIT-MASS$_$GAS$_$UNIT-AREA$</code>. Las emisiones de N₂O usan las Ecuaciones 11.6 y 11.7 (Vol. 4, Cap. 11) con N<sub>AG(T)</sub>, N<sub>BG(T)</sub>, R<sub>AG(T)</sub>, RS<sub>T</sub> y DRY derivados de la Tabla 11.1.</p>

          <div class="callout math">
            <strong>Reservas de carbono:</strong> todas las reservas se convierten a CO₂ con el factor 44/12 (razón de pesos moleculares). Verás esta constante en toda la matemática de AFOLU.
          </div>

          <h2>Suelo</h2>
          <p>Aunque es un subsector propio, SOIL atraviesa AFOLU. Contabiliza:</p>
          <ul>
            <li>Emisiones por labranza cero.</li>
            <li>Pérdidas de carbono por cambio de uso del suelo (la biomasa está en LNDU).</li>
            <li>Emisiones por fertilizantes orgánicos y sintéticos.</li>
            <li>Emisiones por encalado.</li>
          </ul>

          <h2>Manejo de estiércol (LSMM)</h2>
          <p>El estiércol fluye por varias rutas: digestor anaerobio, laguna, lote seco, pastoreo, etc. Cada ruta tiene factores de metano y nitrógeno. LSMM también pasa:</p>
          <ul>
            <li>Nitrógeno disponible para cultivo/pasto a <strong>SOIL</strong>.</li>
            <li>Biogás capturado a <strong>ENTC</strong> (digestión anaerobia para electricidad).</li>
          </ul>

          <h2>Problema conocido</h2>
          <div class="callout warn">
            La demanda de productos madereros se basa en demandas industriales <em>sin ajuste por reciclaje</em>. SISEPUEDE 2.0 lo resolverá.
          </div>
        `
      }
    },

    // ─────────────────────────────── 07 ───────────────────────────────
    {
      id: "circular-economy",
      track: "sectors",
      duration: 25,
      title: {
        en: "Circular Economy — Waste & Wastewater",
        es: "Economía Circular — Residuos y Aguas Residuales"
      },
      summary: {
        en: "WALI (liquid waste driver), WASO (solid waste with first-order decay), TRWW (wastewater treatment pathways).",
        es: "WALI (driver de residuos líquidos), WASO (sólidos con decaimiento de primer orden), TRWW (rutas de tratamiento)."
      },
      content: {
        en: `
          <h2>Three subsectors</h2>
          <ul>
            <li><strong>Liquid Waste (WALI)</strong> — non-emission; produces the demand that TRWW consumes.</li>
            <li><strong>Solid Waste (WASO)</strong> — emits via landfill, incineration, open burning; routes mass to IPPU and ENTC.</li>
            <li><strong>Wastewater Treatment (TRWW)</strong> — centralised and decentralised pathways with sludge, biogas and nitrogen flows.</li>
          </ul>

          <figure>
            <img src="assets/img/diagram_circecon.jpg" alt="Circular Economy diagram">
            <figcaption>Circular Economy subsector flows.</figcaption>
          </figure>

          <h2>Drivers</h2>
          <p>Waste generation is driven primarily by per-person production factors that respond to:</p>
          <ul>
            <li>GDP, GDP/capita, population (socioeconomic).</li>
            <li>Livestock Manure Management (industrial liquid waste from LSMM).</li>
            <li>Agricultural supply-chain losses.</li>
          </ul>

          <h2>Solid Waste (WASO)</h2>
          <p>Each solid-waste category (food, paper, plastic, textiles, …) can route to four final states:</p>
          <ol>
            <li>Incineration / open burning</li>
            <li>Landfill (first-order decay model)</li>
            <li>Recycling (routed to IPPU as recycled feedstock)</li>
            <li>Composting / anaerobic digestion for food and yard waste (biogas → ENTC)</li>
          </ol>

          <div class="callout math">
            <strong>First-order decay:</strong> landfill methane follows the IPCC first-order decay model (FOD). The waste category parameters (DOC, DOC<sub>f</sub>, MCF, F) come from Vol. 5, Ch. 2, Table 2.4 of the 2019 Refinement.
          </div>

          <h3>Industrial parameters</h3>
          <p>Industrial and chemical waste parameters come from Table 2.5 (same chapter). You will see these in <code>attribute_cat_solid_waste.csv</code>.</p>

          <h2>Wastewater Treatment (TRWW)</h2>
          <p>TRWW enumerates treatment pathways:</p>
          <ul>
            <li>Centralised aerobic</li>
            <li>Centralised anaerobic</li>
            <li>Septic</li>
            <li>Latrine</li>
            <li>Open defecation</li>
            <li>None (direct discharge)</li>
          </ul>

          <div class="callout note">
            <strong>Sludge accounting:</strong> IPCC accounting (V5, C6 2019R) splits secondary sludge between decentralised (uncollected) and centralised treatment. SISEPUEDE instead accounts for <em>all</em> sludge emissions in WASO — the Circular Economy sector. This is a deliberate design choice that keeps sludge handling in one place.
          </div>

          <h2>Cross-sector hooks</h2>
          <ul>
            <li><strong>WASO → IPPU</strong>: recycled mass of each category reduces virgin production demand (metals, glass, paper, plastic, rubber &amp; leather, textiles, wood).</li>
            <li><strong>WASO/TRWW → ENTC</strong>: captured biogas becomes a fuel input to NemoMod.</li>
            <li><strong>LSMM → WALI</strong>: industrial liquid waste from manure management.</li>
          </ul>

          <h3>Why non-recyclable process emissions stay in IPPU</h3>
          <p>Recycling of glass, metals, paper, plastic, rubber, leather, textiles and wood has process-level emission effects that are modelled in <strong>IPPU</strong>, not in WASO. WASO only passes mass. This keeps the chain of custody clean: mass flows go through CE, process factors stay with the industrial model.</p>
        `,
        es: `
          <h2>Tres subsectores</h2>
          <ul>
            <li><strong>Residuos Líquidos (WALI)</strong> — no emite; produce la demanda que TRWW consume.</li>
            <li><strong>Residuos Sólidos (WASO)</strong> — emite por relleno, incineración y quema abierta; manda masa a IPPU y ENTC.</li>
            <li><strong>Tratamiento de Aguas (TRWW)</strong> — rutas centralizadas y descentralizadas con flujos de lodo, biogás y nitrógeno.</li>
          </ul>

          <figure>
            <img src="assets/img/diagram_circecon.jpg" alt="Diagrama Economía Circular">
            <figcaption>Flujos entre subsectores de Economía Circular.</figcaption>
          </figure>

          <h2>Drivers</h2>
          <p>La generación de residuos la impulsan principalmente factores de producción per cápita que responden a:</p>
          <ul>
            <li>PIB, PIB/cápita, población.</li>
            <li>Manejo de estiércol (residuo líquido industrial desde LSMM).</li>
            <li>Pérdidas en la cadena agrícola.</li>
          </ul>

          <h2>Residuos Sólidos (WASO)</h2>
          <p>Cada categoría (alimentos, papel, plástico, textiles, …) puede ir a cuatro destinos finales:</p>
          <ol>
            <li>Incineración / quema abierta</li>
            <li>Relleno sanitario (decaimiento de primer orden)</li>
            <li>Reciclaje (va a IPPU como insumo reciclado)</li>
            <li>Compostaje / digestión anaerobia para orgánicos (biogás → ENTC)</li>
          </ol>

          <div class="callout math">
            <strong>Decaimiento de primer orden:</strong> el metano de relleno sigue el modelo FOD del IPCC. Los parámetros (DOC, DOC<sub>f</sub>, MCF, F) vienen de la Tabla 2.4 del Refinamiento 2019.
          </div>

          <h3>Parámetros industriales</h3>
          <p>Los parámetros de residuo industrial y químico vienen de la Tabla 2.5. Los verás en <code>attribute_cat_solid_waste.csv</code>.</p>

          <h2>Tratamiento de Aguas (TRWW)</h2>
          <p>TRWW enumera rutas de tratamiento:</p>
          <ul>
            <li>Aerobio centralizado</li>
            <li>Anaerobio centralizado</li>
            <li>Séptico</li>
            <li>Letrina</li>
            <li>Defecación al aire libre</li>
            <li>Ninguno (descarga directa)</li>
          </ul>

          <div class="callout note">
            <strong>Contabilidad de lodos:</strong> el IPCC (V5, C6 2019R) separa el lodo secundario entre descentralizado y centralizado. SISEPUEDE contabiliza <em>todo</em> el lodo en WASO — una elección de diseño que mantiene el manejo en un solo lugar.
          </div>

          <h2>Conexiones cross-sector</h2>
          <ul>
            <li><strong>WASO → IPPU</strong>: masa reciclada por categoría reduce la demanda de producción virgen (metales, vidrio, papel, plástico, caucho y cuero, textiles, madera).</li>
            <li><strong>WASO/TRWW → ENTC</strong>: biogás capturado se vuelve insumo de NemoMod.</li>
            <li><strong>LSMM → WALI</strong>: residuo líquido industrial de la gestión de estiércol.</li>
          </ul>

          <h3>Por qué las emisiones de proceso del reciclaje quedan en IPPU</h3>
          <p>Reciclar vidrio, metales, papel, plástico, caucho, cuero, textiles y madera tiene efectos de emisión a nivel de proceso que se modelan en <strong>IPPU</strong>, no en WASO. WASO sólo pasa masa. Así la cadena de custodia queda limpia: los flujos de masa van por CE, los factores de proceso quedan en el modelo industrial.</p>
        `
      }
    },

    // ─────────────────────────────── 08 ───────────────────────────────
    {
      id: "energy",
      track: "sectors",
      duration: 40,
      title: {
        en: "Energy — Consumption & Production",
        es: "Energía — Consumo y Producción"
      },
      summary: {
        en: "Nine subsectors, two models: EnergyConsumption (Python) for demand sectors and EnergyProduction (NemoMod/Julia) for electricity + fuel supply.",
        es: "Nueve subsectores, dos modelos: EnergyConsumption (Python) para la demanda y EnergyProduction (NemoMod/Julia) para electricidad y combustibles."
      },
      content: {
        en: `
          <h2>The split: Consumption vs Production</h2>
          <p>SISEPUEDE's Energy sector is the biggest. It is split into two Python classes mirroring two physical realities:</p>
          <ul>
            <li><strong>EnergyConsumption</strong> — subsectors that <em>use</em> fuels: CCSQ, INEN, SCOE, TRNS, TRDE, FGTV, ENFU.</li>
            <li><strong>EnergyProduction</strong> — electricity and fuel supply: ENTC + ENST wrapped around NemoMod.</li>
          </ul>

          <figure>
            <img src="assets/img/diagram_energy.jpg" alt="Energy sector diagram">
            <figcaption>Energy sector integration.</figcaption>
          </figure>

          <h2>Demand vs Consumption</h2>
          <p>SISEPUEDE distinguishes carefully between:</p>
          <ul>
            <li><strong>Demand \\(D_t\\)</strong> — energy at point of use (what the task actually needs).</li>
            <li><strong>Consumption \\(C_t\\)</strong> — total energy delivered to meet the demand, accounting for inefficiency.</li>
          </ul>
          <p>If \\(\\alpha^{(C)}_t\\) is the vector of fuel-mix fractions by <em>consumption</em>, \\(\\alpha^{(D)}_t\\) by <em>demand</em>, and \\(e_t\\) is the vector of efficiencies, then:</p>
          <p>$$D_t = C_t \\, \\left(\\alpha^{(C)}_t \\cdot e_t\\right)$$</p>
          <p>$$\\alpha^{(D)}_{it} = \\frac{\\alpha^{(C)}_{it}\\, e_{it}}{\\alpha^{(C)}_t \\cdot e_t}$$</p>

          <div class="callout note">
            <strong>Why demand fractions?</strong> Users enter <strong>demand fuel-mix fractions</strong>, not consumption fractions. This preserves logical consistency when transformations ("switch 50% of heat to electricity") are expressed as targets on end-use demand rather than on inefficient consumption.
          </div>

          <h2>Projecting demand</h2>
          <p>Given an initial consumption \\(C_0\\), the model estimates \\(D_0\\) and then projects:</p>
          <p>$$D_t = \\sigma_t \\, \\frac{R_t}{R_0} \\, D_0$$</p>
          <p>where \\(R_t\\) is a driver (production, GDP, passenger-km, population, sequestration — depends on subsector) and \\(\\sigma_t\\) is a demand scalar normalised to \\(\\sigma_0 = 1\\). Per fuel:</p>
          <p>$$D_{it} = \\alpha^{(D)}_{it} \\, D_t, \\qquad C_{it} = D_{it} \\, e_{it}^{-1}$$</p>

          <h2>Subsector tour (demand side)</h2>
          <h3>Carbon Capture &amp; Sequestration (CCSQ)</h3>
          <p>Models direct air capture and point-source CCS. Driver is sequestered mass; emission factor is <em>negative</em>.</p>

          <h3>Industrial Energy (INEN)</h3>
          <p>Uses the <code>$CAT-INDUSTRY$</code> category space from IPPU. Driver is production (in tons) or GDP (billion USD, for the <code>other_product_manufacturing</code> catch-all).</p>

          <h3>Stationary Combustion &amp; Other Energy (SCOE)</h3>
          <p>Residential, commercial, municipal and agricultural stationary combustion. Each SCOE category has an <strong>energy efficiency factor</strong>; e.g. 0.8 means 20% of input energy is lost.</p>

          <h3>Transportation (TRNS)</h3>
          <p>Different vehicle categories satisfy transportation demand (TRDE). Methane and N₂O factors for mobile combustion live here (not in ENFU) because they depend on the technology.</p>

          <h3>Transportation Demand (TRDE)</h3>
          <p>Non-emission; organises passenger-km and tonne-km across vehicle modes. Enables mode-shifting transformations.</p>

          <h3>Fugitive Emissions (FGTV)</h3>
          <p>Covers coal, natural gas and oil fugitive emissions along the fuel chain. Uses the <code>$CAT-FUEL$</code> category restricted to <code>fuel_coal</code>, <code>fuel_natural_gas</code>, <code>fuel_oil</code>.</p>

          <h3>Energy Fuels (ENFU)</h3>
          <p>Non-emission reference; defines each fuel's gross calorific value, carbon content and physical properties. All other energy subsectors look up ENFU.</p>

          <h2>Production side: NemoMod</h2>
          <p>Electricity and fuel production is handled by <a href="https://sei-international.github.io/NemoMod.jl/stable/" target="_blank" rel="noopener">NemoMod</a>, an energy-system optimisation framework. SISEPUEDE wraps it with:</p>
          <ul>
            <li><strong>Energy Technology (ENTC)</strong> — generation + fuel refinement + mining.</li>
            <li><strong>Energy Storage (ENST)</strong> — all storage categories are also technologies (needed for NemoMod).</li>
          </ul>

          <figure>
            <img src="assets/img/nemomod_diagram_v2.png" alt="NemoMod diagram">
            <figcaption>NemoMod dimensions wrapped by SISEPUEDE.</figcaption>
          </figure>

          <h3>NemoMod dimensions</h3>
          <p>EMISSIONS, FUEL, MODE, STORAGE, TECHNOLOGY, TIMESLICE, TSGROUP1, TSGROUP2, YEARS. Several of these map 1:1 to SISEPUEDE subsectors: FUEL ↔ ENFU, STORAGE ↔ ENST, TECHNOLOGY ↔ ENTC.</p>

          <h2>Transmission losses</h2>
          <p>SISEPUEDE models transmission loss <em>without</em> an explicit network. Two tweaks:</p>
          <ol>
            <li>The InputActivityRatio of electricity-consuming technologies is inflated by \\(1/(1 - \\text{loss})\\).</li>
            <li>Demands from other energy sectors (passed to NemoMod as <code>SpecifiedAnnualDemand</code>) are also inflated by the same factor.</li>
          </ol>
          <p>Mass balance:</p>
          <p>$$\\frac{\\text{demands} + \\text{exports}}{1 - \\text{transmission loss}} = \\text{production} + \\text{imports}$$</p>

          <div class="callout warn">
            <strong>Imports vs exports:</strong> fuel imports include electricity eventually lost to transmission (represents what originates abroad before loss). Exports do <em>not</em> include transmission loss (represents what reaches the other region).
          </div>
        `,
        es: `
          <h2>La partición: consumo vs producción</h2>
          <p>El sector Energía de SISEPUEDE es el más grande. Se divide en dos clases Python espejo de dos realidades físicas:</p>
          <ul>
            <li><strong>EnergyConsumption</strong> — subsectores que <em>usan</em> combustibles: CCSQ, INEN, SCOE, TRNS, TRDE, FGTV, ENFU.</li>
            <li><strong>EnergyProduction</strong> — oferta eléctrica y de combustibles: ENTC + ENST sobre NemoMod.</li>
          </ul>

          <figure>
            <img src="assets/img/diagram_energy.jpg" alt="Diagrama Energía">
            <figcaption>Integración del sector Energía.</figcaption>
          </figure>

          <h2>Demanda vs Consumo</h2>
          <p>SISEPUEDE distingue cuidadosamente:</p>
          <ul>
            <li><strong>Demanda \\(D_t\\)</strong> — energía en punto de uso (lo que la tarea requiere).</li>
            <li><strong>Consumo \\(C_t\\)</strong> — energía total entregada considerando ineficiencias.</li>
          </ul>
          <p>Si \\(\\alpha^{(C)}_t\\) es la fracción de mezcla por <em>consumo</em>, \\(\\alpha^{(D)}_t\\) por <em>demanda</em> y \\(e_t\\) las eficiencias:</p>
          <p>$$D_t = C_t \\, \\left(\\alpha^{(C)}_t \\cdot e_t\\right)$$</p>
          <p>$$\\alpha^{(D)}_{it} = \\frac{\\alpha^{(C)}_{it}\\, e_{it}}{\\alpha^{(C)}_t \\cdot e_t}$$</p>

          <div class="callout note">
            <strong>¿Por qué fracciones de demanda?</strong> El usuario ingresa <strong>fracciones por demanda</strong>, no por consumo. Esto preserva la consistencia lógica cuando las transformaciones ("cambia 50% del calor a electricidad") se expresan como metas en demanda de uso final, no en el consumo ineficiente.
          </div>

          <h2>Proyección de demanda</h2>
          <p>Dado un consumo inicial \\(C_0\\), el modelo estima \\(D_0\\) y luego proyecta:</p>
          <p>$$D_t = \\sigma_t \\, \\frac{R_t}{R_0} \\, D_0$$</p>
          <p>donde \\(R_t\\) es un driver (producción, PIB, pasajero-km, población, secuestro — según subsector) y \\(\\sigma_t\\) un escalar de demanda con \\(\\sigma_0 = 1\\). Por combustible:</p>
          <p>$$D_{it} = \\alpha^{(D)}_{it} \\, D_t, \\qquad C_{it} = D_{it} \\, e_{it}^{-1}$$</p>

          <h2>Tour de subsectores (demanda)</h2>
          <h3>Captura y Secuestro de Carbono (CCSQ)</h3>
          <p>Modela captura directa del aire y captura en fuente puntual. Driver: masa secuestrada; factor de emisión <em>negativo</em>.</p>

          <h3>Energía Industrial (INEN)</h3>
          <p>Usa el espacio categórico <code>$CAT-INDUSTRY$</code> de IPPU. Driver: producción (toneladas) o PIB (miles de millones USD, para el catch-all <code>other_product_manufacturing</code>).</p>

          <h3>Combustión Estacionaria y Otros (SCOE)</h3>
          <p>Combustión estacionaria residencial, comercial, municipal y agrícola. Cada categoría tiene un <strong>factor de eficiencia</strong>; 0.8 significa que se pierde el 20% de la energía de entrada.</p>

          <h3>Transporte (TRNS)</h3>
          <p>Categorías de vehículo satisfacen la demanda (TRDE). Los factores de metano y N₂O para combustión móvil viven aquí (no en ENFU) porque dependen de la tecnología.</p>

          <h3>Demanda de Transporte (TRDE)</h3>
          <p>No emite; organiza pasajero-km y tonelada-km entre modos. Habilita las transformaciones de cambio modal.</p>

          <h3>Emisiones Fugitivas (FGTV)</h3>
          <p>Fugas de carbón, gas natural y petróleo. Usa <code>$CAT-FUEL$</code> restringido a <code>fuel_coal</code>, <code>fuel_natural_gas</code>, <code>fuel_oil</code>.</p>

          <h3>Combustibles (ENFU)</h3>
          <p>Referencia no emisora; define el poder calorífico, contenido de carbono y propiedades físicas de cada combustible. Los demás subsectores consultan ENFU.</p>

          <h2>Producción: NemoMod</h2>
          <p>La producción eléctrica y de combustibles la maneja <a href="https://sei-international.github.io/NemoMod.jl/stable/" target="_blank" rel="noopener">NemoMod</a>, un marco de optimización energética. SISEPUEDE lo envuelve con:</p>
          <ul>
            <li><strong>Tecnología Energética (ENTC)</strong> — generación + refinación + minería.</li>
            <li><strong>Almacenamiento (ENST)</strong> — todas las categorías de almacenamiento son también tecnologías (requerido por NemoMod).</li>
          </ul>

          <figure>
            <img src="assets/img/nemomod_diagram_v2.png" alt="Diagrama NemoMod">
            <figcaption>Dimensiones de NemoMod envueltas por SISEPUEDE.</figcaption>
          </figure>

          <h3>Dimensiones de NemoMod</h3>
          <p>EMISSIONS, FUEL, MODE, STORAGE, TECHNOLOGY, TIMESLICE, TSGROUP1, TSGROUP2, YEARS. Varias mapean 1:1 a subsectores de SISEPUEDE: FUEL ↔ ENFU, STORAGE ↔ ENST, TECHNOLOGY ↔ ENTC.</p>

          <h2>Pérdidas de transmisión</h2>
          <p>SISEPUEDE modela pérdidas <em>sin</em> red explícita. Dos ajustes:</p>
          <ol>
            <li>El InputActivityRatio de las tecnologías consumidoras de electricidad se infla por \\(1/(1 - \\text{pérdida})\\).</li>
            <li>Las demandas de otros sectores (pasadas a NemoMod como <code>SpecifiedAnnualDemand</code>) también se inflan por el mismo factor.</li>
          </ol>
          <p>Balance de masa:</p>
          <p>$$\\frac{\\text{demandas} + \\text{exportaciones}}{1 - \\text{pérdida transm.}} = \\text{producción} + \\text{importaciones}$$</p>

          <div class="callout warn">
            <strong>Imports vs exports:</strong> las importaciones de combustible incluyen electricidad que luego se perderá en transmisión. Las exportaciones <em>no</em> incluyen pérdida (representan lo que llega al otro lado).
          </div>
        `
      }
    },

    // ─────────────────────────────── 09 ───────────────────────────────
    {
      id: "ippu-socio",
      track: "sectors",
      duration: 20,
      title: {
        en: "IPPU & Socioeconomic Drivers",
        es: "IPPU y Drivers Socioeconómicos"
      },
      summary: {
        en: "Industrial process emissions (HFCs, PFCs, cement clinker, …) and the demographic & economic drivers that feed the whole DAG.",
        es: "Emisiones de proceso industriales (HFC, PFC, clínker de cemento, …) y los drivers demográficos y económicos que alimentan todo el DAG."
      },
      content: {
        en: `
          <h2>IPPU — the industrial model</h2>
          <p>IPPU accounts for <em>non-energy</em> industrial emissions. The IPPU Python class also serves AFOLU and Circular Economy: they ask IPPU for industrial production figures.</p>

          <figure>
            <img src="assets/img/diagram_ippu.jpg" alt="IPPU diagram">
            <figcaption>IPPU categories and gas scope.</figcaption>
          </figure>

          <h3>What IPPU covers</h3>
          <ul>
            <li>Cement clinker CO₂ emissions</li>
            <li>HFCs/PFCs from refrigeration</li>
            <li>HFCs/PFCs/FCs from electronics manufacturing</li>
            <li>N₂O from chemicals production</li>
            <li>Non-energy fuel use (lubricants, paraffin wax)</li>
          </ul>

          <h3>Why electronics is split into four subcategories</h3>
          <p>Different electronics subcategories (TFT-LCD, PV, MEMS, semiconductors) use different fluorinated gases with very different GWPs. Default emission factors come from V3, C6 of the 2019 Refinement, Table 6.6.</p>

          <div class="callout warn">
            <strong>Known future improvement:</strong> IPPU currently models most production in tonnes. SISEPUEDE 2.0 is planned to use more natural units for high-GWP processes (e.g. m² of substrate for electronics).
          </div>

          <h3>Virgin-production and recycling</h3>
          <p>Industrial production is driven by domestic demand and trade, responsive to GDP, GDP/capita and recycling fractions from WASO. For recyclable materials, more recycling → less virgin production → fewer process emissions.</p>

          <h2>Socioeconomic — the drivers</h2>
          <p>The Socioeconomic sector has two subsectors; neither emits.</p>

          <h3>General (GNRL)</h3>
          <p>Population (rural + urban split), household size, workforce ratios, and other demographic metrics that enter the AFOLU demand equations, SCOE building-energy equations, waste-generation equations, etc.</p>

          <h3>Economy (ECON)</h3>
          <p>GDP (total and per capita), sectoral value added, and trade. GDP and GDP/capita are the dominant exogenous drivers in SISEPUEDE — the demand elasticities \\(\\lambda\\) in AFOLU and the demand scalars in Energy multiply directly against the GDP/capita growth rate.</p>

          <div class="callout note">
            <strong>Elasticities everywhere:</strong> SISEPUEDE uses income elasticities (as proxies for own-price elasticities) throughout AFOLU and Energy. The attribute tables record each elasticity by category.
          </div>

          <h2>From socioeconomics to emissions</h2>
          <p>Here is the chain for a single number — tonne-km of road freight in year \\(t\\):</p>
          <ol>
            <li>Population and GDP/capita arrive from ECON/GNRL.</li>
            <li>IPPU multiplies production by GDP-based elasticities.</li>
            <li>TRDE converts production and GDP to tonne-km using mode-specific intensities.</li>
            <li>TRNS converts tonne-km to fuel use via efficiencies.</li>
            <li>ENFU converts fuel use to CO₂, CH₄, N₂O via emission factors.</li>
          </ol>
          <p>Every link is auditable in the <code>MODEL_INPUT</code> and <code>MODEL_OUTPUT</code> tables.</p>
        `,
        es: `
          <h2>IPPU — el modelo industrial</h2>
          <p>IPPU contabiliza emisiones industriales <em>no energéticas</em>. La clase Python de IPPU también sirve a AFOLU y Economía Circular: ambos le piden a IPPU los números de producción industrial.</p>

          <figure>
            <img src="assets/img/diagram_ippu.jpg" alt="Diagrama IPPU">
            <figcaption>Categorías IPPU y alcance de gases.</figcaption>
          </figure>

          <h3>Qué cubre IPPU</h3>
          <ul>
            <li>Emisiones de CO₂ por clínker de cemento</li>
            <li>HFC/PFC de refrigeración</li>
            <li>HFC/PFC/FC de la manufactura electrónica</li>
            <li>N₂O de producción química</li>
            <li>Uso no-energético de combustibles (lubricantes, parafina)</li>
          </ul>

          <h3>Por qué electrónica se parte en cuatro subcategorías</h3>
          <p>Las subcategorías (TFT-LCD, PV, MEMS, semiconductores) usan gases fluorados distintos con GWP muy diferentes. Factores por defecto en V3, C6 del Refinamiento 2019, Tabla 6.6.</p>

          <div class="callout warn">
            <strong>Mejora futura conocida:</strong> IPPU modela la mayoría de la producción en toneladas. SISEPUEDE 2.0 planea usar unidades más naturales en procesos de alto GWP (p. ej. m² de sustrato en electrónica).
          </div>

          <h3>Producción virgen y reciclaje</h3>
          <p>La producción industrial la impulsan la demanda interna y el comercio, con respuesta a PIB, PIB/cápita y fracciones de reciclaje desde WASO. En materiales reciclables, más reciclaje → menos producción virgen → menos emisiones de proceso.</p>

          <h2>Socioeconómico — los drivers</h2>
          <p>El sector Socioeconómico tiene dos subsectores; ninguno emite.</p>

          <h3>General (GNRL)</h3>
          <p>Población (rural + urbana), tamaño del hogar, ratios de fuerza laboral y otras métricas demográficas que entran en las ecuaciones de demanda AFOLU, la energía edificios en SCOE, la generación de residuos, etc.</p>

          <h3>Economía (ECON)</h3>
          <p>PIB (total y per cápita), valor agregado sectorial y comercio. PIB y PIB/cápita son los drivers exógenos dominantes — las elasticidades \\(\\lambda\\) de AFOLU y los escalares de demanda de Energía multiplican directamente la tasa de crecimiento de PIB/cápita.</p>

          <div class="callout note">
            <strong>Elasticidades en todos lados:</strong> SISEPUEDE usa elasticidades-ingreso (como proxy de elasticidad-precio propio) en todo AFOLU y Energía. Las tablas de atributos registran cada elasticidad por categoría.
          </div>

          <h2>De socioeconomía a emisiones</h2>
          <p>Esta es la cadena para un solo número — tonelada-km de carga por carretera en el año \\(t\\):</p>
          <ol>
            <li>Población y PIB/cápita llegan de ECON/GNRL.</li>
            <li>IPPU multiplica producción por elasticidades-PIB.</li>
            <li>TRDE convierte producción y PIB a tonelada-km con intensidades por modo.</li>
            <li>TRNS convierte tonelada-km en uso de combustible con eficiencias.</li>
            <li>ENFU convierte el combustible en CO₂, CH₄, N₂O con factores de emisión.</li>
          </ol>
          <p>Cada enlace es auditable en las tablas <code>MODEL_INPUT</code> y <code>MODEL_OUTPUT</code>.</p>
        `
      }
    },

    // ─────────────────────────────── 10 ───────────────────────────────
    {
      id: "transformers-strategies",
      track: "policy",
      duration: 35,
      title: {
        en: "Transformers, Transformations & Strategies",
        es: "Transformers, Transformaciones y Estrategias"
      },
      summary: {
        en: "The policy layer: how pre-defined Python callables are parameterised in YAML and combined into named strategies.",
        es: "La capa de política: cómo los callables Python predefinidos se parametrizan en YAML y se combinan en estrategias nombradas."
      },
      content: {
        en: `
          <h2>Three different words with precise meanings</h2>
          <ul>
            <li><strong>Transformer</strong> — a Python class/function in <code>sisepuede.transformers.transformers.Transformers</code>. It encodes <em>how</em> to modify baseline trajectories to achieve an outcome. Example: <code>trns_electrify_light_duty_road</code>.</li>
            <li><strong>Transformation</strong> — a <em>parameterisation</em> of a Transformer. Lives in a YAML file. Includes magnitude, categories, ramp.</li>
            <li><strong>Strategy</strong> — a named combination of Transformations, identified by <code>strategy_id</code>, defined in a strategy definition table.</li>
          </ul>

          <h2>Transformer naming convention</h2>
          <p>Transformer codes follow:</p>
          <p><code>TFR:SUBSEC_CODE:ACTION_DESCRIPTION</code></p>
          <p>Action verbs are short:</p>
          <ul>
            <li><code>DEC</code> — Decrease</li>
            <li><code>INC</code> — Increase</li>
            <li><code>SHIFT</code> — Move from one category to another</li>
          </ul>
          <p>Example: <code>TX:AGRC_INC_CONSERVATION_AGRICULTURE</code>.</p>

          <h2>The transformer library</h2>
          <p>SISEPUEDE ships with dozens of transformers across all sectors. A short selection:</p>
          <ul>
            <li>AFOLU: <code>agrc_expand_conservation_agriculture</code>, <code>agrc_improve_rice_management</code>, <code>lndu_increase_reforestation</code>, <code>lndu_stop_deforestation</code>, <code>lvst_reduce_enteric_fermentation</code>, <code>lsmm_increase_biogas_capture</code>, <code>soil_reduce_excess_fertilizer</code>.</li>
            <li>CE: <code>trww_increase_biogas_capture</code>, <code>wali_improve_sanitation_urban</code>, <code>waso_increase_recycling</code>, <code>waso_energy_from_biogas</code>.</li>
            <li>Energy: <code>ccsq_increase_air_capture</code>, <code>entc_renewable_electricity</code>, <code>entc_clean_hydrogen</code>, <code>fgtv_minimize_leaks</code>, <code>inen_fuel_switch_heat</code>, <code>scoe_fuel_switch_electrify</code>, <code>trns_electrify_light_duty_road</code>, <code>trns_mode_shift_freight</code>.</li>
            <li>IPPU: <code>ippu_demand_management</code>, <code>ippu_reduce_cement_clinker</code>, <code>ippu_reduce_hfcs</code>.</li>
            <li>Cross-sector: <code>pflo_industrial_ccs</code>, <code>pflo_healthier_diets</code>.</li>
          </ul>

          <h2>Writing a Transformation (YAML)</h2>
          <p>Transformation files follow the regex <code>transformation_(.\\w*).yaml</code>. A minimal file looks like:</p>
<pre><code class="language-yaml">transformation_id: trns_electrify_ldv_moderate
transformer: trns_electrify_light_duty_road
description: Moderate electrification of light-duty vehicles
magnitude: 0.5
magnitude_type: final_value
vec_implementation_ramp:
  n_tp_ramp: 20
  tp_0_ramp: 0
  a: 1          # sigmoid magnitude
  b: 0          # linear coefficient
  c: 2.71828    # math.e for sigmoid denom.
categories:
  - road_light</code></pre>

          <h3>magnitude_type values</h3>
          <table>
            <thead><tr><th>Value</th><th>Meaning</th></tr></thead>
            <tbody>
              <tr><td><code>baseline_additive</code></td><td>Add magnitude to baseline</td></tr>
              <tr><td><code>baseline_scalar</code></td><td>Multiply baseline by magnitude</td></tr>
              <tr><td><code>baseline_scalar_diff_reduction</code></td><td>Reduce the gap between baseline and upper bound by magnitude</td></tr>
              <tr><td><code>final_value</code></td><td>Magnitude is the final value (achieved via ramp)</td></tr>
              <tr><td><code>final_value_ceiling</code> / <code>final_value_floor</code></td><td>Final value capped above/below the existing one</td></tr>
              <tr><td><code>transfer_value</code> / <code>transfer_scalar_value</code> / <code>transfer_value_to_achieve_magnitude</code></td><td>Move value between source and target categories</td></tr>
              <tr><td><code>vector_specification</code></td><td>Supply the vector directly</td></tr>
            </tbody>
          </table>

          <h2>Implementation ramps</h2>
          <p>The <code>vec_implementation_ramp</code> block controls how fast the transformation reaches full strength:</p>
          <ul>
            <li><code>n_tp_ramp</code> — number of time periods to reach full effect.</li>
            <li><code>tp_0_ramp</code> — last time period with 0 change (baseline).</li>
            <li><code>a</code>, <code>b</code>, <code>c</code>, <code>d</code> — parameters of a sigmoid/linear curve.</li>
          </ul>

          <div class="callout math">
            <strong>Linear ramp:</strong> set <code>a = 0</code>, <code>b = 2</code>, <code>c = 1</code>, <code>d = r_0 + (n - r_0 - r_1)/2</code>.<br>
            <strong>Sigmoid ramp:</strong> set <code>a = 1</code>, <code>b = 0</code>, <code>c = math.e</code>, <code>d = r_0 + (n - r_0 - r_1)/2</code>.
          </div>

          <h2>Strategies</h2>
          <p>A <strong>Strategy</strong> is a named bundle of transformations identified by <code>strategy_id</code>. The numbering convention from <code>attribute_dim_strategy_id.csv</code>:</p>
          <table>
            <thead><tr><th>Range</th><th>Scope</th></tr></thead>
            <tbody>
              <tr><td>0</td><td>Baseline (always present)</td></tr>
              <tr><td>1001–1999</td><td>AFOLU-specific</td></tr>
              <tr><td>2001–2999</td><td>Circular Economy</td></tr>
              <tr><td>3001–3999</td><td>Energy</td></tr>
              <tr><td>4001–4999</td><td>IPPU</td></tr>
              <tr><td>5001–5999</td><td>Cross-sector</td></tr>
            </tbody>
          </table>

          <h3>Strategy directory structure</h3>
<pre><code class="language-bash">strategies/
├── config.yaml                     # baseline + global settings
├── transformations/
│   ├── transformation_electrify_ldv.yaml
│   ├── transformation_reforestation.yaml
│   └── ...
└── strategy_definitions.csv        # strategy_id → list of transformations</code></pre>
          <p>The quickest way to start is to run the SISEPUEDE utility that generates a default set of transformations from Transformer defaults; then you edit YAMLs.</p>

          <h2>Lever vs exogenous</h2>
          <p>SISEPUEDE's <code>SamplingUnits</code> infers which variables are <em>levers</em> (change with strategies) and which are <em>exogenous uncertainties</em>. You never label them manually — the framework compares strategies against the baseline for you.</p>
        `,
        es: `
          <h2>Tres palabras parecidas con significados precisos</h2>
          <ul>
            <li><strong>Transformer</strong> — una clase/función Python en <code>sisepuede.transformers.transformers.Transformers</code>. Codifica <em>cómo</em> modificar las trayectorias base para lograr un resultado. Ejemplo: <code>trns_electrify_light_duty_road</code>.</li>
            <li><strong>Transformación</strong> — una <em>parametrización</em> de un Transformer. Vive en un YAML. Incluye magnitud, categorías, rampa.</li>
            <li><strong>Estrategia</strong> — una combinación nombrada de Transformaciones, identificada por <code>strategy_id</code>, definida en una tabla de estrategias.</li>
          </ul>

          <h2>Convención de nombres de Transformers</h2>
          <p>Los códigos siguen:</p>
          <p><code>TFR:SUBSEC_CODE:ACTION_DESCRIPTION</code></p>
          <p>Verbos cortos:</p>
          <ul>
            <li><code>DEC</code> — Decrement (disminuir)</li>
            <li><code>INC</code> — Increase (aumentar)</li>
            <li><code>SHIFT</code> — Mover de una categoría a otra</li>
          </ul>
          <p>Ejemplo: <code>TX:AGRC_INC_CONSERVATION_AGRICULTURE</code>.</p>

          <h2>La biblioteca de transformers</h2>
          <p>SISEPUEDE trae docenas de transformers en todos los sectores. Una selección:</p>
          <ul>
            <li>AFOLU: <code>agrc_expand_conservation_agriculture</code>, <code>agrc_improve_rice_management</code>, <code>lndu_increase_reforestation</code>, <code>lndu_stop_deforestation</code>, <code>lvst_reduce_enteric_fermentation</code>, <code>lsmm_increase_biogas_capture</code>, <code>soil_reduce_excess_fertilizer</code>.</li>
            <li>CE: <code>trww_increase_biogas_capture</code>, <code>wali_improve_sanitation_urban</code>, <code>waso_increase_recycling</code>, <code>waso_energy_from_biogas</code>.</li>
            <li>Energía: <code>ccsq_increase_air_capture</code>, <code>entc_renewable_electricity</code>, <code>entc_clean_hydrogen</code>, <code>fgtv_minimize_leaks</code>, <code>inen_fuel_switch_heat</code>, <code>scoe_fuel_switch_electrify</code>, <code>trns_electrify_light_duty_road</code>, <code>trns_mode_shift_freight</code>.</li>
            <li>IPPU: <code>ippu_demand_management</code>, <code>ippu_reduce_cement_clinker</code>, <code>ippu_reduce_hfcs</code>.</li>
            <li>Cross-sector: <code>pflo_industrial_ccs</code>, <code>pflo_healthier_diets</code>.</li>
          </ul>

          <h2>Escribir una Transformación (YAML)</h2>
          <p>Los archivos cumplen la regex <code>transformation_(.\\w*).yaml</code>. Un YAML mínimo:</p>
<pre><code class="language-yaml">transformation_id: trns_electrify_ldv_moderate
transformer: trns_electrify_light_duty_road
description: Electrificación moderada de vehículos livianos
magnitude: 0.5
magnitude_type: final_value
vec_implementation_ramp:
  n_tp_ramp: 20
  tp_0_ramp: 0
  a: 1          # magnitud sigmoide
  b: 0          # coef. lineal
  c: 2.71828    # math.e para sigmoide
categories:
  - road_light</code></pre>

          <h3>Valores de magnitude_type</h3>
          <table>
            <thead><tr><th>Valor</th><th>Significado</th></tr></thead>
            <tbody>
              <tr><td><code>baseline_additive</code></td><td>Sumar magnitud al baseline</td></tr>
              <tr><td><code>baseline_scalar</code></td><td>Multiplicar baseline por magnitud</td></tr>
              <tr><td><code>baseline_scalar_diff_reduction</code></td><td>Reducir la brecha baseline-cota superior por magnitud</td></tr>
              <tr><td><code>final_value</code></td><td>Magnitud = valor final (vía rampa)</td></tr>
              <tr><td><code>final_value_ceiling</code> / <code>final_value_floor</code></td><td>Valor final acotado arriba/abajo del existente</td></tr>
              <tr><td><code>transfer_value</code> / <code>transfer_scalar_value</code> / <code>transfer_value_to_achieve_magnitude</code></td><td>Mover valor entre categorías fuente y destino</td></tr>
              <tr><td><code>vector_specification</code></td><td>Dar el vector directamente</td></tr>
            </tbody>
          </table>

          <h2>Rampas de implementación</h2>
          <p>El bloque <code>vec_implementation_ramp</code> controla la velocidad:</p>
          <ul>
            <li><code>n_tp_ramp</code> — número de periodos para pleno efecto.</li>
            <li><code>tp_0_ramp</code> — último periodo con 0 cambio (baseline).</li>
            <li><code>a</code>, <code>b</code>, <code>c</code>, <code>d</code> — parámetros de una curva sigmoide/lineal.</li>
          </ul>

          <div class="callout math">
            <strong>Rampa lineal:</strong> <code>a = 0</code>, <code>b = 2</code>, <code>c = 1</code>, <code>d = r_0 + (n - r_0 - r_1)/2</code>.<br>
            <strong>Rampa sigmoide:</strong> <code>a = 1</code>, <code>b = 0</code>, <code>c = math.e</code>, <code>d = r_0 + (n - r_0 - r_1)/2</code>.
          </div>

          <h2>Estrategias</h2>
          <p>Una <strong>Estrategia</strong> es un paquete nombrado de transformaciones identificado por <code>strategy_id</code>. Convención numérica en <code>attribute_dim_strategy_id.csv</code>:</p>
          <table>
            <thead><tr><th>Rango</th><th>Alcance</th></tr></thead>
            <tbody>
              <tr><td>0</td><td>Baseline (siempre presente)</td></tr>
              <tr><td>1001–1999</td><td>AFOLU</td></tr>
              <tr><td>2001–2999</td><td>Economía Circular</td></tr>
              <tr><td>3001–3999</td><td>Energía</td></tr>
              <tr><td>4001–4999</td><td>IPPU</td></tr>
              <tr><td>5001–5999</td><td>Cross-sector</td></tr>
            </tbody>
          </table>

          <h3>Estructura de directorios de estrategias</h3>
<pre><code class="language-bash">strategies/
├── config.yaml                     # baseline + settings globales
├── transformations/
│   ├── transformation_electrify_ldv.yaml
│   ├── transformation_reforestation.yaml
│   └── ...
└── strategy_definitions.csv        # strategy_id → lista de transformaciones</code></pre>
          <p>La forma más rápida de empezar es correr la utilidad de SISEPUEDE que genera transformaciones por defecto a partir de los defaults de los Transformers; luego editas los YAMLs.</p>

          <h2>Palanca vs exógeno</h2>
          <p>El <code>SamplingUnits</code> de SISEPUEDE infiere qué variables son <em>palancas</em> (cambian con estrategias) y cuáles son <em>incertidumbres exógenas</em>. Nunca las etiquetas a mano — el marco compara estrategias contra el baseline por ti.</p>
        `
      }
    },

    // ─────────────────────────────── 11 ───────────────────────────────
    {
      id: "rdm-xlrm",
      track: "experiments",
      duration: 30,
      title: {
        en: "RDM, XLRM & Dimensions of Analysis",
        es: "RDM, XLRM y Dimensiones de Análisis"
      },
      summary: {
        en: "The Lempert-Popper-Bankes framework operationalised in SISEPUEDE: strategies, futures, designs, time series.",
        es: "El marco Lempert-Popper-Bankes operacionalizado en SISEPUEDE: estrategias, futuros, diseños y series de tiempo."
      },
      content: {
        en: `
          <h2>Robust Decision Making (RDM)</h2>
          <p>RDM asks: <em>given deep uncertainty, which policies perform well across many plausible futures?</em> SISEPUEDE's answer is to run thousands of futures per strategy and let you query the resulting database with any metric you care about.</p>

          <h2>XLRM in SISEPUEDE</h2>
          <p>The <strong>XLRM framework</strong> (Lempert, Popper, Bankes, 2003) organises scenario modelling around four letters:</p>
          <ul>
            <li><strong>X</strong> — eXogenous uncertainties (what we can't control).</li>
            <li><strong>L</strong> — Levers (what we can control).</li>
            <li><strong>R</strong> — Relationships (the models that connect X and L to outcomes).</li>
            <li><strong>M</strong> — Metrics (what we care about).</li>
          </ul>

          <h2>Dimensions of analysis</h2>
          <p>SISEPUEDE maps XLRM to four indexing dimensions:</p>
          <table>
            <thead><tr><th>Dimension</th><th>Column</th><th>Role</th></tr></thead>
            <tbody>
              <tr><td>Strategy</td><td><code>strategy_id</code></td><td>Collection of levers (L)</td></tr>
              <tr><td>Future</td><td><code>future_id</code></td><td>LHS sample from X and from LE (lever effect)</td></tr>
              <tr><td>Design</td><td><code>design_id</code></td><td>How to combine X and LE uncertainty</td></tr>
              <tr><td>Time series</td><td><code>time_series_id</code></td><td>Alternative historical anchors (in development)</td></tr>
            </tbody>
          </table>

          <h2>Futures</h2>
          <p>A <strong>Future</strong> is one Latin Hypercube Sample (LHS) across the X and LE spaces. SISEPUEDE uses stratified LHS so the uncertainty space is maximally covered given a sample budget. Common run sizes are 100, 500 and 1000 futures.</p>

          <div class="callout note">
            <strong>Why LHS?</strong> Compared to pure Monte Carlo, LHS reduces variance for the same number of samples. SISEPUEDE's <code>LHSDesign</code> class builds the matrix.
          </div>

          <h2>Lever effects (LE)</h2>
          <p>SISEPUEDE infers the <em>lever effect</em> implicit in a strategy by comparing the sampled trajectories against the baseline. The design dimension lets you perturb that effect too: what if the policy only achieves 70% of its target?</p>
          <p>Mathematically, given an LHS sample \\(x \\sim U(0,1)\\), the design applies:</p>
          <p>$$d(x) = \\max\\{\\min\\{m x + b, a_1\\}, a_0\\}$$</p>
          <p>The parameters <code>linear_transform_ld_m</code>, <code>linear_transform_ld_b</code>, <code>linear_transform_ld_a_0</code>, <code>linear_transform_ld_a_1</code> live in <code>attribute_dim_design_id.csv</code>.</p>

          <h2>Primary key</h2>
          <p>The primary key of a scenario is a tuple (<code>design_id</code>, <code>future_id</code>, <code>strategy_id</code>, <code>time_series_id</code>). SISEPUEDE stores this as a single <code>primary_id</code> integer. The <code>OrderedDirectProductTable</code> class generates and inverts this mapping without materialising the full table (which would be huge).</p>

          <h3>Useful methods</h3>
          <ul>
            <li><code>OrderedDirectProductTable.get_dims_from_key()</code> — primary id → (design_id, future_id, strategy_id, time_series_id).</li>
            <li><code>OrderedDirectProductTable.get_key_value()</code> — the inverse.</li>
            <li><code>OrderedDirectProductTable.get_indexing_dataframe()</code> — DataFrame for selected dims or keys.</li>
          </ul>

          <h2>Attribute tables for dimensions</h2>
          <ul>
            <li><code>attribute_dim_strategy_id.csv</code> — one row per strategy.</li>
            <li><code>attribute_dim_design_id.csv</code> — one row per design, with the four linear-transform parameters.</li>
            <li><code>attribute_field_design_id.csv</code> — field documentation for designs.</li>
            <li><code>attribute_dim_time_period.csv</code> — time periods available.</li>
          </ul>

          <h2>Sampling Units</h2>
          <p>A <strong>SamplingUnit</strong> is a variable or group of variables that share a single LHS sample. The <code>SamplingUnit</code> class decides per variable whether it is an X or an L and perturbs it accordingly. You never flag this manually — <code>SamplingUnits</code> infers from the input templates.</p>

          <h3>Templates</h3>
          <p>Each region has one template per sector. Three template "flavours":</p>
          <ul>
            <li><strong>Calibrated</strong> — historical data + user-provided projections.</li>
            <li><strong>Uncalibrated</strong> — bare attribute defaults; useful for prototyping.</li>
            <li><strong>Demo</strong> — ships with the package for teaching and testing.</li>
          </ul>

          <h2>Putting it all together</h2>
          <p>A SISEPUEDE experiment ultimately looks like this:</p>
          <ol>
            <li>Choose regions, years, strategies.</li>
            <li>Pick a design that defines how to perturb X and LE.</li>
            <li>Choose <code>n_trials</code> — the LHS budget per strategy.</li>
            <li>Call <code>engine.project()</code>; SISEPUEDE expands the Cartesian product (design × future × strategy), executes the DAG for each, and saves to the database.</li>
            <li>Query <code>MODEL_OUTPUT</code> by primary id or by dimensional slice to compute your metrics (emissions, costs, co-benefits).</li>
          </ol>
        `,
        es: `
          <h2>Robust Decision Making (RDM)</h2>
          <p>RDM pregunta: <em>bajo incertidumbre profunda, ¿qué políticas se desempeñan bien en muchos futuros plausibles?</em> La respuesta de SISEPUEDE es correr miles de futuros por estrategia y permitirte consultar la base de datos resultante con cualquier métrica.</p>

          <h2>XLRM en SISEPUEDE</h2>
          <p>El marco <strong>XLRM</strong> (Lempert, Popper, Bankes, 2003) organiza el modelado por escenarios con cuatro letras:</p>
          <ul>
            <li><strong>X</strong> — incertidumbres eXógenas (lo que no controlamos).</li>
            <li><strong>L</strong> — palancas (Levers, lo que sí controlamos).</li>
            <li><strong>R</strong> — relaciones (los modelos que conectan X y L con los resultados).</li>
            <li><strong>M</strong> — métricas (lo que medimos).</li>
          </ul>

          <h2>Dimensiones de análisis</h2>
          <p>SISEPUEDE mapea XLRM a cuatro dimensiones de indexado:</p>
          <table>
            <thead><tr><th>Dimensión</th><th>Columna</th><th>Rol</th></tr></thead>
            <tbody>
              <tr><td>Estrategia</td><td><code>strategy_id</code></td><td>Colección de palancas (L)</td></tr>
              <tr><td>Futuro</td><td><code>future_id</code></td><td>Muestra LHS en X y en LE (efecto de palanca)</td></tr>
              <tr><td>Diseño</td><td><code>design_id</code></td><td>Cómo combinar incertidumbre X y LE</td></tr>
              <tr><td>Serie temporal</td><td><code>time_series_id</code></td><td>Anclajes históricos alternativos (en desarrollo)</td></tr>
            </tbody>
          </table>

          <h2>Futuros</h2>
          <p>Un <strong>Futuro</strong> es una muestra de Hipercubo Latino (LHS) en los espacios X y LE. SISEPUEDE usa LHS estratificado para maximizar la cobertura. Tamaños comunes: 100, 500 y 1000 futuros.</p>

          <div class="callout note">
            <strong>¿Por qué LHS?</strong> Reduce la varianza frente a Monte Carlo puro para el mismo número de muestras. La clase <code>LHSDesign</code> construye la matriz.
          </div>

          <h2>Efectos de palanca (LE)</h2>
          <p>SISEPUEDE infiere el <em>efecto de palanca</em> implícito en una estrategia comparando trayectorias muestreadas contra el baseline. La dimensión de diseño te deja perturbarlo también: ¿y si la política sólo alcanza el 70% de su meta?</p>
          <p>Dada una muestra LHS \\(x \\sim U(0,1)\\), el diseño aplica:</p>
          <p>$$d(x) = \\max\\{\\min\\{m x + b, a_1\\}, a_0\\}$$</p>
          <p>Los parámetros <code>linear_transform_ld_m</code>, <code>linear_transform_ld_b</code>, <code>linear_transform_ld_a_0</code>, <code>linear_transform_ld_a_1</code> viven en <code>attribute_dim_design_id.csv</code>.</p>

          <h2>Clave primaria</h2>
          <p>La clave primaria de un escenario es una tupla (<code>design_id</code>, <code>future_id</code>, <code>strategy_id</code>, <code>time_series_id</code>). SISEPUEDE la almacena como un entero <code>primary_id</code>. La clase <code>OrderedDirectProductTable</code> genera e invierte el mapeo sin materializar la tabla completa (que sería enorme).</p>

          <h3>Métodos útiles</h3>
          <ul>
            <li><code>OrderedDirectProductTable.get_dims_from_key()</code> — primary id → (design, future, strategy, time_series).</li>
            <li><code>OrderedDirectProductTable.get_key_value()</code> — el inverso.</li>
            <li><code>OrderedDirectProductTable.get_indexing_dataframe()</code> — DataFrame para dimensiones o claves seleccionadas.</li>
          </ul>

          <h2>Tablas de atributos de dimensiones</h2>
          <ul>
            <li><code>attribute_dim_strategy_id.csv</code> — una fila por estrategia.</li>
            <li><code>attribute_dim_design_id.csv</code> — una fila por diseño con los cuatro parámetros de transformación lineal.</li>
            <li><code>attribute_field_design_id.csv</code> — documentación de campos de diseño.</li>
            <li><code>attribute_dim_time_period.csv</code> — periodos disponibles.</li>
          </ul>

          <h2>Sampling Units</h2>
          <p>Una <strong>SamplingUnit</strong> es una variable o grupo de variables que comparten una sola muestra LHS. La clase decide por variable si es X o L y la perturba en consecuencia. No lo marcas a mano — se infiere de las plantillas.</p>

          <h3>Plantillas</h3>
          <p>Cada región tiene una plantilla por sector. Tres "sabores":</p>
          <ul>
            <li><strong>Calibrated</strong> — datos históricos + proyecciones del usuario.</li>
            <li><strong>Uncalibrated</strong> — defaults de atributos; útil para prototipos.</li>
            <li><strong>Demo</strong> — viene con el paquete para enseñar y probar.</li>
          </ul>

          <h2>Todo junto</h2>
          <p>Un experimento SISEPUEDE termina viéndose así:</p>
          <ol>
            <li>Elige regiones, años, estrategias.</li>
            <li>Elige un diseño que defina cómo perturbar X y LE.</li>
            <li>Elige <code>n_trials</code> — el presupuesto LHS por estrategia.</li>
            <li>Llama <code>engine.project()</code>; SISEPUEDE expande el producto cartesiano (diseño × futuro × estrategia), ejecuta el DAG para cada uno y guarda en la base.</li>
            <li>Consulta <code>MODEL_OUTPUT</code> por primary id o por corte dimensional para calcular tus métricas (emisiones, costos, co-beneficios).</li>
          </ol>
        `
      }
    },

    // ─────────────────────────────── 12 ───────────────────────────────
    {
      id: "database-math",
      track: "experiments",
      duration: 30,
      title: {
        en: "The SISEPUEDE Database & Running Models",
        es: "La Base de Datos SISEPUEDE y Ejecución del Modelo"
      },
      summary: {
        en: "AnalysisID, output tables, reproducing a scenario from its primary key, and tying the whole course together.",
        es: "AnalysisID, tablas de salida, reproducir un escenario desde su clave primaria y el cierre del curso."
      },
      content: {
        en: `
          <h2>AnalysisID</h2>
          <p>Every SISEPUEDE run has a unique <strong>AnalysisID</strong>. Its purpose is to make a session reproducible: given the ID, SISEPUEDE can reload the configuration, LHS samples, strategies and outputs. This is critical for publications and regulatory reporting.</p>

          <div class="callout note">
            <strong>Filename quirk:</strong> AnalysisIDs on disk have colons replaced by semicolons (filesystem portability). Reload code handles the swap for you.
          </div>

          <h2>The default tables</h2>
          <table>
            <thead><tr><th>Table</th><th>Content</th></tr></thead>
            <tbody>
              <tr><td><code>ANALYSIS_METADATA</code></td><td>All configuration parameters at run time</td></tr>
              <tr><td><code>ATTRIBUTE_DESIGN</code></td><td>Attribute table for <code>design_id</code></td></tr>
              <tr><td><code>ATTRIBUTE_LHC_SAMPLES_EXOGENOUS_UNCERTAINTIES</code></td><td>Raw LHS samples for X</td></tr>
              <tr><td><code>ATTRIBUTE_LHC_SAMPLES_LEVER_EFFECTS</code></td><td>Raw LHS samples for LE</td></tr>
              <tr><td><code>ATTRIBUTE_PRIMARY</code></td><td>Defines the primary key for runs — stored lazily via <code>OrderedDirectProductTable</code></td></tr>
              <tr><td><code>ATTRIBUTE_STRATEGY</code></td><td>Strategy names, baseline flag, strategy_id</td></tr>
              <tr><td><code>MODEL_BASE_INPUT_DATABASE</code></td><td>Baseline-future inputs: long by (region, strategy, time_period), wide by variable</td></tr>
              <tr><td><code>MODEL_INPUT</code></td><td>Full inputs per scenario (optional — off by default to save space)</td></tr>
              <tr><td><code>MODEL_OUTPUT</code></td><td>Outputs per scenario: long by (primary_id, region, time_period)</td></tr>
            </tbody>
          </table>

          <h2>Reproducing a scenario</h2>
          <p>Given a <code>primary_id</code>, SISEPUEDE can rebuild the full input DataFrame on the fly — no need to store <code>MODEL_INPUT</code> at scale.</p>
<pre><code class="language-python">df = engine.generate_scenario_database_from_primary_key(
    primary_id=1234
)
# df has the same shape and content as a MODEL_INPUT row for that id.</code></pre>

          <h2>Running SISEPUEDE</h2>
          <p>From the manager class:</p>
<pre><code class="language-python">from sisepuede.manager.sisepuede import SISEPUEDE

engine = SISEPUEDE(
    "mex_2025_rdm",
    regions=["mexico"],
    n_trials=500,
    time_period_u0=0,
    time_period_tf=35
)
engine.project(
    strategies_run=[0, 3001, 1001, 5001],
    include_sql=True
)</code></pre>
          <p>Common parameters:</p>
          <ul>
            <li><code>strategies_run</code> — subset to run; omit to run all.</li>
            <li><code>include_sql</code> — write intermediate NemoMod SQL databases to disk (useful for debugging).</li>
            <li><code>chunk_size</code> — how many scenarios per batch before flushing to disk.</li>
            <li><code>return_runtime</code> — attach wall-clock info to each run.</li>
          </ul>

          <h2>Reading outputs</h2>
<pre><code class="language-python">df = engine.read_output_table()
df.columns[:10]
# ['primary_id', 'region', 'time_period',
#  'emission_co2_afolu', 'emission_ch4_afolu', 'emission_n2o_afolu',
#  'emission_co2_ce', 'emission_ch4_ce', ...]</code></pre>
          <p>Column names mirror the schema language. Group by <code>strategy_id</code> (recovered from <code>primary_id</code> via <code>OrderedDirectProductTable</code>) to compare strategies; group by <code>future_id</code> to compute percentiles.</p>

          <h2>Working across the DAG</h2>
          <p>Several derived tables can be generated post-hoc using functions that scan <code>MODEL_OUTPUT</code>. Examples:</p>
          <ul>
            <li>CO₂e-aggregated emissions per sector.</li>
            <li>Fuel-mix evolution by region.</li>
            <li>Land-use areas over time per strategy.</li>
          </ul>

          <h2>Configuration file</h2>
          <p>The analytical parameters file (<code>sisepuede.config</code>) exposes:</p>
          <ul>
            <li>Default output units.</li>
            <li>GWP time horizon.</li>
            <li>Time period bounds.</li>
            <li>LHS seed.</li>
            <li>Historical anchor assumptions for Circular Economy and Energy.</li>
            <li>Reallocation directionality for LNDU.</li>
          </ul>
          <p>The experimental parameters file governs sampling (<code>n_trials</code>, design seeds, etc.).</p>

          <h2>Economic impact (external)</h2>
          <p>SISEPUEDE currently requires an external R script, <strong>SISEPUEDE-CBA</strong>, to estimate costs and benefits of transformations. Integration into the main Python framework is in progress.</p>

          <h2>Where to go next</h2>
          <ul>
            <li>Read the <a href="https://sisepuede.readthedocs.io/en/latest/" target="_blank" rel="noopener">official documentation</a> as a reference once you have the mental model this course gave you.</li>
            <li>Browse <code>sisepuede/attributes/</code> in the installed package — now you can read every CSV.</li>
            <li>Open an issue or discussion on the <a href="https://github.com/jcsyme/sisepuede" target="_blank" rel="noopener">GitHub repository</a> if you find a gap or want to contribute.</li>
            <li>Try the IPCC source volumes themselves: V4 (AFOLU), V5 (Waste), V2 (Energy), V3 (IPPU). You will recognise the equations.</li>
          </ul>

          <div class="callout math">
            <strong>Course closure:</strong> you can now trace any emission number in a MODEL_OUTPUT row back to a transformation YAML, an attribute table and an IPCC equation. That is a full lap around SISEPUEDE.
          </div>
        `,
        es: `
          <h2>AnalysisID</h2>
          <p>Toda corrida de SISEPUEDE tiene un <strong>AnalysisID</strong> único. Su propósito es la reproducibilidad: dado el ID, SISEPUEDE puede recargar configuración, muestras LHS, estrategias y salidas. Crítico para publicaciones y reportes regulatorios.</p>

          <div class="callout note">
            <strong>Peculiaridad del nombre:</strong> los AnalysisID en disco reemplazan los dos puntos por punto y coma (compatibilidad de sistema de archivos). El código de recarga lo maneja por ti.
          </div>

          <h2>Las tablas por defecto</h2>
          <table>
            <thead><tr><th>Tabla</th><th>Contenido</th></tr></thead>
            <tbody>
              <tr><td><code>ANALYSIS_METADATA</code></td><td>Todos los parámetros de configuración en tiempo de corrida</td></tr>
              <tr><td><code>ATTRIBUTE_DESIGN</code></td><td>Tabla de atributos para <code>design_id</code></td></tr>
              <tr><td><code>ATTRIBUTE_LHC_SAMPLES_EXOGENOUS_UNCERTAINTIES</code></td><td>Muestras LHS crudas de X</td></tr>
              <tr><td><code>ATTRIBUTE_LHC_SAMPLES_LEVER_EFFECTS</code></td><td>Muestras LHS crudas de LE</td></tr>
              <tr><td><code>ATTRIBUTE_PRIMARY</code></td><td>Define la clave primaria — almacenada perezosamente vía <code>OrderedDirectProductTable</code></td></tr>
              <tr><td><code>ATTRIBUTE_STRATEGY</code></td><td>Nombres de estrategias, flag de baseline, strategy_id</td></tr>
              <tr><td><code>MODEL_BASE_INPUT_DATABASE</code></td><td>Entradas del futuro baseline: largo por (region, strategy, time_period), ancho por variable</td></tr>
              <tr><td><code>MODEL_INPUT</code></td><td>Entradas completas por escenario (opcional — apagado por defecto para ahorrar espacio)</td></tr>
              <tr><td><code>MODEL_OUTPUT</code></td><td>Salidas por escenario: largo por (primary_id, region, time_period)</td></tr>
            </tbody>
          </table>

          <h2>Reproducir un escenario</h2>
          <p>Dado un <code>primary_id</code>, SISEPUEDE puede reconstruir el DataFrame completo de entrada al vuelo — no necesitas guardar <code>MODEL_INPUT</code> a escala.</p>
<pre><code class="language-python">df = engine.generate_scenario_database_from_primary_key(
    primary_id=1234
)
# df tiene la misma forma y contenido que una fila de MODEL_INPUT.</code></pre>

          <h2>Ejecutar SISEPUEDE</h2>
          <p>Desde el manager:</p>
<pre><code class="language-python">from sisepuede.manager.sisepuede import SISEPUEDE

engine = SISEPUEDE(
    "mex_2025_rdm",
    regions=["mexico"],
    n_trials=500,
    time_period_u0=0,
    time_period_tf=35
)
engine.project(
    strategies_run=[0, 3001, 1001, 5001],
    include_sql=True
)</code></pre>
          <p>Parámetros comunes:</p>
          <ul>
            <li><code>strategies_run</code> — subconjunto a correr; omite para todas.</li>
            <li><code>include_sql</code> — guarda las bases SQL de NemoMod (útil para debug).</li>
            <li><code>chunk_size</code> — cuántos escenarios por lote antes de volcar a disco.</li>
            <li><code>return_runtime</code> — adjunta tiempo de reloj a cada corrida.</li>
          </ul>

          <h2>Leer salidas</h2>
<pre><code class="language-python">df = engine.read_output_table()
df.columns[:10]
# ['primary_id', 'region', 'time_period',
#  'emission_co2_afolu', 'emission_ch4_afolu', 'emission_n2o_afolu',
#  'emission_co2_ce', 'emission_ch4_ce', ...]</code></pre>
          <p>Los nombres de columnas espejan el lenguaje de esquemas. Agrupa por <code>strategy_id</code> (recuperado desde <code>primary_id</code> vía <code>OrderedDirectProductTable</code>) para comparar estrategias; agrupa por <code>future_id</code> para calcular percentiles.</p>

          <h2>Trabajar a lo largo del DAG</h2>
          <p>Varias tablas derivadas pueden generarse post-hoc con funciones que recorren <code>MODEL_OUTPUT</code>. Ejemplos:</p>
          <ul>
            <li>Emisiones agregadas en CO₂e por sector.</li>
            <li>Evolución de la mezcla de combustibles por región.</li>
            <li>Áreas de uso del suelo en el tiempo por estrategia.</li>
          </ul>

          <h2>Archivo de configuración</h2>
          <p>El archivo de parámetros analíticos (<code>sisepuede.config</code>) expone:</p>
          <ul>
            <li>Unidades de salida por defecto.</li>
            <li>Horizonte GWP.</li>
            <li>Límites de periodos.</li>
            <li>Semilla LHS.</li>
            <li>Supuestos históricos para Economía Circular y Energía.</li>
            <li>Direccionalidad de realocación para LNDU.</li>
          </ul>
          <p>El archivo de parámetros experimentales gobierna el muestreo (<code>n_trials</code>, semillas, etc.).</p>

          <h2>Impacto económico (externo)</h2>
          <p>SISEPUEDE actualmente requiere un script R externo, <strong>SISEPUEDE-CBA</strong>, para estimar costos y beneficios. La integración al Python principal está en progreso.</p>

          <h2>Hacia dónde seguir</h2>
          <ul>
            <li>Lee la <a href="https://sisepuede.readthedocs.io/en/latest/" target="_blank" rel="noopener">documentación oficial</a> como referencia una vez tengas el modelo mental de este curso.</li>
            <li>Navega <code>sisepuede/attributes/</code> en tu instalación — ahora puedes leer cada CSV.</li>
            <li>Abre un issue o una discussion en el <a href="https://github.com/jcsyme/sisepuede" target="_blank" rel="noopener">repositorio</a> si encuentras un hueco o quieres contribuir.</li>
            <li>Prueba los volúmenes IPCC originales: V4 (AFOLU), V5 (Residuos), V2 (Energía), V3 (IPPU). Reconocerás las ecuaciones.</li>
          </ul>

          <div class="callout math">
            <strong>Cierre del curso:</strong> ya puedes rastrear cualquier número de emisión en una fila de MODEL_OUTPUT hasta una transformación YAML, una tabla de atributos y una ecuación del IPCC. Esa es una vuelta completa a SISEPUEDE.
          </div>
        `
      }
    }
  ]
};
