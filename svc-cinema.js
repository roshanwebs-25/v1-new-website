/* V1 service cards: cinematic entrance + 3D tilt + cursor light */
addEventListener("load", function () {
  var reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  var fine = matchMedia("(hover:hover) and (pointer:fine)").matches;
  var cards = document.querySelectorAll(".svc-card");
  if (!cards.length) return;

  cards.forEach(function (c) {
    c.insertAdjacentHTML("beforeend", '<i class="cin-shine"></i><i class="cin-sweep"></i>');
  });

  /* entrance */
  if (!reduce) {
    var io = new IntersectionObserver(function (list) {
      list.forEach(function (en) {
        if (!en.isIntersecting) return;
        var el = en.target;
        el.classList.remove("cin-pre"); el.classList.add("cin-in");
        io.unobserve(el);
      });
    }, { threshold: 0.15 });
    var seen = new Map();
    cards.forEach(function (c) {
      var p = c.parentElement, i = seen.get(p) || 0; seen.set(p, i + 1);
      c.style.setProperty("--cd", (i % 4) * 0.14 + "s");
      c.classList.add("cin-pre"); io.observe(c);
    });
  }

  /* 3D tilt + parallax + spotlight (mouse devices only) */
  if (!fine || reduce) return;
  cards.forEach(function (c) {
    c.addEventListener("mouseenter", function () { c.classList.add("is-hot"); c.style.setProperty("--lift", "-10px"); });
    c.addEventListener("mousemove", function (e) {
      var r = c.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
      c.style.setProperty("--ry", ((x - .5) * 16).toFixed(2) + "deg");
      c.style.setProperty("--rx", ((.5 - y) * 14).toFixed(2) + "deg");
      c.style.setProperty("--mx", (x - .5).toFixed(3));
      c.style.setProperty("--my", (y - .5).toFixed(3));
      c.style.setProperty("--lx", (x * 100).toFixed(1) + "%");
      c.style.setProperty("--ly", (y * 100).toFixed(1) + "%");
    });
    c.addEventListener("mouseleave", function () {
      c.classList.remove("is-hot");
      ["--rx", "--ry", "--mx", "--my", "--lift"].forEach(function (v) { c.style.removeProperty(v); });
    });
  });
});