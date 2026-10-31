(() => {
  "use strict";

  // Owlf's own rating, read from the service. The dashboard (Ratings page) decides whether it shows
  // at all and from how many ratings, so this page only draws what the service says to show.
  const FEED = "https://app.owlf.one/api/public/rating";
  const MAX_QUOTES = 3;

  const section = document.querySelector("#rating");
  if (!section || !("fetch" in window)) return;

  const fill = (value) => Math.max(0, Math.min(100, (value / 5) * 100)) + "%";

  function show(data) {
    if (!data || data.show !== true) return;
    const count = Number(data.count);
    const average = Number(data.average);
    if (!Number.isFinite(count) || count < 1 || !Number.isFinite(average) || average < 1 || average > 5) return;

    section.querySelector("#rating-number").textContent = average.toFixed(1);
    section.querySelector("#rating-stars").style.setProperty("--fill", fill(average));
    section.querySelector("#rating-count").textContent = "out of 5 · " + count + " ratings";

    const list = section.querySelector("#rating-quotes");
    list.textContent = "";
    (Array.isArray(data.quotes) ? data.quotes : []).slice(0, MAX_QUOTES).forEach((q) => {
      const text = q && typeof q.text === "string" ? q.text.trim() : "";
      const stars = Number(q && q.stars);
      if (!text || !(stars >= 1 && stars <= 5)) return;
      const li = document.createElement("li");
      const rating = document.createElement("span");
      rating.className = "rating-stars";
      rating.textContent = "★★★★★";
      rating.style.setProperty("--fill", fill(stars));
      rating.setAttribute("role", "img");
      rating.setAttribute("aria-label", stars + " out of 5");
      const quote = document.createElement("blockquote");
      quote.textContent = "“" + text + "”";
      const who = document.createElement("cite");
      const name = q.name ? String(q.name) : "A customer";
      who.textContent = q.town ? name + " · " + q.town : name;
      li.append(rating, quote, who);
      list.append(li);
    });
    if (!list.children.length) list.hidden = true;
    section.hidden = false;
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 6000);
  fetch(FEED, { signal: controller.signal, headers: { Accept: "application/json" } })
    .then((response) => (response.ok ? response.json() : null))
    .then(show)
    .catch(() => {})
    .then(() => clearTimeout(timer));
})();
