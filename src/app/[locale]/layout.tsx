import type { Metadata } from "next";
import { Cairo, Inter } from "next/font/google";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { FloatingActions } from "@/components/FloatingActions";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { UiProvider } from "@/components/ui-context";
import { services } from "@/config/content";
import { getSiteUrl } from "@/config/site";
import { routing, type Locale } from "@/i18n/routing";
import { getStructuredData } from "@/lib/structured-data";

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  weight: ["400", "600", "700", "800"],
  display: "swap",
  variable: "--font-cairo",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
  display: "swap",
  variable: "--font-inter",
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) return {};

  const t = await getTranslations({ locale, namespace: "Metadata" });
  const common = await getTranslations({ locale, namespace: "Common" });
  const siteUrl = getSiteUrl();
  const title = t("title");
  const description = t("description");
  const siteName = locale === "ar" ? common("nameAr") : common("nameEn");

  return {
    metadataBase: new URL(siteUrl),
    title,
    description,
    applicationName: siteName,
    authors: [{ name: common("nameEn") }],
    alternates: {
      canonical: `/${locale}`,
      languages: {
        ar: "/ar",
        en: "/en",
        "x-default": "/ar",
      },
    },
    openGraph: {
      type: "website",
      locale: locale === "ar" ? "ar_EG" : "en_US",
      alternateLocale: locale === "ar" ? ["en_US"] : ["ar_EG"],
      url: `/${locale}`,
      siteName,
      title,
      description,
      images: [{ url: "/og.png", width: 1200, height: 630, alt: t("ogAlt") }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/og.png"],
    },
    robots: { index: true, follow: true },
    formatDetection: { telephone: false, email: false, address: false },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{ children: React.ReactNode; params: Promise<{ locale: string }> }>) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  setRequestLocale(locale);
  const activeLocale = locale as Locale;
  const t = await getTranslations("Common");
  const meta = await getTranslations("Metadata");
  const messages = await getMessages();
  const structuredData = JSON.stringify(
    getStructuredData({
      locale: activeLocale,
      description: meta("description"),
      services: services.map((service) => messages.Services.items[service.id]),
    }),
  ).replace(/</g, "\\u003c");

  return (
    <html lang={activeLocale} dir={activeLocale === "ar" ? "rtl" : "ltr"} className={`${cairo.variable} ${inter.variable}`}>
      <body className={activeLocale === "ar" ? "font-arabic" : "font-latin"}>
        <NextIntlClientProvider>
          <UiProvider>
            <a
              href="#main"
              className="sr-only focus:not-sr-only focus:absolute focus:start-4 focus:top-4 focus:z-[80] focus:bg-gold focus:px-4 focus:py-2 focus:text-ink"
            >
              {t("skip")}
            </a>
            <Header />
            <main id="main">{children}</main>
            <Footer />
            <FloatingActions />
          </UiProvider>
        </NextIntlClientProvider>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: structuredData }} />
      </body>
    </html>
  );
}
