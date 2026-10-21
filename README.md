# OWLF website

Static, responsive landing page for the OWLF local home-services marketplace.

## Files

- `index.html` — page structure, service catalogue, hero illustration and WhatsApp conversation sample.
- `style.css` — layout, responsive styles and motion.
- `app.js` — WhatsApp draft links, mobile navigation and reveal animations.
- `COPY_GUIDELINES.md` — editorial rules used to keep website copy human, accurate and consistent.
- `favicon.svg` — OWLF mark.
- `assets/home-services-icon-set.png` — the supplied icon sheet, recoloured to the OWLF category palette while preserving the artwork and transparency.
- `assets/home-services-icon-set-original.png` — byte-for-byte copy of the supplied sheet before colour adjustments.

Open `index.html` in a browser for a local preview. The page has no package install or build step.

## Catalogue and copy

The eight service groups and subcategories shown on the page follow the customer-facing `BROWSE_CATALOG` in the separate WhatsApp webhook project. Wording has been localized for Canada while preserving the listed service intent. Availability is described as area-dependent; the website makes no provider, price, review, response-time or guarantee claims.

The phone mock-up contains a clearly labelled illustrative WhatsApp conversation to explain the request flow; it is an example, not a live chat. Service-card links open a prepared WhatsApp message; the visitor must choose a recipient before sending.

## WhatsApp links

Links open a WhatsApp draft with the selected message and do not include a recipient number. WhatsApp will ask the visitor to select a recipient. This preview does not open an OWLF conversation directly.

## Verified backend constraints

The separate webhook repository identifies itself as a private technical proof and currently has no provider configured. This site therefore makes no promise of live availability, provider matching, a fixed price or a response time.

The customer browse menu has eight groups, but the current webhook acknowledgement uses canonical `legacyCategory` values. As a result, AC can be acknowledged as `AC Repair`, appliances as `Appliance Service`, and cleaning, moving and snow clearing as `Home Maintenance`. The preview chat mirrors those current labels. Aligning the labels requires a backend change.

The number-free links open a WhatsApp message draft and leave recipient selection to the visitor. Do not describe this as a direct chat with owlf until a destination number is configured.
