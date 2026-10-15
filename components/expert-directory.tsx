"use client";

import { useState } from "react";
import { skills } from "@/lib/experts";
import { useExperience } from "./experience-provider";
import { ExpertCard } from "./expert-card";

export function ExpertDirectory() {
  const { experts, query } = useExperience();
  const [active, setActive] = useState("All");
  const list = experts
    .filter(
      (expert) =>
        (active === "All" || expert.tags.includes(active)) &&
        `${expert.name} ${expert.role} ${expert.city} ${expert.tags.join(" ")}`
          .toLowerCase()
          .includes(query.toLowerCase()),
    )
    .sort((a, b) => b.score - a.score);
  return (
    <main className="wrap product-faded" id="experts">
      <div className="row section-head">
        <div>
          <h2>Trusted experts</h2>
          <div
            className="small mt-[5px] text-[#6b7890]"
            id="count"
            aria-live="polite"
          >
            {list.length} {list.length <= 1 ? "expert" : "experts"} found
          </div>
          <div className="small mt-1">
            Alias-only profiles · real names are not required
          </div>
        </div>
        <div className="small">Sorted by reputation</div>
      </div>
      <div
        className="filters flex gap-[7px] flex-wrap mt-[22px] mb-5"
        id="filters"
      >
        {skills.map((skill) => (
          <button
            className={`chip${active === skill ? " active" : ""}`}
            key={skill}
            aria-pressed={active === skill}
            onClick={() => setActive(skill)}
          >
            {skill}
          </button>
        ))}
      </div>
      <div
        className="expert-grid grid grid-cols-3 gap-[14px] max-[800px]:grid-cols-2 max-[560px]:grid-cols-1"
        id="grid"
      >
        {list.length ? (
          list.map((expert) => <ExpertCard key={expert.id} expert={expert} />)
        ) : (
          <div className="col-span-full p-10 text-center text-muted">
            No experts matched that search.
            <br />
            <br />
            Try another skill.
          </div>
        )}
      </div>
    </main>
  );
}
