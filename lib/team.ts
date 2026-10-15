export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  image: string;
  imageAlt: string;
}

// Replace these local placeholders with the team's own portraits and details.
export const team: TeamMember[] = [
  {
    id: "gemhunter",
    name: "gemhunter",
    role: "Founder",
    bio: "Building rEcruithq as a marketplace where reputation and demonstrated expertise matter.",
    image: "/team/gemhunter-placeholder.svg",
    imageAlt: "Portrait placeholder for gemhunter",
  },
  ...[2, 3, 4].map((number) => ({
    id: `team-member-${number}`,
    name: `Team member ${number}`,
    role: "Role to be added",
    bio: "Profile details coming soon.",
    image: `/team/member-${number}-placeholder.svg`,
    imageAlt: `Portrait placeholder for team member ${number}`,
  })),
];
