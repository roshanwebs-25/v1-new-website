(function () {
  var h=document.head, about=document.body.dataset.page==="about";
  /* About Us keeps its original look; every other page gets the luxe layer */
  (about?["premium.css"]:["premium.css","luxe.css"]).forEach(function(a){var l=document.createElement("link");l.rel="stylesheet";l.href=a;h.appendChild(l);});
  var s=document.createElement("script");s.src="fx3d.js";document.body.appendChild(s);
  if(!about){var j=document.createElement("script");j.src="luxe.js";document.body.appendChild(j);}
  /* Immersive layer: Services, Why Choose Us, Industries */
  if(["services","why","industries"].indexOf(document.body.dataset.page)>-1){
    var c=document.createElement("link");c.rel="stylesheet";c.href="immersive.css";h.appendChild(c);
    var m=document.createElement("script");m.src="immersive.js";document.body.appendChild(m);}

  /* Cinematic service cards: Home + Services */
  if(["home","services"].indexOf(document.body.dataset.page)>-1){
    var k=document.createElement("link");k.rel="stylesheet";k.href="svc-cinema.css";h.appendChild(k);
    var q=document.createElement("script");q.src="svc-cinema.js";document.body.appendChild(q);
  }
})();
/* Shared nav + footer for inner pages (auto-injected) */
(function () {
  const D = window.ASFS_DATA;
  const active = document.body.dataset.page || "";
  const link = (h, k, t) =>
    `<li><a href="${h}" class="${active === k ? "is-active" : ""}">${t}</a></li>`;

  const nav = `
  <header class="nav nav--inner">
    <div class="container nav__inner">
      <a href="index.html" class="nav__logo">
        <img src="https://res.cloudinary.com/dsn3p1co7/image/upload/v1792944021/v1_logo_vxsyja.png" alt="V1 Facility & Security Services" />
        <span>V1 Facility &amp;
  <small>Security Services</small>
</span>
      </a>
      <nav>
        <ul class="nav__links">
          ${link("index.html","home","Home")}
          ${link("about-us.html","about","About")}
          ${link("services.html","services","Services")}
          ${link("industries-we-serve.html","industries","Industries")}
          ${link("clients.html","clients","Clients")}
          ${link("gallery.html","gallery","Gallery")}
          ${link("why-choose-us.html","why","Why Choose Us")}
        </ul>
      </nav>
      <a href="contact-us.html" class="nav__cta">Get a Quote →</a>
      <button class="nav__burger" aria-label="Menu"><span></span></button>
    </div>
  </header>`;

  const waNum = D.company.whatsapp.replace(/[^0-9]/g, "");
  const footer = `
  <footer class="footer">
    <div class="container">
      <div class="footer__grid">
        <div>
          <div class="footer__brand">
            <img src="https://res.cloudinary.com/dsn3p1co7/image/upload/v1792944021/v1_logo_vxsyja.png" alt="" />
            <strong>V1 Facility &amp; <br/>Security Services</strong>
          </div>
          <p>Your Reliable Facility Partner. Integrated facility management with 3,000+ trained professionals serving 100+ reputed organizations across 8 states.</p>
          
        </div>
        <div>
          <h4>Quick Links</h4>
          <ul>
            <li><a href="about-us.html">About Us</a></li>
            <li><a href="services.html">Services</a></li>
            <li><a href="industries-we-serve.html">Industries</a></li>
            <li><a href="clients.html">Clients</a></li>
            <li><a href="gallery.html">Gallery</a></li>
            
            <li><a href="contact-us.html">Contact</a></li>
          </ul>
        </div>
        <div>
          <h4>Services</h4>
          <ul>${D.services.map(s=>`<li><a href="services.html">${s.title}</a></li>`).join("")}</ul>
        </div>
        <div>
          <h4>Get In Touch</h4>
          <ul>
            <li>📞 ${D.company.phone}</li>
            <li>✉ ${D.company.email}</li>
            <li>🌐 <a href="${D.company.website}" target="_blank">${D.company.website.replace("https://","")}</a></li>
            <li>📍 ${D.company.hq}</li>
          </ul>
          <div class="socials" style="margin-top:16px;">
            <a href="#" aria-label="Facebook"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M13 22v-8h3l.5-4H13V7.5c0-1.2.3-2 2-2h2V2.1C16.7 2 15.5 2 14.2 2 11.4 2 9.5 3.7 9.5 6.9V10H6.5v4h3v8z"/></svg></a>
            <a href="${D.company.instagram}" target="_blank" rel="noopener" aria-label="Instagram"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/></svg></a>
            <a href="#" aria-label="LinkedIn"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M4.98 3.5C4.98 4.88 3.87 6 2.5 6S.02 4.88.02 3.5 1.13 1 2.5 1s2.48 1.12 2.48 2.5zM0 8h5v16H0V8zm7.5 0H12v2.2h.1c.6-1.1 2-2.2 4.1-2.2 4.4 0 5.2 2.9 5.2 6.6V24h-5v-8.3c0-2-.04-4.5-2.75-4.5-2.76 0-3.18 2.15-3.18 4.37V24H7.5V8z"/></svg></a>
          </div>
          
        </div>
      </div>
      <div class="footer__bottom">
        <span>© <span data-year></span> V1 Facility and Security Services Private Limited. All rights reserved.</span>
        <span>Hyderabad, India</span>
      </div>
    </div>
  </footer>

  <button class="to-top" aria-label="Back to top">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 19V5M5 12l7-7 7 7"/></svg>
  </button>`;

  document.getElementById("nav-mount")?.insertAdjacentHTML("beforebegin", nav);
  document.getElementById("nav-mount")?.remove();
  document.getElementById("footer-mount")?.insertAdjacentHTML("beforebegin", footer);
  document.getElementById("footer-mount")?.remove();
})();