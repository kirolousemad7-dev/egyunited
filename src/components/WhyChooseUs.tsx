import { getMessages, getTranslations } from "next-intl/server";
import { Reveal } from "@/components/Reveal";
import { Section, SectionHeading } from "@/components/ui";

export async function WhyChooseUs() {
  const t = await getTranslations("WhyChooseUs");
  const items = (await getMessages()).WhyChooseUs.items;

  return (
    <Section id="why" titleId="why-title" className="bg-ink">
      <Reveal>
        <SectionHeading titleId="why-title" tone="dark" eyebrow={t("eyebrow")} title={t("title")} />
      </Reveal>
      <ul className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {items.map((item, index) => (
          <li key={item.title} className="border border-white/10 bg-white/[0.03] p-6 transition duration-300 hover:border-gold/70">
            <span className="text-sm font-bold tracking-[0.18em] text-gold">{String(index + 1).padStart(2, "0")}</span>
            <h3 className="mt-4 text-xl font-extrabold leading-8 text-white">{item.title}</h3>
            <p className="mt-3 text-sm leading-7 text-white/75">{item.text}</p>
          </li>
        ))}
      </ul>
    </Section>
  );
}
