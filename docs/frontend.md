# Frontend development

The UI uses Tailwind CSS 4. DM Sans is loaded from `app/fonts/dm-sans.ttf` with `next/font/local`; its OFL license is kept beside it. Page layout and responsive styles live beside the JSX. Shared UI defaults live in `components/ui`; product-specific screens live in `components/marketplace`.

## Where to change a design choice

| Change                                   | File                                 |
| ---------------------------------------- | ------------------------------------ |
| Every card's corner radius               | `app/globals.css`: `--radius-card`   |
| Card border colour in each theme         | `app/globals.css`: `--card-border`   |
| Card padding, border and hover behaviour | `components/ui/card.tsx`             |
| Button variants and sizes                | `components/ui/button.tsx`           |
| Inputs, selects and textareas            | `components/ui/input.tsx`            |
| Content width and page gutters           | `components/ui/container.tsx`        |
| Animation timing and keyframes           | `app/motion.css`                     |
| A particular page's layout               | Its file in `components/marketplace` |

Only white, black and blue are used. Transparent versions of these colours provide borders and lighting. Dark mode uses the same tokens and the `dark:` variant.

The interface has no box or text shadows. Body text and form controls use `text-base` (16px), secondary text uses `text-sm` (14px), and short metadata uses `text-xs` (12px). Avoid smaller arbitrary sizes or mobile overrides that shrink text. Navigation switches to its menu below 900px.

## Cards and local overrides

```tsx
import { Card } from "@/components/ui/card";

<Card as="article" interactive className="p-5">
  <h2>Professional record</h2>
</Card>;
```

`Card` supplies `rounded-card`, a subtle `border-border`, and the surface colour. Change `--radius-card` once to update every card. A local override is a normal Tailwind class:

```tsx
<Card className="rounded-2xl border-brand/30" />
```

`cn()` combines `clsx` and `tailwind-merge`. A caller's utility overrides conflicting defaults predictably. Avoid adding global CSS selectors to change one screen.

## Buttons and links

```tsx
import Link from "next/link";
import { Button, buttonStyles } from "@/components/ui/button";

<Button variant="secondary" size="small">Save</Button>
<Link href="/marketplace/explore" className={buttonStyles()}>
  Explore expertise
</Link>
```

Use a button for an action and a link for navigation. Both share the same visual recipe. The controls accept native HTML props; inputs also accept React 19 refs.

## Product modules

- `home.tsx` introduces the marketplace; `professional-record.tsx` renders its featured record.
- `explore.tsx`, `expert-card.tsx`, `expert-profile.tsx` and `create-profile.tsx` handle discovery and professional profiles.
- `hiring.tsx`, `opportunity-card.tsx`, `fee-breakdown.tsx` and `work.tsx` handle hiring and delivery.
- `messages.tsx`, `reputation.tsx` and `settings.tsx` contain their respective workspace screens.
- `provider.tsx` holds the existing browser-local marketplace state and actions. Account gates, hiring-route controls and dialog forms have separate files.
- `chrome.tsx`, `shell.tsx` and `footer.tsx` provide navigation and page framing.
- `lib/marketplace.ts` contains the domain types, seed data, validation and fee calculations.

The obsolete landing-page modules and their stylesheet have been removed. The retained waitlist API, email templates and static assets are separate from the live marketplace UI.

## Motion and tests

Tailwind's `motion-safe:` utilities enable entrance animations. `data-reveal` marks content for the scroll-reveal hook. Reduced-motion changes cancel running scroll animations as well as CSS animations.

Browser tests use roles, labels and `data-testid` attributes. Styling classes are not test selectors, so changing a radius or layout utility does not break the tests.

```sh
npm run format
npm run format:check
npm run typecheck
npm run lint
npm run build -- --webpack
npm run test:e2e
```

See the README for sample accounts and the frontend's persistence and simulation limits.
