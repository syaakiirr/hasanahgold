# Hasanah Gold --- Website Project Documentation

**Document type:** Project brief & development specification\
**Project:** Hasanah Gold Landing Page\
**Business location:** Kuala Terengganu, Terengganu, Malaysia\
**Status:** Initial specification --- ready for development

------------------------------------------------------------------------

## 1. Project Overview

Hasanah Gold is a gold jewellery retailer based in Kuala Terengganu,
Terengganu. The website will serve as a professional online presence to
introduce the business, showcase jewellery collections and help
potential customers contact the store through WhatsApp.

This is an informational business website, not an e-commerce platform.

### Main objectives

1.  Establish a polished and trustworthy online identity for Hasanah
    Gold.
2.  Introduce the store and communicate its brand identity.
3.  Display jewellery categories and selected product examples.
4.  Make it easy for visitors to ask questions through WhatsApp.
5.  Provide the store's contact details, social media links and physical
    location.
6.  Allow temporary stock images and sample product content to be
    replaced with real store photography later.

### Website scope

**Included** - Responsive landing page. - Business introduction. -
Jewellery category showcase. - Featured product showcase using temporary
sample content. - Store location and contact information. - WhatsApp
enquiry links. - Social media links. - Basic SEO and accessibility
foundations.

**Not included** - Shopping cart or checkout. - Online payment. -
Customer accounts or registration. - Inventory management. - Live
product availability. - Automated gold-price calculation. - Claims about
buyback, trade-in, pawn services, warranty or other services that have
not been confirmed.

------------------------------------------------------------------------

## 2. Business Information

Use the following details consistently throughout the website.

  -----------------------------------------------------------------------
  Field                               Information
  ----------------------------------- -----------------------------------
  Business name                       Hasanah Gold

  Address                             Lot 11-A & 12-A, Dataran Panji,
                                      Jalan Panji Alam, 21100 Kuala
                                      Terengganu, Terengganu

  Email                               hasanahgold78@gmail.com

  Phone                               019-9089888

  WhatsApp                            019-9089888 --- confirm that this
                                      number is WhatsApp-enabled before
                                      launch

  Facebook                            Hasanah Gold

  Instagram                           @hasanahgold78

  TikTok                              @hasanahgold78
  -----------------------------------------------------------------------

### Social media destinations

-   Facebook: Search for the official **Hasanah Gold** page. Do not
    invent a page URL.
-   Instagram: `https://www.instagram.com/hasanahgold78/`
-   TikTok: `https://www.tiktok.com/@hasanahgold78`

Verify all social profile URLs before production deployment.

### WhatsApp link

Use the international-format number without spaces, hyphens or the
leading zero:

`https://wa.me/60199089888`

Suggested prefilled message:

`Hi Hasanah Gold, saya ingin bertanya tentang koleksi emas yang tersedia.`

Encode the message correctly when constructing the final WhatsApp URL.
The WhatsApp CTA should open in a new tab or the WhatsApp application,
depending on the visitor's device.

------------------------------------------------------------------------

## 3. Brand Identity & Visual Direction

### Brand concept

The visual identity should communicate: - Elegance. - Premium quality. -
Warmth and approachability. - Femininity without looking overly
decorative. - Trust and clarity.

### Brand colours

The confirmed brand direction is **pink magenta (warna belacan) and
gold**, following the existing Hasanah Gold logo.

The logo has not yet been supplied to the developer. Therefore, the
following values are provisional starting points, not confirmed logo
colour values.

  -----------------------------------------------------------------------
  Role                    Provisional colour      Usage
  ----------------------- ----------------------- -----------------------
  Primary magenta         `#C02678`               Main brand accents,
                                                  selected buttons and
                                                  highlights

  Deep magenta            `#86164F`               Hover states, dark
                                                  accents and contrast

  Metallic gold           `#D4AF37`               Decorative details,
                                                  icons and premium
                                                  accents

  Champagne gold          `#F5E6B3`               Soft gold surfaces and
                                                  gradients

  Warm white              `#FFF8F5`               Main page background

  Charcoal                `#292329`               Main text and dark
                                                  sections

  Muted grey              `#766D73`               Secondary text
  -----------------------------------------------------------------------

**Important:** Once the actual logo is available, sample its colours and
adjust the design tokens to match. Do not force the logo to fit the
provisional palette.

### Design guidance

-   Use magenta and gold as a coordinated identity, not as competing
    colours.
-   Prefer warm white or a very light neutral background for
    readability.
-   Use gold gradients sparingly. Avoid excessive shiny effects, thick
    gold borders and too many decorative elements.
-   Use dark charcoal for readable body text.
-   Keep the layout spacious, balanced and editorial.
-   The result should feel like a real jewellery brand website, not a
    generic template.

### Typography

Suggested pairing: - **Headings:** Playfair Display, Cormorant Garamond
or a similar elegant serif. - **Body and UI:** Inter, Manrope or a
similar clean sans-serif.

Use no more than two font families. Ensure headings remain readable on
mobile.

### Tagline

Recommended brand tagline:

**"Keindahan Emas, Keanggunan Anda."**

English meaning: "The Beauty of Gold, The Elegance of You."

Use it as the main brand message where appropriate, such as the hero
section or About section. Treat it as a proposed marketing tagline and
allow the business owner to approve it before launch.

------------------------------------------------------------------------

## 4. Target Audience & User Journey

### Intended audience

People who want to: - Discover Hasanah Gold and its physical store. -
Browse examples of gold jewellery. - Identify the types of jewellery
offered. - Find the store's address and contact details. - Ask the store
about products through WhatsApp.

### Primary user journey

1.  Visitor lands on the homepage.
2.  Visitor understands the brand and sees a clear introduction.
3.  Visitor browses jewellery categories and featured examples.
4.  Visitor chooses to enquire about an item or collection.
5.  Visitor clicks a WhatsApp CTA and sends an enquiry.
6.  Visitor can also view the store location or social media profiles.

The website should make the WhatsApp enquiry action obvious without
turning every section into a sales banner.

------------------------------------------------------------------------

## 5. Website Structure & Section Requirements

Build the page in the following order. The exact layout can be refined
during implementation while preserving the purpose of each section.

### 5.1 Navigation bar

Requirements: - Hasanah Gold logo on the left. - Navigation links: Home,
About, Collections, Products, Visit Us, Contact. - Primary CTA:
**Enquire on WhatsApp**. - Sticky navigation may be used if it does not
obstruct content. - Mobile navigation must be compact and accessible. -
Use the real logo asset when supplied. Until then, use a clean
text-based brand placeholder.

### 5.2 Hero section

Purpose: Immediately communicate the brand and establish a premium first
impression.

Suggested copy:

**Eyebrow:** HASANAH GOLD\
**Headline:** Keindahan Emas, Keanggunan Anda.\
**Supporting text:** Discover elegant gold jewellery and explore
collections at Hasanah Gold, Kuala Terengganu.\
**Primary CTA:** Explore Collections\
**Secondary CTA:** Enquire on WhatsApp

Visual direction: - Use a high-quality jewellery photograph or a
tasteful jewellery composition. - Magenta and gold should be visible in
the brand treatment. - Use subtle lighting, soft gradients or restrained
gold particle details if they improve the composition. - Avoid
cluttering the hero with too many floating objects or animations. -
Ensure text contrast remains strong over imagery.

### 5.3 About Hasanah Gold

Purpose: Introduce the business in a concise and credible way.

Suggested draft copy:

"Hasanah Gold brings together the timeless beauty of gold jewellery and
elegant designs for different moments and styles. Visit us at Dataran
Panji, Kuala Terengganu, and get in touch with our team to enquire about
our collections."

This is draft marketing copy, not a claim about the company's history,
reputation, product origin or service guarantees. Do not invent a
founding year, awards, certifications or years of experience.

### 5.4 Jewellery collections

Display the confirmed product categories: - Rings / Cincin. - Bracelets
/ Gelang. - Necklaces / Rantai. - Pendants / Loket. - Earrings / Subang.

Each category card should include: - Representative image. - Category
name. - Short, simple description. - Optional link or button that moves
to the relevant product group or opens a WhatsApp enquiry.

Use consistent image ratios and card spacing. The cards should work as a
responsive grid.

### 5.5 Featured products

Purpose: Show examples of the types of jewellery customers can enquire
about.

Temporary sample content may be used until real product photography and
product details are available.

Each product item may contain: - Product image. - Temporary product name
or neutral reference label. - Category. - Optional short description. -
WhatsApp enquiry CTA.

**Product data integrity rules** - Clearly treat sample products and
images as placeholders in the source data. - Do not imply that a sample
item is currently in stock. - Do not invent prices, weights, gold
purity, product codes, warranties or availability. - Do not label an
item as 916, 999, 22K or another purity unless the business confirms
it. - Avoid displaying fake price tags. If prices are not supplied, use
"Enquire for details". - Make it easy to replace each sample image and
its associated content later.

### 5.6 Why choose Hasanah Gold

This section can communicate general customer-facing reasons to visit or
enquire, but must not make unsupported business claims.

Safe content direction: - Explore jewellery collections. - Get product
information directly from the store. - Visit the physical store in Kuala
Terengganu. - Contact the team for enquiries.

Do not claim "lowest price", "best price", "certified", "guaranteed
authenticity", "lifetime warranty" or similar statements unless verified
and approved by the business.

### 5.7 Visit our store

Display: - Full business address. - A Google Maps embed or a link to
directions. - A CTA such as **Get Directions**.

Use the exact address supplied in this document when searching for or
configuring the map. Confirm that the map pin points to the correct shop
lot before launch.

Store opening hours have not been provided. Do not invent them. Hide the
opening-hours row or use a neutral "Contact us for operating hours"
message until confirmed.

### 5.8 Contact section

Include: - Phone number: 019-9089888. - Email:
hasanahgold78@gmail.com. - WhatsApp enquiry button. - Facebook,
Instagram and TikTok links. - Physical address or a link to the Visit Us
section.

Use clear labels and accessible icon buttons. Do not use icons without
text labels where the meaning may be unclear.

### 5.9 Footer

Include: - Logo or text-based brand name. - Tagline. - Quick navigation
links. - Contact details. - Social media links. - Copyright notice with
the current year generated dynamically.

------------------------------------------------------------------------

## 6. UI Components & Open-source Resources

The developer may use open-source component libraries and visual
resources to accelerate implementation. Select components based on fit
and quality rather than adding effects for their own sake.

### Suggested component sources

  ---------------------------------------------------------------------------------------
  Resource                Intended use            Website
  ----------------------- ----------------------- ---------------------------------------
  21st.dev                Community UI            https://21st.dev/community/components
                          components, hero        
                          sections and interface  
                          patterns                

  React Bits              Animated React          https://reactbits.dev/
                          components, backgrounds 
                          and text effects        

  Aceternity UI           Animated backgrounds,   https://ui.aceternity.com/
                          cards and visual        
                          effects                 

  Spline                  Interactive 3D objects  https://spline.design/
                          and scenes              

  Sketchfab               3D model discovery;     https://sketchfab.com/
                          verify each model's     
                          licence                 

  Three.js                Custom WebGL and 3D     https://threejs.org/
                          experiences             
  ---------------------------------------------------------------------------------------

### Suggested components

-   Responsive navbar.
-   Premium hero layout.
-   Jewellery category cards.
-   Product showcase cards.
-   Image gallery or carousel.
-   WhatsApp floating action button.
-   Contact information cards.
-   Store location/map section.
-   Responsive footer.
-   Subtle scroll reveal and hover interactions.

### 3D and animation direction

Optional visual effects: - Rotating gold jewellery or a gold object in
the hero. - Subtle gold particles. - Soft metallic gradient accents. -
Gentle image hover transitions. - Small scroll-reveal animations.

Use Spline or Three.js only if the visual result adds meaningful value.
A heavy 3D scene is not required for the first release. Prefer optimized
images and CSS effects if they achieve the intended look with less
performance cost.

### Licensing

Before using any third-party component, image, font or 3D model: - Check
its licence and attribution requirements. - Confirm whether commercial
use is allowed. - Keep required attribution. - Do not assume that a
model visible on a marketplace is free to use.

------------------------------------------------------------------------

## 7. Technical Implementation

### Framework

The final framework has not yet been specified. Confirm the existing
project setup before installing or replacing dependencies.

If starting from scratch, a suitable lightweight option is: - React. -
Vite. - TypeScript (recommended). - Tailwind CSS or a consistent CSS
design-token system. - Lucide icons. - React Router only if additional
routes are genuinely needed.

A single-page landing page does not require a complex routing or backend
architecture.

### Architecture principles

-   Build reusable components for navigation, sections, product cards
    and footer.
-   Keep business information in one central configuration file.
-   Keep product examples in a separate data file.
-   Keep image paths in the product data so real photographs can replace
    placeholders easily.
-   Store WhatsApp number and message template centrally.
-   Use semantic HTML.
-   Avoid unnecessary dependencies.
-   Do not add a database or authentication system for this
    informational website.

### Suggested project structure

``` text
hasanah-gold/
├── public/
│   ├── images/
│   │   ├── logo/
│   │   ├── products/
│   │   ├── categories/
│   │   └── store/
│   └── favicon.ico
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── Navbar.tsx
│   │   ├── Hero.tsx
│   │   ├── About.tsx
│   │   ├── Collections.tsx
│   │   ├── FeaturedProducts.tsx
│   │   ├── WhyHasanahGold.tsx
│   │   ├── VisitStore.tsx
│   │   ├── Contact.tsx
│   │   ├── WhatsAppButton.tsx
│   │   └── Footer.tsx
│   ├── data/
│   │   ├── business.ts
│   │   └── products.ts
│   ├── styles/
│   │   └── globals.css
│   ├── App.tsx
│   └── main.tsx
├── index.html
├── package.json
└── README.md
```

This is a suggested structure, not a requirement to restructure an
existing repository unnecessarily.

### Business configuration

Keep these values in one place: - Business name. - Address. - Email. -
Phone number. - WhatsApp number. - Social media URLs. - Tagline. -
Google Maps destination or embed URL.

This reduces the risk of inconsistent contact information across
sections.

------------------------------------------------------------------------

## 8. Responsive Design Requirements

The website must work across: - Mobile phones. - Tablets. - Laptops. -
Desktop monitors.

Requirements: - Mobile-first layout. - No horizontal overflow. -
Navigation collapses appropriately on small screens. - Product cards
adapt from one column on narrow screens to multiple columns on wider
screens. - Buttons have comfortable touch targets. - Images use
responsive sizing and appropriate aspect ratios. - Typography scales
smoothly between screen sizes. - WhatsApp floating button must not cover
important content or mobile navigation. - Test at common widths,
including approximately 360px, 390px, 768px, 1024px and 1440px.

------------------------------------------------------------------------

## 9. SEO, Accessibility & Performance

### SEO

-   Use a descriptive page title, for example:
    `Hasanah Gold | Kedai Emas di Kuala Terengganu`.
-   Add a concise meta description describing the store and its
    location.
-   Use one clear H1 heading.
-   Use meaningful section headings in a logical hierarchy.
-   Add descriptive alt text to meaningful product and store images.
-   Use Open Graph metadata for social sharing.
-   Use a favicon based on the official logo once available.
-   Keep the business name, address and contact details consistent.
-   Do not add fake reviews, ratings or structured business claims.

### Accessibility

-   Maintain sufficient text/background contrast.
-   Use semantic landmarks and heading structure.
-   Provide visible keyboard focus states.
-   Ensure navigation and buttons are keyboard accessible.
-   Add accessible labels to icon-only controls.
-   Respect reduced-motion preferences.
-   Do not communicate important information through colour alone.

### Performance

-   Compress and resize images before deployment.
-   Prefer WebP or AVIF where supported.
-   Lazy-load images below the fold.
-   Avoid loading large 3D scenes before they are needed.
-   Limit animation libraries and unnecessary JavaScript.
-   Prevent layout shifts by specifying image dimensions or aspect
    ratios.
-   Test the site on a mid-range mobile device and a slower connection.

------------------------------------------------------------------------

## 10. Content & Asset Replacement Plan

The website can be developed before the business has final photography.

### Temporary assets

Use suitable royalty-free or properly licensed jewellery images for: -
Hero visual. - Rings. - Bracelets. - Necklaces. - Pendants. -
Earrings. - General product showcase.

Temporary images must not be presented as verified photographs of
Hasanah Gold's actual inventory.

### When real assets become available

Replace: 1. Text logo placeholder with the official logo. 2. Hero stock
image with an approved store or jewellery photograph. 3. Category stock
images with real category photography. 4. Sample products with actual
product images and approved descriptions. 5. Store placeholder with real
storefront/interior photography. 6. Any sample product labels with
verified product information.

Keep the same image dimensions or aspect ratios where practical to avoid
redesigning the page.

------------------------------------------------------------------------

## 11. WhatsApp Enquiry Behaviour

WhatsApp is the main conversion action.

### Requirements

-   Main CTA should open a WhatsApp conversation.
-   Product-level CTA should include the product or category name in the
    prefilled message.
-   General CTA should use a general enquiry message.
-   The visitor must be able to edit the message before sending.
-   Do not claim that an enquiry has been sent merely because the
    visitor clicked the link.

### Example messages

General:

"Hi Hasanah Gold, saya ingin bertanya tentang koleksi emas yang
tersedia."

Product:

"Hi Hasanah Gold, saya berminat untuk mengetahui lebih lanjut tentang
\[nama produk\]. Boleh saya dapatkan maklumat lanjut?"

Use URL encoding for prefilled message text.

------------------------------------------------------------------------

## 12. Development Phases

### Phase 1 --- Foundation

-   Confirm framework and repository structure.
-   Set up design tokens and typography.
-   Configure business information and social links.
-   Build responsive navigation and footer.

### Phase 2 --- Main landing page

-   Implement hero.
-   Implement About section.
-   Implement jewellery categories.
-   Implement featured products.
-   Implement Why Choose Us section.

### Phase 3 --- Contact and conversion

-   Implement WhatsApp links.
-   Implement contact section.
-   Add map/directions.
-   Verify phone, email and social links.

### Phase 4 --- Visual refinement

-   Add restrained animations.
-   Improve spacing, typography and image treatment.
-   Verify magenta and gold balance against the official logo when
    supplied.
-   Check mobile and desktop layouts.

### Phase 5 --- Testing and launch

-   Test all navigation links and CTAs.
-   Test WhatsApp on desktop and mobile.
-   Verify map pin and social destinations.
-   Check image loading and responsive behaviour.
-   Run accessibility and performance checks.
-   Review all content for unsupported claims.
-   Deploy only after the business owner approves the content and
    assets.

------------------------------------------------------------------------

## 13. Acceptance Checklist

The first release is ready for review when:

-   [ ] Hasanah Gold branding is visible and consistent.
-   [ ] Pink magenta and gold are used appropriately.
-   [ ] The tagline is included as proposed copy.
-   [ ] Business address, email and phone number are correct.
-   [ ] All five jewellery categories are represented.
-   [ ] Featured products use clearly temporary sample content.
-   [ ] No unverified price, purity, weight, stock or warranty claims
    appear.
-   [ ] WhatsApp links open the correct number with an editable message.
-   [ ] Facebook, Instagram and TikTok links are verified.
-   [ ] Map points to the correct shop lot.
-   [ ] No unconfirmed operating hours are displayed.
-   [ ] Layout works on mobile, tablet and desktop.
-   [ ] Images are optimized and have suitable alt text.
-   [ ] Navigation, buttons and links work.
-   [ ] No horizontal overflow or major layout shift occurs.
-   [ ] Third-party assets and components have compatible licences.

------------------------------------------------------------------------

## 14. Instructions for AI Coding Agents

When using this document with an AI coding agent:

1.  Inspect the existing repository before changing files or installing
    packages.
2.  Follow the confirmed business details and project scope in this
    document.
3.  Do not turn the project into an e-commerce application.
4.  Do not invent business history, operating hours, prices, gold
    purity, stock availability, reviews, awards or guarantees.
5.  Use temporary product imagery and sample data only where necessary;
    keep them easy to replace.
6.  Prioritize a distinctive, polished jewellery-brand design over a
    generic template.
7.  Use magenta and gold in a restrained, consistent way.
8.  Ensure every CTA has a working destination.
9.  Keep the website lightweight, responsive and accessible.
10. Explain major dependencies and implementation decisions.
11. Test the completed sections before moving to the next phase.
12. Do not overwrite or remove existing project files without checking
    their purpose.

**Expected outcome:** A polished, responsive and premium-looking
informational landing page for Hasanah Gold that introduces the store,
showcases gold jewellery categories and directs interested customers to
WhatsApp.
