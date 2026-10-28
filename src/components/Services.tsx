import { ArrowRight } from "lucide-react";
import { getMessages, getTranslations } from "next-intl/server";
import Image from "next/image";
import { services } from "@/config/content";
import { QuoteLink } from "@/components/QuoteLink";
import { Reveal } from "@/components/Reveal";
import { Section, SectionHeading } from "@/components/ui";

export async function Services() {
  const t = await getTranslations("Services");
  const items = (await getMessages()).Services.items;

  return (
    <Section id="services" titleId="services-title" className="bg-ink">
      <Reveal>
        <SectionHeading
          titleId="services-title"
          tone="dark"
          eyebrow={t("eyebrow")}
          title={t("title")}
          description={t("description")}
        />
      </Reveal>

      <div className="mt-8 grid gap-4 md:gap-5 lg:grid-cols-2">
        {services.map((service, index) => {
          const copy = items[service.id];
          return (
            <article
              key={service.id}
              className="group overflow-hidden border border-white/10 bg-charcoal transition duration-300 hover:-translate-y-1 hover:border-gold/70"
            >
              <div className="relative aspect-[16/9] overflow-hidden">
                <Image
                  src={service.image}
                  alt={copy.alt}
                  fill
                  sizes="(min-width: 1024px) 40vw, 100vw"
                  className="object-cover transition duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/20 to-transparent" />
                <span className="absolute start-5 bottom-4 text-sm font-bold tracking-[0.2em] text-champagne">
                  {String(index + 1).padStart(2, "0")}
                </span>
              </div>
              <div className="p-6 md:p-8">
                <h3 className="text-2xl font-extrabold text-white">{copy.title}</h3>
                <p className="mt-3 text-base leading-8 text-white/75">{copy.description}</p>
                <QuoteLink
                  service={service.id}
                  className="mt-6 inline-flex min-h-11 items-center gap-2 text-sm font-bold text-champagne transition-colors hover:text-white"
                >
                  {t("request")}
                  <ArrowRight className="size-4 rtl:rotate-180" aria-hidden="true" />
                </QuoteLink>
              </div>
            </article>
          );
        })}
      </div>
    </Section>
  );
}
