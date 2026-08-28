# Integrity Moving Service Advertising-Readiness Plan

Status: PRE-EXECUTION PLANNING. This is a readiness plan, not authorization to launch or spend.

## Recommended first campaign

- Channel: Google Search.
- Primary audience: People actively searching for moving, packing, storage, or junk-removal help in approved service areas.
- Offer: Request a free quote by phone or the protected website form. No price, discount, ranking, availability, or response-time guarantee is implied.
- Final URLs:
  - General moving: `https://chooseintegritymoving.com/`
  - Service comparison: `https://chooseintegritymoving.com/services/`
  - Junk removal: `https://chooseintegritymoving.com/junk-removal/`
- Geographic targeting: Approved service areas only. Use Google Ads presence targeting; do not target people merely interested in the area.
- Budget: Client-funded and TBD. No spend is authorized by this plan.
- Campaign owner: Integrity Moving Service or its separately authorized advertising manager.
- Lead owner: Integrity Moving Service. Quote emails route to `integritymovingservicellc@gmail.com`.
- Launch date: TBD after the readiness gates below are complete.

## Campaign structure

1. Local Moving — exact and phrase intent around Indianapolis and approved Indiana destinations.
2. Long-Distance Moving — route-specific terms only; exclude nationwide and unsupported destination claims.
3. Packing & Unpacking — packing help associated with a move.
4. Storage Services — moving-related storage intent; do not claim facility ownership, unrestricted access, or guaranteed duration.
5. Junk Removal — Indianapolis household-junk intent; exclude hazardous-waste and unsupported material types.

Each ad group should use the closest matching page or service anchor, a matching headline, one clear quote action, and its own negative-keyword review.

## Measurement

- GA4 stream: `G-F69TY2D1E6`.
- Primary conversion candidate: `generate_lead` after a protected quote submission is accepted.
- Secondary conversions: `click_to_call` and `quote_form_open` for observation. Do not optimize bidding to form opens.
- Lead context captured in the notification: service requested, landing page, referrer, UTM source/medium/campaign/term/content, and Google click identifiers when present.
- Google Ads setup dependency: Link the correct GA4 property and Ads account, mark `generate_lead` as a GA4 key event, import it into Google Ads, and make only the completed lead primary.
- Call measurement dependency: Configure a Google Ads call conversion or approved call-tracking number before optimizing toward phone calls.
- Test rule: Use test data only; do not submit a real customer lead during QA.

## Follow-up and optimization rules

- Integrity owns lead response. Record contact outcome, qualified/unqualified status, service type, and booked/not booked result in an approved system.
- First review: after enough click and conversion data exists to evaluate search terms; do not promise a fixed volume or performance level.
- Add negatives for irrelevant locations, jobs/employment, DIY/rental-only intent, hazardous waste, free services, and unsupported services.
- Pause any keyword or ad that produces repeated irrelevant traffic or claims the landing page cannot support.
- Do not make frequent bid, budget, or conversion-goal changes during an automated bidding learning period.
- Core KPIs: qualified leads, cost per qualified lead, lead-to-booked rate, booked-job value when available, call quality, search-term relevance, and landing-page conversion rate.

## Launch gates

- Written approval of final campaign services, areas, offer, ad copy, budget, owner, and launch date.
- Google Business Profile verification accepted or pending review, with no conflicting live edits.
- Search Console and GA4 access verified.
- `generate_lead` received in GA4 from a test submission and configured as the intended conversion.
- Call conversion measurement configured or explicitly excluded from primary bidding.
- Quote inbox and follow-up process tested with non-customer data.
- Privacy/form-consent language approved.
- Ads final URLs tested with `gclid` and UTM parameters preserved.
- Search indexing decision handled separately; AdsBot can review a reachable landing page even while general search indexing remains disabled.

## Scope boundary

Campaign creation, creative production, ad launch, spend, bidding, and ongoing management require separate written authorization. This plan does not guarantee ad approval, traffic, leads, rankings, appointments, revenue, or profitability.

## First-party guidance used

- Google Ads conversion measurement: https://support.google.com/google-ads/answer/1722022
- Google Ads final URLs and tracking templates: https://support.google.com/google-ads/answer/6273460
- Google Ads web conversions: https://support.google.com/google-ads/answer/16560108
- Google Search SEO Starter Guide: https://developers.google.com/search/docs/fundamentals/seo-starter-guide
- Google Search structured-data guidelines: https://developers.google.com/search/docs/appearance/structured-data/sd-policies
