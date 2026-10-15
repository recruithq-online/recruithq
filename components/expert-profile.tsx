"use client";

import { useState } from "react";
import type { Expert } from "@/lib/experts";
import { useExperience } from "./experience-provider";
import { ExpertTags, ReputationActions } from "./expert-card";

export function ExpertProfile({ expert }: { expert: Expert }) {
  const { closeModal, toast } = useExperience();
  const [requested, setRequested] = useState(false);
  return (
    <div>
      <button className="close" onClick={closeModal} aria-label="Close">
        ×
      </button>
      <div className="top">
        <div className="avatar">{expert.name[0]}</div>
        <div>
          <h2 className="m-0" id="profile-title">
            {expert.name}
          </h2>
          <div className="small">
            {expert.role} · {expert.city}
          </div>
          <div className="verified">
            {expert.verified
              ? "✓ Verified expertise"
              : "○ Verification pending"}
          </div>
        </div>
      </div>
      <div className="score mt-[22px]">
        {[
          ["Reputation", `${expert.score}/100`],
          ["Completed jobs", expert.jobs],
          ["Vouches", expert.vouches],
          ["Rate", `$${expert.rate}/hr`],
        ].map(([label, value]) => (
          <div key={label}>
            <div className="small">{label}</div>
            <strong>{value}</strong>
          </div>
        ))}
      </div>
      <ReputationActions expert={expert} profile />
      <div className="basis">
        <b>How reputation works:</b> Vouches add confidence when past
        collaborators confirm claimed work. Refutes can reduce reputation when a
        past collaborator disputes a claim. Repeated or supported refutes have a
        stronger effect.
      </div>
      <div className="proof">
        <h4>People from past jobs</h4>
        {expert.vouchesList.map((proof) => (
          <div className="quote" key={proof.name}>
            <b>
              {proof.name} · {proof.role}
            </b>
            <span>“{proof.text}”</span>
          </div>
        ))}
        <h4 className="mt-[14px]">Refutes &amp; disputed claims</h4>
        {expert.refutes.map((refute) => (
          <div className="quote negative" key={refute.name}>
            <b>
              {refute.name} · {refute.role}
            </b>
            <span>“{refute.text}”</span>
            <div className="impact">
              Refute impact: -{refute.impact} reputation
            </div>
          </div>
        ))}
      </div>
      <h3>About</h3>
      <p className="leading-[1.6] text-[#475467]">{expert.bio}</p>
      <h3>Expertise</h3>
      <ExpertTags tags={expert.tags} />
      <h3>Recent reviews</h3>
      {expert.reviews.map(([name, text]) => (
        <div className="review" key={name}>
          <b>{name}</b>
          <div className="mt-[5px] text-[#475467]">“{text}”</div>
        </div>
      ))}
      <button
        className="cta h-[50px] w-full mt-[18px]"
        onClick={() => {
          setRequested(true);
          toast(`Request prepared for ${expert.name}`);
        }}
      >
        Request to hire {expert.name.split(" ")[0]}
      </button>
      {requested && (
        <div className="success" role="status">
          ✓ Request sent.
        </div>
      )}
    </div>
  );
}
