# Design QA

- source visual truth: `design-reference/selected-concept.png`
- implementation screenshots: `qa/implementation-desktop.png`, `qa/implementation-mobile.png`, `qa/implementation-mobile-menu.png`, `qa/implementation-desktop-success.png`
- comparison evidence: `qa/comparison-full.jpg` and `qa/comparison-hero.jpg`
- desktop viewport: 864 × 1000 CSS px, `deviceScaleFactor: 1`
- source pixels: 864 × 1821
- implementation pixels: 864 × 2147
- density normalization: source and implementation compared at 864 physical pixels wide and 1× density; the full-view composite scales both sides to the same 700px panel width
- state: desktop homepage at rest; separate captures cover the open mobile menu and successful quote-form submission

## Findings

No actionable P0, P1, or P2 findings remain.

- Fonts and typography: the condensed display face, heavy heading weights, compact heading line height, Inter body copy, and red uppercase kickers preserve the reference hierarchy. The hero keeps the intended two-line headline at the matched desktop width.
- Spacing and layout rhythm: navigation, full-bleed hero, partial-width red band, two-column story, three-step photo grid, and black closing CTA follow the reference composition. The implementation is slightly taller because the staged footer is intentionally visible and the process copy has accessible line spacing.
- Colors and tokens: black, white, and `#e30613` red map to the selected black/red visual direction. Contrast remains strong in primary conversion areas.
- Image quality and asset fidelity: all visible photo slots use real raster assets with consistent warm residential moving photography. Images loaded successfully at desktop, and no placeholder boxes, CSS drawings, or fake SVG artwork remain.
- Copy and content: customer-facing copy stands on its own; the pre-execution approval notice is confined to the footer. No unverified rankings, guarantees, pricing, or service-area claims were added.
- Icons: phone, location, close, menu, status, and arrow controls use the Phosphor icon library and render consistently.
- Responsiveness: desktop 864px, tablet 768px, and mobile 390px all render without horizontal overflow. The three-step grid stacks cleanly on mobile, and the mobile tap-to-call control remains available.
- Accessibility: the skip link receives a visible focus outline; form fields have labels and native required validation; responsive navigation exposes expanded state and closes with Escape; motion respects `prefers-reduced-motion`.

## Comparison history

### Iteration 1

- Earlier [P1]: the repository copy of the source image was corrupted, preventing a valid full-page comparison.
  - Fix: restored the exact 864 × 1821 concept image supplied by the user.
  - Post-fix evidence: `qa/comparison-full.jpg` and `qa/comparison-hero.jpg` now show the complete reference and implementation together.
- Earlier [P2]: internal staging notes appeared inside the quote form, story, and service content.
  - Fix: rewrote customer-facing copy and confined the pre-execution notice to the footer.
  - Post-fix evidence: `qa/implementation-desktop.png`.
- Earlier [P2]: missing favicon produced a browser console 404.
  - Fix: added an explicit image favicon.
  - Post-fix evidence: final console errors are empty.

### Iteration 2

- Earlier [P2]: the process section used generic icon tiles and omitted the three photo cards present in the selected concept.
  - Fix: added a new consultation photo and reused matching move-day and after-arrival photography in the three-step grid.
  - Post-fix evidence: `qa/comparison-full.jpg`.
- Earlier [P2]: the original form placement changed the desktop hero proportions and the mobile reading order.
  - Fix: converted the validated quote form into a responsive modal opened by every quote CTA, restoring the selected single-hero composition.
  - Post-fix evidence: `qa/comparison-hero.jpg`, `qa/implementation-mobile.png`, and `qa/implementation-desktop-success.png`.
- Earlier [P2]: the closing CTA included a large image panel that was not present in the selected concept.
  - Fix: restored the concise black closing band with message, quote CTA, and phone CTA.
  - Post-fix evidence: `qa/comparison-full.jpg`.

## Functional evidence

- All five page images loaded successfully.
- Quote modal opened, required inputs accepted data, submission reached the success state, and the modal closed.
- Mobile navigation opened and closed with Escape.
- Desktop, tablet, and mobile document widths matched their viewports with no horizontal overflow.
- Browser console errors: none.
- Browser page errors: none.
- Vite production build completed successfully.
- Hosting package generation completed successfully.
- Hosting worker tests: 4 passed, 0 failed.

## Follow-up polish

- [P3] Replace generated staging photos with approved client photography when supplied.
- [P3] Replace the text-based wordmark and temporary image favicon with approved logo files.
- [P3] The staged footer adds content below the selected concept; remove or replace its approval notice only when publication is authorized.

final result: passed
