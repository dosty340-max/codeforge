import { Gamepad2, Globe, Rocket, Smartphone, Sparkles } from "lucide-react";
import type { DivisionId } from "@/lib/agent-catalog";

type ProjectKind = {
  id: string;
  label: string;
  icon: typeof Globe;
  placeholder: string;
  examples: string[];
  divisions: DivisionId[];
};

export const projectKinds: ProjectKind[] = [
  {
    id: "website",
    label: "Create website",
    icon: Globe,
    placeholder: "Describe your website...",
    examples: ["A portfolio with a contact form", "An online store with payments", "A booking site for a barbershop"],
    divisions: ["design", "engineering", "testing"],
  },
  {
    id: "app",
    label: "Create app",
    icon: Smartphone,
    placeholder: "Describe your app...",
    examples: ["A habit tracker with reminders", "A shared shopping list app", "A workout planner with progress charts"],
    divisions: ["product", "design", "engineering", "testing"],
  },
  {
    id: "game",
    label: "Create game",
    icon: Gamepad2,
    placeholder: "Describe your game...",
    examples: ["A 2D platformer with ten levels", "A multiplayer racing game", "A daily word puzzle"],
    divisions: ["game-development", "design", "testing"],
  },
  {
    id: "startup",
    label: "Create startup",
    icon: Rocket,
    placeholder: "Describe your startup idea...",
    examples: ["A marketplace for local tutors", "An invoicing tool for freelancers", "A subscription box MVP"],
    divisions: ["product", "engineering", "marketing", "sales"],
  },
  {
    id: "anything",
    label: "Create anything",
    icon: Sparkles,
    placeholder: "Describe what you want to build...",
    examples: ["A mobile app for my gym", "A browser game for kids", "A landing page for my startup"],
    divisions: [],
  },
];

export function getProjectKind(id: string | null) {
  return projectKinds.find((kind) => kind.id === id) ?? projectKinds[projectKinds.length - 1];
}
