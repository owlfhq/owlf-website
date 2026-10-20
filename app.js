  const whatsappDraftUrl = (message) =>
    "https://wa.me/?text=" + encodeURIComponent(message);

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
      menuChoice: "Plumbing",
      emoji: "🚰",
      sub: "Leak or drip",
      service: "Plumbing · Leak or drip",
      example: "Water dripping through the ceiling under the bathroom"
    },
    electrical: {
      menuChoice: "Electrical",
      emoji: "⚡",
      sub: "Outlets & switches",
      service: "Electrical · Outlets & switches",
      example: "Bathroom outlet is dead; the reset button does nothing"
    },
    cleaning: {
      menuChoice: "Cleaning",
      emoji: "🧹",
      sub: "Deep or move-out clean",
      service: "Cleaning · Deep or move-out clean",
      example: "Move-out clean of a 2-bedroom apartment"
    },
    appliance: {
      menuChoice: "Appliance repair",
      emoji: "🧺",
      sub: "Washer or dryer",
      service: "Appliance repair · Washer or dryer",
      example: "Washer won't drain, water stays in the drum"
    }
  };

  const sampleMessage = document.querySelector("#sample-message");
  const serviceBadge = document.querySelector("#sample-service");
  const selectedService = document.querySelector("#selected-service");
  const subMessage = document.querySelector("#sub-message");
  const selectedSub = document.querySelector("#selected-sub");
  const describeMessage = document.querySelector("#describe-message");
  const descriptionExample = document.querySelector("#description-example");
  const conversationLink = document.querySelector(".conversation-link");
  const scenarioButtons = Array.from(document.querySelectorAll(".scenario"));
  const chatLines = Array.from(document.querySelectorAll(".chat-line"));

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
    if (!example || !sampleMessage || !selectedService || !subMessage || !selectedSub ||
        !describeMessage || !descriptionExample || !serviceBadge || !conversationLink) return;

    // Greeting and welcome list stay the same: this is the fresh-customer "Hi" path.
    sampleMessage.textContent = "Hi";
    serviceBadge.textContent = "NEW CUSTOMER";
    selectedService.textContent = example.menuChoice;
    subMessage.innerHTML = whatsappHtml(
      example.emoji + " *" + example.menuChoice + "*: pick the closest match, or simply describe the job."
    );
    selectedSub.textContent = example.sub;
    describeMessage.innerHTML = whatsappHtml(
      "📝 *" + example.service + "*\n" +
      "Tell us about the job in a sentence or two.\n" +
      "For example: _" + example.example + "_\n" +
      "Photos, videos or a voice note help too (tap 📎)."
    );
    descriptionExample.textContent = example.example;
    conversationLink.dataset.message = "Hi";
    conversationLink.href = whatsappDraftUrl("Hi");

    scenarioButtons.forEach((button) => {
      const selected = button.dataset.kind === kind;
      button.classList.toggle("active", selected);
      button.setAttribute("aria-selected", String(selected));
    });

    chatLines.forEach((line) => {
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
