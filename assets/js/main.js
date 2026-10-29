(function () {
  document.documentElement.classList.add("js");

  var header = document.querySelector(".site-header");
  var menuBtn = document.querySelector(".menu-btn");
  var mobile = document.querySelector(".mobile-nav");
  var year = document.querySelector("[data-year]");
  if (year) year.textContent = String(new Date().getFullYear());

  function onScroll() {
    if (header) header.classList.toggle("is-scrolled", window.scrollY > 8);
  }
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  var menuLabel = menuBtn ? menuBtn.querySelector(".sr") : null;

  function setMenu(open) {
    if (!mobile || !menuBtn) return;
    mobile.hidden = !open;
    menuBtn.setAttribute("aria-expanded", open ? "true" : "false");
    header.classList.toggle("is-open", open);
    document.body.classList.toggle("menu-open", open);
    if (menuLabel) menuLabel.textContent = open ? menuLabel.getAttribute("data-close") : menuLabel.getAttribute("data-open");
  }

  function closeMenu() { setMenu(false); }

  if (menuBtn && mobile) {
    menuBtn.addEventListener("click", function () {
      setMenu(mobile.hidden);
    });
    mobile.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", closeMenu);
    });
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") closeMenu();
    });
  }

  document.querySelectorAll("[data-lang]").forEach(function (link) {
    link.addEventListener("click", function (event) {
      try { localStorage.setItem("eu-lang", link.getAttribute("data-lang")); } catch (error) {}
      var url = new URL(link.href, window.location.origin);
      url.search = window.location.search;
      url.hash = window.location.hash;
      event.preventDefault();
      window.location.assign(url.toString());
    });
  });

  var sections = ["home", "about", "services", "projects", "contact"];
  var links = document.querySelectorAll(".desktop-nav a[href^='#']");
  if ("IntersectionObserver" in window) {
    var spy = new IntersectionObserver(function (entries) {
      var visible = entries
        .filter(function (entry) { return entry.isIntersecting; })
        .sort(function (a, b) { return b.intersectionRatio - a.intersectionRatio; })[0];
      if (!visible) return;
      links.forEach(function (link) {
        if (link.getAttribute("href") === "#" + visible.target.id) link.setAttribute("aria-current", "location");
        else link.removeAttribute("aria-current");
      });
    }, { rootMargin: "-30% 0px -55% 0px", threshold: [0.1, 0.25, 0.5] });
    sections.forEach(function (id) {
      var node = document.getElementById(id);
      if (node) spy.observe(node);
    });
  }

  var cards = Array.prototype.slice.call(document.querySelectorAll(".project"));
  var filters = document.querySelector(".filters");
  var more = document.querySelector(".more");
  var showing = document.querySelector(".showing");
  var showAll = false;
  var active = "all";

  function applyProjects() {
    var shown = 0;
    var matched = 0;
    cards.forEach(function (card, index) {
      var category = card.getAttribute("data-category");
      var extra = index >= 6;
      var categoryOk = active === "all" || category === active;
      var visible = categoryOk && (active !== "all" || showAll || !extra);
      card.hidden = !visible;
      if (categoryOk) matched += 1;
      if (visible) shown += 1;
    });
    if (showing) {
      showing.textContent = showing.getAttribute("data-template")
        .replace("{shown}", String(shown))
        .replace("{total}", String(active === "all" ? cards.length : matched));
    }
    if (more) {
      var hasExtra = active === "all" && cards.length > 6;
      more.hidden = !hasExtra;
      more.setAttribute("aria-expanded", showAll ? "true" : "false");
      more.textContent = showAll ? more.getAttribute("data-less") : more.getAttribute("data-all");
    }
  }

  if (filters) {
    filters.addEventListener("click", function (event) {
      var button = event.target.closest("button");
      if (!button) return;
      active = button.getAttribute("data-filter");
      filters.querySelectorAll("button").forEach(function (item) {
        item.setAttribute("aria-pressed", item === button ? "true" : "false");
      });
      applyProjects();
    });
  }
  if (more) {
    more.addEventListener("click", function () {
      showAll = !showAll;
      applyProjects();
    });
  }
  applyProjects();

  document.querySelectorAll(".faq button").forEach(function (button) {
    button.addEventListener("click", function () {
      var panel = document.getElementById(button.getAttribute("aria-controls"));
      var open = button.getAttribute("aria-expanded") === "true";
      document.querySelectorAll(".faq button").forEach(function (other) {
        other.setAttribute("aria-expanded", "false");
        var otherPanel = document.getElementById(other.getAttribute("aria-controls"));
        if (otherPanel) otherPanel.classList.remove("is-open");
      });
      if (!open) {
        button.setAttribute("aria-expanded", "true");
        if (panel) panel.classList.add("is-open");
      }
    });
  });

  document.querySelectorAll("[data-service]").forEach(function (link) {
    link.addEventListener("click", function () {
      var select = document.getElementById("lead-service");
      if (!select) return;
      select.value = link.getAttribute("data-service");
      select.dispatchEvent(new Event("change", { bubbles: true }));
    });
  });
})();
