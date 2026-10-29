/* 3D premium motion: hero cube + mouse depth, card tilt with glare, flip-in entrances */
window.addEventListener("load", function () {
  var reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  var fine = matchMedia("(hover:hover) and (pointer:fine)").matches;

  /* hero: rotating service cube + mouse parallax */
  var hero = document.querySelector(".hero");
  if (hero && !reduce) {
    var f = ["Security", "Housekeeping", "M&E", "Pest Control", "Gardening", "Support"];
    var s = document.createElement("div");
    s.className = "cube-scene";
    s.innerHTML = '<div class="cube-tilt"><div class="cube">' + f.map(function (t) { return "<span>" + t + "</span>"; }).join("") + '</div></div><div class="cube-shadow"></div>';
    hero.appendChild(s);
    var tilt = s.querySelector(".cube-tilt");
    if (fine) hero.addEventListener("mousemove", function (e) {
      var x = e.clientX / innerWidth - 0.5, y = e.clientY / innerHeight - 0.5;
      tilt.style.setProperty("--ry", x * 40 + "deg");
      tilt.style.setProperty("--rx", -y * 30 + "deg");
      hero.style.setProperty("--px", -x * 24 + "px");
      hero.style.setProperty("--py", -y * 16 + "px");
    });
  }

  var cards = document.querySelectorAll(".svc-card,.wc-card,.team-card,.value,.ind-card,.blog-card");

  /* flip-in entrance */
  var io = new IntersectionObserver(function (l) {
    l.forEach(function (en) {
      if (!en.isIntersecting) return;
      var el = en.target;
      el.classList.remove("t3d-pre"); el.classList.add("t3d-in");
      el.addEventListener("animationend", function () { el.classList.remove("t3d-in"); }, { once: true });
      io.unobserve(el);
    });
  }, { threshold: 0.12 });
  if (!reduce) cards.forEach(function (c, i) {
    if (c.matches(".reveal,.reveal-left,.reveal-right,.reveal-zoom")) return;
    c.style.animationDelay = (i % 4) * 0.09 + "s";
    c.classList.add("t3d-pre"); io.observe(c);
  });

  /* tilt + glare */
  if (fine && !reduce) cards.forEach(function (c) {
    var g = document.createElement("i"); g.className = "glare"; c.appendChild(g);
    c.addEventListener("mousemove", function (e) {
      var r = c.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
      c.style.transition = "transform .08s linear";
      c.style.transform = "perspective(800px) rotateX(" + (0.5 - y) * 12 + "deg) rotateY(" + (x - 0.5) * 14 + "deg) translateZ(14px)";
      c.style.setProperty("--gx", x * 100 + "%"); c.style.setProperty("--gy", y * 100 + "%");
      c.classList.add("is-tilting");
    });
    c.addEventListener("mouseleave", function () {
      c.style.transition = "transform .6s cubic-bezier(.2,.7,.2,1)";
      c.style.transform = ""; c.classList.remove("is-tilting");
    });
  });
});

document.addEventListener("mousemove",function(e){var r=document.documentElement.style;r.setProperty("--mx",e.clientX+"px");r.setProperty("--my",e.clientY+"px");},{passive:true});
