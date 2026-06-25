/* Spec Engine - Tien Nguyen
   Vanilla JS, no libraries.
   - Progressive enhancement only: content is visible by default in CSS,
     reveals are layered on top. If JS fails, nothing is hidden.
   - Active line-number rail + active nav block-cursor via IntersectionObserver.
   - All motion respects prefers-reduced-motion. */

(function () {
  "use strict";

  /* Mark JS as ready so reveal styles can hide content only when we can reveal it.
     Added only after observer setup succeeds: if setup throws, .js-ready is never
     added (and is removed in the catch), so all .reveal content stays visible. */
  var root = document.documentElement;
  root.classList.add("js-ready");

  var prefersReduced = window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var sections = Array.prototype.slice.call(document.querySelectorAll("[data-section]"));
  var railItems = Array.prototype.slice.call(document.querySelectorAll("#rail li"));
  var navLinks = Array.prototype.slice.call(document.querySelectorAll("[data-navlink]"));

  /* ---- Reveal-on-scroll (hairline wipe, self-drawing checks) ---- */
  try {
    var reveals = Array.prototype.slice.call(document.querySelectorAll(".reveal"));
    if (prefersReduced) {
      reveals.forEach(function (el) { el.classList.add("is-visible"); });
    } else if ("IntersectionObserver" in window) {
      var revObs = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) {
            e.target.classList.add("is-visible");
            revObs.unobserve(e.target);
          }
        });
      }, { threshold: 0.18, rootMargin: "0px 0px -8% 0px" });
      reveals.forEach(function (el) { revObs.observe(el); });
    } else {
      reveals.forEach(function (el) { el.classList.add("is-visible"); });
    }
  } catch (err) {
    /* Setup failed: drop js-ready so the CSS fallback keeps .reveal content visible. */
    root.classList.remove("js-ready");
  }

  /* ---- Active section tracking: rail number + nav cursor ---- */
  function setActive(section) {
    var railIdx = parseInt(section.getAttribute("data-rail"), 10);
    railItems.forEach(function (li, i) {
      li.classList.toggle("lit", i === railIdx);
    });

    var sid = section.getAttribute("data-section");
    navLinks.forEach(function (link) {
      var active = link.getAttribute("data-navlink") === sid;
      link.classList.toggle("is-active", active);
      if (active) {
        link.setAttribute("aria-current", "true");
      } else {
        link.removeAttribute("aria-current");
      }
    });
  }

  if ("IntersectionObserver" in window) {
    var current = null;
    var ratios = {};
    var actObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        ratios[e.target.id] = e.isIntersecting ? e.intersectionRatio : 0;
      });
      // pick the most-visible section
      var best = null, bestR = 0;
      sections.forEach(function (s) {
        var r = ratios[s.id] || 0;
        if (r > bestR) { bestR = r; best = s; }
      });
      if (best && best !== current) {
        current = best;
        setActive(best);
      }
    }, { threshold: [0, 0.25, 0.5, 0.75, 1], rootMargin: "-56px 0px -40% 0px" });
    sections.forEach(function (s) { actObs.observe(s); });
  }

  // Initial state: hero active
  if (sections.length) { setActive(sections[0]); }

  /* ---- Selected Work timeline: progress fill follows the scroll ---- */
  var tl = document.querySelector("#work .timeline");
  var tlFill = document.querySelector("#work .timeline__progress");
  if (tl && tlFill) {
    if (prefersReduced) {
      tlFill.style.height = "100%";
    } else {
      var ticking = false;
      var updateTimeline = function () {
        var r = tl.getBoundingClientRect();
        var center = window.innerHeight * 0.55;
        var filled = Math.min(Math.max(center - r.top, 0), Math.max(r.height - 24, 0));
        tlFill.style.height = filled + "px";
        ticking = false;
      };
      window.addEventListener("scroll", function () {
        if (!ticking) { window.requestAnimationFrame(updateTimeline); ticking = true; }
      }, { passive: true });
      window.addEventListener("resize", updateTimeline);
      updateTimeline();
    }
  }

  /* ---- Scroll-scrubbed pipeline: nodes light Ingest -> Sign off with scroll ---- */
  var pipe = document.querySelector(".pipeline--scrub");
  if (pipe) {
    var pnodes = Array.prototype.slice.call(pipe.querySelectorAll(".pnode"));
    if (prefersReduced) {
      pnodes.forEach(function (n) { n.classList.add("pnode--lit"); });
    } else {
      var pTicking = false;
      var updatePipe = function () {
        var r = pipe.getBoundingClientRect();
        var start = window.innerHeight * 0.85;   // begin lighting as the figure enters
        var end = window.innerHeight * 0.4;      // fully lit once it sits mid-viewport
        var p = (start - r.top) / (start - end);
        p = Math.min(Math.max(p, 0), 1);
        var lit = Math.round(p * pnodes.length);
        pnodes.forEach(function (n, i) { n.classList.toggle("pnode--lit", i < lit); });
        pTicking = false;
      };
      window.addEventListener("scroll", function () {
        if (!pTicking) { window.requestAnimationFrame(updatePipe); pTicking = true; }
      }, { passive: true });
      window.addEventListener("resize", updatePipe);
      updatePipe();
    }
  }

  /* ---- Hero canvas: generative cellular automaton (agentic-governance metaphor) ----
     Coarse grid, slow generations, soft alpha-decay shimmer in the teal accent.
     Pauses when offscreen or tab hidden. Skipped entirely on reduced-motion. */
  var heroCanvas = document.getElementById("heroCanvas");
  if (heroCanvas && !prefersReduced && heroCanvas.getContext) {
    try {
      (function () {
        var ctx = heroCanvas.getContext("2d");
        var CELL = 22;
        var cols = 0, rows = 0, cur = [], alpha = [];
        var dpr = Math.min(window.devicePixelRatio || 1, 2);
        var running = false, rafId = null, lastGen = 0;
        var GEN_MS = 600;

        function idx(x, y) { return y * cols + x; }

        function seed() {
          cur = new Array(cols * rows);
          alpha = new Array(cols * rows);
          for (var i = 0; i < cur.length; i++) {
            cur[i] = Math.random() < 0.12 ? 1 : 0;   // sparse, quiet field
            alpha[i] = cur[i] ? 0.3 : 0;
          }
        }

        function size() {
          var rect = heroCanvas.getBoundingClientRect();
          if (!rect.width || !rect.height) { return; }
          dpr = Math.min(window.devicePixelRatio || 1, 2);
          heroCanvas.width = Math.round(rect.width * dpr);
          heroCanvas.height = Math.round(rect.height * dpr);
          ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
          cols = Math.ceil(rect.width / CELL);
          rows = Math.ceil(rect.height / CELL);
          seed();
        }

        function neighbors(x, y) {
          var n = 0;
          for (var dy = -1; dy <= 1; dy++) {
            for (var dx = -1; dx <= 1; dx++) {
              if (dx === 0 && dy === 0) { continue; }
              var nx = x + dx, ny = y + dy;
              if (nx >= 0 && nx < cols && ny >= 0 && ny < rows && cur[idx(nx, ny)]) { n++; }
            }
          }
          return n;
        }

        function step() {
          var next = new Array(cols * rows);
          for (var y = 0; y < rows; y++) {
            for (var x = 0; x < cols; x++) {
              var i = idx(x, y), n = neighbors(x, y);
              var alive = cur[i] ? (n === 2 || n === 3) : (n === 3);  // B3/S23
              next[i] = alive ? 1 : 0;
              if (alive) { alpha[i] = 0.32; }
              else { alpha[i] = Math.max(0, alpha[i] - 0.06); }       // soft decay trail
            }
          }
          cur = next;
        }

        function draw() {
          var rect = heroCanvas.getBoundingClientRect();
          ctx.clearRect(0, 0, rect.width, rect.height);
          for (var y = 0; y < rows; y++) {
            for (var x = 0; x < cols; x++) {
              var a = alpha[idx(x, y)];
              if (a <= 0.02) { continue; }
              ctx.fillStyle = "rgba(45, 212, 191, " + (a * 0.6).toFixed(3) + ")";
              ctx.fillRect(x * CELL + 1, y * CELL + 1, CELL - 3, CELL - 3);
            }
          }
        }

        function loop(t) {
          if (t - lastGen > GEN_MS) { step(); lastGen = t; }
          draw();
          if (running) { rafId = window.requestAnimationFrame(loop); }
        }
        function start() { if (!running) { running = true; rafId = window.requestAnimationFrame(loop); } }
        function stop() { running = false; if (rafId) { window.cancelAnimationFrame(rafId); rafId = null; } }

        size();
        var rTick = false;
        window.addEventListener("resize", function () {
          if (!rTick) { window.requestAnimationFrame(function () { size(); rTick = false; }); rTick = true; }
        });

        if ("IntersectionObserver" in window) {
          var hObs = new IntersectionObserver(function (es) {
            es.forEach(function (e) { if (e.isIntersecting) { start(); } else { stop(); } });
          }, { threshold: 0 });
          hObs.observe(document.getElementById("hero"));
        } else { start(); }

        document.addEventListener("visibilitychange", function () {
          if (document.hidden) { stop(); }
          else if (heroCanvas.getBoundingClientRect().bottom > 0) { start(); }
        });
      })();
    } catch (e) { /* canvas optional: never break the page */ }
  }

  /* ---- Mobile nav: hamburger toggle ----
     Panel and links already exist in the DOM (one set, no duplicates), so the
     active-nav IntersectionObserver above keeps working untouched. Here we
     only handle open/close, focus, and the close triggers. */
  var navToggle = document.getElementById("navtoggle");
  var navPanel = document.getElementById("navpanel");
  if (navToggle && navPanel) {
    var navOpen = false;

    var openNav = function () {
      navOpen = true;
      navPanel.classList.add("is-open");
      navToggle.setAttribute("aria-expanded", "true");
      navToggle.setAttribute("aria-label", "Close menu");
      var first = navPanel.querySelector("a");
      if (first) { first.focus(); }
    };

    var closeNav = function (returnFocus) {
      navOpen = false;
      navPanel.classList.remove("is-open");
      navToggle.setAttribute("aria-expanded", "false");
      navToggle.setAttribute("aria-label", "Open menu");
      if (returnFocus) { navToggle.focus(); }
    };

    navToggle.addEventListener("click", function () {
      if (navOpen) { closeNav(true); } else { openNav(); }
    });

    /* Close after picking a destination link. */
    navPanel.addEventListener("click", function (e) {
      var link = e.target.closest && e.target.closest("a");
      if (link) { closeNav(false); }
    });

    /* Escape closes and returns focus to the button. */
    document.addEventListener("keydown", function (e) {
      if (navOpen && (e.key === "Escape" || e.key === "Esc")) { closeNav(true); }
    });

    /* Tap or click outside the panel and button closes the menu. */
    document.addEventListener("click", function (e) {
      if (!navOpen) { return; }
      if (!navPanel.contains(e.target) && !navToggle.contains(e.target)) { closeNav(false); }
    });

    /* Reset state if the viewport grows past the mobile breakpoint while open. */
    if (window.matchMedia) {
      var mq = window.matchMedia("(max-width: 768px)");
      var onChange = function () { if (!mq.matches && navOpen) { closeNav(false); } };
      if (mq.addEventListener) { mq.addEventListener("change", onChange); }
      else if (mq.addListener) { mq.addListener(onChange); }
    }
  }

})();
