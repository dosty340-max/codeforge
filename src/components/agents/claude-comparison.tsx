import { Check, Minus } from "lucide-react";

const options = [
  {
    name: "Claude Code",
    badge: "Recommended for full builds",
    featured: true,
    points: [
      { text: "Works directly on your project files", included: true },
      { text: "Specialists run side by side", included: true },
      { text: "Runs real builds and tests", included: true },
      { text: "Needs a one-line setup", included: false },
    ],
  },
  {
    name: "Claude on the web or desktop",
    badge: "Best for planning and smaller work",
    featured: false,
    points: [
      { text: "Nothing to install", included: true },
      { text: "Same dashboard, memory and sharing", included: true },
      { text: "One Claude takes each role in turn", included: false },
      { text: "Results in the conversation, with limited testing", included: false },
    ],
  },
];

export function ClaudeComparison() {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {options.map((option) => (
        <div
          key={option.name}
          className={`rounded-xl border p-5 ${option.featured ? "border-lime/40 bg-lime/5" : "border-border bg-card"}`}
        >
          <p className="text-sm font-semibold">{option.name}</p>
          <p className={`mt-0.5 text-xs ${option.featured ? "text-lime" : "text-muted-foreground"}`}>{option.badge}</p>
          <ul className="mt-4 space-y-2">
            {option.points.map((point) => (
              <li key={point.text} className="flex gap-2 text-xs leading-relaxed text-muted-foreground">
                {point.included ? (
                  <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-lime" aria-label="Included" />
                ) : (
                  <Minus className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-label="Limitation" />
                )}
                {point.text}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
