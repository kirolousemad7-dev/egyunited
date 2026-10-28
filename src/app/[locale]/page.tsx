import { hasLocale } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { About } from "@/components/About";
import { Contact } from "@/components/Contact";
import { ElevatorApplications } from "@/components/ElevatorApplications";
import { FAQ } from "@/components/FAQ";
import { Hero } from "@/components/Hero";
import { LeadForm } from "@/components/LeadForm";
import { Projects } from "@/components/Projects";
import { Services } from "@/components/Services";
import { WhyChooseUs } from "@/components/WhyChooseUs";
import { WorkProcess } from "@/components/WorkProcess";
import { routing } from "@/i18n/routing";

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  return (
    <>
      <Hero />
      <About />
      <Services />
      <ElevatorApplications />
      <Projects />
      <WhyChooseUs />
      <WorkProcess />
      <LeadForm />
      <FAQ />
      <Contact />
    </>
  );
}
