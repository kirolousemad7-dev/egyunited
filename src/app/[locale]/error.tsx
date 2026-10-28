"use client";

import { useTranslations } from "next-intl";

export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const t = useTranslations("Common");

  return (
    <div className="grid min-h-[70vh] place-items-center bg-ink px-6 text-center text-white">
      <div>
        <h1 className="text-3xl font-extrabold">{t("errorTitle")}</h1>
        <p className="mt-3 text-white/70">{t("errorText")}</p>
        <button type="button" onClick={reset} className="mt-8 min-h-12 bg-gold px-6 font-bold text-ink">
          {t("retry")}
        </button>
      </div>
    </div>
  );
}
