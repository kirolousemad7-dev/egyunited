import { getMessages, getTranslations } from "next-intl/server";
import { Reveal } from "@/components/Reveal";
import { Section, SectionHeading } from "@/components/ui";

export async function WorkProcess() {
  const t = await getTranslations("WorkProcess");
  const items = (await getMessages()).WorkProcess.items;

  return (
    <Section id="process" titleId="process-title" className="bg-charcoal">
      <Reveal>
        <SectionHeading titleId="process-title" tone="dark" eyebrow={t("eyebrow")} title={t("title")} description={t("description")} />
      </Reveal>

      <ol className="relative mt-8 hidden lg:grid lg:grid-cols-5 lg:gap-5">
        <span className="pointer-events-none absolute start-[8%] end-[8%] top-6 h-px bg-gold/50" aria-hidden="true" />
        {items.map((step, index) => (
          <li key={step.title} className="text-center">
            <span className="relative z-10 mx-auto grid size-12 place-items-center rounded-full border border-gold bg-charcoal text-base font-extrabold text-champagne">
              {index + 1}
            </span>
            <h3 className="mt-5 text-lg font-extrabold leading-8 text-white">{step.title}</h3>
            <p className="mt-2 text-sm leading-7 text-white/70">{step.text}</p>
          </li>
        ))}
      </ol>

      <ol className="relative mt-8 space-y-6 lg:hidden">
        <span className="absolute top-3 bottom-3 start-[21px] w-px bg-gold/40" aria-hidden="true" />
        {items.map((step, index) => (
          <li key={step.title} className="relative flex gap-4">
            <span className="relative z-10 grid size-11 shrink-0 place-items-center rounded-full border border-gold bg-charcoal text-sm font-extrabold text-champagne">
              {index + 1}
            </span>
            <div>
              <h3 className="text-lg font-extrabold text-white">{step.title}</h3>
              <p className="mt-2 text-sm leading-7 text-white/75">{step.text}</p>
            </div>
          </li>
        ))}
      </ol>
    </Section>
  );
}
