export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
}

// The team and wording from the client's latest approved HTML.
export const team: TeamMember[] = [
  {
    id: "gemhunter",
    name: "gemhunter",
    role: "Founder",
    bio: "Building rEcruit as a marketplace where reputation and demonstrated expertise matter. Has worked in the industry for the last 10 years, with a background in creative management, product development, among others.",
  },
];
