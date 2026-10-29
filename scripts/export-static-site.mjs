import { copyFile, mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const out = path.join(root, "static-site");
const ar = JSON.parse(await readFile(path.join(root, "src/messages/ar.json"), "utf8"));
const en = JSON.parse(await readFile(path.join(root, "src/messages/en.json"), "utf8"));

const phones = [
  { display: "01210442451", tel: "+201210442451" },
  { display: "01210442495", tel: "+201210442495" },
  { display: "01007523719", tel: "+201007523719" },
  { display: "01010673565", tel: "+201010673565" },
];
const services = [
  ["supply", "service-supply.jpg"],
  ["modern", "service-modern.jpg"],
  ["repair", "service-repair.jpg"],
  ["maintain", "service-maintain.jpg"],
];
const applications = [
  ["residential", "app-residential.jpg"],
  ["villa", "app-villa.jpg"],
  ["office", "app-office.jpg"],
  ["mall", "app-mall.jpg"],
  ["hospital", "app-hospital.jpg"],
  ["industrial", "app-industrial.jpg"],
];
const counts = { 1: 33, 2: 2, 3: 1, 4: 2, 5: 3, 6: 2, 7: 24, 8: 1, 9: 1, 10: 3, 11: 16, 12: 6, 13: 2, 14: 1, 15: 1 };
const nav = ["home", "about", "services", "projects", "contact"];
const images = ["about.jpg", "hero.jpg", "og.png", ...services.map((item) => item[1]), ...applications.map((item) => item[1])];

await mkdir(path.join(out, "assets/images"), { recursive: true });
await copyFile(path.join(root, "public/brand/logo.png"), path.join(out, "assets/images/logo.png"));
await copyFile(path.join(root, "src/app/icon.png"), path.join(out, "assets/images/favicon.png"));
for (const image of images) {
  const source = image === "og.png" ? path.join(root, "public/og.png") : path.join(root, "public/images", image);
  await copyFile(source, path.join(out, "assets/images", image));
}

const esc = (value) => String(value)
  .replace(/&/g, "&amp;")
  .replace(/</g, "&lt;")
  .replace(/>/g, "&gt;")
  .replace(/"/g, "&quot;");

const rich = (value) => value.split(/<accent>|<\/accent>/).map((part, index) => (
  index % 2 ? `<span class="accent">${esc(part)}</span>` : esc(part)
)).join("");

const unit = (count, copy) => {
  if (count === 1) return copy.unitOne;
  if (count === 2) return copy.unitTwo;
  if (count <= 10) return copy.unitFew;
  return copy.unitMany;
};

const elevation = (id) => {
  const lines = [0, 1, 2, 3, 4].map((row) => {
    const y = 32 + row * 20;
    const x2 = 190 + ((id + row) % 4) * 28;
    return `<line x1="118" x2="${x2}" y1="${y}" y2="${y}" stroke="#D4AF37" stroke-opacity="0.85"/>`;
  }).join("");
  return `<svg class="elevation" viewBox="0 0 320 140" aria-hidden="true"><defs><pattern id="grid-${id}" width="28" height="28" patternUnits="userSpaceOnUse"><path d="M28 0H0V28" fill="none" stroke="#D4AF37" stroke-opacity="0.28"/></pattern></defs><rect width="320" height="140" fill="#08090B"/><rect width="320" height="140" fill="url(#grid-${id})"/><rect x="28" y="18" width="70" height="108" fill="none" stroke="#E8C76A" stroke-width="1.4"/><line x1="63" y1="18" x2="63" y2="126" stroke="#E8C76A" stroke-opacity="0.7"/>${lines}</svg>`;
};

const phoneIcon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3.1-8.6A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.3 1.8.6 2.6a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.5-1.1a2 2 0 0 1 2.1-.5c.8.3 1.7.5 2.6.6a2 2 0 0 1 1.7 2z"/></svg>`;
const waIcon = `<svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor"><path d="M20.5 3.5A11 11 0 0 0 2.1 17.4L1 23l5.7-1.1A11 11 0 0 0 12 22a11 11 0 0 0 8.5-18.5zM12 20.2a8.2 8.2 0 0 1-4.2-1.1l-.3-.2-3.4.7.7-3.3-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.4-.7-1.6-.8s-.4-.1-.5.1-.6.8-.7.9-.3.2-.5.1a6.7 6.7 0 0 1-2-1.2 7.4 7.4 0 0 1-1.4-1.7c-.1-.2 0-.4.1-.5l.4-.4.2-.3a.5.5 0 0 0 0-.5c-.1-.1-.5-1.2-.7-1.7s-.4-.4-.5-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.8 11.8 11.8 0 0 0 4.5 4c.5.2 1 .4 1.5.5a3.6 3.6 0 0 0 1.7.1 2.7 2.7 0 0 0 1.8-1.3 2.2 2.2 0 0 0 .2-1.3c-.1-.1-.2-.1-.4-.2z"/></svg>`;
const chevron = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>`;

function page(locale) {
  const m = locale === "ar" ? ar : en;
  const other = locale === "ar" ? "en" : "ar";
  const dir = locale === "ar" ? "rtl" : "ltr";
  const company = locale === "ar" ? m.Common.nameAr : m.Common.nameEn;
  const waText = encodeURIComponent(m.Contact.whatsappMessage.replace("{company}", company));
  const wa = `https://wa.me/201210442451?text=${waText}`;
  const categories = [...new Set(Object.values(m.Projects.items).map((item) => item.category))];
  const allLabel = locale === "ar" ? "الكل" : "All";
  const formCopy = {
    errors: m.QuoteForm.errors,
    labels: {
      name: m.QuoteForm.name,
      phone: m.QuoteForm.phone,
      governorate: m.QuoteForm.governorate,
      service: m.QuoteForm.service,
      building: m.QuoteForm.building,
      details: m.QuoteForm.details,
    },
    heading: m.QuoteForm.whatsappHeading.replace("{company}", company),
    success: m.QuoteForm.success,
    governorates: m.QuoteForm.governorates,
    services: m.QuoteForm.services,
    buildings: m.QuoteForm.buildings,
  };

  const options = (group, placeholder) => `<option value="">${esc(placeholder)}</option>` + Object.entries(group).map(([id, label]) => `<option value="${esc(id)}">${esc(label)}</option>`).join("");

  return `<!DOCTYPE html>
<html lang="${locale}" dir="${dir}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${esc(m.Metadata.title)}</title>
  <meta name="description" content="${esc(m.Metadata.description)}">
  <link rel="canonical" href="/${locale}/">
  <link rel="alternate" hreflang="ar" href="/ar/">
  <link rel="alternate" hreflang="en" href="/en/">
  <link rel="alternate" hreflang="x-default" href="/ar/">
  <meta property="og:type" content="website">
  <meta property="og:locale" content="${locale === "ar" ? "ar_EG" : "en_US"}">
  <meta property="og:title" content="${esc(m.Metadata.title)}">
  <meta property="og:description" content="${esc(m.Metadata.description)}">
  <meta property="og:url" content="/${locale}/">
  <meta property="og:image" content="/assets/images/og.png">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="theme-color" content="#08090B">
  <link rel="icon" href="/assets/images/favicon.png">
  <link rel="stylesheet" href="/assets/css/style.css">
  <link rel="stylesheet" href="/assets/css/responsive.css">
</head>
<body>
  <a class="skip" href="#main">${esc(m.Common.skip)}</a>
  <header class="site-header">
    <div class="container nav-bar">
      <a href="#home" aria-label="${esc(m.Navigation.homeLabel)}"><img class="logo" src="/assets/images/logo.png" alt="${esc(m.Common.logoAlt)}" width="407" height="194"></a>
      <nav class="desktop-nav" aria-label="${esc(m.Navigation.primary)}">
        ${nav.map((id) => `<a href="#${id}">${esc(m.Navigation[id])}</a>`).join("")}
        <div class="lang" role="group" aria-label="${esc(m.Navigation.language)}">
          <a href="/ar/" hreflang="ar" lang="ar" data-lang="ar" ${locale === "ar" ? 'aria-current="true"' : ""}>AR</a>
          <a href="/en/" hreflang="en" lang="en" data-lang="en" ${locale === "en" ? 'aria-current="true"' : ""}>EN</a>
        </div>
      </nav>
      <div class="actions">
        <a class="btn btn-gold quote-desktop" href="#quote">${esc(m.Navigation.quote)}</a>
        <button class="menu-btn" type="button" aria-expanded="false" aria-controls="mobile-nav"><span aria-hidden="true"></span><span class="sr" data-open="${esc(m.Navigation.openMenu)}" data-close="${esc(m.Navigation.closeMenu)}">${esc(m.Navigation.openMenu)}</span></button>
      </div>
    </div>
    <nav id="mobile-nav" class="mobile-nav" hidden aria-label="${esc(m.Navigation.mobile)}">
      <div class="lang" role="group" aria-label="${esc(m.Navigation.language)}">
        <a href="/ar/" hreflang="ar" lang="ar" data-lang="ar" ${locale === "ar" ? 'aria-current="true"' : ""}>AR</a>
        <a href="/en/" hreflang="en" lang="en" data-lang="en" ${locale === "en" ? 'aria-current="true"' : ""}>EN</a>
      </div>
      <ul>
        ${nav.map((id) => `<li><a href="#${id}">${esc(m.Navigation[id])}</a></li>`).join("")}
      </ul>
      <a class="btn btn-gold" href="#quote">${esc(m.Navigation.quote)}</a>
    </nav>
  </header>
  <main id="main">
    <section class="hero" id="home" aria-labelledby="hero-title">
      <img class="hero-media" src="/assets/images/hero.jpg" alt="${esc(m.Hero.imageAlt)}" width="1920" height="1080">
      <div class="hero-shade"></div>
      <div class="hero-top"></div>
      <div class="hero-grid" aria-hidden="true"></div>
      <div class="container hero-copy">
        <div class="hero-panel reveal">
          <p class="brand-kicker">${esc(m.Common.nameEn)}</p>
          <h1 id="hero-title">${rich(m.Hero.title)}</h1>
          <p class="hero-text">${esc(m.Hero.description)}</p>
          <div class="hero-actions">
            <a class="btn btn-gold" href="#quote">${esc(m.Hero.quote)}</a>
            <a class="btn btn-ghost" href="#contact">${esc(m.Hero.contact)}</a>
          </div>
          <p class="hero-call">${esc(m.Hero.call)} <a class="ltr" href="tel:${phones[0].tel}">${phones[0].display}</a></p>
        </div>
      </div>
      <ul class="highlights">
        ${m.Hero.highlights.map((item) => `<li>${esc(item)}</li>`).join("")}
      </ul>
    </section>

    <section class="section bg-mist" id="about" aria-labelledby="about-title">
      <div class="container split">
        <div class="reveal">
          <span class="rule" aria-hidden="true"></span>
          <p class="eyebrow">${esc(m.About.eyebrow)}</p>
          <h2 class="heading" id="about-title">${esc(m.About.title)}</h2>
          <p class="lede">${esc(m.About.description)}</p>
          <div class="prose">${m.About.body.map((paragraph) => `<p>${esc(paragraph)}</p>`).join("")}</div>
          <ul class="points">${m.About.points.map((point) => `<li>${esc(point)}</li>`).join("")}</ul>
        </div>
        <div class="frame reveal"><img src="/assets/images/about.jpg" alt="${esc(m.About.imageAlt)}" width="1200" height="900" loading="lazy"></div>
      </div>
    </section>

    <section class="section section-dark bg-ink" id="services" aria-labelledby="services-title">
      <div class="container">
        <div class="reveal">
          <span class="rule" aria-hidden="true"></span>
          <p class="eyebrow">${esc(m.Services.eyebrow)}</p>
          <h2 class="heading" id="services-title">${esc(m.Services.title)}</h2>
          <p class="lede">${esc(m.Services.description)}</p>
        </div>
        <div class="cards-2">
          ${services.map(([id, image], index) => {
            const item = m.Services.items[id];
            return `<article class="service reveal"><div class="cover"><img src="/assets/images/${image}" alt="${esc(item.alt)}" width="1200" height="675" loading="lazy"><div class="shade"></div><span class="num">${String(index + 1).padStart(2, "0")}</span></div><div class="service-body"><h3>${esc(item.title)}</h3><p>${esc(item.description)}</p><a class="link-gold" href="#quote" data-service="${id}">${esc(m.Services.request)} <span class="arrow" aria-hidden="true">→</span></a></div></article>`;
          }).join("")}
        </div>
      </div>
    </section>

    <section class="section section-dark bg-charcoal" id="applications" aria-labelledby="applications-title">
      <div class="container">
        <div class="reveal">
          <span class="rule" aria-hidden="true"></span>
          <p class="eyebrow">${esc(m.ElevatorTypes.eyebrow)}</p>
          <h2 class="heading" id="applications-title">${esc(m.ElevatorTypes.title)}</h2>
          <p class="lede">${esc(m.ElevatorTypes.description)}</p>
        </div>
        <div class="cards-3">
          ${applications.map(([id, image]) => {
            const item = m.ElevatorTypes.items[id];
            return `<article class="app-card reveal"><img src="/assets/images/${image}" alt="${esc(item.alt)}" width="900" height="700" loading="lazy"><div class="veil"></div><div class="app-copy"><span>${esc(m.ElevatorTypes.label)}</span><h3>${esc(item.title)}</h3><p>${esc(item.text)}</p></div></article>`;
          }).join("")}
        </div>
      </div>
    </section>

    <section class="section bg-mist" id="projects" aria-labelledby="projects-title">
      <div class="container">
        <div class="reveal">
          <span class="rule" aria-hidden="true"></span>
          <p class="eyebrow">${esc(m.Projects.eyebrow)}</p>
          <h2 class="heading" id="projects-title">${esc(m.Projects.title)}</h2>
          <p class="lede">${esc(m.Projects.description)}</p>
        </div>
        <div class="filters" role="group" aria-label="${esc(m.Projects.eyebrow)}">
          <button type="button" data-filter="all" aria-pressed="true">${esc(allLabel)}</button>
          ${categories.map((category) => `<button type="button" data-filter="${esc(category)}" aria-pressed="false">${esc(category)}</button>`).join("")}
        </div>
        <p class="showing" data-template="${esc(m.Projects.showing)}" aria-live="polite"></p>
        <div class="cards-3">
          ${Object.entries(m.Projects.items).map(([id, item]) => {
            const count = counts[id];
            return `<article class="project" data-category="${esc(item.category)}"><div class="elevation-wrap">${elevation(Number(id))}<div class="elevation-label"><p class="count">${count}</p><p class="unit">${esc(unit(count, m.Projects))}</p></div></div><div class="project-body"><div class="tags"><span class="tag">${esc(item.location)}</span><span class="tag tag-gold">${esc(item.category)}</span></div><h3>${esc(item.title)}</h3><p class="record">${esc(m.Projects.record.replace("{id}", String(id).padStart(2, "0")))}</p></div></article>`;
          }).join("")}
        </div>
        <button class="more" type="button" data-all="${esc(m.Projects.showAll)}" data-less="${esc(m.Projects.showLess)}" aria-expanded="false">${esc(m.Projects.showAll)}</button>
      </div>
    </section>

    <section class="section section-dark bg-ink" id="why" aria-labelledby="why-title">
      <div class="container">
        <div class="reveal"><span class="rule" aria-hidden="true"></span><p class="eyebrow">${esc(m.WhyChooseUs.eyebrow)}</p><h2 class="heading" id="why-title">${esc(m.WhyChooseUs.title)}</h2></div>
        <ul class="why-grid">${m.WhyChooseUs.items.map((item, index) => `<li class="why-card reveal"><span>${String(index + 1).padStart(2, "0")}</span><h3>${esc(item.title)}</h3><p>${esc(item.text)}</p></li>`).join("")}</ul>
      </div>
    </section>

    <section class="section section-dark bg-charcoal" id="process" aria-labelledby="process-title">
      <div class="container">
        <div class="reveal"><span class="rule" aria-hidden="true"></span><p class="eyebrow">${esc(m.WorkProcess.eyebrow)}</p><h2 class="heading" id="process-title">${esc(m.WorkProcess.title)}</h2><p class="lede">${esc(m.WorkProcess.description)}</p></div>
        <ol class="process-desktop">${m.WorkProcess.items.map((step, index) => `<li><span class="step-no">${index + 1}</span><h3>${esc(step.title)}</h3><p>${esc(step.text)}</p></li>`).join("")}</ol>
        <ol class="process">${m.WorkProcess.items.map((step, index) => `<li><span class="step-no">${index + 1}</span><div><h3>${esc(step.title)}</h3><p>${esc(step.text)}</p></div></li>`).join("")}</ol>
      </div>
    </section>

    <section class="section bg-mist" id="quote" aria-labelledby="quote-title">
      <div class="container quote-grid">
        <div class="reveal">
          <span class="rule" aria-hidden="true"></span>
          <p class="eyebrow">${esc(m.QuoteForm.eyebrow)}</p>
          <h2 class="heading" id="quote-title">${esc(m.QuoteForm.title)}</h2>
          <p class="lede">${esc(m.QuoteForm.description)}</p>
          <ul class="notes">${m.QuoteForm.notes.map((note) => `<li>${esc(note)}</li>`).join("")}</ul>
          <div class="phone-row">${phones.map((item) => `<a class="ltr" href="tel:${item.tel}">${item.display}</a>`).join("")}</div>
        </div>
        <form class="form" novalidate>
          <p class="form-kicker">${esc(company)}</p>
          <h3>${esc(m.QuoteForm.formTitle)}</h3>
          <div class="fields">
            <div class="span-2"><label for="lead-name">${esc(m.QuoteForm.name)}</label><input id="lead-name" name="name" type="text" autocomplete="name" maxlength="80" aria-describedby="lead-name-error"><p class="error" id="lead-name-error"></p></div>
            <div><label for="lead-phone">${esc(m.QuoteForm.phone)}</label><input class="ltr" id="lead-phone" name="phone" type="tel" inputmode="tel" autocomplete="tel" placeholder="${esc(m.QuoteForm.phonePlaceholder)}" aria-describedby="lead-phone-error"><p class="error" id="lead-phone-error"></p></div>
            <div><label for="lead-governorate">${esc(m.QuoteForm.governorate)}</label><div class="select"><select id="lead-governorate" name="governorate" autocomplete="address-level1" aria-describedby="lead-governorate-error">${options(m.QuoteForm.governorates, m.QuoteForm.governoratePlaceholder)}</select>${chevron}</div><p class="error" id="lead-governorate-error"></p></div>
            <div><label for="lead-service">${esc(m.QuoteForm.service)}</label><div class="select"><select id="lead-service" name="service" aria-describedby="lead-service-error">${options(m.QuoteForm.services, m.QuoteForm.servicePlaceholder)}</select>${chevron}</div><p class="error" id="lead-service-error"></p></div>
            <div><label for="lead-building">${esc(m.QuoteForm.building)}</label><div class="select"><select id="lead-building" name="building" aria-describedby="lead-building-error">${options(m.QuoteForm.buildings, m.QuoteForm.buildingPlaceholder)}</select>${chevron}</div><p class="error" id="lead-building-error"></p></div>
            <div class="span-2"><label for="lead-details">${esc(m.QuoteForm.details)}</label><textarea id="lead-details" name="details" maxlength="800" placeholder="${esc(m.QuoteForm.detailsPlaceholder)}" aria-describedby="lead-details-error"></textarea><p class="error" id="lead-details-error"></p></div>
          </div>
          <button class="btn btn-gold" type="submit">${esc(m.QuoteForm.submit)}</button>
          <p class="fine">${esc(m.QuoteForm.disclaimer)}</p>
          <p class="status" role="status" hidden></p>
        </form>
      </div>
    </section>

    <section class="section bg-white" id="faq" aria-labelledby="faq-title">
      <div class="container">
        <div class="reveal"><span class="rule" aria-hidden="true"></span><p class="eyebrow">${esc(m.FAQ.eyebrow)}</p><h2 class="heading" id="faq-title">${esc(m.FAQ.title)}</h2></div>
        <div class="faq">
          ${m.FAQ.items.map((item, index) => `<div class="faq-item"><h3><button type="button" id="faq-button-${index}" aria-expanded="${index === 0 ? "true" : "false"}" aria-controls="faq-panel-${index}">${esc(item.question)} ${chevron}</button></h3><div class="panel${index === 0 ? " is-open" : ""}" id="faq-panel-${index}" role="region" aria-labelledby="faq-button-${index}"><p>${esc(item.answer)}</p></div></div>`).join("")}
        </div>
      </div>
    </section>

    <section class="section section-dark bg-ink" id="contact" aria-labelledby="contact-title">
      <div class="container">
        <div class="reveal"><span class="rule" aria-hidden="true"></span><p class="eyebrow">${esc(m.Contact.eyebrow)}</p><h2 class="heading" id="contact-title">${esc(m.Contact.title)}</h2><p class="lede">${esc(m.Contact.description)}</p></div>
        <ul class="phones">${phones.map((item, index) => `<li><a class="phone-card" href="tel:${item.tel}"><span>${phoneIcon} ${esc(m.Contact.line.replace("{index}", String(index + 1)))}</span><strong class="ltr">${item.display}</strong></a></li>`).join("")}</ul>
        <a class="btn btn-gold wa-link" href="${wa}" target="_blank" rel="noopener noreferrer">${waIcon} ${esc(m.Contact.whatsapp)}</a>
      </div>
    </section>
  </main>
  <footer class="site-footer">
    <div class="container footer-grid">
      <div><img class="logo-footer" src="/assets/images/logo.png" alt="${esc(m.Common.logoAlt)}" width="407" height="194"><p class="en-name">${esc(m.Common.nameEn)}</p><p class="ar-name">${esc(m.Common.nameAr)}</p></div>
      <div><h2>${esc(m.Footer.services)}</h2><ul>${services.map(([id]) => `<li><a href="#services">${esc(m.Services.items[id].title)}</a></li>`).join("")}</ul></div>
      <div><h2>${esc(m.Footer.links)}</h2><ul>${nav.map((id) => `<li><a href="#${id}">${esc(m.Navigation[id])}</a></li>`).join("")}<li><a href="#why">${esc(m.Footer.why)}</a></li><li><a href="#quote">${esc(m.Navigation.quote)}</a></li></ul></div>
      <div><h2>${esc(m.Footer.phones)}</h2><ul>${phones.map((item) => `<li><a class="ltr" href="tel:${item.tel}">${item.display}</a></li>`).join("")}</ul></div>
    </div>
    <div class="legal container">${esc(m.Footer.rights).replace("{year}", '<span data-year></span>').replace("{company}", esc(m.Common.nameAr))}</div>
  </footer>
  <div class="fab">
    <a class="fab-call" href="tel:${phones[0].tel}" aria-label="${esc(m.Contact.callLabel.replace("{phone}", phones[0].display))}">${phoneIcon}</a>
    <a class="fab-wa" href="${wa}" target="_blank" rel="noopener noreferrer" aria-label="${esc(m.Contact.whatsappLabel)}">${waIcon}</a>
  </div>
  <script type="application/ld+json">${JSON.stringify({
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: company,
    alternateName: locale === "ar" ? m.Common.nameEn : m.Common.nameAr,
    image: "/assets/images/og.png",
    logo: "/assets/images/logo.png",
    description: m.Metadata.description,
    telephone: phones[0].tel,
    areaServed: "Egypt",
    availableLanguage: ["Arabic", "English"],
  }).replace(/</g, "\\u003c")}</script>
  <script type="application/json" id="form-copy">${JSON.stringify(formCopy).replace(/</g, "\\u003c")}</script>
  <script src="/assets/js/main.js" defer></script>
  <script src="/assets/js/forms.js" defer></script>
  <script src="/assets/js/animations.js" defer></script>
</body>
</html>
`;
}

const rootPage = `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${esc(ar.Metadata.title)}</title>
  <meta name="description" content="${esc(ar.Metadata.description)}">
  <link rel="canonical" href="/ar/">
  <link rel="alternate" hreflang="ar" href="/ar/">
  <link rel="alternate" hreflang="en" href="/en/">
  <link rel="alternate" hreflang="x-default" href="/ar/">
  <meta http-equiv="refresh" content="0;url=/ar/">
  <script>
    (function () {
      var lang = "ar";
      try { if (localStorage.getItem("eu-lang") === "en") lang = "en"; } catch (error) {}
      location.replace("/" + lang + "/" + location.search + location.hash);
    })();
  </script>
</head>
<body>
  <p><a href="/ar/">${esc(ar.Common.nameAr)}</a></p>
  <p><a href="/en/">${esc(en.Common.nameEn)}</a></p>
</body>
</html>
`;

await mkdir(path.join(out, "ar"), { recursive: true });
await mkdir(path.join(out, "en"), { recursive: true });
await writeFile(path.join(out, "index.html"), rootPage);
await writeFile(path.join(out, "ar/index.html"), page("ar"));
await writeFile(path.join(out, "en/index.html"), page("en"));
await writeFile(path.join(out, "robots.txt"), "User-agent: *\nAllow: /\nSitemap: /sitemap.xml\n");
await writeFile(path.join(out, "sitemap.xml"), `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
  <url>
    <loc>/ar/</loc>
    <xhtml:link rel="alternate" hreflang="ar" href="/ar/"/>
    <xhtml:link rel="alternate" hreflang="en" href="/en/"/>
  </url>
  <url>
    <loc>/en/</loc>
    <xhtml:link rel="alternate" hreflang="ar" href="/ar/"/>
    <xhtml:link rel="alternate" hreflang="en" href="/en/"/>
  </url>
</urlset>
`);
console.log("static site written");
