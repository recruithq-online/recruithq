"use client";

export function InfoList() {
  return (
    <div className="grid gap-6">
      {[
        [
          "Lead with what you do",
          "Make your service and strongest skills easy to understand.",
        ],
        [
          "Show useful proof",
          "Add portfolio links and project outcomes where possible.",
        ],
        [
          "Build reputation over time",
          "Collect contextual feedback from people who have worked with you.",
        ],
        [
          "Stay in control",
          "Use a public alias and share only the information you want clients to see.",
        ],
      ].map(([title, description]) => (
        <div key={title} className="flex items-start gap-3">
          <div className="grid size-7 shrink-0 place-items-center rounded-control text-brand">
            ✓
          </div>
          <div>
            <strong className="mb-1 block text-sm font-medium">{title}</strong>
            <span className="block text-sm leading-7">{description}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
