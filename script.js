/* =============================================================
   V1 FACILITY AND SECURITY SERVICES — Script
   ============================================================= */
(function () {
  const D = window.ASFS_DATA;

  /* ---------- Loader ---------- */
 // Hide loader immediately when DOM is ready — don't wait for images
const l = document.querySelector(".loader");
if (l) {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => l.classList.add("is-hidden"));
  } else {
    l.classList.add("is-hidden"); // already ready
  }
}

  /* ---------- Mobile nav ---------- */
  document.addEventListener("click", (e) => {
    const burger = e.target.closest(".nav__burger");
    if (burger) {
      document.querySelector(".nav__links")?.classList.toggle("is-open");
    }
  });

  /* ---------- Nav scroll state ---------- */
  const nav = document.querySelector(".nav");
  const toTop = document.querySelector(".to-top");
  const isHome = !!document.querySelector(".hero");
  function onScroll() {
    const y = window.scrollY;
    if (nav && isHome) nav.classList.toggle("is-solid", y > 60);
    if (toTop) toTop.classList.toggle("is-visible", y > 600);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  toTop?.addEventListener("click", () =>
    window.scrollTo({ top: 0, behavior: "smooth" })
  );

  /* ---------- Reveal on scroll ---------- */
  const io = new IntersectionObserver(
    (entries) =>
      entries.forEach((en) => {
        if (en.isIntersecting) {
          const tgt = en.target;
          tgt.classList.add("is-in");
          io.unobserve(tgt);
          if (tgt.matches(".client-tile,.logo-card")) return; /* client list keeps its original reveal */
          /* hand the element back to its own hover transitions once revealed */
          const done = (e) => {
            if (e.target !== tgt || e.propertyName !== "opacity") return;
            tgt.removeEventListener("transitionend", done);
            tgt.classList.remove("reveal", "reveal-left", "reveal-right", "reveal-zoom", "is-in");
            tgt.removeAttribute("data-delay");
          };
          tgt.addEventListener("transitionend", done);
        }
      }),
    { threshold: 0.12 }
  );
  document
    .querySelectorAll(".reveal,.reveal-left,.reveal-right,.reveal-zoom")
    .forEach((el) => io.observe(el));

  /* ---------- Counter animation ---------- */
  const cio = new IntersectionObserver(
    (entries) =>
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        const el = en.target;
        const target = +el.dataset.count;
        const dur = 1600;
        const start = performance.now();
        const step = (t) => {
          const p = Math.min(1, (t - start) / dur);
          el.textContent = Math.floor(target * (0.2 + 0.8 * p * (2 - p)));
          if (p < 1) requestAnimationFrame(step);
          else el.textContent = target;
        };
        requestAnimationFrame(step);
        cio.unobserve(el);
      }),
    { threshold: 0.5 }
  );
  document.querySelectorAll("[data-count]").forEach((el) => cio.observe(el));

  /* ---------- Icons (inline SVGs) ---------- */
  const ICONS = {
    shield:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 3l8 3v6c0 5-3.5 8.5-8 9-4.5-.5-8-4-8-9V6l8-3z"/><path d="M9 12l2 2 4-4"/></svg>',
    sparkles:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 3l1.8 4.7L18 9.5l-4.2 1.8L12 16l-1.8-4.7L6 9.5l4.2-1.8L12 3z"/><path d="M19 14l.9 2.3L22 17l-2.1.7L19 20l-.9-2.3L16 17l2.1-.7L19 14z"/></svg>',
    bug:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="8" y="8" width="8" height="12" rx="4"/><path d="M12 8V4M9 6l-2-2M15 6l2-2M8 12H4M16 12h4M8 16H5M16 16h3"/></svg>',
    leaf:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M20 4c0 9-6 14-14 14 0-9 6-14 14-14z"/><path d="M6 18l8-8"/></svg>',
    wrench:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M14 5a4 4 0 105 5l4 4-3 3-4-4a4 4 0 01-5-5l3-3z"/></svg>',
    building:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="4" y="3" width="16" height="18"/><path d="M9 7h.01M15 7h.01M9 11h.01M15 11h.01M9 15h.01M15 15h.01M10 21v-4h4v4"/></svg>',
    cog:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="3"/><path d="M19 12a7 7 0 00-.1-1.2l2-1.5-2-3.4-2.4.9a7 7 0 00-2-1.2L14 3h-4l-.5 2.6a7 7 0 00-2 1.2l-2.4-.9-2 3.4 2 1.5A7 7 0 005 12c0 .4 0 .8.1 1.2l-2 1.5 2 3.4 2.4-.9c.6.5 1.3.9 2 1.2L10 21h4l.5-2.6c.7-.3 1.4-.7 2-1.2l2.4.9 2-3.4-2-1.5c0-.4.1-.8.1-1.2z"/></svg>',
    users:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="9" cy="8" r="3"/><circle cx="17" cy="9" r="2.4"/><path d="M3 20c0-3 3-5 6-5s6 2 6 5M15 20c0-2 2-4 4-4s2 1 2 3"/></svg>',
  };
  document.querySelectorAll("[data-icon]").forEach((el) => {
    el.innerHTML = ICONS[el.dataset.icon] || "";
  });

  /* ---------- Footer year ---------- */
  const yr = document.querySelector("[data-year]");
  if (yr) yr.textContent = new Date().getFullYear();

  /* ---------- Newsletter ---------- */
  document.querySelector(".newsletter")?.addEventListener("submit", (e) => {
    e.preventDefault();
    const i = e.target.querySelector("input");
    if (i.value) {
      i.value = "";
      const b = e.target.querySelector("button");
      const t = b.textContent;
      b.textContent = "Subscribed ✓";
      setTimeout(() => (b.textContent = t), 2200);
    }
  });

  /* ---------- Contact form ---------- */
  document.querySelector("#contact-form")?.addEventListener("submit", (e) => {
    e.preventDefault();
    const btn = e.target.querySelector("button[type=submit]");
    const t = btn.textContent;
    btn.textContent = "Sending…";
    setTimeout(() => {
      btn.textContent = "Message Sent ✓";
      e.target.reset();
      setTimeout(() => (btn.textContent = t), 2500);
    }, 800);
  });

  /* ---------- Gallery filter + lightbox ---------- */
  /* ---------- Gallery + lightbox ---------- */
const galGrid = document.querySelector("#gallery-grid");

if (galGrid && D?.gallery) {
  galGrid.innerHTML = D.gallery.map((g) => `
    <figure>
      <img src="${g.src}" alt="V1 Facility and Security Services gallery" loading="lazy"/>
    </figure>
  `).join("");

  const lb = document.querySelector("#lightbox");

  galGrid.addEventListener("click", (e) => {
    const img = e.target.closest("img");
    if (!img || !lb) return;

    lb.querySelector("img").src = img.src;
    lb.classList.add("is-open");
  });

  lb?.addEventListener("click", (e) => {
    if (e.target === lb || e.target.tagName === "BUTTON") {
      lb.classList.remove("is-open");
    }
  });
}
  /* ---------- Home page content ---------- */
if (D) {

  const servicesGrid = document.querySelector("#services-grid");
  if (servicesGrid) {
    servicesGrid.innerHTML = D.services.map(s => `
      <article class="svc-card">
        <div class="svc-card__img">
          <img src="${s.image}" alt="${s.title}" loading="lazy">
          <div class="svc-card__icon" data-icon="${s.icon}"></div>
        </div>
        <div class="svc-card__body">
          <h3>${s.title}</h3>
          <p>${s.short}</p>
          <a href="services.html" class="arrow">Learn more →</a>
        </div>
      </article>
    `).join("");

    servicesGrid.querySelectorAll("[data-icon]").forEach(el=>{
      el.innerHTML = ICONS[el.dataset.icon] || "";
    });
  }

  const whyGrid = document.querySelector("#why-grid");
  if (whyGrid) {
    whyGrid.innerHTML = D.whyChoose.map(w => `
      <div class="wc-card">
        <div class="num">${w.value}${w.suffix}</div>
        <h3>${w.title}</h3>
        <p>${w.text}</p>
      </div>
    `).join("");
  }

  const blogGrid = document.querySelector("#blog-grid");
  if (blogGrid) {
    blogGrid.innerHTML = D.blog.slice(0,3).map(b => `
      <article class="blog-card">
        <div class="blog-card__img">
          <img src="${b.image}" alt="${b.title}">
        </div>
        <div class="blog-card__body">
          <span class="date">${b.date}</span>
          <h3>${b.title}</h3>
          <p>${b.excerpt}</p>
        </div>
      </article>
    `).join("");
  }

  const mq1 = document.querySelector("#mq1");
  const mq2 = document.querySelector("#mq2");

  if (mq1 && mq2) {
    const clients = D.clients.map(c =>
      `<span class="client-pill">${c}</span>`
    ).join("");

    mq1.innerHTML = clients + clients;
    mq2.innerHTML = clients + clients;
  }

  const phone = document.querySelector("#cta_phone");
  const email = document.querySelector("#cta_email");
  const web = document.querySelector("#cta_web");
  const wa = document.querySelector("#cta_wa");

  if(phone) phone.textContent = D.company.phone;
  if(email) email.textContent = D.company.email;
  if(web) web.textContent = D.company.website.replace("https://","");
  if(wa) wa.textContent = D.company.whatsapp;
}
})();



function renderClientMarquee() {
  const logoRow1 = document.getElementById("logo-row-1");

  if (!logoRow1 || !window.ASFS_DATA?.logoClients) return;

  const logos = [
    ...ASFS_DATA.logoClients,
    ...ASFS_DATA.logoClients,
    ...ASFS_DATA.logoClients
  ];

  logoRow1.innerHTML = logos.map(client => `
    <div class="logo-card">
      <img src="${client.logo}" alt="${client.name}">
    </div>
  `).join("");
}

renderClientMarquee();


/* ---------- Premium motion layer (respects reduced-motion) ---------- */
(function () {
  if (!("IntersectionObserver" in window)) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  /* scroll progress */
  const bar = document.createElement("div");
  bar.className = "fx-progress";
  document.body.appendChild(bar);
  const upd = () => {
    const h = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.transform = "scaleX(" + (h > 0 ? Math.min(1, window.scrollY / h) : 0) + ")";
  };
  window.addEventListener("scroll", upd, { passive: true });
  upd();

  /* staggered fade/slide-up for cards that had no reveal */
  const sel = ".svc-card,.wc-card,.team-card,.value,.tl-item,.ind-card,.wcu-card,.wcu-ops-card,.wcu-stat,.mini-stats > div,.section__head,.contact-info .row";
  const skip = ".reveal,.reveal-left,.reveal-right,.reveal-zoom";
  const rio = new IntersectionObserver((list) => list.forEach((en) => {
    if (!en.isIntersecting) return;
    const el = en.target;
    el.classList.remove("fx-pre");
    el.classList.add("fx-in");
    el.addEventListener("animationend", () => el.classList.remove("fx-in"), { once: true });
    rio.unobserve(el);
  }), { threshold: 0.12, rootMargin: "0px 0px -4% 0px" });
  const seen = new Map();
  document.querySelectorAll(sel).forEach((el) => {
    if (el.matches(skip)) return;
    const p = el.parentElement, i = seen.get(p) || 0;
    seen.set(p, i + 1);
    el.style.setProperty("--fx-d", (i % 4) * 0.08 + "s");
    el.classList.add("fx-pre");
    rio.observe(el);
  });

  /* image settle (scale-down + fade) */
  const iio = new IntersectionObserver((list) => list.forEach((en) => {
    if (!en.isIntersecting) return;
    const im = en.target;
    im.classList.remove("fx-img-pre");
    im.classList.add("fx-img-in");
    im.addEventListener("animationend", () => im.classList.remove("fx-img-in"), { once: true });
    iio.unobserve(im);
  }), { threshold: 0.1 });
  document.querySelectorAll(".split__media img,.svc-card__img img,.ind-card img,.wcu-ops-card__img img,.team-card > img,.masonry img")
    .forEach((im) => { im.classList.add("fx-img-pre"); iio.observe(im); });

  /* count-up for plain numeric stats (e.g. 3000+, 24/7) */
  const nio = new IntersectionObserver((list) => list.forEach((en) => {
    if (!en.isIntersecting) return;
    const el = en.target, m = el.textContent.trim().match(/^(\d+)(.*)$/);
    nio.unobserve(el);
    if (!m) return;
    const to = +m[1], tail = m[2], t0 = performance.now();
    const step = (t) => {
      const p = Math.min(1, (t - t0) / 1500), e = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(to * e) + tail;
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }), { threshold: 0.6 });
  document.querySelectorAll(".mini-stats strong,.wc-card .num").forEach((el) => {
    if (!el.querySelector("[data-count]")) nio.observe(el);
  });
})();
