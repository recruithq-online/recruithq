import type { Expert } from "./experts";

export const categories = [
  "Design",
  "Development",
  "Marketing",
  "Writing",
  "Operations",
  "Community",
];

export function toRecordExpert(expert: Expert) {
  const categoriesById: Record<number, string> = {
    1: "Design",
    2: "Development",
    3: "Community",
    4: "Writing",
    5: "Operations",
    6: "Operations",
  };
  return {
    id: expert.id,
    alias: expert.name,
    category: categoriesById[expert.id] ?? "Other",
    headline: expert.role,
    skills: expert.tags,
    about: expert.bio,
    availability:
      expert.id === 2 ? "Limited availability" : "Available for projects",
    score: expert.score,
    vouches: expert.vouches,
    refutes: expert.refutes.length,
    projects: expert.jobs,
    verified: expert.verified,
    rate: expert.rate,
    feedback: [
      ...expert.vouchesList.map((entry) => ({
        type: "vouch",
        text: entry.text,
      })),
      ...expert.refutes.map((entry) => ({ type: "refute", text: entry.text })),
    ],
  };
}

export type RecordExpert = ReturnType<typeof toRecordExpert>;
