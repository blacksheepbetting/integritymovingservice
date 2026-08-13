# Integration handoff

This document describes the staged connection points for Google reviews and the future Google Sheets lead CRM. Nothing is connected or transmitting data yet.

## Google Reviews widget

The homepage reserves a responsive widget container with this stable target:

```html
<div id="google-reviews-widget" data-integration="google-business-profile-reviews-pending">
```

When a widget provider is approved:

1. Connect it to the client-owned Google Business Profile.
2. Replace the `.reviews-placeholder` content inside the target container with the provider embed or its React component.
3. Preserve the section heading and disclosure unless the approved widget supplies an accessible equivalent.
4. Verify keyboard use, mobile layout, loading performance, and that the widget does not expose unrelated account data.
5. Do not copy reviews into the source code or invent a rating, review count, customer name, or quote.
6. Add review or aggregate-rating schema only if the final visible widget data, source, and markup qualify under current Google guidelines and can remain synchronized. No review schema is included in staging.

## Quote form to Google Sheets CRM

Both the homepage and Contact page use the same staged `QuoteForm`. It is marked with:

```html
<form data-integration="google-sheets-crm-pending" data-form-version="integrity-quote-v1">
```

### Proposed Sheet columns

Use a client-owned Google Sheet with a protected header row and these columns:

1. `leadId`
2. `createdAt`
3. `status`
4. `owner`
5. `nextActionAt`
6. `name`
7. `phone`
8. `email`
9. `moveDate`
10. `movingFrom`
11. `movingTo`
12. `moveSize`
13. `service`
14. `details`
15. `contactConsent`
16. `landingPage`
17. `referrer`
18. `utmSource`
19. `utmMedium`
20. `utmCampaign`
21. `utmContent`
22. `utmTerm`
23. `gclid`
24. `formVersion`

Recommended initial statuses: `New`, `Contacted`, `Qualified`, `Quote Sent`, `Won`, `Lost`, and `Spam`.

### Required production flow

The browser should submit to a same-domain server endpoint such as `/api/leads`. That endpoint—not browser code—should:

1. Validate and normalize every field.
2. Verify Turnstile or another approved anti-spam token.
3. Apply rate limits and reject unexpected fields.
4. Create the timestamp and unique lead ID.
5. Write the record to the approved client-owned Sheet or an approved durable store.
6. Send a notification to the approved lead owner without including unnecessary sensitive data.
7. Return a success response before the site displays confirmation.
8. Trigger a GA4 `generate_lead` event only after the write succeeds.

Do not put Google credentials, Apps Script secrets, API keys, or an unrestricted Sheet endpoint in client-side code. Decide who owns the Sheet, Google Cloud/Apps Script project, notification inbox, and access recovery before connection.

## Approval checklist

- Client confirms the Google Business Profile and widget provider.
- Client confirms Sheet ownership and approved users.
- Client approves every form field and the privacy/consent language.
- Lead owner and response process are documented.
- Spam protection and error handling are tested.
- Test submissions reach the Sheet exactly once and send the intended notification.
- Source attribution fields are preserved.
- Analytics fires only on confirmed success.
- Data retention and deletion responsibility are documented.
