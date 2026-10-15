import { Brand } from "./brand";
import { WaitlistTrigger } from "./waitlist-trigger";
import Image from "next/image";
import { team } from "@/lib/team";
import { TeamCarousel } from "./team-carousel";

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
        <WaitlistTrigger>Join waitlist</WaitlistTrigger>
      </div>
      <WaitlistTrigger>Join waitlist</WaitlistTrigger>
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
            <Image
              className="person-image"
              src={member.image}
              alt={member.imageAlt}
              width={640}
              height={720}
              sizes="(max-width: 560px) 77vw, (max-width: 1000px) 44vw, 25vw"
            />
            <div className="person-details">
              <h3>{member.name}</h3>
              <div className="person-role">{member.role}</div>
              <p>{member.bio}</p>
            </div>
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
            <Brand />
            <p>Marketplace for reputation-based expertise.</p>
          </div>
          <div>
            <h3>Explore</h3>
            <a href="#top">Overview</a>
            <a href="#team">Team</a>
            <WaitlistTrigger className="footer-waitlist">
              Join the waitlist
            </WaitlistTrigger>
          </div>
          <div className="social">
            <h3>Contact</h3>
            <p>Follow rEcruithq or get in touch with the team.</p>
            <div className="social-row flex gap-2.5 items-center mt-[18px]">
              <a
                href="https://x.com/the_rEcruithHQ"
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
            </div>
          </div>
        </div>
        <div className="copy">
          © 2026 rEcruithq. Building a marketplace where reputation and proof of
          work matter.
        </div>
      </div>
    </footer>
  );
}
