
/**
 * humachlab website (static build) runtime
 * - Replaces Django context variables rendered as <span data-dj-var="..."></span>
 * - Supports theme color switching (logo, favicon, theme css)
 * - Simulates Django GET/POST pages via query params
 */
(function () {
  function qp() {
    const u = new URL(window.location.href);
    return u.searchParams;
  }

  // --- theme color ---
  const DEFAULT_COLOR = "red";
  function getThemeColor() {
    const params = qp();
    const q = params.get("theme") || params.get("color");
    const saved = localStorage.getItem("hml_theme_color");
    return (q || saved || DEFAULT_COLOR).trim();
  }
  function setThemeColor(color) {
    localStorage.setItem("hml_theme_color", color);
  }

  function applyTheme(color) {
    // 1) theme CSS (id="style-color") points to: theme1/assets/corporate/css/themes/{color}.css
    const style = document.getElementById("style-color");
    if (style && style.getAttribute("href")) {
      const href = style.getAttribute("href");
      // replace trailing .../themes/<old>.css
      style.setAttribute("href", href.replace(/(themes\/)[^\/]+\.css/i, `$1${color}.css`));
    }

    // 2) favicon id="fav-icon" points to myresources/icons/HML-FavIcon-{color}.png
    const fav = document.getElementById("fav-icon");
    if (fav && fav.getAttribute("href")) {
      fav.setAttribute("href", fav.getAttribute("href").replace(/HML-FavIcon-[^\.]+/i, `HML-FavIcon-${color}`));
    }

    // 3) logo image in header (site-logo img) points to myresources/logos/HML-Logo-{color}.png
    const logo = document.querySelector(".site-logo img");
    if (logo && logo.getAttribute("src")) {
      logo.setAttribute("src", logo.getAttribute("src").replace(/HML-Logo-[^\.]+/i, `HML-Logo-${color}`));
    }
  }

  // --- fill Django vars placeholders ---
  function fillVar(name, value) {
    document.querySelectorAll(`[data-dj-var="${name}"]`).forEach(el => {
      el.textContent = value == null ? "" : String(value);
    });
  }

  function initPageVars() {
    const params = qp();

    // common
    fillVar("current_year", new Date().getFullYear());

    // services + research/education/development pages
    const type = params.get("type");
    const id = params.get("id");
    if (type) fillVar("type", type);
    if (id) fillVar("id", id);

    // news details
    const newsId = params.get("news_id");
    if (newsId) fillVar("news_id", newsId);

    // search result
    const searchQ = params.get("search_query") || params.get("q");
    if (searchQ) {
      fillVar("search_query", searchQ);
      // also set any input[name="search_query"] value
      document.querySelectorAll('input[name="search_query"]').forEach(inp => inp.value = searchQ);
    }

    // generic message pages
    const pageName = params.get("page_name");
    const msg = params.get("message");
    const tag = params.get("error_tag");
    const code = params.get("error_code");
    if (pageName) fillVar("page_name", pageName);
    if (msg) fillVar("message", msg);
    if (tag) fillVar("error_tag", tag);
    if (code) fillVar("error_code", code);
  }

  // --- simulate forms (contact/newsletter/search) ---
  function initForms() {
    // Contact: if form exists, redirect to success/unsuccess based on email
    const contactForm = document.querySelector('form[action*="form_contact"], form[data-form="contact"]');
    if (contactForm) {
      contactForm.addEventListener("submit", function (e) {
        e.preventDefault();
        const fd = new FormData(contactForm);
        const name = fd.get("contact_name") || "";
        const email = fd.get("contact_email") || "";
        const message = fd.get("contact_message") || "";
        const ok = email && /.+@.+\..+/.test(String(email));
        const target = ok ? "success.html" : "unsuccess.html";
        const msg = ok
          ? `Your (${name}-${email}) message is successfully sent.`
          : `Invalid email adress (${name}-${email}) entered for the contact message.`;
        window.location.href = `${target}?page_name=Contact&message=${encodeURIComponent(msg)}`;
      });

      // If still pointing to Django action, neutralize
      contactForm.setAttribute("action", "javascript:void(0)");
    }

    // Newsletter: treat as simple email registration
    document.querySelectorAll('form[action*="form_newsletter"], form[data-form="newsletter"]').forEach(form => {
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        const fd = new FormData(form);
        const email = fd.get("newsletter_email") || "";
        const ok = email && /.+@.+\..+/.test(String(email));
        const target = ok ? "success.html" : "unsuccess.html";
        const msg = ok
          ? `Your email (${email}) is successfully registered for the newsletter.`
          : `Invalid email adress (${email}) entered for the newsletter.`;
        window.location.href = `${target}?page_name=Newsletter&message=${encodeURIComponent(msg)}`;
      });
      form.setAttribute("action", "javascript:void(0)");
    });

    // Search: redirect to search_result.html?q=...
    document.querySelectorAll('form[action*="form_search"], form[data-form="search"]').forEach(form => {
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        const fd = new FormData(form);
        const q = (fd.get("search_query") || "").toString();
        window.location.href = `search_result.html?search_query=${encodeURIComponent(q)}`;
      });
      form.setAttribute("action", "javascript:void(0)");
    });
  }

  // --- color panel buttons (if present) ---
  function initColorPanel() {
    // Many templates use links like /set_custom_color?color=...
    document.querySelectorAll('a[href*="set_custom_color"]').forEach(a => {
      a.addEventListener("click", function (e) {
        e.preventDefault();
        const url = new URL(a.href, window.location.href);
        const c = url.searchParams.get("color") || url.searchParams.get("theme") || url.searchParams.get("value");
        if (!c) return;
        setThemeColor(c);
        applyTheme(c);
      });
      // keep href harmless for static
      a.setAttribute("href", "javascript:void(0)");
    });
  }

  // boot
  const color = getThemeColor();
  setThemeColor(color);
  applyTheme(color);
  initPageVars();
  initForms();
  initColorPanel();
})();
