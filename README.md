# Hasanah Gold

Responsive Malay-language Hasanah Gold landing page. The current design reconstructs the Cartelle homepage layout and interactions using Hasanah Gold content and local photography. See [reference evidence and adaptations](docs/CARTELLE_RECONSTRUCTION.md).

## Run locally

Requires Node.js 22.18+ (Node 24 recommended).

```sh
npm install
npm run dev
```

Open the local URL printed by Vite. Production output:

```sh
npm run build
npm run preview
```

The `dist/` folder can be served by static hosting. No server, database, login, payment or API keys are needed.

## Verification

```sh
npm test
npm run test:browser
npm run test:motion
npm run test:visual
```

For browser checks, start the dev server at `http://127.0.0.1:5173` first, or set `TEST_URL` to the production preview. Motion checks require `npm run build` then `npm run preview -- --port 4173`. Tests use installed Chrome/Edge through Puppeteer Core. On other systems set `CHROME_PATH` to the browser executable. No browser is downloaded. Output is saved in `.qa/browser-results.txt` and `.qa/motion-results.txt`.

## Editing

- `src/data/business.ts`: address, contact details, navigation and WhatsApp message builder.
- `src/data/products.ts`: five categories and explicitly temporary product references. Replace images and descriptions here.
- `src/styles/tokens.css`: shared brand, typography, spacing and motion tokens.
- `src/styles/globals.css` and `motion.css`: responsive components and their animation styles.
- `src/components/`: header, hero, named page sections, product cards, footer and shared WhatsApp/social links.
- `src/motion/usePageMotion.ts`: first-visit entrance and one-time section reveals using native browser APIs.
- `src/App.tsx`: page composition.
- `public/images/logo/`: original outlined SVG logo and favicon monogram, created at the user's request.
- `scripts/prerender.mjs`: writes the React page into production HTML so content and enquiry links work even without JavaScript.
- `ASSETS.md`: photography sources and replacement guidance; `public/ASSETS.md` is the copy linked from the footer. Keep both copies in sync when replacing assets.
- `DESIGN.md`: rationale for the visual design.

Visual components: adapted React Bits ShinyText, FadeContent, TiltedCard and StarBorder, plus Embla Carousel. Source links, previews, priorities and customisation decisions are in `UI_COMPONENTS_DOCUMENTATION_Hasanah_Gold.md`; licences are recorded in `THIRD_PARTY_NOTICES.md`. Components live in `src/components/visual/`, with styles in `src/styles/visual-components.css`. Visual checks use the production preview on port 4173 and save previews in `docs/previews/`.

Dependencies: React for interactive parts, Motion for tilt springs, Embla for the collection carousel, Vite and TypeScript for development/build checks, and Fontsource for self-hosted fonts. Puppeteer Core is development-only for browser verification. Font packages include their SIL Open Font Licenses. Image licensing is documented separately.

## Before production launch

The supplied brief requires owner approval before deployment. This project has not been published.

- Approve the new proposed HG monogram logo. The navbar, footer and favicon now use it; supplied source SVGs can be replaced with an existing official identity if required.
- Replace temporary photographs with approved store/product photos. Suggested source size: at least 1200px wide. Hero uses a portrait crop; categories 4:5; featured references 1:1. Preserve room around the jewellery.
- Approve the proposed tagline and Malay copy.
- Confirm `019-9089888` receives WhatsApp messages. Link construction is tested; no message has been sent and account availability is unconfirmed.
- Supply the official Facebook URL. It is intentionally not guessed. Instagram and TikTok use the exact URLs in the brief; independent account verification remains pending because automated access is blocked.
- Confirm Google Maps resolves the exact shop lot. The link searches the full supplied address; no pin coordinates are invented.
- Add opening hours only after confirmation. No prices, weights, purity, availability, certifications or warranties have been invented.
- Add final domain-specific canonical URL, `og:url` and approved social preview image once hosting is chosen.
- Physical-phone WhatsApp handoff and a real slow-network device check remain launch checks.

See `QA.md` for local checks and limits.
