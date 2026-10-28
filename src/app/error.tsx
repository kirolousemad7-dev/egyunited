"use client";

import ar from "@/messages/ar.json";
import en from "@/messages/en.json";

export default function RootError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="ar" dir="rtl">
      <body className="grid min-h-screen place-items-center bg-[#08090B] px-6 text-center text-white">
        <div>
          <h1 className="text-3xl font-extrabold">{ar.Common.errorTitle}</h1>
          <p className="mt-3 text-white/70">{ar.Common.errorText}</p>
          <p className="mt-6 text-lg font-bold" lang="en" dir="ltr">
            {en.Common.errorTitle}
          </p>
          <button type="button" onClick={reset} className="mt-8 min-h-12 bg-[#D4AF37] px-6 font-bold text-[#08090B]">
            {ar.Common.retry}
          </button>
        </div>
      </body>
    </html>
  );
}
