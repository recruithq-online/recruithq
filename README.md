# rEcruit

A frontend marketplace`, built inside the existing Next.js App Router application with React, TypeScript, and Tailwind CSS 4.

## Run

Requires Node.js 20.9 or newer. Run `npm install`, then `npm run dev`, and open http://localhost:3000. For production, run `npm run build` then `npm start`.

## Current frontend

The application contains marketplace screens and the restored Team section. The old Roadmap, Whitepaper, Coming Soon, and waitlist sections and navigation links have been removed from the live UI. `/early-access` redirects to `/`. The header follows the `index-6.html` navbar: sticky single-row layout, blue rE mark, Explore/Hire/List expertise links, Sign in, and Get started. Signed-in sessions expose Messages and Dashboard. On mobile the links and Sign in control hide as in the reference; Get started remains available, or Dashboard when signed in. Team sits alongside Explore, Hire, and List expertise and follows their mobile visibility. The light/dark toggle stays in the navbar on desktop and mobile. The original Team section is restored above the footer. Marketplace destinations and contact/social links remain in the footer.


Sign in using `hirer@recruit.test` or `expect@recruit.test`, both with password `Test1234!`. The sign-in dialog can fill either account and shows inline validation. All marketplace dialogs have a dedicated padded surface, an inset close button, keyboard focus management, and a scrollable layout for small screens. Light and dark themes retain the saved browser preference.

Switch accounts to try both sides of a job: post as hirer, apply as expect, accept as hirer, deliver as expect, and review as hirer. Personal hiring requires both accounts to add sample wallet addresses before simulating payment. No wallet is connected and no funds move. Company hiring shows a separate 2.5% fee; personal hiring adds 5% to the agreed job price. Fee arithmetic uses integer cents.

## Implementation

- `app/layout.tsx`: shared marketplace provider, header, content, and footer.
- `components/marketplace/`: reusable screens, header, dialog forms, local state, and scoped CSS.
- `lib/marketplace.ts`: domain types, sample profiles, fee calculations, and validation helpers.
- `components/modal.tsx`: shared focus trapping, Escape/backdrop dismissal, scroll locking, focus restoration, and an isolated marketplace surface variant.
- `components/site-sections.tsx`: footer branding, contact links, and current marketplace destinations.
- `app/api/waitlist/route.ts`, `lib/waitlist.ts`, `lib/waitlist-email.ts`: retained email handling, unchanged by the UI cleanup.

Marketplace state survives Next.js client navigation and test-account switching within the tab and resets on refresh. Marketplace interactions do not call APIs. Evidence forms retain filenames only. Both test accounts can try the labelled review simulation: approved Vouches and Refutes affect local scores; pending or rejected evidence does not. Real accounts, durable profiles/jobs/messages, secure evidence uploads, reviewer access, notifications, and payment processing require backend integration.

## Checks

```sh
npm run typecheck
npm run lint
npm run build -- --webpack
npm run test:e2e
```

Browser tests require a completed build and Google Chrome. They run a local production server on port 3107. `tests/design-reference.spec.ts` compares marketplace content geometry and typography with `index-6.html` at 390px, 768px, and 1440px. Marketplace/theme checks cover 320px through desktop widths, routing, validation, account switching, conversations, evidence review, and both hiring lifecycles. `tests/modal-layout.spec.ts` checks modal insets, viewport fit, scrolling, inline validation, and keyboard behavior, including the reported 638×669 layout and 320×568 phones. `tests/site.spec.ts` checks that legacy sections are absent and the old URL redirects. Email tests mock delivery and never send a live email. Screenshots and traces are written to ignored `test-results/`.

## Waitlist submissions

The existing waitlist email implementation and server configuration are retained unchanged. The public waitlist UI has been removed. New marketplace interactions do not use this endpoint; the delivery details below describe the retained email code.

The form posts to `/api/waitlist`. The server validates the submission and calls the [Resend Email API](https://resend.com/docs/api-reference/emails/send-email) to email the public alias, email address, and expertise to your admin inbox. The notification's Reply-To is the submitter's email address. The recipient and sender come exclusively from server configuration.

Admin notifications include a responsive HTML design with blue accents, white surfaces, and dark text: a brand header, separate labelled signup details, and a reply button. They also include a plain-text fallback. Submitted content is escaped before insertion into HTML. Running the browser tests writes a sample to `test-results/waitlist-email-preview.html` and screenshots at 320px, 390px, and 800px; the sample uses fictional details and sends no email.

For a new setup, copy `.env.example` to `.env.local` and configure the server-only settings. If `.env` or `.env.local` already exists, update the active file rather than creating conflicting copies (`.env.local` takes priority over `.env`).

```dotenv
RESEND_API_KEY=re_your_api_key
RESEND_FROM_EMAIL="rEcruit <onboarding@resend.dev>"
ADMIN_EMAIL=your-resend-account@example.com
```

Replace `ADMIN_EMAIL` with the email address associated with the Resend account that created the API key. This is the notification recipient; the submitter's email remains Reply-To. The `resend.dev` test sender can only deliver to that Resend account email. A different recipient produces a `403 validation_error`, even when the API key and form are otherwise valid. See [Resend's test-sender restriction](https://resend.com/docs/knowledge-base/403-error-resend-dev-domain).

To keep notifications going to `askrecruithq@gmail.com` when it is not your Resend account email, add and verify a domain you own in Resend, then set `RESEND_FROM_EMAIL` to an address on that verified domain. Gmail can remain the recipient, but a Gmail address cannot be used as a verified-domain sender in Resend. Never change the recipient to an unrelated address just to bypass the test restriction.

For production sending to other recipients, use a sending address on a [verified Resend domain](https://resend.com/docs/send-with-nextjs). Set the same three environment variables in your deployment host and restart/redeploy after changes. These variables stay on the server; never prefix them with `NEXT_PUBLIC_`. The application requires a host that runs Next.js route handlers rather than a static-only export.

The form only shows success after the API returns an accepted Resend email ID; a generic HTTP 200 response is not enough. Missing configuration, provider rejection, network errors, and blocked honeypot submissions show the retry state. Resend acceptance does not guarantee inbox delivery. This emails notifications rather than storing a separate waitlist database. No live emails are sent by the automated tests: the Resend API and browser submission responses are mocked. Verify real delivery after configuring your own Resend account.

If a submission does not arrive, check the terminal running Next.js for `[waitlist]` messages. They distinguish missing settings, blocked spam-trap submissions, provider rejection, and network failures. Rejection logs include Resend’s explanation, with API credentials and email addresses redacted; visitors receive a generic retry message. Successful sends log an email ID that can be checked in the Resend dashboard. Restart `npm run dev` after changing environment settings, then refresh the browser. In Gmail, also check Spam and All Mail for messages from `onboarding@resend.dev`.

A repeated `400` with a honeypot warning means the hidden `bot-field` was filled before the request reached Resend. That field is read-only and includes password-manager ignore hints to prevent accidental text entry and reduce autofill interference. The server still rejects nonempty values, and the form now displays validation messages for rejected submissions. Refresh any form left open before this fix.
