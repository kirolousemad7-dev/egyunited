import type { ReactNode } from "react";
import { cx } from "@/lib/cx";

export function Container({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={cx("mx-auto w-full max-w-7xl px-5 md:px-8", className)}>{children}</div>;
}

export function Section({
  id,
  titleId,
  className,
  children,
}: {
  id?: string;
  titleId?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <section id={id} aria-labelledby={titleId} className={cx("scroll-mt-[5.5rem] py-12 md:py-20", className)}>
      <Container>{children}</Container>
    </section>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  titleId,
  tone = "light",
}: {
  eyebrow: string;
  title: string;
  description?: string;
  titleId: string;
  tone?: "light" | "dark";
}) {
  const dark = tone === "dark";

  return (
    <div className="max-w-3xl">
      <span className="mb-5 block h-px w-14 bg-gold" aria-hidden="true" />
      <p className={cx("text-sm font-bold", dark ? "text-champagne" : "text-gold-ink")}>{eyebrow}</p>
      <h2
        id={titleId}
        className={cx(
          "mt-3 text-balance text-3xl font-extrabold leading-[1.35] md:text-5xl",
          dark ? "text-white" : "text-ink",
        )}
      >
        {title}
      </h2>
      {description ? (
        <p className={cx("mt-5 max-w-2xl text-pretty text-base leading-8 md:text-lg", dark ? "text-white/75" : "text-ink/75")}>
          {description}
        </p>
      ) : null}
    </div>
  );
}
