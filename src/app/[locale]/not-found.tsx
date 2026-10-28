import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

export default async function NotFound() {
  const t = await getTranslations("Common");

  return (
    <div className="grid min-h-[70vh] place-items-center bg-ink px-6 text-center text-white">
      <div>
        <p className="text-sm font-bold tracking-[0.2em] text-champagne">{t("notFoundCode")}</p>
        <h1 className="mt-3 text-3xl font-extrabold">{t("notFoundTitle")}</h1>
        <p className="mt-3 text-white/70">{t("notFoundText")}</p>
        <Link href="/" className="mt-8 inline-flex min-h-12 items-center bg-gold px-6 font-bold text-ink">
          {t("backHome")}
        </Link>
      </div>
    </div>
  );
}
