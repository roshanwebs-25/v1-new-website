/* V1 LUXE motion: split-text headline, hero video slot, surveillance HUD canvas, 3D orbit, scroll depth, magnetic buttons, page transitions */
(function () {
  var reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  var fine = matchMedia("(hover:hover) and (pointer:fine)").matches;
  var small = innerWidth < 800;

  /* smooth page transitions between pages */
  document.addEventListener("click", function (e) {
    var a = e.target.closest("a[href]");
    if (!a || a.target || e.metaKey || e.ctrlKey || e.shiftKey) return;
    var h = a.getAttribute("href");
    if (!/^[\w-]+\.html(#.*)?$/.test(h) || reduce) return;
    e.preventDefault();
    document.body.classList.add("v1-leave");
    setTimeout(function () { location.href = h; }, 380);
  });
  addEventListener("pageshow", function (e) { if (e.persisted) document.body.classList.remove("v1-leave"); });

  /* magnetic buttons */
  if (fine && !reduce) document.querySelectorAll(".btn,.nav__cta").forEach(function (b) {
    b.addEventListener("mousemove", function (e) {
      var r = b.getBoundingClientRect();
      b.style.transform = "translate(" + (e.clientX - r.left - r.width / 2) * .18 + "px," + (e.clientY - r.top - r.height / 2) * .3 + "px)";
    });
    b.addEventListener("mouseleave", function () { b.style.transform = ""; });
  });

  var hero = document.querySelector(".hero");
  if (!hero) return;

  /* headline: word-by-word cinematic rise */
  var h1 = hero.querySelector("h1"), n = 0;
  if (h1 && !reduce) [].slice.call(h1.childNodes).forEach(function (node) {
    if (node.nodeType !== 3) return;
    var f = document.createDocumentFragment();
    node.textContent.split(/\s+/).filter(Boolean).forEach(function (w) {
      var s = document.createElement("span");
      s.className = "w"; s.style.setProperty("--i", n++); s.innerHTML = "<i>" + w + "</i>";
      f.appendChild(s); f.appendChild(document.createTextNode(" "));
    });
    node.replaceWith(f);
  });

  /* ===== CINEMATIC LOGO REVEAL (live canvas + synthesized score, loops every 9s) ===== */
  var D = window.ASFS_DATA, LOGO = (D && D.company && D.company.logo) || "https://res.cloudinary.com/dsn3p1co7/image/upload/v1792944021/v1_logo_vxsyja.png";
  var T = 9, TI = 4.4, COLS = 7;
  var cv = document.createElement("canvas"); cv.className = "v1-reveal"; cv.setAttribute("aria-hidden", "true");
  hero.insertBefore(cv, hero.querySelector(".hero__content"));
  var g = cv.getContext("2d"), img = new Image(), dpr = Math.min(devicePixelRatio || 1, 1.5);
  var W, H, mob, lw, lh, cx, cy, shards = [], parts = [], flags = {}, oc = document.createElement("canvas"), seeds = [];
  var perm = []; for (var i = 0; i < 42; i++) perm.push(i);
  perm.sort(function () { return Math.random() - .5; });
  for (i = 0; i < 42; i++) seeds.push({ a: Math.random() * 6.283, d: .5 + Math.random(), r: (Math.random() - .5) * 7, z: .3 + Math.random() * 2.1, o: perm[i] / 42 });
  var ease = function (p) { return 1 - Math.pow(1 - p, 3); };
  var land = function (s) { return 1.6 + s.o * 1.7 + .95; };

  function layout() {
    W = cv.width = hero.clientWidth * dpr; H = cv.height = hero.clientHeight * dpr; mob = hero.clientWidth < 800;
    var ar = img.width / img.height, mw = mob ? W * .74 : W * .32, mh = mob ? H * .3 : H * .5;
    lw = Math.min(mw, mh * ar); lh = lw / ar; cx = mob ? W / 2 : W * .73; cy = mob ? H * .27 : H * .5;
    oc.width = Math.ceil(lw); oc.height = Math.ceil(lh);
    var rows = Math.max(3, Math.min(6, Math.round(COLS * img.height / img.width))), tw = lw / COLS, th = lh / rows;
    shards = [];
    for (var r = 0; r < rows; r++) for (var c = 0; c < COLS; c++) {
      var s = seeds[(r * COLS + c) % 42];
      shards.push({ sx: c * img.width / COLS, sy: r * img.height / rows, sw: img.width / COLS, sh: img.height / rows, tx: cx - lw / 2 + c * tw + tw / 2, ty: cy - lh / 2 + r * th + th / 2, tw: tw, th: th, s: s, dist: s.d * Math.max(W, H) * .55, done: false });
    }
  }
  function burst(x, y, n, sp, life) {
    for (var i = 0; i < n && parts.length < (mob ? 160 : 320); i++) {
      var a = Math.random() * 6.283, v = (.2 + Math.random()) * sp * dpr;
      parts.push({ x: x, y: y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, l: 0, m: life * (.5 + Math.random()), z: (1 + Math.random() * 2) * dpr });
    }
  }
  for (i = 0; i < 36; i++) parts.push({ x: Math.random() * 2000, y: Math.random() * 1200, vx: 0, vy: -.08, l: 0, m: 1e9, z: dpr, amb: 1 });

  /* ---- audio: synthesized, scheduled on the same clock as the visuals ---- */
  var ac, master, s0, nextAt, noise, muted = true;
  function sched(A) {
    var out = master;
    function env(gn, t, pk, att, dec) { gn.gain.setValueAtTime(.0001, A + t); gn.gain.exponentialRampToValueAtTime(pk, A + t + att); gn.gain.exponentialRampToValueAtTime(.0001, A + t + att + dec); }
    function osc(type, f0, f1, t, dur, pk, att, dest) {
      var o = ac.createOscillator(), gn = ac.createGain(); o.type = type;
      o.frequency.setValueAtTime(f0, A + t); if (f1) o.frequency.exponentialRampToValueAtTime(f1, A + t + dur);
      env(gn, t, pk, att, dur); o.connect(gn); gn.connect(dest || out); o.start(A + t); o.stop(A + t + dur + att + .1);
    }
    function nz(ftype, f0, f1, t, dur, pk, att) {
      var s = ac.createBufferSource(), f = ac.createBiquadFilter(), gn = ac.createGain();
      s.buffer = noise; s.loop = true; f.type = ftype; f.Q.value = 1.5;
      f.frequency.setValueAtTime(f0, A + t); if (f1) f.frequency.exponentialRampToValueAtTime(f1, A + t + dur);
      env(gn, t, pk, att, dur - att); s.connect(f); f.connect(gn); gn.connect(out); s.start(A + t); s.stop(A + t + dur + .1);
    }
    /* drone + sub build tension */
    [55, 55.7].forEach(function (fr) {
      var o = ac.createOscillator(), f = ac.createBiquadFilter(), gn = ac.createGain();
      o.type = "sawtooth"; o.frequency.value = fr; f.type = "lowpass"; f.frequency.setValueAtTime(100, A + .8); f.frequency.exponentialRampToValueAtTime(1400, A + TI);
      gn.gain.setValueAtTime(.0001, A + .8); gn.gain.exponentialRampToValueAtTime(.16, A + TI - .1); gn.gain.exponentialRampToValueAtTime(.0001, A + 8.3);
      o.connect(f); f.connect(gn); gn.connect(out); o.start(A + .8); o.stop(A + 8.4);
    });
    osc("sine", 38, 38, .8, 7.4, .3, 3.4);
    nz("bandpass", 300, 7000, 1.2, 3.25, .24, 3.1);              /* riser */
    osc("sine", 2400, 2400, 1.1, .5, .07, .005); nz("highpass", 6000, 6000, 1.1, .15, .1, .003); /* spark */
    [1.8, 2.5, 3.1, 3.6, 3.95, 4.2].forEach(function (k, n) { osc("sine", 140, 38, k, .3, .5 + n * .05, .005); }); /* heartbeat */
    shards.forEach(function (s, n) { if (n % 2 === 0) osc("triangle", 700 + n * 28, 700 + n * 28, land(s.s) - .05, .07, .05, .003); });
    osc("sine", 100, 26, TI, 1.6, 1, .004);                       /* impact */
    nz("lowpass", 2200, 200, TI, .9, .8, .003);
    [880, 2429, 4752].forEach(function (fr, n) { osc("sine", fr, fr, TI, 2.2, .045 / (n + 1), .004); });
    nz("highpass", 4000, 9000, TI + .05, 2.4, .14, .02);
    [110, 164.8, 220].forEach(function (fr) {
      var o = ac.createOscillator(), f = ac.createBiquadFilter(), gn = ac.createGain();
      o.type = "sawtooth"; o.frequency.value = fr; f.type = "lowpass"; f.frequency.value = 800;
      env(gn, TI, .08, .08, 3.3); o.connect(f); f.connect(gn); gn.connect(out); o.start(A + TI); o.stop(A + TI + 3.6);
    });
  }
  function startAudio() {
    ac = new (window.AudioContext || window.webkitAudioContext)();
    var comp = ac.createDynamicsCompressor(); master = ac.createGain(); master.gain.value = 0;
    master.connect(comp); comp.connect(ac.destination);
    noise = ac.createBuffer(1, ac.sampleRate * 2, ac.sampleRate);
    var d = noise.getChannelData(0); for (var i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    s0 = ac.currentTime + .1; sched(s0); nextAt = s0 + T;
    flags = {}; parts = parts.filter(function (p) { return p.amb; }); shards.forEach(function (s) { s.done = false; });
  }
  var t0 = performance.now(), prevT = 0;
  function time() {
    if (ac) return (((ac.currentTime - s0) % T) + T) % T;
    return ((performance.now() - t0) / 1000) % T;
  }

  /* ---- sound button ---- */
  var btn = document.createElement("button");
  btn.className = "v1-snd"; btn.type = "button"; btn.setAttribute("aria-pressed", "false"); btn.setAttribute("aria-label", "Turn sound on");
  var ico = function (on) { return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 9v6h4l5 4V5L8 9H4z"/>' + (on ? '<path d="M16.5 8.5a5 5 0 010 7M19 6a9 9 0 010 12"/>' : '<path d="M17 9l5 6M22 9l-5 6"/>') + '</svg><span>' + (on ? "Sound on" : "Sound off") + '</span>'; };
  btn.innerHTML = ico(false); hero.appendChild(btn);
  btn.addEventListener("click", function () {
    if (!ac) startAudio();
    ac.resume(); muted = !muted;
    master.gain.setTargetAtTime(muted ? 0 : .9, ac.currentTime, .08);
    btn.innerHTML = ico(!muted); btn.setAttribute("aria-pressed", String(!muted)); btn.setAttribute("aria-label", muted ? "Turn sound on" : "Turn sound off");
    btn.classList.toggle("is-on", !muted);
  });

  /* ---- render ---- */
  var on = true, last = performance.now();
  new IntersectionObserver(function (l) { on = l[0].isIntersecting; if (on) { last = performance.now(); loop(); } }).observe(hero);
  function frame(now) {
    var dt = Math.min(.05, (now - last) / 1000); last = now;
    var t = reduce ? 5.5 : time();
    if (t < prevT) { flags = {}; shards.forEach(function (s) { s.done = false; }); parts = parts.filter(function (p) { return p.amb; }); }
    prevT = t;
    if (ac && nextAt - ac.currentTime < 2) { sched(nextAt); nextAt += T; }
    var fade = t > 7.6 ? Math.max(0, 1 - (t - 7.6)) : 1, sh = 0;
    g.clearRect(0, 0, W, H);
    /* tension glow */
    var ga = t < 1.2 ? 0 : Math.min(.4, (t - 1.2) / (TI - 1.2) * .4);
    var bg = g.createRadialGradient(cx, cy, 0, cx, cy, Math.max(W, H) * .55);
    bg.addColorStop(0, "rgba(42,143,214," + ga * fade + ")"); bg.addColorStop(.5, "rgba(38,64,143," + ga * .5 * fade + ")"); bg.addColorStop(1, "rgba(0,0,0,0)");
    g.fillStyle = bg; g.fillRect(0, 0, W, H);
    if (t > TI && t < TI + .6) sh = (1 - (t - TI) / .6) * 7 * dpr;
    g.save(); if (sh) g.translate((Math.random() - .5) * sh, (Math.random() - .5) * sh);
    g.globalCompositeOperation = "lighter";
    /* spark */
    if (t >= 1.1 && !flags.sp) { flags.sp = 1; burst(cx, cy, 34, 120, .9); }
    var core = t < 1.1 ? 0 : t < 1.3 ? (t - 1.1) / .2 : t < TI ? 1 - (t - 1.3) / (TI - 1.3) * .6 : 0;
    if (core > 0) {
      var rr = (16 + (t < 1.9 ? 34 * Math.min(1, (t - 1.1) * 3) : 22)) * dpr, sg = g.createRadialGradient(cx, cy, 0, cx, cy, rr * 2.2);
      sg.addColorStop(0, "rgba(255,255,255," + core + ")"); sg.addColorStop(.25, "rgba(244,228,182," + core * .8 + ")"); sg.addColorStop(1, "rgba(216,189,126,0)");
      g.fillStyle = sg; g.fillRect(cx - rr * 2.2, cy - rr * 2.2, rr * 4.4, rr * 4.4);
      g.fillStyle = "rgba(255,245,215," + core * .7 + ")"; g.fillRect(cx - rr * 3.5, cy - dpr * .8, rr * 7, dpr * 1.6);
    }
    g.globalCompositeOperation = "source-over";
    /* shards or assembled logo */
    if (t < TI) {
      shards.forEach(function (s) {
        var raw = (t - (1.6 + s.s.o * 1.7)) / .95; if (raw <= 0) return;
        var p = ease(Math.min(1, raw)), px = s.tx + Math.cos(s.s.a) * s.dist * (1 - p), py = s.ty + Math.sin(s.s.a) * s.dist * .6 * (1 - p);
        if (raw < 1) {
          var q = ease(Math.max(0, raw - .12)), qx = s.tx + Math.cos(s.s.a) * s.dist * (1 - q), qy = s.ty + Math.sin(s.s.a) * s.dist * .6 * (1 - q);
          g.globalCompositeOperation = "lighter"; g.strokeStyle = "rgba(244,228,182," + .55 * (1 - p) + ")"; g.lineWidth = 2 * dpr; g.lineCap = "round";
          g.beginPath(); g.moveTo(qx, qy); g.lineTo(px, py); g.stroke(); g.globalCompositeOperation = "source-over";
        } else if (!s.done) { s.done = true; burst(s.tx, s.ty, 5, 70, .6); }
        var sc = s.s.z + (1 - s.s.z) * p;
        g.save(); g.globalAlpha = Math.min(1, p * 3) * fade; g.translate(px, py); g.rotate(s.s.r * (1 - p)); g.scale(sc, sc);
        g.drawImage(img, s.sx, s.sy, s.sw, s.sh, -s.tw / 2, -s.th / 2, s.tw + .7, s.th + .7); g.restore();
      });
    } else {
      var u = (t - 4.9) / 1.5, k = Math.min(1, (t - TI) / .8);
      g.save(); g.globalAlpha = fade;
      g.shadowColor = "rgba(42,143,214,.6)"; g.shadowBlur = 36 * dpr * k;
      if (u > 0 && u < 1) {
        var o = oc.getContext("2d"); o.globalCompositeOperation = "source-over"; o.clearRect(0, 0, oc.width, oc.height); o.drawImage(img, 0, 0, oc.width, oc.height);
        o.globalCompositeOperation = "source-atop"; var bx = -oc.width * .3 + u * oc.width * 1.6, bgd = o.createLinearGradient(bx - oc.width * .14, 0, bx + oc.width * .14, 0);
        bgd.addColorStop(0, "rgba(255,255,255,0)"); bgd.addColorStop(.5, "rgba(255,255,255,.8)"); bgd.addColorStop(1, "rgba(255,255,255,0)");
        o.fillStyle = bgd; o.fillRect(0, 0, oc.width, oc.height);
        g.drawImage(oc, cx - lw / 2, cy - lh / 2, lw, lh);
      } else g.drawImage(img, cx - lw / 2, cy - lh / 2, lw, lh);
      g.restore();
      /* impact: flash, shockwave, anamorphic streak */
      if (!flags.im) { flags.im = 1; burst(cx, cy, 110, 340, 1.4); }
      var ti = t - TI, fl = Math.max(0, 1 - ti / .6);
      g.globalCompositeOperation = "lighter";
      if (fl > 0) { g.fillStyle = "rgba(255,244,214," + fl * .35 + ")"; g.fillRect(0, 0, W, H); }
      if (ti < 1.4) {
        g.strokeStyle = "rgba(244,228,182," + (1 - ti / 1.4) * .7 + ")"; g.lineWidth = 3 * dpr * (1 - ti / 1.4); g.beginPath(); g.arc(cx, cy, ti * Math.max(W, H) * .5, 0, 6.283); g.stroke();
        var sl = g.createLinearGradient(0, 0, W, 0); sl.addColorStop(0, "rgba(42,143,214,0)"); sl.addColorStop(.5, "rgba(190,225,255," + (1 - ti / 1.4) * .9 + ")"); sl.addColorStop(1, "rgba(42,143,214,0)");
        g.fillStyle = sl; g.fillRect(0, cy - dpr, W, 2 * dpr);
      }
      g.globalCompositeOperation = "source-over";
    }
    /* particles */
    g.globalCompositeOperation = "lighter";
    for (var i = parts.length - 1; i >= 0; i--) {
      var p2 = parts[i];
      if (p2.amb) { p2.y += p2.vy * dpr * 60 * dt; if (p2.y < 0) { p2.y = H; p2.x = Math.random() * W; } if (p2.x > W) p2.x = Math.random() * W; g.fillStyle = "rgba(216,189,126,.25)"; g.fillRect(p2.x, p2.y, p2.z, p2.z); continue; }
      p2.l += dt; if (p2.l > p2.m) { parts.splice(i, 1); continue; }
      p2.x += p2.vx * dt * 60 * .06; p2.y += p2.vy * dt * 60 * .06; p2.vx *= .985; p2.vy *= .985;
      g.fillStyle = "rgba(255,226,160," + (1 - p2.l / p2.m) * fade + ")"; g.fillRect(p2.x, p2.y, p2.z, p2.z);
    }
    g.restore();
  }
  function loop(now) { if (!on || reduce) return; frame(performance.now()); requestAnimationFrame(loop); }
  img.onload = function () { layout(); if (reduce) frame(performance.now()); else loop(); };
  img.src = LOGO;
  addEventListener("resize", function () { if (img.width) layout(); });
  if (reduce) btn.style.display = "none";

  /* scroll depth for hero (CSS reads --sy) */
  var tick = false;
  addEventListener("scroll", function () {
    if (tick) return; tick = true;
    requestAnimationFrame(function () { if (scrollY < innerHeight * 1.2) hero.style.setProperty("--sy", scrollY); tick = false; });
  }, { passive: true });
})();
