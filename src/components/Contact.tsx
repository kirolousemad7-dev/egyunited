import { Phone } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";
import { getWhatsAppNumber, phones } from "@/config/site";
import { WhatsAppIcon } from "@/components/WhatsAppIcon";
import { Reveal } from "@/components/Reveal";
import { Section, SectionHeading } from "@/components/ui";

export async function Contact() {
  const t = await getTranslations("Contact");
  const common = await getTranslations("Common");
  const active = await getLocale();
  const company = active === "ar" ? common("nameAr") : common("nameEn");
  const whatsappUrl = `https://wa.me/${getWhatsAppNumber()}?text=${encodeURIComponent(t("whatsappMessage", { company }))}`;

  return (
    <Section id="contact" titleId="contact-title" className="bg-ink">
      <Reveal>
        <SectionHeading titleId="contact-title" tone="dark" eyebrow={t("eyebrow")} title={t("title")} description={t("description")} />
      </Reveal>

      <ul className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {phones.map((phone, index) => (
          <li key={phone.tel}>
            <a
              href={`tel:${phone.tel}`}
              className="group flex h-full min-h-32 flex-col justify-between border border-gold/40 bg-white/[0.03] p-5 transition-colors hover:bg-gold"
            >
              <span className="flex items-center gap-2 text-sm font-bold text-champagne group-hover:text-ink">
                <Phone className="size-4" aria-hidden="true" />
                {t("line", { index: index + 1 })}
              </span>
              <span dir="ltr" className="mt-6 text-xl font-extrabold tracking-wide text-white group-hover:text-ink">
                {phone.display}
              </span>
            </a>
          </li>
        ))}
      </ul>

      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={t("whatsappLabel")}
        className="mt-6 inline-flex min-h-12 items-center gap-3 bg-gold px-6 text-sm font-extrabold text-ink transition-colors hover:bg-champagne"
      >
        <WhatsAppIcon className="size-5" />
        {t("whatsapp")}
      </a>
    </Section>
  );
}
