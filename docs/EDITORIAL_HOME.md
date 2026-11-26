# Homepage: selected editorial components

## Final scope â€” 18 November 2026

The homepage keeps the Editorial Collage Hero, eight-category Gallery Grid with Lightbox, and numbered FAQ. Headings use the original Manrope font. Text Reveal runs once as heading lines enter view; buttons have subtle arrow motion. Reduced-motion preferences disable these effects.

Both existing homepage carousels, the reasons section, full-width brand film, location section, social links, contact section and footer are restored to their previous layout. The full-width navbar and eight-item Collection coverflow remain unchanged.

The gallery replaces the old category grid at `#collections`. It opens a native modal with next/previous controls, category-specific enquiry links, keyboard focus containment, Escape dismissal and focus restoration. Category title links and the FAQ work without JavaScript.

## References and assets

Original React/CSS implementation inspired by the public previews of:

- [Editorial Collage Hero](https://21st.dev/@felipemenezes098/components/hero-04): split composition and overlapping product photograph.
- [Gallery Grid with Lightbox](https://21st.dev/@moumensoliman/components/gallery-grid-block-shadcnui): image enlargement interaction.

No additional UI dependency was installed. Existing Lucide icons, carousel implementation, motion hook and installed Motion package are reused. Gallery imagery comes from the existing eight generated collection assets. The new portrait uses built-in OpenAI image generation; see [exact prompt and asset paths](media/editorial/PROMPTS.md). The existing coastal film is reused.

Images illustrate categories; the FAQ and lightbox direct visitors to request actual inventory photographs, weight, purity and prices. Store address and contact links use existing business data.

## Verification

- Production build and prerender: passed.
- Unit tests: 4 passed.
- Browser suite: 320, 360, 390, 768, 1024, 1280, 1440 and 1920px; images, no overflow, unique IDs, restored sections, Manrope, menu, search, enquiry links and failed-image fallback passed.
- Visual component suite: all eight gallery dialogs, enquiry context, focus cycling/restoration, wrapping navigation and FAQ keyboard interaction passed at 390 and 1440px.
- Motion suite: text reveals run once, reduced motion, missing animation APIs and no-JavaScript prerender passed.
- `node tests/home-carousels.mjs`: both original carousels passed controls, keyboard and mobile layout checks.
- Existing Collection suite passed all eight images, selection, drag/swipe, keyboard, hash navigation, reduced motion and no-JavaScript checks before restoring unrelated homepage sections.
- Brand film playback passed desktop/mobile loop, offscreen pause, reduced motion and poster fallback before restoring its original layout.

Rendered desktop and mobile screenshots were reviewed. Browser checks use desktop Chrome and emulated viewports, not physical phones. Final hero/lightbox screenshots are in `docs/previews/editorial-*.png`.

## Gallery correction

The initial four-card gallery only adopted image enlargement. It did not implement the reference's filterable grid. The corrected gallery follows the [upstream Gallery Grid reference](https://ui.tripled.work/components/gallery-grid-block) with three square columns on desktop, category filters, animated layout changes, zoom overlays and an image-led modal. It uses all eight existing jewellery images. Modal arrows and keyboard navigation stay within the selected filter; single-item results disable navigation. Native dialog focus handling and reduced-motion/no-JavaScript support remain intact.

After this correction, production build, browser, visual and motion suites passed. Additional visual checks cover grouped filters, single-item results and arrow-key navigation. Desktop and mobile gallery screenshots are in `docs/previews/gallery-*.png`.

## Catalogue page split

The filterable eight-image gallery now lives at `/katalog/`. The homepage returns to its original four staggered category cards and lightbox. Its gallery link opens the catalogue. Shared navbar and footer include Katalog, while `/koleksi/` retains the existing coverflow.

`GalleryGrid.tsx` shares the modal and category data across both layouts. `CataloguePage.tsx` provides the catalogue heading and breadcrumb. The prerender script emits `dist/katalog/index.html` with a catalogue title and description for direct navigation and no-JavaScript access.

After the split: production build, homepage browser tests (320–1920px), catalogue/lightbox desktop and mobile tests, metadata, direct-route and no-JavaScript checks, and motion tests passed. Physical-device testing was not performed.
