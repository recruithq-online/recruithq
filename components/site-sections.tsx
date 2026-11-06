import { Brand } from "./brand";
import { WaitlistTrigger } from "./waitlist-trigger";
import { team } from "@/lib/team";
import { TeamCarousel } from "./team-carousel";
import { OwlAvatar } from "./owl-avatar";

export function Navbar() {
  return (
    <nav
      className="nav sticky top-0 z-20 flex items-center justify-between"
      aria-label="Main navigation"
    >
      <Brand />
      <div className="navlinks">
        <a href="#roadmap">Roadmap</a>
        <a href="#whitepaper">Whitepaper</a>
        <a href="#team">Team</a>
        <a href="#contact">Contact</a>
      </div>
      <div className="nav-actions flex items-center gap-2">
        <WaitlistTrigger>Join rEcruit Waitlist</WaitlistTrigger>
      </div>
    </nav>
  );
}

export function Team() {
  return (
    <section className="wrap" id="team">
      <div className="section-head">
        <h2>Team</h2>
      </div>
      <TeamCarousel>
        {team.map((member) => (
          <article className="person" key={member.id}>
            <OwlAvatar name={member.name} />
            <h3>{member.name}</h3>
            <p>{member.role} {member.bio}</p>
          </article>
        ))}
      </TeamCarousel>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="footer" id="contact">
      <div className="wrap">
        <div className="footer-grid">
          <div>
            <Brand variant="owl" />
            <p>Marketplace for reputation-based expertise.</p>
          </div>
          <div className="footer-column">
            <h3>Explore</h3>
            <div className="footer-links flex flex-col gap-2">
              <a href="#top">Overview</a>
              <a href="#team">Team</a>
              <a href="#">Waitlist Coming Soon</a>
              {/* <WaitlistTrigger className="footer-waitlist">
                rEcruit Waitlist coming soon
              </WaitlistTrigger> */}
            </div>
          </div>
           <div className="footer-column">
            <h3>Resources</h3>
            <div className="footer-links flex flex-col gap-2">
              <a href="#roadmap">Roadmap</a>
              <a href="#whitepaper">Whitepaper</a>
            </div>
          </div>
          <div className="social footer-column">
            <h3>Contact</h3>
            <p>Follow rEcruit or get in touch with the team.</p>
            <div className="social-row flex gap-2.5 items-center mt-2">
              <a
                href="https://x.com/the_rEcruitHQ"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="X"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M18.9 2H22l-6.77 7.74L23.2 22h-6.26l-4.9-6.41L6.44 22H3.33l7.24-8.28L2.8 2h6.42l4.43 5.86L18.9 2Zm-1.1 17.92h1.73L8.28 3.98H6.42L17.8 19.92Z" />
                </svg>
              </a>
              <a
                href="https://t.me/rEcruitHQ"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Telegram"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M21.4 3.1 2.98 10.2c-1.26.5-1.25 1.2-.23 1.5l4.7 1.47 1.8 5.55c.22.62.11.87.75.87.5 0 .72-.23 1-.5l2.4-2.33 4.98 3.67c.92.51 1.58.25 1.81-.85l3.16-14.88c.34-1.36-.52-1.98-1.65-1.6ZM8.18 12.82l10.92-6.89c.54-.33 1.04-.15.63.2l-8.82 7.97-.34 3.62-1.39-4.9-1-.31Z" />
                </svg>
              </a>
            <a
  href="https://www.linkedin.com/company/therecruithq"
  target="_blank"
  rel="noopener noreferrer"
  aria-label="LinkedIn profile"
>
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.35V9h3.414v1.561h.049c.476-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286ZM5.337 7.433a2.062 2.062 0 1 1 0-4.124 2.062 2.062 0 0 1 0 4.124ZM7.119 20.452H3.554V9h3.565v11.452ZM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003Z" />
  </svg>
</a>
<a href="mailto:support@recruithq.online" aria-label="company mail">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  aria-hidden="true"
                >
                  <rect x="3" y="5" width="18" height="14" rx="2" />
                  <path d="m4 7 8 6 8-6" />
                </svg>
              </a>
            </div>
          </div>
        </div>
        <div className="copy">
          © 2026 rEcruit. Building a marketplace where reputation and proof of
          work matter.
        </div>
      </div>
    </footer>
  );
}
