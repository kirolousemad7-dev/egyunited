"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useMessages, useTranslations } from "next-intl";
import { useState } from "react";
import { cx } from "@/lib/cx";
import { Reveal } from "@/components/Reveal";
import { useClientReducedMotion } from "@/lib/use-client-reduced-motion";
import { Section, SectionHeading } from "@/components/ui";

export function FAQ() {
  const t = useTranslations("FAQ");
  const items = useMessages().FAQ.items;
  const [open, setOpen] = useState<number | null>(0);
  const reduce = useClientReducedMotion();

  return (
    <Section id="faq" titleId="faq-title" className="bg-white">
      <Reveal>
        <SectionHeading titleId="faq-title" eyebrow={t("eyebrow")} title={t("title")} />
      </Reveal>
      <div className="mt-8 divide-y divide-ink/10 border-y border-ink/10">
        {items.map((item, index) => {
          const isOpen = open === index;
          const panelId = `faq-panel-${index}`;
          const buttonId = `faq-button-${index}`;
          return (
            <div key={item.question}>
              <h3>
                <button
                  id={buttonId}
                  type="button"
                  className="flex w-full items-center justify-between gap-4 py-5 text-start text-lg font-bold text-ink"
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => setOpen(isOpen ? null : index)}
                >
                  {item.question}
                  <ChevronDown className={cx("size-5 shrink-0 text-gold-ink transition-transform", isOpen && "rotate-180")} aria-hidden="true" />
                </button>
              </h3>
              <AnimatePresence initial={false}>
                {isOpen ? (
                  <motion.div
                    id={panelId}
                    role="region"
                    aria-labelledby={buttonId}
                    initial={false}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={reduce ? undefined : { height: 0, opacity: 0 }}
                    transition={{ duration: reduce ? 0 : 0.28, ease: "easeOut" }}
                    className="overflow-hidden"
                  >
                    <p className="max-w-3xl pb-5 text-base leading-8 text-ink/75">{item.answer}</p>
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </Section>
  );
}
