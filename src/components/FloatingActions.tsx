"use client";

import { Phone } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { getWhatsAppNumber, phones } from "@/config/site";
import { useUi } from "@/components/ui-context";
import { WhatsAppIcon } from "@/components/WhatsAppIcon";

export function FloatingActions() {
  const { menuOpen } = useUi();
  const t = useTranslations("Contact");
  const common = useTranslations("Common");
  const locale = useLocale();
  if (menuOpen) return null;

  const company = locale === "ar" ? common("nameAr") : common("nameEn");
  const whatsappUrl = `https://wa.me/${getWhatsAppNumber()}?text=${encodeURIComponent(t("whatsappMessage", { company }))}`;

  return (
    <div className="fixed bottom-5 start-5 z-40 flex flex-col gap-3">
      <a
        href={`tel:${phones[0].tel}`}
        aria-label={t("callLabel", { phone: phones[0].display })}
        className="grid size-14 place-items-center rounded-full border border-gold bg-ink text-gold shadow-lg md:hidden"
      >
        <Phone className="size-6" aria-hidden="true" />
      </a>
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={t("whatsappLabel")}
        className="grid size-14 place-items-center rounded-full bg-gold text-ink shadow-lg transition-colors hover:bg-champagne"
      >
        <WhatsAppIcon className="size-7" />
      </a>
    </div>
  );
}
