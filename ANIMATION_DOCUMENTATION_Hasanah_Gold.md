# Hasanah Gold motion — Cartelle reconstruction

Current implementation, 16 November 2026. This supersedes the earlier static-hero, shimmer, tilt and border-sweep design.

## Behaviors

- Hero: three photographic slides, 5.5-second autoplay interval and 1.2-second opacity crossfade. Caption enters over600ms. Pagination selects a slide and stops autoplay; pause/play control is available. Hover pauses rotation, keyboard interaction stops it, hidden documents do not advance.
- Product cards:800ms opacity crossfade from the main image to a fixed detail crop. The crop reuses the same sample photograph; no second product photo or inventory is implied. Enquiry CTA appears on hover/focus and remains visible on small screens.
- Collections: bottom captions expand and descriptions reveal over800ms on hover/focus. Mobile descriptions stay visible.
- Section entrances:600ms opacity/24px rise, once per element, using IntersectionObserver and Web Animations. Content is visible if either API is missing or interrupted.
- Desktop product rails: installed Embla supports dragging, buttons and arrow keys, with off-screen cards excluded from keyboard focus. At widths below800px every product is displayed in a static single-column list.
- Menu:250ms opacity/vertical transition. Search uses a native modal dialog with keyboard focus containment and Escape dismissal.
- Reduced motion disables CSS motion, section entrances and slideshow autoplay; manual slide changes and links still work. Changes to the preference are respected live.

## Sources and limits

See `docs/CARTELLE_RECONSTRUCTION.md` and `.qa/cartelle/REA-EVIDENCE.md`. Product crossfade timing and reference collection reveal were observed; autoplay interval and hero crossfade timing are implementation choices. No unsupported parallax or inner-page transition is claimed.

## Verification

Run `npm run build`, start preview on4173, then `npm run test:motion` and `npm run test:visual`. Browser suite includes menu, search, navigation, layout and failed-image behavior. Latest results are in `.qa/`.
