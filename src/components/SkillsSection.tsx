import { useState } from "react";
import { useLanguage } from "@/hooks/useLanguage";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown, ChevronUp } from "lucide-react";

const SkillsSection = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  const mainSkills = [
    { name: "JavaScript", level: 90, category: "Development", icon: "⚡" },
    { name: "Node.js", level: 85, category: "Development", icon: "🟢" },
    {
      name: "Google Apps Script",
      level: 90,
      category: "Automation",
      icon: "📊",
    },
    { name: "Google Sheets", level: 95, category: "Automation", icon: "📋" },
    { name: "AppSheet", level: 85, category: "Automation", icon: "📱" },
    { name: "Active Directory", level: 85, category: "IT Support", icon: "🖥️" },
    {
      name: "Incident Resolution",
      level: 95,
      category: "IT Support",
      icon: "🔧",
    },
    { name: "HTML", level: 95, category: "Development", icon: "🎨" },
    { name: "CSS", level: 90, category: "Development", icon: "🎨" },
  ];

  const additionalSkills = [
    { name: "Express.js", level: 80, category: "Development", icon: "🚀" },
    { name: "Python", level: 75, category: "Development", icon: "🐍" },
    { name: "Google Workspace", level: 90, category: "Automation", icon: "☁️" },
    {
      name: "Hardware Maintenance",
      level: 90,
      category: "IT Support",
      icon: "⚙️",
    },
    {
      name: "Software Troubleshooting",
      level: 95,
      category: "IT Support",
      icon: "🔍",
    },
    { name: "Adobe Illustrator", level: 85, category: "Design", icon: "🎭" },
    { name: "Adobe Photoshop", level: 80, category: "Design", icon: "🖼️" },
    { name: "Adobe InDesign", level: 75, category: "Design", icon: "📄" },
    { name: "Photo/Video Editing", level: 80, category: "Design", icon: "📹" },
  ];

  return (
    <div className="grid md:grid-cols-2 gap-6">
  {/* Heading could be translated where used */}
      {mainSkills.map((skill) => (
        <div
          key={skill.name}
          className="p-4 rounded-lg border bg-card hover:bg-accent/5 transition-all duration-300 hover:scale-105"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-lg">{skill.icon}</span>
              <span className="font-medium">{skill.name}</span>
            </div>
            <Badge className="bg-primary/10 text-primary border-primary/30">
              {skill.category}
            </Badge>
          </div>
          <Progress
            value={skill.level}
            className="h-2 transition-all duration-1000"
          />
          <div className="text-right text-sm text-muted-foreground mt-1">
            {skill.level}%
          </div>
        </div>
      ))}

      {/* Expandable Skills Block */}
      <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
        <div className="p-4 rounded-lg border bg-card hover:bg-accent/5 transition-all duration-300 hover:scale-105">
          <CollapsibleTrigger className="w-full">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-lg">📚</span>
                <span className="font-medium">More Skills</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge className="bg-secondary/10 text-secondary border-secondary/30">
                  {additionalSkills.length} more
                </Badge>
                {isExpanded ? (
                  <ChevronUp className="w-4 h-4 text-muted-foreground" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-muted-foreground" />
                )}
              </div>
            </div>
          </CollapsibleTrigger>

          <CollapsibleContent className="space-y-3 mt-4">
            {additionalSkills.map((skill) => (
              <div
                key={skill.name}
                className="flex items-center justify-between p-2 rounded-md bg-muted/30"
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm">{skill.icon}</span>
                  <span className="text-sm font-medium">{skill.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    {skill.category}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {skill.level}%
                  </span>
                </div>
              </div>
            ))}
          </CollapsibleContent>
        </div>
      </Collapsible>
    </div>
  );
};

export default SkillsSection;
