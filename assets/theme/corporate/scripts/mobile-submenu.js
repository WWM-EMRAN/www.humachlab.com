/**
 * Mobile submenu toggle for theme dropdowns.
 * - First tap opens submenu (prevents navigation)
 * - Second tap follows the link
 * Works for both ".header-navigation" and ".header .nav" structures.
 */
(function () {
  function isMobileWidth() {
    return window.matchMedia && window.matchMedia("(max-width: 991px)").matches;
  }

  function closeOtherDropdowns(currentLi) {
    var allOpen = document.querySelectorAll(
      ".header-navigation li.dropdown.open, .header .nav li.dropdown.open"
    );
    allOpen.forEach(function (li) {
      if (li !== currentLi) li.classList.remove("open");
    });

    var allMenus = document.querySelectorAll(
      ".header-navigation li.dropdown > .dropdown-menu, .header .nav li.dropdown > .dropdown-menu"
    );
    allMenus.forEach(function (menu) {
      if (!currentLi || menu !== currentLi.querySelector(".dropdown-menu")) {
        menu.style.display = "";
      }
    });
  }

  function bindMobileSubmenus() {
    // Bind only on mobile widths; keep desktop hover behavior intact
    if (!isMobileWidth()) return;

    var dropdownLinks = document.querySelectorAll(
      ".header-navigation li.dropdown > a, .header .nav li.dropdown > a"
    );

    dropdownLinks.forEach(function (a) {
      // avoid double-binding
      if (a.dataset.mobileSubmenuBound === "1") return;
      a.dataset.mobileSubmenuBound = "1";

      a.addEventListener("click", function (e) {
        if (!isMobileWidth()) return;

        var li = a.closest("li.dropdown");
        if (!li) return;

        // If it has a submenu, we toggle it on first tap
        var submenu = li.querySelector(":scope > .dropdown-menu");
        if (!submenu) return;

        var isOpen = li.classList.contains("open");

        if (!isOpen) {
          // first tap: open submenu, prevent navigation
          e.preventDefault();
          closeOtherDropdowns(li);
          li.classList.add("open");
          submenu.style.display = "block";
        } else {
          // second tap: allow navigation if href is meaningful
          // If href is "#" or "javascript:void(0)", keep toggling
          var href = (a.getAttribute("href") || "").trim();
          var isDummy =
            href === "" || href === "#" || href.toLowerCase().startsWith("javascript:");

          if (isDummy) {
            e.preventDefault();
            li.classList.remove("open");
            submenu.style.display = "none";
          }
          // else: let it navigate normally
        }
      });
    });
  }

  // Run on DOM ready
  document.addEventListener("DOMContentLoaded", function () {
    bindMobileSubmenus();
  });

  // Re-bind on resize (e.g., rotate phone / devtools)
  window.addEventListener("resize", function () {
    // Remove bound flags when leaving mobile so rebind works cleanly
    if (!isMobileWidth()) {
      document
        .querySelectorAll("[data-mobile-submenu-bound='1']")
        .forEach(function (el) {
          delete el.dataset.mobileSubmenuBound;
        });
      // Also close any open dropdowns when switching to desktop
      closeOtherDropdowns(null);
    } else {
      bindMobileSubmenus();
    }
  });
})();
