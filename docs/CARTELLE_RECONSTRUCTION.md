# Cartelle reconstruction for Hasanah Gold

Reference: https://cartelle-template.framer.website/ . Scope: reconstruct the homepage's layout and observed interactions in the existing React landing page, using Hasanah Gold content and business actions.

## Evidence

- REA 6.9.0 controlled browser replay: `ev_25a3775199fff10c7c0fccdae0be04df531d8fb8bb7d1ba8a392be538faba38d`. Complete bundle: `../.qa/cartelle/rea-evidence.json`; inputs and summary are beside it. Eleven declared desktop actions completed, including five PageDown/settling pairs. DOM, accessibility, URL and final screenshot were captured without missing or truncated sections. REA confirmed termination of its owned browser process.
- Separate Puppeteer observations: `../.qa/cartelle/RUNTIME-FINDINGS.md`, `interaction-evidence.json`, `hover-menu-evidence.json` and `search-evidence.json`. These establish computed dimensions, typography, product/collection hover states, mobile menu and search. They are browser observations, not REA Evidence.
- Visual captures: `observed-full.png`, section screenshots, `confirmed-product-hover.png`, `confirmed-collection-hover.png`, `mobile-menu-open.png` and `confirmed-search.png` in the same folder.
- Before-change backup: `../.qa/before-cartelle.zip`.

## Implementation ledger

| Feature | Observed reference | Hasanah Gold implementation |
| --- | --- | --- |
| Page and hero | White canvas; 40 px desktop and 20 px mobile gutters. Hero 1360 × 770 at 1440 × 1000; 350 × 247 at 390 × 844. Three slideshow dots. | Corresponding gutters and hero proportions; three jewellery slides, active-dot indicator and pause control. Exact autoplay timing was not measured: 5500 ms interval and 1200 ms crossfade are implementation choices. |
| Products | Three square-image columns with 8 px gaps on desktop; single-column stack on mobile. Second product section below editorial banner. | Two five-card rails, three visible desktop columns and a static mobile stack. Desktop controls and drag retain the existing Embla implementation. |
| Product hover | Main photograph fades to a second photograph over 800 ms. No measured hover scale/tilt. | 800 ms crossfade to a fixed detail crop of the same sample photograph. Distinct secondary product photographs were unavailable. |
| Benefits and collections | Three numbered benefits; four portrait collection panels. Hover raises title and reveals description over 800 ms. | Three numbered benefits and five panels for the existing jewellery categories. Description reveal uses 800 ms; touch layouts expose the descriptions directly. |
| Editorial and contact | Large photographic statement panel, image/text newsletter split, black multi-column footer. | Jewellery editorial panel, image/text WhatsApp enquiry section and black footer. Existing store location and social links remain available. |
| Search and navigation | Centered desktop links, mobile white navigation sheet and square-cornered search dialog. | Responsive navigation and local category-search modal; results open category-specific WhatsApp enquiries. |
| Typography and reveals | Switzer headings; sampled opacity entrance effects include 460 ms and 600 ms. | Locally installed Manrope. Viewport reveals use 600 ms; reduced-motion preferences disable motion. |

## Deliberate adaptations and remaining limits

The implementation uses Hasanah Gold's supplied contact details, logo and five existing sample jewellery photographs. Visible inspiration labels remain; no stock availability, price, purity or weight is inferred. No Cartelle proprietary imagery, source bundle or branding is reused. Shop and newsletter submissions become working WhatsApp enquiries rather than an unconnected checkout or subscription form.

This is a homepage reconstruction, not a claim of perfect pixel matching or replication of Cartelle's shop, product, support, blog or other inner pages. All responsive breakpoints, autoplay timing and every possible animation state were not established by the captured evidence. The REA replay records one observed execution, not the external site's current state. Test outcomes belong in the project's QA records; this ledger does not assert that tests passed.
