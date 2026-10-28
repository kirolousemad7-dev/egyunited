"use client";

import { motion } from "framer-motion";
import { useMessages, useTranslations } from "next-intl";
import Image from "next/image";
import { phones } from "@/config/site";
import { QuoteLink } from "@/components/QuoteLink";
import { useClientReducedMotion } from "@/lib/use-client-reduced-motion";

export function Hero() {
  const t = useTranslations("Hero");
  const common = useTranslations("Common");
  const reduce = useClientReducedMotion();
  const highlights = useMessages().Hero.highlights;
  const motionProps = reduce
    ? {}
    : {
        initial: { opacity: 1, y: 12 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.55, ease: "easeOut" as const },
      };

  return (
    <section id="home" className="relative flex min-h-[100svh] flex-col overflow-hidden bg-ink" aria-labelledby="hero-title">
      <Image
        src="/images/hero.jpg"
        alt={t("imageAlt")}
        fill
        priority
        sizes="100vw"
        className="object-cover object-center"
      />
      <div className="hero-shade absolute inset-0" />
      <div className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-ink/70" />
      <div className="hero-grid absolute inset-0 opacity-70" aria-hidden="true" />

      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-1 flex-col justify-end px-5 pt-28 pb-36 md:px-8 md:pb-28">
        <motion.div {...motionProps} className="max-w-3xl border-s-2 border-gold ps-5 md:ps-7">
          <p className="text-xs font-bold tracking-[0.28em] text-champagne sm:text-sm">{common("nameEn")}</p>
          <h1 id="hero-title" className="mt-4 text-balance text-4xl font-extrabold leading-[1.35] text-white sm:text-5xl lg:text-6xl xl:text-7xl">
            {t.rich("title", {
              accent: (chunks) => <span className="text-gold">{chunks}</span>,
            })}
          </h1>
          <p className="mt-6 max-w-2xl text-pretty text-base leading-8 text-white/80 md:text-lg">{t("description")}</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <QuoteLink className="inline-flex min-h-12 items-center justify-center bg-gold px-6 text-sm font-bold text-ink transition-colors hover:bg-champagne">
              {t("quote")}
            </QuoteLink>
            <a
              href="#contact"
              className="inline-flex min-h-12 items-center justify-center border border-champagne/80 px-6 text-sm font-bold text-white transition-colors hover:bg-white hover:text-ink"
            >
              {t("contact")}
            </a>
          </div>
          <p className="mt-5 text-sm text-white/75">
            {t("call")}{" "}
            <a dir="ltr" className="font-bold text-champagne hover:text-white" href={`tel:${phones[0].tel}`}>
              {phones[0].display}
            </a>
          </p>
        </motion.div>
      </div>

      <div className="absolute inset-x-0 bottom-0 z-10 border-t border-white/10 bg-ink/70 backdrop-blur-sm">
        <ul className="mx-auto grid max-w-7xl grid-cols-2 ps-20 md:grid-cols-4">
          {highlights.map((item) => (
            <li key={item} className="px-5 py-4 text-sm font-semibold text-white/85 md:px-8">
              <span className="mb-2 block h-px w-6 bg-gold" aria-hidden="true" />
              {item}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
