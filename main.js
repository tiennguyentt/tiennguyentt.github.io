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

})();
