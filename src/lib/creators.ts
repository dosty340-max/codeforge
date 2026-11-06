import {
  Bot,
  Box,
  Code,
  FlaskConical,
  Gamepad2,
  Globe,
  Megaphone,
  PenTool,
  Puzzle,
  Rocket,
  Search,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Target,
  Workflow,
  type LucideIcon,
} from "lucide-react";

export type CreatorOption = { label: string; values: string[] };

export type Creator = {
  id: string;
  label: string;
  noun: string;
  headline: [string, string];
  tagline: string;
  placeholder: string;
  options: CreatorOption[];
  ideas: string[];
  output: { label: string; icon: LucideIcon };
  team: { name: string; icon: LucideIcon }[];
};

export const creators: Creator[] = [
  {
    id: "website",
    label: "Website Creator",
    noun: "Website",
    headline: ["Website creator.", "Live, not just designed."],
    tagline: "Describe the site you need. Your team plans, builds and checks it, page by page.",
    placeholder: "A booking site for my barbershop with online payments...",
    options: [
      { label: "Type", values: ["Business site", "Online store", "Portfolio", "Blog", "Landing page"] },
      { label: "Style", values: ["Minimal", "Bold", "Elegant", "Playful"] },
    ],
    ideas: [
      "A booking site for a barbershop with online payments",
      "An online store for handmade jewelry",
      "A photographer portfolio with a contact form",
      "A restaurant site with a menu and reservations",
    ],
    output: { label: "Your website", icon: Globe },
    team: [
      { name: "UI Designer", icon: PenTool },
      { name: "Frontend Developer", icon: Code },
      { name: "Backend Architect", icon: Box },
      { name: "SEO Specialist", icon: Search },
      { name: "Accessibility Auditor", icon: FlaskConical },
    ],
  },
  {
    id: "app",
    label: "App Creator",
    noun: "App",
    headline: ["App creator.", "From idea to your phone."],
    tagline: "Describe what your app should do. Your team designs, builds and tests every screen.",
    placeholder: "A habit tracker with reminders and weekly progress charts...",
    options: [
      { label: "Platform", values: ["iPhone", "Android", "iPhone and Android", "Web app", "Desktop"] },
      { label: "Accounts", values: ["With sign-in", "No sign-in"] },
    ],
    ideas: [
      "A habit tracker with reminders and weekly charts",
      "A shared shopping list for families",
      "A workout planner with progress tracking",
      "A budget app that sorts my spending",
    ],
    output: { label: "Your app", icon: Smartphone },
    team: [
      { name: "UX Architect", icon: PenTool },
      { name: "Mobile App Builder", icon: Smartphone },
      { name: "Backend Architect", icon: Box },
      { name: "Mobile Release Engineer", icon: Rocket },
      { name: "API Tester", icon: FlaskConical },
    ],
  },
  {
    id: "game",
    label: "Game Creator",
    noun: "Game",
    headline: ["Game creator.", "From idea to playable."],
    tagline: "Describe the game you want to play. Your team builds the mechanics, levels and polish.",
    placeholder: "A 2D platformer where a fox collects stars across ten levels...",
    options: [
      { label: "Engine", values: ["Browser", "Unity", "Godot", "Unreal", "Roblox"] },
      { label: "Look", values: ["2D", "3D", "Pixel art"] },
    ],
    ideas: [
      "A 2D platformer with ten levels and a boss fight",
      "A multiplayer racing game with custom cars",
      "A daily word puzzle with shareable scores",
      "A tower defense game for the browser",
    ],
    output: { label: "Your game", icon: Gamepad2 },
    team: [
      { name: "Game Designer", icon: Gamepad2 },
      { name: "Level Designer", icon: PenTool },
      { name: "Godot Gameplay Scripter", icon: Code },
      { name: "Game Audio Engineer", icon: Sparkles },
      { name: "Reality Checker", icon: FlaskConical },
    ],
  },
  {
    id: "startup",
    label: "Startup Creator",
    noun: "Startup",
    headline: ["Startup creator.", "From idea to first customers."],
    tagline: "Describe your idea. Your team shapes the product, builds the first version and prepares the launch.",
    placeholder: "A marketplace that connects students with local tutors...",
    options: [
      { label: "First step", values: ["Working product", "Landing page and waitlist", "Pitch and plan"] },
      { label: "Revenue", values: ["Subscription", "Marketplace fee", "One-time payment"] },
    ],
    ideas: [
      "A marketplace that connects students with local tutors",
      "An invoicing tool for freelancers",
      "A subscription box for specialty coffee",
      "A scheduling tool for small salons",
    ],
    output: { label: "Your startup", icon: Rocket },
    team: [
      { name: "Product Manager", icon: Target },
      { name: "Rapid Prototyper", icon: Code },
      { name: "Business Strategist", icon: Sparkles },
      { name: "Pricing Analyst", icon: Search },
      { name: "Growth Hacker", icon: Megaphone },
    ],
  },
  {
    id: "agent",
    label: "AI Agent Creator",
    noun: "AI agent",
    headline: ["AI agent creator.", "Give the job to an agent."],
    tagline: "Describe the work you want handled. Your team builds an agent that does it and tests it on real cases.",
    placeholder: "An agent that answers customer emails from my help docs...",
    options: [{ label: "Works in", values: ["Claude Code", "Slack", "Email", "Website chat"] }],
    ideas: [
      "An agent that answers customer emails from my help docs",
      "A research agent that writes a weekly market summary",
      "A Slack bot that answers questions about our company",
      "An agent that reviews contracts and flags risks",
    ],
    output: { label: "Your AI agent", icon: Bot },
    team: [
      { name: "Multi-Agent Systems Architect", icon: Workflow },
      { name: "Prompt Engineer", icon: PenTool },
      { name: "RAG Pipeline Engineer", icon: Box },
      { name: "MCP Builder", icon: Code },
      { name: "Model QA Specialist", icon: FlaskConical },
    ],
  },
  {
    id: "automation",
    label: "Automation Creator",
    noun: "Automation",
    headline: ["Automation creator.", "Stop doing it by hand."],
    tagline: "Describe the repetitive task. Your team connects the tools and checks that it runs reliably.",
    placeholder: "Every new order goes into a spreadsheet and sends me a summary...",
    options: [{ label: "Starts", values: ["On a schedule", "From a new email", "From a form", "From a webhook"] }],
    ideas: [
      "Send new orders to a spreadsheet and a daily summary",
      "Turn form answers into calendar bookings",
      "Back up important files every night",
      "Collect invoices from email into one folder",
    ],
    output: { label: "Your automation", icon: Workflow },
    team: [
      { name: "Workflow Architect", icon: Workflow },
      { name: "DevOps Automator", icon: Code },
      { name: "API Platform Engineer", icon: Box },
      { name: "Automation Governance Architect", icon: ShieldCheck },
      { name: "Test Automation Engineer", icon: FlaskConical },
    ],
  },
  {
    id: "extension",
    label: "Extension Creator",
    noun: "Extension",
    headline: ["Extension creator.", "Add what your tools are missing."],
    tagline: "Describe the feature you wish you had. Your team builds and tests the extension.",
    placeholder: "A Chrome extension that summarizes any article I open...",
    options: [{ label: "For", values: ["Chrome", "Firefox", "VS Code", "Figma"] }],
    ideas: [
      "A Chrome extension that summarizes any article",
      "A VS Code extension that explains selected code",
      "A Figma plugin that checks color contrast",
      "A Firefox add-on that blocks distracting sites",
    ],
    output: { label: "Your extension", icon: Puzzle },
    team: [
      { name: "UX Architect", icon: PenTool },
      { name: "Frontend Developer", icon: Code },
      { name: "Developer Tooling Engineer", icon: Puzzle },
      { name: "Application Security Engineer", icon: ShieldCheck },
      { name: "API Tester", icon: FlaskConical },
    ],
  },
  {
    id: "anything",
    label: "Create Anything",
    noun: "Project",
    headline: ["Describe it.", "Your team builds it."],
    tagline: "Any software you can describe. The Brain plans the work and picks the right specialists.",
    placeholder: "Describe what you want to build...",
    options: [],
    ideas: [
      "A mobile app for my gym with class bookings",
      "A browser game for kids that teaches math",
      "A landing page for my startup",
      "A dashboard that tracks my business numbers",
    ],
    output: { label: "Your project", icon: Sparkles },
    team: [
      { name: "Software Architect", icon: Workflow },
      { name: "UI Designer", icon: PenTool },
      { name: "Senior Developer", icon: Code },
      { name: "Code Reviewer", icon: ShieldCheck },
      { name: "Reality Checker", icon: FlaskConical },
    ],
  },
];

export function creatorHref(creator: Creator, idea?: string) {
  const params = new URLSearchParams({
    ...(creator.id !== "anything" && { type: creator.id }),
    ...(idea && { idea }),
  }).toString();
  return params ? `/create?${params}` : "/create";
}

export function getCreator(id: string | null) {
  return creators.find((creator) => creator.id === id) ?? creators[creators.length - 1];
}
