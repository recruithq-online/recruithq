import { SearchPathways } from "./search-pathways";
import { WaitlistTrigger } from "./waitlist-trigger";

export function Hero() {
  return (
    <section className="hero" id="top">
      <div className="wrap">
        <div className="eyebrow">
          MARKETPLACE FOR REPUTATION-BASED EXPERTISE
        </div>
        <h1>Hire people for what they can actually do.</h1>
        <p>
         Find reputable experts using work history and reviews from past hirers — not just a CV.
        </p>
        <SearchPathways />
        <section className="coming-soon" aria-label="Coming soon">
          <span className="pill">Early access</span>
          <h2>Coming Soon.</h2>
          <p>
            We’re building a better way to discover expertise through reputation
            and proof of work. Join the waitlist to be part of what’s next.
          </p>
          <div className="coming-soon-actions">
            <WaitlistTrigger>
              Join rEcruit Waitlist <span aria-hidden="true">→</span>
            </WaitlistTrigger>
            <div className="whitepaper-actions" id="whitepaper">
              {/* Replace this placeholder with your public Notion whitepaper URL. */}
              <a
                className="whitepaper-cta"
                href="https://recruithq.notion.site/rEcruit-Whitepaper-v1-0-4d352d5b58ed82d2ab9c01468d2e5e6c"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Read whitepaper (opens in a new tab)"
              >
                Read whitepaper <span aria-hidden="true">↗</span>
              </a>
              {/* <a
                className="whitepaper-download"
                href="/rEcruit-Whitepaper-v1.pdf"
                download="rEcruit-Whitepaper-v1.pdf"
              >
                Download PDF <span aria-hidden="true">↓</span>
              </a> */}
            </div>
          </div>
          <div className="waitlist-note">
            For experts who want to be among the first to join rEcruit.
          </div>
        </section>
      </div>
    </section>
  );
}
