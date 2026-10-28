import ar from "@/messages/ar.json";
import en from "@/messages/en.json";
import Link from "next/link";

export default function RootNotFound() {
  return (
    <html lang="ar" dir="rtl">
      <body className="grid min-h-screen place-items-center bg-[#08090B] px-6 text-center text-white">
        <div>
          <p className="text-sm font-bold tracking-[0.2em] text-[#E8C76A]">404</p>
          <h1 className="mt-3 text-3xl font-extrabold">{ar.Common.notFoundTitle}</h1>
          <p className="mt-3 text-white/70">{ar.Common.notFoundText}</p>
          <p className="mt-6 text-lg font-bold" lang="en" dir="ltr">
            {en.Common.notFoundTitle}
          </p>
          <p className="mt-2 text-white/70" lang="en" dir="ltr">
            {en.Common.notFoundText}
          </p>
          <div className="mt-8 flex items-center justify-center gap-3">
            <Link href="/ar" className="inline-flex min-h-12 items-center bg-[#D4AF37] px-6 font-bold text-[#08090B]">
              {ar.Common.backHome}
            </Link>
            <Link href="/en" lang="en" dir="ltr" className="inline-flex min-h-12 items-center border border-[#D4AF37] px-6 font-bold text-white">
              {en.Common.backHome}
            </Link>
          </div>
        </div>
      </body>
    </html>
  );
}
