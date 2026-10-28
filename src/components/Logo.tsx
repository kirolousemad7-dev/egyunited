import Image from "next/image";

export function Logo({ alt, variant = "header" }: { alt: string; variant?: "header" | "footer" }) {
  const height = variant === "header" ? "3rem" : "4.25rem";

  return (
    <Image
      src="/brand/logo.png"
      alt={alt}
      width={407}
      height={194}
      priority={variant === "header"}
      sizes="220px"
      style={{ width: "auto", height }}
    />
  );
}
