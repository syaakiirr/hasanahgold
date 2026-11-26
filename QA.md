# Local review — 16 November 2026

Status: Cartelle-based landing page ready for local review; not published.

## Executed checks

- PASS: TypeScript, Vite production build and static HTML prerender (`npm run build`).
- PASS: four business-data/link tests (`npm test`).
- PASS: production browser checks at 320, 360, 390, 768, 1024, 1280, 1440 and 1920 px: no horizontal overflow, one H1, five categories, ten inspiration cards across two rails, images, valid anchors, business contacts, mobile menu, Escape focus restoration and inert navigation.
- PASS: native search dialog autofocus, Malay/English filtering, no-result state and focus restoration. Native search-field Escape clears a non-empty query before the next Escape closes the dialog.
- PASS: failed-image fallback and reduced-motion scroll behavior.
- PASS: autoplay, first direct pause click, manual slide selection, explicit playback resume and live reduced-motion changes.
- PASS: once-only viewport reveals, missing-animation-API fallback, no-JavaScript prerender and no runtime/hydration errors.
- PASS: desktop carousel controls and boundaries, keyboard navigation, off-screen focus exclusion, and hit-testing to ensure the floating WhatsApp link does not obstruct the next button.
- PASS: product pointer/keyboard crossfade, collection description reveal, reduced-motion transitions, desktop-to-mobile resize restoring all product links and carousel reactivation on desktop.
- Visual review: production desktop, mobile and search screenshots in `docs/previews/cartelle-desktop.png`, `cartelle-mobile.png` and `cartelle-search.png`.

Results: `.qa/browser-results.txt`, `.qa/motion-results.txt`, `.qa/visual-component-results.txt`. Reference capture and implementation choices: `docs/CARTELLE_RECONSTRUCTION.md`. Original source/test backup: `.qa/before-cartelle.zip`.

## Coastal film refresh — 17 November 2026

- PASS: production build, TypeScript and prerender; all four business tests; brand-film component test.
- PASS: Chrome playback checks at 390 and 1440 px: eight-second loop, muted inline autoplay, offscreen pause, reduced motion, resume, error poster and no horizontal overflow. The removed caption is absent.
- PASS: visually reviewed both playback screenshots in `docs/previews/brand-film-390.png` and `brand-film-1440.png`. The H.264 asset is 1920 x 1080, 24 fps, 192 frames, no audio, 1,125,739 bytes.
- The broader `tests/browser.mjs` run passed its viewport/image/link loop, then timed out on search-dialog autofocus at line 54. That search interaction is outside the film change and is not claimed as passing in this refresh. Its image check now permits empty alt text specifically for decorative images inside an aria-hidden container.
- A separate fresh-page search check at 390 px confirmed the dialog opens and `collection-query` receives focus. The multi-viewport suite still times out at that step, including with a page reload; the reload experiment was reverted.
- The film uses an original generated still animated in EffectCraft; human motion was not generated. Reference analysis and source details are in `docs/media/README.md`.

## General limits

Checks use desktop Chrome and viewport emulation, not physical phones or screen readers. External WhatsApp enquiries were inspected without sending messages; account ownership, mobile-app handoff and exact map pin were not independently verified.

The landing page uses Hasanah Gold branding, local Manrope, existing sample photographs and working contact actions. It does not claim pixel-identical typography, unknown animation timings or copies of Cartelle inner pages. Photography remains inspiration rather than verified store inventory. No prices, purity, stock claims or testimonials were added.
