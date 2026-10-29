/* V1 IMMERSIVE v2: 3D globe-and-orbit hero (canvas), word reveal, scroll fly-through, edge-lit cards, ambient depth */
(function () {
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  var fine = matchMedia("(hover:hover) and (pointer:fine)").matches;
  var small = innerWidth < 900;
  var hero = document.querySelector(".page-hero");
  var CARDS = ".svc-card,.wcu-card,.ind-card,.wc-card,.wcu-stat,.wcu-ops-card";

  /* ---------- hero 3D scene: wire globe + tilted orbit rings + depth dust, with floor reflection ---------- */
  function scene(host) {
    var cv = document.createElement("canvas"); cv.className = "im-gl"; cv.setAttribute("aria-hidden", "true"); host.appendChild(cv);
    var g = cv.getContext("2d"), dpr = Math.min(devicePixelRatio || 1, small ? 1.25 : 1.5), S, pts = [], rings = [], dust = [], mx = 0, my = 0, tx = 0, ty = 0, on = true, t = 0;
    function size() { S = cv.width = cv.height = Math.round(cv.clientWidth * dpr); }
    var LAT = small ? 9 : 13, LON = small ? 20 : 30, i, j;
    for (i = 1; i < LAT; i++) for (j = 0; j < LON; j++) {
      var la = Math.PI * i / LAT - Math.PI / 2, lo = 2 * Math.PI * j / LON;
      pts.push([Math.cos(la) * Math.cos(lo), Math.sin(la), Math.cos(la) * Math.sin(lo)]);
    }
    [[1.5, .5, 0, 0], [1.75, -.7, .6, 1], [2.0, .2, -.9, 0]].forEach(function (r) {
      var a = [], n = small ? 70 : 120;
      for (i = 0; i <= n; i++) { var u = i / n * 6.2832, x = Math.cos(u) * r[0], z = Math.sin(u) * r[0], y = 0;
        var y1 = y * Math.cos(r[1]) - z * Math.sin(r[1]), z1 = y * Math.sin(r[1]) + z * Math.cos(r[1]);
        var x2 = x * Math.cos(r[2]) - y1 * Math.sin(r[2]), y2 = x * Math.sin(r[2]) + y1 * Math.cos(r[2]); a.push([x2, y2, z1]); }
      rings.push({ p: a, c: r[3] });
    });
    for (i = 0; i < (small ? 40 : 90); i++) dust.push([(Math.random() - .5) * 6, (Math.random() - .5) * 4, (Math.random() - .5) * 6, Math.random()]);
    function P(p, ry, rx, flip) {
      var x = p[0] * Math.cos(ry) + p[2] * Math.sin(ry), z = -p[0] * Math.sin(ry) + p[2] * Math.cos(ry), y = p[1];
      var y2 = y * Math.cos(rx) - z * Math.sin(rx), z2 = y * Math.sin(rx) + z * Math.cos(rx);
      if (flip) y2 = -y2 - 2.5;
      var k = S * .42 / (4.6 - z2);
      return [S / 2 + x * k, S * .46 - y2 * k, (z2 + 2.2) / 4.4, k];
    }
    function draw() {
      g.clearRect(0, 0, S, S); t += .004; mx += (tx - mx) * .05; my += (ty - my) * .05;
      var ry = t + mx * .9, rx = .32 + my * .4;
      g.globalCompositeOperation = "lighter";
      /* soft core light */
      var c = P([0, 0, 0], ry, rx), cg = g.createRadialGradient(c[0], c[1], 0, c[0], c[1], S * .3);
      cg.addColorStop(0, "rgba(156,204,46,.22)"); cg.addColorStop(1, "rgba(156,204,46,0)"); g.fillStyle = cg; g.fillRect(0, 0, S, S);
      [0, 1].forEach(function (flip) {
        var A = flip ? .22 : 1;
        rings.forEach(function (r, ri) {
          var pr = r.p.map(function (p) { return P(p, ry * (ri % 2 ? -1.3 : 1.6), rx, flip); });
          for (var k = 1; k < pr.length; k++) {
            var d = Math.max(0, Math.min(1, (pr[k][2] + pr[k - 1][2]) / 2));
            g.strokeStyle = r.c ? "rgba(127,208,255," + (.12 + d * .5) * A + ")" : "rgba(198,228,92," + (.1 + d * .6) * A + ")";
            g.lineWidth = (1 + d * 1.6) * dpr; g.beginPath(); g.moveTo(pr[k - 1][0], pr[k - 1][1]); g.lineTo(pr[k][0], pr[k][1]); g.stroke();
          }
        });
        pts.forEach(function (p) {
          var q = P(p, ry, rx, flip), d = Math.max(0, Math.min(1, q[2]));
          g.fillStyle = "rgba(170,214,70," + (.08 + d * d * .85) * A + ")";
          var s = (.8 + d * 2.2) * dpr; g.fillRect(q[0] - s / 2, q[1] - s / 2, s, s);
        });
      });
      dust.forEach(function (p) {
        p[1] += .0015 + p[3] * .002; if (p[1] > 2) p[1] = -2;
        var q = P(p, ry * .4, rx), d = Math.max(0, Math.min(1, q[2]));
        g.fillStyle = "rgba(216,240,150," + d * .5 + ")"; g.fillRect(q[0], q[1], (.6 + p[3] * 1.4) * dpr, (.6 + p[3] * 1.4) * dpr);
      });
      g.globalCompositeOperation = "source-over";
    }
    function loop() { if (!on) return; draw(); requestAnimationFrame(loop); }
    new IntersectionObserver(function (l) { var v = l[0].isIntersecting; if (v && !on) { on = true; loop(); } on = v; }).observe(host);
    host.addEventListener("mousemove", function (e) { var r = host.getBoundingClientRect(); tx = (e.clientX - r.left) / r.width - .5; ty = (e.clientY - r.top) / r.height - .5; });
    addEventListener("resize", size); size(); loop();
  }

  function init() {
    var ticking = false, amb = [], cards = [];
    if (hero) {
      hero.insertAdjacentHTML("afterbegin", '<i class="im-beam"></i><i class="im-floor"></i><i class="im-fade"></i>');
      scene(hero);
      var h1 = hero.querySelector("h1"), n = 0;
      if (h1) [].slice.call(h1.childNodes).forEach(function (node) {
        if (node.nodeType !== 3) return;
        var f = document.createDocumentFragment();
        node.textContent.split(/\s+/).filter(Boolean).forEach(function (w) {
          var s = document.createElement("span"); s.className = "w"; s.style.setProperty("--i", n++); s.innerHTML = "<i>" + w + "</i>";
          f.appendChild(s); f.appendChild(document.createTextNode(" "));
        });
        node.replaceWith(f);
      });
    }

    /* section light line + ambient depth glows */
    var lio = new IntersectionObserver(function (l) { l.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("on"); lio.unobserve(e.target); } }); }, { threshold: 1 });
    document.querySelectorAll(".section,.cta-band").forEach(function (s, k) {
      var i = document.createElement("i"); i.className = "im-line"; s.insertBefore(i, s.firstChild); lio.observe(i);
      var w = document.createElement("div"); w.className = "im-ambwrap";
      [0, 1].forEach(function (m) {
        var a = document.createElement("i"); a.className = "im-amb"; var z = 160 + ((k + m) % 3) * 90;
        a.style.cssText = "width:" + z + "px;height:" + z + "px;left:" + (m ? 78 - k * 6 : 4 + k * 5) + "%;top:" + (m ? 62 : 18) + "%";
        a._k = (m ? -.12 : .18); amb.push([a, s]); w.appendChild(a);
      });
      s.insertBefore(w, s.children[1] || null);
    });

    /* cards: edge light, spotlight, parallax vars */
    document.querySelectorAll(CARDS).forEach(function (c) {
      cards.push(c);
      c.insertAdjacentHTML("beforeend", '<i class="im-spot"></i><i class="im-edge"></i>');
      if (fine) {
        c.addEventListener("mousemove", function (e) {
          var r = c.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top;
          c.style.setProperty("--sx", x + "px"); c.style.setProperty("--sy2", y + "px");
          c.style.setProperty("--cx", (x / r.width - .5).toFixed(3)); c.style.setProperty("--cy2", (y / r.height - .5).toFixed(3));
        });
        c.addEventListener("mouseleave", function () { c.style.setProperty("--cx", 0); c.style.setProperty("--cy2", 0); });
      }
    });

    /* scroll: hero depth, card fly-through progress, ambient parallax */
    function update() {
      var vh = innerHeight, y = scrollY;
      if (hero && y < vh * 1.3) hero.style.setProperty("--sy", y);
      cards.forEach(function (c) {
        var r = c.getBoundingClientRect();
        if (r.bottom < -100 || r.top > vh + 100) return;
        var p = Math.max(0, Math.min(1, (vh - r.top) / (vh * .5)));
        p = 1 - Math.pow(1 - p, 3);
        c.style.setProperty("--p", p.toFixed(3));
      });
      amb.forEach(function (a) {
        var r = a[1].getBoundingClientRect();
        if (r.bottom < 0 || r.top > vh) return;
        a[0].style.transform = "translate3d(0," + ((r.top + r.height / 2 - vh / 2) * a[0]._k).toFixed(1) + "px,0)";
      });
      ticking = false;
    }
    addEventListener("scroll", function () { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
    addEventListener("resize", update);
    update();
  }
  /* services/industries cards are rendered by inline scripts, so wait for the page to finish */
  if (document.readyState === "complete") init(); else addEventListener("load", init);
})();
