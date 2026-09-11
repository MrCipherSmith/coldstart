import { Decode } from "@/components/Decode";
import { Descent } from "@/components/Descent";
import { Illustration } from "@/components/Illustration";
import { InstallLine } from "@/components/InstallLine";
import { MemoryCard } from "@/components/MemoryCard";
import { T } from "@/components/T";
import { fill, versionOf } from "@/lib/figures";
import { Toolbar } from "@/components/Toolbar";
import { COLD_OPEN, LAYERS, PROVENANCE } from "@/content/layers";

export default function Page() {
  return (
    <>
      <div id="ground" />

      <div id="offnote">
        <div className="l">
          <T v={{ en: "context: off", ru: "контекст выключен" }} />
        </div>
        <p>
          <T
            v={{
              en: "Same repository. Same agent. Same task. Nothing is connected to anything, so every answer starts from zero — and this is the state your repositories are in right now.",
              ru: "Тот же репозиторий. Тот же агент. Та же задача. Ничего ни с чем не связано, поэтому любой ответ начинается с нуля — и ровно в этом состоянии твои репозитории находятся прямо сейчас.",
            }}
          />
        </p>
        <div className="b">
          <T
            v={{
              en: "↑ switch it back on, top right",
              ru: "↑ включи обратно, справа вверху",
            }}
          />
        </div>
      </div>

      <Toolbar />

      <div id="rail">
        <div>
          <T v={{ en: "depth", ru: "глубина" }} />
          <div className="val" id="rDepth">
            —
          </div>
        </div>
        <div id="gauge">
          {[0, 20, 40, 60, 80, 100].map((t) => (
            <u key={t} style={{ top: `${t}%` }} />
          ))}
          <i />
        </div>
        <div>
          <T v={{ en: "context", ru: "контекст" }} />
          <div className="val">
            <b id="rCtx">0</b> <T v={{ en: "facts", ru: "фактов" }} />
          </div>
        </div>
      </div>

      <main>
        <section id="cold">
          <div className="inner">
            <Decode v={COLD_OPEN} as="h1" />
            <div className="hint">
              <T
                v={{
                  en: "↓ scroll — you are going down",
                  ru: "↓ листай — ты пойдёшь вниз",
                }}
              />
            </div>
          </div>
        </section>

        {LAYERS.map((layer) => (
          <section
            key={layer.id}
            id={layer.id}
            className={layer.shots || layer.figure ? "split" : undefined}
            data-layer
            data-depth-en={layer.depth.en}
            data-depth-ru={layer.depth.ru}
            data-facts={layer.facts}
            data-bedrock={layer.bedrock ? "" : undefined}
          >
            <div className="inner">
              <div className="depth r">
                <T v={layer.kicker} />
                {layer.project && (
                  <span className="name">
                    {layer.project}
                    <Ver project={layer.project} />
                  </span>
                )}
              </div>

              <Decode v={layer.heading} className="r" />

              <p className="say r">
                <T v={fill(layer.body)} html />
              </p>

              {layer.wall && (
                <div className="wall r">
                  <em>
                    <T v={layer.wall.label} />
                  </em>
                  <T v={layer.wall.text} />
                </div>
              )}

              {layer.source && (
                <a className="source-link r" href={layer.source.href} target="_blank" rel="noopener">
                  <T v={layer.source.label} /> →
                </a>
              )}

            </div>

            {layer.figure && (
              <Illustration kind={layer.figure.kind} caption={layer.figure.caption} />
            )}

            {layer.shots && (
              <div className={layer.shots.length > 1 ? "shots pair" : "shots"}>
                {layer.shots.map((shot) => (
                  <figure
                    key={shot.src}
                    className={shot.portrait ? "shot portrait" : "shot"}
                  >
                    <img
                      src={shot.src}
                      width={shot.width}
                      height={shot.height}
                      alt={shot.alt}
                      loading="lazy"
                      decoding="async"
                    />
                    <figcaption>
                      <T v={fill(shot.caption)} html />
                    </figcaption>
                  </figure>
                ))}
              </div>
            )}
          </section>
        ))}

        <section
          id="end"
          data-layer
          data-depth-en="now"
          data-depth-ru="сейчас"
          data-facts="81"
        >
          <div className="inner">
            <Decode
              className="big r"
              as="p"
              v={{
                en: "The agent is ephemeral. The project brain is durable.",
                ru: "Агент эфемерен. Мозг проекта долговечен.",
              }}
            />
            <div className="r">
              <MemoryCard />
            </div>
            <p className="say r">
              <T
                v={{
                  en: "Hit <b>context: off</b> in the corner. That is what every agent sees, in every repository, on every task, right now.",
                  ru: "Нажми <b>контекст: выкл</b> в углу. Именно это видит каждый агент, в каждом репозитории, на каждой задаче, прямо сейчас.",
                }}
                html
              />
            </p>
          </div>
        </section>

        <section
          id="contact"
          data-layer
          data-depth-en="surface"
          data-depth-ru="поверхность"
          data-facts="81"
        >
          <div className="inner">
            <div className="depth r">
              <T v={{ en: "back at the surface", ru: "обратно на поверхность" }} />
            </div>
            <Decode
              className="r"
              v={{
                en: "Two doors. Both of them answer.",
                ru: "Две двери. За обеими отвечают.",
              }}
            />
            <div className="rows r">
              <a href="https://github.com/MrCipherSmith" target="_blank" rel="noopener">
                <span className="w">github</span>
                <span className="h">
                  github.com/<b>MrCipherSmith</b>
                </span>
              </a>
              <a href="https://t.me/mrciphersmith" target="_blank" rel="noopener">
                <span className="w">telegram</span>
                <span className="h">
                  @<b>mrciphersmith</b>
                </span>
              </a>
            </div>
            <div className="r">
              <InstallLine />
            </div>
            <p className="say r source">
              <T v={fill(PROVENANCE)} />
            </p>
            <p className="say r">
              <T
                v={{
                  en: "The scope matters — the unscoped name belongs to an unrelated project. The binary it installs is called <b>keryx</b>.",
                  ru: "Скоуп имеет значение — имя без скоупа принадлежит постороннему проекту. Ставится бинарник под именем <b>keryx</b>.",
                }}
                html
              />
            </p>
          </div>
        </section>
      </main>

      <Descent />
    </>
  );
}

/** The current version beside a project's name, read from the nightly snapshot. */
function Ver({ project }: { project: string }) {
  const v = versionOf(project);
  if (!v) return null;
  return (
    <span
      className="ver"
      title={v.source === "npm" ? "latest on npm" : "latest GitHub release"}
    >
      v{v.value}
    </span>
  );
}

