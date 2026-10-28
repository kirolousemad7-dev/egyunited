import { getTranslations } from "next-intl/server";
import { navIds, services } from "@/config/content";
import { phones } from "@/config/site";
import { Logo } from "@/components/Logo";
import { Container } from "@/components/ui";

export async function Footer() {
  const t = await getTranslations("Footer");
  const nav = await getTranslations("Navigation");
  const common = await getTranslations("Common");
  const serviceCopy = await getTranslations("Services.items");
  const year = new Date().getFullYear();
  const company = common("nameAr");

  return (
    <footer className="border-t border-white/10 bg-[#050506] text-white">
      <Container className="grid gap-8 py-12 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <Logo alt={common("logoAlt")} variant="footer" />
          <p className="mt-5 text-sm font-bold tracking-[0.14em] text-champagne">{common("nameEn")}</p>
          <p className="mt-2 text-lg font-extrabold">{common("nameAr")}</p>
        </div>

        <div>
          <h2 className="text-sm font-bold text-gold">{t("services")}</h2>
          <ul className="mt-4 space-y-3 text-sm leading-7 text-white/75">
            {services.map((service) => (
              <li key={service.id}>
                <a href="#services" className="hover:text-champagne">
                  {serviceCopy(`${service.id}.title`)}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-sm font-bold text-gold">{t("links")}</h2>
          <ul className="mt-4 space-y-3 text-sm text-white/75">
            {navIds.map((id) => (
              <li key={id}>
                <a href={`#${id}`} className="hover:text-champagne">
                  {nav(id)}
                </a>
              </li>
            ))}
            <li>
              <a href="#why" className="hover:text-champagne">
                {t("why")}
              </a>
            </li>
            <li>
              <a href="#quote" className="hover:text-champagne">
                {nav("quote")}
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h2 className="text-sm font-bold text-gold">{t("phones")}</h2>
          <ul className="mt-4 space-y-3">
            {phones.map((phone) => (
              <li key={phone.tel}>
                <a dir="ltr" href={`tel:${phone.tel}`} className="text-sm font-bold text-white hover:text-champagne">
                  {phone.display}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </Container>
      <div className="border-t border-white/10">
        <Container className="py-5 pb-28 text-sm text-white/60 md:pb-5">{t("rights", { year, company })}</Container>
      </div>
    </footer>
  );
}
