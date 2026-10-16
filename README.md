# rEcruit

Conversion of `recruithq-site-4-6.html` to Next.js App Router, TypeScript, React, and Tailwind CSS 4.

## Run

Requires Node.js 20.9 or newer.

```sh
npm install
npm run dev
```

Open http://localhost:3000. For production, run `npm run build` then `npm start`.

## Structure

- `app/`: route, root layout, metadata, design tokens, and global styles.
- `components/`: navigation, hero, directory, cards, profiles, forms, dialog, and footer.
- `components/experience-provider.tsx`: shared search, demo profile state, dialog, and toast state. Static sections remain Server Components.
- `lib/experts.ts`: typed original expert profiles and filter options.
- `lib/team.ts`: the founder profile and complete bio from the approved HTML.
- `components/team-carousel.tsx`: reusable team container; controls are hidden for the single founder in this design.
- `app/logo.jpeg` and `app/owl.jpeg`: supplied official images, rendered with Next.js Image without cropping or recoloring.
- `components/owl-avatar.tsx`: founder’s owl in a suit and blue tie, using the approved HTML’s vector artwork.
- `app/icon.jpeg`: supplied owl used as the favicon.
- `components/theme-toggle.tsx`: light/dark switch with system preference detection and a saved browser preference.
- `app/api/waitlist/route.ts`: server-side Resend email delivery for waitlist submissions.
- `lib/waitlist.ts`: expertise options shared by the form and server validation.
- `lib/waitlist-email.ts`: responsive branded HTML email and its plain-text fallback.
- `.env.example`: required server-side email settings.
- `tests/site.spec.ts`: source layout comparisons and browser interaction checks.

Tailwind utilities cover layouts, spacing, typography, and reusable component styles through `@apply`. Light mode matches the latest HTML's plain white backgrounds, blue accents, DM Sans body text, and Space Grotesk headings. It preserves the source section order, typography, spacing, breakpoints, transitions, and teaser blur. The explicit client overrides are “Join rEcruit Waitlist” on waitlist buttons and “Select an expertise” in the form. Tailwind Preflight is omitted to preserve native form defaults.

The theme defaults to the visitor's system preference. The navigation toggle saves the selection in local storage, and a small initialization script applies it before rendering to avoid a theme flash. Dark mode adapts backgrounds, panels, text, borders, and forms; the supplied JPEGs retain their original white backgrounds and colors.

## Preserved behavior and assets

The marketplace preview intentionally remains blurred with pointer interactions disabled, as in the supplied HTML. Its search, skill filters, expert dialogs, vouches, refute acknowledgements, hire acknowledgement, and expertise preview still have React implementations. Those demo actions remain browser-local and do not create real hires, publish profiles, or persist reputation changes.

Fonts use the exact Google Fonts request from the HTML. Loading them requires an internet connection; builds do not fetch fonts. The supplied logo appears in the navigation and footer, and the owl appears in the waitlist dialog and favicon. The founder card uses the suited owl from the approved HTML. Contact links match the supplied HTML, including X, Telegram, and email.

Dialogs support initial focus, focus trapping, Escape, backdrop dismissal, scroll locking, and returning focus to the trigger.

## Waitlist submissions

The form posts to `/api/waitlist`. The server validates the submission and calls the [Resend Email API](https://resend.com/docs/api-reference/emails/send-email) to email the public alias, email address, and expertise to your admin inbox. The notification's Reply-To is the submitter's email address. The recipient and sender come exclusively from server configuration.

Admin notifications include a responsive HTML design with blue accents, white surfaces, and dark text: a brand header, separate labelled signup details, and a reply button. They also include a plain-text fallback. Submitted content is escaped before insertion into HTML. Running the browser tests writes a sample to `test-results/waitlist-email-preview.html` and screenshots at 320px, 390px, and 800px; the sample uses fictional details and sends no email.

Copy `.env.example` to `.env.local` and configure:

```dotenv
RESEND_API_KEY=re_your_api_key
RESEND_FROM_EMAIL="rEcruit <onboarding@resend.dev>"
ADMIN_EMAIL=movicunique01@gmail.com
```

The current local `.env.local` uses the Resend test sender and your admin inbox:

```dotenv
RESEND_FROM_EMAIL="rEcruit <onboarding@resend.dev>"
ADMIN_EMAIL=movicunique01@gmail.com
```

Add your `RESEND_API_KEY` to that file. Before you have a domain, Resend's test sender can send only to the email address registered on your Resend account, so the account email must be `movicunique01@gmail.com` for this configuration to work. See [Resend's testing restriction](https://resend.com/docs/api-reference/errors). `re.com` alone is not an email address and cannot be used as the sender.

For production sending to other recipients, use a sending address on a [verified Resend domain](https://resend.com/docs/send-with-nextjs). Set the same three environment variables in your deployment host and restart/redeploy after changes. These variables stay on the server; never prefix them with `NEXT_PUBLIC_`. The application requires a host that runs Next.js route handlers rather than a static-only export.

The form only shows success after the API returns an accepted Resend email ID; a generic HTTP 200 response is not enough. Missing configuration, provider rejection, network errors, and blocked honeypot submissions show the retry state. Resend acceptance does not guarantee inbox delivery. This emails notifications rather than storing a separate waitlist database. No live emails are sent by the automated tests: the Resend API and browser submission responses are mocked. Verify real delivery after configuring your own Resend account.

If a submission does not arrive, check the terminal running Next.js for `[waitlist]` messages. They distinguish missing settings, blocked spam-trap submissions, provider rejection, and network failures without logging the API key or submitted personal information. Successful sends log an email ID that can be checked in the Resend dashboard. Restart `npm run dev` after changing environment settings, then refresh the browser. In Gmail, also check Spam and All Mail for messages from `onboarding@resend.dev`.

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

`components/search-pathways.tsx` applies it to the search/pathway area. `components/expert-directory.tsx` applies it to the expert directory. Remove `product-faded` from both elements to show those areas clearly and enable clicks. Changing only `filter` leaves the fade and disabled pointer interactions in place. The navbar's separate `backdrop-filter: blur(16px)` blurs the background behind the navigation bar.

## Checks

```sh
npm run typecheck
npm run lint
npm run build
npm run test:e2e
```

If this environment prevents Turbopack from binding its worker port, use `npm run build -- --webpack`.

Browser tests start the production server and require a completed build and Google Chrome installed. They compare the original and converted page at 1440px, 768px, and 390px, checking section geometry, typography, exact copy (with the client overrides), overflow, cards, and dialogs. Theme tests cover light/dark rendering at 320px, 390px, 768px, and 1440px, system preferences, and persistence after reload. They also exercise waitlist validation/retry/success, focus trapping, search, filters, vouch updates, refute notices, hire acknowledgements, and safe profile previews. Server tests verify the exact Resend request, fixed admin recipient, validation, honeypot, missing configuration, and provider/network failures. The demo tests temporarily remove the pointer gate only in the browser test, leaving the shipped coming-soon design intact.

Source comparison tests require `recruithq-site-4-6.html` at the project root; they are explicitly skipped if that reference is absent. Responsive rendering, form, and email-handler tests still run. Tests use their own server on port 3107 to avoid reusing a running development server. Screenshots and failure traces are written to the ignored `test-results/` directory.
