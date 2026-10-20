const phases = [
  {
    title: "Foundation",
    status: "Achieved",
    state: "achieved",
    timing: null,
    priorities: [
      "Establish the public website and community",
      "Develop the product’s core positioning and user experience",
      "Gather feedback from potential users and professionals",
    ],
  },
  {
    title: "Core Marketplace",
    status: "In progress",
    state: "current",
    timing: "Q1 2027",
    priorities: [
      "Develop professional profiles",
      "Build expertise discovery and search",
      "Introduce the core Vouch and Refute concepts",
      "Improve the presentation of professional reputation information",
    ],
  },
  {
    title: "Reputation Development",
    status: "Upcoming",
    state: "upcoming",
    timing: "Q2 2027",
    priorities: [
      "Refine reputation evaluation",
      "Improve safeguards against manipulation and abuse",
      "Develop clearer approaches to evidence, disputes, and credibility",
    ],
  },
  {
    title: "Marketplace Growth",
    status: "Upcoming",
    state: "upcoming",
    timing: "H2 2027",
    priorities: [
      "Improve connections between expertise and hiring opportunities",
      "Expand functionality based on user feedback",
      "Explore additional tools that support professional reputation and marketplace participation",
    ],
  },
];

export function Roadmap() {
  return (
    <section className="wrap roadmap" id="roadmap" aria-labelledby="roadmap-title">
      <div className="roadmap-heading section-head">
        <h2 id="roadmap-title">Product Roadmap</h2>
        <p className="roadmap-update">Status update | October 2026</p>
      </div>
      <p className="roadmap-intro">
        <strong>Phase 1 achieved. Phase 2 in progress.</strong>{" "}
        Intended priorities, not guaranteed release dates.
      </p>
      <ol className="roadmap-phases">
        {phases.map((phase, index) => (
          <li className={`roadmap-phase roadmap-${phase.state}`} key={phase.title}>
            <span className="roadmap-marker" aria-hidden="true">
              {phase.state === "achieved" ? "✓" : index + 1}
            </span>
            <article className="roadmap-card">
              <div className="roadmap-meta">
                <span className="roadmap-phase-label">Phase {index + 1}</span>
                <span className="roadmap-status">{phase.status}</span>
                {phase.timing && <span className="roadmap-timing">{phase.timing}</span>}
              </div>
              <h3>{phase.title}</h3>
              <ul>
                {phase.priorities.map((priority) => <li key={priority}>{priority}</li>)}
              </ul>
            </article>
          </li>
        ))}
      </ol>
      <p className="roadmap-tagline">Beyond CVs. Built on Reputation.</p>
    </section>
  );
}
