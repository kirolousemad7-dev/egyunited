"use client";

import { Menu, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { navIds } from "@/config/content";
import { cx } from "@/lib/cx";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { Logo } from "@/components/Logo";
import { QuoteLink } from "@/components/QuoteLink";
import { useUi } from "@/components/ui-context";

export function Header() {
  const t = useTranslations("Navigation");
  const common = useTranslations("Common");
  const { menuOpen, setMenuOpen } = useUi();
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState<string>("home");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const nodes = navIds
      .map((id) => document.getElementById(id))
      .filter((node): node is HTMLElement => Boolean(node));

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target.id) setActive(visible.target.id);
      },
      { rootMargin: "-30% 0px -55% 0px", threshold: [0.1, 0.25, 0.5] },
    );

    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!menuOpen) return;

    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const firstLink = document.querySelector<HTMLElement>("#mobile-nav a");
    firstLink?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
        return;
      }
      if (event.key !== "Tab") return;
      const root = document.getElementById("mobile-nav");
      if (!root) return;
      const items = Array.from(root.querySelectorAll<HTMLElement>("a, button"));
      const first = items[0];
      const last = items[items.length - 1];
      if (!first || !last) return;
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previous;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [menuOpen, setMenuOpen]);

  return (
    <header
      className={cx(
        "fixed inset-x-0 top-0 z-[70] border-b bg-ink/95 backdrop-blur-md transition-colors duration-300",
        scrolled || menuOpen ? "border-gold/30" : "border-white/10",
      )}
    >
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-3 px-5 md:px-8">
        <a href="#home" className="shrink-0" aria-label={t("homeLabel")}>
          <Logo alt={common("logoAlt")} />
        </a>

        <nav className="hidden min-w-0 items-center gap-3 xl:gap-5 lg:flex" aria-label={t("primary")}>
          {navIds.map((id) => (
            <a
              key={id}
              href={`#${id}`}
              aria-current={active === id ? "location" : undefined}
              className={cx(
                "relative whitespace-nowrap py-2 text-sm font-semibold text-white/80 transition-colors hover:text-white",
                "after:absolute after:inset-x-0 after:bottom-0 after:h-px after:origin-center after:bg-gold after:transition-transform after:duration-300",
                active === id ? "text-champagne after:scale-x-100" : "after:scale-x-0 hover:after:scale-x-100",
              )}
            >
              {t(id)}
            </a>
          ))}
          <LanguageSwitcher className="ms-1" />
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <QuoteLink className="hidden min-h-11 items-center bg-gold px-4 text-sm font-bold text-ink transition-colors hover:bg-champagne sm:inline-flex xl:px-5">
            {t("quote")}
          </QuoteLink>
          <button
            type="button"
            className="grid size-11 place-items-center border border-white/20 text-white lg:hidden"
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
            <span className="sr-only">{menuOpen ? t("closeMenu") : t("openMenu")}</span>
          </button>
        </div>
      </div>

      {menuOpen ? (
        <nav id="mobile-nav" className="fixed inset-x-0 top-20 bottom-0 z-[65] overflow-y-auto bg-ink px-6 py-8 lg:hidden" aria-label={t("mobile")}>
          <LanguageSwitcher onNavigate={() => setMenuOpen(false)} />
          <ul className="mt-6 space-y-2">
            {navIds.map((id) => (
              <li key={id}>
                <a
                  href={`#${id}`}
                  className="block border-b border-white/10 py-4 text-2xl font-bold text-white"
                  onClick={() => setMenuOpen(false)}
                >
                  {t(id)}
                </a>
              </li>
            ))}
          </ul>
          <QuoteLink
            onNavigate={() => setMenuOpen(false)}
            className="mt-8 flex min-h-12 items-center justify-center bg-gold px-5 text-base font-bold text-ink"
          >
            {t("quote")}
          </QuoteLink>
        </nav>
      ) : null}
    </header>
  );
}
