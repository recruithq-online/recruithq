"use client";

import type { Expert } from "@/lib/experts";
import { useExperience } from "./experience-provider";

export function ExpertTags({ tags }: { tags: string[] }) {
  return (
    <div className="tags">
      {tags.map((tag) => (
        <span className="tag" key={tag}>
          {tag}
        </span>
      ))}
    </div>
  );
}

export function ReputationActions({
  expert,
  profile = false,
}: {
  expert: Expert;
  profile?: boolean;
}) {
  const { vouch, refute } = useExperience();
  return (
    <div className="vouch-row">
      <button
        className="vouch"
        onClick={() => vouch(expert.id)}
        title="Confirm you personally worked with this expert"
      >
        <span className="vouch-icon">✓</span> Vouch · {expert.vouches}
      </button>
      <button
        className="refute"
        onClick={() => refute(expert.id)}
        title="Flag a claim you can personally show is false"
      >
        ⚑ {profile ? "Refute a claim" : "Refute"}
      </button>
      <span className="small">
        {profile
          ? "Only people with genuine past-job experience should respond."
          : "past-job proof"}
      </span>
    </div>
  );
}

export function ExpertCard({ expert }: { expert: Expert }) {
  const { openModal } = useExperience();
  return (
    <article className="card">
      <div className="top">
        <div className="avatar">
          {expert.name
            .split(" ")
            .map((name) => name[0])
            .join("")}
        </div>
        <div>
          <div className="name">{expert.name}</div>
          <div className="small">{expert.role}</div>
          <div className="small">{expert.city}</div>
        </div>
      </div>
      <div className="score">
        <div>
          <div className="small">Reputation</div>
          <strong>{expert.score}/100</strong>
        </div>
        <div className="text-right">
          <div className="small">Completed</div>
          <strong>{expert.jobs}</strong>
        </div>
      </div>
      <div className="verified">
        {expert.verified ? "✓ Verified profile" : "○ Profile not yet verified"}
      </div>
      <ReputationActions expert={expert} />
      <div className="basis">
        Vouches confirm real past work. Refutes flag claims that a past
        collaborator says are false. Both can affect reputation.
      </div>
      <div className="profile-comments">
        <div>
          <b>Vouch comment:</b> “{expert.vouchesList[0].text}”
        </div>
        <div className="negative-comment">
          <b>Refute comment:</b> “{expert.refutes[0].text}”{" "}
          <span>−{expert.refutes[0].impact}</span>
        </div>
      </div>
      <ExpertTags tags={expert.tags} />
      <div className="small">
        From <b>${expert.rate}/hr</b>
      </div>
      <button
        className="cta w-full h-[42px] mt-[14px] rounded-[9px]"
        onClick={() => openModal({ type: "expert", id: expert.id })}
      >
        View profile
      </button>
    </article>
  );
}
