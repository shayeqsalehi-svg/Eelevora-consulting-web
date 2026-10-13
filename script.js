/* ==========================================================================
   ELEVORA CONSULTING WEBSITE
   File: script.js

   Purpose:
   This file contains the shared JavaScript interactions used across the
   website's pages. Keep common behavior here so it does not need to be
   repeated in every HTML file.
   ========================================================================== */


/* --------------------------------------------------------------------------
   WAIT FOR THE HTML TO LOAD
   Run the code only after the page's HTML elements are available.
   -------------------------------------------------------------------------- */
document.addEventListener("DOMContentLoaded", () => {

  /* ========================================================================
     1. ACTIVE NAVIGATION LINK
     Highlight the menu link that matches the page currently being viewed.
     HTML requirement: links inside .primary-nav should have a data-page
     attribute, for example: data-page="about.html".
     ======================================================================== */

  // Find the current page's filename, such as "about.html".
  // If the URL does not contain a filename, use "index.html".
  const currentFile =
    window.location.pathname.split("/").pop() || "index.html";

  // Check each navigation link that has a data-page attribute.
  document.querySelectorAll(".primary-nav a[data-page]").forEach((link) => {
    // Compare the link's data-page value with the current filename.
    if (link.dataset.page === currentFile) {
      link.classList.add("active"); // Add the CSS class for active styling.
      link.setAttribute("aria-current", "page"); // Help screen readers identify the current page.
    }
  });


  /* ========================================================================
     2. MOBILE NAVIGATION MENU
     Open and close the navigation menu on smaller screens.
     HTML elements expected:
       - Button: .menu-toggle
       - Navigation container: .primary-nav
     ======================================================================== */

  const menuButton = document.querySelector(".menu-toggle");
  const navigation = document.querySelector(".primary-nav");

  // Only add menu behavior if both required elements exist on this page.
  if (menuButton && navigation) {

    // Open or close the menu when the visitor clicks the menu button.
    menuButton.addEventListener("click", () => {
      // toggle() adds "open" if missing and removes it if already present.
      const isOpen = navigation.classList.toggle("open");

      // Keep accessibility information and the button icon in sync.
      menuButton.setAttribute("aria-expanded", String(isOpen));
      menuButton.setAttribute(
        "aria-label",
        isOpen ? "Close navigation" : "Open navigation"
      );
      menuButton.textContent = isOpen ? "×" : "☰";
    });

    // Close the mobile menu after the visitor chooses a navigation link.
    navigation.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        navigation.classList.remove("open");
        menuButton.setAttribute("aria-expanded", "false");
        menuButton.setAttribute("aria-label", "Open navigation");
        menuButton.textContent = "☰";
      });
    });

    // If the browser becomes wider than the mobile breakpoint, close the menu.
    // The 900px value matches the mobile navigation breakpoint in the CSS file.
    window.addEventListener("resize", () => {
      if (window.innerWidth > 900) {
        navigation.classList.remove("open");
        menuButton.setAttribute("aria-expanded", "false");
        menuButton.setAttribute("aria-label", "Open navigation");
        menuButton.textContent = "☰";
      }
    });

    // Close the dropdown with Escape or when the visitor clicks outside it.
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        navigation.classList.remove("open");
        menuButton.setAttribute("aria-expanded", "false");
        menuButton.setAttribute("aria-label", "Open navigation");
        menuButton.textContent = "☰";
        menuButton.focus();
      }
    });

    document.addEventListener("click", (event) => {
      const clickedInsideHeader = event.target.closest(".site-header");
      if (!clickedInsideHeader && navigation.classList.contains("open")) {
        navigation.classList.remove("open");
        menuButton.setAttribute("aria-expanded", "false");
        menuButton.setAttribute("aria-label", "Open navigation");
        menuButton.textContent = "☰";
      }
    });
  }


  /* ========================================================================
     3. LIGHT / DARK THEME
     Let visitors switch between light and dark appearance.
     The selected theme is saved in localStorage so it can be remembered
     when the visitor opens another page or returns later.
     HTML elements expected:
       - Button: .theme-toggle
       - Optional icon inside the button: .theme-icon
     CSS reads the theme from the data-theme attribute on the <html> element.
     ======================================================================== */

  const themeButton = document.querySelector(".theme-toggle");
  const themeIcon = document.querySelector(".theme-icon");
  const root = document.documentElement; // The <html> element.

  // Update the theme button's icon and accessible text to match the theme.
  function updateThemeButton() {
    const isDark = root.dataset.theme !== "light";

    // Show a sun in dark mode and a moon in light mode.
    if (themeIcon) {
      themeIcon.textContent = isDark ? "☼" : "☾";
    }

    // Update the button label only if the button exists on this page.
    if (themeButton) {
      const label = isDark
        ? "Switch to light mode"
        : "Switch to dark mode";

      themeButton.setAttribute("aria-label", label);
      themeButton.setAttribute("title", label);
    }
  }

  // Set the correct icon and label when the page first loads.
  updateThemeButton();

  // Change the theme when the visitor clicks the theme button.
  if (themeButton) {
    themeButton.addEventListener("click", () => {
      // Choose the opposite of the current theme.
      const nextTheme =
        root.dataset.theme === "light" ? "dark" : "light";

      // The CSS can use [data-theme="light"] or [data-theme="dark"] selectors.
      root.dataset.theme = nextTheme;

      // Remember the choice for the next visit.
      // The page still works if the browser blocks localStorage.
      try {
        localStorage.setItem("elevora-theme", nextTheme);
      } catch (error) {
        // Saving failed, but the theme has already changed on this page.
      }

      // Refresh the button icon and its accessible label.
      updateThemeButton();
    });
  }


  /* ========================================================================
     4. AUTOMATIC COPYRIGHT YEAR
     Update the year automatically so it does not need to be edited yearly.
     HTML element expected: an element with id="current-year".
     Example: <span id="current-year"></span>
     ======================================================================== */

  const yearLabel = document.querySelector("#current-year");

  if (yearLabel) {
    yearLabel.textContent = new Date().getFullYear();
  }


  /* ========================================================================
     5. CONTACT FORM DEMO
     Validate the form and show a confirmation message.
     IMPORTANT: this is front-end behavior only. It does NOT send the message
     to a server or email address.
     HTML elements expected:
       - Form: #contactForm
       - Message area: #formMsg
       - Name field: form field with name="fullName"
     ======================================================================== */

  const contactForm = document.querySelector("#contactForm");
  const formMessage = document.querySelector("#formMsg");

  // Only attach the submit handler when both elements are present.
  if (contactForm && formMessage) {
    contactForm.addEventListener("submit", (event) => {
      // Stop the browser from reloading the page after form submission.
      event.preventDefault();

      // Ask the browser to check required fields and input formats.
      // If validation fails, stop here and let the browser show its message.
      if (!contactForm.reportValidity()) return;

      // Read the visitor's name and remove extra spaces from its beginning/end.
      const visitorName =
        contactForm.elements.fullName.value.trim();

      // Show a clear confirmation, while being honest that nothing was sent.
      formMessage.textContent =
        `Thank you${visitorName ? `, ${visitorName}` : ""}. Your message is ready, but this demo has not sent it to a server.`;

      // Add the CSS class that styles the message as a success message.
      formMessage.classList.add("success");

      // Clear the form fields after showing the message.
      contactForm.reset();
    });
  }


  /* ========================================================================
     6. REVEAL CARDS WHEN THEY ENTER THE SCREEN
     Add a subtle reveal animation to selected cards and content rows.
     CSS should define the styles for:
       - .reveal-on-scroll (the initial hidden/animated state)
       - .is-visible (the visible state)
     IntersectionObserver detects when an item enters the viewport.
     The animation is skipped if the visitor prefers reduced motion.
     ======================================================================== */

  // Check whether the visitor has asked the operating system to reduce motion.
  const motionPreference = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  );

  // Select the page elements that should reveal as the visitor scrolls.
  const revealItems = document.querySelectorAll(
    ".service-card, .insight-card, .service-detail, .case-study, .article-row"
  );

  // Use the animation only when the browser supports it and reduced motion
  // has not been requested.
  if (
    "IntersectionObserver" in window &&
    !motionPreference.matches
  ) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          // When an item becomes visible in the viewport...
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");

            // Stop observing it after its first reveal.
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.08 // Reveal when about 8% of the item is visible.
      }
    );

    // Prepare each selected item for animation and start observing it.
    revealItems.forEach((item) => {
      item.classList.add("reveal-on-scroll");
      revealObserver.observe(item);
    });
  }

}); // End of DOMContentLoaded
