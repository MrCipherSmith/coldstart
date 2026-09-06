import type { IllustrationKind } from "@/components/Illustration";
import type { TX } from "@/lib/tx";

/**
 * The descent. Each layer is one answer to "where does an agent's context live",
 * and each `wall` is the thing that answer could not do — which is why there is
 * another layer under it.
 */

export type Shot = {
  src: string;
  width: number;
  height: number;
  alt: string;
  caption: TX;
  /** A phone screenshot needs a phone-shaped slot, not half the viewport. */
  portrait?: boolean;
};

export type Layer = {
  id: string;
  /** Rail readout while this layer is centred. */
  depth: TX;
  /** How much the page claims to know by the time you are standing here. */
  facts: number;
  kicker: TX;
  /** Named only where the name is worth saying. */
  project?: string;
  heading: TX;
  body: TX;
  wall?: { label: TX; text: TX };
  shots?: Shot[];
  /** Layers with nothing to screenshot get a diagram that makes the argument. */
  figure?: { kind: IllustrationKind; caption: TX };
  /** Part of the one continuous body of rock. */
  bedrock?: boolean;
};

const WALL_BOTTOM: TX = {
  en: "where it bottomed out",
  ru: "где упёрлось",
};
const WALL_OPEN: TX = {
  en: "what it still does not solve",
  ru: "чего он по-прежнему не решает",
};

export const LAYERS: Layer[] = [
  {
    id: "documentation",
    depth: { en: "2025-11", ru: "2025-11" },
    facts: 7,
    kicker: { en: "layer 01 · documentation", ru: "слой 01 · документация" },
    heading: {
      en: "First answer: index the docs and serve them back.",
      ru: "Первый ответ: проиндексировать документацию и отдавать её обратно.",
    },
    body: {
      en: "Postgres with pgvector, an async task queue, semantic search over swappable embedding providers. Built at the exact moment <b>16,000 MCP servers</b> existed and the whole industry answered every context problem the same way: build another server for it.",
      ru: "Postgres с pgvector, асинхронная очередь задач, семантический поиск на сменных провайдерах эмбеддингов. Построено ровно тогда, когда в мире было <b>16 000 MCP-серверов</b>, и вся индустрия отвечала на любую проблему с контекстом одинаково: построй под неё ещё один сервер.",
    },
    wall: {
      label: WALL_BOTTOM,
      text: {
        en: "Documentation was never what agents got wrong. They got the project’s own conventions wrong.",
        ru: "Документация никогда не была тем, в чём агенты ошибались. Они ошибались в конвенциях самого проекта.",
      },
    },
    figure: {
      kind: "vectors",
      caption: {
        en: "the index answers the question it was asked · not the one that mattered",
        ru: "индекс отвечает на заданный вопрос · а не на тот, который имел значение",
      },
    },
  },
  {
    id: "standards",
    depth: { en: "2026-01", ru: "2026-01" },
    facts: 11,
    kicker: { en: "layer 02 · standards", ru: "слой 02 · стандарты" },
    heading: {
      en: "So build the same server a second time.",
      ru: "Значит, собрать тот же сервер во второй раз.",
    },
    body: {
      en: "Docs swapped for language standards, a review pass driven by them, an admin panel, a crawler. The shape was disproved <b>by construction, not by argument</b> — which is the only way anyone actually stops believing something.",
      ru: "Документация заменена на стандарты языка, поверх — проход ревью по ним, админка, краулер. Форма опровергнута <b>постройкой, а не спором</b> — единственный способ, которым кто-либо действительно перестаёт во что-то верить.",
    },
    wall: {
      label: WALL_BOTTOM,
      text: {
        en: "Retrieval is not behaviour. An agent that can look a rule up still does not follow it.",
        ru: "Извлечение — не поведение. Агент, умеющий найти правило, всё ещё ему не следует.",
      },
    },
    figure: {
      kind: "twice",
      caption: {
        en: "fourteen months apart · one box different",
        ru: "четырнадцать месяцев спустя · отличается один блок",
      },
    },
  },
  {
    id: "procedure",
    depth: { en: "2026-02", ru: "2026-02" },
    facts: 19,
    kicker: { en: "layer 03 · procedure", ru: "слой 03 · процедура" },
    project: "goodai-base",
    heading: {
      en: "If lookup does not change behaviour, procedure does.",
      ru: "Если поиск не меняет поведение — его меняет процедура.",
    },
    body: {
      en: "70 skills and ~30 rules behind one installer that syncs seven agent tools. Underneath it, six phases of research into <b>agent discipline</b> — including one called <b>anti-rationalization</b>: stopping an agent from talking itself out of the work it was given.",
      ru: "70 скиллов и ~30 правил за одним инсталлером, синхронящим семь агентских инструментов. Под ними — шесть фаз исследования <b>дисциплины агента</b>, среди них фаза под названием <b>анти-рационализация</b>: не дать агенту уговорить себя не делать выданную работу.",
    },
    wall: {
      label: WALL_OPEN,
      text: {
        en: "Skills are portable. Project knowledge is not. Every repository still started cold.",
        ru: "Навыки переносимы. Знание проекта — нет. Каждый репозиторий всё равно начинался холодным.",
      },
    },
  },
  {
    id: "supervision",
    depth: { en: "2026-04", ru: "2026-04" },
    facts: 26,
    kicker: { en: "layer 04 · supervision", ru: "слой 04 · надзор" },
    project: "helyx",
    heading: {
      en: "If agents run for hours, the human needs somewhere to stand.",
      ru: "Если агенты работают часами, человеку нужно где-то стоять.",
    },
    body: {
      en: "One forum topic per project, a persistent session behind each, short- and long-term memory with a project scanner, voice, polls, and live CLI progress and permission prompts routed to the topic that asked. Sessions survive in <b>tmux</b>, reachable through a tunnel from a phone. <b>{{helyx.commits}} commits.</b>",
      ru: "Один форум-топик на проект, за каждым — постоянная сессия, короткая и долгая память со сканером проекта, голос, опросы, живой прогресс CLI и запросы разрешений в тот топик, который их вызвал. Сессии живут в <b>tmux</b> и достаются через туннель с телефона. <b>{{helyx.commits}} коммитов.</b>",
    },
    wall: {
      label: WALL_OPEN,
      text: {
        en: "Supervising an agent that does not understand the repository only moves the ignorance closer to you.",
        ru: "Надзор за агентом, который не понимает репозиторий, лишь придвигает незнание ближе к тебе.",
      },
    },
    shots: [
      {
        src: "/shots/helyx-topics.webp",
        width: 494,
        height: 1024,
        portrait: true,
        alt: "A Telegram forum group where each project — helyx, keryx, goodai-base — is its own topic",
        caption: {
          en: "one topic per project",
          ru: "по топику на проект",
        },
      },
      {
        src: "/shots/helyx-allow.webp",
        width: 494,
        height: 1024,
        portrait: true,
        alt: "The agent recalls a past decision from memory, then asks permission for a destructive migration with Yes / Always / No",
        caption: {
          en: "it recalls, then it asks — and takes no for an answer",
          ru: "вспоминает, потом спрашивает — и принимает отказ",
        },
      },
    ],
  },
  {
    id: "brain",
    depth: { en: "2026-07", ru: "2026-07" },
    facts: 38,
    bedrock: true,
    kicker: { en: "bedrock · i · the brain", ru: "коренная порода · i · мозг" },
    project: "keryx",
    heading: {
      en: "Stop shipping context as a service. Put it in the repository.",
      ru: "Перестать поставлять контекст сервисом. Положить его в репозиторий.",
    },
    body: {
      en: "A versioned <b>.metaproject/</b>, all Markdown and JSON, all readable in a diff. A language-aware dependency graph for TS/JS, Java and Python — cycles, orphans, shortest paths, affected-set blast radius, a PageRank repo map under a token budget, an optional tree-sitter symbol and call graph. An architecture wiki with code↔wiki backlinks. And a memory with <b>eleven typed entry kinds</b>, bitemporal <b>as-of</b> queries, non-destructive supersede, trigram dedup and consolidation into patterns — a Mem0-shaped memory rebuilt so that it never needs a model to work at all.",
      ru: "Версионируемый <b>.metaproject/</b>: только Markdown и JSON, всё читается в диффе. Языково-осведомлённый граф зависимостей для TS/JS, Java и Python — циклы, сироты, кратчайшие пути, радиус поражения, PageRank-карта репозитория под токен-бюджет, опциональный граф символов и вызовов на tree-sitter. Архитектурная вики с обратными ссылками код↔вики. И память с <b>одиннадцатью типами записей</b>, битемпоральными запросами <b>на дату</b>, недеструктивным замещением, дедупом по триграммам и свёрткой в паттерны — память формы Mem0, пересобранная так, чтобы вообще не нуждаться в модели.",
    },
    shots: [
      {
        src: "/shots/dashboard.webp",
        width: 1280,
        height: 853,
        alt: "The keryx dashboard: a health score, attention signals and the enabled modules",
        caption: {
          en: "<b>keryx dash</b> · the read-only control surface, re-shot on {{dash.shotOn}}: health {{dash.health}}, {{dash.findings}} findings, {{dash.graphFiles}} graph files, {{dash.wikiPages}} wiki pages, {{dash.memoryEntries}} memory entries, {{dash.modules}} modules",
          ru: "<b>keryx dash</b> · read-only панель управления, снята {{dash.shotOn}}: здоровье {{dash.health}}, {{dash.findings}} findings, {{dash.graphFiles}} файлов графа, {{dash.wikiPages}} страниц вики, {{dash.memoryEntries}} записей памяти, {{dash.modules}} модулей",
        },
      },
    ],
  },
  {
    id: "harness",
    depth: { en: "2026-07", ru: "2026-07" },
    facts: 52,
    bedrock: true,
    kicker: { en: "bedrock · ii · the harness", ru: "коренная порода · ii · рантайм" },
    project: "keryx",
    heading: {
      en: "Then take the runtime too.",
      ru: "Затем забрать себе и рантайм.",
    },
    body: {
      en: "A provider-neutral loop — Anthropic, Ollama, any OpenAI-compatible gateway, and an offline fake provider so a run can be deterministic. Durable JSONL sessions that resume across a restart and <b>fork</b> with their ancestry intact. A policy engine with <b>three answers, not two</b> — allow, ask, deny — over seven risk classes: read, write, shell, network, credential, delegate, destructive. Shell and destructive are default-deny. Every turn runs under a budget of 48 unique tool signatures, at most 40 of them reads.",
      ru: "Провайдер-нейтральный цикл — Anthropic, Ollama, любой OpenAI-совместимый шлюз и офлайновый фейковый провайдер, чтобы прогон был детерминированным. Устойчивые JSONL-сессии, переживающие перезапуск и умеющие <b>ветвиться</b> с сохранением родословной. Policy engine с <b>тремя ответами, а не двумя</b> — allow, ask, deny — по семи классам риска: чтение, запись, шелл, сеть, доступы, делегирование, разрушение. Шелл и разрушение запрещены по умолчанию. Каждый ход идёт под бюджетом в 48 уникальных сигнатур инструментов, из них не больше 40 на чтение.",
    },
    shots: [
      {
        src: "/shots/shell.webp",
        width: 1160,
        height: 760,
        alt: "The keryx shell answering a blast-radius question with the graph_affected tool",
        caption: {
          en: "<b>keryx shell</b> · a blast-radius question answered through the project graph — one tool call, 12.1 seconds",
          ru: "<b>keryx shell</b> · вопрос о радиусе поражения, отвеченный через граф проекта — один вызов инструмента, 12,1 секунды",
        },
      },
    ],
  },
  {
    id: "containment",
    depth: { en: "2026-08", ru: "2026-08" },
    facts: 63,
    bedrock: true,
    kicker: { en: "bedrock · iii · containment", ru: "коренная порода · iii · заключение" },
    project: "keryx",
    heading: {
      en: "A policy is a promise. A kernel is not.",
      ru: "Политика — это обещание. Ядро — нет.",
    },
    body: {
      en: "Underneath the policy engine sits an OS sandbox: Seatbelt on macOS, bubblewrap on Linux. Network off or on, a loopback domain allowlist, credential masking behind a per-run sentinel, TLS termination where the masking demands it. When a launcher or a posture is missing it <b>fails closed</b> rather than quietly doing less — which is the whole difference between a security feature and a security theatre.",
      ru: "Под policy engine — песочница операционной системы: Seatbelt на macOS, bubblewrap на Linux. Сеть выключена или включена, петлевой список разрешённых доменов, маскирование доступов за пораундовым часовым, терминация TLS там, где маскирование этого требует. Если лаунчера или позы нет — она <b>падает закрытой</b>, а не тихо делает меньше. В этом вся разница между защитой и её имитацией.",
    },
    shots: [
      {
        src: "/shots/shell-ask.webp",
        width: 1160,
        height: 760,
        alt: "The keryx shell asking the user a structured question with selectable options",
        caption: {
          en: "<b>ask</b> · the middle answer of the policy engine: it stops and asks with structured options instead of guessing",
          ru: "<b>ask</b> · средний ответ policy engine: он останавливается и спрашивает структурированными вариантами вместо того, чтобы угадать",
        },
      },
    ],
  },
  {
    id: "proof",
    depth: { en: "2026-09", ru: "2026-09" },
    facts: 74,
    bedrock: true,
    kicker: { en: "bedrock · iv · proof", ru: "коренная порода · iv · доказательство" },
    project: "keryx",
    heading: {
      en: "An agent does not get to say it is finished.",
      ru: "Агент не имеет права сказать, что он закончил.",
    },
    body: {
      en: "Completion is <b>gated on evidence</b>: a run that cannot produce what its flow requires does not get to claim it did. A run can be recorded as a recomputable hash surface and replayed against a fixture, which names the exact field that moved. The security scanner ships a <b>labeled red-team corpus</b> and fails the build when any detector breaches its committed false-negative threshold. And there is a measurement rig underneath all of it — gold sets, ablation runs, retrieval scoring, leakage checks — built to find out <b>whether the context layer actually helps</b>, rather than to assume it does. The repository this is measured on stands at <b>{{keryx.commits}} commits</b> and <b>{{keryx.releases}} tagged releases</b>, with <b>{{npm.versions}} versions</b> published to npm, latest <b>{{npm.latest}}</b>.",
      ru: "Завершение открывается <b>доказательством</b>: прогон, не сумевший выдать то, что требует его флоу, не получает права заявить, что справился. Прогон записывается как пересчитываемая хеш-поверхность и проигрывается против фикстуры, которая называет ровно то поле, которое сдвинулось. У сканера безопасности есть <b>размеченный red-team корпус</b>, и сборка падает, если любой детектор пробил зафиксированный порог ложноотрицательных. А под всем этим — измерительный стенд: эталонные наборы, абляции, оценка извлечения, проверки утечки — построенный, чтобы выяснить, <b>помогает ли слой контекста на самом деле</b>, а не чтобы предположить, что помогает. Репозиторий, на котором это измеряется, стоит на <b>{{keryx.commits}} коммитах</b> и <b>{{keryx.releases}} тегах релизов</b>, в npm опубликовано <b>{{npm.versions}} версий</b>, последняя — <b>{{npm.latest}}</b>.",
    },
    shots: [
      {
        src: "/shots/shell-deepseek.webp",
        width: 1160,
        height: 680,
        alt: "The same keryx shell running the same tools against a different provider",
        caption: {
          en: "<b>--provider</b> · the same loop, the same tools, the same policy — with the model swapped out from under it",
          ru: "<b>--provider</b> · тот же цикл, те же инструменты, та же политика — с заменённой под ними моделью",
        },
      },
    ],
  },
  {
    id: "restraint",
    depth: { en: "—", ru: "—" },
    facts: 81,
    kicker: { en: "layer 06 · restraint", ru: "слой 06 · сдержанность" },
    heading: {
      en: "Four capabilities that ship switched off.",
      ru: "Четыре возможности, выпущенные в положении «выключено».",
    },
    body: {
      en: "<b>A shared work context</b> — a budgeted Facts / Work / Know-how read, and a wrap-up proposing what a session learned. Promotion into real project knowledge always passes a human, and a security-flagged proposal refuses to pass until someone records that they read the findings. · <b>A scratchpad any agent can borrow</b> — an agent from another vendor entirely can open a working slate inside your project and close it into your review pipeline. · <b>Someone else’s CLI as a child process</b> — a bounded, read-only task handed to a vendor coding agent inside a disposable worktree with a stripped environment. · <b>Agent discipline as a research programme</b> — six phases, of which the sharpest is anti-rationalization.",
      ru: "<b>Общий контекст работы</b> — бюджетированное чтение «Факты / Работа / Знание» и свёртка, предлагающая то, что узнала сессия. Повышение до настоящего знания проекта всегда проходит через человека, а предложение с отметкой безопасности не проходит, пока кто-то не зафиксирует, что прочитал находки. · <b>Черновик, который можно одолжить</b> — агент совсем другого вендора открывает рабочий лист внутри твоего проекта и закрывает его в твой же конвейер ревью. · <b>Чужой CLI как дочерний процесс</b> — ограниченная задача только на чтение, выданная вендорскому агенту в одноразовом воркtree со срезанным окружением. · <b>Дисциплина агента как исследовательская программа</b> — шесть фаз, из которых самая острая называется анти-рационализация.",
    },
    wall: {
      label: { en: "why that matters", ru: "почему это важно" },
      text: {
        en: "Every one is off by default and says so in its own documentation — including the one whose author writes plainly that it has never been run against a live vendor process, and that no vendor sanction is claimed. Shipping power with the switch off, and naming what you have not proved, is rarer than shipping the power.",
        ru: "Каждая выключена по умолчанию и прямо пишет об этом в собственной документации — включая ту, про которую автор честно указывает, что она ни разу не запускалась против живого вендорского процесса и никакой санкции вендора не заявлено. Выпустить силу с выключателем в положении «выкл» и назвать вслух то, что не доказано, встречается реже, чем выпустить силу.",
      },
    },
    figure: {
      kind: "switches",
      caption: {
        en: "shipped, documented, and switched off",
        ru: "выпущено, задокументировано и выключено",
      },
    },
  },
];

export const PROVENANCE: TX = {
  en: "Every figure above about these repositories was read from the GitHub and npm APIs on {{read.on}}, not typed in. The snapshot is committed next to the code and refreshed nightly; if a number here is wrong, the source is wrong with it.",
  ru: "Каждое число выше об этих репозиториях прочитано из API GitHub и npm {{read.on}}, а не вписано руками. Снапшот лежит в репозитории рядом с кодом и обновляется каждую ночь; если число здесь неверно, значит неверен и источник.",
};

export const COLD_OPEN: TX = {
  en: "An agent just opened your repository. It knows nothing about it.",
  ru: "Агент только что открыл твой репозиторий. Он не знает о нём ничего.",
};

export const FICTION_LINK: TX = {
  en: "Read the chapter",
  ru: "Прочитать главу",
};

export const CLOSING: TX = {
  en: "Everything above this line is <b>allow / ask / deny</b>, evidence gates, a sandbox that fails closed, and a loop that runs on a model you host yourself. Now you know what it is for.",
  ru: "Всё, что выше этой черты — это <b>allow / ask / deny</b>, гейты доказательства, песочница, падающая закрытой, и цикл, работающий на модели, которую ты держишь у себя. Теперь понятно, зачем.",
};
