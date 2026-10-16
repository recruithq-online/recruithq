import { Brand } from "./brand";
import { WaitlistTrigger } from "./waitlist-trigger";
import { team } from "@/lib/team";
import { TeamCarousel } from "./team-carousel";
import { ThemeToggle } from "./theme-toggle";
import { OwlAvatar } from "./owl-avatar";

export function Navbar() {
  return (
    <nav
      className="nav sticky top-0 z-20 flex items-center justify-between"
      aria-label="Main navigation"
    >
      <Brand />
      <div className="navlinks">
        <a href="#team">Team</a>
        <a href="#contact">Contact</a>
      </div>
      <div className="nav-actions flex items-center gap-2">
        <ThemeToggle />
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
            <p>{member.role} · {member.bio}</p>
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
              <WaitlistTrigger className="footer-waitlist">
                Join rEcruit Waitlist
              </WaitlistTrigger>
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
              <a href="mailto:hello@recruithq.online" aria-label="company mail">
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
