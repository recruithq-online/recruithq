export type Role = "hirer" | "worker";
export type HiringRoute = "Hiring for company" | "Hiring for myself";
export interface MarketplaceAccount {
  email: string;
  password: string;
  alias: string;
  role: Role;
}
export interface Feedback {
  type: "vouch" | "refute";
  by: string;
  text: string;
}
export interface MarketplaceExpert {
  id: number;
  alias: string;
  category: string;
  headline: string;
  skills: string[];
  rate: number;
  availability: string;
  score: number;
  vouches: number;
  refutes: number;
  projects: number;
  verified: boolean;
  about: string;
  portfolio?: string;
  feedback: Feedback[];
}
export interface Opportunity {
  id: number;
  type: HiringRoute;
  title: string;
  description: string;
  budget: number;
  duration: string;
  by: string;
  status: "Open" | "In progress" | "Delivered" | "Completed";
  applicants: string[];
  worker?: string;
  delivery?: string;
}
export interface Submission extends Feedback {
  id: number;
  expertId: number;
  files: string[];
  status: "Pending Review" | "Approved" | "Rejected";
}
export interface Conversation {
  id: number;
  topic: string;
  route?: HiringRoute;
  jobId?: number;
  parts: string[];
  items: {
    by: string;
    text: string;
    time: string;
  }[];
}
export interface Wallet {
  network: string;
  address: string;
}
export const accounts: MarketplaceAccount[] = [{
  email: "hirer@recruit.test",
  password: "Test1234!",
  alias: "TestHirer",
  role: "hirer"
}, {
  email: "worker@recruit.test",
  password: "Test1234!",
  alias: "TestWorker",
  role: "worker"
}];
export const categories = ["Design", "Development", "Marketing", "Writing", "Operations", "Community"];
export const availabilityOptions = ["Available for projects", "Limited availability", "Not available right now"];
export const hiringRoutes: HiringRoute[] = ["Hiring for company", "Hiring for myself"];
export const initialMarketplaceExperts: MarketplaceExpert[] = [{
  id: 1,
  alias: "Nova",
  category: "Design",
  headline: "Brand & Product Designer",
  skills: ["UI/UX", "Branding", "Figma"],
  rate: 35,
  availability: "Available for projects",
  score: 98,
  vouches: 18,
  refutes: 1,
  projects: 47,
  verified: true,
  about: "I help founders and teams turn complex product ideas into clear, usable brands and interfaces.",
  feedback: [{
    type: "vouch",
    by: "Past hirer",
    text: "Nova designed our full product system and delivered the final Figma files on schedule."
  }, {
    type: "refute",
    by: "Past collaborator",
    text: "The claim that Nova led a 20-person design team on this project is not accurate; she was the sole designer."
  }]
}, {
  id: 2,
  alias: "Vortex",
  category: "Development",
  headline: "Solana Developer",
  skills: ["Solana", "Rust", "Web3"],
  rate: 55,
  availability: "Limited availability",
  score: 96,
  vouches: 14,
  refutes: 1,
  projects: 31,
  verified: true,
  about: "I build and deploy on-chain products with a focus on reliable delivery.",
  feedback: [{
    type: "vouch",
    by: "Past hirer",
    text: "Vortex built the Solana integration and handled the deployment without missing the deadline."
  }, {
    type: "refute",
    by: "Past collaborator",
    text: "Vortex contributed to the protocol work but did not lead the entire engineering team as claimed."
  }]
}, {
  id: 3,
  alias: "Aurora",
  category: "Community",
  headline: "Growth & Community Strategist",
  skills: ["Growth", "Telegram", "X"],
  rate: 28,
  availability: "Available for projects",
  score: 94,
  vouches: 27,
  refutes: 1,
  projects: 62,
  verified: true,
  about: "I build community playbooks and help teams execute them consistently.",
  feedback: [{
    type: "vouch",
    by: "Past hirer",
    text: "Aurora built our community playbook and helped the team execute it consistently."
  }, {
    type: "refute",
    by: "Past collaborator",
    text: "Aurora supported our growth campaign but did not independently manage the full marketing budget."
  }]
}, {
  id: 4,
  alias: "Forge",
  category: "Writing",
  headline: "Copywriter & Content Lead",
  skills: ["Copywriting", "SEO", "Content"],
  rate: 22,
  availability: "Available for projects",
  score: 91,
  vouches: 11,
  refutes: 1,
  projects: 38,
  verified: true,
  about: "I write clear landing-page copy and content that turns attention into action.",
  feedback: [{
    type: "vouch",
    by: "Past hirer",
    text: "Forge wrote the landing-page copy and delivered every revision we requested."
  }, {
    type: "refute",
    by: "Past collaborator",
    text: "Forge wrote the core website copy but did not lead our entire content department."
  }]
}, {
  id: 5,
  alias: "Nexus",
  category: "Operations",
  headline: "No-code Automation Expert",
  skills: ["Automation", "Zapier", "Notion"],
  rate: 25,
  availability: "Limited availability",
  score: 89,
  vouches: 7,
  refutes: 1,
  projects: 24,
  verified: false,
  about: "I automate repeatable workflows and document the setup so teams can maintain it.",
  feedback: [{
    type: "vouch",
    by: "Past hirer",
    text: "Nexus automated our onboarding workflow and documented the setup clearly."
  }, {
    type: "refute",
    by: "Past collaborator",
    text: "Nexus automated several workflows but did not build the entire operations system as claimed."
  }]
}, {
  id: 6,
  alias: "Pixel",
  category: "Marketing",
  headline: "Data Analyst",
  skills: ["Excel", "SQL", "Analytics"],
  rate: 30,
  availability: "Available for projects",
  score: 87,
  vouches: 9,
  refutes: 1,
  projects: 19,
  verified: true,
  about: "I turn raw numbers into dashboards and reports teams use to make decisions.",
  feedback: [{
    type: "vouch",
    by: "Past hirer",
    text: "Pixel built the analytics dashboard we used for our weekly reporting."
  }, {
    type: "refute",
    by: "Past collaborator",
    text: "Pixel handled the dashboard work but did not manage our entire data team as claimed."
  }]
}];
export const money = (cents: number) => new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD"
}).format(cents / 100);
export function fees(amount: number, route: HiringRoute) {
  const cents = Math.round(amount * 100),
    rate = route === "Hiring for company" ? 2.5 : 5;
  const fee = Math.round(cents * rate / 100);
  return {
    cents,
    fee,
    total: cents + fee,
    rate
  };
}
export const aliasKey = (value: string) => value.normalize("NFKC").toLowerCase().replace(/[\s._-]+/g, "");
export function safePortfolio(value: string) {
  try {
    const url = new URL(value);
    return ["https:", "http:"].includes(url.protocol) ? url.href : "";
  } catch {
    return "";
  }
}
export const walletPatterns: Record<string, RegExp> = {
  "Ethereum (EVM)": /^0x[0-9a-fA-F]{40}$/,
  Solana: /^[1-9A-HJ-NP-Za-km-z]{32,44}$/,
  Bitcoin: /^(bc1[a-z0-9]{25,60}|[13][a-km-zA-HJ-NP-Z1-9]{25,34})$/
};
export const routeTo = (view: string) => view === "home" ? "/" : `/marketplace/${view}`;
