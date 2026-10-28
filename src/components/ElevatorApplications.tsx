import { getMessages, getTranslations } from "next-intl/server";
import Image from "next/image";
import { applications } from "@/config/content";
import { Reveal } from "@/components/Reveal";
import { Section, SectionHeading } from "@/components/ui";

export async function ElevatorApplications() {
  const t = await getTranslations("ElevatorTypes");
  const items = (await getMessages()).ElevatorTypes.items;

  return (
    <Section id="applications" titleId="applications-title" className="bg-charcoal">
      <Reveal>
        <SectionHeading
          titleId="applications-title"
          tone="dark"
          eyebrow={t("eyebrow")}
          title={t("title")}
          description={t("description")}
        />
      </Reveal>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {applications.map((item) => {
          const copy = items[item.id];
          return (
            <article key={item.id} className="group relative min-h-60 overflow-hidden bg-ink sm:min-h-64">
              <Image
                src={item.image}
                alt={copy.alt}
                fill
                sizes="(min-width: 1024px) 40vw, 100vw"
                className="object-cover transition duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/45 to-ink/10" />
              <div className="absolute inset-x-0 bottom-0 p-6">
                <p className="text-xs font-bold text-champagne">{t("label")}</p>
                <h3 className="mt-2 text-2xl font-extrabold text-white">{copy.title}</h3>
                <p className="mt-2 max-w-md text-sm leading-7 text-white/80">{copy.text}</p>
              </div>
            </article>
          );
        })}
      </div>
    </Section>
  );
}
