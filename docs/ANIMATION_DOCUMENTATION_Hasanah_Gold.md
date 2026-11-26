# Hasanah Gold — Motion & Animation Direction

**Document type:** Motion design specification  
**Project:** Hasanah Gold Landing Page  
**Companion document:** `PROJECT_DOCUMENTATION_Hasanah_Gold.md`  
**Motion concept:** Luxury Motion Experience

---

## 1. Motion Design Vision

Create a premium, immersive jewellery-brand experience using expressive but controlled motion. The website should feel elegant, tactile and visually memorable—not like a generic template with random animations.

The confirmed brand palette is pink magenta and gold. Motion should reinforce these colours through metallic light, soft reflections, depth, graceful transitions and deliberate pacing.

The animation style may be bold in the hero and key visual moments, but it must remain smooth, readable, responsive and purposeful.

### Core principles

1. Luxury through restraint: use a few memorable animations rather than animating every element.
2. Fluid movement: prefer smooth easing and continuous motion over abrupt transitions.
3. Depth: use layered imagery, parallax and subtle 3D transforms to create a sense of physical jewellery.
4. Clear hierarchy: motion should direct attention to the brand, collections and WhatsApp enquiry actions.
5. Performance first: never sacrifice usability or loading speed for an animation.
6. Respect the user: support reduced-motion preferences and avoid flashing or disorienting movement.

## 2. Motion Personality

Combine three characteristics:

| Characteristic | Behaviour |
|---|---|
| Elegant | Slow, controlled reveals and graceful easing |
| Premium | Metallic reflections, depth and deliberate transitions |
| Expressive | Dramatic hero composition and confident product interactions |

Avoid cartoon-like bouncing, excessive elastic easing, constant movement, fast flashing highlights, overused glassmorphism, random particles over text, scroll hijacking and animations that delay access to content.

## 3. Global Motion Tokens

Centralize timing and easing for consistency.

### Duration tokens

| Token | Duration | Typical use |
|---|---:|---|
| `--motion-instant` | 120ms | Small state changes |
| `--motion-fast` | 220ms | Buttons and icon interactions |
| `--motion-normal` | 450ms | Cards and standard reveals |
| `--motion-slow` | 750ms | Section transitions |
| `--motion-cinematic` | 1100ms | Hero and large visual reveals |
| `--motion-dramatic` | 1500ms | One-off hero artwork entrance |

### Easing tokens

```css
:root {
  --ease-luxury: cubic-bezier(0.22, 1, 0.36, 1);
  --ease-smooth: cubic-bezier(0.65, 0, 0.35, 1);
  --ease-reveal: cubic-bezier(0.16, 1, 0.3, 1);
  --ease-gentle: cubic-bezier(0.4, 0, 0.2, 1);
}
```

Use `--ease-luxury` for most entrances and `--ease-gentle` for small UI interactions. Do not use the longest duration for every element.

### Transform guidance

- Prefer `transform` and `opacity`.
- Avoid repeatedly animating layout properties such as `top`, `left`, `width` and `height`.
- Use `will-change` only when genuinely needed.
- Avoid excessive blur animations on large full-screen elements.

## 4. Page Entrance & Loading Experience

### 4.1 Initial brand reveal

Create a short, premium entrance sequence on the first visit/load:

1. Warm-white or deep-magenta base background appears.
2. A thin gold line draws across the central composition.
3. Hasanah Gold wordmark fades and moves gently into position.
4. Hero heading reveals line by line.
5. Supporting copy and CTA appear.
6. Main jewellery image completes its reveal with a subtle scale and opacity transition.

Suggested timings:
- Background: 200ms.
- Gold line: 600–800ms.
- Wordmark: 650ms.
- Heading: 700–900ms.
- Supporting content and CTA: 450–600ms.
- Hero image: 1000–1300ms.

Stagger the sequence naturally. The complete entrance must not prevent interaction for several seconds. Do not create a mandatory full-screen loading screen. The page should remain usable immediately. Avoid replaying a long intro unnecessarily on repeat visits.

### 4.2 Text reveal

Use a mask/clip reveal for the hero headline:
- Text starts slightly below its final position.
- A clipping container reveals each line.
- Each line enters with a small stagger.
- Avoid character-by-character animation unless strongly justified.

Keep text selectable and accessible. Animation must not replace the actual heading content.

## 5. Hero Section — Signature Animation

The hero should be the strongest animated area.

### Visual composition

- Large editorial headline on one side.
- Jewellery hero image or 3D object on the other side.
- Soft magenta glow or gradient behind the object.
- Thin gold decorative lines or small light accents.
- Clear, prominent CTA buttons.

### Animation sequence

1. Background gradient gently fades into view.
2. Main jewellery image enters with slight 3D rotation and scale from approximately 0.92 to 1.
3. Decorative gold rings or lines draw around the composition.
4. Heading reveals with a staggered mask animation.
5. CTA buttons fade and rise into place.
6. Subtle ambient light movement continues behind the jewellery.

### Ambient movement

The hero object may float slowly:
- Vertical movement: approximately 8–14px.
- Full cycle: 5–8 seconds.
- Easing: ease-in-out.
- No sudden direction changes.

If using a 3D jewellery model, use very slow rotation or gentle camera movement. Keep the product recognisable and avoid excessive spinning.

### Parallax

On pointer-capable desktop devices:
- Background responds subtly to pointer position.
- Foreground jewellery responds in the opposite direction.
- Maximum movement: approximately 8–16px.
- Disable on touch devices and when reduced motion is enabled.

Do not shift CTA or text enough to interfere with reading.

## 6. Gold Visual Effects

Use gold effects as accents, not as a permanent layer covering the website.

### 6.1 Metallic shimmer

Apply a moving highlight to selected decorative gold elements:
- A narrow gradient travels across a gold line, border or decorative word.
- Duration: around 2–3 seconds.
- Repeat with a long pause.
- Do not apply shimmer to every button or all body text.

### 6.2 Gold particle atmosphere

Optional small particles may drift slowly around the hero composition.

Rules:
- Keep particle density low.
- Keep particles away from text and controls.
- Use subtle opacity and size variation.
- Avoid full-screen particle canvases on mobile.
- Pause or remove particles when the hero is not visible.
- Prefer CSS particles or a lightweight implementation over a large animation dependency.

### 6.3 Gold line drawing

Use SVG stroke animation for thin ornamental curves, circular jewellery-inspired outlines, section separators and small decorative motifs. Keep these behind or beside content, never over important text.

### 6.4 Metallic gradients

Use CSS gradients for gold accents rather than flat yellow.

```css
.gold-metallic {
  background: linear-gradient(
    115deg,
    #9f7620 0%,
    #e5c45d 24%,
    #fff0b3 42%,
    #c99a2e 60%,
    #f4df91 78%,
    #9f7620 100%
  );
  background-size: 220% 100%;
}
```

Animate the gradient only on selected elements and only when it improves hierarchy.

## 7. Scroll-Triggered Motion

Use scroll-triggered reveals to make the page feel connected and editorial.

### General reveal behaviour

For content sections:
- Start with opacity 0 and translateY around 24–36px.
- Reveal to opacity 1 and translateY 0.
- Duration: 600–850ms.
- Use a small stagger between sibling cards.
- Trigger once for normal content to avoid repeated distraction.

Do not hide the entire page until scrolling reaches each section. Content should remain available if JavaScript fails.

### Section-specific motion

| Section | Recommended motion |
|---|---|
| About | Image reveal with text entering from the opposite side |
| Collections | Staggered card entrance |
| Featured products | Image mask reveal and card stagger |
| Why Hasanah Gold | Number/icon fade-up or simple sequential reveal |
| Visit Us | Map and address fade in with a gentle horizontal offset |
| Contact | CTA and contact cards reveal with short stagger |
| Footer | Simple fade-in; no dramatic effects |

A thin magenta/gold scroll progress indicator at the top is optional. Keep it subtle.

Do not hijack scrolling or force section-by-section scrolling. Native browser scrolling must remain intact.

## 8. Collections & Product Card Interactions

Product imagery is a key part of a jewellery website. Interactions should make each item feel tactile.

### Product card entrance

- Cards enter with a small upward movement and fade.
- Stagger neighbouring cards by approximately 80–120ms.
- Avoid large rotations during scroll entrance.

### Hover interaction — desktop

On pointer hover:
- Image scales gently to approximately 1.04–1.07.
- Card rises approximately 4–7px.
- A subtle shadow or magenta/gold border accent appears.
- Enquiry icon or CTA becomes more visible.
- Transition duration: approximately 300–450ms.

### Pointer tilt

Optional 3D tilt:
- Maximum rotation around 2–3 degrees.
- Use pointer position relative to the card.
- Return smoothly to the original position on pointer leave.
- Disable on touch devices and reduced-motion settings.
- Never allow excessive wobble or rotation.

### Image reveal

A restrained image mask or clip-path reveal may be used as cards enter the viewport. Avoid complex masking on every image if it causes rendering issues.

### Mobile behaviour

- Do not depend on hover.
- Keep enquiry action visible or accessible with a tap.
- Avoid tilt and pointer tracking.
- Keep card transitions short and light.

## 9. Navigation & CTA Micro-interactions

### Navigation

- Transparent or light navigation may transition to a solid warm-white surface after scrolling.
- Use a subtle shadow or border when scrolled.
- Active section indicator may use a thin gold underline.
- Mobile menu should open and close smoothly without blocking keyboard navigation.

### Buttons

Primary WhatsApp button:
- Magenta or deep-magenta background.
- Clear white label.
- Small arrow or WhatsApp icon.
- Hover: slight upward movement and subtle gold highlight.
- Active: small scale response, not a large bounce.
- Focus: visible keyboard outline.

Secondary button:
- Outline or text-button treatment.
- Gold border or magenta text.
- Smooth colour transition.

### Magnetic-style CTA

An optional magnetic pointer effect may be used for the main hero CTA on desktop:
- Limit movement to a few pixels.
- Disable on touch devices.
- Do not interfere with click target accuracy.
- Preserve normal button behaviour if the effect fails.

### WhatsApp floating button

- Enter with a short fade/scale after page readiness.
- Use a subtle attention cue only once, if needed.
- Do not pulse continuously.
- Keep it clear of mobile navigation and other controls.

## 10. About, Store & Contact Motion

### About section

- Image enters through a soft reveal.
- Heading and copy appear with a short stagger.
- Decorative gold line draws after the heading.
- Avoid parallax if it makes the section harder to read.

### Visit Us section

- Address card fades and rises.
- Map container appears with a subtle scale transition.
- Directions CTA receives a small hover response.
- Do not animate the map itself or delay usability.

### Contact section

- Contact cards enter in a staggered sequence.
- Social icons use a small hover translation or colour transition.
- WhatsApp CTA receives the strongest visual emphasis.
- Keep email and phone links directly usable.

## 11. Optional Dramatic Feature — Jewellery Showcase

If suitable high-quality assets are available, create one standout visual moment between the hero and collections.

Possible directions:
- A large gold ring or bracelet displayed against a magenta backdrop.
- A gold object slowly rotating in a controlled 3D scene.
- A jewellery image revealed through a circular or diagonal mask.
- A metallic gold line tracing around the product.

Implementation options:
1. Optimized transparent product image with CSS transforms.
2. Spline scene for a ready-made interactive 3D experience.
3. Three.js for a custom 3D scene if justified and adequately resourced.

Choose one direction, not all three. The product should remain the focus. If no suitable model is available, use a high-quality static image with tasteful motion. Do not use a low-quality 3D model just to claim the website has 3D.

## 12. Recommended Animation Technology

Choose the lightest suitable tool for each effect. Do not install every library listed below.

| Tool | Best use | Guidance |
|---|---|---|
| CSS animations/transitions | Hover, shimmer, floating elements and simple reveals | Default choice for simple effects |
| Motion for React (formerly Framer Motion) | React component entrance, layout and interaction animation | Use for coordinated UI motion |
| GSAP + ScrollTrigger | Complex timelines and controlled scroll sequences | Use only if CSS/Motion is insufficient |
| React Bits | Reusable animated visual components | Inspect source, dependencies and licence |
| Spline | Interactive 3D jewellery or hero scene | Lazy-load and provide a static fallback |
| Three.js | Custom WebGL jewellery scenes | Use only when justified |
| Intersection Observer | Lightweight viewport-triggered reveals | Good for simple scroll reveals |

### Dependency discipline

- Prefer CSS for simple hover and reveal effects.
- Select one primary React animation library if needed.
- Do not use GSAP and Motion for the same simple animation.
- Avoid large dependencies for a single decorative effect.
- Check package compatibility with the existing React version.
- Verify third-party component licences.

## 13. Performance & Rendering Requirements

Animation quality is not just visual smoothness; it must work on ordinary devices.

Requirements:
- Animate `transform` and `opacity` wherever possible.
- Avoid continuous animation of large shadows, filters and blur layers.
- Compress product and hero images.
- Use lazy loading for below-the-fold images.
- Load 3D scenes only when needed.
- Pause off-screen animation where possible.
- Avoid creating hundreds of DOM particles.
- Avoid large canvas effects on low-powered mobile devices.
- Prevent layout shift by reserving image and media dimensions.
- Keep the page responsive while animation assets load.
- Provide static fallbacks for WebGL or external 3D content failures.

Target a smooth experience on modern mid-range mobile devices. Do not promise a fixed frame rate without testing on actual hardware.

## 14. Accessibility & Reduced Motion

Respect the operating system's reduced-motion preference.

Example baseline:

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    scroll-behavior: auto !important;
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

For JavaScript-driven animation:
- Check `prefers-reduced-motion`.
- Disable pointer parallax, tilt, looping particles and non-essential 3D rotation when reduced motion is requested.
- Keep content visible without requiring animation to complete.
- Ensure focus indicators remain visible.
- Do not use flashing or strobing effects.
- Do not animate text in a way that makes it difficult to read.

The CSS snippet is a baseline; test that it does not unintentionally hide content or break essential interaction states.

## 15. Mobile Motion Strategy

Mobile should have a deliberately simplified motion profile rather than a scaled-down desktop effects layer.

Keep:
- Hero text reveal.
- Gentle image fade/scale.
- Short section reveals.
- Simple card entrance.
- Button feedback.
- Small decorative gold accents.

Reduce or remove:
- Pointer parallax.
- Magnetic CTA.
- 3D card tilt.
- Large particle systems.
- Heavy continuous 3D scenes.
- Long pinned scroll sequences.

Do not animate the page in ways that compete with touch scrolling.

## 16. Suggested Motion Schedule

| Element | Initial state | Final state | Duration |
|---|---|---|---:|
| Hero background | Soft opacity/gradient | Fully visible | 700ms |
| Wordmark | Opacity 0, slight Y offset | Opacity 1, neutral | 650ms |
| Hero heading | Masked, slight Y offset | Fully revealed | 800ms |
| Hero image | Scale 0.94, slight rotation | Scale 1, neutral | 1200ms |
| Hero CTA | Opacity 0, Y 12px | Visible | 500ms |
| Section heading | Opacity 0, Y 28px | Visible | 700ms |
| Product cards | Opacity 0, Y 24px | Visible | 600ms |
| Card hover | Neutral | Scale 1.04, Y -5px | 350ms |
| Button hover | Neutral | Slight lift/highlight | 220ms |
| Social icon hover | Neutral | Small Y offset | 200ms |

These are starting values. Adjust after testing the actual layout and assets.

## 17. Testing Checklist

### Visual quality
- [ ] Hero reveal feels premium and not excessively slow.
- [ ] Headline remains readable throughout the reveal.
- [ ] Gold shimmer is subtle and not distracting.
- [ ] Jewellery imagery remains the visual focus.
- [ ] Section reveals have consistent timing.
- [ ] Product card interactions feel smooth and controlled.
- [ ] CTA interactions are clear and responsive.

### Functionality
- [ ] Navigation works while animations are running.
- [ ] WhatsApp buttons remain clickable.
- [ ] Mobile menu works with keyboard and touch.
- [ ] Scroll behaviour remains native.
- [ ] No animation blocks access to important content.
- [ ] External 3D content has a fallback.

### Responsive and accessibility
- [ ] Desktop pointer effects are disabled on touch devices.
- [ ] Mobile scrolling remains smooth.
- [ ] Reduced-motion preference is respected.
- [ ] Keyboard focus is visible.
- [ ] No flashing or strobing effects.
- [ ] Text does not become hidden if JavaScript fails.

### Performance
- [ ] No major layout shifts.
- [ ] Below-the-fold images are lazy-loaded.
- [ ] Off-screen decorative animations are paused where practical.
- [ ] No excessive CPU/GPU usage from particles or 3D.
- [ ] Test on a mid-range mobile device.

## 18. Instructions for AI Coding Agents

Use this document together with `PROJECT_DOCUMENTATION_Hasanah_Gold.md`.

1. Inspect the existing codebase and identify its framework before choosing animation dependencies.
2. Preserve the brand direction: pink magenta, gold and an elegant jewellery aesthetic.
3. Build the static page structure and ensure content is visible before adding motion.
4. Implement the hero animation first and validate its timing and visual quality.
5. Add section reveals and product interactions only after the base layout is stable.
6. Use CSS for simple effects and avoid unnecessary animation libraries.
7. Keep animation code reusable and centralize timing/easing values.
8. Do not hide meaningful content behind JavaScript-only entrance states.
9. Add reduced-motion support and mobile-specific behaviour.
10. Do not use scroll hijacking or force-scroll experiences.
11. Do not sacrifice readability, accessibility or performance for dramatic effects.
12. Test all CTA and navigation interactions after animation is added.
13. Provide a static fallback for any 3D scene.
14. Do not add fake product details or business claims as part of the animation content.

### Recommended implementation order

**Step 1:** Complete the responsive static landing page.  
**Step 2:** Implement hero entrance and jewellery visual.  
**Step 3:** Add scroll-triggered section reveals.  
**Step 4:** Add product card hover and image transitions.  
**Step 5:** Add navigation, CTA and contact micro-interactions.  
**Step 6:** Add optional gold particles or a 3D showcase if performance allows.  
**Step 7:** Test mobile, desktop, reduced motion and performance.

**Expected result:** A distinctive Hasanah Gold landing page with a cinematic jewellery hero, refined gold visual effects, fluid scroll reveals and tactile product interactions—bold enough to feel memorable, but controlled enough to remain premium, accessible and fast.
