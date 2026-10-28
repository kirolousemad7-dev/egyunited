export const company = {
  nameAr: "ايجي يونايتد للمصاعد",
  nameEn: "EGY UNITED FOR ELEVATORS",
} as const;

export const phones = [
  { display: "01210442451", tel: "+201210442451" },
  { display: "01210442495", tel: "+201210442495" },
  { display: "01007523719", tel: "+201007523719" },
  { display: "01010673565", tel: "+201010673565" },
] as const;

export function getSiteUrl() {
  const value = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  return value.replace(/\/$/, "");
}

export function getWhatsAppNumber() {
  const value = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "201210442451";
  const digits = value.replace(/[^\d]/g, "");
  return digits || "201210442451";
}
