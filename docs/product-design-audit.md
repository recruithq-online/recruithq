# rEcruit product and design audit

Audited 3 November 2026 before implementation.

## Application map

Next.js 16 App Router, React 19, strict TypeScript, Tailwind 4, custom CSS, and Playwright. No component or icon package. `app/layout.tsx` provides the theme bootstrap, marketplace context, navigation and footer. `MarketplaceView` dispatches the catch-all route. `ui.tsx` supplies forms, cards, headings and signals; `Modal` supplies focus management and scroll locking.

| Route                      | Purpose                                                 |
| -------------------------- | ------------------------------------------------------- |
| `/`                        | Discovery entry and explanation of the reputation model |
| `/marketplace/explore`     | Search, filter and compare professionals                |
| `/marketplace/profile/:id` | Evaluate expertise, feedback and hiring fit             |
| `/marketplace/list`        | Create an alias-based expertise profile                 |
| `/marketplace/hire`        | Compare hiring arrangements and post an opportunity     |
| `/marketplace/work`        | Applications, acceptance, delivery and completion       |
| `/marketplace/messages`    | Local conversations and scope discussions               |
| `/marketplace/reputation`  | Demonstration of evidence review                        |
| `/marketplace/settings`    | Account, notification and sample wallet preferences     |
| `/marketplace/about`       | Product philosophy and process                          |
| `/early-access`            | Redirect to the homepage                                |
| `/api/waitlist`            | Retained server email endpoint; no live UI entry        |

The old hero, expert directory, experience provider, waitlist forms and roadmap are disconnected from the live route tree. The original global stylesheet styles those components. The current marketplace has a separate stylesheet with repeated overrides. The team component exists but is commented out in the layout. Local sample data and fee calculations live in `lib/marketplace.ts`; the legacy dataset is in `lib/experts.ts`.

## Findings and response

1. Homepage repeats its proposition in equally weighted cards. Establish one hiring-first action, a direct search, and a quieter path for professionals.
2. Scores appear definitive without context. Place vouches, refutes and completed projects alongside scores; explain sample verification and review rules.
3. Refutes are omitted from discovery, despite being central to accountable reputation. Make them visible before profile selection.
4. Workspace destinations are hidden in the authenticated footer. Add persistent context-aware workspace navigation and a reachable signed-out entry.
5. Discovery only supports category, text and price order. Add availability, verification, reputation threshold, rate ceiling and saved professionals, with URL-backed state.
6. Inconsistent language and broken strings undermine trust. Repair copy, distinguish public product language from prototype status, and label simulations at relevant actions.
7. Generic tinted cards and heavy rounding flatten hierarchy. Use white and black surfaces, a blue identity, spacing, soft shadows, restrained corners, editorial type and distinct evidence surfaces.
8. Existing tests include references to a missing `index-6.html`, removed Team content and inaccessible signed-out links. Replace obsolete visual assertions and retain meaningful hiring, validation and accessibility coverage.

## Design contract

Use DM Sans for interface text, Georgia italic sparingly for the reputation proposition, and system monospace for record labels. Shared tokens govern white and black surfaces, a single blue accent, shadows and readable text in both themes. Vouches and refutes retain distinct icons and labels within this palette. Main content is capped at 1200px; spacing uses 4/8px increments. Controls have visible keyboard focus, at least 40px targets, explicit labels and reduced-motion support. Mobile navigation must expose the same destinations.

## Technical boundary

This is a frontend product transformation. Existing accounts, profiles, opportunities, reviews and conversations remain tab-local demonstrations; payment processing and evidence uploads are simulated. No live authentication, payment, upload or marketplace API is introduced. Saved sample profiles may persist on the device; credentials are never persisted. The retained waitlist endpoint is untouched. Production visual quality does not imply production backend readiness.

## Cinematic motion refinement

The opening sequence reveals the headline line by line, then introduces supporting copy and the professional record. A single light sweep adds depth to the record stage. Marketing sections reveal as they enter the viewport; content remains visible before JavaScript and outside the viewport. A black evidence section creates a deliberate change in tone and contrast.

Navigation uses a translucent surface, active destination pills, a soft persistent shadow, and increased shadow depth after scrolling. Links, cards, dialogs and mobile menus have short interaction transitions. Interactive content never floats continuously. CSS and JavaScript animations follow reduced-motion preferences, including preference changes during a visit. No animation library or background video is required.

## Final verification

Production webpack build, standalone TypeScript checking, ESLint, and whitespace checks pass. All 51 Playwright checks were verified across continuation batches against the same production build. Coverage includes 320–1440px layouts, URL filters and saved experts, both hiring lifecycles, messages, evidence review, authentication dialogs, keyboard focus, themes, cinematic motion and reduced-motion changes. Modal geometry is measured after its entrance animation settles. Email tests mock delivery.

Desktop, scrolled navigation and mobile-menu captures were visually reviewed; no browser runtime errors were reported. Preview images are retained in the ignored `test-results/cinematic-*.png` files. Accounts, work records and payments retain the prototype limitations described above.

## Palette and surface refinement

The latest design direction uses white, black and a single accessible blue (`#3467ff`). Light surfaces are pure white; dark surfaces are pure black. Avatars, vouches, refutes, notifications and the evidence section follow the same palette. Black and blue transparency is used for shadows and lighting.

Cards and panels have no outer borders. Internal record dividers, section rules, footer rules, sidebar rules and skill-tag outlines have been removed. Spacing and soft shadows establish hierarchy. Blue keyboard focus rings and the active category underline remain as functional navigation cues. Cinematic entrance and scroll motion are preserved.

## Readability and flat-surface update

The current direction replaces the shadow recommendations above: cards, buttons, inputs, navigation, menus, dialogs and notifications have no shadows, including on hover and scroll in either theme. Subtle borders, spacing and the existing blue accent establish hierarchy. Body and form text are 16px, secondary text 14px, and short metadata at least 12px. Navigation uses a menu below 900px so larger text fits without compressing controls. The header no longer needs a scroll listener for presentation.
