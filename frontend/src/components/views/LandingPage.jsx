import React, { useEffect, useRef } from "react";
import {
  ArrowRight,
  Braces,
  Check,
  ChevronRight,
  Database,
  FolderOpen,
  Layers3,
  Moon,
  Network,
  Orbit,
  ShieldCheck,
  Sparkles,
  Sun,
  Terminal,
  WandSparkles,
  Zap,
} from "lucide-react";
import { PRESET_TEMPLATES } from "../../data/templates.js";

const blueprintCards = [
  {
    title: "Relational systems",
    copy: "Shape PostgreSQL, MySQL and SQLite schemas on one visual surface.",
    icon: Database,
    className: "col-span-1 row-span-1 md:col-span-2 md:row-span-2",
    image: "https://picsum.photos/seed/relational-database/1200/900",
  },
  {
    title: "AI schema architect",
    copy: "Turn product language into normalized tables, keys and indexes.",
    icon: WandSparkles,
    className: "col-span-1 row-span-1 md:col-span-2 md:row-span-2",
    image: "https://picsum.photos/seed/ai-architecture/1200/900",
  },
  {
    title: "Relationship logic",
    copy: "Map cardinality and foreign-key intent without losing the big picture.",
    icon: Network,
    className: "col-span-1 row-span-1 md:col-span-1 md:row-span-2",
    image: "https://picsum.photos/seed/network-graph/800/900",
  },
  {
    title: "Production-ready output",
    copy: "Generate migrations, Prisma, Mongoose and TypeScript from the same source model.",
    icon: Terminal,
    className: "col-span-1 row-span-1 md:col-span-1 md:row-span-2",
    image: "https://picsum.photos/seed/code-terminal/800/900",
  },
  {
    title: "One model. Many dialects.",
    copy: "Keep visual intent and generated implementation synchronized.",
    icon: Braces,
    className: "col-span-1 row-span-1 md:col-span-4 md:row-span-1",
    image: "https://picsum.photos/seed/database-code/1600/700",
  },
];

const marqueeItems = ["PostgreSQL", "MySQL", "SQLite", "MongoDB", "Prisma", "Mongoose", "TypeScript"];

export const LandingPage = ({
  onStartBlank,
  onLoadTemplate,
  savedProjects,
  onOpenSavedProject,
  isDarkMode,
  onToggleDarkMode,
  isAuthenticated,
  onSignIn,
  onRegister,
  onSignOut,
}) => {
  const pageRef = useRef(null);
  const galleryRef = useRef(null);
  const quoteRef = useRef(null);

  useEffect(() => {
    const gsap = window.gsap;
    const ScrollTrigger = window.ScrollTrigger;
    if (!gsap || !ScrollTrigger) return undefined;

    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".hero-copy > *",
        { y: 45, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.9, stagger: 0.1, ease: "power3.out" }
      );

      const cards = gsap.utils.toArray(".motion-card");
      cards.forEach((card) => {
        gsap.fromTo(
          card,
          { scale: 0.8, opacity: 0.35 },
          {
            scale: 1,
            opacity: 1,
            ease: "none",
            scrollTrigger: {
              trigger: card,
              start: "top 90%",
              end: "bottom 15%",
              scrub: true,
            },
          }
        );
      });

      if (galleryRef.current && window.innerWidth >= 768) {
        ScrollTrigger.create({
          trigger: galleryRef.current,
          start: "top 12%",
          end: "bottom 78%",
          pin: ".gallery-title",
          pinSpacing: false,
        });
      }

      if (quoteRef.current) {
        const words = quoteRef.current.querySelectorAll("span");
        gsap.fromTo(
          words,
          { opacity: 0.12 },
          {
            opacity: 1,
            stagger: 0.08,
            ease: "none",
            scrollTrigger: {
              trigger: quoteRef.current,
              start: "top 75%",
              end: "bottom 35%",
              scrub: true,
            },
          }
        );
      }
    }, pageRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={pageRef}
      id="landing-page"
      className={`min-h-screen overflow-hidden transition-colors ${
        isDarkMode ? "bg-[#08090c] text-white" : "bg-[#f4f1ea] text-[#11120f]"
      }`}
    >
      <header className="relative z-50 mx-auto flex w-[calc(100%-32px)] max-w-[1440px] items-center justify-between rounded-[22px] border border-black/10 bg-white/75 px-5 py-3 shadow-[0_20px_80px_rgba(0,0,0,0.12)] backdrop-blur-xl dark:border-white/10 dark:bg-[#101116]/75 md:mt-5 md:px-6">
        <button type="button" onClick={onStartBlank} className="group flex items-center gap-3 text-left">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#d7ff3f] text-black transition-transform duration-500 group-hover:rotate-12">
            <Database size={20} strokeWidth={2.5} />
          </span>
          <span>
            <span className="block font-mono text-[15px] font-black tracking-[-0.04em]">dbDraw</span>
            <span className="hidden text-[10px] uppercase tracking-[0.22em] text-black/45 dark:text-white/40 sm:block">Visual schema studio</span>
          </span>
        </button>

        <nav className="hidden items-center gap-7 text-sm font-medium text-black/55 dark:text-white/55 md:flex">
          <a href="#blueprints" className="transition hover:text-black dark:hover:text-white">Blueprints</a>
          <a href="#capabilities" className="transition hover:text-black dark:hover:text-white">Capabilities</a>
          <a href="#action" className="transition hover:text-black dark:hover:text-white">Workspace</a>
        </nav>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onToggleDarkMode}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-black/10 text-black/55 transition hover:bg-black/5 hover:text-black dark:border-white/10 dark:text-white/55 dark:hover:bg-white/10 dark:hover:text-white"
            title="Toggle theme"
          >
            {isDarkMode ? <Sun size={17} /> : <Moon size={17} />}
          </button>
          {isAuthenticated ? (
            <button
              type="button"
              onClick={onSignOut}
              className="hidden px-3 py-2 text-xs font-bold text-black/50 transition hover:text-black dark:text-white/45 dark:hover:text-white sm:block"
            >
              Sign out
            </button>
          ) : (
            <button
              type="button"
              onClick={onSignIn}
              className="hidden rounded-xl border border-black/10 bg-white/50 px-4 py-2.5 text-xs font-black text-black transition hover:-translate-y-0.5 hover:bg-white dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10 sm:block"
            >
              Sign in
            </button>
          )}
          <button
            type="button"
            onClick={onStartBlank}
            className="group flex items-center gap-2 rounded-xl bg-black px-4 py-2.5 text-xs font-bold text-white transition hover:-translate-y-0.5 dark:bg-white dark:text-black"
          >
            Open canvas
            <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </header>

      <main className="w-full max-w-full overflow-x-hidden">
        <section className="mx-auto grid min-h-[780px] w-full max-w-[1440px] grid-cols-1 items-center gap-14 px-6 pb-32 pt-24 md:grid-cols-[1.1fr_0.9fr] md:px-10 md:pb-48 md:pt-36">
          <div className="hero-copy relative z-10 max-w-4xl">
            <div className="mb-7 flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.22em] text-black/45 dark:text-white/40">
              <span className="h-px w-10 bg-current" />
              Database design without the dead ends
            </div>
            <h1 className="max-w-6xl text-[clamp(3rem,5.4vw,5.8rem)] font-black leading-[0.94] tracking-[-0.065em]">
              Draw the system before you build the system.
            </h1>
            <p className="mt-8 max-w-2xl text-base leading-7 text-black/60 dark:text-white/55 md:text-lg">
              dbDraw turns database architecture into an expressive visual workflow. Connect tables, reason about relationships, ask AI for a second opinion, then ship implementation-ready code.
            </p>
            <div className="mt-10 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={onStartBlank}
                className="group flex items-center gap-3 rounded-2xl bg-[#d7ff3f] px-6 py-4 text-sm font-black text-black shadow-[0_15px_50px_rgba(215,255,63,0.18)] transition duration-500 hover:-translate-y-1 hover:shadow-[0_22px_65px_rgba(215,255,63,0.25)]"
              >
                Start a blank schema
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
              </button>
              <button
                type="button"
                onClick={() => onLoadTemplate(PRESET_TEMPLATES[0])}
                className="group flex items-center gap-3 rounded-2xl border border-black/15 bg-white/60 px-6 py-4 text-sm font-bold text-black transition duration-500 hover:-translate-y-1 hover:bg-white dark:border-white/15 dark:bg-white/5 dark:text-white dark:hover:bg-white/10"
              >
                Open a blueprint
                <Layers3 size={16} className="transition-transform group-hover:rotate-12" />
              </button>
              {!isAuthenticated && (
                <button type="button" onClick={onRegister} className="px-2 py-4 text-sm font-bold text-black/55 transition hover:text-black dark:text-white/45 dark:hover:text-white">
                  Create account <span className="ml-1">→</span>
                </button>
              )}
            </div>
          </div>

          <div className="relative min-h-[470px] md:min-h-[590px]">
            <div className="absolute inset-0 rounded-[42px] bg-[radial-gradient(circle_at_35%_25%,rgba(215,255,63,0.3),transparent_36%),radial-gradient(circle_at_75%_70%,rgba(105,85,255,0.28),transparent_38%)] blur-2xl" />
            <div className="absolute inset-[5%] overflow-hidden rounded-[38px] border border-black/10 bg-black shadow-2xl dark:border-white/10">
              <img
                src="https://picsum.photos/seed/schema-workspace/1400/1600"
                alt="Abstract database architecture workspace"
                className="h-full w-full object-cover opacity-65 grayscale contrast-125 mix-blend-luminosity transition duration-1000 hover:scale-105"
              />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_35%_25%,transparent,rgba(0,0,0,0.86)_76%)]" />
              <div className="absolute inset-x-7 bottom-7 rounded-2xl border border-white/15 bg-white/10 p-5 backdrop-blur-xl">
                <div className="mb-5 flex items-center justify-between">
                  <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/50">Live schema surface</span>
                  <Orbit size={17} className="text-[#d7ff3f]" />
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {["users", "orders", "products"].map((name, index) => (
                    <div key={name} className="rounded-xl border border-white/10 bg-black/35 p-3">
                      <div className="mb-3 h-1 w-7 rounded-full bg-[#d7ff3f]" />
                      <div className="font-mono text-[11px] text-white/80">{name}</div>
                      <div className="mt-2 space-y-1 text-[9px] text-white/35">
                        <div>id uuid</div>
                        <div>created_at timestamp</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="blueprints" ref={galleryRef} className="mx-auto grid w-full max-w-[1440px] grid-cols-1 gap-16 px-6 py-32 md:grid-cols-[0.28fr_0.72fr] md:px-10 md:py-48">
          <div className="gallery-title self-start md:min-h-[520px]">
            <div className="flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.22em] text-black/40 dark:text-white/35">
              <span className="h-px w-8 bg-current" />
              Build from intent
            </div>
            <h2 className="mt-5 max-w-sm text-4xl font-black leading-[0.95] tracking-[-0.05em] md:text-5xl">
              Architecture that stays legible as it grows.
            </h2>
            <p className="mt-6 max-w-xs text-sm leading-6 text-black/55 dark:text-white/45">
              Start with a clean blueprint, inspect its relationships, and reshape it directly on the canvas.
            </p>
          </div>

          <div className="grid auto-rows-[150px] grid-cols-4 grid-flow-dense gap-3">
            {blueprintCards.map((card) => {
              const Icon = card.icon;
              return (
                <article key={card.title} className={`motion-card group relative min-h-0 overflow-hidden rounded-[28px] border border-black/10 bg-black text-white dark:border-white/10 ${card.className}`}>
                  <img src={card.image} alt="" className="absolute inset-0 h-full w-full object-cover opacity-35 grayscale contrast-125 transition-transform duration-700 ease-out group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/35 to-transparent" />
                  <div className="relative flex h-full flex-col justify-between p-5 md:p-6">
                    <div className="flex items-center justify-between">
                      <Icon size={20} className="text-[#d7ff3f]" />
                      <ArrowRight size={16} className="opacity-40 transition duration-500 group-hover:translate-x-1 group-hover:opacity-100" />
                    </div>
                    <div>
                      <h3 className="max-w-xl text-xl font-black tracking-[-0.035em] md:text-2xl">{card.title}</h3>
                      <p className="mt-2 max-w-xl text-xs leading-5 text-white/55 md:text-sm">{card.copy}</p>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        <section id="capabilities" className="mx-auto w-full max-w-[1440px] px-6 py-32 md:px-10 md:py-48">
          <div className="overflow-hidden rounded-[40px] border border-black/10 bg-[#111216] text-white dark:border-white/10">
            <div className="grid min-h-[620px] items-center gap-16 p-8 md:grid-cols-[0.8fr_1.2fr] md:p-16 lg:p-24">
              <div>
                <div className="flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.22em] text-white/35">
                  <Sparkles size={14} />
                  Intelligence in the workflow
                </div>
                <h2 className="mt-6 max-w-xl text-4xl font-black leading-[0.95] tracking-[-0.05em] md:text-6xl">
                  Let AI challenge the architecture, not replace your thinking.
                </h2>
                <p className="mt-7 max-w-lg text-sm leading-7 text-white/50 md:text-base">
                  Generate a model from natural language, review normalization decisions, find suspicious relationships and turn the result into code you can actually own.
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {[
                  ["Normalize", "Detect duplicated concepts and reshape the model before they become migrations."],
                  ["Audit", "Surface risky indexes, relationship choices and structural bottlenecks."],
                  ["Generate", "Translate one visual model into SQL, ORM schemas and typed interfaces."],
                  ["Refine", "Keep humans in control with a canvas designed for direct editing."],
                ].map(([title, copy]) => (
                  <div key={title} className="group rounded-3xl border border-white/10 bg-white/[0.035] p-6 transition duration-500 hover:-translate-y-1 hover:bg-white/[0.07]">
                    <div className="mb-12 flex items-center justify-between">
                      <span className="h-2 w-2 rounded-full bg-[#d7ff3f] shadow-[0_0_24px_rgba(215,255,63,0.65)]" />
                      <ChevronRight size={17} className="text-white/25 transition group-hover:translate-x-1 group-hover:text-white" />
                    </div>
                    <h3 className="text-xl font-black tracking-[-0.03em]">{title}</h3>
                    <p className="mt-3 text-xs leading-5 text-white/40">{copy}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto w-full max-w-[1440px] px-6 py-32 md:px-10 md:py-48">
          <div ref={quoteRef} className="mx-auto max-w-5xl text-center">
            <p className="text-[clamp(2.2rem,5vw,5.2rem)] font-black leading-[0.98] tracking-[-0.055em]">
              {"A good schema makes complexity visible before complexity makes the product fragile.".split(" ").map((word, index) => (
                <span key={`${word}-${index}`} className="mr-[0.22em] inline-block">{word}</span>
              ))}
            </p>
          </div>
        </section>

        <section className="border-y border-black/10 bg-black py-7 text-white dark:border-white/10">
          <div className="flex w-max animate-[marquee_28s_linear_infinite] items-center gap-12 px-6">
            {[...marqueeItems, ...marqueeItems].map((item, index) => (
              <React.Fragment key={`${item}-${index}`}>
                <span className="font-mono text-xs font-bold uppercase tracking-[0.18em] text-white/45">{item}</span>
                <span className="h-1.5 w-1.5 rounded-full bg-[#d7ff3f]" />
              </React.Fragment>
            ))}
          </div>
        </section>

        {savedProjects.length > 0 && (
          <section className="mx-auto w-full max-w-[1440px] px-6 py-32 md:px-10 md:py-48">
            <div className="mb-10 flex items-end justify-between gap-6">
              <div>
                <div className="flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.22em] text-black/40 dark:text-white/35">
                  <FolderOpen size={14} />
                  Continue designing
                </div>
                <h2 className="mt-4 text-4xl font-black tracking-[-0.05em] md:text-5xl">Recent schemas</h2>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
              {savedProjects.slice(0, 3).map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => onOpenSavedProject(p)}
                  className="group rounded-3xl border border-black/10 bg-white/70 p-6 text-left transition duration-500 hover:-translate-y-1 hover:shadow-2xl dark:border-white/10 dark:bg-white/[0.035]"
                >
                  <div className="mb-10 flex items-center justify-between">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-black text-white dark:bg-white dark:text-black"><Database size={17} /></div>
                    <ArrowRight size={16} className="text-black/30 transition group-hover:translate-x-1 dark:text-white/30" />
                  </div>
                  <h3 className="truncate text-xl font-black tracking-[-0.03em]">{p.title}</h3>
                  <p className="mt-2 line-clamp-2 text-xs leading-5 text-black/45 dark:text-white/40">{p.description || "No description provided."}</p>
                  <div className="mt-5 flex items-center gap-4 text-[10px] font-mono uppercase tracking-[0.12em] text-black/35 dark:text-white/30">
                    <span>{p.tables.length} tables</span>
                    <span>{p.relationships.length} relations</span>
                  </div>
                </button>
              ))}
            </div>
          </section>
        )}

        <section id="action" className="px-6 pb-10 md:px-10">
          <div className="relative mx-auto max-w-[1440px] overflow-hidden rounded-[42px] bg-[#d7ff3f] px-7 py-20 text-black md:px-16 md:py-28 lg:px-24">
            <div className="absolute -right-20 -top-32 h-96 w-96 rounded-full border-[60px] border-black/5" />
            <div className="relative max-w-5xl">
              <div className="flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.22em] text-black/50">
                <Zap size={14} />
                Your next schema starts here
              </div>
              <h2 className="mt-6 max-w-5xl text-5xl font-black leading-[0.92] tracking-[-0.06em] md:text-7xl">
                Stop sketching architecture in your head.
              </h2>
              <div className="mt-9 flex flex-wrap gap-3">
                <button type="button" onClick={onStartBlank} className="flex items-center gap-3 rounded-2xl bg-black px-6 py-4 text-sm font-black text-white transition hover:-translate-y-1">
                  Enter the canvas <ArrowRight size={16} />
                </button>
                <button type="button" onClick={() => onLoadTemplate(PRESET_TEMPLATES[0])} className="flex items-center gap-3 rounded-2xl border border-black/20 px-6 py-4 text-sm font-bold transition hover:bg-black/5">
                  Load a working blueprint <Check size={16} />
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="mx-auto flex max-w-[1440px] flex-col gap-4 px-6 py-10 text-xs text-black/40 dark:text-white/35 md:flex-row md:items-center md:justify-between md:px-10">
        <span className="font-mono font-bold tracking-[-0.02em]">dbDraw</span>
        <span>Visual database architecture, from first relation to production code.</span>
      </footer>
    </div>
  );
};
