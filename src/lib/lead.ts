import { z } from "zod";
import { getWhatsAppNumber } from "@/config/site";

const indic = "٠١٢٣٤٥٦٧٨٩";
const persian = "۰۱۲۳۴۵۶۷۸۹";

export function toWesternDigits(value: string) {
  return value
    .replace(/[٠-٩]/g, (digit) => String(indic.indexOf(digit)))
    .replace(/[۰-۹]/g, (digit) => String(persian.indexOf(digit)));
}

export function normalizeEgyptianMobile(value: string) {
  let digits = toWesternDigits(value).replace(/[^\d]/g, "");
  if (digits.startsWith("0020")) digits = digits.slice(4);
  else if (digits.startsWith("20")) digits = `0${digits.slice(2)}`;
  return digits;
}

export function isEgyptianMobile(value: string) {
  return /^01[0125]\d{8}$/.test(normalizeEgyptianMobile(value));
}

export type LeadInput = {
  name: string;
  phone: string;
  governorate: string;
  service: string;
  building: string;
  details: string;
};

export type LeadMessages = {
  nameMin: string;
  nameMax: string;
  phoneRequired: string;
  phoneInvalid: string;
  governorate: string;
  service: string;
  building: string;
  detailsMin: string;
  detailsMax: string;
};

export function createLeadSchema(messages: LeadMessages, lists: { governorates: readonly string[]; services: readonly string[]; buildings: readonly string[] }) {
  return z.object({
    name: z.string().trim().min(3, messages.nameMin).max(80, messages.nameMax),
    phone: z.string().trim().min(1, messages.phoneRequired).refine(isEgyptianMobile, messages.phoneInvalid),
    governorate: z.string().refine((value) => lists.governorates.includes(value), messages.governorate),
    service: z.string().refine((value) => lists.services.includes(value), messages.service),
    building: z.string().refine((value) => lists.buildings.includes(value), messages.building),
    details: z.string().trim().min(10, messages.detailsMin).max(800, messages.detailsMax),
  });
}

export type LeadMessageLabels = {
  heading: string;
  name: string;
  phone: string;
  governorate: string;
  service: string;
  building: string;
  details: string;
  governorateValue: string;
  serviceValue: string;
  buildingValue: string;
};

export function buildLeadMessage(values: LeadInput, labels: LeadMessageLabels) {
  return [
    labels.heading,
    "",
    `${labels.name}: ${values.name.trim()}`,
    `${labels.phone}: ${normalizeEgyptianMobile(values.phone)}`,
    `${labels.governorate}: ${labels.governorateValue}`,
    `${labels.service}: ${labels.serviceValue}`,
    `${labels.building}: ${labels.buildingValue}`,
    `${labels.details}: ${values.details.trim()}`,
  ].join("\n");
}

export function buildWhatsAppUrl(message: string) {
  return `https://wa.me/${getWhatsAppNumber()}?text=${encodeURIComponent(message)}`;
}

export function openWhatsApp(url: string) {
  const opened = window.open(url, "_blank", "noopener,noreferrer");
  if (!opened) window.location.assign(url);
}
