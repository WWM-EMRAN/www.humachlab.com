const UI = {
  preloader() {
    const preloader = document.getElementById("preloader");
    if (!preloader) return;

    // Optional delay so user sees it briefly
    setTimeout(() => {
      preloader.style.transition = "opacity 06s ease";
      preloader.style.opacity = "0";
      setTimeout(() => {
        preloader.style.display = "none";
      }, 600);
    }, 1000);
  },

};

document.addEventListener("DOMContentLoaded", () => {
  UI.preloader();
  // only call this if it exists
  if (typeof UI.scrollTopButton === "function") UI.scrollTopButton();
});

// Allow other scripts (like include.js) to hide it after components load
window.hide_preloader = () => {
  const preloader = document.getElementById("preloader");
  if (!preloader) return;

  preloader.style.transition = "opacity 0.6s ease";
  preloader.style.opacity = "0";
  setTimeout(() => {
    preloader.style.display = "none";
  }, 600);
};



