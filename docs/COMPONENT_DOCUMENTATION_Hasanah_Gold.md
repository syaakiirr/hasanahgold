# Hasanah Gold --- Component Documentation

> **Purpose:** A practical component blueprint for building the Hasanah
> Gold informational landing page.\
> **Design direction:** Premium jewellery editorial, magenta/pink +
> metallic gold, elegant typography, expressive but controlled motion.\
> **Website type:** Informational landing page. Product enquiries happen
> through WhatsApp; this is not an e-commerce checkout.

------------------------------------------------------------------------

## 1. Component Strategy

Build a small, reusable component system rather than importing a large
UI kit wholesale. The page should feel custom-designed for a jewellery
brand, not like a generic SaaS template.

### Core principles

1.  **Product imagery leads.** Components should give jewellery
    photography enough space and avoid unnecessary decoration.
2.  **Magenta and gold are brand accents.** Use warm neutral surfaces
    for readability; do not make every section gold or pink.
3.  **One primary action.** The main conversion is a WhatsApp enquiry.
4.  **Motion supports the product.** Use the companion
    `ANIMATION_DOCUMENTATION_Hasanah_Gold.md` for timing and motion
    behaviour.
5.  **Mobile-first interactions.** Never depend on hover to reveal
    essential information.
6.  **Reusable, but not over-abstracted.** Create components for
    repeated patterns and meaningful page sections.

### Suggested implementation approach

-   If the project uses React: create each component as a reusable React
    component, with shared design tokens in CSS variables.
-   If the project uses plain HTML/CSS/JavaScript: keep the same
    component boundaries as reusable sections and partials.
-   Use the project's existing framework and routing. Do not migrate
    frameworks just to follow this document.
-   Prefer CSS transitions for simple interactions. Add an animation
    library only if the project already uses it or the motion genuinely
    requires it.

------------------------------------------------------------------------

## 2. Design Tokens

Create a central token file, for example `src/styles/tokens.css`. The
values below are starting points, not sampled brand colours. Once the
actual Hasanah Gold logo is available, sample its magenta and gold and
update the tokens.

``` css
:root {
  /* Brand — confirm against the real logo */
  --hg-magenta: #B83270;
  --hg-magenta-dark: #7D1748;
  --hg-magenta-soft: #F6E7EF;

  --hg-gold: #C9A45C;
  --hg-gold-light: #E8D4A2;
  --hg-gold-deep: #8F6A2D;

  /* Surfaces and text */
  --hg-ivory: #FAF7F2;
  --hg-cream: #F1EADF;
  --hg-white: #FFFFFF;
  --hg-ink: #211B1D;
  --hg-muted: #756B6E;
  --hg-line: rgba(33, 27, 29, 0.12);

  /* Shape and depth */
  --hg-radius-sm: 10px;
  --hg-radius-md: 18px;
  --hg-radius-lg: 28px;
  --hg-radius-pill: 999px;
  --hg-shadow-soft: 0 12px 36px rgba(49, 26, 38, 0.08);
  --hg-shadow-card: 0 18px 50px rgba(49, 26, 38, 0.12);

  /* Layout */
  --hg-container: 1200px;
  --hg-gutter: clamp(20px, 5vw, 76px);
  --hg-section-space: clamp(76px, 10vw, 140px);

  /* Motion */
  --hg-ease-out: cubic-bezier(0.16, 1, 0.3, 1);
  --hg-duration-fast: 180ms;
  --hg-duration-base: 320ms;
  --hg-duration-slow: 700ms;
}
```

### Typography

Use no more than two font families:

-   **Display / headings:** a refined editorial serif (for example,
    `Cormorant Garamond` or `DM Serif Display`).
-   **Body / interface:** a clean sans-serif (for example, `Manrope` or
    `DM Sans`).

Use a locally hosted or properly licensed font where practical. Keep
body copy readable; avoid thin weights on small screens.

### Colour usage

  -----------------------------------------------------------------------
  Token                               Use
  ----------------------------------- -----------------------------------
  Magenta                             Primary buttons, selected
                                      navigation state, small brand
                                      highlights

  Deep magenta                        Hover/pressed states and
                                      high-contrast brand moments

  Gold                                Fine borders, icons, separators,
                                      metallic details

  Ivory / cream                       Main page backgrounds and editorial
                                      sections

  Ink                                 Main text

  Muted                               Supporting text and metadata
  -----------------------------------------------------------------------

**Avoid:** gold body text on cream, magenta paragraphs on pink
backgrounds, and gradients behind every section.

------------------------------------------------------------------------

## 3. Recommended Page Structure

Recommended order:

1.  `AnnouncementBar` --- optional; omit if there is no real
    announcement.
2.  `SiteHeader`
3.  `HeroSection`
4.  `BrandIntroSection`
5.  `CategoryShowcase`
6.  `FeaturedProductsSection`
7.  `WhyChooseUsSection`
8.  `StoreVisitSection`
9.  `SocialGallerySection`
10. `ContactCTASection`
11. `SiteFooter`
12. `WhatsAppFloatingButton`

The page can be shortened if real content or photography is limited. Do
not create empty sections merely to make the page longer.

------------------------------------------------------------------------

## 4. Component Specifications

### 4.1 `AnnouncementBar` --- optional

**Purpose:** Display a genuine short announcement, such as a confirmed
promotion or store update.

**Content:** - One short sentence. - Optional link to a relevant
section.

**Behaviour:** - Slim height. - Dismissible only if the announcement is
temporary. - Do not invent discounts, campaigns, or limited-time offers.

**Responsive:** Keep the message to one or two lines on mobile.

**Priority:** Low. Do not show until the business supplies a real
announcement.

### 4.2 `SiteHeader`

**Purpose:** Main navigation and brand identity.

**Elements:** - Hasanah Gold logo. - Navigation links: `Utama`,
`Koleksi`, `Tentang Kami`, `Lokasi`, `Hubungi`. - Primary CTA:
`WhatsApp Kami`.

**Behaviour:** - Transparent or visually light over the hero if contrast
remains strong. - Switch to a solid ivory surface after scrolling, if
useful. - Active section indicator can use a fine gold line. - Mobile
menu opens as a compact panel or full-screen sheet. - Close mobile menu
after selecting a section. - Keep the WhatsApp action visible and easy
to reach.

**Do not:** - Use a huge header that consumes the hero. - Add navigation
destinations that do not exist. - Hide all contact access inside the
mobile menu.

**Suggested props:** `logo`, `links`, `whatsappUrl`, `isScrolled`.

### 4.3 `HeroSection`

**Purpose:** Establish the brand and create a strong first impression.

**Elements:** - Eyebrow: `HASANAH GOLD • KUALA TERENGGANU`. - Main
headline: `Keindahan Emas, Keanggunan Anda.` - Supporting copy
explaining that Hasanah Gold offers gold jewellery. - Primary CTA:
`Tanya Melalui WhatsApp`. - Secondary CTA: `Lihat Koleksi`. - One strong
jewellery/store image, or a carefully art-directed image composition.

**Layout:** - Desktop: editorial split layout or asymmetric
composition. - Mobile: headline and CTA first, image immediately after
or as a background with a readable overlay. - Preserve enough empty
space around the hero image.

**Motion:** - Headline enters in a short stagger. - Main image reveals
with a soft mask/clip animation. - Small gold accent line draws in. -
Avoid continuous movement that distracts from the headline.

**Fallback:** If no real photography exists, use one tasteful temporary
stock image and mark it for replacement. Do not imply the stock image is
an actual Hasanah Gold product.

### 4.4 `SectionHeading`

**Purpose:** Keep section introductions consistent.

**Elements:** - Optional eyebrow label. - Heading. - Short supporting
sentence. - Optional decorative divider.

**Variants:** - `center` - `left` - `compact`

**Rules:** - One clear heading per section. - Keep descriptions
concise. - Avoid repeating the same generic marketing sentence in every
section.

**Suggested props:** `eyebrow`, `title`, `description`, `align`,
`theme`.

### 4.5 `BrandIntroSection`

**Purpose:** Explain who Hasanah Gold is.

**Content:** - Short brand introduction. - Location: Dataran Panji,
Kuala Terengganu. - Optional shop photograph.

**Layout:** Text-led editorial block with one supporting image or a
simple image/text split.

**Content caution:** Do not claim years of experience, product purity
guarantees, awards, certifications, or customer counts unless the owner
confirms them.

### 4.6 `CategoryShowcase`

**Purpose:** Let visitors quickly identify the jewellery types
available.

**Confirmed categories:** - Cincin - Gelang - Rantai - Loket - Subang

**Card elements:** - Category image. - Category name. - Optional short
descriptor, only if accurate. - Optional anchor link to the featured
collection section.

**Layout:** - Desktop: 4--5 columns or a horizontally balanced grid. -
Tablet: 2--3 columns. - Mobile: 2 columns; use horizontal scrolling only
if the cards remain easy to discover.

**Interaction:** - Image zoom slightly on hover. - Card moves only a few
pixels; no dramatic tilt on every card. - On touch devices, the card
remains static and fully readable.

**Suggested props:** `categories[]` with `name`, `image`, `alt`, `href`.

### 4.7 `ProductCard`

**Purpose:** Present a product or representative jewellery image.

**Elements:** - Product image. - Product name or category label. -
Optional short description. - CTA: `Tanya Harga` / `Tanya di WhatsApp`.

**Important:** Prices, weight, gold purity, stock availability, and
product specifications must only appear when supplied and verified by
the business.

**Variants:** - `standard` - `featured` - `minimal`

**Behaviour:** - Image uses a consistent aspect ratio. - Use
`object-fit: cover` or `contain` depending on the actual image. - Hover
image scale should be subtle. - CTA opens WhatsApp with a prefilled
enquiry message when the product name is known.

**Suggested props:** `name`, `category`, `image`, `alt`, `description`,
`whatsappUrl`, `variant`.

### 4.8 `FeaturedProductsSection`

**Purpose:** Highlight a small selection of jewellery imagery.

**Elements:** - `SectionHeading`. - 3--6 `ProductCard` items. - Optional
CTA to ask about other designs.

**Content fallback:** Until actual product photographs are supplied,
label imagery as illustrative or use category-level imagery. Never
present stock imagery as confirmed inventory.

**Do not:** Build a fake shopping cart, checkout, filter system, or
stock counter. This website is an enquiry-led landing page.

### 4.9 `WhyChooseUsSection`

**Purpose:** Give visitors useful reasons to contact or visit the shop.

**Recommended structure:** 2--3 concise benefit blocks with simple
icons.

**Content rule:** Use only claims the owner can substantiate. Safe
content can focus on: - Physical shop location. - Direct enquiry through
WhatsApp. - Jewellery categories available.

Do not invent claims such as `harga paling murah`, `emas 999.9`,
`jaminan seumur hidup`, `trusted since 1990`, or `certified` without
evidence.

### 4.10 `StoreVisitSection`

**Purpose:** Help visitors find the physical shop.

**Confirmed address:**
`Lot 11-A & 12-A, Dataran Panji, Jalan Panji Alam, 21100 Kuala Terengganu, Terengganu, Malaysia`

**Elements:** - Store image, if available. - Full address. -
`Buka Google Maps` button linking to a verified map location. - Optional
operating hours, only after the owner confirms the exact schedule.

**Behaviour:** - Address must be selectable/copyable. - On mobile, map
action should open the maps app/browser. - Do not embed a heavy
interactive map unless it adds clear value; a map link is sufficient for
this landing page.

### 4.11 `SocialGallerySection`

**Purpose:** Connect the website to the brand's social presence and show
real content.

**Known social profiles:** - Instagram:
`https://www.instagram.com/hasanahgold78/` - TikTok:
`https://www.tiktok.com/@hasanahgold78/` - Facebook: Hasanah Gold page
--- exact URL still needs to be supplied.

**Elements:** - Section heading. - 3--6 selected images/posts, ideally
from the brand's own accounts. - Links to the relevant social profile.

**Rules:** - Use owned or authorised media. - Do not scrape social
platforms on every page load. - Avoid a third-party live feed if it
harms speed or reliability. - If no usable content is available, show
clean social links instead of empty gallery cards.

### 4.12 `ContactCTASection`

**Purpose:** Convert visitor interest into an enquiry.

**Elements:** - Short invitation to ask about jewellery. - WhatsApp
CTA. - Phone number. - Email address.

**Confirmed contact:** - Phone: `019-9089888` - Email:
`hasanahgold78@gmail.com`

**WhatsApp:** The phone number is presumed to be the WhatsApp contact,
but confirm that it is WhatsApp-enabled before launch.

**Suggested copy:**
`Ada koleksi yang menarik perhatian anda? Hubungi Hasanah Gold untuk pertanyaan lanjut.`

**Behaviour:** - Use a direct WhatsApp deep link. - Prefill a natural
message, for example:
`Assalamualaikum Hasanah Gold, saya ingin bertanya tentang koleksi emas.` -
Encode the message properly for URLs. - Provide phone and email as
alternative contact methods.

### 4.13 `SiteFooter`

**Purpose:** Close the page with clear business details.

**Elements:** - Logo / business name. - One-line brand statement. -
Quick navigation links. - Address. - Phone and email. - Instagram,
TikTok, Facebook (once URL is confirmed). - Copyright year generated
dynamically.

**Rules:** - Do not repeat every paragraph from the page. - Keep links
readable and keyboard accessible. - Use a dark magenta or deep neutral
footer with restrained gold accents, if it suits the final palette.

### 4.14 `WhatsAppFloatingButton`

**Purpose:** Keep the primary enquiry action accessible while scrolling.

**Behaviour:** - Fixed near the bottom-right, with safe spacing from
screen edges. - Use WhatsApp's recognisable icon and an accessible
label. - On desktop, icon plus short text may be used. - On mobile,
compact icon button is acceptable, but ensure it does not cover
important controls. - Include visible keyboard focus. - Respect
safe-area insets on mobile.

**Avoid:** Oversized pulsing animations, repeated bouncing, or
obstructing the page.

------------------------------------------------------------------------

## 5. Shared UI Primitives

These are small building blocks used by multiple sections.

  -----------------------------------------------------------------------
  Component               Responsibility          Notes
  ----------------------- ----------------------- -----------------------
  `Container`             Consistent max-width    Use one shared layout
                          and horizontal padding  width

  `Button`                Primary, secondary, and Include hover, active,
                          text actions            focus, disabled states

  `IconButton`            Compact icon-only       Must have an accessible
                          action                  name

  `Badge`                 Small category or       Use sparingly
                          eyebrow label           

  `Divider`               Fine visual separator   Prefer subtle
                                                  gold/neutral lines

  `ImageFrame`            Consistent image crop   Prevent layout shift
                          and radius              with fixed aspect ratio

  `SocialLink`            Social icon and label   Use actual profile URLs

  `WhatsAppLink`          Standardised WhatsApp   Reuse across hero,
                          URL/message             cards, CTA and footer

  `Section`               Standard section        Allow variants for
                          spacing                 dark/light surfaces
  -----------------------------------------------------------------------

### Button variants

-   `primary`: magenta background, white text.
-   `secondary`: transparent/ivory background, magenta or ink text with
    fine border.
-   `gold-outline`: transparent background with gold border; use only on
    suitable surfaces.
-   `text`: simple text link with a small directional icon.

All buttons need: - Minimum comfortable touch target (approximately 44 ×
44 CSS px). - Visible focus state. - Clear hover and pressed state. -
Descriptive text; avoid `Click Here`.

------------------------------------------------------------------------

## 6. Suggested Component Folder Structure

Example for a React project. Adapt to the existing repository rather
than forcing this exact structure.

``` text
src/
├── components/
│   ├── layout/
│   │   ├── SiteHeader.jsx
│   │   ├── SiteFooter.jsx
│   │   ├── Container.jsx
│   │   └── Section.jsx
│   ├── ui/
│   │   ├── Button.jsx
│   │   ├── SectionHeading.jsx
│   │   ├── ImageFrame.jsx
│   │   ├── SocialLink.jsx
│   │   └── WhatsAppLink.jsx
│   ├── sections/
│   │   ├── HeroSection.jsx
│   │   ├── BrandIntroSection.jsx
│   │   ├── CategoryShowcase.jsx
│   │   ├── FeaturedProductsSection.jsx
│   │   ├── WhyChooseUsSection.jsx
│   │   ├── StoreVisitSection.jsx
│   │   ├── SocialGallerySection.jsx
│   │   └── ContactCTASection.jsx
│   └── floating/
│       └── WhatsAppFloatingButton.jsx
├── data/
│   ├── navigation.js
│   ├── categories.js
│   └── products.js
└── styles/
    ├── tokens.css
    ├── global.css
    └── components.css
```

For a small landing page, it is acceptable to keep a few simple
components together. Avoid creating dozens of files for one-line
elements.

------------------------------------------------------------------------

## 7. WhatsApp Link Utility

Use one shared utility so all WhatsApp CTAs behave consistently.

``` js
const WHATSAPP_NUMBER = "60199089888";

export function createWhatsAppUrl(message) {
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;
}
```

Malaysia's international format uses `60` and omits the leading `0`.
Confirm the number is correct and WhatsApp-enabled before publishing.

Example messages:

``` js
const generalMessage =
  "Assalamualaikum Hasanah Gold, saya ingin bertanya tentang koleksi emas.";

const productMessage = (productName) =>
  `Assalamualaikum Hasanah Gold, saya berminat untuk bertanya tentang ${productName}.`;
```

Do not put spaces, `+`, brackets, or hyphens in the `wa.me` phone-number
path.

------------------------------------------------------------------------

## 8. Content Data Model

Keep repeatable content in data files rather than hardcoding the same
markup repeatedly.

Example category data:

``` js
export const categories = [
  { id: "cincin", name: "Cincin", image: "/images/categories/cincin.webp" },
  { id: "gelang", name: "Gelang", image: "/images/categories/gelang.webp" },
  { id: "rantai", name: "Rantai", image: "/images/categories/rantai.webp" },
  { id: "loket", name: "Loket", image: "/images/categories/loket.webp" },
  { id: "subang", name: "Subang", image: "/images/categories/subang.webp" },
];
```

Example product data:

``` js
export const featuredProducts = [
  {
    id: "featured-01",
    name: "Koleksi Cincin",
    category: "Cincin",
    image: "/images/products/featured-ring.webp",
    alt: "Contoh koleksi cincin emas",
    isIllustrative: true,
  },
];
```

`isIllustrative` is a reminder for the content team/developer. Remove
the illustrative label only after replacing the image with a real,
approved product photograph.

------------------------------------------------------------------------

## 9. Image and Asset Requirements

### Priority assets to request from the business

1.  Original logo file (preferably SVG or transparent PNG).
2.  Exterior storefront photograph.
3.  Interior/shop display photograph.
4.  Real product photographs for each category.
5.  A small selection of approved social media images.
6.  Confirmed Facebook page URL.
7.  Confirmed operating hours.
8.  Confirmation that the listed phone number is WhatsApp-enabled.

### Image guidelines

-   Prefer WebP or AVIF for web delivery, with a suitable fallback if
    needed.
-   Keep source images large enough for the intended display size.
-   Use descriptive filenames, for example
    `hasanah-gold-storefront.webp`.
-   Add meaningful `alt` text for informative images.
-   Use empty `alt=""` for purely decorative images.
-   Set image width/height or `aspect-ratio` to prevent layout shift.
-   Lazy-load below-the-fold images.
-   Do not lazy-load the main hero image if it is the page's Largest
    Contentful Paint element.
-   Avoid stretching jewellery images; preserve product proportions.

### Temporary stock imagery

Temporary imagery is acceptable during development, but: - Use properly
licensed assets. - Keep a list of all temporary images. - Do not
describe them as Hasanah Gold's actual products or shop. - Replace them
before final launch wherever possible.

------------------------------------------------------------------------

## 10. Motion and Interaction Rules

Use `ANIMATION_DOCUMENTATION_Hasanah_Gold.md` as the detailed motion
specification.

Component-level rules:

  Component         Recommended motion
  ----------------- ------------------------------------------
  Header            Subtle background transition on scroll
  Hero              Headline stagger + image reveal
  Section heading   Small fade/translate reveal
  Category cards    Gentle image zoom on hover
  Product cards     Soft image zoom and restrained elevation
  CTA buttons       Short colour/arrow transition
  Store image       One-time reveal
  Social gallery    Staggered reveal, no auto-playing feed
  WhatsApp button   Subtle entrance; no constant bounce

### Motion constraints

-   Avoid animating large layout properties such as `top`, `left`,
    `width`, and `height` when `transform` or `opacity` can achieve the
    same result.
-   Do not hijack scrolling.
-   Do not make content wait for a long intro animation before becoming
    usable.
-   Disable or simplify non-essential motion under
    `prefers-reduced-motion: reduce`.
-   Reduce particles, blur, parallax, and 3D effects on mobile or
    lower-powered devices.
-   Lazy-load optional 3D content and provide a static image fallback.

------------------------------------------------------------------------

## 11. Responsive Behaviour

  -----------------------------------------------------------------------
  Area              Desktop           Tablet            Mobile
  ----------------- ----------------- ----------------- -----------------
  Header            Full navigation   Compact           Menu button /
                                      navigation        sheet

  Hero              Editorial split   Balanced          Single column
                    layout            two-column or     
                                      stacked           

  Categories        4--5 columns      2--3 columns      2 columns

  Featured products 3 columns         2 columns         1--2 columns

  Brand intro       Text + image      Reduced gap       Stacked
                    split                               

  Store section     Image + details   Balanced split    Stacked, map CTA
                                                        full width

  Footer            Multi-column      2 columns         Stacked
  -----------------------------------------------------------------------

Test at minimum: - 360px mobile width. - 390px mobile width. - 768px
tablet width. - 1024px laptop/tablet landscape. - 1440px desktop width.

Prevent horizontal overflow. Buttons and navigation must remain usable
at narrow widths.

------------------------------------------------------------------------

## 12. Accessibility Requirements

-   Use semantic landmarks: `header`, `nav`, `main`, `section`, and
    `footer`.
-   Maintain a logical heading order (`h1` once, then `h2`, `h3`).
-   Ensure text contrast meets WCAG AA where practical.
-   Do not communicate important meaning through colour alone.
-   Provide keyboard access to all links, menus, and buttons.
-   Show a visible focus indicator.
-   Give icon-only buttons accessible labels.
-   Ensure the mobile menu announces its expanded/collapsed state.
-   Respect reduced-motion preferences.
-   Provide meaningful alternative text for product and store images.

------------------------------------------------------------------------

## 13. Performance and Dependency Policy

The target is a fast informational page, not a complex web application.

-   Prefer CSS for gradients, borders, simple reveals, and hover states.
-   Reuse one animation library rather than mixing multiple libraries.
-   Avoid loading a 3D engine for a decorative effect that can be
    achieved with a static image.
-   Do not load social feeds or large videos automatically.
-   Use responsive images and lazy loading.
-   Avoid excessive backdrop blur, giant shadows, and large particle
    counts.
-   Keep the first screen lightweight.
-   Check the production build, not only the development server.

**Hardware consideration:** The development environment may include an
Intel UHD 620-class integrated GPU. Keep intensive 3D and particle
effects optional and test the page on integrated graphics and mid-range
mobile devices.

------------------------------------------------------------------------

## 14. Build Priority

### Phase 1 --- Essential page

-   [ ] Design tokens and global styles
-   [ ] Site header and mobile navigation
-   [ ] Hero section
-   [ ] Category showcase
-   [ ] Contact CTA and WhatsApp utility
-   [ ] Store address section
-   [ ] Footer
-   [ ] Responsive layout

### Phase 2 --- Brand depth

-   [ ] Brand introduction
-   [ ] Featured products
-   [ ] Why choose us section (verified claims only)
-   [ ] Social links/gallery
-   [ ] Real store and product imagery

### Phase 3 --- Motion polish

-   [ ] Hero entrance animation
-   [ ] Scroll reveals
-   [ ] Card hover interactions
-   [ ] Header scroll state
-   [ ] CTA micro-interactions
-   [ ] Reduced-motion and mobile optimisation

Do not spend time polishing advanced animation before the content,
layout, contact links, and responsive behaviour work correctly.

------------------------------------------------------------------------

## 15. Acceptance Checklist

### Content accuracy

-   [ ] Business name and address are correct.
-   [ ] Phone and email are correct.
-   [ ] WhatsApp number has been confirmed.
-   [ ] Facebook URL is correct.
-   [ ] Operating hours are confirmed or omitted.
-   [ ] No unsupported claims, fake prices, or invented stock details
    appear.
-   [ ] Temporary imagery is clearly tracked for replacement.

### Functionality

-   [ ] All navigation links point to the correct sections.
-   [ ] WhatsApp links open with the intended prefilled message.
-   [ ] Phone link uses `tel:`.
-   [ ] Email link uses `mailto:`.
-   [ ] Google Maps link points to the correct shop.
-   [ ] Mobile menu opens and closes correctly.
-   [ ] No dead buttons or placeholder links remain.

### Visual quality

-   [ ] Brand colours have been checked against the actual logo.
-   [ ] Typography is consistent.
-   [ ] Product images are not distorted.
-   [ ] Spacing and section widths are consistent.
-   [ ] No horizontal overflow at mobile widths.
-   [ ] Motion is smooth but does not obstruct content.

### Quality

-   [ ] Keyboard navigation works.
-   [ ] Reduced-motion preference is respected.
-   [ ] Images have appropriate alt text.
-   [ ] No major console errors.
-   [ ] Production build completes successfully.
-   [ ] Page has been checked on mobile and desktop.

------------------------------------------------------------------------

## 16. Instructions for an AI Coding Agent

Use this document together with: -
`PROJECT_DOCUMENTATION_Hasanah_Gold.md` -
`ANIMATION_DOCUMENTATION_Hasanah_Gold.md`

Before changing code:

1.  Inspect the existing project structure, framework, installed
    dependencies, and current design.
2.  Reuse the current stack. Do not replace working architecture without
    a clear reason.
3.  Identify existing components before creating duplicates.
4.  Implement the essential sections and working contact links first.
5.  Use the design tokens as the single source of truth for colour,
    spacing, radius, and motion.
6.  Keep content data separate from repeated component markup where
    appropriate.
7.  Do not invent business facts, product details, opening hours,
    prices, or guarantees.
8.  Use temporary images only as clearly replaceable placeholders.
9.  Match the motion guidance without sacrificing performance or
    accessibility.
10. Test responsive layouts and every CTA before reporting completion.

### Expected result

A premium, responsive, fast, and accessible Hasanah Gold landing page
with reusable components, clear jewellery categories, authentic business
information, and a consistent WhatsApp enquiry path. The final result
should feel like a bespoke jewellery brand website---not a generic
template or an online store.
