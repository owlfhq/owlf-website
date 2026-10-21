(() => {
  "use strict";

  const whatsappDraftUrl = (message) =>
    "https://wa.me/?text=" + encodeURIComponent(message);

  // Use a button rather than an anchor so the browser does not show a mailto URL preview on hover.
  document.querySelectorAll("[data-email-draft]").forEach((button) => {
    button.addEventListener("click", () => {
      const to = button.dataset.emailTo || "hello@owlf.one";
      const subject = button.dataset.emailSubject || "owlf enquiry";
      window.location.href = "mailto:" + encodeURIComponent(to) + "?subject=" + encodeURIComponent(subject);
    });
  });

  document.querySelectorAll("a[data-wa]").forEach((link) => {
    const message = link.dataset.message || "Hi";
    link.href = whatsappDraftUrl(message);
    link.target = "_blank";
    link.rel = "noopener noreferrer";
  });

  // The base path is the tested fresh-customer flow: "Hi" -> welcome list ->
  // selected service -> subcategory list -> selected subcategory -> description -> area.
  const examples = {
    plumbing: {
      emoji: "🚰",
      service: "Plumbing · Leak or drip",
      message: "My kitchen tap is leaking from the base, constant drip"
    },
    electrical: {
      emoji: "⚡",
      service: "Electrical · Lights & fixtures",
      message: "The lights in my kitchen keep flickering"
    },
    cleaning: {
      emoji: "🧹",
      service: "Cleaning · Deep or move-out clean",
      message: "Deep clean of a 2 bedroom apartment"
    },
    appliance: {
      emoji: "🧺",
      service: "Appliance repair · Washer or dryer",
      message: "Dryer not heating"
    }
  };

  const sampleMessage = document.querySelector("#sample-message");
  const confirmationMessage = document.querySelector("#confirmation-message");
  const conversationLink = document.querySelector(".conversation-link");
  const scenarioButtons = Array.from(document.querySelectorAll(".scenario"));
  const animatedChatItems = Array.from(document.querySelectorAll(".chat-line, .chat-actions"));

  function escapeHtml(value) {
    return value.replace(/[&<>"]/g, (char) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;"
    })[char]);
  }

  function whatsappHtml(value) {
    return escapeHtml(value)
      .replace(/\*([^*]+)\*/g, "<strong>$1</strong>")
      .replace(/_([^_]+)_/g, "<em>$1</em>")
      .replace(/\n/g, "<br>");
  }

  function selectExample(kind) {
    const example = examples[kind];
    if (!example || !sampleMessage || !confirmationMessage || !conversationLink) return;

    // This is the tested new-customer path: Hi → welcome → typed job → Yes/Change → location.
    sampleMessage.textContent = example.message;
    confirmationMessage.innerHTML = whatsappHtml(
      example.emoji + " *" + example.service + "*\nIs that right?"
    );
    // The main link intentionally opens the real greeting draft; it does not pretend to send it.
    conversationLink.dataset.message = "Hi";
    conversationLink.href = whatsappDraftUrl("Hi");

    scenarioButtons.forEach((button) => {
      const selected = button.dataset.kind === kind;
      button.classList.toggle("active", selected);
      button.setAttribute("aria-selected", String(selected));
    });

    animatedChatItems.forEach((item) => {
      item.style.animation = "none";
      void item.offsetHeight;
      item.style.animation = "";
    });
  }

  scenarioButtons.forEach((button) => {
    button.addEventListener("click", () => selectExample(button.dataset.kind));
    button.addEventListener("keydown", (event) => {
      const index = scenarioButtons.indexOf(button);
      let nextIndex = index;
      if (event.key === "ArrowRight") nextIndex = (index + 1) % scenarioButtons.length;
      if (event.key === "ArrowLeft") nextIndex = (index - 1 + scenarioButtons.length) % scenarioButtons.length;
      if (nextIndex !== index) {
        event.preventDefault();
        scenarioButtons[nextIndex].focus();
        selectExample(scenarioButtons[nextIndex].dataset.kind);
      }
    });
  });

  // Format the initial Plumbing state too; otherwise the raw WhatsApp asterisks show until a tab is clicked.
  selectExample("plumbing");

  const menuButton = document.querySelector(".menu-toggle");
  const menu = document.querySelector("#main-nav");

  function closeMenu() {
    if (!menu || !menuButton) return;
    menu.classList.remove("open");
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.setAttribute("aria-label", "Open navigation");
  }

  if (menuButton && menu) {
    menuButton.addEventListener("click", () => {
      const isOpen = menuButton.getAttribute("aria-expanded") === "true";
      menuButton.setAttribute("aria-expanded", String(!isOpen));
      menuButton.setAttribute("aria-label", isOpen ? "Open navigation" : "Close navigation");
      menu.classList.toggle("open", !isOpen);
    });

    menu.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeMenu();
    });
  }

  const year = document.querySelector("#year");
  if (year) year.textContent = String(new Date().getFullYear());

  const revealItems = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealItems.forEach((item) => observer.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add("visible"));
  }
})();
