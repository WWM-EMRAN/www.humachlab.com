(function () {
  function animateCount(el, to, duration) {
    const start = 0;
    const startTime = performance.now();

    function tick(now) {
      const p = Math.min((now - startTime) / duration, 1);
      const value = Math.floor(start + (to - start) * p);
      el.textContent = value.toString();

      if (p < 1) requestAnimationFrame(tick);
      else el.textContent = to.toString(); // final exact
    }

    requestAnimationFrame(tick);
  }

  function initImpactCounters() {
    const els = document.querySelectorAll(".hml-impact-number[data-count]");
    if (!els.length) return;

    // Only run once
    els.forEach(el => { el.dataset.done = el.dataset.done || "0"; });

    // Trigger when section is visible
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;

        els.forEach(el => {
          if (el.dataset.done === "1") return;
          el.dataset.done = "1";
          const to = parseInt(el.getAttribute("data-count") || "0", 10);
          animateCount(el, to, 900);
        });

        observer.disconnect();
      });
    }, { threshold: 0.25 });

    observer.observe(els[0].closest(".hml-impact-metrics"));
  }

  window.initImpactCounters = initImpactCounters;
})();
