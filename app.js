(() => {
  "use strict";

  const followUp = "📸 You can send photos or describe any extra details if helpful (tap 📎 or 📷).\n\nTo check availability with nearby technicians, please share your location (tap Send Location below) or reply with your area:";
  const replies = {
    plumbing: "Got it — Plumbing (Faucet & Tap Repair).\n\n" + followUp,
    electrical: "Got it — Electrical (Lighting & Fixture Repair).\n\n" + followUp,
    climate: "Got it — AC Repair (Split AC Repair).\n\n" + followUp,
    appliance: "Got it — Appliance Service (Washing Machine Repair).\n\n" + followUp,
    maintenance: "Got it — Home Maintenance (Door Lock Repair & Installation).\n\n" + followUp,
    moving: "Got it — Home Maintenance (Single-Item & Small Moving).\n\n" + followUp,
    cleaning: "Got it — Home Maintenance (Deep Home Cleaning).\n\n" + followUp,
    yard: "Got it — Home Maintenance (Snow Shoveling & Driveway Clearing).\n\n" + followUp
  };

  const examples = {
    plumbing: "Hi, my kitchen tap keeps dripping beneath the sink. Could someone take a look?",
    electrical: "Hi, the light switch in my hallway has stopped working. Can you tell me what to do next?",
    climate: "Hi, my AC is running but the room isn’t getting cool. Can I ask about service in my area?",
    appliance: "Hi, my washing machine won’t drain after a cycle. Could someone help?",
    maintenance: "Hi, one of my bedroom doors won’t latch. Can I ask about getting the lock looked at?",
    moving: "Hi, I need a hand moving a sofa to another room. Is that something I can ask about?",
    cleaning: "Hi, I’m looking for a deep clean for my apartment. Can I ask what’s available in my area?",
    yard: "Hi, could someone help clear the walkway after it snows?"
  };

  const whatsappDraftUrl = (message) =>
    "https://wa.me/?text=" + encodeURIComponent(message);

  document.querySelectorAll("[data-wa]").forEach((link) => {
    const message = link.dataset.message || "Hi, I’d like to ask about a home service.";
    link.href = whatsappDraftUrl(message);
    link.target = "_blank";
    link.rel = "noopener noreferrer";
  });

  const sampleMessage = document.querySelector("#sample-message");
  const replyMessage = document.querySelector("#owlf-reply");
  const conversationLink = document.querySelector(".conversation-link");
  const scenarioButtons = Array.from(document.querySelectorAll(".scenario"));
  const chatLines = Array.from(document.querySelectorAll(".chat-line"));

  function selectExample(kind, shouldScroll) {
    const message = examples[kind];
    if (!message) return;

    sampleMessage.textContent = message;
    replyMessage.textContent = replies[kind] || replies.plumbing;
    conversationLink.dataset.message = message;
    conversationLink.href = whatsappDraftUrl(message);

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

    if (shouldScroll) {
      document.querySelector("#conversation").scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }

  scenarioButtons.forEach((button) => {
    button.addEventListener("click", () => selectExample(button.dataset.kind, false));
    button.addEventListener("keydown", (event) => {
      const index = scenarioButtons.indexOf(button);
      let nextIndex = index;
      if (event.key === "ArrowRight") nextIndex = (index + 1) % scenarioButtons.length;
      if (event.key === "ArrowLeft") nextIndex = (index - 1 + scenarioButtons.length) % scenarioButtons.length;
      if (nextIndex !== index) {
        event.preventDefault();
        scenarioButtons[nextIndex].focus();
        selectExample(scenarioButtons[nextIndex].dataset.kind, false);
      }
    });
  });

  document.querySelectorAll("[data-pick]").forEach((button) => {
    button.addEventListener("click", () => selectExample(button.dataset.pick, true));
  });

  const menuButton = document.querySelector(".menu-toggle");
  const menu = document.querySelector("#main-nav");

  function closeMenu() {
    menu.classList.remove("open");
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.setAttribute("aria-label", "Open navigation");
  }

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
