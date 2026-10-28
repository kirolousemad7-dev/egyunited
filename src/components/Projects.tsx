"use client";

import { useMessages, useTranslations } from "next-intl";
import { useId, useState } from "react";
import { projects } from "@/config/content";
import { Reveal } from "@/components/Reveal";
import { Section, SectionHeading } from "@/components/ui";

const initialCount = 6;

function unitLabel(count: number, labels: { one: string; two: string; few: string; many: string }) {
  if (count === 1) return labels.one;
  if (count === 2) return labels.two;
  if (count <= 10) return labels.few;
  return labels.many;
}

function Elevation({ seed }: { seed: number }) {
  const rawId = useId().replace(/:/g, "");
  const patternId = `elevation-${rawId}`;

  return (
    <svg viewBox="0 0 320 140" className="absolute inset-0 h-full w-full" aria-hidden="true">
      <defs>
        <pattern id={patternId} width="28" height="28" patternUnits="userSpaceOnUse">
          <path d="M28 0H0V28" fill="none" stroke="#D4AF37" strokeOpacity="0.28" />
        </pattern>
      </defs>
      <rect width="320" height="140" fill="#08090B" />
      <rect width="320" height="140" fill={`url(#${patternId})`} />
      <rect x="28" y="18" width="70" height="108" fill="none" stroke="#E8C76A" strokeWidth="1.4" />
      <line x1="63" y1="18" x2="63" y2="126" stroke="#E8C76A" strokeOpacity="0.7" />
      {[0, 1, 2, 3, 4].map((row) => (
        <line
          key={row}
          x1="118"
          x2={190 + ((seed + row) % 4) * 28}
          y1={32 + row * 20}
          y2={32 + row * 20}
          stroke="#D4AF37"
          strokeOpacity="0.85"
        />
      ))}
    </svg>
  );
}

export function Projects() {
  const t = useTranslations("Projects");
  const items = useMessages().Projects.items;
  const [showAll, setShowAll] = useState(false);
  const visible = showAll ? projects : projects.slice(0, initialCount);
  const units = {
    one: t("unitOne"),
    two: t("unitTwo"),
    few: t("unitFew"),
    many: t("unitMany"),
  };

  return (
    <Section id="projects" titleId="projects-title" className="bg-mist">
      <Reveal>
        <SectionHeading titleId="projects-title" eyebrow={t("eyebrow")} title={t("title")} description={t("description")} />
      </Reveal>

      <p className="mt-6 text-sm font-semibold text-ink/70" aria-live="polite">
        {t("showing", { shown: visible.length, total: projects.length })}
      </p>

      <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {visible.map((project) => {
          const copy = items[String(project.id) as keyof typeof items];
          return (
            <article key={project.id} className="flex h-full flex-col border border-ink/10 border-s-2 border-s-gold bg-white">
              <div className="relative h-36 overflow-hidden">
                <Elevation seed={project.id} />
                <div className="relative flex h-full items-end justify-between p-5">
                  <p className="text-5xl font-extrabold leading-none text-gold">{project.count}</p>
                  <p className="text-sm font-bold text-champagne">{unitLabel(project.count, units)}</p>
                </div>
              </div>
              <div className="flex flex-1 flex-col p-5">
                <div className="flex flex-wrap gap-2 text-xs font-bold">
                  <span className="bg-mist px-2 py-1 text-ink">{copy.location}</span>
                  <span className="bg-gold px-2 py-1 text-ink">{copy.category}</span>
                </div>
                <h3 className="mt-4 text-lg font-bold leading-8 text-ink">{copy.title}</h3>
                <p className="mt-auto pt-5 text-xs font-semibold text-ink/60">{t("record", { id: String(project.id).padStart(2, "0") })}</p>
              </div>
            </article>
          );
        })}
      </div>

      <div className="mt-8">
        <button
          type="button"
          aria-expanded={showAll}
          onClick={() => setShowAll((value) => !value)}
          className="min-h-12 border border-ink bg-ink px-6 text-sm font-bold text-white transition-colors hover:border-gold hover:bg-gold hover:text-ink"
        >
          {showAll ? t("showLess") : t("showAll")}
        </button>
      </div>
    </Section>
  );
}
