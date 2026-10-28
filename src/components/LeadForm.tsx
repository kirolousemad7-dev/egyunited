"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronDown } from "lucide-react";
import { useLocale, useMessages, useTranslations } from "next-intl";
import { useEffect, useMemo, useState } from "react";
import { useForm, type FieldErrors } from "react-hook-form";
import { buildingIds, governorateIds, serviceIds } from "@/config/content";
import { phones } from "@/config/site";
import { cx } from "@/lib/cx";
import { buildLeadMessage, buildWhatsAppUrl, createLeadSchema, openWhatsApp, type LeadInput } from "@/lib/lead";
import { QUOTE_SERVICE_EVENT } from "@/lib/quote";
import { Reveal } from "@/components/Reveal";
import { Section, SectionHeading } from "@/components/ui";

const controlClass =
  "w-full border border-ink/15 bg-white px-4 text-base text-ink outline-none transition-colors placeholder:text-ink/40 focus:border-gold";

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} className="mt-2 text-sm font-semibold text-red-700" role="alert">
      {message}
    </p>
  );
}

export function LeadForm() {
  const t = useTranslations("QuoteForm");
  const common = useTranslations("Common");
  const locale = useLocale();
  const [whatsappUrl, setWhatsappUrl] = useState<string | null>(null);
  const schema = useMemo(
    () =>
      createLeadSchema(
        {
          nameMin: t("errors.nameMin"),
          nameMax: t("errors.nameMax"),
          phoneRequired: t("errors.phoneRequired"),
          phoneInvalid: t("errors.phoneInvalid"),
          governorate: t("errors.governorate"),
          service: t("errors.service"),
          building: t("errors.building"),
          detailsMin: t("errors.detailsMin"),
          detailsMax: t("errors.detailsMax"),
        },
        { governorates: governorateIds, services: serviceIds, buildings: buildingIds },
      ),
    [t],
  );
  const {
    register,
    handleSubmit,
    setValue,
    clearErrors,
    formState: { errors },
  } = useForm<LeadInput>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      phone: "",
      governorate: "",
      service: "",
      building: "",
      details: "",
    },
  });

  useEffect(() => {
    const onSelect = (event: Event) => {
      const detail = (event as CustomEvent<string>).detail;
      if (!detail) return;
      setValue("service", detail);
      clearErrors("service");
    };
    window.addEventListener(QUOTE_SERVICE_EVENT, onSelect);
    return () => window.removeEventListener(QUOTE_SERVICE_EVENT, onSelect);
  }, [clearErrors, setValue]);

  const onSubmit = (values: LeadInput) => {
    const company = locale === "ar" ? common("nameAr") : common("nameEn");
    const url = buildWhatsAppUrl(
      buildLeadMessage(values, {
        heading: t("whatsappHeading", { company }),
        name: t("name"),
        phone: t("phone"),
        governorate: t("governorate"),
        service: t("service"),
        building: t("building"),
        details: t("details"),
        governorateValue: t(`governorates.${values.governorate as (typeof governorateIds)[number]}`),
        serviceValue: t(`services.${values.service as (typeof serviceIds)[number]}`),
        buildingValue: t(`buildings.${values.building as (typeof buildingIds)[number]}`),
      }),
    );
    setWhatsappUrl(url);
    openWhatsApp(url);
  };

  const onInvalid = (formErrors: FieldErrors<LeadInput>) => {
    const first = Object.keys(formErrors)[0];
    if (!first) return;
    document.getElementById(`lead-${first}`)?.focus();
  };

  const notes = useMessages().QuoteForm.notes;

  return (
    <Section id="quote" titleId="quote-title" className="bg-mist">
      <div className="grid items-start gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-10">
        <Reveal>
          <SectionHeading titleId="quote-title" eyebrow={t("eyebrow")} title={t("title")} description={t("description")} />
          <ul className="mt-8 space-y-4 text-sm leading-7 text-ink/75">
            {notes.map((note) => (
              <li key={note} className="border-s-2 border-gold ps-4">
                {note}
              </li>
            ))}
          </ul>
          <div className="mt-8 flex flex-wrap gap-3">
            {phones.map((phone) => (
              <a
                key={phone.tel}
                href={`tel:${phone.tel}`}
                dir="ltr"
                className="inline-flex min-h-11 items-center border border-ink/15 bg-white px-4 text-sm font-bold text-ink hover:border-gold"
              >
                {phone.display}
              </a>
            ))}
          </div>
        </Reveal>

        <form
          noValidate
          onSubmit={handleSubmit(onSubmit, onInvalid)}
          className="border border-ink/10 border-t-4 border-t-gold bg-white p-5 shadow-[0_24px_60px_rgba(8,9,11,0.08)] md:p-8"
        >
          <p className="text-sm font-bold text-gold-ink">{locale === "ar" ? common("nameAr") : common("nameEn")}</p>
          <h3 className="mt-2 text-2xl font-extrabold text-ink">{t("formTitle")}</h3>

          <div className="mt-6 grid gap-5 md:grid-cols-2">
            <div className="md:col-span-2">
              <label htmlFor="lead-name" className="mb-2 block text-sm font-bold text-ink">
                {t("name")}
              </label>
              <input
                id="lead-name"
                type="text"
                autoComplete="name"
                maxLength={80}
                aria-invalid={Boolean(errors.name)}
                aria-describedby={errors.name ? "lead-name-error" : undefined}
                className={cx(controlClass, "h-12", errors.name && "border-red-700")}
                {...register("name")}
              />
              <FieldError id="lead-name-error" message={errors.name?.message} />
            </div>

            <div>
              <label htmlFor="lead-phone" className="mb-2 block text-sm font-bold text-ink">
                {t("phone")}
              </label>
              <input
                id="lead-phone"
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                dir="ltr"
                placeholder={t("phonePlaceholder")}
                aria-invalid={Boolean(errors.phone)}
                aria-describedby={errors.phone ? "lead-phone-error" : undefined}
                className={cx(controlClass, "h-12 text-start", errors.phone && "border-red-700")}
                {...register("phone")}
              />
              <FieldError id="lead-phone-error" message={errors.phone?.message} />
            </div>

            <div>
              <label htmlFor="lead-governorate" className="mb-2 block text-sm font-bold text-ink">
                {t("governorate")}
              </label>
              <div className="relative">
                <select
                  id="lead-governorate"
                  autoComplete="address-level1"
                  aria-invalid={Boolean(errors.governorate)}
                  aria-describedby={errors.governorate ? "lead-governorate-error" : undefined}
                  className={cx(controlClass, "h-12 appearance-none pe-10", errors.governorate && "border-red-700")}
                  {...register("governorate")}
                >
                  <option value="">{t("governoratePlaceholder")}</option>
                  {governorateIds.map((id) => (
                    <option key={id} value={id}>
                      {t(`governorates.${id}`)}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute end-3 top-1/2 size-4 -translate-y-1/2 text-ink/60" aria-hidden="true" />
              </div>
              <FieldError id="lead-governorate-error" message={errors.governorate?.message} />
            </div>

            <div>
              <label htmlFor="lead-service" className="mb-2 block text-sm font-bold text-ink">
                {t("service")}
              </label>
              <div className="relative">
                <select
                  id="lead-service"
                  aria-invalid={Boolean(errors.service)}
                  aria-describedby={errors.service ? "lead-service-error" : undefined}
                  className={cx(controlClass, "h-12 appearance-none pe-10", errors.service && "border-red-700")}
                  {...register("service")}
                >
                  <option value="">{t("servicePlaceholder")}</option>
                  {serviceIds.map((id) => (
                    <option key={id} value={id}>
                      {t(`services.${id}`)}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute end-3 top-1/2 size-4 -translate-y-1/2 text-ink/60" aria-hidden="true" />
              </div>
              <FieldError id="lead-service-error" message={errors.service?.message} />
            </div>

            <div>
              <label htmlFor="lead-building" className="mb-2 block text-sm font-bold text-ink">
                {t("building")}
              </label>
              <div className="relative">
                <select
                  id="lead-building"
                  aria-invalid={Boolean(errors.building)}
                  aria-describedby={errors.building ? "lead-building-error" : undefined}
                  className={cx(controlClass, "h-12 appearance-none pe-10", errors.building && "border-red-700")}
                  {...register("building")}
                >
                  <option value="">{t("buildingPlaceholder")}</option>
                  {buildingIds.map((id) => (
                    <option key={id} value={id}>
                      {t(`buildings.${id}`)}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute end-3 top-1/2 size-4 -translate-y-1/2 text-ink/60" aria-hidden="true" />
              </div>
              <FieldError id="lead-building-error" message={errors.building?.message} />
            </div>

            <div className="md:col-span-2">
              <label htmlFor="lead-details" className="mb-2 block text-sm font-bold text-ink">
                {t("details")}
              </label>
              <textarea
                id="lead-details"
                rows={5}
                maxLength={800}
                aria-invalid={Boolean(errors.details)}
                aria-describedby={errors.details ? "lead-details-error" : undefined}
                placeholder={t("detailsPlaceholder")}
                className={cx(controlClass, "min-h-32 py-3", errors.details && "border-red-700")}
                {...register("details")}
              />
              <FieldError id="lead-details-error" message={errors.details?.message} />
            </div>
          </div>

          <button
            type="submit"
            className="mt-6 flex min-h-12 w-full items-center justify-center bg-gold px-6 text-sm font-extrabold text-ink transition-colors hover:bg-champagne"
          >
            {t("submit")}
          </button>
          <p className="mt-3 text-xs leading-6 text-ink/60">{t("disclaimer")}</p>

          {whatsappUrl ? (
            <p role="status" className="mt-4 border border-gold/40 bg-mist px-4 py-3 text-sm leading-7 text-ink">
              {t.rich("success", {
                link: (chunks) => (
                  <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="font-bold text-gold-ink underline">
                    {chunks}
                  </a>
                ),
              })}
            </p>
          ) : null}
        </form>
      </div>
    </Section>
  );
}
