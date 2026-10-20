  const whatsappDraftUrl = (message) =>
    "https://wa.me/?text=" + encodeURIComponent(message);

  document.querySelectorAll("a[data-wa]").forEach((link) => {
    const message = link.dataset.message || "Hi, I’d like to ask about a home service.";
    link.href = whatsappDraftUrl(message);
    link.target = "_blank";
    link.rel = "noopener noreferrer";
  });

  const examples = {
    plumbing: {
      label: "PLUMBING",
      emoji: "🚰",
      service: "Plumbing · Leak or drip",
      message: "Hi, my kitchen tap keeps dripping, even when it’s turned off. Could someone help?"
    },
    electrical: {
      label: "ELECTRICAL",
      emoji: "⚡",
      service: "Electrical · Lights & fixtures",
      message: "Hi, the lights in my hallway keep flickering. Could someone take a look?"
    },
    cleaning: {
      label: "CLEANING",
      emoji: "🧹",
      service: "Cleaning · Deep or move-out clean",
      message: "Hi, I’m moving out and need the apartment cleaned before the end of the month."
    },
    appliance: {
      label: "APPLIANCES",
      emoji: "🧺",
      service: "Appliance repair · Washer or dryer",
      message: "Hi, my washing machine won’t drain after a cycle. Could someone help?"
    }
  };

  const sampleMessage = document.querySelector("#sample-message");
  const serviceLabel = document.querySelector("#service-label");
  const serviceEmoji = document.querySelector("#service-emoji");
  const serviceBadge = document.querySelector("#sample-service");
  const conversationLink = document.querySelector(".conversation-link");
  const scenarioButtons = Array.from(document.querySelectorAll(".scenario"));
  const chatLines = Array.from(document.querySelectorAll(".chat-line"));
  const chatActions = document.querySelector(".chat-actions");

  function selectExample(kind) {
    const example = examples[kind];
    if (!example || !sampleMessage || !serviceLabel || !serviceEmoji || !serviceBadge || !conversationLink) return;

    sampleMessage.textContent = example.message;
    serviceLabel.textContent = example.service;
    serviceEmoji.textContent = example.emoji;
    serviceBadge.textContent = example.label;
    conversationLink.dataset.message = example.message;
    conversationLink.href = whatsappDraftUrl(example.message);

    scenarioButtons.forEach((button) => {
      const selected = button.dataset.kind === kind;
      button.classList.toggle("active", selected);
      button.setAttribute("aria-selected", String(selected));
    });

    [...chatLines, ...(chatActions ? [chatActions] : [])].forEach((line) => {
      line.style.animation = "none";
      void line.offsetHeight;
      line.style.animation = "";
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
