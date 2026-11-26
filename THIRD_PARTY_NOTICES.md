# Visual component provenance

## React Bits

ShinyText, TiltedCard, StarBorder and FadeContent are adapted from David Haz's React Bits, pinned to commit `448c03d79c240ead64360631e3465f4672878ac8`. This smaller revision supplies the intended effects without newer optional rendering features. Full licence is retained in `public/licenses/react-bits.txt` and distributed with the production site.

Licence: MIT + Commons Clause. Use within this commercial website is permitted. The components themselves must not be sold, sublicensed or redistributed as a component product. Do not describe the licence as unrestricted MIT.

Original TypeScript source paths under that commit:

- `src/ts-default/TextAnimations/ShinyText/ShinyText.tsx` and `ShinyText.css`
- `src/ts-default/Components/TiltedCard/TiltedCard.tsx` and `TiltedCard.css`
- `src/ts-default/Animations/StarBorder/StarBorder.tsx` and `StarBorder.css`
- `src/ts-default/Animations/FadeContent/FadeContent.tsx`

Modifications: fixed brand tokens; stripped unused configuration, mobile warning, tooltip and overlay; tilt limited to 3 degrees with touch/reduced-motion guards; shimmer and border linked to the existing hero pause/off-screen state; a visible-by-default image reveal with a shallow mask instead of blur. The default static state and production prerender preserve access without JavaScript.

## Embla Carousel and Motion

`embla-carousel-react` 8.6.0 is used directly for the swipeable gallery, with non-looping manual controls and native fallback content. Motion is used by the React Bits spring-based TiltedCard. Exact resolved versions are in package-lock.json. Their MIT licences are retained under `public/licenses/`.

## Logo

The HG emblem and Hasanah Gold wordmark are a new site-specific SVG composition requested by the user. Letter outlines derive from the project's Cormorant Garamond and Manrope fonts, distributed under SIL Open Font License. It is not a downloaded jewellery brand logo. The SVGs are in `public/images/logo/`.
