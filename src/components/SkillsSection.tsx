import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

const SkillsSection = () => {
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null);

  const skills = [
    { name: 'JavaScript', level: 90, category: 'Frontend', icon: '⚡' },
    { name: 'Node.js', level: 85, category: 'Backend', icon: '🟢' },
    { name: 'Python', level: 80, category: 'Backend', icon: '🐍' },
    { name: 'React', level: 85, category: 'Frontend', icon: '⚛️' },
    { name: 'HTML/CSS', level: 95, category: 'Frontend', icon: '🎨' },
    { name: 'System Admin', level: 90, category: 'IT Support', icon: '🖥️' },
    { name: 'Troubleshooting', level: 95, category: 'IT Support', icon: '🔧' },
    { name: 'Google Workspace', level: 90, category: 'IT Support', icon: '☁️' },
  ];

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {skills.map((skill) => (
        <div
          key={skill.name}
          className="p-4 rounded-lg border bg-card hover:bg-accent/5 transition-all duration-300 hover:scale-105"
          onMouseEnter={() => setHoveredSkill(skill.name)}
          onMouseLeave={() => setHoveredSkill(null)}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-lg">{skill.icon}</span>
              <span className="font-medium">{skill.name}</span>
            </div>
            <Badge variant="secondary">{skill.category}</Badge>
          </div>
          <Progress
            value={hoveredSkill === skill.name ? skill.level : 0}
            className="h-2 transition-all duration-1000"
          />
          <div className="text-right text-sm text-muted-foreground mt-1">
            {skill.level}%
          </div>
        </div>
      ))}
    </div>
  );
};

export default SkillsSection;
