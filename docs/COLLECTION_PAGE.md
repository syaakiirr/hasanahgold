# Collection coverflow redesign

The `/koleksi/` page now uses the CoverflowCarousel supplied in the user's pasted attachment. It replaces the previous shelf and WebGL inspector with eight newly generated jewellery photographs, a warm ivory page, a large editorial heading and a product-specific WhatsApp enquiry. The homepage collection gallery remains connected to this route.

## Component integration

`src/components/ui/coverflow-carousel.tsx` preserves the supplied component's perspective transforms, fractional positioning, looping and drag momentum. Its Tailwind utility classes were translated to the project's existing CSS in `src/styles/collection.css`; React, TypeScript and Lucide were already installed. No Tailwind or shadcn runtime dependency was needed. The `ui` directory keeps the reusable component separate from the page composition.

Added side-card selection, named category buttons, a selection callback, category hash navigation, immediate settling for reduced motion, pointer cancellation handling and image-error fallback. Arrow keys and visible previous/next controls work alongside dragging. Touch uses `pan-y` so vertical scrolling remains available. No autoplay runs.

All eight categories remain: rings, bracelets, necklaces, pendants, earrings, bangles, anklets and accessories. The accessories visual is now an orchid brooch. Descriptions and the WhatsApp subject follow the selected category. The current page does not present an interactive 3D jewellery model; depth comes from the coverflow's CSS perspective.

## Images

Eight independent images were created with the built-in image_gen tool. Their shared art direction is realistic yellow gold, espresso brown, chocolate silk and travertine. Originals are in `docs/media/collection/`; optimized WebP files are in `public/images/collection/`. The complete final prompt for each image is recorded in `docs/media/collection/PROMPTS.md`.

Images are 1254 × 1254. The eight WebP files total about 1.98 MB. They are generated category illustrations; no real inventory, price, purity or weight is asserted. The page retains a brief note to request current stock details from the shop.

The previous 3D models, renderer, viewer, poster script, documentation and tests are archived in `.qa/collection-v1/`. Three.js and its types were removed from dependencies because the new page does not use them. Old model assets no longer ship in `public/` or the production build.

## Verification

Run `npm run build`, `npm test`, and `npm run test:collection` with the production preview on port 4173. The collection test checks all eight images and enquiry subjects, responsive widths, keyboard navigation, looping, side-card clicks, mouse dragging, touch swiping, hash navigation, reduced motion, image failure and the no-JavaScript fallback.

Both pages are prerendered. Without JavaScript, the carousel becomes a horizontally scrollable image strip with separate enquiry links for all eight categories. Physical phone hardware and non-Chromium browsers have not been tested.

Verified on 2026-11-17: production build, four business unit tests, the complete coverflow browser suite and the existing homepage browser suite passed. Collection screenshots are saved in `docs/previews/collection-coverflow-390.png` and `docs/previews/collection-coverflow-1440.png`. Mouse clicks and Chrome-emulated touch swipes both change the selected category and enquiry subject correctly.
