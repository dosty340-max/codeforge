import type { Metadata } from "next";
import { LegalPage, type LegalSection } from "@/components/legal/legal-page";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "The terms for using AgentWe.",
};

const sections: LegalSection[] = [
  {
    title: "The service",
    paragraphs: [
      "AgentWe lets you plan and follow software projects built by AI agents. The agents run in an AI tool you connect, such as Claude Code, Claude, ChatGPT or Codex.",
      "AgentWe is independent. It is not affiliated with or endorsed by Anthropic or OpenAI.",
    ],
  },
  {
    title: "Your account",
    paragraphs: [
      "You must be at least 16. Keep your sign-in details safe and give correct information. You are responsible for what happens under your account.",
    ],
  },
  {
    title: "Your AI tool",
    paragraphs: [
      "You need your own account with the AI tool you connect. Its provider's terms and charges apply, and AgentWe does not pay for or charge for that usage.",
    ],
  },
  {
    title: "Your content and results",
    paragraphs: [
      "What you put into AgentWe and the results of your projects stay yours, as far as the law allows. You give us permission to store and show them only so that we can run the service for you.",
      "Do not use AgentWe to break the law, harm others, infringe other people's rights or attack the service.",
    ],
  },
  {
    title: "AI can make mistakes",
    paragraphs: [
      "AI agents can produce wrong, insecure or incomplete work, even when a check passes. Review results before you rely on them or publish them. You are responsible for what you do with them.",
    ],
  },
  {
    title: "Plans and payments",
    paragraphs: [
      "The Free plan costs nothing. Pro payments are not open yet. Before you can pay, we will show the final price, including any tax, and the terms for renewal, cancellation and consumer rights.",
    ],
  },
  {
    title: "Agent catalog",
    paragraphs: ["The agent catalog is based on the open-source Agency Agents project under the MIT License."],
  },
  {
    title: "Availability and liability",
    paragraphs: [
      "We work to keep AgentWe running, but we cannot promise it will always be available or free of errors. We are liable only as far as the law requires, and nothing here limits rights that the law gives consumers and that cannot be waived.",
    ],
  },
  {
    title: "Ending your use",
    paragraphs: [
      "You can stop using AgentWe at any time and ask us to delete your account. We can suspend accounts that seriously break these terms.",
    ],
  },
  {
    title: "Law and changes",
    paragraphs: [
      "These terms are governed by Czech law. If you are a consumer, you also keep the mandatory protections of the country where you live.",
      "If we change these terms, we will update the date above and tell you about important changes.",
    ],
  },
];

export default function TermsPage() {
  return <LegalPage title="Terms of Service" sections={sections} />;
}
