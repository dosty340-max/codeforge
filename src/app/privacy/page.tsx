import type { Metadata } from "next";
import { LegalPage, type LegalSection } from "@/components/legal/legal-page";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "What personal data AgentWe collects, why, and what rights you have.",
};

const sections: LegalSection[] = [
  {
    title: "What we collect",
    paragraphs: [
      "Account: your name, email address and password. The password is stored only in hashed form.",
      "Projects: descriptions, tasks, shared memory, results, activity logs and the usage numbers your AI tool reports.",
      "Connection: the time your AI tool last connected to AgentWe.",
      "Browser: cookies that keep you signed in, and your choices of folder, models and AI tool, which stay in your browser. We use no advertising cookies.",
      "Technical logs: our hosting providers process data such as IP addresses to deliver and protect the service.",
      "We never receive your Claude or ChatGPT password or credentials.",
    ],
  },
  {
    title: "Why we use it",
    paragraphs: [
      "To provide the service you signed up for, which is performance of a contract under Article 6(1)(b) of the GDPR.",
      "To keep the service secure and working and to prevent abuse, which is our legitimate interest under Article 6(1)(f) of the GDPR.",
      "We do not sell your personal data or use it for advertising.",
    ],
  },
  {
    title: "Who else handles your data",
    paragraphs: [
      "Supabase provides our database, sign-in and account emails. Vercel hosts the website. They process data for us as our processors.",
      "These providers may process data outside the European Economic Area. In that case we rely on the safeguards they offer, such as standard contractual clauses.",
      "When you connect an AI tool such as Claude, Claude Code, ChatGPT or Codex, what it reads and writes through AgentWe also goes to its provider under that provider's own terms.",
      "If you create a share link, anyone who has the link can see the shared results until you stop sharing.",
    ],
  },
  {
    title: "How long we keep it",
    paragraphs: [
      "We keep your account and projects until you delete them or ask us to delete your account. We then delete them within one month, unless the law requires us to keep something longer.",
    ],
  },
  {
    title: "Your rights",
    paragraphs: [
      "You can ask for access to your data, correction, deletion, restriction of processing and a portable copy, and you can object to processing based on legitimate interest. Write to the email address above.",
      "You can also complain to the Czech Office for Personal Data Protection (uoou.gov.cz) or your local supervisory authority.",
    ],
  },
  {
    title: "Age",
    paragraphs: ["AgentWe is not meant for people under 16."],
  },
  {
    title: "Changes",
    paragraphs: ["If we change this policy, we will update the date above and tell you about important changes."],
  },
];

export default function PrivacyPage() {
  return <LegalPage title="Privacy Policy" sections={sections} />;
}
