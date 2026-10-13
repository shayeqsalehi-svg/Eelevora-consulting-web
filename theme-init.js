/* ==========================================================================
   Elevora theme initialization
   Runs before the stylesheet so the saved/system theme is applied immediately.
   ========================================================================== */

(() => {
  const root = document.documentElement;
  const validThemes = new Set(["dark", "light"]);

  try {
    const savedTheme = localStorage.getItem("elevora-theme");
    const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";

    root.dataset.theme = validThemes.has(savedTheme) ? savedTheme : systemTheme;
  } catch (error) {
    // If storage is unavailable, follow the device theme without breaking the page.
    root.dataset.theme = window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }
})();
