> Superseded visual direction: the active landing-page design is documented in [Cartelle reconstruction](docs/CARTELLE_RECONSTRUCTION.md). Current styling uses white surfaces, square image panels, local Manrope type, spacious product rails, a photographic hero and a black footer. The original design notes below are historical.

# Hasanah Gold visual decisions

Source: `PROJECT_DOCUMENTATION_Hasanah_Gold (1).md`, sections 3 and 5. This records implementation decisions derived from the supplied brief, not an approved final brand guide.

- ENERGY 2 / RHYTHM 2 / MOTION 2: a warm, editorial jewellery landing page for local shoppers, with the requested cinematic hero and short one-time section reveals.
- Warm white stays fixed as requested in the brand brief; it keeps jewellery photography readable and the page consistent with a printed catalogue.
- Deep magenta carries headings and primary actions; gold is limited to jewellery photography and fine link underlines, avoiding low-contrast gold body text.
- Cormorant Garamond brings the elegant serif voice requested in the brief. Manrope gives small navigation and contact information a readable companion. Fonts are self-hosted with Latin subsets.
- At the user's request, the new logo uses an overlapping HG monogram in a fine oval hallmark and a serif Hasanah wordmark. Paths are outlined SVGs for crisp small-size display and independence from font loading. It is a new proposed identity, not a verified historic store logo.
- A tall arched hero frames the hoop earrings. Category photographs use consistent rectangular ratios for easy comparison.
- The about statement separates the hero photograph from the category grid; rows explain enquiries; a pale rose address section makes the physical shop easy to find.
- Mobile categories use two columns to shorten browsing; product references retain larger images and direct enquiries. The component document removes catalogue filters.
- Motion follows the supplied animation document: masked heading lines, SVG gold tracing, a brief image entrance, one-time scroll reveals and restrained desktop hover. Ambient float, light and shimmer are desktop-only, pause off screen/in hidden tabs, and have a visible pause control. Reduced-motion users receive static content.
- WhatsApp chat icon identifies the contact channel; there are no decorative icon tiles, fabricated claims or testimonials.
- Photography is explicitly illustrative throughout. See ASSETS.md for source credits and replacement instructions.

Finish review resolved: compact mobile category grid, smaller mobile WhatsApp control and reserved hero-link space, location-specific headings, footer contact details and social links.

The component update consolidates shared tokens in `src/styles/tokens.css`, introduces reusable `WhatsAppLink`, `SectionHeading` and `ProductCard`, and composes the page from named sections. Existing CSS container/button classes remain the primitives rather than wrapping every one-line element. Hero location text is included because the component brief explicitly requests it. Social content uses profile links until owned media is supplied.
