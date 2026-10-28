import { getMessages, getTranslations } from "next-intl/server";
import Image from "next/image";
import { Reveal } from "@/components/Reveal";
import { Section, SectionHeading } from "@/components/ui";

export async function About() {
  const t = await getTranslations("About");
  const copy = (await getMessages()).About;

  return (
    <Section id="about" titleId="about-title" className="bg-mist">
      <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-12">
        <Reveal>
          <SectionHeading titleId="about-title" eyebrow={t("eyebrow")} title={t("title")} description={t("description")} />
          <div className="mt-6 space-y-4 text-base leading-8 text-ink/75">
            {copy.body.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
          <ul className="mt-8 grid gap-3 sm:grid-cols-2">
            {copy.points.map((point) => (
              <li key={point} className="flex items-start gap-3 border border-ink/10 bg-white px-4 py-3 text-sm font-semibold leading-7 text-ink">
                <span className="mt-2 size-1.5 shrink-0 bg-gold" aria-hidden="true" />
                {point}
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal className="relative">
          <div className="relative aspect-[4/3] overflow-hidden border border-gold/40 bg-charcoal">
            <Image src="/images/about.jpg" alt={t("imageAlt")} fill sizes="(min-width: 1024px) 46vw, 100vw" className="object-cover" />
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
