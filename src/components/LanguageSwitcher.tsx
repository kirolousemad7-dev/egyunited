"use client";

import { useLocale, useTranslations } from "next-intl";
import { usePathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { cx } from "@/lib/cx";

export function LanguageSwitcher({ className, onNavigate }: { className?: string; onNavigate?: () => void }) {
  const locale = useLocale();
  const pathname = usePathname();
  const t = useTranslations("Navigation");

  return (
    <div className={cx("flex border border-gold/50", className)} role="group" aria-label={t("language")}>
      {routing.locales.map((code) => {
        const active = locale === code;
        const href = `/${code}${pathname === "/" ? "" : pathname}`;
        return (
          <a
            key={code}
            href={href}
            hrefLang={code}
            lang={code}
            aria-current={active ? "true" : undefined}
            className={cx(
              "grid min-h-11 min-w-11 place-items-center px-2.5 text-xs font-extrabold tracking-[0.14em]",
              active ? "bg-gold text-ink" : "text-white/80 hover:bg-white/5 hover:text-white",
            )}
            onClick={(event) => {
              onNavigate?.();
              if (active) {
                event.preventDefault();
                return;
              }
              event.preventDefault();
              const url = new URL(href, window.location.origin);
              url.search = window.location.search;
              url.hash = window.location.hash;
              window.location.assign(url.toString());
            }}
          >
            {code === "ar" ? "AR" : "EN"}
          </a>
        );
      })}
    </div>
  );
}
