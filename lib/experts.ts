export interface WorkProof {
  name: string;
  role: string;
  text: string;
}

export interface Refute extends WorkProof {
  impact: number;
}

export interface Expert {
  id: number;
  name: string;
  role: string;
  city: string;
  score: number;
  verified: boolean;
  jobs: number;
  rate: number;
  tags: string[];
  bio: string;
  vouches: number;
  vouchesList: WorkProof[];
  refutes: Refute[];
  reviews: [string, string][];
}

// Original sample profiles, preserved verbatim from the supplied HTML.
export const initialExperts: Expert[] = [
  {
    id: 1,
    name: "Nova",
    role: "Brand & Product Designer",
    city: "Remote",
    score: 98,
    verified: true,
    jobs: 47,
    rate: 35,
    tags: ["UI/UX", "Branding", "Figma"],
    bio: "I turn rough product ideas into clear, polished interfaces and brand systems.",
    vouches: 18,
    vouchesList: [
      {
        name: "Echo",
        role: "Past Product Lead",
        text: "Nova designed our full product system and delivered the final Figma files on schedule.",
      },
      {
        name: "Luna",
        role: "Past Founder",
        text: "I hired Nova for our brand refresh. The work shown here is genuinely hers.",
      },
    ],
    refutes: [
      {
        name: "Cipher",
        role: "Past Client",
        text: "The claim that Nova led a 20-person design team on this project is not accurate; she was the sole designer.",
        impact: 3,
      },
    ],
    reviews: [
      ["Echo", "Excellent work. Delivered early and understood the brief."],
      ["Luna", "Very easy to work with and highly professional."],
    ],
  },
  {
    id: 2,
    name: "Vortex",
    role: "Solana Developer",
    city: "Remote",
    score: 96,
    verified: true,
    jobs: 31,
    rate: 55,
    tags: ["Solana", "Rust", "Web3"],
    bio: "Full-stack Solana developer focused on practical, secure crypto products.",
    vouches: 14,
    vouchesList: [
      {
        name: "Cipher",
        role: "Past Product Lead",
        text: "Vortex built the Solana integration and handled the deployment without missing the deadline.",
      },
      {
        name: "Drift",
        role: "Past Founder",
        text: "The on-chain work was completed by Vortex and the code was delivered as promised.",
      },
    ],
    refutes: [
      {
        name: "Pulse",
        role: "Past Client",
        text: "Vortex contributed to the protocol work but did not lead the entire engineering team as claimed.",
        impact: 2,
      },
    ],
    reviews: [
      ["Cipher", "Strong technical work and great communication."],
      ["Drift", "Helped us ship our MVP quickly."],
    ],
  },
  {
    id: 3,
    name: "Aurora",
    role: "Growth & Community Strategist",
    city: "Remote",
    score: 94,
    verified: true,
    jobs: 62,
    rate: 28,
    tags: ["Growth", "Telegram", "X"],
    bio: "I build communities and growth systems for startups and online products.",
    vouches: 27,
    vouchesList: [
      {
        name: "Pulse",
        role: "Past Community Lead",
        text: "Aurora built our community playbook and helped the team execute it consistently.",
      },
      {
        name: "Orbit",
        role: "Past Founder",
        text: "She ran the growth campaign directly and delivered the reporting we agreed on.",
      },
    ],
    refutes: [
      {
        name: "Sage",
        role: "Past Client",
        text: "Aurora supported our growth campaign but did not independently manage the full marketing budget.",
        impact: 2,
      },
    ],
    reviews: [
      ["Pulse", "Our community grew steadily after her strategy."],
      ["Orbit", "Excellent campaign planning."],
    ],
  },
  {
    id: 4,
    name: "Forge",
    role: "Copywriter & Content Lead",
    city: "Remote",
    score: 91,
    verified: true,
    jobs: 38,
    rate: 22,
    tags: ["Copywriting", "SEO", "Content"],
    bio: "Clear, conversion-focused writing for websites, products and campaigns.",
    vouches: 11,
    vouchesList: [
      {
        name: "Sage",
        role: "Past Founder",
        text: "Forge wrote the landing-page copy and delivered every revision we requested.",
      },
      {
        name: "Echo",
        role: "Past Marketing Lead",
        text: "The content strategy and articles credited to Forge were genuinely produced for our project.",
      },
    ],
    refutes: [
      {
        name: "Luna",
        role: "Past Client",
        text: "Forge wrote the core website copy but did not lead our entire content department.",
        impact: 2,
      },
    ],
    reviews: [["Sage", "The landing-page copy was exactly what we needed."]],
  },
  {
    id: 5,
    name: "Nexus",
    role: "No-code Automation Expert",
    city: "Remote",
    score: 89,
    verified: false,
    jobs: 24,
    rate: 25,
    tags: ["Automation", "Zapier", "Notion"],
    bio: "I connect tools and automate repetitive business workflows.",
    vouches: 7,
    vouchesList: [
      {
        name: "Vector",
        role: "Past Operations Lead",
        text: "Nexus automated our onboarding workflow and documented the setup clearly.",
      },
      {
        name: "Drift",
        role: "Past Client",
        text: "The automations Nexus built saved our team hours every week.",
      },
    ],
    refutes: [
      {
        name: "Orbit",
        role: "Past Client",
        text: "Nexus automated several workflows but did not build the entire operations system as claimed.",
        impact: 2,
      },
    ],
    reviews: [["Vector", "Saved our team hours every week."]],
  },
  {
    id: 6,
    name: "Pixel",
    role: "Data Analyst",
    city: "Remote",
    score: 87,
    verified: true,
    jobs: 19,
    rate: 30,
    tags: ["Excel", "SQL", "Analytics"],
    bio: "I turn messy business data into simple dashboards and useful decisions.",
    vouches: 9,
    vouchesList: [
      {
        name: "Orbit",
        role: "Past Client",
        text: "Pixel built the analytics dashboard we used for our weekly reporting.",
      },
      {
        name: "Cipher",
        role: "Past Product Lead",
        text: "Pixel cleaned the reporting data and explained the findings clearly to the team.",
      },
    ],
    refutes: [
      {
        name: "Sable",
        role: "Past Client",
        text: "Pixel handled the dashboard work but did not manage our entire data team as claimed.",
        impact: 2,
      },
    ],
    reviews: [["Orbit", "Great analysis and very clear reporting."]],
  },
];

export const skills = [
  "All",
  ...new Set(initialExperts.flatMap((expert) => expert.tags)),
];
