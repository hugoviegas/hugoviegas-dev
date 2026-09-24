import { useState } from "react";
import { useLanguage } from "@/hooks/useLanguage";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  ChevronDown,
  ChevronUp,
  Zap,
  Server,
  Database,
  Monitor,
  Wrench,
  Palette,
  Code2,
  FileSpreadsheet,
  Smartphone,
  Settings,
  Search,
  Camera,
  Layers,
  LucideIcon,
} from "lucide-react";

type Category = "Development" | "Automation" | "IT Support" | "Design";

interface Skill {
  name: string;
  level: number;
  category: Category;
  icon: LucideIcon;
}

/** One colour pair per category, both themes covered. */
const CATEGORY_STYLES: Record<
  Category,
  { color: string; bg: string; border: string }
> = {
  Development: {
    color: "text-blue-700 dark:text-blue-400",
    bg: "bg-blue-500/10",
    border: "border-blue-500/30",
  },
  Automation: {
    color: "text-emerald-700 dark:text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/30",
  },
  "IT Support": {
    color: "text-purple-700 dark:text-purple-400",
    bg: "bg-purple-500/10",
    border: "border-purple-500/30",
  },
  Design: {
    color: "text-pink-700 dark:text-pink-400",
    bg: "bg-pink-500/10",
    border: "border-pink-500/30",
  },
};

const MAIN_SKILLS: Skill[] = [
  { name: "JavaScript", level: 90, category: "Development", icon: Zap },
  { name: "Node.js", level: 85, category: "Development", icon: Server },
  { name: "Google Apps Script", level: 90, category: "Automation", icon: Code2 },
  {
    name: "Google Sheets",
    level: 95,
    category: "Automation",
    icon: FileSpreadsheet,
  },
  { name: "AppSheet", level: 85, category: "Automation", icon: Smartphone },
  { name: "Incident Resolution", level: 95, category: "IT Support", icon: Wrench },
  { name: "HTML", level: 95, category: "Development", icon: Code2 },
  { name: "CSS", level: 90, category: "Development", icon: Palette },
];

const ADDITIONAL_SKILLS: Skill[] = [
  { name: "Active Directory", level: 85, category: "IT Support", icon: Monitor },
  { name: "Express.js", level: 80, category: "Development", icon: Server },
  { name: "Python", level: 75, category: "Development", icon: Code2 },
  { name: "Google Workspace", level: 90, category: "Automation", icon: Database },
  {
    name: "Hardware Maintenance",
    level: 90,
    category: "IT Support",
    icon: Settings,
  },
  {
    name: "Software Troubleshooting",
    level: 95,
    category: "IT Support",
    icon: Search,
  },
  { name: "Adobe Illustrator", level: 85, category: "Design", icon: Palette },
  { name: "Adobe Photoshop", level: 80, category: "Design", icon: Camera },
  { name: "Adobe InDesign", level: 75, category: "Design", icon: Layers },
  { name: "Photo/Video Editing", level: 80, category: "Design", icon: Camera },
];

const SkillsSection = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { t } = useLanguage();

  const renderSkill = (skill: Skill, compact = false) => {
    const style = CATEGORY_STYLES[skill.category];
    const Icon = skill.icon;

    return (
      <div key={skill.name} className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex min-w-0 items-center gap-3">
            <div
              className={`flex shrink-0 items-center justify-center rounded-xl ${style.bg} ${
                compact ? "h-8 w-8" : "h-10 w-10"
              }`}
            >
              <Icon
                className={`${compact ? "h-4 w-4" : "h-5 w-5"} ${style.color}`}
              />
            </div>
            <span
              className={`truncate font-semibold text-foreground ${
                compact ? "text-sm font-medium" : ""
              }`}
            >
              {skill.name}
            </span>
          </div>
          <div className="flex shrink-0 items-center gap-3">
            <Badge
              variant="outline"
              className={`hidden text-xs sm:inline-flex ${style.bg} ${style.color} ${style.border}`}
            >
              {t(`category.${skill.category}`)}
            </Badge>
            <span className="min-w-[2.5rem] text-right text-xs text-muted-foreground">
              {skill.level}%
            </span>
          </div>
        </div>
        <Progress
          value={skill.level}
          className={compact ? "h-2" : "h-3"}
          aria-label={`${skill.name} ${skill.level}%`}
        />
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <div className="space-y-4">
        {MAIN_SKILLS.map((skill) => renderSkill(skill))}
      </div>

      {/* Expandable extra skills */}
      <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
        <div className="glass-card p-4 md:p-6">
          <CollapsibleTrigger className="w-full rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
            <div className="flex items-center justify-between gap-3">
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary/10 to-secondary/10">
                  <Database className="h-5 w-5 text-primary" />
                </div>
                <span className="truncate font-semibold text-foreground">
                  {t("otherSkills")}
                </span>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <Badge
                  variant="outline"
                  className="hidden border-primary/30 bg-primary/10 text-xs text-primary sm:inline-flex"
                >
                  {ADDITIONAL_SKILLS.length} {t("skillsCount")}
                </Badge>
                {isExpanded ? (
                  <ChevronUp className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                )}
              </div>
            </div>
          </CollapsibleTrigger>

          <CollapsibleContent className="mt-4 space-y-4">
            {ADDITIONAL_SKILLS.map((skill) => renderSkill(skill, true))}
          </CollapsibleContent>
        </div>
      </Collapsible>
    </div>
  );
};

export default SkillsSection;
