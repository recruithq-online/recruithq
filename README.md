# rEcruit

The public rEcruit landing page, built with Next.js App Router, TypeScript, React, and Tailwind CSS 4. Its homepage uses the v3 layout and compact rotating professional records while preserving main’s headline, roadmap, founder profile, whitepaper and coming-soon access state.

## Run

Requires Node.js 20.9 or newer.

```sh
npm install
npm run dev
```

Open http://localhost:3000. For production, run `npm run build` then `npm start`.

## Structure

- `app/`: route, root layout, metadata, design tokens, and global styles.
- `components/home.tsx`: v3 homepage layout, retained public headline and early-access/whitepaper section.
- `components/professional-record.tsx`: compact sample records with automatic rotation.
- `components/preview-expert-card.tsx`: sample expertise cards.
- `components/ui/`: shared v3 button, card and container styling.
- `lib/record-preview.ts`: adapts the existing sample experts for the v3 preview.
- `components/footer.tsx`: v3 footer layout, with marketplace links pointing to the coming-soon section or existing public sections.
- `components/`: retained public navigation, roadmap, team, forms and dialogs.
- `components/experience-provider.tsx`: shared search, demo profile state, dialog, and toast state. Static sections remain Server Components.
- `lib/experts.ts`: typed original expert profiles and filter options.
- `lib/team.ts`: the founder profile and complete bio from the approved HTML.
- `components/team-carousel.tsx`: reusable team container; controls are hidden for the single founder in this design.
- `app/logo.jpeg`: retained official raster logo reference.
- `components/brand.tsx`: the navigation uses normal text for rEcruit, with a blue E.
- `components/brand-logo.tsx`: transparent vector owl retained for the join modal and legacy footer.
- `app/owl.jpeg`: retained original owl reference image.
- `components/owl-avatar.tsx`: founder’s owl in a suit and blue tie, using the approved HTML’s vector artwork.
- `components/theme-toggle.tsx`: light/dark switch with system preference detection and a saved browser preference.
- `app/api/waitlist/route.ts`: server-side Resend email delivery for waitlist submissions.
- `lib/waitlist.ts`: expertise options shared by the form and server validation.
- `lib/waitlist-email.ts`: responsive branded HTML email and its plain-text fallback.
- `.env.example`: required server-side email settings.
- `tests/site.spec.ts`: source layout comparisons and browser interaction checks.

The homepage brings v3’s layout, sample expertise cards and compact record carousel into the public site. The original “Hire people for what they can actually do.” headline, four-phase Product Roadmap and gemhunter team content remain readable. Search, records, expertise listings, the reputation explanation and the closing expertise invitation remain blurred coming-soon previews. Waitlist buttons remain disabled. Tailwind Preflight is omitted to preserve the retained form defaults; the v3 baseline is scoped to the homepage.

The theme defaults to the visitor's system preference. The navigation toggle saves the selection in local storage, and a small initialization script applies it before rendering to avoid a theme flash. Dark mode adapts backgrounds, panels, text, borders, and forms. Navigation and footer logos have no background in either theme. The navigation text changes from dark to light while its capital E stays blue; the footer uses v3’s text wordmark with a blue E. The join modal uses the transparent vector owl with no background, border, or shadow. The favicon uses the same transparent vector owl (`app/icon.svg`).

## Preserved behavior and assets

The marketplace previews intentionally remain blurred and faded. Their wrappers use `inert`, `aria-hidden` and disabled pointer interaction, so keyboard navigation cannot enter the previews. The six compact professional records rotate every five seconds while visible, and respect reduced motion. This public homepage does not enable v3’s account, hiring, payment or profile routes. The retained demo components and email handler are separate from the public preview.

Satoshi is used for body text and headings. Its regular and italic variable fonts and license are bundled in `app/fonts/` and loaded with `next/font/local`; neither rendering nor builds request an external font provider. The navigation displays rEcruit as text with a blue E, and the v3 footer uses the same text wordmark. The founder card uses the suited owl from the approved HTML. Contact links match the supplied HTML, including X, Telegram, and email.

Dialogs support initial focus, focus trapping, Escape, backdrop dismissal, scroll locking, and returning focus to the trigger.

## Waitlist submissions

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

## Where the blur is applied

The `.product-faded` rule in `app/globals.css` uses:

```css
.product-faded {
  filter: blur(3px);
  opacity: 0.34;
  pointer-events: none;
  user-select: none;
  transition: opacity 0.25s;
}
```

`components/home.tsx` applies it separately to the search, record carousel, expertise section, reputation explanation and closing expertise invitation. Those wrappers also use `inert` and `aria-hidden`. The headline, roadmap, team, whitepaper and public contact links remain readable. Changing only `filter` does not enable interactions. The navbar’s separate `backdrop-filter: blur(16px)` blurs the background behind the navigation bar.

## Checks

```sh
npm run typecheck
npm run lint
npm run build
npm run test:e2e
```

If this environment prevents Turbopack from binding its worker port, use `npm run build -- --webpack`.

Browser tests start the production server and require a completed build and Google Chrome installed. Homepage tests cover the retained headline, roadmap and founder, all five blur gates and the v3 footer, keyboard exclusion, disabled waitlist buttons, public links, local font loading, record rotation and reduced motion at widths from 320px to 1440px. Theme tests cover light/dark rendering, system preferences and saved choices. The existing API and email tests mock Resend and do not send live emails.

Tests use their own server on port 3107. Screenshots and failure traces are written to the ignored `test-results/` directory. Type checking during builds uses the same compiler API setting as v3 because this environment does not capture TypeScript CLI subprocess output reliably.
