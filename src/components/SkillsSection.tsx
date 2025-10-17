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
} from "lucide-react";

const SkillsSection = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { t } = useLanguage();

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Development":
        return {
          color: "text-blue-400",
          bg: "bg-blue-400/10",
          border: "border-blue-400/30",
        };
      case "Automation":
        return {
          color: "text-green-400",
          bg: "bg-green-400/10",
          border: "border-green-400/30",
        };
      case "IT Support":
        return {
          color: "text-purple-400",
          bg: "bg-purple-400/10",
          border: "border-purple-400/30",
        };
      case "Design":
        return {
          color: "text-pink-400",
          bg: "bg-pink-400/10",
          border: "border-pink-400/30",
        };
      default:
        return {
          color: "text-gray-400",
          bg: "bg-gray-400/10",
          border: "border-gray-400/30",
        };
    }
  };

  const mainSkills = [
    {
      name: "Active Directory",
      level: 90,
      category: "IT Support",
      icon: Monitor,
    },
    {
      name: "Google Workspace",
      level: 95,
      category: "Automation",
      icon: FileSpreadsheet,
    },
    {
      name: "Windows Server Administration",
      level: 90,
      category: "IT Support",
      icon: Server,
    },
    {
      name: "User Account Management",
      level: 95,
      category: "IT Support",
      icon: Settings,
    },
    {
      name: "Technical Troubleshooting",
      level: 95,
      category: "IT Support",
      icon: Wrench,
    },
    { name: "JavaScript", level: 85, category: "Development", icon: Zap },
    {
      name: "Node.js & Express.js",
      level: 85,
      category: "Development",
      icon: Server,
    },
    {
      name: "Google Apps Script",
      level: 90,
      category: "Automation",
      icon: Code2,
    },
  ];

  const additionalSkills = [
    {
      name: "Group Policy Management",
      level: 90,
      category: "IT Support",
      icon: Settings,
    },
    {
      name: "Linux Server Administration",
      level: 80,
      category: "IT Support",
      icon: Server,
    },
    {
      name: "Network Administration",
      level: 85,
      category: "IT Support",
      icon: Monitor,
    },
    {
      name: "System Monitoring",
      level: 85,
      category: "IT Support",
      icon: Search,
    },
    {
      name: "Hardware Maintenance",
      level: 90,
      category: "IT Support",
      icon: Wrench,
    },
    { name: "PHP", level: 80, category: "Development", icon: Code2 },
    {
      name: "MySQL Database",
      level: 85,
      category: "Development",
      icon: Database,
    },
    { name: "HTML5 & CSS3", level: 95, category: "Development", icon: Code2 },
    { name: "React.js", level: 80, category: "Development", icon: Zap },
    { name: "TypeScript", level: 75, category: "Development", icon: Code2 },
    {
      name: "Process Automation",
      level: 90,
      category: "Automation",
      icon: Zap,
    },
    {
      name: "Technical Documentation",
      level: 95,
      category: "IT Support",
      icon: FileSpreadsheet,
    },
  ];

  return (
    <div className="space-y-4">
      {/* Main Skills List */}
      <div className="space-y-4">
        {mainSkills.map((skill) => {
          const categoryStyle = getCategoryColor(skill.category);
          const IconComponent = skill.icon;

          return (
            <div key={skill.name} className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-xl ${categoryStyle.bg} flex items-center justify-center`}
                  >
                    <IconComponent
                      className={`w-5 h-5 ${categoryStyle.color}`}
                    />
                  </div>
                  <span className="font-semibold text-foreground">
                    {skill.name}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <Badge
                    className={`${categoryStyle.bg} ${categoryStyle.color} ${categoryStyle.border} text-xs`}
                  >
                    {skill.category}
                  </Badge>
                  <span className="text-sm text-foreground/60 min-w-[2.5rem] text-right">
                    {skill.level}%
                  </span>
                </div>
              </div>
              <Progress
                value={skill.level}
                className="h-3 transition-all duration-1000"
              />
            </div>
          );
        })}
      </div>

      {/* Expandable Skills Block */}
      <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
        <div className="glass rounded-2xl p-6 hover:scale-105 transition-all duration-300 hover:shadow-lg">
          <CollapsibleTrigger className="w-full">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-400/10 to-purple-400/10 flex items-center justify-center">
                  <Database className="w-5 h-5 text-blue-400" />
                </div>
                <span className="font-semibold text-foreground">
                  {t("otherSkills") || "Other Skills"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Badge className="bg-gradient-to-r from-blue-400/10 to-purple-400/10 text-blue-400 border-blue-400/30 text-xs">
                  {additionalSkills.length} skills
                </Badge>
                {isExpanded ? (
                  <ChevronUp className="w-4 h-4 text-muted-foreground" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-muted-foreground" />
                )}
              </div>
            </div>
          </CollapsibleTrigger>

          <CollapsibleContent className="space-y-4 mt-4">
            {additionalSkills.map((skill) => {
              const IconComponent = skill.icon;
              const categoryStyle = getCategoryColor(skill.category);

              return (
                <div key={skill.name} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-8 h-8 rounded-lg ${categoryStyle.bg} flex items-center justify-center`}
                      >
                        <IconComponent
                          className={`w-4 h-4 ${categoryStyle.color}`}
                        />
                      </div>
                      <span className="font-medium text-foreground text-sm">
                        {skill.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge
                        className={`${categoryStyle.bg} ${categoryStyle.color} ${categoryStyle.border} text-xs`}
                      >
                        {skill.category}
                      </Badge>
                      <span className="text-xs text-foreground/60 min-w-[2.5rem] text-right">
                        {skill.level}%
                      </span>
                    </div>
                  </div>
                  <Progress
                    value={skill.level}
                    className="h-2 transition-all duration-1000"
                  />
                </div>
              );
            })}
          </CollapsibleContent>
        </div>
      </Collapsible>
    </div>
  );
};

export default SkillsSection;
