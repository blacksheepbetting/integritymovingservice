# Design QA

- source visual truth path: `design-reference/selected-concept.png`
- implementation target: local Vite preview at `http://localhost:4173/`
- viewport: intended desktop 1440px wide, plus responsive mobile below 700px
- source pixels: 862 × 1825
- implementation pixels: unavailable
- CSS size and density normalization: unavailable
- state: desktop homepage, idle quote form
- full-view comparison evidence: source image opened and inspected; browser-rendered implementation capture blocked by the environment's admin security policy
- focused region comparison evidence: blocked for the same reason
- primary interactions implemented: navigation, mobile menu, phone links, quote-form required fields, submitting state, success state, and form reset
- console errors checked: blocked because browser access to the local preview was denied

**Findings**

- [P1] Browser-rendered comparison is unavailable
  - Location: full homepage.
  - Evidence: both the in-app browser and connected Chrome refused the local preview because the required admin security policy could not be verified.
  - Impact: final visual fidelity, responsive behavior, and browser console state cannot be certified from rendered evidence.
  - Fix: recapture the local preview when browser access is available, compare it against the selected visual at the same viewport, and address any P0/P1/P2 drift.

**Build and functional evidence**

- Vite production build completed successfully.
- Hosting worker packaging completed successfully.
- All four hosting worker tests passed.
- Generated image assets were inspected directly and copied into the project.
- `noindex, nofollow` remains enabled for staging.

**Implementation Checklist**

- Capture the complete desktop page at 1440px wide.
- Test and capture the mobile layout.
- Submit the quote form and confirm its visible success state.
- Check the browser console.
- Compare source and implementation together and fix all P0/P1/P2 differences.

**Follow-up Polish**

- Replace generated staging photos with approved client photography.
- Connect the quote form to an approved destination and add privacy consent language.
- Add approved service-area and structured-data content only after fact verification.

final result: blocked

