# rEcruit

A reputation-first professional expertise marketplace built with Next.js 16, React 19, strict TypeScript and Tailwind CSS 4.

## Run locally

Requires Node.js 20.9 or newer.

```sh
npm install
npm run dev
```

Open http://localhost:3000. For production builds, run `npm run build -- --webpack` and `npm start`. The configuration uses the TypeScript compiler API because this execution environment drops captured CLI subprocess output; build-time type checking remains enabled.

## Product experience

The homepage introduces professional records through a compact carousel of sample experts: completed work, vouches, refutes and reputation in context. Records rotate every five seconds, pause on hover or keyboard focus, and support swipe, previous/next, direct selection and a pause control. Reduced motion disables automatic rotation. Discovery supports text search, category, availability, sample verification, minimum reputation, maximum hourly rate and sorting. Filters are reflected in the URL and survive reload. Bookmarks create a shortlist saved on the current device; it works without an account.

Profiles expose both kinds of feedback, filtering, score explanations, rates, availability and hiring actions. The workspace provides direct navigation between the dashboard, messages, evidence reviews and settings. Company and personal hiring retain separate fees, application, acceptance, delivery, revisions and completion flows. Both themes follow system preferences until the visitor saves a choice.

The cinematic opening reveals the headline and professional record in sequence. Scroll reveals, a dark evidence section, short interaction transitions, and frosted navigation add visual rhythm. CSS and JavaScript motion follow the system’s reduced-motion preference.

The complete route inventory, audit findings and design decisions are in [docs/product-design-audit.md](docs/product-design-audit.md). The interface uses flat surfaces without shadows, 16px body and form text, 14px secondary text and a 12px minimum for short labels. Navigation collapses below 900px to keep controls comfortable. Only DM Sans (body text and controls) and Space Grotesk (headings and display text) are used. Both variable fonts are bundled locally, so rendering does not depend on a Google Fonts request. The frontend uses Tailwind utilities, shared UI primitives in `components/ui`, and design tokens in `app/globals.css`. Product screens live in `components/marketplace`; obsolete landing-page modules have been removed. See [docs/frontend.md](docs/frontend.md) for the module map and examples of changing card radius, borders, typography and individual screen styles.

## Preview accounts and data

Sign in through the header or workspace using either sample account:

| Account      | Email                 | Password    |
| ------------ | --------------------- | ----------- |
| Hirer        | `hirer@recruit.test`  | `Test1234!` |
| Professional | `expect@recruit.test` | `Test1234!` |

Account creation creates a temporary session. Profiles, jobs, messages, preferences, wallets and review decisions reset on refresh. Switch accounts without refreshing to try both sides of a project. Saved expert IDs and theme preference persist in local storage; credentials do not.

For personal hiring, add sample wallet addresses for both accounts before completing the simulated payment. No wallet connects and no funds move. Company hiring shows a separate 5% fee; personal hiring adds 2.5% to the job price. Fee calculations use integer cents.

Vouches and refutes require evidence filenames. Files are never uploaded or retained. The review queue is explicitly a simulation available to the sample accounts. New profiles start at 50/100; approving a vouch adds 1 and approving a refute subtracts 2, bounded to 0–100. Pending/rejected submissions do not change scores. Seeded profiles have illustrative historical scores and representative feedback entries.

This frontend requires backend integration for durable accounts and records, secure uploads, independent verification, reviewer permissions, message delivery, notifications and real payments.

## Verification

```sh
npm run typecheck
npm run lint
npm run build -- --webpack
npm run test:e2e
```

Playwright requires Google Chrome and a completed production build. It starts the app on port 3107; set `PLAYWRIGHT_PORT` to use another port if it is occupied. Tests cover discovery URLs, shortlist persistence, feedback filters, keyboard navigation, modal focus and scrolling, themes, route layouts from 320px through desktop, account switching, messages, evidence decisions and both hiring lifecycles. Screenshots and traces are written to ignored `test-results/`.

## Retained waitlist email service

The legacy waitlist UI is disconnected; `/early-access` redirects home. The existing `/api/waitlist` endpoint and email templates are retained unchanged. It validates form submissions and sends admin notifications using Resend. All automated email tests mock delivery.

Configure the existing `.env` or `.env.local` with server-only values:

```dotenv
RESEND_API_KEY=re_your_api_key
RESEND_FROM_EMAIL="rEcruit <onboarding@resend.dev>"
ADMIN_EMAIL=your-resend-account@example.com
```

Keep the intended admin recipient. Resend's test sender only sends to the account email; to send to another recipient, verify a domain you own and configure its sender address. Never prefix these settings with `NEXT_PUBLIC_`. Restart after configuration changes. This endpoint requires a Next.js server, not a static export. Provider acceptance is not a guarantee of inbox delivery. Server logs redact email addresses and credentials from provider errors.
