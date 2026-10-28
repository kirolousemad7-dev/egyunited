import { company, getSiteUrl, phones } from "@/config/site";

export function getStructuredData({
  locale,
  description,
  services,
}: {
  locale: "ar" | "en";
  description: string;
  services: { title: string; description: string }[];
}) {
  const url = `${getSiteUrl()}/${locale}`;

  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: locale === "ar" ? company.nameAr : company.nameEn,
    alternateName: locale === "ar" ? company.nameEn : company.nameAr,
    url,
    image: `${getSiteUrl()}/og.png`,
    logo: `${getSiteUrl()}/brand/logo.png`,
    description,
    telephone: phones[0].tel,
    areaServed: {
      "@type": "Country",
      name: "Egypt",
    },
    contactPoint: phones.map((phone) => ({
      "@type": "ContactPoint",
      telephone: phone.tel,
      contactType: "customer service",
      areaServed: "EG",
      availableLanguage: ["Arabic", "English"],
    })),
    knowsAbout: services.map((service) => service.title),
    makesOffer: services.map((service) => ({
      "@type": "Offer",
      itemOffered: {
        "@type": "Service",
        name: service.title,
        description: service.description,
      },
    })),
  };
}
