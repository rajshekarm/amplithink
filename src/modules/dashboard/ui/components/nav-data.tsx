import { BotIcon, VideoIcon, StarIcon, Users2, Settings } from "lucide-react";

export type NavItem = {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  href: string;
};

export const primaryNav: NavItem[] = [
  { icon: VideoIcon, label: "Meetings", href: "/meetings" },
  { icon: BotIcon, label: "Agents", href: "/agents" },
  { icon: StarIcon, label: "Prompts", href: "/prompts" },
];

export const secondaryNav: NavItem[] = [
  { icon: Users2, label: "Candidates", href: "/candidates" },
  { icon: Settings, label: "Settings", href: "/settings" },
];
