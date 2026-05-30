/* Spec Engine - Tien Nguyen
   Vanilla JS, no libraries.
   - Progressive enhancement only: content is visible by default in CSS,
     reveals are layered on top. If JS fails, nothing is hidden.
   - Active line-number rail + active nav block-cursor via IntersectionObserver.
   - All motion respects prefers-reduced-motion. */

(function () {
  "use strict";

  /* Mark JS as active so reveal styles can hide content only when we can reveal it. */
  document.documentElement.classList.add("js");

  var prefersReduced = window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var sections = Array.prototype.slice.call(document.querySelectorAll("[data-section]"));
  var railItems = Array.prototype.slice.call(document.querySelectorAll("#rail li"));
  var navLinks = Array.prototype.slice.call(document.querySelectorAll("[data-navlink]"));

  /* ---- Reveal-on-scroll (hairline wipe, self-drawing checks) ---- */
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

  /* ---- Active section tracking: rail number + nav cursor ---- */
  function setActive(section) {
    var railIdx = parseInt(section.getAttribute("data-rail"), 10);
    railItems.forEach(function (li, i) {
      li.classList.toggle("lit", i === railIdx);
    });

    var sid = section.getAttribute("data-section");
    navLinks.forEach(function (link) {
      link.classList.toggle("is-active", link.getAttribute("data-navlink") === sid);
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
})();
