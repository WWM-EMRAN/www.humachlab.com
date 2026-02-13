async function loadIncludes() {
  const nodes = document.querySelectorAll("[data-include]");

  for (const node of nodes) {
    const file = node.getAttribute("data-include");
    try {
      const res = await fetch(file, { cache: "no-cache" });
      if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
      const html = await res.text();

      node.innerHTML = html;

      const scripts = Array.from(node.querySelectorAll("script"));
      for (const oldScript of scripts) {
        const newScript = document.createElement("script");

        for (const attr of oldScript.attributes) {
          newScript.setAttribute(attr.name, attr.value);
        }

        if (oldScript.src) {
          await new Promise((resolve, reject) => {
            newScript.onload = resolve;
            newScript.onerror = reject;
            newScript.src = oldScript.src;
            document.body.appendChild(newScript);
          });
        } else {
          newScript.textContent = oldScript.textContent;
          document.body.appendChild(newScript);
        }

        oldScript.remove();
      }

    } catch (err) {
      node.innerHTML = `<!-- include failed: ${file} -->`;
      console.error("Include error:", file, err);
    }
  }

  function signalComponentsReady() {
    if (window.__componentsReadyFired) return;
    window.__componentsReadyFired = true;
    window.dispatchEvent(new Event("components:ready"));
  }

  // Theme customizer init (if you use this hook)
  if (window.initThemeCustomizer) {
    window.initThemeCustomizer();
  }

  if (window.initImpactCounters) {
    window.initImpactCounters();
  }


  // If Layout is used, initialize it and THEN signal "ready"
  if (window.Layout && window.jQuery) {
    jQuery(function () {
      Layout.init();
      Layout.initOWL?.();
      Layout.initTwitter?.();
      Layout.initFixHeaderWithPreHeader?.();
      Layout.initNavScrolling?.();

      // ✅ Fire AFTER Layout init finishes
      signalComponentsReady();
    });
  } else {
    // ✅ No Layout path — safe to fire now
    signalComponentsReady();
  }
}

document.addEventListener("DOMContentLoaded", loadIncludes);

window.dispatchEvent(new Event("components:ready"));

window.Preload?.hidePreloader?.();

